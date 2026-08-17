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
import { buildInstalledPlugin, resolvePackage } from "./meta.js";
import { fetchAwesomePluginsJson, fetchOhMyDshOverrides, fetchOhMyDshPlugins, mapConcurrent, mergePlugins } from "./market.js";
import { detectUpdate, installPlugin, updatePlugin } from "./update.js";
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
export class PluginCenterEngine extends Service {
    static inject = ['loader'];
    awesomeCache = [];
    awesomeDone = false;
    awesomeFetching = false;
    ohMyDshCache = [];
    ohMyDshDone = false;
    ohMyDshFetching = false;
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
    /** Start the awesome catalog fetch once, keeping the process-local cache. */
    prefetchAwesome() {
        if (this.awesomeFetching || this.awesomeDone)
            return;
        this.awesomeFetching = true;
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
            catch { /* keep whatever cached so far */ }
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
    /** Start the Oh-My-DSH fetch once (single PLUGINS.md parse). */
    prefetchOhMyDsh() {
        if (this.ohMyDshFetching || this.ohMyDshDone)
            return;
        this.ohMyDshFetching = true;
        void (async () => {
            try {
                this.ohMyDshCache = mergePlugins([await fetchOhMyDshPlugins()]);
            }
            catch { /* empty on failure */ }
            this.ohMyDshDone = true;
            this.ohMyDshFetching = false;
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
        const decorate = (plugins) => plugins.map(p => ({ ...p, installed: installedNames.has(p.name) }));
        if (source === 'awesome') {
            this.prefetchAwesome();
            return { plugins: decorate(this.awesomeCache), done: this.awesomeDone };
        }
        if (source === 'oh-my-dsh') {
            this.prefetchOhMyDsh();
            return { plugins: decorate(this.ohMyDshCache), done: this.ohMyDshDone };
        }
        this.prefetchAwesome();
        this.prefetchOhMyDsh();
        return {
            plugins: decorate(mergePlugins([this.awesomeCache, this.ohMyDshCache])),
            done: this.awesomeDone && this.ohMyDshDone,
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
        return this.enqueuePnpm(() => installPlugin(spec, this.baseUrl));
    }
    async update(name) {
        return this.enqueuePnpm(() => updatePlugin(name, this.baseUrl));
    }
    /** 串行执行一次 pnpm 操作并失效缓存（无论成败都放行链条后续任务）。 */
    enqueuePnpm(op) {
        const run = this.pnpmChain.then(async () => {
            const result = await op();
            this.installedNamesCache = null;
            this.updatesCache = null;
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
}
