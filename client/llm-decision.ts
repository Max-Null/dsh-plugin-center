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
}

/** 收敛判定(不修改任何状态,只给结论)。 */
export function decideLlmState(input: LlmDecisionInput): LlmDecision {
  const { rec, sessionRunning } = input
  if (rec !== null && rec.status !== 'running' && rec.status !== 'pending') {
    return rec.status === 'success' ? 'success' : rec.status === 'failed' ? 'failed' : 'ended'
  }
  // JSONL 无终态:会话明确已停(或行不在列表=已清理)→ ended。
  if (sessionRunning === false) return 'ended'
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
