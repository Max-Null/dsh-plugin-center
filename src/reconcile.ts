/**
 * Post-install reconciliation: after a successful `pnpm add`, figure out
 * which dependency actually appeared, register it as a bundle when the
 * package ships `dsh.bundle.patch` (mirroring `dsh plugin add`'s
 * reconcilePlugins — without this the loader never mounts the plugin and
 * "restart to take effect" is a lie), and honestly report repos that are
 * NOT plugin packages at all (no manifest, e.g. pnpm's placeholder for a
 * repo without package.json like Deepseek-Harness-EAC, 2026-08-22).
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

interface ProfileManifest {
  dependencies?: Record<string, string>
  dsh?: { profile?: { bundles?: string[] } }
}

interface InstalledManifest {
  name?: unknown
  _pnpmPlaceholder?: unknown
  dsh?: { bundle?: { patch?: unknown } }
}

/** Snapshot of the profile's declared dependencies (keys only). */
export function readDependencyKeys(profileDir: string): ReadonlySet<string> {
  try {
    const pkg = JSON.parse(readFileSync(join(profileDir, 'package.json'), 'utf8')) as ProfileManifest
    return new Set(Object.keys(pkg.dependencies ?? {}))
  } catch {
    return new Set()
  }
}

/** Human feedback for the install toast, joined by `；`. */
export interface ReconcileOutcome {
  note: string
}

/**
 * Compare the dependency set against `before`; for each new entry, read the
 * installed manifest and either register the bundle or report the truth.
 * Best-effort: never throws (the install itself already succeeded).
 */
export function reconcileInstalled(profileDir: string, before: ReadonlySet<string>): ReconcileOutcome {
  const notes: string[] = []
  const pkgPath = join(profileDir, 'package.json')
  let pkg: ProfileManifest
  try {
    pkg = JSON.parse(readFileSync(pkgPath, 'utf8')) as ProfileManifest
  } catch {
    return { note: '' }
  }
  const added = Object.keys(pkg.dependencies ?? {}).filter(name => !before.has(name))
  for (const name of added) {
    const dir = join(profileDir, 'node_modules', name)
    if (!existsSync(dir)) continue
    let manifest: InstalledManifest | null = null
    try {
      manifest = JSON.parse(readFileSync(join(dir, 'package.json'), 'utf8')) as InstalledManifest
    } catch {
      manifest = null
    }
    if (manifest === null || typeof manifest.name !== 'string' || manifest._pnpmPlaceholder !== undefined) {
      notes.push(`「${name}」已下载，但该仓库不是插件包（无插件入口），不会被 DSH 加载`)
      continue
    }
    const isBundle = manifest.dsh?.bundle?.patch !== undefined
    if (isBundle) {
      const bundles = pkg.dsh?.profile?.bundles
      if (!Array.isArray(bundles) || !bundles.includes(name)) {
        if (!pkg.dsh) pkg.dsh = {}
        if (!pkg.dsh.profile) pkg.dsh.profile = {}
        const list = Array.isArray(bundles) ? bundles : []
        list.push(name)
        pkg.dsh.profile.bundles = list
        try {
          writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n')
          notes.push(`「${name}」已安装并注册，重启后生效`)
        } catch {
          notes.push(`「${name}」已安装（注册失败，需手动加入 dsh.profile.bundles）`)
        }
      } else {
        notes.push(`「${name}」已安装`)
      }
    } else {
      notes.push(`「${name}」已安装为依赖（非 bundle 插件，未注册加载）`)
    }
  }
  return { note: notes.join('；') }
}
