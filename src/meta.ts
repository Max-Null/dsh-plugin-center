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
  /** 作者（package.json author；字符串或对象 name，缺失 null）。 */
  author: string | null
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
  /** npm author 字段（字符串或 { name } 对象）——已安装列表显示作者（2026-09-01）。 */
  author?: string | { name?: string }
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

/** Classify provenance from the specifier shape alone (matches the §4.2 design).
 *  导出供测试:来源分类直接决定「已安装」列表的展示标签(2026-09-01 起修复
 *  @deepseek-ai/cordis-* 被误标「用户安装」)。 */
export function classifySource(specifier: string): PluginSource {
  // @deepseek-ai/cordis-* 是内核 vendored 的 Cordis 生态包(dsh-base 等 bundle
  // 的依赖,如 cordis-plugin-timer/hmr),随 DSH 内核版本管理——不是用户安装的
  // 第三方,归为官方(2026-09-01: 曾被误判 installed,在已安装列表标「用户安装」)。
  if (specifier.startsWith('@deepseek-ai/')) return 'official'
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
    author: resolved === null ? null : (() => {
      const a = resolved.pkg.author
      if (typeof a === 'string') return a !== '' ? a : null
      if (a !== null && typeof a === 'object' && typeof a.name === 'string') return a.name !== '' ? a.name : null
      // npm 包常不写 author 字段但 repository 有 owner（= 作者/组织，如
      // Max-Null、omdsh-dev）——回退提取（2026-09-01 用户实测"显示不全"：
      // 多数包无 author → 界面只有库名无作者）。
      const r = resolved.pkg.repository
      const url = typeof r === 'string' ? r : r !== null && typeof r === 'object' && typeof r.url === 'string' ? r.url : null
      if (url !== null) {
        const m = /github\.com[/:]([^/]+)\/[^/.\#]+/.exec(url)
        if (m !== null && m[1] !== undefined && m[1] !== '') return m[1]
      }
      return null
    })(),
    categories: [],
  }
}
