import { PluginCenterEngine } from "./engine.js";
import { PluginCenterRpc } from "./rpc.js";
import { registerSkillProvider } from "./skill-provider.js";
export { PluginCenterEngine } from "./engine.js";
export { compareVersions, parseVersion, satisfies } from "./semver.js";
export const name = 'dsh-plugin-center';
/** The engine registers its own `loader` dependency; the gateway follows it. */
export const inject = ['loader'];
export async function apply(ctx) {
    await ctx.plugin(PluginCenterEngine);
    await ctx.plugin(PluginCenterRpc);
    // 把包内 skills/ 供进技能注册表：更新流程要求 Agent 按 dsh-plugin-upgrade 决策，
    // 而技能加载器不扫 node_modules（详见 skill-provider.ts）。
    registerSkillProvider(ctx);
}
