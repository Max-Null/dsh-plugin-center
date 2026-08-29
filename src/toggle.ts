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

import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

export interface ToggleResult {
  ok: boolean
  detail: string
  /** The patch layer's stance after the write, or null when refused. */
  nowDisabled: boolean | null
}

/** Host infrastructure rows: disabling any of these breaks the very chain
 *  the patch layer runs on. Same list dsh-market uses. */
const PROTECTED_PATTERNS: RegExp[] = [
  /^cordis:/u,
  /^@deepseek-ai\/cordis-plugin-/u,
  /^@deepseek-ai\/dsh-host-/u,
  /^@deepseek-ai\/dsh-client-modules$/u,
  /^@deepseek-ai\/dsh-client-connection$/u,
  /^@deepseek-ai\/dsh-client-hmr$/u,
  /^@deepseek-ai\/dsh-client-runtime$/u,
  /^@deepseek-ai\/dsh-client-locale$/u,
  /^@deepseek-ai\/dsh-client-web/u,
  /^@deepseek-ai\/dsh-web-frontend$/u,
  /^@deepseek-ai\/dsh-app-boot$/u,
  /^@deepseek-ai\/dsh-base$/u,
  /^@deepseek-ai\/dsh-web-app$/u,
]

function isProtected(id: string): boolean {
  return PROTECTED_PATTERNS.some(pattern => pattern.test(id))
}

/**
 * Patch rows address a loader row by its ORIGINAL patch id, but the Loader
 * expands `insert` children into runtime ids like `include:<id>`
 * (2026-08-22 chinese-thinking 实证：写入 `include:chinese-thinking` 行
 * 组合后不匹配任何行 → 禁用不生效；写入 `chinese-thinking` 即生效）。
 * Strip the prefix so every entry we toggle writes a row the composition
 * actually matches; non-insert rows are unaffected.
 */
function patchRowId(entryId: string): string {
  return entryId.replace(/^include:/u, '')
}

/** Official bundle entry ids (timer/llm/session/… from dsh-base and
 *  dsh-web-app patch inserts): disabling these breaks the core chain, so
 *  they refuse to toggle alongside the pattern-based protection above. */
function officialEntryIds(profileDir: string): Set<string> {
  const ids = new Set<string>()
  for (const pkg of ['@deepseek-ai/dsh-base', '@deepseek-ai/dsh-web-app']) {
    try {
      const patchPath = join(profileDir, 'node_modules', pkg, 'cordis.patch.yml')
      if (!existsSync(patchPath)) continue
      const text = readFileSync(patchPath, 'utf8')
      for (const match of text.matchAll(/^- id:\s*(\S+)\s*$/gmu)) ids.add(match[1]!)
    } catch { /* best-effort */ }
  }
  return ids
}

/** What the user patch layer currently says about every row id. */
export function readDisabledState(patchPath: string): Map<string, boolean> {
  const state = new Map<string, boolean>()
  let text = ''
  try {
    text = existsSync(patchPath) ? readFileSync(patchPath, 'utf8') : ''
  } catch {
    return state
  }
  let current: string | null = null
  for (const line of text.split('\n')) {
    const row = /^- id:\s*(\S+)\s*$/u.exec(line)
    if (row !== null) {
      current = row[1]!
      continue
    }
    if (current === null) continue
    const disabled = /^ {2}disabled:\s*(true|false)\s*$/u.exec(line)
    if (disabled !== null) {
      state.set(current, disabled[1] === 'true')
      current = null
    }
  }
  return state
}

/** Escape a literal for use inside a RegExp (plugin names may contain `.` etc.). */
export function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&')
}

/**
 * Address a `dsh plugin add` install-list insert child by name: an id-less
 * child (`    - name: X`, 4-space indent under `- insert:`) gets upgraded in
 * place to a stable-id form (`    - id: X` + `      name: X`), then a
 * `- id: X / disabled: <bool>` row is appended. A child that already carries
 * the stable id (`    - id: X`) just gets the row appended (the upgrade must
 * not regress to a random runtime id). The insert block always stays before
 * the appended row, so applyEntryPatches registers the id before the toggle
 * row reads it. Returns false when nothing matches (or `name` is empty) —
 * callers must refuse the write, never append blindly.
 */
function patchInsertChildByName(lines: string[], name: string, disabled: boolean): boolean {
  if (name === '') return false
  const idPattern = new RegExp(`^ {4}- id: ${escapeRegExp(name)}$`, 'u')
  const namePattern = new RegExp(`^ {4}- name: ${escapeRegExp(name)}$`, 'u')
  let found = false
  for (let i = 0; i < lines.length; i++) {
    if (namePattern.test(lines[i]!)) {
      // 无 id 子条目 → 原地升级为稳定 id（4 空格 + 6 空格 name）。
      lines[i] = `    - id: ${name}\n      name: ${name}`
      found = true
      break
    }
    if (idPattern.test(lines[i]!)) {
      // 已是稳定 id 子条目 → 无需升级，直接追加禁用行。
      found = true
      break
    }
  }
  if (!found) return false
  const tail = lines.length > 0 && lines[lines.length - 1] !== '' ? '\n' : ''
  lines.push(`${tail}- id: ${name}\n  disabled: ${String(disabled)}`)
  return true
}

/**
 * Resolve a profile-bundle plugin's loader entry id.
 *
 * Profile bundles (`dsh.profile.bundles`) are composed by applying each
 * bundle's own `cordis.patch.yml` over the root; the entry id a toggle must
 * target lives in THAT file, not in the profile patch layer. Returns the
 * insert child id whose `name` matches the package name, or null when the
 * package is not a profile bundle (or its patch cannot be read/parsed).
 */
function bundleEntryId(profileDir: string, name: string): string | null {
  try {
    const manifest = JSON.parse(readFileSync(join(profileDir, 'package.json'), 'utf8')) as {
      dsh?: { profile?: { bundles?: unknown } }
    }
    const bundles = manifest.dsh?.profile?.bundles
    if (!Array.isArray(bundles) || !bundles.includes(name)) return null
    // A bundle's patch declares the insert child that carries the entry id.
    const patchPath = join(profileDir, 'node_modules', ...name.split('/'), 'cordis.patch.yml')
    const text = readFileSync(patchPath, 'utf8')
    const idPattern = /^ {4}- id: (\S+)\s*$/gmu
    const idLines = [...text.matchAll(idPattern)].map(match => match[1]!)
    return idLines.length > 0 ? idLines[0]! : null
  } catch {
    return null
  }
}

/** Serialize toggles so concurrent writes cannot interleave. */
let toggleChain: Promise<unknown> = Promise.resolve()

/**
 * Effective disabled stance for install-list display: the profile patch
 * layer is the toggle source of truth (rows written by setDisabled), and
 * the Loader's own `entry.disabled` is unreliable for profile-bundle
 * plugins (they report disabled even when the bundle enables them).
 * Order: patch row by entry id (include: stripped) → patch row by the
 * bundle-declared id → enabled by default.
 */
export function effectiveDisabledStance(profileDir: string, entryId: string, name: string): boolean {
  const stance = readDisabledState(join(profileDir, 'cordis.patch.yml'))
  return stance.get(patchRowId(entryId))
    ?? stance.get(bundleEntryId(profileDir, name) ?? '')
    ?? false
}

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
export function setDisabled(profileDir: string, entryId: string, name: string, disabled: boolean): Promise<ToggleResult> {
  const run = toggleChain.then(async (): Promise<ToggleResult> => {
    // Loader runtime ids (include:<id>) never match patch composition —
    // always address rows by their original patch id.
    const id = patchRowId(entryId)
    if (isProtected(id) || officialEntryIds(profileDir).has(id)) {
      return { ok: false, detail: `"${id}" is host infrastructure and cannot be disabled`, nowDisabled: null }
    }
    const patchPath = join(profileDir, 'cordis.patch.yml')
    const current = readDisabledState(patchPath)
    if (current.get(id) === disabled) {
      return { ok: true, detail: `"${id}" is already ${disabled ? 'disabled' : 'enabled'}`, nowDisabled: disabled }
    }
    let text = ''
    try {
      text = existsSync(patchPath) ? readFileSync(patchPath, 'utf8') : ''
    } catch (error) {
      return { ok: false, detail: `read ${patchPath} failed: ${String(error)}`, nowDisabled: null }
    }
    // Malformed guard: skip comment/blank lines first — the shipped profile
    // patch file opens with a comment block and an empty `[]` array, both of
    // which are legal. A non-empty significant first line that is neither an
    // entry (`- …`) nor the empty array means a file we must not touch.
    const significant = text.split('\n').map(line => line.trim()).filter(line => line !== '' && !line.startsWith('#'))
    if (significant.length > 0 && !significant[0]!.startsWith('- ') && significant[0] !== '[]') {
      return { ok: false, detail: 'cordis.patch.yml is not a plain entry list; refusing to modify it', nowDisabled: null }
    }
    const lines = text === '' ? [] : text.split('\n')
    const out: string[] = []
    let patched = false
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]!
      // The empty-array placeholder: appending entries to a file that still
      // holds `[]` would produce invalid YAML, so the placeholder is dropped
      // once the first real entry lands.
      if (line.trim() === '[]') continue
      const row = /^- id:\s*(\S+)\s*$/u.exec(line)
      if (row !== null && row[1] === id) {
        // Find the row's disabled line (immediately after, if present) and
        // replace it; otherwise insert one right after the id line.
        out.push(line)
        const next = lines[i + 1]
        if (next !== undefined && /^ {2}disabled:\s*(true|false)\s*$/u.test(next)) {
          out.push(`  disabled: ${String(disabled)}`)
          i++
        } else {
          out.push(`  disabled: ${String(disabled)}`)
        }
        patched = true
        continue
      }
      out.push(line)
    }
    if (!patched) {
      // 2026-08-25 禁用失效根因：id-less insert 子条目每次启动拿随机运行时
      // id，按它追加的禁用行重启后永远匹配不到（applyEntryPatches warn 后
      // 静默跳过）。所以这里绝不静默追加：先按 name 寻址 insert 子条目行，
      // 原地升级为稳定 id 再追加；都找不到 → 拒绝（不写文件）。
      if (!patchInsertChildByName(out, name, disabled)) {
        // 2026-08-29 bundle 兼容：dsh.profile.bundles 启用的插件在 profile
        // patch 里没有 `- id:` 行（entry id 声明在各个 bundle 自己的
        // cordis.patch.yml 里）。按 bundle 声明 id 追加 disabled 行即可
        // 覆盖；默认启用态（disabled=false）无需写文件。
        const bundleId = bundleEntryId(profileDir, name)
        if (bundleId !== null) {
          if (!disabled) {
            return { ok: true, detail: `"${name}" is enabled by profile bundle`, nowDisabled: false }
          }
          const tail = out.length > 0 && out[out.length - 1] !== '' ? '\n' : ''
          out.push(`${tail}- id: ${bundleId}\n  disabled: true`)
          patched = true
        } else if (/^[0-9a-f]{8}$/u.test(id)) {
          return {
            ok: false,
            detail: `entry "${id}" has no stable patch id (random runtime id); ` +
              'edit cordis.patch.yml to give its insert child an explicit id',
            nowDisabled: null,
          }
        } else {
          return { ok: false, detail: `no patch row or insert child matches "${id}"`, nowDisabled: null }
        }
      }
      patched = true
    }
    try {
      writeFileSync(patchPath, out.join('\n') + '\n')
    } catch (error) {
      return { ok: false, detail: `write ${patchPath} failed: ${String(error)}`, nowDisabled: null }
    }
    return { ok: true, detail: '', nowDisabled: disabled }
  })
  toggleChain = run.catch(() => {})
  return run
}
