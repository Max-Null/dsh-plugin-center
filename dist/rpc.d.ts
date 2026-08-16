/**
 * `PluginCenterRpc` — a private loopback RPC channel exposing the engine to
 * the browser half. The Typert Remote path is closed to third-party packages
 * (api-remotes imports an explicit allowlist of official `./remote` artifacts),
 * so the client calls `ctx.connection.rpc.call('/plugin-center', ...)` instead
 * of `ctx.remote.pluginCenter.*` — the same seam dsh-think-any-lang uses.
 */
import { Service, type Context } from '@deepseek-ai/cordis';
export declare class PluginCenterRpc extends Service {
    static inject: string[];
    constructor(ctx: Context);
}
export default PluginCenterRpc;
