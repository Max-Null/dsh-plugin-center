import { describe, expect, it, afterEach } from 'vitest'
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { clearPackageCache, kernelAnchorRoots, resolvePackage, setKernelAnchorRootsForTest } from '../src/meta.ts'

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

/** profile 目录（解析起点）。 */
function profileOf(root: string): string {
  const baseUrl = join(root, 'profiles', 'ssid')
  mkdirSync(baseUrl, { recursive: true })
  return baseUrl
}

afterEach(() => {
  // 锚点与解析结果都是进程级状态：不清会让测试互相串，也会让结果取决于跑测试的机器。
  setKernelAnchorRootsForTest(null)
  clearPackageCache()
  for (const dir of roots.splice(0)) rmSync(dir, { recursive: true, force: true })
})

describe('resolvePackage 解析链', () => {
  it('SSiD fork 版：内核在 dsh-runtimes 锚点下也能解析到', async () => {
    // 这条链断了会让 dshVersion() 回退成 '0.0.0'，而 0.0.0 不满足任何 ^0.1.x ——
    // 插件中心会据此把兼容的插件全标成「不兼容当前 DSH」(2026-09-28 实机)。
    const root = workspace()
    const baseUrl = profileOf(root)
    writePackage(
      join(root, 'dsh-runtimes', 'dsh-primary-runtime', 'node_modules', '@deepseek-ai', 'dsh'),
      '@deepseek-ai/dsh', '0.1.7-rc.2',
    )

    const resolved = await resolvePackage(baseUrl, '@deepseek-ai/dsh')

    expect(resolved?.pkg.version).toBe('0.1.7-rc.2')
  })

  it('打包版：内核只在随包 asar 里时，靠宿主入口锚点解析到', async () => {
    // SSiD 1.0.0 的内核不落在 profile 链上，也不在 dsh-runtimes 下 —— 它随包进
    // `resources/app.asar/dsh`。少了这一层，`@deepseek-ai/dsh` 就是 null，内核版本
    // 退化成「不可知」。
    const root = workspace()
    const baseUrl = profileOf(root)
    const kernelRoot = join(root, 'resources', 'app.asar', 'dsh')
    writePackage(join(kernelRoot, 'node_modules', '@deepseek-ai', 'dsh'), '@deepseek-ai/dsh', '0.1.7-rc.2')
    // 宿主入口就落在同一棵内核树里（官方 dsh-desktop-host 的 lib/index.js）。
    const hostEntry = join(kernelRoot, 'node_modules', '@deepseek-ai', 'dsh-desktop-host', 'lib', 'index.js')
    setKernelAnchorRootsForTest(kernelAnchorRoots(hostEntry, join(root, 'resources')))

    const resolved = await resolvePackage(baseUrl, '@deepseek-ai/dsh')

    expect(resolved?.pkg.version).toBe('0.1.7-rc.2')
  })

  it('自建壳布局：profile 链上直接命中时仍走原路径', async () => {
    const root = workspace()
    const baseUrl = profileOf(root)
    writePackage(join(baseUrl, 'node_modules', '@deepseek-ai', 'dsh'), '@deepseek-ai/dsh', '0.1.5-rc.2')

    const resolved = await resolvePackage(baseUrl, '@deepseek-ai/dsh')

    expect(resolved?.pkg.version).toBe('0.1.5-rc.2')
  })

  it('各层都找不到时返回 null —— 让调用方知道版本不可知，而不是当成 0.0.0 去判定兼容性', async () => {
    const baseUrl = profileOf(workspace())
    setKernelAnchorRootsForTest([])

    expect(await resolvePackage(baseUrl, '@deepseek-ai/dsh')).toBeNull()
  })
})

describe('kernelAnchorRoots 起点', () => {
  it('由宿主入口目录与打包资源下的内核目录组成', () => {
    const resources = join('app', 'resources')
    const hostEntry = join(resources, 'app.asar', 'dsh', 'node_modules', '@deepseek-ai', 'dsh-desktop-host', 'lib', 'index.js')

    expect(kernelAnchorRoots(hostEntry, resources)).toEqual([
      dirname(hostEntry),
      join(resources, 'app.asar', 'dsh'),
      join(resources, 'app.asar.unpacked', 'dsh'),
    ])
  })

  it('两处输入都缺席时为空列表（非 Electron 运行环境）', () => {
    expect(kernelAnchorRoots(undefined, undefined)).toEqual([])
    expect(kernelAnchorRoots('', '')).toEqual([])
  })
})
