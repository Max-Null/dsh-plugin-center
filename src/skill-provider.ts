/**
 * Packaged skill provider：把本包 `skills/` 下的技能供进 DSH 的技能注册表。
 *
 * 为什么需要它：本包的 LLM 更新流程在信息包里要求 Agent「严格按 dsh-plugin-upgrade
 * skill 的规则决策」（见 `update.ts`），技能文件也确实随包发布（`package.json` 的
 * `files` 含 `skills`）。但 DSH 的技能加载器只扫文件系统上几个固定根——项目
 * `.dsh/skills`、项目 `.agents/skills`、`~/.dsh/skills`、`~/.agents/skills`、bundled
 * ——**不会**去翻 `node_modules` 里的包。于是同一个包在两台机器上表现不同：本机
 * 曾有人手工把 `SKILL.md` 拷进 `~/.dsh/skills` 就能用，干净机器上 skill 直接报
 * `unknown or no longer available`。依赖手工拷贝的提示词不自足：装到陌生环境不报错，
 * 只是永远找不到。
 *
 * 这里注册一个 packaged provider，技能随包走、不写用户目录、不需要任何安装步骤。
 * 形态与优先级照 `@max-null/dsh-skills`（同一个空档位）。
 *
 * 契约在本文件本地声明而非 import `@deepseek-ai/dsh-skill`：官方 0.1.x 线挂在 npm
 * 的 `next` dist-tag 上、`latest` 停在 `0.0.1-rc.1`，把它写进依赖会让 `pnpm install`
 * 在解析传递依赖 `dsh-llm@>=0.1.5` 时直接失败（实测 ERR_PNPM_NO_MATCHING_VERSION）。
 * 与 `rpc.ts` 对 `connection` 的取法一致：运行时形状对齐官方契约，类型期放宽。
 */
import { readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { Context } from '@deepseek-ai/cordis'

/** 调用面控制：模型侧与用户侧都可见。 */
interface SkillInvocationPolicyLike {
  readonly modelInvocable: boolean
  readonly userInvocable: boolean
}

/** 注册表登记的一条候选技能。字段对齐官方 `SkillCandidate`。 */
interface SkillCandidateLike {
  readonly name: string
  readonly description: string
  readonly whenToUse?: string
  readonly invocation: SkillInvocationPolicyLike
  readonly provider: string
  readonly source: string
  readonly resourceBase: { readonly kind: 'directory'; readonly path: string }
  readonly rank: number
  readonly locator: unknown
}

/** 候选加载出的完整定义，比候选多一个正文。 */
interface SkillDefinitionLike extends SkillCandidateLike {
  readonly content: string
}

/** 官方 `SkillProvider` 中本提供者实现的两个方法。 */
interface SkillProviderLike {
  readonly name: string
  readonly list: () => Promise<readonly SkillCandidateLike[]>
  readonly get: (candidate: SkillCandidateLike) => Promise<SkillDefinitionLike | undefined>
}

/** `ctx.skills` 上本插件用到的一角。 */
interface SkillRegistryLike {
  registerProvider(create: () => SkillProviderLike): () => void
}

/** 注册表内的提供者名。 */
const PROVIDER_NAME = 'plugin-center-skills'

/** 来源桶：进提示词可见元数据，也用于区分「包内技能」与用户自己的技能。 */
const SOURCE = 'packaged'

/**
 * 优先级刻度（DSH 既有）：project-dsh 100 / project-agents 200 / runtime 250 /
 * custom 300 / user-dsh 400 / user-agents 500 / bundled 600。550 落在「包提供的
 * 技能」这个空档——低于用户自己的技能目录（用户永远盖得住包内技能），高于
 * bundled（包可以替换内核自带的）。取值与 `@max-null/dsh-skills` 一致。
 */
const RANK = 550

/** 技能根＝包根的 `skills/`（本文件编译后位于 `dist/`，故上一级即包根）。 */
const SKILLS_DIR = fileURLToPath(new URL('../skills/', import.meta.url))

const RESOURCE_BASE = { kind: 'directory', path: SKILLS_DIR } as const
const INVOCATION = { modelInvocable: true, userInvocable: true } as const

/** 技能名语法，与注册表自己的校验器一致。 */
const SKILL_NAME = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

/** frontmatter 里只认这几个字段；本包的技能都写成单行，故不必引入 YAML 解析器。 */
type Frontmatter = Record<string, string>

/**
 * 读 `SKILL.md` 的 frontmatter。
 * @param text - `SKILL.md` 全文。
 * @returns 字段表；没有 frontmatter 时 `undefined`。
 */
function parseFrontmatter(text: string): Frontmatter | undefined {
  if (!text.startsWith('---\n')) return undefined
  const end = text.indexOf('\n---', 3)
  if (end === -1) return undefined
  const fields: Frontmatter = {}
  for (const line of text.slice(4, end).split('\n')) {
    const at = line.indexOf(':')
    if (at > 0) fields[line.slice(0, at).trim()] = line.slice(at + 1).trim()
  }
  return fields
}

/**
 * 去掉 frontmatter，加载出来的正文只留指令。
 * @param text - `SKILL.md` 全文。
 * @returns Markdown 正文。
 */
function stripFrontmatter(text: string): string {
  if (!text.startsWith('---\n')) return text
  const end = text.indexOf('\n---', 3)
  if (end === -1) return text
  return text.slice(end + 4).replace(/^\n+/, '')
}

/**
 * 把一个子目录读成候选；不是技能就返回 `undefined`。
 * @param directory - `skills/` 下的子目录名。
 * @returns 候选，或 `undefined`。
 */
async function readCandidate(directory: string): Promise<SkillCandidateLike | undefined> {
  const path = join(SKILLS_DIR, directory, 'SKILL.md')
  let text: string
  try {
    text = await readFile(path, 'utf8')
  } catch {
    // 子目录里没有 SKILL.md（或读不了）：不是技能，跳过而不是让整次列举失败。
    return undefined
  }
  const fields = parseFrontmatter(text)
  if (fields === undefined) return undefined
  const name = fields['name']
  const description = fields['description']
  if (name === undefined || !SKILL_NAME.test(name)) return undefined
  if (description === undefined || description.length === 0) return undefined
  const whenToUse = fields['whenToUse']
  return {
    name,
    description,
    ...(whenToUse !== undefined ? { whenToUse } : {}),
    invocation: INVOCATION,
    provider: PROVIDER_NAME,
    source: SOURCE,
    resourceBase: RESOURCE_BASE,
    rank: RANK,
    locator: { path },
  }
}

const provider: SkillProviderLike = {
  name: PROVIDER_NAME,
  /** 列出包内全部可读技能，按名字排序（保证目录输出确定）。 */
  async list() {
    const entries = await readdir(SKILLS_DIR, { withFileTypes: true })
    const candidates: SkillCandidateLike[] = []
    for (const entry of entries) {
      if (!entry.isDirectory()) continue
      const candidate = await readCandidate(entry.name)
      if (candidate !== undefined) candidates.push(candidate)
    }
    return candidates.sort((left, right) => (left.name < right.name ? -1 : left.name > right.name ? 1 : 0))
  },
  /**
   * 加载胜出候选的正文。
   * @param candidate - 先前由 `list()` 返回的候选。
   * @returns 完整技能定义；文件已不可读时抛错（注册表按 `undefined` 处理加载失败）。
   */
  async get(candidate) {
    const { path } = candidate.locator as { path: string }
    const text = await readFile(path, 'utf8')
    return {
      name: candidate.name,
      description: candidate.description,
      ...(candidate.whenToUse !== undefined ? { whenToUse: candidate.whenToUse } : {}),
      invocation: INVOCATION,
      provider: PROVIDER_NAME,
      source: SOURCE,
      resourceBase: RESOURCE_BASE,
      rank: RANK,
      locator: candidate.locator,
      content: stripFrontmatter(text),
    }
  },
}

/**
 * 把本包的技能注册进 DSH 技能注册表。
 *
 * 走 `ctx.inject` 而非静态 `inject`：技能服务是可选依赖，缺失时插件其余部分照常
 * 工作；静态声明会让整个插件停在 PENDING 等一个永远不来的服务。服务名不在 Context
 * 的公开声明里（本插件不引官方 skill 包，理由见文件头），故类型期放宽并在回调里
 * 再做一次特性检测。
 * @param ctx - 宿主上下文。
 */
export function registerSkillProvider(ctx: Context): void {
  ctx.inject(['skills'] as never, (skillCtx) => {
    const registry = (skillCtx as unknown as { skills?: SkillRegistryLike }).skills
    if (registry === undefined) return
    registry.registerProvider(() => provider)
  })
}
