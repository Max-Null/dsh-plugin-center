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
/**
 * Run pnpm in the profile directory. Output inherits the process stdio (no
 * pipe capture — the host sandbox forbids named-pipe stdio); the exit code is
 * the only result this layer needs.
 * @returns the child exit code, or 1 when spawn itself fails.
 */
export declare function runPnpm(args: readonly string[], cwd: string): Promise<number>;
/** Install a package into the web profile, mirroring `dsh plugin add` semantics. */
export declare function installPlugin(packageSpec: string, profileDir: string): Promise<boolean>;
/** Update a package to latest, mirroring `dsh plugin add <pkg>` (pnpm installs latest). */
export declare function updatePlugin(packageName: string, profileDir: string): Promise<boolean>;
