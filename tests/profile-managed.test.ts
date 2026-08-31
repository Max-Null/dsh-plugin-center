/**
 * 更新检测「profile 直接声明」过滤的回归测试（2026-09-01）。
 *
 * 背景：@deepseek-ai/cordis-plugin-timer / cordis-plugin-hmr 是内核 dsh-base
 * bundle 的 cordis.patch.yml insert 条目（vendor\timer、vendor\hmr 经
 * workspace:^ 进 packages/bundle/base），由 DSH 内核版本管理，profile 无
 * 实体。classifySource 只看 specifier 前缀，把它们误判为 installed source，
 * 混入 checkUpdates 更新列表（npm 小版本漂移每次都误报，LLM 更新据此误判
 * 「安装位置不符」白跑）。
 *
 * 判据（engine.ts checkUpdates + llmUpdatePrepare 共用）：只检测 profile
 * package.json 直接声明的 dependencies；不在里面的（= 内核 bundle 间接引入
 * 的内部插件）一律不参与更新检测/LLM 更新入口。
 *
 * 正反对照：本文件同时断言「timer/hmr 被排除」（负例）与「正常插件保留」
 * （正例）——只断言排除会掩盖「过滤把一切干掉的 bug」，两组缺一不可。
 */
import { describe, expect, it, afterEach } from 'vitest'
import { readDependencyKeys } from '../src/reconcile.ts'
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

/** 模拟一个只直接声明正常插件、不含内核 bundle 内部项的 profile。 */
function makeProfile(): string {
  const dir = mkdtempSync(join(tmpdir(), 'pc-managed-'))
  writeFileSync(join(dir, 'package.json'), JSON.stringify({
    dependencies: {
      'dsh-x': '^0.4.0',
      '@max-null/dsh-memory': '0.6.0',
      'ds-harness-remote': '0.4.2',
    },
  }))
  return dir
}

/** 模拟 checkUpdates 的候选过滤（engine.ts：UPDATABLE = installed/local + 版本已知 + 在依赖声明里）。 */
function filterCandidates(managed: ReadonlySet<string>, installed: { name: string; version: string | null; source: string }[]) {
  const UPDATABLE = new Set(['installed', 'local'])
  return installed.filter(p => UPDATABLE.has(p.source) && p.version !== null && managed.has(p.name))
}

const BUNDLE_INTERNAL = [
  // 修复后 classifySource 判 @deepseek-ai/cordis-* 为 official(2026-09-01):
  // 在真实环境它们已经从源头(来源分类+UPDATABLE)被排除,与 managed 过滤双保险。
  { name: '@deepseek-ai/cordis-plugin-timer', version: '1.1.3', source: 'official' },
  { name: '@deepseek-ai/cordis-plugin-hmr', version: '1.0.16', source: 'official' },
]
const PROFILE_PLUGINS = [
  { name: 'dsh-x', version: '0.4.0', source: 'installed' },
  { name: '@max-null/dsh-memory', version: '0.6.0', source: 'installed' },
  { name: 'ds-harness-remote', version: '0.4.2', source: 'installed' },
]

describe('profile 直接声明过滤（更新检测/LLM 入口共享判据）', () => {
  const dirs: string[] = []
  afterEach(() => {
    for (const d of dirs.splice(0)) {
      try { rmSync(d, { recursive: true, force: true }) } catch { /* best-effort */ }
    }
  })

  it('负例：内核 bundle 内部插件不在 dependencies → 排除出候选', () => {
    const dir = makeProfile(); dirs.push(dir)
    const managed = readDependencyKeys(dir)
    const candidates = filterCandidates(managed, [...BUNDLE_INTERNAL, ...PROFILE_PLUGINS])
    expect(managed.has('@deepseek-ai/cordis-plugin-timer')).toBe(false)
    expect(managed.has('@deepseek-ai/cordis-plugin-hmr')).toBe(false)
    expect(candidates.map(p => p.name)).not.toContain('@deepseek-ai/cordis-plugin-timer')
    expect(candidates.map(p => p.name)).not.toContain('@deepseek-ai/cordis-plugin-hmr')
  })

  it('正例：profile 直接声明的插件全部保留（过滤不得误伤）', () => {
    const dir = makeProfile(); dirs.push(dir)
    const managed = readDependencyKeys(dir)
    const candidates = filterCandidates(managed, [...BUNDLE_INTERNAL, ...PROFILE_PLUGINS])
    expect(candidates.map(p => p.name)).toEqual(['dsh-x', '@max-null/dsh-memory', 'ds-harness-remote'])
    for (const p of PROFILE_PLUGINS) expect(managed.has(p.name)).toBe(true)
  })

  it('llmUpdatePrepare 同判据：bundle 内部插件直接无入口', () => {
    const dir = makeProfile(); dirs.push(dir)
    const managed = readDependencyKeys(dir)
    // 对应 engine.ts llmUpdatePrepare 的 `if (!readDependencyKeys(baseUrl).has(name)) return null`
    expect(managed.has('@deepseek-ai/cordis-plugin-timer')).toBe(false)
    expect(managed.has('dsh-x')).toBe(true)
  })
})
