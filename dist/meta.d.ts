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
}
/** Compact a module specifier into a display name without guessing Loader id shape. */
export declare function displayName(specifier: string): string;
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
