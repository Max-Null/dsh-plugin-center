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
}
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
/**
 * Update a package to the given version, mirroring `dsh plugin add <pkg>`.
 * The exact version is required: with a bare package name, pnpm 11's
 * `minimumReleaseAge` supply-chain policy silently refuses a too-recent
 * latest (exit 0, nothing installed) — a false-success update. An explicit
 * `<name>@<version>` pins the target and pnpm records it in
 * `minimumReleaseAgeExclude` itself (2026-08-18, reproduced in-process).
 */
export declare function updatePlugin(packageName: string, version: string, profileDir: string): Promise<PnpmResult>;
