import { describe, expect, it } from 'vitest'
import { sourceOf, dependencySpecifierOf, buildLlmPrompt, tarballNameOf, type LlmUpdatePackage } from '../src/update.ts'
import { mkdtempSync, rmSync, writeFileSync, mkdirSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

describe('sourceOf 来源判定', () => {
  it('官方包 → official', () => {
    expect(sourceOf('@deepseek-ai/dsh-session', '/p')).toBe('official')
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
