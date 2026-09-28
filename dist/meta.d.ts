/** Where an installed plugin came from. */
export type PluginSource = 'official' | 'installed' | 'local' | 'builtin';
/** One resolved installed plugin, ready for the Remote surface. */
export interface InstalledPlugin {
    entryId: string;
    name: string;
    displayName: string;
    version: string | null;
    description: string | null;
    source: PluginSource;
    enabled: boolean;
    fiberPhase: string | null;
    compatRange: string | null;
    repoUrl: string | null;
    /** 作者（package.json author；字符串或对象 name，缺失 null）。 */
    author: string | null;
    /** 市场目录里的 owner/repo（无 repository 字段时从市场匹配补，2026-09-01：
     *  context-doctor 无 repo/scope，但市场收录其 Zhenyu98 条目——标题由此补作者）。 */
    catalogName: string | null;
    /** Community categories, cross-matched from the market catalog (empty until fetched). */
    categories: string[];
}
/** Minimal package.json view this plugin reads. */
interface PackageJson {
    name?: string;
    version?: string;
    description?: string;
    repository?: string | {
        url?: string;
    };
    peerDependencies?: Record<string, string>;
    /** npm author 字段（字符串或 { name } 对象）——已安装列表显示作者（2026-09-01）。 */
    author?: string | {
        name?: string;
    };
}
/** Compact a module specifier into a display name without guessing Loader id shape. */
export declare function displayName(specifier: string): string;
/** Classify provenance from the specifier shape alone (matches the §4.2 design).
 *  导出供测试:来源分类直接决定「已安装」列表的展示标签(2026-09-01 起修复
 *  @deepseek-ai/cordis-* 被误标「用户安装」)。 */
export declare function classifySource(specifier: string): PluginSource;
/**
 * Drop every cached package.json resolution. Called after install/update:
 * pnpm rewrites node_modules on disk, and the next `listInstalled` must see
 * the new versions instead of the process-start snapshot (2026-08-18 — a
 * stale cache reported the pre-update version forever, so the update looked
 * perpetually available).
 */
export declare function clearPackageCache(): void;
/**
 * Resolve one Loader entry to its package.json. `file://` specs walk upward to
 * the nearest directory holding a package.json; `cordis:*` builtins have none.
 * Results are cached per (baseUrl, specifier) — the resolution is a pure read
 * and never changes within a process, so the file I/O happens only once.
 * @param baseUrl - profile directory (the cordis.yml anchor, `ctx.baseUrl`).
 * @param specifier - the Loader entry's module specifier.
 * @returns the parsed package.json and its directory, or null when unresolvable.
 */
export declare function resolvePackage(baseUrl: string, specifier: string): Promise<{
    pkg: PackageJson;
    dir: string;
} | null>;
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
export declare function kernelAnchorRoots(argv1?: string, resourcesPath?: string): string[];
/** 覆盖内核锚点起点。@param roots - 起点列表；null 恢复读 `process`。 */
export declare function setKernelAnchorRootsForTest(roots: string[] | null): void;
/** One Loader entry, the subset this plugin reads. */
export interface LoaderEntryView {
    id: string;
    name: string;
    disabled: boolean;
    group?: boolean;
    fiberPhase: string | null;
}
/** Build the Remote-ready metadata for one Loader entry. */
export declare function buildInstalledPlugin(baseUrl: string, entry: LoaderEntryView): Promise<InstalledPlugin>;
export {};
