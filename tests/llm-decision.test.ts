import { describe, expect, it } from 'vitest'
import { decideLlmState, decideLlmRestore } from '../client/llm-decision.ts'

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
