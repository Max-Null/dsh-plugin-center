/**
 * LLM 更新状态机判定——纯函数(零依赖,单测覆盖收敛路径)。
 * 状态:执行中(running)→ 终态(success / failed / ended)。
 * 两个收敛判据(任一命中):
 *  1) host JSONL 出现终态记录(success/failed);
 *  2) JSONL 仍 running 但对应「插件更新」会话已停止/不存在 → ended(未回传)。
 * 未收敛 → 'continue'(继续轮询)。
 */

export type LlmDecision = 'continue' | 'success' | 'failed' | 'ended'

export interface LlmDecisionInput {
  /** host JSONL 记录;null = 无记录(继续)。 */
  rec: { status: string } | null
  /** 对应会话行;undefined = 未知(判据 2 依赖它),null 语义不用——用值区分。 */
  sessionRunning: boolean | undefined
  /** 发起宽限期(Agent 启动窗口)内:会话短暂 running=false 不判 ended,
   *  避免"刚发起就误判已结束"——2026-08-29 实测回归。 */
  graceActive?: boolean
}

/** 收敛判定(不修改任何状态,只给结论)。 */
export function decideLlmState(input: LlmDecisionInput): LlmDecision {
  const { rec, sessionRunning, graceActive } = input
  if (rec !== null && rec.status !== 'running' && rec.status !== 'pending') {
    return rec.status === 'success' ? 'success' : rec.status === 'failed' ? 'failed' : 'ended'
  }
  // JSONL 无终态:会话明确已停(或行不在列表=已清理)→ ended;宽限期内放过。
  if (sessionRunning === false && graceActive !== true) return 'ended'
  return 'continue'
}

/** 恢复期判定(重挂/刷新):会话在跑 → 继续执行中;已停/不存在 → ended;
 *  找到会话 id 一并返回(供「查看会话」绑定)。 */
export function decideLlmRestore(input: { rec: { status: string } | null, sessionRunning: boolean | undefined }): 'continue' | 'ended' | 'none' {
  const { rec, sessionRunning } = input
  if (rec === null) return 'none'
  if (rec.status !== 'running' && rec.status !== 'pending') return 'none' // 已有终态记录,restore 直接取结果
  return sessionRunning === false ? 'ended' : 'continue'
}

/** 历史终态是否值得恢复成卡片上的回执。
 *
 * 为什么需要一条时效判据：host JSONL 是**只增日志**，`llm-update.result` 读到的是该
 * 插件**最后一条**记录——可能是几周前那次升级。无条件恢复会让「有更新可升」的卡片上
 * 永久挂着「LLM 已更新」，与卡片自己列的落后版本互相矛盾（2026-09-28 实机：三个插件
 * 挂着 09-16 / 09-28 的旧记录，而它们各自都还有新版本可升）。终态是**某次操作的回执**，
 * 不是插件属性，所以只在有效期内恢复。
 * @param rec - JSONL 终态记录；缺 `at`（或非有限数）视为过期。
 * @param now - 当前时间戳（毫秒）。
 * @param ttlMs - 有效期（毫秒）。
 * @returns 是否恢复为卡片状态。
 */
export function shouldRestoreLlmResult(rec: { at?: number }, now: number, ttlMs: number): boolean {
  return typeof rec.at === 'number' && Number.isFinite(rec.at) && now - rec.at < ttlMs
}

/** 结果 badge/toast 文案键:按 status + action 细分。
 *  keep(保持不动)绝不可渲染成「已更新」——2026-08-29 Agent 回传 keep、
 *  UI 显示「LLM 已更新」的事实性错误回归。 */
export function llmResultLabelKey(status: string, action: string): string {
  if (status === 'failed') return 'llmRes_failed'
  if (status === 'ended') return 'llmRes_ended'
  if (status === 'success') return action === 'keep' ? 'llmRes_keep' : 'llmRes_success'
  return 'llmRes_running'
}

/** 选出应归档的旧「插件更新」会话:同插件标题(或批量标题)、非本次会话、
 *  且未在运行中——侧栏不堆积,进行中的绝不归档。 */
export function pickLlmArchives(
  rows: Array<{ id?: string, title?: string, displayTitle?: string, running?: boolean }>,
  name: string,
  isBatch: boolean,
  keepId: string,
): string[] {
  const marker = isBatch ? '插件更新(批量)' : `插件更新: ${name}`
  return rows
    .filter(r => ((r.displayTitle ?? '') + (r.title ?? '')).includes(marker) && r.id !== undefined && r.id !== keepId && r.running !== true)
    .map(r => r.id!)
}

