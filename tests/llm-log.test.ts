import { describe, expect, it } from 'vitest'
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { appendLlmLog, readLlmLogLatest, parseLlmLogLine, llmLogPath } from '../src/llm-log.ts'

/** 直接写文件前先建目录(生产路径由 appendLlmLog 的 mkdir 完成)。 */
function writeRaw(home: string, content: string): void {
  const file = join(home, 'plugin-center', 'llm-update-log.jsonl')
  mkdirSync(dirname(file), { recursive: true })
  writeFileSync(file, content)
}

describe('llm-log JSONL 读写', () => {
  it('追加后按最新逆序读取(同名多记录取最后一条)', async () => {
    const home = mkdtempSync(join(tmpdir(), 'pc-llm-'))
    try {
      await appendLlmLog({ name: 'dsh-x', action: 'prompt-sent', detail: 'start', status: 'running' }, home)
      await appendLlmLog({ name: 'dsh-x', action: 'upgrade', detail: 'done 0.1.0→0.2.0', status: 'success' }, home)
      await appendLlmLog({ name: 'dsh-y', action: 'prompt-sent', detail: 'other', status: 'running' }, home)
      const rec = await readLlmLogLatest('dsh-x', home)
      expect(rec?.status).toBe('success')
      expect(rec?.action).toBe('upgrade')
      expect(rec?.detail).toBe('done 0.1.0→0.2.0')
      expect(rec?.at).toBeGreaterThan(0)
      // 其他插件不受影响
      expect((await readLlmLogLatest('dsh-y', home))?.status).toBe('running')
    } finally {
      rmSync(home, { recursive: true, force: true })
    }
  })

  it('无记录 → null;非法 status 回退 running', async () => {
    const home = mkdtempSync(join(tmpdir(), 'pc-llm-'))
    try {
      expect(await readLlmLogLatest('ghost', home)).toBeNull()
      writeRaw(home, JSON.stringify({ at: 1, name: 'dsh-x', action: 'a', detail: 'd', status: 'weird' }))
      const rec = await readLlmLogLatest('dsh-x', home)
      expect(rec?.status).toBe('running') // 未知 status 按 running 处理(保守)
    } finally {
      rmSync(home, { recursive: true, force: true })
    }
  })

  it('坏行跳过,不影响后续读取', async () => {
    const home = mkdtempSync(join(tmpdir(), 'pc-llm-'))
    try {
      writeRaw(home, '{broken json\n' + JSON.stringify({ at: 2, name: 'dsh-x', action: 'ok', detail: '', status: 'failed' }))
      const rec = await readLlmLogLatest('dsh-x', home)
      expect(rec?.status).toBe('failed')
    } finally {
      rmSync(home, { recursive: true, force: true })
    }
  })

  it('文件不存在 → null(不抛)', async () => {
    const home = mkdtempSync(join(tmpdir(), 'pc-llm-'))
    try {
      expect(await readLlmLogLatest('dsh-x', home)).toBeNull()
    } finally {
      rmSync(home, { recursive: true, force: true })
    }
  })

  it('parseLlmLogLine 字段解析', () => {
    const line = JSON.stringify({ at: 5, name: 'dsh-x', action: 'a', detail: 'd', status: 'success' })
    expect(parseLlmLogLine(line, 'dsh-x')).toMatchObject({ at: 5, status: 'success' })
    expect(parseLlmLogLine(line, 'other')).toBeNull()
    expect(parseLlmLogLine('not-json', 'dsh-x')).toBeNull()
  })

  it('llmLogPath 指向 plugin-center/llm-update-log.jsonl(平台无关分隔符)', () => {
    expect(llmLogPath('C:/home')).toMatch(/plugin-center[\\/]llm-update-log\.jsonl$/)
    // 未显式传时用 process.env.DSH_HOME(测试进程可能没有该变量,只验证相对后缀)
    expect(llmLogPath()).toMatch(/plugin-center[\\/]llm-update-log\.jsonl$/)
  })
})
