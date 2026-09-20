import type { Context } from '@deepseek-ai/cordis';
/**
 * 把本包的技能注册进 DSH 技能注册表。
 *
 * 走 `ctx.inject` 而非静态 `inject`：技能服务是可选依赖，缺失时插件其余部分照常
 * 工作；静态声明会让整个插件停在 PENDING 等一个永远不来的服务。服务名不在 Context
 * 的公开声明里（本插件不引官方 skill 包，理由见文件头），故类型期放宽并在回调里
 * 再做一次特性检测。
 * @param ctx - 宿主上下文。
 */
export declare function registerSkillProvider(ctx: Context): void;
