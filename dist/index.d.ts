/**
 * `dsh-plugin-center` host half: mounts the engine and its loopback RPC.
 * The browser half (`./client`) is picked up through the package's `dsh.client`
 * declaration; this half registers the process-local engine + RPC channel.
 */
import type { Context } from '@deepseek-ai/cordis';
export { PluginCenterEngine } from './engine.ts';
export type { InstalledPlugin, PluginSource } from './meta.ts';
export type { MarketPlugin } from './market.ts';
export type { UpdateDigest } from './update.ts';
export { compareVersions, parseVersion, satisfies } from './semver.ts';
export declare const name = "dsh-plugin-center";
/** The engine registers its own `loader` dependency; the gateway follows it. */
export declare const inject: string[];
export declare function apply(ctx: Context): Promise<void>;
