/**
 * Installed-plugin metadata: resolve each Loader entry's specifier to a
 * package.json, classify its provenance, and read version / description /
 * DSH-compat range. Read-only projection — the Loader stays the authority.
 */
import { createRequire } from 'node:module'
import { readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

/** Where an installed plugin came from. */
export type PluginSource = 'official' | 'installed' | 'local' | 'builtin'

/** One resolved installed plugin, ready for the Remote surface. */
export interface InstalledPlugin {
  entryId: string
  name: string
  displayName: string
  version: string | null
  description: string | null
  source: PluginSource
  enabled: boolean
  fiberPhase: string | null
  compatRange: string | null
  repoUrl: string | null
  /** Community categories, cross-matched from the market catalog (empty until fetched). */
  categories: string[]
}

/** Minimal package.json view this plugin reads. */
interface PackageJson {
  name?: string
  version?: string
  description?: string
  repository?: string | { url?: string }
  peerDependencies?: Record<string, string>
}

/** Compact a module specifier into a display name without guessing Loader id shape. */
export function displayName(specifier: string): string {
  const unscoped = specifier.startsWith('@')
    ? specifier.slice(specifier.indexOf('/') + 1)
    : specifier
  return unscoped
    .replace(/^cordis:/, '')
    .replace(/^cordis-plugin-/, '')
    .replace(/^dsh-(?:host-|client-)?/, '')
}

/** The `@deepseek-ai/dsh*` peer-dependency range, or null when undeclared. */
function dshCompatRange(pkg: PackageJson): string | null {
  const peers = pkg.peerDependencies ?? {}
  for (const [name, range] of Object.entries(peers)) {
    if (name.startsWith('@deepseek-ai/dsh')) return range
  }
  return null
}

/** Classify provenance from the specifier shape alone (matches the §4.2 design). */
function classifySource(specifier: string): PluginSource {
  if (specifier.startsWith('@deepseek-ai/dsh-')) return 'official'
  if (specifier.startsWith('file://') || specifier.startsWith('link:')) return 'local'
  if (specifier.startsWith('cordis:')) return 'builtin'
  return 'installed'
}

/** Process-local cache of resolved packages — stable per run, so resolve once. */
const packageCache = new Map<string, Promise<{ pkg: PackageJson; dir: string } | null>>()

/**
 * Drop every cached package.json resolution. Called after install/update:
 * pnpm rewrites node_modules on disk, and the next `listInstalled` must see
 * the new versions instead of the process-start snapshot (2026-08-18 — a
 * stale cache reported the pre-update version forever, so the update looked
 * perpetually available).
 */
export function clearPackageCache(): void {
  packageCache.clear()
}

/**
 * Resolve one Loader entry to its package.json. `file://` specs walk upward to
 * the nearest directory holding a package.json; `cordis:*` builtins have none.
 * Results are cached per (baseUrl, specifier) — the resolution is a pure read
 * and never changes within a process, so the file I/O happens only once.
 * @param baseUrl - profile directory (the cordis.yml anchor, `ctx.baseUrl`).
 * @param specifier - the Loader entry's module specifier.
 * @returns the parsed package.json and its directory, or null when unresolvable.
 */
export function resolvePackage(
  baseUrl: string,
  specifier: string,
): Promise<{ pkg: PackageJson; dir: string } | null> {
  const key = `${baseUrl}\u0000${specifier}`
  const cached = packageCache.get(key)
  if (cached !== undefined) return cached
  const pending = resolveUncached(baseUrl, specifier)
  packageCache.set(key, pending)
  return pending
}

async function resolveUncached(
  baseUrl: string,
  specifier: string,
): Promise<{ pkg: PackageJson; dir: string } | null> {
  if (specifier.startsWith('file://')) {
    let dir = dirname(fileURLToPath(specifier))
    for (let i = 0; i < 12; i++) {
      const path = join(dir, 'package.json')
      try {
        return { pkg: JSON.parse(await readFile(path, 'utf8')) as PackageJson, dir }
      } catch {
        const parent = dirname(dir)
        if (parent === dir) return null
        dir = parent
      }
    }
    return null
  }
  if (specifier.startsWith('cordis:')) return null
  try {
    const require = createRequire(join(baseUrl, 'package.json'))
    const path = require.resolve(`${specifier}/package.json`)
    return { pkg: JSON.parse(await readFile(path, 'utf8')) as PackageJson, dir: dirname(path) }
  } catch {
    return null
  }
}

/** One Loader entry, the subset this plugin reads. */
export interface LoaderEntryView {
  id: string
  name: string
  disabled: boolean
  group?: boolean
  fiberPhase: string | null
}

/** Build the Remote-ready metadata for one Loader entry. */
export async function buildInstalledPlugin(
  baseUrl: string,
  entry: LoaderEntryView,
): Promise<InstalledPlugin> {
  const resolved = await resolvePackage(baseUrl, entry.name)
  const source = classifySource(entry.name)
  return {
    entryId: entry.id,
    name: entry.name,
    displayName: displayName(entry.name),
    version: resolved?.pkg.version ?? null,
    description: resolved?.pkg.description ?? null,
    source,
    enabled: !entry.disabled,
    fiberPhase: entry.fiberPhase,
    compatRange: resolved === null ? null : dshCompatRange(resolved.pkg),
    repoUrl: resolved === null ? null : (() => {
      const r = resolved.pkg.repository
      if (typeof r === 'string') return r
      if (r !== null && typeof r === 'object' && typeof r.url === 'string') return r.url
      return null
    })(),
    categories: [],
  }
}
