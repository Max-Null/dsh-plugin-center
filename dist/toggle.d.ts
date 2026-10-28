/**
 * Hot disable/enable through the profile's user patch layer
 * (`<profileDir>/cordis.patch.yml`) — the mechanism dsh-market ports from
 * dsh-plugin-hub: a patch row `- id: X` + `disabled: true` stops that loader
 * entry, `disabled: false` force-enables one a lower layer disabled. The
 * official web profile re-composes via HMR (~1s, no restart); SSiD applies
 * the same file on every boot, so the choice survives restarts there.
 *
 * Writes are line-level (the patch dialect is simple for toggles: a row id
 * followed by an optional `disabled:` line), serialized so concurrent
 * toggles cannot interleave a read-modify-write, refused when the file is
 * not a plain entry list, and protected for host-infrastructure rows.
 *
 * Stable ids: `dsh plugin add` install lists mount entries as id-less
 * `insert` children (`- name: X`), which the Loader gives a RANDOM runtime
 * id on every boot (cordis-plugin-loader ensureId). Toggling by that
 * runtime id writes a row no later boot matches (applyEntryPatches warns
 * and skips) — the 2026-08-25 disable-broken bug. When no `- id:` row
 * matches, this module addresses the entry by `name` instead: the id-less
 * insert child is upgraded in place to a stable `- id: X` so the appended
 * disable row actually hits. It never guesses: no match = refused write.
 */
export interface ToggleResult {
    ok: boolean;
    detail: string;
    /** The patch layer's stance after the write, or null when refused. */
    nowDisabled: boolean | null;
}
/** What the user patch layer currently says about every row id. */
export declare function readDisabledState(patchPath: string): Map<string, boolean>;
/** Escape a literal for use inside a RegExp (plugin names may contain `.` etc.). */
export declare function escapeRegExp(text: string): string;
/** One insert child declared by a bundle's own `cordis.patch.yml`. */
export interface BundleEntry {
    /** The child's patch id — the value `- id:` rows in the user patch address. */
    id: string;
    /** The package name the child loads, or null when it declares none. */
    name: string | null;
}
/**
 * Parse the insert children declared by one bundle patch.
 *
 * Only `- id:` children can be toggled (an id-less child gets a random
 * runtime id on every boot, see `patchInsertChildByName`), so those are the
 * only ones collected. A child owns every following line indented deeper
 * than its own `- id:`; the first `name:` inside that block is its specifier.
 * @param text - the bundle's `cordis.patch.yml` contents.
 * @returns children in declaration order.
 */
export declare function parseInsertEntries(text: string): BundleEntry[];
/**
 * Read the insert children a profile bundle declares in its own patch.
 * @param profileDir - profile directory (holds `package.json` and `node_modules`).
 * @param name - the package name, as listed in `dsh.profile.bundles`.
 * @returns children in declaration order; empty when the package is not a
 *   profile bundle or the patch cannot be read.
 */
export declare function bundleEntries(profileDir: string, name: string): BundleEntry[];
/**
 * Resolve the patch-row id a toggle must write for one Loader entry.
 *
 * Profile bundles (`dsh.profile.bundles`) are composed by applying each
 * bundle's own `cordis.patch.yml` over the root; the entry id a toggle must
 * target lives in THAT file, not in the profile patch layer.
 *
 * A bundle may declare several children loading the same package
 * (`ds-harness-remote` 0.5.18: a Desktop entry plus a dsh-TUI-only one, with
 * mutually exclusive `disabled` expressions). Taking the first declared id
 * as "the package's id" then pointed every row at the first child — the
 * installed list showed two identical rows and the second row's switch wrote
 * the first row's id, disabling what was actually running. So: prefer the
 * exact entry id when this bundle declares it; otherwise accept only a
 * unique child loading `name`. Anything ambiguous returns null — this module
 * never guesses (a wrong id silently toggles a different plugin's row).
 * @param profileDir - profile directory.
 * @param name - the entry's package name.
 * @param entryId - the Loader entry id, with any `include:` prefix stripped.
 * @returns the id to address, or null when it cannot be resolved safely.
 */
export declare function bundleEntryId(profileDir: string, name: string, entryId?: string): string | null;
/**
 * Effective disabled stance for install-list display: the profile patch
 * layer is the toggle source of truth (rows written by setDisabled), and
 * the Loader's own `entry.disabled` is unreliable for profile-bundle
 * plugins (they report disabled even when the bundle enables them).
 * Order: patch row by entry id (include: stripped) → patch row by the
 * bundle-declared id for THIS entry → enabled by default. A bundle that
 * declares several same-named children therefore reads its own row instead
 * of whichever child is declared first.
 */
export declare function effectiveDisabledStance(profileDir: string, entryId: string, name: string): boolean;
/**
 * Set one entry's disabled stance in the profile patch layer. The file is
 * only touched when the stance changes; a malformed file (not a plain
 * entry list) is reported instead of being made worse.
 * @param profileDir - the profile directory holding cordis.patch.yml.
 * @param id - the loader entry id to toggle.
 * @param name - the entry's package name; used as the addressing key when
 *   `id` is a Loader-assigned random runtime id with no `- id:` row in the
 *   patch file (id-less insert children of `dsh plugin add` lists).
 * @param disabled - the target stance.
 * @returns the outcome; `nowDisabled` mirrors the stance or null when refused.
 */
export declare function setDisabled(profileDir: string, entryId: string, name: string, disabled: boolean): Promise<ToggleResult>;
