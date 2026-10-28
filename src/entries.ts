/**
 * Collapse Loader entries that load the same package into one installed row.
 *
 * A profile bundle may insert several entries with the same `name`:
 * `ds-harness-remote` 0.5.18 ships a Desktop entry plus a dsh-TUI-only one
 * whose `disabled` expressions are mutually exclusive. The installed list
 * walked Loader entries one by one, so that package showed up twice with
 * identical metadata (same version, description and compat range, because
 * both resolve to the same package.json), and the switch of the inactive row
 * addressed the active one.
 *
 * The representative kept here is the enabled entry when one exists, so the
 * switch reflects what actually runs. The remaining ids ride along in
 * `entryIds` for callers that need the full set.
 */

/** The subset of a Loader entry this module groups by. */
export interface GroupableEntry {
  id: string
  name: string
  disabled: boolean
}

/**
 * Group entries by package name, keeping first-appearance order.
 *
 * First-appearance order matters: the caller sorts by provenance afterwards,
 * and a stable input order keeps that sort deterministic (2026-08-22 — the
 * installed list was sorted by source only).
 * @param entries - Loader entry views, in Loader order.
 * @returns One representative per package name, plus every id that loaded it.
 */
export function mergeEntries<T extends GroupableEntry>(entries: readonly T[]): (T & { entryIds: string[] })[] {
  const groups = new Map<string, T[]>()
  for (const entry of entries) {
    const group = groups.get(entry.name)
    if (group === undefined) groups.set(entry.name, [entry])
    else group.push(entry)
  }
  const merged: (T & { entryIds: string[] })[] = []
  for (const group of groups.values()) {
    const representative = group.find(entry => !entry.disabled) ?? group[0]!
    merged.push({ ...representative, entryIds: group.map(entry => entry.id) })
  }
  return merged
}
