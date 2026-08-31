/**
 * Update detection, changelog extraction, and install/update execution.
 * npm registry is the primary version source; changelog is commit-history
 * first (many community repos ship no release/tag/CHANGELOG — verified §7.2).
 */
import { execFileSync, spawn } from 'node:child_process';
import { appendFileSync, existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { compareVersions, satisfies } from "./semver.js";
/** 服务面判定:目标客户端 bundle 是否深度依赖 Remote BFF(ctx.remote.*)。
 *  SSiD 内核(0.1.x)无 remote BFF 服务(走 /plugin-center RPC channel),
 *  这类版本在 SSiD 上必然「pending waiting for service: remote.session」。
 *  案例: dsh-sidebar-qa 0.4.1/0.4.2(2026-08-29 两次实崩)。 */
export function clientBundleUsesRemote(content) {
    return /ctx\.remote\.[a-zA-Z_$]+\./.test(content);
}
/** 目标版本客户端 bundle 缓存:name@version → true/false。 */
const remoteUseCache = new Map();
/** 下载目标 tgz 并抽取 client bundle,判定 remote 服务依赖。
 *  仅返回 boolean 不用 pnpm(直接 registry 下载 tgz + bsdtar 抽文件)。 */
export async function targetClientUsesRemote(name, version) {
    const key = `${name}@${version}`;
    const hit = remoteUseCache.get(key);
    if (hit !== undefined)
        return hit;
    let result = false;
    const tmp = mkdtempSync(join(homedir(), '.dsh', 'tmp-remoteprobe-'));
    try {
        const tarballName = `${name.replace(/^@.*\//, '')}-${version}.tgz`;
        for (const registry of ['https://registry.npmjs.org', 'https://registry.npmmirror.com']) {
            try {
                const res = await fetch(`${registry}/${name}/-/${tarballName}`, { signal: AbortSignal.timeout(15000) });
                if (!res.ok)
                    continue;
                const tgz = join(tmp, tarballName);
                writeFileSync(tgz, Buffer.from(await res.arrayBuffer()));
                // 找 client bundle 文件(约定 client.js / lib/client.js / client/*.js)
                const listing = execFileSync('tar', ['-tzf', tgz], { encoding: 'utf8', timeout: 30000 });
                const lines = (listing ?? '').split('\n').map(l => l.trim()).filter(l => l.endsWith('.js'));
                const candidates = lines.filter(l => /(^|\/)client(\.js|\/)|\/client\//.test(l) || l.includes('/client.js'));
                const file = candidates.find(l => l.endsWith('client.js'));
                if (file !== undefined) {
                    const bundle = execFileSync('tar', ['-xzOf', tgz, file], { encoding: 'utf8', timeout: 30000 });
                    result = clientBundleUsesRemote(String(bundle));
                }
                break;
            }
            catch { /* next registry */ }
        }
    }
    catch { /* 任何失败保持 false(不误伤) */ }
    finally {
        try {
            rmSync(tmp, { recursive: true, force: true });
        }
        catch { /* best-effort */ }
    }
    remoteUseCache.set(key, result);
    return result;
}
const UA = { 'User-Agent': 'dsh-plugin-center' };
/** Latest published version on the npm registry; null when unreachable/unpublished. */
export async function npmLatest(packageName) {
    for (const registry of ['https://registry.npmjs.org', 'https://registry.npmmirror.com']) {
        try {
            const res = await fetch(`${registry}/${packageName}/latest`, {
                signal: AbortSignal.timeout(8000),
            });
            if (res.ok)
                return (await res.json()).version ?? null;
        }
        catch { /* next registry */ }
    }
    return null;
}
// ---- 上游同源判定(2026-08-29):包名相同 ≠ 同一项目 ---------------
// 案例: dsh-session-manager 本地 0.2.2(dream12347 定制)vs npm 0.4.1
// (hkkz9522 独立同名项目)——机械升级按包名匹配会误报并覆盖定制。
// 本地为 vendor/tarball/local-file 来源时,校验两边 repository 是否一致。
const npmRepoCache = new Map();
const NPM_REPO_TTL = 24 * 3600_000;
/** 测试用:清空 repository 缓存(生产无调用)。 */
export function clearNpmRepoCache() { npmRepoCache.clear(); }
/** 读 npm 包根级 repository.url(带 24h 缓存;失败/缺失 null)。 */
export async function npmRepository(packageName) {
    const hit = npmRepoCache.get(packageName);
    if (hit !== undefined && Date.now() - hit.at < NPM_REPO_TTL)
        return hit.repo;
    let repo = null;
    for (const registry of ['https://registry.npmjs.org', 'https://registry.npmmirror.com']) {
        try {
            const res = await fetch(`${registry}/${packageName}`, { signal: AbortSignal.timeout(8000) });
            if (res.ok) {
                const doc = await res.json();
                repo = typeof doc.repository === 'object' && doc.repository !== null ? doc.repository.url ?? null : typeof doc.repository === 'string' ? doc.repository : null;
                break;
            }
        }
        catch { /* next registry */ }
    }
    const entry = { at: Date.now(), repo };
    npmRepoCache.set(packageName, entry);
    return repo;
}
/** 仓库 URL 归一化(去 scheme/git+ 前缀/尾 .git/尾斜杠/大小写)用于同源比较。 */
export function normalizeRepoUrl(url) {
    return url
        .trim()
        .replace(/^git\+/, '')
        .replace(/^https?:\/\//, '')
        .replace(/^git:\/\//, '')
        .replace(/^ssh:\/\/git@/, '')
        .replace(/\.git$/, '')
        .replace(/\/$/, '')
        .replace(/^github\.com\//, '')
        .replace(/@/g, '')
        .toLowerCase();
}
/** 同源判定:true=同一上游;false=同名异源;null=无法判定(任一侧缺 repo)。 */
export async function isSameUpstream(localRepoUrl, packageName) {
    if (localRepoUrl === null)
        return null;
    const npmRepo = await npmRepository(packageName);
    if (npmRepo === null)
        return null;
    const a = normalizeRepoUrl(localRepoUrl);
    const b = normalizeRepoUrl(npmRepo);
    if (a === '' || b === '')
        return null;
    return a === b;
}
/** Extract owner/repo from a package.json repository field. */
function repoOf(repoUrl) {
    if (repoUrl === null)
        return null;
    const match = /github\.com[/:]([^/]+)\/([^/.#]+)/.exec(repoUrl);
    if (match === null)
        return null;
    return { owner: match[1], repo: match[2] };
}
/** Commit-message changelog: the reliable source for repos without release notes. */
export async function fetchCommitChangelog(repoUrl, sinceIso) {
    const repo = repoOf(repoUrl);
    if (repo === null)
        return [];
    try {
        const res = await fetch(`https://api.github.com/repos/${repo.owner}/${repo.repo}/commits?since=${encodeURIComponent(sinceIso)}&per_page=20`, { headers: UA, signal: AbortSignal.timeout(15000) });
        if (!res.ok)
            return [];
        const commits = await res.json();
        return commits.map(c => c.commit.message.split('\n')[0]).filter(line => line !== '');
    }
    catch {
        return [];
    }
}
/**
 * Detect one plugin's update: compare local vs remote version, pull commit
 * changelog since `sinceIso`, and check DSH compatibility against the local
 * DSH version via the plugin's peer-dependency range.
 */
export async function detectUpdate(name, localVersion, repoUrl, author, compatRange, localDshVersion, sinceIso) {
    const latest = await npmLatest(name);
    if (latest === null || compareVersions(latest, localVersion) <= 0)
        return null;
    let compat = 'unknown';
    if (compatRange !== null) {
        compat = satisfies(localDshVersion, compatRange) ? 'compatible' : 'incompatible';
    }
    // 服务面校验(SSiD 专用):目标版本客户端依赖 Remote BFF(ctx.remote.*)而
    // SSiD 内核无该服务 → 标不兼容(否则升级后内核启动即 failed)。
    if (compat !== 'incompatible' && process.env.SSID_PENDING_CONSUMER === '1') {
        if (await targetClientUsesRemote(name, latest))
            compat = 'incompatible';
    }
    return {
        name,
        fromVersion: localVersion,
        toVersion: latest,
        changelog: await fetchCommitChangelog(repoUrl, sinceIso),
        compat,
        compatRange,
        repoUrl,
        // 与 meta.ts buildInstalledPlugin 同规则：无 author 字段时回退 repository
        // owner（npm 包常不写 author；owner=作者/组织，2026-09-01）。
        author: author ?? (repoUrl === null ? null : (/github\.com[/:]([^/]+)\/[^/.\#]+/.exec(repoUrl)?.[1] ?? null)),
    };
}
// ── 两段式更新（2026-08-22）：预下载 + 重启时安装 ────────────────────────
// SSiD/DSH 运行中替换 node_modules 里的原生模块（node-pty 的 conpty.node
// 等）会被 Windows 锁死（EPERM：rename tmp -> 目标 失败）。与「禁用插件
// 写 patch + 重启生效」同款两段式：
//   1. 现在：npm pack 把 <name>@<version> 下载到 ~/.ssid/pending-plugin-updates/
//      （不动 node_modules，无锁；网络/版本问题此刻暴露）；
//   2. 重启（SSiD 启动、boot DSH 之前）：shell/kernel.ts 消费清单，用
//      `pnpm add -w <name>@<version>` 安装（无锁窗口、store 已缓存）。
// 注意：pnpm pack 只能打当前项目，远程 registry 包必须用 npm pack
// （2026-08-22 实测两者行为差异）。tgz 命名（npm pack 实测）：
//   普通包 <name>-<version>.tgz；scope 包 <scope>-<name>-<version>.tgz。
const PENDING_DIR = join(homedir(), '.ssid', 'pending-plugin-updates');
const PENDING_INDEX = join(PENDING_DIR, 'index.json');
/** npm pack 生成的 tgz 文件名（scope 包的 @ 与 / 均转 -）。 */
export function tarballNameOf(name, version) {
    return `${name.startsWith('@') ? name.slice(1).replace('/', '-') : name}-${version}.tgz`;
}
export function pendingUpdateDir() {
    return PENDING_DIR;
}
export function readPendingUpdates() {
    try {
        const parsed = JSON.parse(readFileSync(PENDING_INDEX, 'utf8'));
        if (!Array.isArray(parsed))
            return [];
        return parsed.filter((entry) => {
            const e = entry;
            return e !== null && typeof e.name === 'string' && typeof e.version === 'string' && typeof e.tgz === 'string';
        });
    }
    catch {
        return [];
    }
}
export function writePendingUpdates(entries) {
    mkdirSync(PENDING_DIR, { recursive: true });
    writeFileSync(PENDING_INDEX, JSON.stringify(entries, null, 2) + '\n');
}
/** npm 候选命令：优先 PATH，回退用户级 npm 全局目录（同 pnpmCandidates 策略）。 */
function npmCandidates() {
    const commands = ['npm', 'npm.cmd'];
    const userNpm = join(homedir(), 'AppData', 'Roaming', 'npm');
    for (const name of ['npm.cmd', 'npm.exe', 'npm']) {
        const candidate = join(userNpm, name);
        if (existsSync(candidate))
            commands.push(candidate);
    }
    return commands;
}
/** Run `npm pack <spec>` into the pending dir and record the queued update.
 *  @returns the pnpm-style result with `pending: true` on success. */
export async function preparePluginUpdate(name, version, profileDir) {
    const spec = `${name}@${version}`;
    const tgz = join(PENDING_DIR, tarballNameOf(name, version));
    // 清理同包其他版本的残留 tgz（保留同 name 最新一次准备）
    try {
        for (const file of readdirSync(PENDING_DIR)) {
            if (file.endsWith('.tgz') && file !== tarballNameOf(name, version)) {
                rmSync(join(PENDING_DIR, file), { force: true });
            }
        }
    }
    catch { /* pending dir absent is fine */ }
    let last = { ok: false, detail: 'no npm candidate found', durationMs: 0 };
    for (const command of npmCandidates()) {
        last = await runOne(command, ['pack', spec, '--pack-destination', PENDING_DIR], profileDir);
        if (last.ok)
            break;
    }
    logPnpm(profileDir, ['npm', 'pack', spec, '--pack-destination', PENDING_DIR], last);
    if (last.ok && existsSync(tgz)) {
        const entries = readPendingUpdates().filter(entry => !(entry.name === name && entry.version === version));
        entries.push({ name, version, tgz, at: Date.now() });
        writePendingUpdates(entries);
        return { ...last, pending: true };
    }
    // 失败：detail 里已带 npm 输出（网络/版本问题此时暴露，无需重启才发现）
    return last;
}
/**
 * Append one pnpm operation to `<profileDir>/plugin-center-pnpm.log`: time,
 * command, cwd, exit, duration, and the captured output tail. Every install
 * and update lands here regardless of success, so a problem on any machine
 * can be diagnosed by copying the log (2026-08-22: SSiD 更新慢/失败复盘需要
 * 现场证据；日志写失败绝不影响主流程）。
 */
export function logPnpm(profileDir, args, result) {
    try {
        const file = join(profileDir, 'plugin-center-pnpm.log');
        const line = [
            `${new Date().toISOString()} $ pnpm ${args.join(' ')}`,
            `  cwd=${profileDir}`,
            `  ${result.ok ? 'ok' : 'FAIL'} duration=${result.durationMs}ms`,
            result.detail === '' ? '' : `  ${result.detail.split('\n').map(s => `  ${s}`).join('\n')}`,
            '---',
            '',
        ].join('\n');
        appendFileSync(file, line);
    }
    catch { /* logging must never break the install path */ }
}
/** pnpm 候选命令：GUI 进程 PATH 常缺用户级 npm 全局目录；且 Windows 上
 *  CreateProcess 只找 pnpm.exe（.cmd/.ps1 必须经 shell）——2026-08-17 实测
 *  spawn('pnpm', shell:false) 直接 ENOENT，更新永远假成功。 */
export function pnpmCandidates() {
    const commands = ['pnpm', 'pnpm.cmd'];
    const userNpm = join(homedir(), 'AppData', 'Roaming', 'npm');
    for (const name of ['pnpm.cmd', 'pnpm.exe', 'pnpm']) {
        const candidate = join(userNpm, name);
        if (existsSync(candidate))
            commands.push(candidate);
    }
    return commands;
}
/** One node executable that can run pnpm scripts.
 *  SSiD 注入的 SSID_MCP_NODE（与 SSID_PNPM 同模式注入，存在即用）→ 本进程
 *  execPath（官方 dsh 是 node 进程）→ PATH 的 node。 */
function nodeCandidate() {
    const fromEnv = process.env.SSID_MCP_NODE;
    if (fromEnv !== undefined && fromEnv !== '')
        return fromEnv;
    const exe = process.execPath;
    if (/node(?:\.exe)?$/i.test(exe))
        return exe;
    return 'node';
}
/** Wrap a bundled pnpm CLI path into a runnable command line. SSID_PNPM
 *  (SSiD 捆绑 pnpm) points at `pnpm.cjs` — a node script. On Windows,
 *  spawning it directly through `shell: true` makes cmd hand the .cjs to
 *  its file association (ShellExecute): cmd returns exit 0 immediately and
 *  node never runs (2026-08-25 another machine: 142ms fake success, npm
 *  add 未生效; output redirection test produced a 0-byte file). Non-.cjs
 *  paths (e.g. pnpm.exe) are used as-is.
 */
export function pnpmExecCommand(bundled) {
    if (!/\.(cjs|mjs|js)$/i.test(bundled))
        return bundled;
    const node = nodeCandidate();
    return node === null ? bundled : `"${node}" "${bundled}"`;
}
/** 归档 profile 的 node_modules 由 pnpm `<major>` 生成（SSiD 部署时把构建机
 *  store 元数据改写成本机路径且保留 major 后缀——shell/main.mjs rewire）。
 *  若执行机全局 pnpm 是另一个 major（常见：机器装 pnpm 10，归档是 pnpm 11
 *  打的），任何 pnpm 操作都报 ERR_PNPM_UNEXPECTED_STORE（不同 major 的 store
 *  目录不兼容）。这里从 `.modules.yaml` 探测布局用的 major，候选命令里追
 *  加 `npx --yes pnpm@<major>`（npx 拉取同 major CLI，之后走 npm 缓存），
 *  保证以「与布局一致」的 pnpm 执行更新。
 *  @returns 布局的 pnpm major（如 11），读不到时 undefined。
 */
export function detectStoreMajor(profileDir) {
    try {
        const meta = readFileSync(join(profileDir, 'node_modules', '.modules.yaml'), 'utf8');
        // JSON 转义（\\v11）与 YAML 字面（\v11）两种形态都覆盖。
        const match = /storeDir[^\n]*store[\\/]+v?(\d+)/.exec(meta);
        if (match === null)
            return undefined;
        return Number(match[1]);
    }
    catch {
        return undefined;
    }
}
/** 完整 pnpm 命令候选序列：壳内捆绑 pnpm（SSID_PNPM，与归档 store 布局同
 *  major）最优先；本地 pnpm（PATH/用户级）其次；最终以 npx pnpm@<major>
 *  兜底（仅当探测到布局 major）。 */
export function pnpmCommandCandidates(profileDir) {
    const commands = [];
    const bundled = process.env.SSID_PNPM;
    if (bundled !== undefined && bundled !== '')
        commands.push(pnpmExecCommand(bundled));
    commands.push(...pnpmCandidates());
    const major = detectStoreMajor(profileDir);
    if (major !== undefined) {
        commands.push(`npx --yes pnpm@${major}`);
    }
    return commands;
}
function runOne(command, args, cwd) {
    return new Promise((resolve) => {
        let child;
        try {
            // shell: true —— Windows 下 .cmd shim 必须经 shell 才能 spawn；
            // command 与 args 合并为整行（command 可能是多词命令，如
            // `npx --yes pnpm@11`；args 是内部生成的固定形态，无注入面）。
            // windowsHide —— GUI 宿主下不弹 cmd 窗口（2026-08-18 用户实测闪烁）。
            // stdio 走默认 pipe：捕获 pnpm 输出，失败时把尾部输出放进 detail
            // （2026-08-22 起——此前 inherit 只有 exit code，SSiD 下更新失败
            // 无法诊断；宿主进程（web/electron）非 DSH 工具沙箱，pipe 可用）。
            child = spawn([command, ...args].join(' '), { cwd, shell: true, windowsHide: true });
        }
        catch (e) {
            resolve({ ok: false, detail: e instanceof Error ? e.message : String(e), durationMs: 0 });
            return;
        }
        const started = Date.now();
        // 15 分钟硬超时：pnpm 可能卡在 supply-chain 全量验证/网络重试上
        // （2026-08-22 SSiD 下「更新中」长时间不结束的防御），超时杀掉并报错。
        let timedOut = false;
        const timer = setTimeout(() => {
            timedOut = true;
            child.kill();
        }, 15 * 60_000);
        let out = '';
        child.stdout?.on('data', (d) => { out += d.toString(); });
        child.stderr?.on('data', (d) => { out += d.toString(); });
        child.on('error', e => { clearTimeout(timer); resolve({ ok: false, detail: e.message, durationMs: Date.now() - started }); });
        child.on('close', code => {
            clearTimeout(timer);
            const durationMs = Date.now() - started;
            if (code === 0)
                resolve({ ok: true, detail: '', durationMs });
            const tail = out.trim();
            const header = timedOut ? 'timed out after 15 minutes' : `exit code ${code ?? 1}`;
            resolve({ ok: false, detail: `${header}${tail === '' ? '' : `\n${tail.slice(-4000)}`}`, durationMs });
        });
    });
}
/**
 * Run pnpm in the profile directory, trying each candidate command in turn.
 * Output is captured (no named-pipe stdio — the host process is the web or
 * electron main process, not the DSH tool sandbox); the exit code and the
 * captured tail are the result this layer returns, and every attempt is
 * appended to the profile's plugin-center-pnpm.log.
 */
export async function runPnpm(args, cwd) {
    let last = { ok: false, detail: 'no pnpm candidate found', durationMs: 0 };
    for (const command of pnpmCommandCandidates(cwd)) {
        last = await runOne(command, args, cwd);
        if (last.ok)
            break;
    }
    // 自更新鸡生蛋兜底提示：所有候选都失败且是 store 版本不匹配时，把可复制
    // 的手动命令放进 detail，用户按提示在 profile 目录执行即可（2026-08-23
    // 另一台电脑 v10/v11 实测——旧 host 无自动兜底，需要一条显式命令）。
    if (!last.ok && last.detail.includes('ERR_PNPM_UNEXPECTED_STORE')) {
        const major = detectStoreMajor(cwd);
        if (major !== undefined) {
            last.detail += `\n\nHint: 在 profile 目录（${cwd}）执行：\n  npx --yes pnpm@${major} ${args.join(' ')}`;
        }
    }
    logPnpm(cwd, args, last);
    return last;
}
/** Install a package into the web profile, mirroring `dsh plugin add` semantics. */
export async function installPlugin(packageSpec, profileDir) {
    // `-w` is required: every profile ships a pnpm-workspace.yaml.
    return runPnpm(['add', '-w', packageSpec], profileDir);
}
/** Resolve `exports["./client"]` exactly like client-modules does (string or
 *  { default }): the browser bundle path, relative to the package dir. */
function clientBundleRel(pkgDir) {
    try {
        const pkg = JSON.parse(readFileSync(join(pkgDir, 'package.json'), 'utf8'));
        const exp = pkg.exports;
        if (exp !== null && typeof exp === 'object') {
            const client = exp['./client'];
            if (typeof client === 'string')
                return client.replace(/^\.\//, '');
            if (client !== null && typeof client === 'object') {
                const d = client.default;
                if (typeof d === 'string')
                    return d.replace(/^\.\//, '');
            }
        }
    }
    catch { /* unreadable package.json: fall through to name-based rules */ }
    return null;
}
/** True when the file never needs a host restart: the browser bundle (exact
 *  exports path or legacy name), source maps, type declarations, docs/assets,
 *  images. Conservative direction: a missed exclusion only adds a restart
 *  (false negative), never removes one (false positive). */
function snapshotExcluded(rel, isDir, clientRels) {
    // join() produces backslashes on Windows; normalize for set membership.
    const norm = rel.replace(/\\/g, '/');
    const name = norm.split('/').pop();
    if (name === 'node_modules' || name === 'docs' || name === 'assets')
        return true;
    if (isDir)
        return false;
    if (clientRels.has(norm))
        return true;
    if (name === 'client.js' || name === 'client.mjs')
        return true;
    if (name.endsWith('.map') || name.endsWith('.d.ts'))
        return true;
    if (/[.](png|jpe?g|gif|webp|svg|ico)$/i.test(name))
        return true;
    if (/^(README|LICENSE|CHANGELOG|UNLICENSE)(\..*)?$/i.test(name))
        return true;
    return false;
}
/** Hash every host-runtime file under a package dir, excluding the browser
 *  bundle (hot-swappable via client-hmr) and doc/type artifacts. The installed
 *  package lives inside the running profile's node_modules, so the diff tells
 *  whether the update touched only bundle files or also host code. The
 *  package.json version bump is normalized away — installed-version metadata
 *  changes on every update and has no runtime effect. Returns null when the
 *  dir is absent or unreadable.
 */
export function snapshotHostFiles(pkgDir) {
    try {
        if (!existsSync(pkgDir) || !statSync(pkgDir).isDirectory())
            return null;
    }
    catch {
        return null;
    }
    const clientRels = new Set();
    const clientRel = clientBundleRel(pkgDir);
    if (clientRel !== null)
        clientRels.add(clientRel);
    const out = [];
    const walk = (dir, prefix) => {
        let entries = [];
        try {
            entries = readdirSync(dir);
        }
        catch {
            return;
        }
        for (const name of entries) {
            const full = join(dir, name);
            const rel = prefix === '' ? name : join(prefix, name);
            let st;
            try {
                st = statSync(full);
            }
            catch {
                continue;
            }
            if (snapshotExcluded(rel, st.isDirectory(), clientRels))
                continue;
            if (st.isDirectory()) {
                walk(full, rel);
                continue;
            }
            try {
                let data = readFileSync(full);
                if (name === 'package.json') {
                    // Installed-version metadata changes on every update; strip it so a
                    // pure bundle update still compares equal.
                    const pkg = JSON.parse(data.toString('utf8'));
                    delete pkg.version;
                    data = Buffer.from(JSON.stringify(pkg), 'utf8');
                }
                const hash = createHash('sha256').update(data).digest('hex');
                out.push({ path: rel, hash });
            }
            catch { /* unreadable file: ignore */ }
        }
    };
    walk(pkgDir, '');
    return out;
}
/** True when the two snapshots disagree (host-side code changed). */
export function hostFilesChanged(before, after) {
    const a = new Map(before.map(i => [i.path, i.hash]));
    const b = new Map(after.map(i => [i.path, i.hash]));
    if (a.size !== b.size)
        return true;
    for (const [path, hash] of a) {
        if (b.get(path) !== hash)
            return true;
    }
    return false;
}
/**
 * Update a package to the given version, mirroring `dsh plugin add <pkg>`.
 * The exact version is required: with a bare package name, pnpm 11's
 * `minimumReleaseAge` supply-chain policy silently refuses a too-recent
 * latest (exit 0, nothing installed) — a false-success update. An explicit
 * `<name>@<version>` pins the target and pnpm records it in
 * `minimumReleaseAgeExclude` itself (2026-08-18, reproduced in-process).
 */
export async function updatePlugin(packageName, version, profileDir) {
    const pkgDir = join(profileDir, 'node_modules', packageName);
    const before = snapshotHostFiles(pkgDir);
    const result = await runPnpm(['add', '-w', `${packageName}@${version}`], profileDir);
    if (result.ok) {
        // no-op 识破：pnpm add 可能 exit 0 但什么都不装（2026-08-25 SSiD 内实测：
        // 连续三次 142ms 静默成功、spec/版本均未变，hot 判定把「没变化」误报成
        // 「已热生效」）。逐一核对已安装版本，不一致即报真实错误并附手动命令，
        // 而不是继续走 hot / 待重启链路。
        let installed = null;
        try {
            const pkg = JSON.parse(readFileSync(join(pkgDir, 'package.json'), 'utf8'));
            installed = typeof pkg.version === 'string' ? pkg.version : null;
        }
        catch { /* 包目录缺失：视为未生效 */ }
        if (installed !== version) {
            result.ok = false;
            result.detail = `pnpm add 未生效（exit 0，安装版本仍为 ${installed ?? '缺失'}）。若重试仍失败，请在 profile 目录（${profileDir}）手动执行：pnpm add -w ${packageName}@${version}`;
            return result;
        }
    }
    if (result.ok && before !== null && before.length > 0) {
        const after = snapshotHostFiles(pkgDir);
        if (after !== null && !hostFilesChanged(before, after)) {
            result.hot = true;
        }
    }
    return result;
}
export function sourceOf(specifier, profileDir) {
    // @deepseek-ai/ 全 scope 官方(含 vendored cordis-* 内核包)——第三方无法
    // 发布到该 scope;与 meta.ts classifySource 保持同一判据(2026-09-01)。
    if (specifier.startsWith('@deepseek-ai/'))
        return 'official';
    // tarball 判定必须在 vendor 之前(否则 'file:./vendor/x.tgz' 被 vendor 分支截胡)。
    if (specifier.startsWith('file:./vendor/') && specifier.endsWith('.tgz'))
        return 'tarball';
    if (specifier.startsWith('file:./vendor/'))
        return 'vendor';
    if (specifier.startsWith('file:') || specifier.startsWith('link:'))
        return 'local-file';
    if (specifier.startsWith('github:') || specifier.startsWith('git+'))
        return 'tarball';
    // ^x.y.z / x.y.z / ~x.y.z → npm 源
    return 'npm';
}
/** 读 profile dependencies 里该插件的声明形态（npm 纯净 / file: vendor / link: 等）。 */
export function dependencySpecifierOf(profileDir, name) {
    try {
        const pkg = JSON.parse(readFileSync(join(profileDir, 'package.json'), 'utf8'));
        return pkg.dependencies?.[name] ?? null;
    }
    catch {
        return null;
    }
}
/** 采集一个插件用于 LLM 更新的完整信息包。 */
export async function buildLlmPackage(name, localVersion, repoUrl, compatRange, localDshVersion, sinceIso, profileDir) {
    const latest = await npmLatest(name);
    const specifier = dependencySpecifierOf(profileDir, name);
    const source = specifier === null ? 'npm' : sourceOf(specifier, profileDir);
    const isVendorModified = source === 'vendor' || source === 'tarball' || source === 'local-file';
    // 同名异源:本地非 npm 来源时校验 npm 同名包上游是否一致(不一致 → 警告)。
    const upstreamMismatch = (source === 'vendor' || source === 'tarball' || source === 'local-file')
        ? (await isSameUpstream(repoUrl, name)) === false
        : false;
    let compat = 'unknown';
    if (compatRange !== null) {
        compat = satisfies(localDshVersion, compatRange) ? 'compatible' : 'incompatible';
    }
    // 服务面校验(SSiD 专用):目标版本依赖 Remote BFF 服务 → 不兼容(LLM 直接 keep)。
    if (compat !== 'incompatible' && latest !== null && process.env.SSID_PENDING_CONSUMER === '1') {
        if (await targetClientUsesRemote(name, latest))
            compat = 'incompatible';
    }
    const pkg = {
        name,
        fromVersion: localVersion,
        toVersion: latest,
        // 变更取 commit changelog(与 detectUpdate 一致,社区 repo 常无 release notes)
        changelog: (await fetchCommitChangelog(repoUrl, sinceIso)).slice(0, 10),
        compat,
        compatRange,
        source,
        specifier,
        isVendorModified,
        profileDir,
        upstreamMismatch,
        // 小白视角环境标签:SSiD 内核(kernel.ts)在 boot 时设置该变量;官方 DSH web 无。
        runtimeLabel: process.env.SSID_PENDING_CONSUMER === '1' ? 'SSID' : 'DSH-WEB',
        prompt: '',
    };
    return { ...pkg, prompt: buildLlmPrompt(pkg) };
}
/** 组装发给 LLM 会话的 prompt(角色设定 + 信息包 + 规则引用)。 */
export function buildLlmPrompt(pkg) {
    const srcBadge = pkg.source.toUpperCase();
    return [
        '你是 dsh 插件更新决策 Agent。请严格按「dsh-plugin-upgrade」skill 的规则决策并执行本插件更新。',
        '',
        `插件: ${pkg.name}`,
        `当前版本: ${pkg.fromVersion}`,
        `npm 最新: ${pkg.toVersion ?? '(未发布或不可达)'}`,
        `来源: ${srcBadge}${pkg.isVendorModified ? '(本地定制!机械更新会覆盖,需核对作者是否已采纳)' : ''}`,
        ...(pkg.upstreamMismatch ? [`同名异源警告: npm 上的 ${pkg.name} 与本地上游不是同一项目(repository 不一致,如独立同名项目),升级将丢失本地定制——执行前务必核实来源。`] : []),
        `依赖声明: ${pkg.specifier ?? '(非 npm 依赖)'}`,
        `安装位置: ${pkg.profileDir}(唯一允许操作目录!本会话工作区与之不同,严禁按会话 cwd 操作)`,
        `DSH 兼容: ${pkg.compat} (要求 ${pkg.compatRange ?? '未知'})`,
        `变更: ${pkg.changelog.join('; ') || '(无 changelog,查 GitHub release/tag)'}`,
        '',
        '规则要点(详见 skill): ',
        '1. 本地超前于 npm → 保持本地,不升级(vendor 魔改第一优先)。',
        '2. vendor/定制 → 下载 npm 版对比是否已被作者采纳;采纳后切 npm 版,未采纳保持 vendor。',
        '3. peer 缺失/不兼容 → 检查依赖树,先修复或回退,禁止让 DSH 启动失败。',
        '4. Windows EPERM 锁 → 走两段式(pending 预下载)或 CLI 指令。',
        '5. pnpm exit 0 假执行 → 校验实体版本,不符则重试或给手动命令。',
        '6. SSiD 预置插件升级 → 注意同步归档(profile-template/vendor)。',
        '',
        '完成后回传: 决策(action) + 执行摘要(detail) + 状态(upgrade/keep/switch-npm/failed)。',
    ].join('\n');
}
