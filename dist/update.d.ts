/** A detected update for one installed plugin. */
export interface UpdateDigest {
    name: string;
    fromVersion: string;
    toVersion: string;
    changelog: string[];
    compat: 'compatible' | 'incompatible' | 'unknown';
    compatRange: string | null;
}
/** Latest published version on the npm registry; null when unreachable/unpublished. */
export declare function npmLatest(packageName: string): Promise<string | null>;
/** Commit-message changelog: the reliable source for repos without release notes. */
export declare function fetchCommitChangelog(repoUrl: string | null, sinceIso: string): Promise<string[]>;
/**
 * Detect one plugin's update: compare local vs remote version, pull commit
 * changelog since `sinceIso`, and check DSH compatibility against the local
 * DSH version via the plugin's peer-dependency range.
 */
export declare function detectUpdate(name: string, localVersion: string, repoUrl: string | null, compatRange: string | null, localDshVersion: string, sinceIso: string): Promise<UpdateDigest | null>;
/** One pnpm invocation result: success plus a failure detail for diagnostics. */
export interface PnpmResult {
    ok: boolean;
    detail: string;
    /** Wall-clock duration of the pnpm process (slow-but-successful is common). */
    durationMs: number;
    /** True when the update was installed DIRECTLY (files on disk now; a
     *  restart makes the running DSH pick them up), no locks were hit. */
    direct?: boolean;
    /** True when the update changed no host-side files (only the browser
     *  bundle, which client-hmr hot-swaps): no restart is needed. Absent when
     *  the package dir is missing or the snapshot could not be taken. */
    hot?: boolean;
    /** True when the update was only PREPARED (downloaded to the pending dir)
     *  and the real install is queued for the next SSiD/DSH startup. */
    pending?: boolean;
    /** Non-SSiD locked-update fallback: the CLI command the user should run
     *  after closing DSH (community-market style). */
    command?: string;
}
/** One queued update: prepared tarball + install spec for the next boot. */
export interface PendingUpdate {
    name: string;
    version: string;
    tgz: string;
    at: number;
}
/** npm pack 生成的 tgz 文件名（scope 包的 @ 与 / 均转 -）。 */
export declare function tarballNameOf(name: string, version: string): string;
export declare function pendingUpdateDir(): string;
export declare function readPendingUpdates(): PendingUpdate[];
export declare function writePendingUpdates(entries: PendingUpdate[]): void;
/** Run `npm pack <spec>` into the pending dir and record the queued update.
 *  @returns the pnpm-style result with `pending: true` on success. */
export declare function preparePluginUpdate(name: string, version: string, profileDir: string): Promise<PnpmResult>;
/**
 * Append one pnpm operation to `<profileDir>/plugin-center-pnpm.log`: time,
 * command, cwd, exit, duration, and the captured output tail. Every install
 * and update lands here regardless of success, so a problem on any machine
 * can be diagnosed by copying the log (2026-08-22: SSiD 更新慢/失败复盘需要
 * 现场证据；日志写失败绝不影响主流程）。
 */
export declare function logPnpm(profileDir: string, args: readonly string[], result: PnpmResult): void;
/** pnpm 候选命令：GUI 进程 PATH 常缺用户级 npm 全局目录；且 Windows 上
 *  CreateProcess 只找 pnpm.exe（.cmd/.ps1 必须经 shell）——2026-08-17 实测
 *  spawn('pnpm', shell:false) 直接 ENOENT，更新永远假成功。 */
export declare function pnpmCandidates(): string[];
/** Wrap a bundled pnpm CLI path into a runnable command line. SSID_PNPM
 *  (SSiD 捆绑 pnpm) points at `pnpm.cjs` — a node script. On Windows,
 *  spawning it directly through `shell: true` makes cmd hand the .cjs to
 *  its file association (ShellExecute): cmd returns exit 0 immediately and
 *  node never runs (2026-08-25 another machine: 142ms fake success, npm
 *  add 未生效; output redirection test produced a 0-byte file). Non-.cjs
 *  paths (e.g. pnpm.exe) are used as-is.
 */
export declare function pnpmExecCommand(bundled: string): string;
/** 归档 profile 的 node_modules 由 pnpm `<major>` 生成（SSiD 部署时把构建机
 *  store 元数据改写成本机路径且保留 major 后缀——shell/main.mjs rewire）。
 *  若执行机全局 pnpm 是另一个 major（常见：机器装 pnpm 10，归档是 pnpm 11
 *  打的），任何 pnpm 操作都报 ERR_PNPM_UNEXPECTED_STORE（不同 major 的 store
 *  目录不兼容）。这里从 `.modules.yaml` 探测布局用的 major，候选命令里追
 *  加 `npx --yes pnpm@<major>`（npx 拉取同 major CLI，之后走 npm 缓存），
 *  保证以「与布局一致」的 pnpm 执行更新。
 *  @returns 布局的 pnpm major（如 11），读不到时 undefined。
 */
export declare function detectStoreMajor(profileDir: string): number | undefined;
/** 完整 pnpm 命令候选序列：壳内捆绑 pnpm（SSID_PNPM，与归档 store 布局同
 *  major）最优先；本地 pnpm（PATH/用户级）其次；最终以 npx pnpm@<major>
 *  兜底（仅当探测到布局 major）。 */
export declare function pnpmCommandCandidates(profileDir: string): string[];
/**
 * Run pnpm in the profile directory, trying each candidate command in turn.
 * Output is captured (no named-pipe stdio — the host process is the web or
 * electron main process, not the DSH tool sandbox); the exit code and the
 * captured tail are the result this layer returns, and every attempt is
 * appended to the profile's plugin-center-pnpm.log.
 */
export declare function runPnpm(args: readonly string[], cwd: string): Promise<PnpmResult>;
/** Install a package into the web profile, mirroring `dsh plugin add` semantics. */
export declare function installPlugin(packageSpec: string, profileDir: string): Promise<PnpmResult>;
/** One host-side file identity: relative path + content hash. */
export interface FileIdentity {
    path: string;
    hash: string;
}
/** Hash every host-runtime file under a package dir, excluding the browser
 *  bundle (hot-swappable via client-hmr) and doc/type artifacts. The installed
 *  package lives inside the running profile's node_modules, so the diff tells
 *  whether the update touched only bundle files or also host code. The
 *  package.json version bump is normalized away — installed-version metadata
 *  changes on every update and has no runtime effect. Returns null when the
 *  dir is absent or unreadable.
 */
export declare function snapshotHostFiles(pkgDir: string): FileIdentity[] | null;
/** True when the two snapshots disagree (host-side code changed). */
export declare function hostFilesChanged(before: FileIdentity[], after: FileIdentity[]): boolean;
/**
 * Update a package to the given version, mirroring `dsh plugin add <pkg>`.
 * The exact version is required: with a bare package name, pnpm 11's
 * `minimumReleaseAge` supply-chain policy silently refuses a too-recent
 * latest (exit 0, nothing installed) — a false-success update. An explicit
 * `<name>@<version>` pins the target and pnpm records it in
 * `minimumReleaseAgeExclude` itself (2026-08-18, reproduced in-process).
 */
export declare function updatePlugin(packageName: string, version: string, profileDir: string): Promise<PnpmResult>;
/** 插件来源判定：依据依赖声明形态 + profile 目录（复用前置设计 §4.2 算法）。
 *  vendor 定制是 SSiD 生态核心（open-sea-skin/genui/panels 均本地魔改），
 *  机械更新会把 file: 覆盖回 npm —— 来源标记给 LLM 决策「保持 vendor」。 */
export type PluginSource = 'official' | 'npm' | 'vendor' | 'tarball' | 'local-file';
export declare function sourceOf(specifier: string, profileDir: string): PluginSource;
/** 读 profile dependencies 里该插件的声明形态（npm 纯净 / file: vendor / link: 等）。 */
export declare function dependencySpecifierOf(profileDir: string, name: string): string | null;
/** LLM 更新信息包:在 UpdateDigest 基础上补充来源/定制标记,驱动 Agent 决策。 */
export interface LlmUpdatePackage {
    name: string;
    /** 当前本地版本(实体 package.json)。 */
    fromVersion: string;
    /** npm latest(可 null=未发布/不可达,LLM 走 GitHub commit 路径)。 */
    toVersion: string | null;
    /** GitHub commit changelog(更新前后差异,截前 10 条)。 */
    changelog: string[];
    /** DSH 兼容性(peer 检查)。 */
    compat: 'compatible' | 'incompatible' | 'unknown';
    /** peer 声明的 DSH 版本范围。 */
    compatRange: string | null;
    /** 来源判定。 */
    source: PluginSource;
    /** 依赖声明形态(file:/github:等等),机械更新可能覆盖定制的线索。 */
    specifier: string | null;
    /** 是否本地定制(vendor/tarball/local-file)。 */
    isVendorModified: boolean;
    /** 插件所在 profile 目录(host 运行时锚点;LLM 只允许在此目录内操作)。
     *  内部技术字段——不直接展示给用户,由 runtimeLabel 承担语义化表达。 */
    profileDir: string;
    /** 用户可读的环境标签(小白视角):'SSID'(思灵应用内)/'DSH-WEB'。 */
    runtimeLabel: string;
    /** 已组装的 Agent prompt(host 单一来源,client 直接注入会话)。 */
    prompt: string;
}
/** 采集一个插件用于 LLM 更新的完整信息包。 */
export declare function buildLlmPackage(name: string, localVersion: string, repoUrl: string | null, compatRange: string | null, localDshVersion: string, sinceIso: string, profileDir: string): Promise<LlmUpdatePackage>;
/** 组装发给 LLM 会话的 prompt(角色设定 + 信息包 + 规则引用)。 */
export declare function buildLlmPrompt(pkg: LlmUpdatePackage): string;
