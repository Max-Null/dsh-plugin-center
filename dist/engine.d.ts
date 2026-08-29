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
import { type LlmUpdatePackage, type PnpmResult, type UpdateDigest } from './update.ts';
import { type LlmLogRecord } from './llm-log.ts';
declare module '@deepseek-ai/cordis' {
    interface Context {
        /** The plugin-center engine (provided by this package's host half). */
        pluginCenter: PluginCenterEngine;
    }
}
/** Which market directory the client wants to browse. */
export type MarketSource = 'all' | 'awesome' | 'oh-my-dsh' | 'dsh-market';
/** What's New read-mark result, returned by listMarket so the client waterfalls. */
export interface MarketSnapshot {
    plugins: MarketPlugin[];
    done: boolean;
}
/** One AI recommendation (suggest). */
export interface Suggestion {
    name: string;
    reason: string;
    /** Install spec resolved at suggest time (npm name or github:owner/repo). */
    spec: string | null;
    /** GitHub stars when the catalog knows them. */
    stars: number | null;
}
/** One-shot diagnostics report (diagnostics). */
export interface DiagnosticsReport {
    dshVersion: string;
    baseUrl: string;
    node: string;
    installed: InstalledPlugin[];
    disabled: Record<string, boolean>;
    pnpmLogTail: string;
}
export declare class PluginCenterEngine extends Service {
    static inject: string[];
    private awesomeCache;
    private awesomeDone;
    private awesomeFetching;
    /** 上次 fetch 失败时刻（0=未失败过）：失败后冷却 60s 再重试，
     *  防止瞬时网络故障让源永久失效（2026-08-22 dsh-market（0）实测）。 */
    private awesomeFailedAt;
    private ohMyDshCache;
    private ohMyDshDone;
    private ohMyDshFetching;
    private ohMyDshFailedAt;
    private dshMarketCache;
    private dshMarketDone;
    private dshMarketFetching;
    private dshMarketFailedAt;
    /** README-extracted screenshot URL per plugin name (lazy, P2). */
    private readonly screenshotCache;
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
    /** 弹窗当天已展示标记（2026-08-27）：host 文件（DSH web 端口随机，
     *  localStorage 按 origin 隔离会丢；文件侧稳定）。 */
    private get whatsNewDailyPath();
    whatsNewDaily(): Promise<string>;
    markWhatsNewDaily(day: string): Promise<void>;
    /** Current DSH version, read from the installed @deepseek-ai/dsh package. */
    dshVersion(): Promise<string>;
    /** Non-group Loader entries, cross-matched with market categories. */
    listInstalled(): Promise<InstalledPlugin[]>;
    /** Start the awesome catalog fetch (with failed-retry cooldown). */
    private prefetchAwesome;
    /** Backfill npm latest versions into the awesome cache (best-effort, concurrent). */
    private fillNpmVersions;
    /** Single-registry latest version for the market bulk backfill (npmmirror is fast). */
    private fastNpmVersion;
    /** Start the Oh-My-DSH fetch (single PLUGINS.md parse, with failed-retry cooldown). */
    private prefetchOhMyDsh;
    /** Start the dsh-market fetch (2BingLing/dsh-market, ~3900 plugins, trimmed, with failed-retry cooldown). */
    private prefetchDshMarket;
    /** Installed plugin names (no file IO) — cached so market polling stays cheap. */
    private installedNames;
    /** Market snapshot for one source: what is cached so far, plus whether done. */
    listMarket(source?: MarketSource): Promise<MarketSnapshot>;
    /** Detect updates for every installed third-party/local plugin, TTL-cached. */
    checkUpdates(sinceIso: string): Promise<UpdateDigest[]>;
    install(spec: string): Promise<PnpmResult>;
    /** Update one installed plugin to the detected target version (exact — see update.ts).
     *  三段式（2026-08-22）：
     *  1. 先尝试直装（绝大多数成功：纯 JS 包、或原生模块未被宿主加载——无锁）；
     *  2. 直装失败且是文件锁（EPERM/rename）→ 特殊路径：
     *     - SSiD（kernel 声明 SSID_PENDING_CONSUMER=1）→ 转两段式：预下载到
     *       ~/.ssid/pending-plugin-updates/，重启时由 kernel 在 boot DSH 前安装；
     *     - 官方 dsh web（无消费方）→ 仿社区市场返回可复制 CLI 指令；
     *  3. 非锁失败（网络/版本）→ 原样报错。 */
    update(name: string, version: string): Promise<PnpmResult>;
    /** LLM 驱动更新准备：采集信息包供确认面板/会话 prompt 使用（2026-08-28）。
     *  只读采集（npm/GitHub/本地 package.json），不执行任何安装——执行由 LLM
     *  Agent 在「插件更新」会话中按 skill 决策后完成。 */
    llmUpdatePrepare(name: string): Promise<LlmUpdatePackage | null>;
    /** 追加一条 LLM 更新动作日志(JSONL,供 client 轮询结果展示)。 */
    appendLlmUpdateLog(entry: {
        name: string;
        action: string;
        detail: string;
        status: 'pending' | 'running' | 'success' | 'failed';
    }): Promise<void>;
    /** 读取某个插件最近一条 LLM 更新动作(JSONL 逆序找 name 匹配);
     *  无记录返回 null。client 轮询据此做三态(进行中/成功/失败)。 */
    readLlmUpdateResult(name: string): Promise<LlmLogRecord | null>;
    /** 串行执行一次 pnpm 操作并失效缓存（无论成败都放行链条后续任务）。 */
    private enqueuePnpm;
    /** 失效「已安装/更新」快照缓存。LLM 更新是另一个 Agent 直接改 profile
     *  跑 pnpm install,不走本插件的 enqueuePnpm 路径,故此处需显式触发——
     *  否则 updatesCache(5min TTL)保留旧版本,UI 仍显示已更新的插件为"可更新"。 */
    invalidateCaches(): void;
    /** Temporary diagnostics for the empty-update bug; removed once root-caused. */
    debug(): Promise<{
        baseUrl: string;
        installed: {
            name: string;
            version: string | null;
            source: string;
        }[];
    }>;
    /** Disable/enable one loader entry through the profile patch layer.
     *  2026-08-25 禁用失效：`dsh plugin add` 清单的 insert 子条目无 id，loader
     *  每次启动分配随机运行时 id，按它写禁用行重启后永远匹配不到。当 patch
     *  文件中没有 `- id: <entryId>` 行时，改用该条目的包名 name 作寻址键
     *  （setDisabled 内按 name 把 insert 子条目升级为稳定 id 后再写禁用行）。 */
    toggle(id: string, name: string, disabled: boolean): Promise<{
        ok: boolean;
        detail: string;
        nowDisabled: boolean | null;
    }>;
    /** One-shot diagnostics: environment, installed surface, patch stance, pnpm log tail. */
    diagnostics(): Promise<DiagnosticsReport>;
    /** Screenshot URL for one dsh-market plugin, lazily extracted from its README. */
    screenshot(name: string): Promise<string | null>;
    /** AI recommendation: keyword-filtered candidates ranked by the model. */
    suggest(query: string): Promise<Suggestion[]>;
    /** Wait for all three market sources (fetch or failure), with a hard deadline. */
    private waitAllSources;
    /** 三源市场合并（按 name 去重；spec 优先 npm 名——比 github 回退更可靠）。 */
    private combinedMarketCache;
}
