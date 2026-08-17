/**
 * Plugin-center engine: the process-local composition of metadata, market,
 * and update detection. Read-only over the Loader except install/update, which
 * delegate to pnpm (mirroring `dsh plugin add`). The market catalog is fetched
 * in batches behind a process-local cache, so listMarket returns what is ready
 * so far and the client waterfalls until done.
 */
import { Service, type Context } from '@deepseek-ai/cordis';
import { type InstalledPlugin } from './meta.ts';
import { type MarketPlugin } from './market.ts';
import { type UpdateDigest } from './update.ts';
declare module '@deepseek-ai/cordis' {
    interface Context {
        /** The plugin-center engine (provided by this package's host half). */
        pluginCenter: PluginCenterEngine;
    }
}
/** Which market directory the client wants to browse. */
export type MarketSource = 'all' | 'awesome' | 'oh-my-dsh';
/** What's New read-mark result, returned by listMarket so the client waterfalls. */
export interface MarketSnapshot {
    plugins: MarketPlugin[];
    done: boolean;
}
export declare class PluginCenterEngine extends Service {
    static inject: string[];
    private awesomeCache;
    private awesomeDone;
    private awesomeFetching;
    private ohMyDshCache;
    private ohMyDshDone;
    private ohMyDshFetching;
    private installedNamesCache;
    private updatesCache;
    private readonly updatesTtlMs;
    /** 串行链：同 profile 的 pnpm 调用禁止并发（并发 add 会撞 store 锁/写坏 lock）。 */
    private pnpmChain;
    constructor(ctx: Context);
    /** Background preload of market + installed metadata; failures fall back to lazy load. */
    private warmup;
    /** The profile directory (cordis.yml anchor) — the resolution and install cwd. */
    private get baseUrl();
    /** DSH home directory, for the read-mark persistence file. */
    private get dshHome();
    private get readVersionsPath();
    /** Durable read-mark: which plugin version the user has already seen. */
    readVersions(): Promise<Record<string, string>>;
    /** Persist the read-mark (best-effort; a quota/IO failure just loses the mark). */
    markRead(versions: Record<string, string>): Promise<void>;
    /** Current DSH version, read from the installed @deepseek-ai/dsh package. */
    dshVersion(): Promise<string>;
    /** Non-group Loader entries, cross-matched with market categories. */
    listInstalled(): Promise<InstalledPlugin[]>;
    /** Start the awesome catalog fetch once, keeping the process-local cache. */
    private prefetchAwesome;
    /** Backfill npm latest versions into the awesome cache (best-effort, concurrent). */
    private fillNpmVersions;
    /** Single-registry latest version for the market bulk backfill (npmmirror is fast). */
    private fastNpmVersion;
    /** Start the Oh-My-DSH fetch once (single PLUGINS.md parse). */
    private prefetchOhMyDsh;
    /** Installed plugin names (no file IO) — cached so market polling stays cheap. */
    private installedNames;
    /** Market snapshot for one source: what is cached so far, plus whether done. */
    listMarket(source?: MarketSource): Promise<MarketSnapshot>;
    /** Detect updates for every installed third-party/local plugin, TTL-cached. */
    checkUpdates(sinceIso: string): Promise<UpdateDigest[]>;
    install(spec: string): Promise<{
        ok: boolean;
        detail: string;
    }>;
    /** Update one installed plugin to the detected target version (exact — see update.ts). */
    update(name: string, version: string): Promise<{
        ok: boolean;
        detail: string;
    }>;
    /** 串行执行一次 pnpm 操作并失效缓存（无论成败都放行链条后续任务）。 */
    private enqueuePnpm;
    /** Temporary diagnostics for the empty-update bug; removed once root-caused. */
    debug(): Promise<{
        baseUrl: string;
        installed: {
            name: string;
            version: string | null;
            source: string;
        }[];
    }>;
}
