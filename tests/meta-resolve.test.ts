import { describe, expect, it, afterEach } from 'vitest'
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { resolvePackage } from '../src/meta.ts'

const roots: string[] = []

function workspace(): string {
  const dir = mkdtempSync(join(tmpdir(), 'plugin-center-resolve-'))
  roots.push(dir)
  return dir
}

function writePackage(dir: string, name: string, version: string): void {
  mkdirSync(dir, { recursive: true })
  writeFileSync(join(dir, 'package.json'), JSON.stringify({ name, version }))
}

afterEach(() => {
  for (const dir of roots.splice(0)) rmSync(dir, { recursive: true, force: true })
})

describe('resolvePackage 解析链', () => {
  it('SSiD fork 版：内核在 dsh-runtimes 锚点下也能解析到', async () => {
    // 这条链断了会让 dshVersion() 回退成 '0.0.0'，而 0.0.0 不满足任何 ^0.1.x ——
    // 插件中心会据此把兼容的插件全标成「不兼容当前 DSH」(2026-09-28 实机)。
    const root = workspace()
    const baseUrl = join(root, 'profiles', 'ssid')
    mkdirSync(baseUrl, { recursive: true })
    writePackage(
      join(root, 'dsh-runtimes', 'dsh-primary-runtime', 'node_modules', '@deepseek-ai', 'dsh'),
      '@deepseek-ai/dsh', '0.1.7-rc.2',
    )

    const resolved = await resolvePackage(baseUrl, '@deepseek-ai/dsh')

    expect(resolved?.pkg.version).toBe('0.1.7-rc.2')
  })

  it('自建壳布局：profile 链上直接命中时仍走原路径', async () => {
    const root = workspace()
    const baseUrl = join(root, 'profiles', 'ssid')
    writePackage(join(baseUrl, 'node_modules', '@deepseek-ai', 'dsh'), '@deepseek-ai/dsh', '0.1.5-rc.2')

    const resolved = await resolvePackage(baseUrl, '@deepseek-ai/dsh')

    expect(resolved?.pkg.version).toBe('0.1.5-rc.2')
  })

  it('两处都找不到时返回 null —— 让调用方知道版本不可知，而不是当成 0.0.0 去判定兼容性', async () => {
    const root = workspace()
    const baseUrl = join(root, 'profiles', 'ssid')
    mkdirSync(baseUrl, { recursive: true })

    expect(await resolvePackage(baseUrl, '@deepseek-ai/dsh')).toBeNull()
  })
})
