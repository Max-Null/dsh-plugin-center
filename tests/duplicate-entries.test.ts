/**
 * 同名多 entry 的回归测试（2026-10-28）。
 *
 * 背景：`ds-harness-remote` 0.5.18 的 bundle patch 插了两条 `name` 都叫
 * `ds-harness-remote` 的子条目（常规宿主一条 + dsh-TUI 专用一条，`disabled`
 * 表达式互斥）。修复前 `bundleEntryId()` 把「bundle 里第一个声明的 id」当成
 * 这个包的 id，于是：
 *   - 已安装列表出现两行文字完全相同的卡片（插件中心按 Loader entry 逐条列）；
 *   - 点第二条的开关，写进 profile patch 的是第一条的 id —— 关掉的是真正在跑
 *     的那条，被点的那条本来就停用。
 *
 * 判据：按 entryId 精确寻址；同名多条且无法精确匹配时**不猜**（返回 null）。
 * 正反对照两组都在：只断言「第二条不受影响」会掩盖「两条互相串」的镜像 bug。
 */
import { describe, expect, it, afterEach } from 'vitest'
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import {
  bundleEntries, bundleEntryId, effectiveDisabledStance, parseInsertEntries, setDisabled,
} from '../src/toggle.ts'
import { mergeEntries } from '../src/entries.ts'

/** 两条同名子条目，与 ds-harness-remote 的真实形态一致（id 基名 + `-tui` 后缀）。 */
const MULTI_PATCH = [
  '- insert:',
  '    - id: dsh-multi',
  "      name: 'dsh-multi'",
  '      config:',
  '        enabled: true',
  '    - id: dsh-multi-tui',
  "      name: 'dsh-multi'",
  '      inject: [settings, typertGateway]',
  '      config:',
  '        enabled: true',
].join('\n')

/** 造一个 profile：bundles 里登记一个包，并写入它的 cordis.patch.yml。 */
function makeProfile(patch: string, bundleName = 'dsh-multi'): string {
  const dir = mkdtempSync(join(tmpdir(), 'pc-dup-'))
  writeFileSync(join(dir, 'package.json'), JSON.stringify({ dsh: { profile: { bundles: [bundleName] } } }))
  const pkgDir = join(dir, 'node_modules', ...bundleName.split('/'))
  mkdirSync(pkgDir, { recursive: true })
  writeFileSync(join(pkgDir, 'cordis.patch.yml'), patch)
  return dir
}

const dirs: string[] = []
afterEach(() => {
  for (const dir of dirs.splice(0)) {
    try { rmSync(dir, { recursive: true, force: true }) } catch { /* best-effort */ }
  }
})

describe('parseInsertEntries', () => {
  it('解析出两条同名子条目，保留各自 id', () => {
    expect(parseInsertEntries(MULTI_PATCH)).toEqual([
      { id: 'dsh-multi', name: 'dsh-multi' },
      { id: 'dsh-multi-tui', name: 'dsh-multi' },
    ])
  })

  it('顶格 `- id:` 是 patch 覆写行，不是 insert 子条目', () => {
    const text = '# 注释\n- id: top\n  disabled: false\n- insert:\n    - id: inner\n      name: inner-pkg\n'
    expect(parseInsertEntries(text)).toEqual([{ id: 'inner', name: 'inner-pkg' }])
  })

  it('scope 包名的斜杠不被截断，引号被剥掉', () => {
    const text = "- insert:\n    - id: mem\n      name: '@max-null/dsh-memory'\n"
    expect(parseInsertEntries(text)).toEqual([{ id: 'mem', name: '@max-null/dsh-memory' }])
  })
})

describe('bundleEntryId 按 entryId 精确寻址', () => {
  it('同名两条：传哪个 entryId 就返回哪个（修复前恒为第一条）', () => {
    const dir = makeProfile(MULTI_PATCH); dirs.push(dir)
    expect(bundleEntryId(dir, 'dsh-multi', 'dsh-multi-tui')).toBe('dsh-multi-tui')
    expect(bundleEntryId(dir, 'dsh-multi', 'dsh-multi')).toBe('dsh-multi')
  })

  it('同名两条又没给 entryId → 不猜，返回 null', () => {
    const dir = makeProfile(MULTI_PATCH); dirs.push(dir)
    expect(bundleEntryId(dir, 'dsh-multi')).toBeNull()
  })

  it('单条目包：不给 entryId 也能按 name 唯一命中', () => {
    const dir = makeProfile("- insert:\n    - id: dsh-single\n      name: 'dsh-single'\n", 'dsh-single'); dirs.push(dir)
    expect(bundleEntryId(dir, 'dsh-single')).toBe('dsh-single')
  })

  it('包不在 dsh.profile.bundles 里 → 不当作 bundle 寻址', () => {
    const dir = makeProfile(MULTI_PATCH, 'dsh-other'); dirs.push(dir)
    expect(bundleEntryId(dir, 'dsh-multi', 'dsh-multi')).toBeNull()
    expect(bundleEntries(dir, 'dsh-multi')).toEqual([])
  })
})

describe('effectiveDisabledStance 读的是各自那一行', () => {
  it('正反对照：只关第二条时，第一条仍显示启用', () => {
    const dir = makeProfile(MULTI_PATCH); dirs.push(dir)
    writeFileSync(join(dir, 'cordis.patch.yml'), '- id: dsh-multi-tui\n  disabled: true\n')
    expect(effectiveDisabledStance(dir, 'dsh-multi', 'dsh-multi')).toBe(false)
    expect(effectiveDisabledStance(dir, 'dsh-multi-tui', 'dsh-multi')).toBe(true)
  })

  it('只关第一条时，第二条仍显示启用', () => {
    const dir = makeProfile(MULTI_PATCH); dirs.push(dir)
    writeFileSync(join(dir, 'cordis.patch.yml'), '- id: dsh-multi\n  disabled: true\n')
    expect(effectiveDisabledStance(dir, 'dsh-multi', 'dsh-multi')).toBe(true)
    expect(effectiveDisabledStance(dir, 'dsh-multi-tui', 'dsh-multi')).toBe(false)
  })
})

describe('setDisabled 写对 id', () => {
  it('关第二条写的是第二条的 id，第一条不被牵连', async () => {
    const dir = makeProfile(MULTI_PATCH); dirs.push(dir)
    const result = await setDisabled(dir, 'dsh-multi-tui', 'dsh-multi', true)
    expect(result.ok).toBe(true)
    const rows = readFileSync(join(dir, 'cordis.patch.yml'), 'utf8').split('\n')
    expect(rows).toContain('- id: dsh-multi-tui')
    expect(rows).not.toContain('- id: dsh-multi')
  })
})

describe('mergeEntries 归并同名条目', () => {
  it('两条合一：代表取启用那条，两条 id 都进 entryIds', () => {
    const merged = mergeEntries([
      { id: 'dsh-multi', name: 'dsh-multi', disabled: false, fiberPhase: 'active' },
      { id: 'dsh-multi-tui', name: 'dsh-multi', disabled: true, fiberPhase: null },
    ])
    expect(merged).toHaveLength(1)
    expect(merged[0]!.id).toBe('dsh-multi')
    expect(merged[0]!.entryIds).toEqual(['dsh-multi', 'dsh-multi-tui'])
    expect(merged[0]!.fiberPhase).toBe('active')
  })

  it('两条都停用时代表仍是第一条（不谎报为启用）', () => {
    const merged = mergeEntries([
      { id: 'a', name: 'p', disabled: true },
      { id: 'b', name: 'p', disabled: true },
    ])
    expect(merged).toHaveLength(1)
    expect(merged[0]!.disabled).toBe(true)
    expect(merged[0]!.entryIds).toEqual(['a', 'b'])
  })

  it('不同包保持首次出现顺序，条数不变', () => {
    const merged = mergeEntries([
      { id: 'x', name: 'x', disabled: false },
      { id: 'y', name: 'y', disabled: false },
      { id: 'x2', name: 'x', disabled: false },
    ])
    expect(merged.map(entry => entry.name)).toEqual(['x', 'y'])
    expect(merged[0]!.entryIds).toEqual(['x', 'x2'])
  })
})
