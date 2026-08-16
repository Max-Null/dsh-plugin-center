/**
 * Update detection, changelog extraction, and install/update execution.
 * npm registry is the primary version source; changelog is commit-history
 * first (many community repos ship no release/tag/CHANGELOG — verified §7.2).
 */
import { spawn } from 'node:child_process'
import { compareVersions, satisfies } from './semver.ts'

/** A detected update for one installed plugin. */
export interface UpdateDigest {
  name: string
  fromVersion: string
  toVersion: string
  changelog: string[]
  compat: 'compatible' | 'incompatible' | 'unknown'
  compatRange: string | null
}

const UA = { 'User-Agent': 'dsh-plugin-center' }

/** Latest published version on the npm registry; null when unreachable/unpublished. */
export async function npmLatest(packageName: string): Promise<string | null> {
  for (const registry of ['https://registry.npmjs.org', 'https://registry.npmmirror.com']) {
    try {
      const res = await fetch(`${registry}/${packageName}/latest`, {
        signal: AbortSignal.timeout(8000),
      })
      if (res.ok) return (await res.json() as { version?: string }).version ?? null
    } catch { /* next registry */ }
  }
  return null
}

/** Extract owner/repo from a package.json repository field. */
function repoOf(repoUrl: string | null): { owner: string; repo: string } | null {
  if (repoUrl === null) return null
  const match = /github\.com[/:]([^/]+)\/([^/.#]+)/.exec(repoUrl)
  if (match === null) return null
  return { owner: match[1]!, repo: match[2]! }
}

/** Commit-message changelog: the reliable source for repos without release notes. */
export async function fetchCommitChangelog(repoUrl: string | null, sinceIso: string): Promise<string[]> {
  const repo = repoOf(repoUrl)
  if (repo === null) return []
  try {
    const res = await fetch(
      `https://api.github.com/repos/${repo.owner}/${repo.repo}/commits?since=${encodeURIComponent(sinceIso)}&per_page=20`,
      { headers: UA, signal: AbortSignal.timeout(15000) },
    )
    if (!res.ok) return []
    const commits = await res.json() as { commit: { message: string } }[]
    return commits.map(c => c.commit.message.split('\n')[0]!).filter(line => line !== '')
  } catch {
    return []
  }
}

/**
 * Detect one plugin's update: compare local vs remote version, pull commit
 * changelog since `sinceIso`, and check DSH compatibility against the local
 * DSH version via the plugin's peer-dependency range.
 */
export async function detectUpdate(
  name: string,
  localVersion: string,
  repoUrl: string | null,
  compatRange: string | null,
  localDshVersion: string,
  sinceIso: string,
): Promise<UpdateDigest | null> {
  const latest = await npmLatest(name)
  if (latest === null || compareVersions(latest, localVersion) <= 0) return null
  let compat: UpdateDigest['compat'] = 'unknown'
  if (compatRange !== null) {
    compat = satisfies(localDshVersion, compatRange) ? 'compatible' : 'incompatible'
  }
  return {
    name,
    fromVersion: localVersion,
    toVersion: latest,
    changelog: await fetchCommitChangelog(repoUrl, sinceIso),
    compat,
    compatRange,
  }
}

/**
 * Run pnpm in the profile directory. Output inherits the process stdio (no
 * pipe capture — the host sandbox forbids named-pipe stdio); the exit code is
 * the only result this layer needs.
 * @returns the child exit code, or 1 when spawn itself fails.
 */
export function runPnpm(args: readonly string[], cwd: string): Promise<number> {
  return new Promise((resolve) => {
    let child
    try {
      child = spawn('pnpm', [...args], { cwd, stdio: 'inherit', shell: false })
    } catch {
      resolve(1)
      return
    }
    child.on('error', () => resolve(1))
    child.on('close', code => resolve(code ?? 1))
  })
}

/** Install a package into the web profile, mirroring `dsh plugin add` semantics. */
export async function installPlugin(packageSpec: string, profileDir: string): Promise<boolean> {
  // `-w` is required: every profile ships a pnpm-workspace.yaml.
  const code = await runPnpm(['add', '-w', packageSpec], profileDir)
  return code === 0
}

/** Update a package to latest, mirroring `dsh plugin add <pkg>` (pnpm installs latest). */
export async function updatePlugin(packageName: string, profileDir: string): Promise<boolean> {
  const code = await runPnpm(['add', '-w', packageName], profileDir)
  return code === 0
}
