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
            return { ok: true, value: true }
          }
          case 'update': {
            const name = (payload as { name?: string } | null)?.name
            if (typeof name !== 'string' || name === '') return internal('update: name is required')
            const result = await ctx.pluginCenter.update(name)
            if (!result.ok) return internal(`update ${name} 失败：${result.detail}`)
            return { ok: true, value: true }
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
