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

/** Exact Fetch route serving this plugin's endpoints under the shared channel. */
const ROUTE = '/api/plugin-center'

/**
 * Connection host surface needed here. Declared locally because the published
 * peer types (`^0.1.1-rc.1`) predate `fetch`; every member is feature-detected.
 */
interface ConnectionHostSurface {
  readonly fetch?: {
    register(route: {
      readonly path: string
      readonly methods: readonly ('GET' | 'HEAD' | 'POST')[]
      readonly requestBody: 'buffered' | 'streaming'
      readonly fetch: (request: Request) => Promise<Response>
    }): () => Promise<void>
  }
  readonly rpc: {
    handle(
      channel: string,
      handler: (endpoint: string, payload: unknown) => Promise<RpcResult<unknown>>,
    ): () => Promise<void>
  }
}

/**
 * Wrap one endpoint result as a JSON response.
 * @param value - RPC result envelope.
 * @returns response carrying the envelope.
 */
function jsonResponse(value: unknown): Response {
  return new Response(JSON.stringify(value), { headers: { 'content-type': 'application/json' } })
}

/**
 * Publish the endpoint handler on whichever transport this host supports.
 *
 * `fetch.register` is preferred because `rpc.handle` ends at
 * `owner.webServer.register()` inside Connection, and in the web (source)
 * composition of DSH 0.1.5-rc.2 the owning fiber declares no `webServer`
 * injection — that throws `cannot get property "webServer" without inject` and
 * leaves the browser with `HTTP 405`. Hosts without `fetch` (older packaged
 * kernels) keep the logical-channel path.
 *
 * @param ctx - plugin context used to await the connection service.
 * @param handler - decoded endpoint handler.
 */
function publishTransport(
  ctx: Context,
  handler: (endpoint: string, payload: unknown) => Promise<RpcResult<unknown>>,
): void {
  ctx.inject(['connection'], (connectionCtx) => {
    const surface = connectionCtx as unknown as {
      connection?: ConnectionHostSurface
      get?: (name: string) => unknown
    }
    const connection = surface.connection ?? (surface.get?.('connection') as ConnectionHostSurface | undefined)
    if (connection === undefined) return
    if (typeof connection.fetch?.register === 'function') {
      connection.fetch.register({
        path: ROUTE,
        methods: ['POST'],
        requestBody: 'buffered',
        fetch: async (request: Request): Promise<Response> => {
          let body: { endpoint?: unknown; payload?: unknown }
          try {
            body = await request.json() as { endpoint?: unknown; payload?: unknown }
          } catch {
            return jsonResponse(internal('request body must be JSON'))
          }
          if (typeof body.endpoint !== 'string') return jsonResponse(internal('endpoint is required'))
          return jsonResponse(await handler(body.endpoint, body.payload))
        },
      })
      return
    }
    connection.rpc.handle(CHANNEL, handler)
  })
}

/** Fold a thrown value into the RpcResult error branch (closed `internal` code). */
function internal(message: string): RpcResult<unknown> {
  return { ok: false, error: { code: 'internal', message, details: {} } }
}

export class PluginCenterRpc extends Service {
  static inject = ['pluginCenter']

  constructor(ctx: Context) {
    super(ctx, 'pluginCenterRpc')
    const handler = async (endpoint: string, payload: unknown): Promise<RpcResult<unknown>> => {
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
          case 'llm-update.invalidate': {
            // LLM 更新由另一 Agent 直接改 profile;失效本插件"已安装/更新"快照缓存,
            // 使 UI 立即反映磁盘新版本,不再残留 updatesCache(5min TTL)的旧列表。
            ctx.pluginCenter.invalidateCaches()
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
    }
    publishTransport(ctx, handler)
  }
}

export default PluginCenterRpc
