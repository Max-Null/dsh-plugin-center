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
  /** dsh-market five-dimension score (dsh-market source only), else null. */
  score: { total: number; breakdown: Record<string, number>; explanation: string } | null
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
  score: MarketPlugin['score']
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
    score: null,
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

/** One plugin in dsh-market's plugins.json (2BingLing/dsh-market, ~3900 entries). */
interface DshMarketJsonPlugin {
  name?: string
  fullName?: string
  description?: string
  descriptionZh?: string
  tags?: string[]
  stars?: number | null
  install?: unknown
  score?: { total?: number; breakdown?: Record<string, number>; explanation?: string } | null
}

/** Category keywords for dsh-market tag → CATEGORIES mapping (prefix match). */
const CATEGORY_KEYWORDS: ReadonlyArray<readonly [string, string[]]> = [
  ['ui', ['ui', 'interface', 'sidebar', 'panel', 'widget', '界面', '面板', '侧栏', '导航']],
  ['theme', ['theme', 'skin', '主题', '皮肤', '壁纸']],
  ['tools', ['tool', 'terminal', 'bash', '工具', '终端', '命令']],
  ['model', ['model', 'llm', 'api', '模型', 'provider']],
  ['session', ['session', '会话', 'history', '记忆回']],
  ['memory', ['memory', '记忆']],
  ['vision', ['vision', 'image', '图片', '视觉', 'screenshot']],
  ['skill', ['skill', '技能', 'agent']],
  ['workflow', ['workflow', 'workflow', '流程', 'automation', '自动化']],
  ['notify', ['notify', '通知', 'toast', 'push']],
  ['dev', ['dev', 'git', 'code', '开发', '代码', 'debug', '测试']],
  ['fun', ['fun', '趣味', 'pet', '宠物', '游戏']],
]

function categorizeTags(tags: readonly string[] | undefined): string[] {
  const out = new Set<string>()
  for (const tag of tags ?? []) {
    const low = tag.toLowerCase()
    for (const [category, keywords] of CATEGORY_KEYWORDS) {
      if (keywords.some(keyword => low.includes(keyword))) out.add(category)
    }
  }
  return [...out]
}

/**
 * Fetch dsh-market's aggregated catalog (2BingLing/dsh-market plugins.json,
 * ~3900 plugins with five-dimension scores and bilingual descriptions) in
 * one request, then trim each entry to the market surface shape. The raw
 * file is ~10 MB, so the trimmed result (~1.5 MB) is what the engine caches.
 */
export async function fetchDshMarketPlugins(): Promise<RawPlugin[]> {
  const res = await fetch('https://raw.githubusercontent.com/2BingLing/dsh-market/master/data/plugins.json', {
    headers: UA,
    signal: AbortSignal.timeout(60000),
  })
  if (!res.ok) throw new Error(`dsh-market plugins.json: HTTP ${res.status}`)
  const json = await res.json() as { plugins?: DshMarketJsonPlugin[] }
  const out: RawPlugin[] = []
  for (const p of json.plugins ?? []) {
    const name = typeof p.name === 'string' && p.name !== '' ? p.name : ''
    const full = typeof p.fullName === 'string' && p.fullName !== '' ? p.fullName : name
    if (full === '') continue
    const descEn = typeof p.description === 'string' ? p.description : ''
    const descZh = typeof p.descriptionZh === 'string' && p.descriptionZh !== '' ? p.descriptionZh : descEn
    out.push({
      // Merge key / display name: owner/repo (matches the awesome source).
      name: full,
      url: `https://github.com/${full}`,
      spec: name, // npm package name is the install spec
      categories: categorizeTags(p.tags),
      description: { en: descEn, zh: descZh },
      stars: typeof p.stars === 'number' ? p.stars : null,
      npm: name === '' ? null : name,
      score: p.score !== null && typeof p.score === 'object'
        ? {
            total: typeof p.score.total === 'number' ? p.score.total : 0,
            breakdown: p.score.breakdown ?? {},
            explanation: typeof p.score.explanation === 'string' ? p.score.explanation : '',
          }
        : null,
    })
  }
  return out
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
        score: null,
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
        score: null,
      }
      cur.categories = [...new Set([...cur.categories, ...item.categories])]
      if (item.description.en !== '') cur.description.en = item.description.en
      if (item.description.zh !== '') cur.description.zh = item.description.zh
      if (item.stars !== null) cur.stars = item.stars
      if (item.npm !== null) cur.npm = item.npm
      if (item.score !== null) cur.score = item.score
      map.set(item.name, cur)
    }
  }
  return [...map.values()]
}
