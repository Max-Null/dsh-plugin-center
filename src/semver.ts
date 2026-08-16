/**
 * Hand-rolled semver comparison for `major.minor.patch[-prerelease]`.
 * Kept dependency-free: the plugin compares local vs remote versions and
 * matches peer-dependency ranges with just these two rules.
 */

/** A parsed semver (prerelease tag kept verbatim for lexical tie-breaks). */
export interface Semver {
  major: number
  minor: number
  patch: number
  pre: string
}

/** Parse a `major.minor.patch[-prerelease]` (optional `v` prefix); null when unparsable. */
export function parseVersion(version: string): Semver | null {
  const match = /^v?(\d+)\.(\d+)\.(\d+)(?:-(.+))?$/.exec(version)
  if (match === null) return null
  return {
    major: Number(match[1]),
    minor: Number(match[2]),
    patch: Number(match[3]),
    pre: match[4] ?? '',
  }
}

/** Compare two versions: -1 (a<b), 0 (equal), 1 (a>b). Unparsable sides compare equal. */
export function compareVersions(a: string, b: string): number {
  const pa = parseVersion(a)
  const pb = parseVersion(b)
  if (pa === null || pb === null) return 0
  for (const key of ['major', 'minor', 'patch'] as const) {
    if (pa[key] !== pb[key]) return pa[key] > pb[key] ? 1 : -1
  }
  if (pa.pre === pb.pre) return 0
  if (pa.pre === '') return 1   // release > prerelease
  if (pb.pre === '') return -1
  return pa.pre > pb.pre ? 1 : -1
}

/** Whether `version` satisfies a caret/tilde/range constraint like `^0.1.0-rc.6` or `>=0.0.1-rc.1`. */
export function satisfies(version: string, range: string): boolean {
  const v = parseVersion(version)
  if (v === null) return false
  const trimmed = range.trim()
  if (trimmed === '*' || trimmed === '') return true
  // `>= x`
  const gte = /^>=\s*(.+)$/.exec(trimmed)
  if (gte !== null) return compareVersions(version, gte[1]!) >= 0
  // `^ x.y.z` — same major, at least the stated minor/patch (prerelease-aware)
  const caret = /^\^\s*(.+)$/.exec(trimmed)
  if (caret !== null) {
    const base = parseVersion(caret[1]!)
    if (base === null) return false
    if (base.major > 0) {
      return v.major === base.major && compareVersions(version, caret[1]!) >= 0
    }
    // ^0.x.z — same minor
    return v.major === base.major && v.minor === base.minor && compareVersions(version, caret[1]!) >= 0
  }
  // bare version
  const exact = parseVersion(trimmed)
  if (exact !== null) return compareVersions(version, trimmed) === 0
  return false
}
