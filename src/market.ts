/**
 * Community market: real-time aggregation of multiple plugin directories.
 * Fetch is host-side (no browser CSP); merge dedupes by repo name and unions
 * categories. Sources degrade independently — one failing source never blocks
 * the rest.
 */
/** One plugin as the market surface exposes it. */
export interface MarketPlugin {
  name: string
  url: string
  /** Install spec (`github:owner/repo` or an npm package name), from the source. */
  spec: string
  categories: string[]
  description: { en: string; zh: string }
  stars: number | null
  /** npm package name when the plugin is published there, else null. */
  npm: string | null
  /** Latest published version (npm), null until fetched / for non-npm plugins. */
  version: string | null
  installed: boolean
}

/** A per-source plugin record before merging. */
interface RawPlugin {
  name: string
  url: string
  spec: string
  categories: string[]
  description: { en: string; zh: string }
  stars: number | null
  npm: string | null
}

const UA = { 'User-Agent': 'dsh-plugin-center' }

async function rawText(url: string): Promise<string> {
  const res = await fetch(url, { signal: AbortSignal.timeout(20000) })
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${url}`)
  return res.text()
}

/** Map a bounded set of fetches concurrently, keeping per-fetch failures as null. */
export async function mapConcurrent<T>(items: readonly string[], limit: number, fn: (item: string) => Promise<T>): Promise<(T | null)[]> {
  const results: (T | null)[] = new Array(items.length).fill(null)
  let next = 0
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (next < items.length) {
      const i = next++
      try { results[i] = await fn(items[i]!) } catch { /* degrade to null */ }
    }
  })
  await Promise.all(workers)
  return results
}

/** One plugin in awesome-dsh-plugin.com/plugins.json (the built catalog). */
interface AwesomeJsonPlugin {
  name: string
  owner: string
  url: string
  category: string
  description: { en: string; zh: string }
  npm: string | null
  stars: number | null
  install: string
}

/**
 * Fetch the built awesome catalog in one request — it is pre-enriched with
 * GitHub stars and npm package names, so no per-plugin API calls are needed.
 */
export async function fetchAwesomePluginsJson(): Promise<RawPlugin[]> {
  const res = await fetch('https://awesome-dsh-plugin.com/plugins.json', {
    headers: UA,
    signal: AbortSignal.timeout(30000),
  })
  if (!res.ok) throw new Error(`awesome plugins.json: HTTP ${res.status}`)
  const json = await res.json() as { plugins: AwesomeJsonPlugin[] }
  return json.plugins.map(p => ({
    name: `${p.owner}/${p.name}`,
    url: p.url,
    spec: p.install.replace(/^.*\badd\s+/, ''),
    categories: typeof p.category === 'string' && p.category !== '' ? [p.category] : [],
    description: { en: p.description?.en ?? '', zh: p.description?.zh ?? '' },
    stars: typeof p.stars === 'number' ? p.stars : null,
    npm: typeof p.npm === 'string' && p.npm !== '' ? p.npm : null,
  }))
}

/** Fetch Oh-My-DSH's curated overrides (min_stars filter + category/note overrides). */
export async function fetchOhMyDshOverrides(): Promise<Record<string, { category?: string; note?: string }>> {
  try {
    const res = await fetch('https://raw.githubusercontent.com/like-study1/Oh-My-DSH/main/data/curated.json', {
      signal: AbortSignal.timeout(20000),
    })
    if (!res.ok) return {}
    const json = await res.json() as { overrides?: Record<string, { category?: string; note?: string }> }
    return json.overrides ?? {}
  } catch {
    return {}
  }
}

/** Parse Oh-My-DSH's PLUGINS.md (markdown table, sectioned by category). */
export async function fetchOhMyDshPlugins(): Promise<RawPlugin[]> {
  try {
    const text = await rawText('https://raw.githubusercontent.com/like-study1/Oh-My-DSH/main/PLUGINS.md')
    const plugins: RawPlugin[] = []
    let category = ''
    for (const line of text.split('\n')) {
      const section = /^##\s+(.+?)(?:（\d+）)?\s*$/.exec(line)
      if (section !== null) {
        category = section[1]!.trim()
        continue
      }
      const cells = line.split('|').map(c => c.trim())
      if (cells.length < 7) continue
      const link = /\[([^\]]+)\]\(([^)]+)\)/.exec(cells[1]!)
      if (link === null) continue
      const stars = Number(cells[5])
      plugins.push({
        name: link[1]!,
        url: link[2]!,
        spec: `github:${link[1]!}`,
        categories: category !== '' ? [category] : [],
        description: { en: '', zh: cells[6]! },
        stars: Number.isFinite(stars) ? stars : null,
        npm: null,
      })
    }
    return plugins
  } catch {
    return []
  }
}

/** Merge raw per-source records by repo name: union categories, keep non-empty desc/stars. */
export function mergePlugins(sources: RawPlugin[][]): MarketPlugin[] {
  const map = new Map<string, MarketPlugin>()
  for (const items of sources) {
    for (const item of items) {
      const cur = map.get(item.name) ?? {
        name: item.name,
        url: item.url,
        spec: item.spec,
        categories: [],
        description: { en: '', zh: '' },
        stars: null,
        npm: null,
        version: null,
        installed: false,
      }
      cur.categories = [...new Set([...cur.categories, ...item.categories])]
      if (item.description.en !== '') cur.description.en = item.description.en
      if (item.description.zh !== '') cur.description.zh = item.description.zh
      if (item.stars !== null) cur.stars = item.stars
      if (item.npm !== null) cur.npm = item.npm
      map.set(item.name, cur)
    }
  }
  return [...map.values()]
}
