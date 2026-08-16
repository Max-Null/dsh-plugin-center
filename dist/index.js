import { PluginCenterEngine } from "./engine.js";
import { PluginCenterRpc } from "./rpc.js";
export { PluginCenterEngine } from "./engine.js";
export { compareVersions, parseVersion, satisfies } from "./semver.js";
export const name = 'dsh-plugin-center';
/** The engine registers its own `loader` dependency; the gateway follows it. */
export const inject = ['loader'];
export async function apply(ctx) {
    await ctx.plugin(PluginCenterEngine);
    await ctx.plugin(PluginCenterRpc);
}
