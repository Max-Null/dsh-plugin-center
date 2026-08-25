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
                        const result = await ctx.pluginCenter.install(spec);
                        if (!result.ok)
                            return internal(`install ${spec} 失败：${result.detail}`);
                        return { ok: true, value: { durationMs: result.durationMs, detail: result.detail } };
                    }
                    case 'update': {
                        const name = payload?.name;
                        const version = payload?.version;
                        if (typeof name !== 'string' || name === '')
                            return internal('update: name is required');
                        if (typeof version !== 'string' || version === '')
                            return internal('update: version is required');
                        const result = await ctx.pluginCenter.update(name, version);
                        if (!result.ok)
                            return internal(`update ${name} 失败：${result.detail}`);
                        return {
                            ok: true,
                            value: {
                                durationMs: result.durationMs,
                                direct: result.direct === true,
                                pending: result.pending === true,
                                command: result.command,
                                hot: result.hot === true,
                            },
                        };
                    }
                    case 'toggle': {
                        const payload2 = payload;
                        const id = payload2?.id;
                        const name = payload2?.name;
                        const disabled = payload2?.disabled;
                        if (typeof id !== 'string' || id === '')
                            return internal('toggle: id is required');
                        // name 用于无稳定 id 条目的 seek-by-name 寻址（2026-08-25 禁用失效修复）。
                        const result = await ctx.pluginCenter.toggle(id, typeof name === 'string' ? name : '', disabled === true);
                        if (!result.ok)
                            return internal(`toggle ${id} 失败：${result.detail}`);
                        return { ok: true, value: { nowDisabled: result.nowDisabled } };
                    }
                    case 'diagnostics':
                        return { ok: true, value: await ctx.pluginCenter.diagnostics() };
                    case 'screenshot': {
                        const name = payload?.name;
                        if (typeof name !== 'string' || name === '')
                            return internal('screenshot: name is required');
                        return { ok: true, value: await ctx.pluginCenter.screenshot(name) };
                    }
                    case 'suggest': {
                        const query = payload?.query;
                        if (typeof query !== 'string')
                            return internal('suggest: query is required');
                        return { ok: true, value: await ctx.pluginCenter.suggest(query) };
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
