import { describe, expect, it } from 'vitest'
import { decideLlmState, decideLlmRestore, llmResultLabelKey, pickLlmArchives } from '../client/llm-decision.ts'

describe('decideLlmState(轮询收敛:LLM 更新状态机的核心)', () => {
  it('JSONL 无记录 → continue', () => {
    expect(decideLlmState({ rec: null, sessionRunning: true })).toBe('continue')
  })

  it('JSONL running/pending → continue', () => {
    expect(decideLlmState({ rec: { status: 'running' }, sessionRunning: true })).toBe('continue')
    expect(decideLlmState({ rec: { status: 'pending' }, sessionRunning: true })).toBe('continue')
  })

  it('pending 但会话已停 → ended(与 running 一致收敛)', () => {
    expect(decideLlmState({ rec: { status: 'pending' }, sessionRunning: false })).toBe('ended')
  })

  it('JSONL success → success(会话状态无关)', () => {
    expect(decideLlmState({ rec: { status: 'success' }, sessionRunning: true })).toBe('success')
  })

  it('JSONL failed → failed', () => {
    expect(decideLlmState({ rec: { status: 'failed' }, sessionRunning: false })).toBe('failed')
  })

  it('JSONL 未知终态(如 ended) → ended', () => {
    expect(decideLlmState({ rec: { status: 'ended' }, sessionRunning: true })).toBe('ended')
  })

  it('回归:会话已停止(running=false)且无终态 → ended(用户报的卡「执行中」场景)', () => {
    expect(decideLlmState({ rec: { status: 'running' }, sessionRunning: false })).toBe('ended')
  })

  it('回归:发起后 30s 宽限期内会话未启动(running=false)不判 ended', () => {
    expect(decideLlmState({ rec: { status: 'running' }, sessionRunning: false, graceActive: true })).toBe('continue')
  })

  it('宽限期过后会话仍停 → ended', () => {
    expect(decideLlmState({ rec: { status: 'running' }, sessionRunning: false, graceActive: false })).toBe('ended')
  })

  it('回归:会话不存在(undefined 行已折叠为 false)→ ended', () => {
    expect(decideLlmState({ rec: { status: 'running' }, sessionRunning: false })).toBe('ended')
  })

  it('会话状态未知(undefined)→ continue(等会话真停)', () => {
    expect(decideLlmState({ rec: { status: 'running' }, sessionRunning: undefined })).toBe('continue')
  })
})

describe('decideLlmRestore(重挂/刷新恢复)', () => {
  it('无记录 → none', () => {
    expect(decideLlmRestore({ rec: null, sessionRunning: true })).toBe('none')
  })

  it('已有终态 → none(直接取结果)', () => {
    expect(decideLlmRestore({ rec: { status: 'success' }, sessionRunning: true })).toBe('none')
  })

  it('running 且会话在跑 → continue', () => {
    expect(decideLlmRestore({ rec: { status: 'running' }, sessionRunning: true })).toBe('continue')
  })

  it('running 但会话已停/不存在 → ended(回归:恢复后不再卡执行中)', () => {
    expect(decideLlmRestore({ rec: { status: 'running' }, sessionRunning: false })).toBe('ended')
  })
})

describe('llmResultLabelKey(结果文案映射:keep 绝不能显示成已更新)', () => {
  it('success + keep → 保持不动', () => {
    expect(llmResultLabelKey('success', 'keep')).toBe('llmRes_keep')
  })

  it('success + upgrade/switch-npm/fix-peer → 已更新', () => {
    expect(llmResultLabelKey('success', 'upgrade')).toBe('llmRes_success')
    expect(llmResultLabelKey('success', 'switch-npm')).toBe('llmRes_success')
    expect(llmResultLabelKey('success', 'fix-peer')).toBe('llmRes_success')
  })

  it('failed → 失败;ended → 已结束', () => {
    expect(llmResultLabelKey('failed', 'keep')).toBe('llmRes_failed')
    expect(llmResultLabelKey('ended', '')).toBe('llmRes_ended')
  })

  it('running/pending → 执行中', () => {
    expect(llmResultLabelKey('running', '')).toBe('llmRes_running')
    expect(llmResultLabelKey('pending', '')).toBe('llmRes_running')
  })
})

describe('pickLlmArchives(旧「插件更新」会话归档)', () => {
  const rows = [
    { id: 'a1', title: '插件更新: ds-harness-remote', running: false },
    { id: 'a2', title: '插件更新: ds-harness-remote', running: true },
    { id: 'b1', title: '插件更新: dsh-context', running: false },
    { id: 'c1', title: '插件更新(批量)', running: false },
  ]

  it('归档同插件已结束旧会话,排除本次与进行中', () => {
    expect(pickLlmArchives(rows, 'ds-harness-remote', false, 'a1')).toEqual([])
    expect(pickLlmArchives(rows, 'ds-harness-remote', false, 'new1')).toEqual(['a1'])
    expect(pickLlmArchives(rows, 'dsh-context', false, 'x')).toEqual(['b1'])
  })

  it('批量只归档批量标题的旧会话', () => {
    expect(pickLlmArchives(rows, 'any', true, 'c1')).toEqual([])
    expect(pickLlmArchives(rows, 'any', true, 'new')).toEqual(['c1'])
  })

  it('进行中的绝不归档(即使标题匹配)', () => {
    const out = pickLlmArchives([{ id: 'a2', title: '插件更新: ds-harness-remote', running: true }], 'ds-harness-remote', false, 'new')
    expect(out).toEqual([])
  })
})
