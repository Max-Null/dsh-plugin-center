/**
 * `skill-provider` 的单测：本包的 packaged SkillProvider 是否真能把 `skills/` 下的
 * 技能供出来。
 *
 * 这条链路存在的意义是「装到干净机器上也能用」——所以断言重心放在候选字段上：
 * 注册表靠 `rank` 判优先级、靠 `source` 与 `provider` 做来源标记，少一个字段
 * 技能就进不了目录，而那种失效不报错、只是永远找不到。
 *
 * 测试经由 `registerSkillProvider` 捕获 provider，而不是把它导出：注册路径本身
 * （依赖声明、服务缺失时的降级）也是被测对象。
 */
import { describe, expect, it } from 'vitest'
import type { Context } from '@deepseek-ai/cordis'
import { registerSkillProvider } from '../src/skill-provider.ts'

/** 候选的形状（与 src/skill-provider.ts 里的本地契约一致）。 */
interface CandidateLike {
  name: string
  description: string
  whenToUse?: string
  invocation: { modelInvocable: boolean; userInvocable: boolean }
  provider: string
  source: string
  resourceBase: { kind: string; path: string }
  rank: number
  locator: unknown
}

interface ProviderLike {
  name: string
  list: () => Promise<readonly CandidateLike[]>
  get: (candidate: CandidateLike) => Promise<CandidateLike & { content: string } | undefined>
}

/**
 * 用一个假的 ctx 调用注册函数，拿回注册进去的 provider。
 * @returns 捕获到的 provider 与注册时声明的依赖。
 */
function registerWithFakeCtx(): { provider: ProviderLike; declared: unknown } {
  let provider: ProviderLike | undefined
  let declared: unknown
  const fakeCtx = {
    inject: (deps: unknown, callback: (ctx: unknown) => void) => {
      declared = deps
      callback({
        skills: {
          registerProvider: (create: () => ProviderLike) => {
            provider = create()
            return () => {}
          },
        },
      })
    },
  } as unknown as Context
  registerSkillProvider(fakeCtx)
  if (provider === undefined) throw new Error('provider 没有被注册')
  return { provider, declared }
}

describe('packaged skill provider', () => {
  it('declares the skills service and registers exactly one provider', () => {
    const { declared } = registerWithFakeCtx()
    expect(declared).toEqual(['skills'])
  })

  it('does not throw when the skills service is absent', () => {
    // 技能服务是可选依赖：缺失时插件其余部分照常，注册悄然跳过。
    const fakeCtx = {
      inject: (_deps: unknown, callback: (ctx: unknown) => void) => { callback({}) },
    } as unknown as Context
    expect(() => { registerSkillProvider(fakeCtx) }).not.toThrow()
  })

  it('serves the packaged upgrade skill with every field the registry reads', async () => {
    const { provider } = registerWithFakeCtx()
    const candidates = await provider.list()
    const skill = candidates.find(candidate => candidate.name === 'dsh-plugin-upgrade')
    expect(skill).toBeDefined()
    expect(skill?.description.length).toBeGreaterThan(0)
    // 550 = 包提供的技能：低于用户技能目录（用户可覆盖），高于 bundled。
    expect(skill?.rank).toBe(550)
    expect(skill?.source).toBe('packaged')
    expect(skill?.provider).toBe('plugin-center-skills')
    expect(skill?.invocation).toEqual({ modelInvocable: true, userInvocable: true })
    expect(skill?.resourceBase.kind).toBe('directory')
    expect(skill?.resourceBase.path.replace(/\\/g, '/')).toMatch(/\/skills\/$/)
  })

  it('loads the body without the frontmatter block', async () => {
    const { provider } = registerWithFakeCtx()
    const candidates = await provider.list()
    const skill = candidates.find(candidate => candidate.name === 'dsh-plugin-upgrade')
    const definition = await provider.get(skill as CandidateLike)
    expect(definition).toBeDefined()
    // 正文是 SKILL.md 的指令部分，不是 frontmatter 的元数据行。
    expect(definition?.content.startsWith('---')).toBe(false)
    expect(definition?.content.length).toBeGreaterThan(200)
    expect(definition?.name).toBe('dsh-plugin-upgrade')
  })

  it('lists skills in a stable order', async () => {
    const { provider } = registerWithFakeCtx()
    const first = (await provider.list()).map(candidate => candidate.name)
    const second = (await provider.list()).map(candidate => candidate.name)
    expect(second).toEqual(first)
    expect([...first].sort()).toEqual(first)
  })
})
