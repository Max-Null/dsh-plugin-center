/**
 * Installed-plugin metadata: resolve each Loader entry's specifier to a
 * package.json, classify its provenance, and read version / description /
 * DSH-compat range. Read-only projection — the Loader stays the authority.
 */
import { createRequire } from 'node:module';
import { readFile } from 'node:fs/promises';
import { existsSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
/** Compact a module specifier into a display name without guessing Loader id shape. */
export function displayName(specifier) {
    const unscoped = specifier.startsWith('@')
        ? specifier.slice(specifier.indexOf('/') + 1)
        : specifier;
    return unscoped
        .replace(/^cordis:/, '')
        .replace(/^cordis-plugin-/, '')
        .replace(/^dsh-(?:host-|client-)?/, '');
}
/** The `@deepseek-ai/dsh*` peer-dependency range, or null when undeclared. */
function dshCompatRange(pkg) {
    const peers = pkg.peerDependencies ?? {};
    for (const [name, range] of Object.entries(peers)) {
        if (name.startsWith('@deepseek-ai/dsh'))
            return range;
    }
    return null;
}
/** Classify provenance from the specifier shape alone (matches the §4.2 design).
 *  导出供测试:来源分类直接决定「已安装」列表的展示标签(2026-09-01 起修复
 *  @deepseek-ai/cordis-* 被误标「用户安装」)。 */
export function classifySource(specifier) {
    // @deepseek-ai/cordis-* 是内核 vendored 的 Cordis 生态包(dsh-base 等 bundle
    // 的依赖,如 cordis-plugin-timer/hmr),随 DSH 内核版本管理——不是用户安装的
    // 第三方,归为官方(2026-09-01: 曾被误判 installed,在已安装列表标「用户安装」)。
    if (specifier.startsWith('@deepseek-ai/'))
        return 'official';
    if (specifier.startsWith('file://') || specifier.startsWith('link:'))
        return 'local';
    if (specifier.startsWith('cordis:'))
        return 'builtin';
    return 'installed';
}
/** Process-local cache of resolved packages — stable per run, so resolve once. */
const packageCache = new Map();
/**
 * Drop every cached package.json resolution. Called after install/update:
 * pnpm rewrites node_modules on disk, and the next `listInstalled` must see
 * the new versions instead of the process-start snapshot (2026-08-18 — a
 * stale cache reported the pre-update version forever, so the update looked
 * perpetually available).
 */
export function clearPackageCache() {
    packageCache.clear();
}
/**
 * Resolve one Loader entry to its package.json. `file://` specs walk upward to
 * the nearest directory holding a package.json; `cordis:*` builtins have none.
 * Results are cached per (baseUrl, specifier) — the resolution is a pure read
 * and never changes within a process, so the file I/O happens only once.
 * @param baseUrl - profile directory (the cordis.yml anchor, `ctx.baseUrl`).
 * @param specifier - the Loader entry's module specifier.
 * @returns the parsed package.json and its directory, or null when unresolvable.
 */
export function resolvePackage(baseUrl, specifier) {
    const key = `${baseUrl}\u0000${specifier}`;
    const cached = packageCache.get(key);
    if (cached !== undefined)
        return cached;
    const pending = resolveUncached(baseUrl, specifier);
    packageCache.set(key, pending);
    return pending;
}
/**
 * 从 `start` 逐级向上找 `node_modules/<specifier>`（绕开 require 的 exports 门控）。
 *
 * 返回 null 只说明**这一条链**没有 —— 调用方必须继续试下一个锚点。早先这段逻辑
 * 内联在上溯循环里、走到盘根就 `return null`，于是排在它后面的 dsh-runtimes 锚点
 * 永远执行不到（2026-09-28 由 meta-resolve.test.ts 抓出）。
 * @param start - 起点目录。
 * @param specifier - 模块说明符（包名）。
 * @param maxLevels - 最多上溯层数。
 * @returns 解析到的 package.json 与其所在目录，或 null。
 */
async function walkUpNodeModules(start, specifier, maxLevels) {
    let dir = start;
    for (let i = 0; i < maxLevels; i++) {
        const cand = join(dir, 'node_modules', specifier);
        const pkgPath = join(cand, 'package.json');
        if (existsSync(pkgPath)) {
            try {
                return { pkg: JSON.parse(await readFile(pkgPath, 'utf8')), dir: cand };
            }
            catch {
                return null; // 清单损坏：同名包不会另有第二份，换锚点再试
            }
        }
        const parent = dirname(dir);
        if (parent === dir)
            break;
        dir = parent;
    }
    return null;
}
/**
 * 宿主内核的安装锚点起点。
 *
 * ## 为什么需要
 *
 * 打包版内核不在 profile 的解析链上：SSiD 1.0.0 把内核随包放进
 * `resources/app.asar/dsh`（asar 路径对运行时进程是可读的），profile 向上链与
 * `dsh-runtimes` 都到不了它。实测 2026-09-28：`@deepseek-ai/dsh` 解析为 null →
 * `dshVersion()` 回退 `0.0.0` → `0.0.0` 不满足任何 `^0.1.x` → 插件中心把**兼容的
 * 插件全标成「不兼容当前 DSH」**。
 *
 * ## 起点怎么选
 *
 * 内核宿主是官方 `dsh-desktop-host`，入口为
 * `<内核根>/node_modules/@deepseek-ai/dsh-desktop-host/lib/index.js` —— 从它的目录
 * 向上两三级就落到内核根的 `node_modules`，`@deepseek-ai/*` 全在那里。另取 Electron
 * 打包资源下的内核目录作兜底（入口路径形态变化时仍可用）。
 *
 * 开发期与 web 版命中不到这两处，退回前两层即可 —— 多两个起点只是多几次 `existsSync`。
 * @param argv1 - 宿主入口路径（生产传 `process.argv[1]`；测试可注入）。
 * @param resourcesPath - Electron 的 `process.resourcesPath`（同上）。
 * @returns 起点目录列表（可能为空）。
 */
export function kernelAnchorRoots(argv1, resourcesPath) {
    const roots = [];
    if (typeof argv1 === 'string' && argv1 !== '')
        roots.push(dirname(argv1));
    if (typeof resourcesPath === 'string' && resourcesPath !== '') {
        roots.push(join(resourcesPath, 'app.asar', 'dsh'));
        roots.push(join(resourcesPath, 'app.asar.unpacked', 'dsh'));
    }
    return roots;
}
/** 测试用：钉住内核锚点起点。生产恒为 null（正常从 `process` 读）。
 *  与 `clearPackageCache` / `clearNpmRepoCache` 同款用途——宿主入口路径在测试里
 *  造不出来，而「锚点能否解析到内核」正是这条链最需要回归保护的行为。 */
let kernelRootsForTest = null;
/** 覆盖内核锚点起点。@param roots - 起点列表；null 恢复读 `process`。 */
export function setKernelAnchorRootsForTest(roots) {
    kernelRootsForTest = roots;
}
async function resolveUncached(baseUrl, specifier) {
    if (specifier.startsWith('file://')) {
        let dir = dirname(fileURLToPath(specifier));
        for (let i = 0; i < 12; i++) {
            const path = join(dir, 'package.json');
            try {
                return { pkg: JSON.parse(await readFile(path, 'utf8')), dir };
            }
            catch {
                const parent = dirname(dir);
                if (parent === dir)
                    return null;
                dir = parent;
            }
        }
        return null;
    }
    if (specifier.startsWith('cordis:'))
        return null;
    // 1) 主入口解析（exports "." 的 import/require 条件都命中；主入口可能深在
    //    dist/ 子目录，须向上找包根 package.json）。2026-09-01 修复两坑：
    //    a. `pkg/package.json` 子路径被 exports 拒（chinese-thinking 等）；
    //    b. exports "." 仅 import 条件时 CJS require.resolve 失败（ds-harness-remote）。
    try {
        const require = createRequire(join(baseUrl, 'package.json'));
        const entry = require.resolve(specifier);
        let dir = dirname(entry);
        for (let i = 0; i < 12; i++) {
            const pkgPath = join(dir, 'package.json');
            if (existsSync(pkgPath)) {
                return { pkg: JSON.parse(await readFile(pkgPath, 'utf8')), dir };
            }
            const parent = dirname(dir);
            if (parent === dir)
                return null;
            dir = parent;
        }
        return null;
    }
    catch {
        // 2) 回退：逐级 node_modules 链路探测（不经过 require 的 exports 门控）——
        //    从 profile 根向上找 node_modules/<specifier>/package.json。
        const fromProfile = await walkUpNodeModules(baseUrl, specifier, 16);
        if (fromProfile !== null)
            return fromProfile;
        // 3) DSH 安装锚点：SSiD fork 版把内核放在 `<dshHome>/dsh-runtimes/<runtime>/node_modules`
        //    下，**不在 profile 的向上链上**（插件集按设计不带内核包）。实测 2026-09-28：1.0.0 上
        //    前两层都解析不到 `@deepseek-ai/dsh`，`dshVersion()` 于是回退成 `0.0.0`，而 `0.0.0`
        //    不满足任何 `^0.1.x`，插件中心据此把兼容的插件全判成「不兼容当前 DSH」。
        for (let anchor = baseUrl, i = 0; i < 6; i++) {
            const runtimes = join(anchor, 'dsh-runtimes');
            if (existsSync(runtimes)) {
                for (const runtime of readdirSync(runtimes)) {
                    const hit = await walkUpNodeModules(join(runtimes, runtime), specifier, 1);
                    if (hit !== null)
                        return hit;
                }
            }
            const parent = dirname(anchor);
            if (parent === anchor)
                break;
            anchor = parent;
        }
        // 4) 宿主内核锚点：打包版的内核在随包 asar 内，前三层都到不了（见 kernelAnchorRoots）。
        const resourcesPath = process.resourcesPath;
        const kernelRoots = kernelRootsForTest ?? kernelAnchorRoots(process.argv[1], resourcesPath);
        for (const root of kernelRoots) {
            const hit = await walkUpNodeModules(root, specifier, 24);
            if (hit !== null)
                return hit;
        }
        return null;
    }
}
/** Build the Remote-ready metadata for one Loader entry. */
export async function buildInstalledPlugin(baseUrl, entry) {
    const resolved = await resolvePackage(baseUrl, entry.name);
    const source = classifySource(entry.name);
    return {
        entryId: entry.id,
        name: entry.name,
        displayName: displayName(entry.name),
        version: resolved?.pkg.version ?? null,
        description: resolved?.pkg.description ?? null,
        source,
        enabled: !entry.disabled,
        fiberPhase: entry.fiberPhase,
        compatRange: resolved === null ? null : dshCompatRange(resolved.pkg),
        repoUrl: resolved === null ? null : (() => {
            const r = resolved.pkg.repository;
            if (typeof r === 'string')
                return r;
            if (r !== null && typeof r === 'object' && typeof r.url === 'string')
                return r.url;
            return null;
        })(),
        author: resolved === null ? null : (() => {
            const a = resolved.pkg.author;
            if (typeof a === 'string')
                return a !== '' ? a : null;
            if (a !== null && typeof a === 'object' && typeof a.name === 'string')
                return a.name !== '' ? a.name : null;
            // npm 包常不写 author 字段但 repository 有 owner（= 作者/组织，如
            // Max-Null、omdsh-dev）——回退提取（2026-09-01 用户实测"显示不全"：
            // 多数包无 author → 界面只有库名无作者）。
            const r = resolved.pkg.repository;
            const url = typeof r === 'string' ? r : r !== null && typeof r === 'object' && typeof r.url === 'string' ? r.url : null;
            if (url !== null) {
                const m = /github\.com[/:]([^/]+)\/[^/.\#]+/.exec(url);
                if (m !== null && m[1] !== undefined && m[1] !== '')
                    return m[1];
            }
            return null;
        })(),
        catalogName: null,
        categories: [],
    };
}
