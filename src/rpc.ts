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
          case 'toggle': {
            const id = (payload as { id?: string; disabled?: boolean } | null)?.id
            const disabled = (payload as { id?: string; disabled?: boolean } | null)?.disabled
            if (typeof id !== 'string' || id === '') return internal('toggle: id is required')
            const result = await ctx.pluginCenter.toggle(id, disabled === true)
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
