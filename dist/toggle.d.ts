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
/**
 * Effective disabled stance for install-list display: the profile patch
 * layer is the toggle source of truth (rows written by setDisabled), and
 * the Loader's own `entry.disabled` is unreliable for profile-bundle
 * plugins (they report disabled even when the bundle enables them).
 * Order: patch row by entry id (include: stripped) → patch row by the
 * bundle-declared id → enabled by default.
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
