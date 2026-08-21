/**
 * Community market: real-time aggregation of multiple plugin directories.
 * Fetch is host-side (no browser CSP); merge dedupes by repo name and unions
 * categories. Sources degrade independently — one failing source never blocks
 * the rest.
 */
/** One plugin as the market surface exposes it. */
export interface MarketPlugin {
    name: string;
    url: string;
    /** Install spec (`github:owner/repo` or an npm package name), from the source. */
    spec: string;
    categories: string[];
    description: {
        en: string;
        zh: string;
    };
    stars: number | null;
    /** npm package name when the plugin is published there, else null. */
    npm: string | null;
    /** Latest published version (npm), null until fetched / for non-npm plugins. */
    version: string | null;
    installed: boolean;
    /** dsh-market five-dimension score (dsh-market source only), else null. */
    score: {
        total: number;
        breakdown: Record<string, number>;
        explanation: string;
    } | null;
}
/** A per-source plugin record before merging. */
interface RawPlugin {
    name: string;
    url: string;
    spec: string;
    categories: string[];
    description: {
        en: string;
        zh: string;
    };
    stars: number | null;
    npm: string | null;
    score: MarketPlugin['score'];
}
/** Map a bounded set of fetches concurrently, keeping per-fetch failures as null. */
export declare function mapConcurrent<T>(items: readonly string[], limit: number, fn: (item: string) => Promise<T>): Promise<(T | null)[]>;
/**
 * Fetch the built awesome catalog in one request — it is pre-enriched with
 * GitHub stars and npm package names, so no per-plugin API calls are needed.
 */
export declare function fetchAwesomePluginsJson(): Promise<RawPlugin[]>;
/** Fetch Oh-My-DSH's curated overrides (min_stars filter + category/note overrides). */
export declare function fetchOhMyDshOverrides(): Promise<Record<string, {
    category?: string;
    note?: string;
}>>;
/**
 * Fetch dsh-market's aggregated catalog (2BingLing/dsh-market plugins.json,
 * ~3900 plugins with five-dimension scores and bilingual descriptions) in
 * one request, then trim each entry to the market surface shape. The raw
 * file is ~10 MB, so the trimmed result (~1.5 MB) is what the engine caches.
 */
export declare function fetchDshMarketPlugins(): Promise<RawPlugin[]>;
/** Parse Oh-My-DSH's PLUGINS.md (markdown table, sectioned by category). */
export declare function fetchOhMyDshPlugins(): Promise<RawPlugin[]>;
/** Merge raw per-source records by repo name: union categories, keep non-empty desc/stars. */
export declare function mergePlugins(sources: RawPlugin[][]): MarketPlugin[];
export {};
