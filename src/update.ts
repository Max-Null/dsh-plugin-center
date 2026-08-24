/**
 * Update detection, changelog extraction, and install/update execution.
 * npm registry is the primary version source; changelog is commit-history
 * first (many community repos ship no release/tag/CHANGELOG — verified §7.2).
 */
import { spawn } from 'node:child_process'
import { appendFileSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
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
  /** Wall-clock duration of the pnpm process (slow-but-successful is common). */
  durationMs: number
  /** True when the update was installed DIRECTLY (files on disk now; a
   *  restart makes the running DSH pick them up), no locks were hit. */
  direct?: boolean
  /** True when the update changed no host-side files (only the browser
   *  bundle, which client-hmr hot-swaps): no restart is needed. Absent when
   *  the package dir is missing or the snapshot could not be taken. */
  hot?: boolean
  /** True when the update was only PREPARED (downloaded to the pending dir)
   *  and the real install is queued for the next SSiD/DSH startup. */
  pending?: boolean
  /** Non-SSiD locked-update fallback: the CLI command the user should run
   *  after closing DSH (community-market style). */
  command?: string
}

// ── 两段式更新（2026-08-22）：预下载 + 重启时安装 ────────────────────────
// SSiD/DSH 运行中替换 node_modules 里的原生模块（node-pty 的 conpty.node
// 等）会被 Windows 锁死（EPERM：rename tmp -> 目标 失败）。与「禁用插件
// 写 patch + 重启生效」同款两段式：
//   1. 现在：npm pack 把 <name>@<version> 下载到 ~/.ssid/pending-plugin-updates/
//      （不动 node_modules，无锁；网络/版本问题此刻暴露）；
//   2. 重启（SSiD 启动、boot DSH 之前）：shell/kernel.ts 消费清单，用
//      `pnpm add -w <name>@<version>` 安装（无锁窗口、store 已缓存）。
// 注意：pnpm pack 只能打当前项目，远程 registry 包必须用 npm pack
// （2026-08-22 实测两者行为差异）。tgz 命名（npm pack 实测）：
//   普通包 <name>-<version>.tgz；scope 包 <scope>-<name>-<version>.tgz。
const PENDING_DIR = join(homedir(), '.ssid', 'pending-plugin-updates')
const PENDING_INDEX = join(PENDING_DIR, 'index.json')

/** One queued update: prepared tarball + install spec for the next boot. */
export interface PendingUpdate {
  name: string
  version: string
  tgz: string
  at: number
}

/** npm pack 生成的 tgz 文件名（scope 包的 @ 与 / 均转 -）。 */
export function tarballNameOf(name: string, version: string): string {
  return `${name.startsWith('@') ? name.slice(1).replace('/', '-') : name}-${version}.tgz`
}

export function pendingUpdateDir(): string {
  return PENDING_DIR
}

export function readPendingUpdates(): PendingUpdate[] {
  try {
    const parsed = JSON.parse(readFileSync(PENDING_INDEX, 'utf8')) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed.filter((entry: unknown): entry is PendingUpdate => {
      const e = entry as Partial<PendingUpdate> | null
      return e !== null && typeof e.name === 'string' && typeof e.version === 'string' && typeof e.tgz === 'string'
    })
  } catch {
    return []
  }
}

export function writePendingUpdates(entries: PendingUpdate[]): void {
  mkdirSync(PENDING_DIR, { recursive: true })
  writeFileSync(PENDING_INDEX, JSON.stringify(entries, null, 2) + '\n')
}

/** npm 候选命令：优先 PATH，回退用户级 npm 全局目录（同 pnpmCandidates 策略）。 */
function npmCandidates(): string[] {
  const commands = ['npm', 'npm.cmd']
  const userNpm = join(homedir(), 'AppData', 'Roaming', 'npm')
  for (const name of ['npm.cmd', 'npm.exe', 'npm']) {
    const candidate = join(userNpm, name)
    if (existsSync(candidate)) commands.push(candidate)
  }
  return commands
}

/** Run `npm pack <spec>` into the pending dir and record the queued update.
 *  @returns the pnpm-style result with `pending: true` on success. */
export async function preparePluginUpdate(name: string, version: string, profileDir: string): Promise<PnpmResult> {
  const spec = `${name}@${version}`
  const tgz = join(PENDING_DIR, tarballNameOf(name, version))
  // 清理同包其他版本的残留 tgz（保留同 name 最新一次准备）
  try {
    for (const file of readdirSync(PENDING_DIR)) {
      if (file.endsWith('.tgz') && file !== tarballNameOf(name, version)) {
        rmSync(join(PENDING_DIR, file), { force: true })
      }
    }
  } catch { /* pending dir absent is fine */ }

  let last: PnpmResult = { ok: false, detail: 'no npm candidate found', durationMs: 0 }
  for (const command of npmCandidates()) {
    last = await runOne(command, ['pack', spec, '--pack-destination', PENDING_DIR], profileDir)
    if (last.ok) break
  }
  logPnpm(profileDir, ['npm', 'pack', spec, '--pack-destination', PENDING_DIR], last)
  if (last.ok && existsSync(tgz)) {
    const entries = readPendingUpdates().filter(entry => !(entry.name === name && entry.version === version))
    entries.push({ name, version, tgz, at: Date.now() })
    writePendingUpdates(entries)
    return { ...last, pending: true }
  }
  // 失败：detail 里已带 npm 输出（网络/版本问题此时暴露，无需重启才发现）
  return last
}

/**
 * Append one pnpm operation to `<profileDir>/plugin-center-pnpm.log`: time,
 * command, cwd, exit, duration, and the captured output tail. Every install
 * and update lands here regardless of success, so a problem on any machine
 * can be diagnosed by copying the log (2026-08-22: SSiD 更新慢/失败复盘需要
 * 现场证据；日志写失败绝不影响主流程）。
 */
export function logPnpm(profileDir: string, args: readonly string[], result: PnpmResult): void {
  try {
    const file = join(profileDir, 'plugin-center-pnpm.log')
    const line = [
      `${new Date().toISOString()} $ pnpm ${args.join(' ')}`,
      `  cwd=${profileDir}`,
      `  ${result.ok ? 'ok' : 'FAIL'} duration=${result.durationMs}ms`,
      result.detail === '' ? '' : `  ${result.detail.split('\n').map(s => `  ${s}`).join('\n')}`,
      '---',
      '',
    ].join('\n')
    appendFileSync(file, line)
  } catch { /* logging must never break the install path */ }
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

/** 归档 profile 的 node_modules 由 pnpm `<major>` 生成（SSiD 部署时把构建机
 *  store 元数据改写成本机路径且保留 major 后缀——shell/main.mjs rewire）。
 *  若执行机全局 pnpm 是另一个 major（常见：机器装 pnpm 10，归档是 pnpm 11
 *  打的），任何 pnpm 操作都报 ERR_PNPM_UNEXPECTED_STORE（不同 major 的 store
 *  目录不兼容）。这里从 `.modules.yaml` 探测布局用的 major，候选命令里追
 *  加 `npx --yes pnpm@<major>`（npx 拉取同 major CLI，之后走 npm 缓存），
 *  保证以「与布局一致」的 pnpm 执行更新。
 *  @returns 布局的 pnpm major（如 11），读不到时 undefined。
 */
export function detectStoreMajor(profileDir: string): number | undefined {
  try {
    const meta = readFileSync(join(profileDir, 'node_modules', '.modules.yaml'), 'utf8')
    // JSON 转义（\\v11）与 YAML 字面（\v11）两种形态都覆盖。
    const match = /storeDir[^\n]*store[\\/]+v?(\d+)/.exec(meta)
    if (match === null) return undefined
    return Number(match[1])
  } catch {
    return undefined
  }
}

/** 完整 pnpm 命令候选序列：壳内捆绑 pnpm（SSID_PNPM，与归档 store 布局同
 *  major）最优先；本地 pnpm（PATH/用户级）其次；最终以 npx pnpm@<major>
 *  兜底（仅当探测到布局 major）。 */
export function pnpmCommandCandidates(profileDir: string): string[] {
  const commands: string[] = []
  const bundled = process.env.SSID_PNPM
  if (bundled !== undefined && bundled !== '') commands.push(bundled)
  commands.push(...pnpmCandidates())
  const major = detectStoreMajor(profileDir)
  if (major !== undefined) {
    commands.push(`npx --yes pnpm@${major}`)
  }
  return commands
}

function runOne(command: string, args: readonly string[], cwd: string): Promise<PnpmResult> {
  return new Promise((resolve) => {
    let child
    try {
      // shell: true —— Windows 下 .cmd shim 必须经 shell 才能 spawn；
      // command 与 args 合并为整行（command 可能是多词命令，如
      // `npx --yes pnpm@11`；args 是内部生成的固定形态，无注入面）。
      // windowsHide —— GUI 宿主下不弹 cmd 窗口（2026-08-18 用户实测闪烁）。
      // stdio 走默认 pipe：捕获 pnpm 输出，失败时把尾部输出放进 detail
      // （2026-08-22 起——此前 inherit 只有 exit code，SSiD 下更新失败
      // 无法诊断；宿主进程（web/electron）非 DSH 工具沙箱，pipe 可用）。
      child = spawn([command, ...args].join(' '), { cwd, shell: true, windowsHide: true })
    } catch (e) {
      resolve({ ok: false, detail: e instanceof Error ? e.message : String(e), durationMs: 0 })
      return
    }
    const started = Date.now()
    // 15 分钟硬超时：pnpm 可能卡在 supply-chain 全量验证/网络重试上
    // （2026-08-22 SSiD 下「更新中」长时间不结束的防御），超时杀掉并报错。
    let timedOut = false
    const timer = setTimeout(() => {
      timedOut = true
      child.kill()
    }, 15 * 60_000)
    let out = ''
    child.stdout?.on('data', (d: Buffer) => { out += d.toString() })
    child.stderr?.on('data', (d: Buffer) => { out += d.toString() })
    child.on('error', e => { clearTimeout(timer); resolve({ ok: false, detail: e.message, durationMs: Date.now() - started }) })
    child.on('close', code => {
      clearTimeout(timer)
      const durationMs = Date.now() - started
      if (code === 0) resolve({ ok: true, detail: '', durationMs })
      const tail = out.trim()
      const header = timedOut ? 'timed out after 15 minutes' : `exit code ${code ?? 1}`
      resolve({ ok: false, detail: `${header}${tail === '' ? '' : `\n${tail.slice(-4000)}`}`, durationMs })
    })
  })
}

/**
 * Run pnpm in the profile directory, trying each candidate command in turn.
 * Output is captured (no named-pipe stdio — the host process is the web or
 * electron main process, not the DSH tool sandbox); the exit code and the
 * captured tail are the result this layer returns, and every attempt is
 * appended to the profile's plugin-center-pnpm.log.
 */
export async function runPnpm(args: readonly string[], cwd: string): Promise<PnpmResult> {
  let last: PnpmResult = { ok: false, detail: 'no pnpm candidate found', durationMs: 0 }
  for (const command of pnpmCommandCandidates(cwd)) {
    last = await runOne(command, args, cwd)
    if (last.ok) break
  }
  // 自更新鸡生蛋兜底提示：所有候选都失败且是 store 版本不匹配时，把可复制
  // 的手动命令放进 detail，用户按提示在 profile 目录执行即可（2026-08-23
  // 另一台电脑 v10/v11 实测——旧 host 无自动兜底，需要一条显式命令）。
  if (!last.ok && last.detail.includes('ERR_PNPM_UNEXPECTED_STORE')) {
    const major = detectStoreMajor(cwd)
    if (major !== undefined) {
      last.detail += `\n\nHint: 在 profile 目录（${cwd}）执行：\n  npx --yes pnpm@${major} ${args.join(' ')}`
    }
  }
  logPnpm(cwd, args, last)
  return last
}

/** Install a package into the web profile, mirroring `dsh plugin add` semantics. */
export async function installPlugin(packageSpec: string, profileDir: string): Promise<PnpmResult> {
  // `-w` is required: every profile ships a pnpm-workspace.yaml.
  return runPnpm(['add', '-w', packageSpec], profileDir)
}

/** One host-side file identity: relative path + content hash. */
export interface FileIdentity {
  path: string
  hash: string
}

/** Resolve `exports["./client"]` exactly like client-modules does (string or
 *  { default }): the browser bundle path, relative to the package dir. */
function clientBundleRel(pkgDir: string): string | null {
  try {
    const pkg = JSON.parse(readFileSync(join(pkgDir, 'package.json'), 'utf8')) as Record<string, unknown>
    const exp = pkg.exports
    if (exp !== null && typeof exp === 'object') {
      const client = (exp as Record<string, unknown>)['./client']
      if (typeof client === 'string') return client.replace(/^\.\//, '')
      if (client !== null && typeof client === 'object') {
        const d = (client as Record<string, unknown>).default
        if (typeof d === 'string') return d.replace(/^\.\//, '')
      }
    }
  } catch { /* unreadable package.json: fall through to name-based rules */ }
  return null
}

/** True when the file never needs a host restart: the browser bundle (exact
 *  exports path or legacy name), source maps, type declarations, docs/assets,
 *  images. Conservative direction: a missed exclusion only adds a restart
 *  (false negative), never removes one (false positive). */
function snapshotExcluded(rel: string, isDir: boolean, clientRels: ReadonlySet<string>): boolean {
  // join() produces backslashes on Windows; normalize for set membership.
  const norm = rel.replace(/\\/g, '/')
  const name = norm.split('/').pop()!
  if (name === 'node_modules' || name === 'docs' || name === 'assets') return true
  if (isDir) return false
  if (clientRels.has(norm)) return true
  if (name === 'client.js' || name === 'client.mjs') return true
  if (name.endsWith('.map') || name.endsWith('.d.ts')) return true
  if (/[.](png|jpe?g|gif|webp|svg|ico)$/i.test(name)) return true
  if (/^(README|LICENSE|CHANGELOG|UNLICENSE)(\..*)?$/i.test(name)) return true
  return false
}

/** Hash every host-runtime file under a package dir, excluding the browser
 *  bundle (hot-swappable via client-hmr) and doc/type artifacts. The installed
 *  package lives inside the running profile's node_modules, so the diff tells
 *  whether the update touched only bundle files or also host code. The
 *  package.json version bump is normalized away — installed-version metadata
 *  changes on every update and has no runtime effect. Returns null when the
 *  dir is absent or unreadable.
 */
export function snapshotHostFiles(pkgDir: string): FileIdentity[] | null {
  try {
    if (!existsSync(pkgDir) || !statSync(pkgDir).isDirectory()) return null
  } catch {
    return null
  }
  const clientRels = new Set<string>()
  const clientRel = clientBundleRel(pkgDir)
  if (clientRel !== null) clientRels.add(clientRel)
  const out: FileIdentity[] = []
  const walk = (dir: string, prefix: string): void => {
    let entries: string[] = []
    try { entries = readdirSync(dir) } catch { return }
    for (const name of entries) {
      const full = join(dir, name)
      const rel = prefix === '' ? name : join(prefix, name)
      let st
      try { st = statSync(full) } catch { continue }
      if (snapshotExcluded(rel, st.isDirectory(), clientRels)) continue
      if (st.isDirectory()) {
        walk(full, rel)
        continue
      }
      try {
        let data = readFileSync(full)
        if (name === 'package.json') {
          // Installed-version metadata changes on every update; strip it so a
          // pure bundle update still compares equal.
          const pkg = JSON.parse(data.toString('utf8')) as Record<string, unknown>
          delete pkg.version
          data = Buffer.from(JSON.stringify(pkg), 'utf8')
        }
        const hash = createHash('sha256').update(data).digest('hex')
        out.push({ path: rel, hash })
      } catch { /* unreadable file: ignore */ }
    }
  }
  walk(pkgDir, '')
  return out
}

/** True when the two snapshots disagree (host-side code changed). */
export function hostFilesChanged(before: FileIdentity[], after: FileIdentity[]): boolean {
  const a = new Map(before.map(i => [i.path, i.hash]))
  const b = new Map(after.map(i => [i.path, i.hash]))
  if (a.size !== b.size) return true
  for (const [path, hash] of a) {
    if (b.get(path) !== hash) return true
  }
  return false
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
  const pkgDir = join(profileDir, 'node_modules', packageName)
  const before = snapshotHostFiles(pkgDir)
  const result = await runPnpm(['add', '-w', `${packageName}@${version}`], profileDir)
  if (result.ok && before !== null && before.length > 0) {
    const after = snapshotHostFiles(pkgDir)
    if (after !== null && !hostFilesChanged(before, after)) {
      result.hot = true
    }
  }
  return result
}
