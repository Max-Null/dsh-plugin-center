/**
 * Update detection, changelog extraction, and install/update execution.
 * npm registry is the primary version source; changelog is commit-history
 * first (many community repos ship no release/tag/CHANGELOG — verified §7.2).
 */
import { spawn } from 'node:child_process'
import { existsSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'
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

/** One pnpm invocation result: success plus a failure detail for diagnostics. */
export interface PnpmResult {
  ok: boolean
  detail: string
}

/** pnpm 候选命令：GUI 进程 PATH 常缺用户级 npm 全局目录；且 Windows 上
 *  CreateProcess 只找 pnpm.exe（.cmd/.ps1 必须经 shell）——2026-08-17 实测
 *  spawn('pnpm', shell:false) 直接 ENOENT，更新永远假成功。 */
export function pnpmCandidates(): string[] {
  const commands = ['pnpm', 'pnpm.cmd']
  const userNpm = join(homedir(), 'AppData', 'Roaming', 'npm')
  for (const name of ['pnpm.cmd', 'pnpm.exe', 'pnpm']) {
    const candidate = join(userNpm, name)
    if (existsSync(candidate)) commands.push(candidate)
  }
  return commands
}

function runOne(command: string, args: readonly string[], cwd: string): Promise<PnpmResult> {
  return new Promise((resolve) => {
    let child
    try {
      // shell: true —— Windows 下 .cmd shim 必须经 shell 才能 spawn；
      // windowsHide —— GUI 宿主下不弹 cmd 窗口（2026-08-18 用户实测闪烁）。
      child = spawn(command, [...args], { cwd, stdio: 'inherit', shell: true, windowsHide: true })
    } catch (e) {
      resolve({ ok: false, detail: e instanceof Error ? e.message : String(e) })
      return
    }
    child.on('error', e => resolve({ ok: false, detail: e.message }))
    child.on('close', code => resolve(code === 0 ? { ok: true, detail: '' } : { ok: false, detail: `exit code ${code ?? 1}` }))
  })
}

/**
 * Run pnpm in the profile directory, trying each candidate command in turn.
 * Output inherits the process stdio (no pipe capture — the host sandbox
 * forbids named-pipe stdio); the exit code is the only result this layer needs.
 */
export async function runPnpm(args: readonly string[], cwd: string): Promise<PnpmResult> {
  let last: PnpmResult = { ok: false, detail: 'no pnpm candidate found' }
  for (const command of pnpmCandidates()) {
    last = await runOne(command, args, cwd)
    if (last.ok) return last
  }
  return last
}

/** Install a package into the web profile, mirroring `dsh plugin add` semantics. */
export async function installPlugin(packageSpec: string, profileDir: string): Promise<PnpmResult> {
  // `-w` is required: every profile ships a pnpm-workspace.yaml.
  return runPnpm(['add', '-w', packageSpec], profileDir)
}

/**
 * Update a package to the given version, mirroring `dsh plugin add <pkg>`.
 * The exact version is required: with a bare package name, pnpm 11's
 * `minimumReleaseAge` supply-chain policy silently refuses a too-recent
 * latest (exit 0, nothing installed) — a false-success update. An explicit
 * `<name>@<version>` pins the target and pnpm records it in
 * `minimumReleaseAgeExclude` itself (2026-08-18, reproduced in-process).
 */
export async function updatePlugin(packageName: string, version: string, profileDir: string): Promise<PnpmResult> {
  return runPnpm(['add', '-w', `${packageName}@${version}`], profileDir)
}
