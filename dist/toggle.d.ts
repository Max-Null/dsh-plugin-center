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
 */
export interface ToggleResult {
    ok: boolean;
    detail: string;
    /** The patch layer's stance after the write, or null when refused. */
    nowDisabled: boolean | null;
}
/** What the user patch layer currently says about every row id. */
export declare function readDisabledState(patchPath: string): Map<string, boolean>;
/**
 * Set one entry's disabled stance in the profile patch layer. The file is
 * only touched when the stance changes; a malformed file (not a plain
 * entry list) is reported instead of being made worse.
 * @param profileDir - the profile directory holding cordis.patch.yml.
 * @param id - the loader entry id to toggle.
 * @param disabled - the target stance.
 * @returns the outcome; `nowDisabled` mirrors the stance or null when refused.
 */
export declare function setDisabled(profileDir: string, entryId: string, disabled: boolean): Promise<ToggleResult>;
