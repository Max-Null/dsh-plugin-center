/**
 * Plugin-center engine: the process-local composition of metadata, market,
 * and update detection. Read-only over the Loader except install/update, which
 * delegate to pnpm (mirroring `dsh plugin add`). The market catalog is fetched
 * in batches behind a process-local cache, so listMarket returns what is ready
 * so far and the client waterfalls until done.
 */
import { Service } from '@deepseek-ai/cordis';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync, readFileSync } from 'node:fs';
import { buildInstalledPlugin, clearPackageCache, resolvePackage } from "./meta.js";
import { fetchAwesomePluginsJson, fetchDshMarketPlugins, fetchOhMyDshOverrides, fetchOhMyDshPlugins, mapConcurrent, mergePlugins, } from "./market.js";
import { detectUpdate, installPlugin, updatePlugin } from "./update.js";
import { reconcileInstalled, readDependencyKeys } from "./reconcile.js";
import { readDisabledState, setDisabled } from "./toggle.js";
/** Runtime mirror of cordis FiberState (a cross-package const enum). */
const FIBER_PHASE = {
    0: 'pending',
    1: 'loading',
    2: 'active',
    3: 'failed',
    4: null,
    5: 'unloading',
};
/** Sources that participate in update detection (official/builtin follow DSH itself). */
const UPDATABLE = new Set(['installed', 'local']);
/**
 * Extract the first image URL from a plugin's README (P2 screenshots):
 * markdown or HTML image syntax, relative paths resolved against the raw
 * branch root; only GitHub-hosted images are accepted.
 */
async function extractFirstImage(repo) {
    for (const branch of ['HEAD', 'master', 'main']) {
        try {
            const res = await fetch(`https://raw.githubusercontent.com/${repo}/${branch}/README.md`, {
                signal: AbortSignal.timeout(12000),
            });
            if (!res.ok)
                continue;
            const text = await res.text();
            const markdown = /!\[[^\]]*\]\(([^)]+)\)/u.exec(text);
            const html = /<img[^>]+src=["']([^"']+)["']/iu.exec(text);
            const raw = markdown?.[1] ?? html?.[1];
            if (raw === undefined || raw === '')
                continue;
            const url = /^https?:\/\//u.test(raw)
                ? raw
                : `https://raw.githubusercontent.com/${repo}/${branch}/${raw.replace(/^\.?\//u, '')}`;
            if (/^https:\/\/(raw\.)?githubusercontent\.com\//u.test(url))
                return url;
            if (/^https:\/\/github\.com\//u.test(url)) {
                return url.replace(/^https:\/\/github\.com\/(.+?)\/blob\//u, 'https://raw.githubusercontent.com/$1/');
            }
        }
        catch { /* try next branch */ }
    }
    return null;
}
export class PluginCenterEngine extends Service {
    static inject = ['loader'];
    awesomeCache = [];
    awesomeDone = false;
    awesomeFetching = false;
    /** 上次 fetch 失败时刻（0=未失败过）：失败后冷却 60s 再重试，
     *  防止瞬时网络故障让源永久失效（2026-08-22 dsh-market（0）实测）。 */
    awesomeFailedAt = 0;
    ohMyDshCache = [];
    ohMyDshDone = false;
    ohMyDshFetching = false;
    ohMyDshFailedAt = 0;
    dshMarketCache = [];
    dshMarketDone = false;
    dshMarketFetching = false;
    dshMarketFailedAt = 0;
    /** README-extracted screenshot URL per plugin name (lazy, P2). */
    screenshotCache = new Map();
    installedNamesCache = null;
    updatesCache = null;
    updatesTtlMs = 5 * 60_000;
    /** 串行链：同 profile 的 pnpm 调用禁止并发（并发 add 会撞 store 锁/写坏 lock）。 */
    pnpmChain = Promise.resolve();
    constructor(ctx) {
        super(ctx, 'pluginCenter');
        // Warm caches in the background once the host is up, so opening the panel
        // hits preloaded data instead of fetching on first paint. The loader is
        // already settled (injected dependency), so entries() is complete here.
        void this.warmup();
    }
    /** Background preload of market + installed metadata; failures fall back to lazy load. */
    async warmup() {
        try {
            await this.listInstalled();
        }
        catch { /* listInstalled is re-run on demand */ }
        this.prefetchAwesome();
        this.prefetchOhMyDsh();
        this.prefetchDshMarket();
    }
    /** The profile directory (cordis.yml anchor) — the resolution and install cwd. */
    get baseUrl() {
        if (this.ctx.baseUrl === undefined) {
            throw new Error('plugin-center: ctx.baseUrl is unset — the host needs the profile anchor');
        }
        const raw = this.ctx.baseUrl;
        // ctx.baseUrl is a file:// URL; createRequire and pnpm need a plain path.
        return raw.startsWith('file://') ? fileURLToPath(raw) : raw;
    }
    /** DSH home directory, for the read-mark persistence file. */
    get dshHome() {
        const env = process.env.DSH_HOME;
        if (env !== undefined && env !== '')
            return env;
        return dirname(dirname(this.baseUrl)); // baseUrl = …/profiles/<name> → …/
    }
    get readVersionsPath() {
        return join(this.dshHome, 'plugin-center-read-versions.json');
    }
    /** Durable read-mark: which plugin version the user has already seen. */
    async readVersions() {
        try {
            return JSON.parse(await readFile(this.readVersionsPath, 'utf8'));
        }
        catch {
            return {};
        }
    }
    /** Persist the read-mark (best-effort; a quota/IO failure just loses the mark). */
    async markRead(versions) {
        try {
            const path = this.readVersionsPath;
            await mkdir(dirname(path), { recursive: true });
            await writeFile(path, JSON.stringify(versions), 'utf8');
        }
        catch { /* best-effort */ }
    }
    /** Current DSH version, read from the installed @deepseek-ai/dsh package. */
    async dshVersion() {
        const resolved = await resolvePackage(this.baseUrl, '@deepseek-ai/dsh');
        return resolved?.pkg.version ?? '0.0.0';
    }
    /** Non-group Loader entries, cross-matched with market categories. */
    async listInstalled() {
        const views = [];
        for (const entry of this.ctx.loader.entries()) {
            if (entry.options.group)
                continue;
            views.push({
                id: entry.id,
                name: entry.options.name,
                disabled: entry.disabled,
                fiberPhase: entry.fiber === undefined ? null : FIBER_PHASE[entry.fiber.state],
            });
        }
        const categoryByName = new Map(mergePlugins([this.awesomeCache, this.ohMyDshCache]).map(m => [m.name, m.categories]));
        const plugins = await Promise.all(views.map(v => buildInstalledPlugin(this.baseUrl, v)));
        // Sort local dev first, then third-party installs, then official, then builtin.
        const SOURCE_ORDER = { local: 0, installed: 1, official: 2, builtin: 3 };
        return plugins
            .map(p => ({ ...p, categories: categoryByName.get(p.name) ?? [] }))
            .sort((a, b) => SOURCE_ORDER[a.source] - SOURCE_ORDER[b.source]);
    }
    /** Start the awesome catalog fetch (with failed-retry cooldown). */
    prefetchAwesome() {
        if (this.awesomeFetching)
            return;
        if (this.awesomeDone && this.awesomeCache.length > 0)
            return;
        if (this.awesomeDone && Date.now() - this.awesomeFailedAt < 60_000)
            return;
        this.awesomeFetching = true;
        this.awesomeDone = false;
        void (async () => {
            try {
                const [plugins, overrides] = await Promise.all([fetchAwesomePluginsJson(), fetchOhMyDshOverrides()]);
                const merged = mergePlugins([plugins]).map((p) => {
                    const override = overrides[p.name];
                    return override?.category !== undefined && override.category !== ''
                        ? { ...p, categories: [...new Set([...p.categories, override.category])] }
                        : p;
                });
                this.awesomeCache = merged;
                await this.fillNpmVersions();
            }
            catch {
                this.awesomeFailedAt = Date.now();
            }
            this.awesomeDone = true;
            this.awesomeFetching = false;
        })();
    }
    /** Backfill npm latest versions into the awesome cache (best-effort, concurrent). */
    async fillNpmVersions() {
        const targets = this.awesomeCache.filter(p => p.npm !== null);
        if (targets.length === 0)
            return;
        const versions = await mapConcurrent(targets.map(p => p.npm), 50, this.fastNpmVersion);
        const versionByNpm = new Map();
        targets.forEach((p, i) => {
            const version = versions[i] ?? null;
            if (version !== null)
                versionByNpm.set(p.npm, version);
        });
        this.awesomeCache = this.awesomeCache.map(p => p.npm !== null && versionByNpm.has(p.npm) ? { ...p, version: versionByNpm.get(p.npm) } : p);
    }
    /** Single-registry latest version for the market bulk backfill (npmmirror is fast). */
    async fastNpmVersion(name) {
        try {
            const res = await fetch(`https://registry.npmmirror.com/${name}/latest`, {
                signal: AbortSignal.timeout(5000),
            });
            if (!res.ok)
                return null;
            return (await res.json()).version ?? null;
        }
        catch {
            return null;
        }
    }
    /** Start the Oh-My-DSH fetch (single PLUGINS.md parse, with failed-retry cooldown). */
    prefetchOhMyDsh() {
        if (this.ohMyDshFetching)
            return;
        if (this.ohMyDshDone && this.ohMyDshCache.length > 0)
            return;
        if (this.ohMyDshDone && Date.now() - this.ohMyDshFailedAt < 60_000)
            return;
        this.ohMyDshFetching = true;
        this.ohMyDshDone = false;
        void (async () => {
            try {
                this.ohMyDshCache = mergePlugins([await fetchOhMyDshPlugins()]);
            }
            catch {
                this.ohMyDshFailedAt = Date.now();
            }
            this.ohMyDshDone = true;
            this.ohMyDshFetching = false;
        })();
    }
    /** Start the dsh-market fetch (2BingLing/dsh-market, ~3900 plugins, trimmed, with failed-retry cooldown). */
    prefetchDshMarket() {
        if (this.dshMarketFetching)
            return;
        if (this.dshMarketDone && this.dshMarketCache.length > 0)
            return;
        if (this.dshMarketDone && Date.now() - this.dshMarketFailedAt < 60_000)
            return;
        this.dshMarketFetching = true;
        this.dshMarketDone = false;
        void (async () => {
            try {
                this.dshMarketCache = mergePlugins([await fetchDshMarketPlugins()]);
            }
            catch {
                this.dshMarketFailedAt = Date.now();
            }
            this.dshMarketDone = true;
            this.dshMarketFetching = false;
        })();
    }
    /** Installed plugin names (no file IO) — cached so market polling stays cheap. */
    async installedNames() {
        if (this.installedNamesCache !== null)
            return this.installedNamesCache;
        const names = new Set();
        for (const entry of this.ctx.loader.entries()) {
            if (!entry.options.group)
                names.add(entry.options.name);
        }
        this.installedNamesCache = names;
        return names;
    }
    /** Market snapshot for one source: what is cached so far, plus whether done. */
    async listMarket(source = 'all') {
        const installedNames = await this.installedNames();
        const decorate = (plugins) => plugins.map(p => ({ ...p, installed: installedNames.has(p.name) || installedNames.has(p.spec) }));
        if (source === 'awesome') {
            this.prefetchAwesome();
            return { plugins: decorate(this.awesomeCache), done: this.awesomeDone && this.awesomeCache.length > 0 };
        }
        if (source === 'oh-my-dsh') {
            this.prefetchOhMyDsh();
            return { plugins: decorate(this.ohMyDshCache), done: this.ohMyDshDone && this.ohMyDshCache.length > 0 };
        }
        if (source === 'dsh-market') {
            this.prefetchDshMarket();
            // Score-first order (best first) so the big catalog reads usefully.
            return {
                plugins: decorate(this.dshMarketCache).sort((a, b) => (b.score?.total ?? 0) - (a.score?.total ?? 0)),
                done: this.dshMarketDone && this.dshMarketCache.length > 0,
            };
        }
        this.prefetchAwesome();
        this.prefetchOhMyDsh();
        this.prefetchDshMarket();
        return {
            plugins: decorate(mergePlugins([this.awesomeCache, this.ohMyDshCache, this.dshMarketCache])),
            done: (this.awesomeDone && this.awesomeCache.length > 0)
                && (this.ohMyDshDone && this.ohMyDshCache.length > 0)
                && (this.dshMarketDone && this.dshMarketCache.length > 0),
        };
    }
    /** Detect updates for every installed third-party/local plugin, TTL-cached. */
    async checkUpdates(sinceIso) {
        const now = Date.now();
        const hit = this.updatesCache;
        if (hit !== null && hit.since === sinceIso && now - hit.at < this.updatesTtlMs)
            return hit.digests;
        const [installed, localDsh] = await Promise.all([this.listInstalled(), this.dshVersion()]);
        const candidates = installed.filter(p => UPDATABLE.has(p.source) && p.version !== null);
        const digests = await Promise.all(candidates.map(p => detectUpdate(p.name, p.version, p.repoUrl, p.compatRange, localDsh, sinceIso)));
        this.updatesCache = { since: sinceIso, at: now, digests: digests.filter((d) => d !== null) };
        return this.updatesCache.digests;
    }
    async install(spec) {
        return this.enqueuePnpm(async () => {
            // Snapshot inside the serialized chain: concurrent installs would
            // otherwise diff each other's additions.
            const before = readDependencyKeys(this.baseUrl);
            const result = await installPlugin(spec, this.baseUrl);
            if (result.ok) {
                // `dsh plugin add` reconciles bundles into dsh.profile.bundles and
                // reports non-plugin repos; mirror that so "restart to take effect"
                // is true for real bundles and honest for repo-only packages
                // (2026-08-22: EAC 装完不生效——无插件入口，提示误导).
                try {
                    const { note } = reconcileInstalled(this.baseUrl, before);
                    if (note !== '')
                        result.detail = note;
                }
                catch { /* best-effort */ }
            }
            return result;
        });
    }
    /** Update one installed plugin to the detected target version (exact — see update.ts). */
    async update(name, version) {
        return this.enqueuePnpm(() => updatePlugin(name, version, this.baseUrl));
    }
    /** 串行执行一次 pnpm 操作并失效缓存（无论成败都放行链条后续任务）。 */
    enqueuePnpm(op) {
        const run = this.pnpmChain.then(async () => {
            const result = await op();
            this.installedNamesCache = null;
            this.updatesCache = null;
            // pnpm rewrote node_modules on disk: drop the process-local package.json
            // snapshot so the next listInstalled reads the new versions.
            clearPackageCache();
            return result;
        });
        this.pnpmChain = run.catch(() => { });
        return run;
    }
    /** Temporary diagnostics for the empty-update bug; removed once root-caused. */
    async debug() {
        return {
            baseUrl: this.baseUrl,
            installed: (await this.listInstalled()).map(p => ({ name: p.name, version: p.version, source: p.source })),
        };
    }
    /** Disable/enable one loader entry through the profile patch layer. */
    async toggle(id, disabled) {
        const result = await setDisabled(this.baseUrl, id, disabled);
        this.installedNamesCache = null;
        return result;
    }
    /** One-shot diagnostics: environment, installed surface, patch stance, pnpm log tail. */
    async diagnostics() {
        const [installed, dshVersion] = await Promise.all([this.listInstalled(), this.dshVersion()]);
        let pnpmLogTail = '';
        try {
            const logPath = join(this.baseUrl, 'plugin-center-pnpm.log');
            if (existsSync(logPath)) {
                const text = readFileSync(logPath, 'utf8');
                pnpmLogTail = text.slice(-4000);
            }
        }
        catch { /* best-effort */ }
        return {
            dshVersion,
            baseUrl: this.baseUrl,
            node: process.version,
            installed,
            disabled: Object.fromEntries(readDisabledState(join(this.baseUrl, 'cordis.patch.yml'))),
            pnpmLogTail,
        };
    }
    /** Screenshot URL for one dsh-market plugin, lazily extracted from its README. */
    async screenshot(name) {
        const cached = this.screenshotCache.get(name);
        if (cached !== undefined)
            return cached;
        this.screenshotCache.set(name, null); // placeholder against concurrent dup fetches
        const repo = this.dshMarketCache.find(p => p.name === name || p.spec === name)?.name ?? name;
        const url = await extractFirstImage(repo);
        this.screenshotCache.set(name, url);
        return url;
    }
    /** AI recommendation: keyword-filtered candidates ranked by the model. */
    async suggest(query) {
        const q = query.trim();
        if (q === '')
            return [];
        await this.waitAllSources();
        const llm = this.ctx.get('llm');
        if (llm?.stream === undefined) {
            throw new Error('llm 服务不可用（当前 profile 未提供 dsh-llm）');
        }
        const tokens = q.toLowerCase().split(/[\s,，、;；]+/u).filter(Boolean);
        // 候选 = 三源合并（2026-08-22：此前只用 dsh-market，awesome/Oh-My-DSH
        // 的精选插件进不了推荐；合并后按 name 去重、spec 优先 npm 名）。
        const scored = this.combinedMarketCache()
            .map(p => ({
            p,
            hits: tokens.reduce((n, tok) => n + (p.name.toLowerCase().includes(tok)
                || p.description.zh.toLowerCase().includes(tok)
                || p.description.en.toLowerCase().includes(tok)
                || p.categories.some(c => c.includes(tok)) ? 1 : 0), 0),
        }))
            .sort((a, b) => (b.hits - a.hits) || (b.p.stars ?? 0) - (a.p.stars ?? 0))
            .slice(0, 25);
        if (scored.length === 0)
            return [];
        const list = scored.map(({ p }) => `- ${p.name} | ${p.stars ?? 0}★ | ${p.description.zh.slice(0, 60)}`).join('\n');
        const system = '你是 DeepSeek Harness 插件市场的推荐助手。根据用户需求从候选插件中选择 3-5 个最合适的，只输出一个 JSON 数组（不要 markdown 代码块、不要任何多余文字）：[{"name":"插件名","reason":"一句话中文推荐理由（20 字以内）"}]。名称必须从候选列表原样复制，禁止改写、拼接或编造';
        // Message 契约：content 是 ContentBlock 数组（非字符串），且需要 id/source。
        const chunks = llm.stream({
            provider: 'deepseek-official',
            model: 'deepseek-v4-flash',
            messages: [{
                    id: 'plugin-center-suggest',
                    role: 'user',
                    content: [{ type: 'text', text: `用户需求：${q}\n\n候选插件列表（名称 | 星标 | 简介）：\n${list}` }],
                    source: { kind: 'plugin', plugin: 'dsh-plugin-center' },
                }],
            system,
            // 800 会把 3-5 条中文推荐截断成不完整 JSON（2026-08-22 实测
            // "模型输出无法解析" + 截断的 JSON 片段）；2000 留足余量。
            maxTokens: 2000,
            signal: AbortSignal.timeout(90000),
        });
        let text = '';
        let failed = false;
        let failureDetail = '';
        for await (const chunk of chunks) {
            if (chunk.type === 'text-delta')
                text += chunk.text ?? '';
            else if (chunk.type === 'finish' && (chunk.reason?.kind === 'error' || chunk.reason?.kind === 'aborted')) {
                failed = true;
                // LlmFailure { code, message }——必须透出，否则用户只看到笼统的
                // "模型推荐失败"而无法诊断（2026-08-22 实测空 text + 无详情）。
                const f = chunk.reason.failure;
                failureDetail = f ? `${f.code ?? 'unknown'}: ${f.message ?? ''}` : chunk.reason.kind;
            }
        }
        if (failed || text.trim() === '') {
            throw new Error(`模型推荐失败，请重试${failureDetail !== '' ? `（${failureDetail.slice(0, 200)}）` : text === '' ? '' : `（模型返回：${text.slice(0, 80)}）`}`);
        }
        const start = text.indexOf('[');
        const end = text.lastIndexOf(']');
        if (start < 0 || end <= start)
            throw new Error(`模型输出无法解析：${text.slice(0, 200)}`);
        try {
            const parsed = JSON.parse(text.slice(start, end + 1));
            if (!Array.isArray(parsed))
                throw new Error('bad shape');
            // Attach the catalog identity (spec/stars) here, so the client never
            // has to reverse-match by name — the model may echo either the npm
            // name or the owner/repo form (2026-08-22: stars went missing because
            // "Deepseek-Harness-EAC" (npm) did not match the cache key
            // "zouyuxuan122/Deepseek-Harness-EAC").
            return parsed
                .filter((item) => item !== null && typeof item === 'object'
                && typeof item.name === 'string'
                && typeof item.reason === 'string')
                .slice(0, 5)
                .map(item => {
                // 模型可能改写 owner/路径（幻觉，如 zhu1090093659 非真实 owner）
                // 或输出 monorepo 子路径——先精确匹配（name/spec/npm），再 # 截断，
                // 最后回退 repo 名匹配（2026-08-22：DamonKoy/dsh-web-ui#dsh-web-ui-all
                // 被输出成 zhu1090093659/dsh-web-ui#packages/...，精确匹配失败无星）。
                const base = item.name.split('#')[0].trim();
                const repo = base.split('/').pop() ?? '';
                const hit = this.combinedMarketCache().find(p => p.name === base || p.spec === base || p.npm === base
                    || (p.name.split('/').pop()?.split('#')[0] ?? '') === repo);
                return {
                    name: item.name,
                    reason: item.reason,
                    spec: hit?.spec ?? null,
                    stars: hit?.stars ?? null,
                };
            });
        }
        catch {
            // 截断的 JSON（maxTokens 用尽/中止）会解析失败——展示更长片段辅助诊断。
            throw new Error(`模型输出无法解析：${text.slice(0, 400)}`);
        }
    }
    /** Wait for all three market sources (fetch or failure), with a hard deadline. */
    async waitAllSources() {
        this.prefetchAwesome();
        this.prefetchOhMyDsh();
        this.prefetchDshMarket();
        const deadline = Date.now() + 65_000;
        while (!(this.awesomeDone && this.ohMyDshDone && this.dshMarketDone) && Date.now() < deadline) {
            await new Promise(resolve => setTimeout(resolve, 200));
        }
    }
    /** 三源市场合并（按 name 去重；spec 优先 npm 名——比 github 回退更可靠）。 */
    combinedMarketCache() {
        const map = new Map();
        for (const list of [this.awesomeCache, this.ohMyDshCache, this.dshMarketCache]) {
            for (const p of list) {
                const cur = map.get(p.name);
                if (cur === undefined) {
                    map.set(p.name, p);
                    continue;
                }
                map.set(p.name, {
                    ...cur,
                    spec: p.npm ?? cur.npm ?? p.spec ?? cur.spec,
                    npm: cur.npm ?? p.npm,
                    // 同一条目多源星数不同：取最大值（2026-08-22：awesome ★4 曾
                    // 覆盖 dsh-market 高星——合并顺序导致低星胜出）。
                    stars: Math.max(cur.stars ?? 0, p.stars ?? 0) || null,
                    score: cur.score ?? p.score,
                    description: cur.description.zh !== '' && cur.description.en !== '' ? cur.description : p.description,
                });
            }
        }
        return [...map.values()];
    }
}
