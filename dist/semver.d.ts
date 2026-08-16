/**
 * Hand-rolled semver comparison for `major.minor.patch[-prerelease]`.
 * Kept dependency-free: the plugin compares local vs remote versions and
 * matches peer-dependency ranges with just these two rules.
 */
/** A parsed semver (prerelease tag kept verbatim for lexical tie-breaks). */
export interface Semver {
    major: number;
    minor: number;
    patch: number;
    pre: string;
}
/** Parse a `major.minor.patch[-prerelease]` (optional `v` prefix); null when unparsable. */
export declare function parseVersion(version: string): Semver | null;
/** Compare two versions: -1 (a<b), 0 (equal), 1 (a>b). Unparsable sides compare equal. */
export declare function compareVersions(a: string, b: string): number;
/** Whether `version` satisfies a caret/tilde/range constraint like `^0.1.0-rc.6` or `>=0.0.1-rc.1`. */
export declare function satisfies(version: string, range: string): boolean;
