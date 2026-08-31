import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import {
  sourceOf, dependencySpecifierOf, buildLlmPrompt, tarballNameOf, normalizeRepoUrl, isSameUpstream, clearNpmRepoCache, clientBundleUsesRemote,
  type LlmUpdatePackage,
} from '../src/update.ts'
import { mkdtempSync, rmSync, writeFileSync, mkdirSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'

describe('sourceOf 来源判定', () => {
  it('官方包 → official', () => {
    expect(sourceOf('@deepseek-ai/dsh-session', '/p')).toBe('official')
  })

  it('内核 vendored cordis 包 → 官方(不标用户安装,2026-09-01)', () => {
    expect(sourceOf('@deepseek-ai/cordis-plugin-timer', '/p')).toBe('official')
    expect(sourceOf('@deepseek-ai/cordis-plugin-hmr', '/p')).toBe('official')
  })

  it('file:./vendor/ 目录 → vendor', () => {
    expect(sourceOf('file:./vendor/dsh-ssid-panels', '/p')).toBe('vendor')
  })

  it('file:./vendor/*.tgz → tarball(必须在 vendor 之前命中)', () => {
    expect(sourceOf('file:./vendor/open-sea-skin-1.2.1.tgz', '/p')).toBe('tarball')
  })

  it('file: 其他与 link: → local-file', () => {
    expect(sourceOf('file:../local-dev/dsh-x', '/p')).toBe('local-file')
    expect(sourceOf('link:../dsh-x', '/p')).toBe('local-file')
  })

  it('github:/git+ → tarball', () => {
    expect(sourceOf('github:Max-Null/dsh-plugin-center#main', '/p')).toBe('tarball')
    expect(sourceOf('git+https://github.com/a/b.git', '/p')).toBe('tarball')
  })

  it('版本范围 → npm', () => {
    expect(sourceOf('^0.4.0', '/p')).toBe('npm')
    expect(sourceOf('0.4.1', '/p')).toBe('npm')
    expect(sourceOf('~8.28.0', '/p')).toBe('npm')
  })
})

describe('dependencySpecifierOf', () => {
  it('从 profile/package.json dependencies 读取声明', () => {
    const dir = mkdtempSync(join(tmpdir(), 'pc-dep-'))
    try {
      writeFileSync(join(dir, 'package.json'), JSON.stringify({ dependencies: { 'dsh-x': '^0.4.0', 'dsh-y': 'file:./vendor/dsh-y' } }))
      expect(dependencySpecifierOf(dir, 'dsh-x')).toBe('^0.4.0')
      expect(dependencySpecifierOf(dir, 'dsh-y')).toBe('file:./vendor/dsh-y')
      expect(dependencySpecifierOf(dir, 'not-exist')).toBeNull()
    } finally {
      rmSync(dir, { recursive: true, force: true })
    }
  })

  it('package.json 缺失 → null(不抛)', () => {
    const dir = mkdtempSync(join(tmpdir(), 'pc-dep-' + Math.random().toString(36).slice(2)))
    try {
      expect(dependencySpecifierOf(dir, 'dsh-x')).toBeNull()
    } finally {
      rmSync(dir, { recursive: true, force: true })
    }
  })
})

describe('buildLlmPrompt', () => {
  const base: LlmUpdatePackage = {
    name: 'dsh-demo',
    fromVersion: '0.1.0',
    toVersion: '0.2.0',
    changelog: ['feat: x', 'fix: y'],
    compat: 'compatible',
    compatRange: '>=0.0.1',
    source: 'npm',
    specifier: '^0.1.0',
    isVendorModified: false,
    profileDir: 'C:/profiles/ssid',
    runtimeLabel: 'SSID',
    prompt: '',
  }

  it('包含关键决策素材(安装位置/来源/规则要点)', () => {
    const prompt = buildLlmPrompt(base)
    expect(prompt).toContain('插件: dsh-demo')
    expect(prompt).toContain('安装位置: C:/profiles/ssid')
    expect(prompt).toContain('来源: NPM')
    expect(prompt).toContain('本地超前于 npm')
    expect(prompt).toContain('dsh-plugin-upgrade')
  })

  it('vendor 定制时给出警示', () => {
    const p = buildLlmPrompt({ ...base, source: 'vendor', isVendorModified: true, specifier: 'file:./vendor/dsh-demo' })
    expect(p).toContain('本地定制')
  })

  it('toVersion null → (未发布或不可达)', () => {
    expect(buildLlmPrompt({ ...base, toVersion: null })).toContain('(未发布或不可达)')
  })
})

describe('tarballNameOf', () => {
  it('拼接 <name>-<version>.tgz', () => {
    expect(tarballNameOf('dsh-sidebar-qa', '0.4.2')).toBe('dsh-sidebar-qa-0.4.2.tgz')
  })
})

describe('normalizeRepoUrl(上游同源判定)', () => {
  beforeEach(() => { clearNpmRepoCache() })

  it('归一化: scheme/git+/@/尾 .git/斜杠/大小写', () => {
    expect(normalizeRepoUrl('git+https://github.com/Dream12347/dsh-session-manager.git')).toBe('dream12347/dsh-session-manager')
    expect(normalizeRepoUrl('github.com/Hkkz9522/dsh-session-manager')).toBe('hkkz9522/dsh-session-manager')
    expect(normalizeRepoUrl('https://github.com/A/B/')).toBe('a/b')
  })

  it('同名异源: 本地定制 vs 独立同名项目(repository 不同)→ false', async () => {
    vi.stubGlobal('fetch', vi.fn(async (url: string) => {
      // 模拟 npm packument:根级 repository 为 hkkz9522 的项目
      expect(String(url)).toContain('dsh-session-manager')
      return { ok: true, json: async () => ({ repository: { url: 'git+https://github.com/Hkkz9522/dsh-session-manager.git' } }) }
    }))
    const same = await isSameUpstream('https://github.com/Dream12347/dsh-session-manager', 'dsh-session-manager')
    await vi.waitFor(() => {}) // flush promises
    expect(same).toBe(false)
  })

  it('同一上游(repository 一致, 仅格式差异)→ true', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => ({ ok: true, json: async () => ({ repository: { url: 'git+https://github.com/a/b.git' } }) })))
    expect(await isSameUpstream('https://github.com/a/b', 'pkg')).toBe(true)
  })

  it('任一侧缺 repo → null(无法判定不误判)', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => ({ ok: true, json: async () => ({ repository: { url: '' } }) })))
    expect(await isSameUpstream(null, 'pkg')).toBeNull()
    expect(await isSameUpstream('https://github.com/a/b', 'pkg')).toBeNull()
  })
})

describe('clientBundleUsesRemote(服务面校验:SSiD 无 remote BFF)', () => {
  it('含 ctx.remote.session.* 调用 → true(0.4.2 真实 bundle 模式)', () => {
    expect(clientBundleUsesRemote('const r = await ctx.remote.session.prompt({ content });')).toBe(true)
    expect(clientBundleUsesRemote('ctx.remote.session.fork({ sessionId })')).toBe(true)
  })

  it('不含 remote 调用 → false', () => {
    expect(clientBundleUsesRemote('const r = await ctx.connection.rpc.call("/x", "y", {});')).toBe(false)
    expect(clientBundleUsesRemote('registry.remote = 1')).toBe(false) // 字符串命名不误伤
  })
})

afterEach(() => {
  vi.unstubAllGlobals()
})
