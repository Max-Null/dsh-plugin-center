/**
 * `PluginCenterRpc` — a private loopback RPC channel exposing the engine to
 * the browser half. The Typert Remote path is closed to third-party packages
 * (api-remotes imports an explicit allowlist of official `./remote` artifacts),
 * so the client calls `ctx.connection.rpc.call('/plugin-center', ...)` instead
 * of `ctx.remote.pluginCenter.*` — the same seam dsh-think-any-lang uses.
 */
import { Service } from '@deepseek-ai/cordis';
const CHANNEL = '/plugin-center';
/** Fold a thrown value into the RpcResult error branch (closed `internal` code). */
function internal(message) {
    return { ok: false, error: { code: 'internal', message, details: {} } };
}
export class PluginCenterRpc extends Service {
    static inject = ['pluginCenter', 'connection'];
    constructor(ctx) {
        super(ctx, 'pluginCenterRpc');
        ctx.connection.rpc.handle(CHANNEL, async (endpoint, payload) => {
            try {
                switch (endpoint) {
                    case 'listInstalled':
                        return { ok: true, value: await ctx.pluginCenter.listInstalled() };
                    case 'listMarket':
                        return { ok: true, value: await ctx.pluginCenter.listMarket((payload?.source ?? 'all')) };
                    case 'checkUpdates':
                        return { ok: true, value: await ctx.pluginCenter.checkUpdates(payload?.since ?? '') };
                    case 'install': {
                        const spec = payload?.spec;
                        if (typeof spec !== 'string' || spec === '')
                            return internal('install: spec is required');
                        return { ok: true, value: await ctx.pluginCenter.install(spec) };
                    }
                    case 'update': {
                        const name = payload?.name;
                        if (typeof name !== 'string' || name === '')
                            return internal('update: name is required');
                        return { ok: true, value: await ctx.pluginCenter.update(name) };
                    }
                    case 'debug':
                        return { ok: true, value: await ctx.pluginCenter.debug() };
                    case 'readVersions':
                        return { ok: true, value: await ctx.pluginCenter.readVersions() };
                    case 'markRead': {
                        const versions = payload?.versions ?? {};
                        return { ok: true, value: await ctx.pluginCenter.markRead(versions) };
                    }
                    default:
                        return internal(`unknown endpoint "${endpoint}"`);
                }
            }
            catch (error) {
                return internal(error instanceof Error ? error.message : String(error));
            }
        }, { authority: 'loopback' });
    }
}
export default PluginCenterRpc;
