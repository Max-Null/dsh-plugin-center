/**
 * `PluginCenterRpc` — a private loopback RPC channel exposing the engine to
 * the browser half. The Typert Remote path is closed to third-party packages
 * (api-remotes imports an explicit allowlist of official `./remote` artifacts),
 * so the client calls `ctx.connection.rpc.call('/plugin-center', ...)` instead
 * of `ctx.remote.pluginCenter.*` — the same seam dsh-think-any-lang uses.
 */
import { Service, type Context } from '@deepseek-ai/cordis'
import type {} from '@deepseek-ai/dsh-client-connection'
import type { RpcResult } from '@deepseek-ai/dsh-host-apiproxy/api'

const CHANNEL = '/plugin-center'

/** Fold a thrown value into the RpcResult error branch (closed `internal` code). */
function internal(message: string): RpcResult<unknown> {
  return { ok: false, error: { code: 'internal', message, details: {} } }
}

export class PluginCenterRpc extends Service {
  static inject = ['pluginCenter', 'connection']

  constructor(ctx: Context) {
    super(ctx, 'pluginCenterRpc')
    ctx.connection.rpc.handle(CHANNEL, async (endpoint: string, payload: unknown): Promise<RpcResult<unknown>> => {
      try {
        switch (endpoint) {
          case 'listInstalled':
            return { ok: true, value: await ctx.pluginCenter.listInstalled() }
          case 'listMarket':
            return { ok: true, value: await ctx.pluginCenter.listMarket(((payload as { source?: string } | null)?.source ?? 'all') as never) }
          case 'checkUpdates':
            return { ok: true, value: await ctx.pluginCenter.checkUpdates((payload as { since?: string } | null)?.since ?? '') }
          case 'install': {
            const spec = (payload as { spec?: string } | null)?.spec
            if (typeof spec !== 'string' || spec === '') return internal('install: spec is required')
            const result = await ctx.pluginCenter.install(spec)
            if (!result.ok) return internal(`install ${spec} 失败：${result.detail}`)
            return { ok: true, value: { durationMs: result.durationMs, detail: result.detail } }
          }
          case 'update': {
            const name = (payload as { name?: string; version?: string } | null)?.name
            const version = (payload as { name?: string; version?: string } | null)?.version
            if (typeof name !== 'string' || name === '') return internal('update: name is required')
            if (typeof version !== 'string' || version === '') return internal('update: version is required')
            const result = await ctx.pluginCenter.update(name, version)
            if (!result.ok) return internal(`update ${name} 失败：${result.detail}`)
            return {
              ok: true,
              value: {
                durationMs: result.durationMs,
                direct: result.direct === true,
                pending: result.pending === true,
                command: result.command,
                hot: result.hot === true,
              },
            }
          }
          case 'llm-update.prepare': {
            // LLM 驱动更新信息包(只读采集):来源/版本/兼容/变更,供确认面板与
            // 会话 prompt。执行由 LLM Agent 在插件更新会话中按 skill 决策完成。
            const name = (payload as { name?: string } | null)?.name
            if (typeof name !== 'string' || name === '') return internal('llm-update.prepare: name is required')
            const pkg = await ctx.pluginCenter.llmUpdatePrepare(name)
            if (pkg === null) return internal('llm-update.prepare: 插件不存在或版本未知')
            return { ok: true, value: pkg }
          }
          case 'llm-update.log': {
            // 追加一条 LLM 更新动作日志(host JSONL,client 轮询结果展示)。
            const p = payload as { name?: string; action?: string; detail?: string; status?: 'pending' | 'running' | 'success' | 'failed' } | null
            if (typeof p?.name !== 'string' || typeof p.status !== 'string') return internal('llm-update.log: bad payload')
            await ctx.pluginCenter.appendLlmUpdateLog({
              name: p.name,
              action: typeof p.action === 'string' ? p.action : '',
              detail: typeof p.detail === 'string' ? p.detail : '',
              status: p.status,
            })
            return { ok: true, value: null }
          }
          case 'llm-update.result': {
            // 读某插件最近一条 LLM 更新动作(轮询三态:running/success/failed)。
            const name = (payload as { name?: string } | null)?.name
            if (typeof name !== 'string' || name === '') return internal('llm-update.result: name is required')
            return { ok: true, value: await ctx.pluginCenter.readLlmUpdateResult(name) }
          }
          case 'toggle': {
            const payload2 = payload as { id?: string; name?: string; disabled?: boolean } | null
            const id = payload2?.id
            const name = payload2?.name
            const disabled = payload2?.disabled
            if (typeof id !== 'string' || id === '') return internal('toggle: id is required')
            // name 用于无稳定 id 条目的 seek-by-name 寻址（2026-08-25 禁用失效修复）。
            const result = await ctx.pluginCenter.toggle(id, typeof name === 'string' ? name : '', disabled === true)
            if (!result.ok) return internal(`toggle ${id} 失败：${result.detail}`)
            return { ok: true, value: { nowDisabled: result.nowDisabled } }
          }
          case 'diagnostics':
            return { ok: true, value: await ctx.pluginCenter.diagnostics() }
          case 'screenshot': {
            const name = (payload as { name?: string } | null)?.name
            if (typeof name !== 'string' || name === '') return internal('screenshot: name is required')
            return { ok: true, value: await ctx.pluginCenter.screenshot(name) }
          }
          case 'suggest': {
            const query = (payload as { query?: string } | null)?.query
            if (typeof query !== 'string') return internal('suggest: query is required')
            return { ok: true, value: await ctx.pluginCenter.suggest(query) }
          }
          case 'debug':
            return { ok: true, value: await ctx.pluginCenter.debug() }
          case 'readVersions':
            return { ok: true, value: await ctx.pluginCenter.readVersions() }
          case 'markRead': {
            const versions = (payload as { versions?: Record<string, string> } | null)?.versions ?? {}
            return { ok: true, value: await ctx.pluginCenter.markRead(versions) }
          }
          case 'whatsNewDaily':
            return { ok: true, value: await ctx.pluginCenter.whatsNewDaily() }
          case 'markWhatsNewDaily': {
            const day = (payload as { day?: unknown } | null)?.day
            if (typeof day !== 'string' || day === '') return internal('markWhatsNewDaily: day is required')
            return { ok: true, value: await ctx.pluginCenter.markWhatsNewDaily(day) }
          }
          default:
            return internal(`unknown endpoint "${endpoint}"`)
        }
      } catch (error) {
        return internal(error instanceof Error ? error.message : String(error))
      }
    }, { authority: 'loopback' })
  }
}

export default PluginCenterRpc
