/**
 * dsh-plugin-center browser half. Third-party client bundle — components live
 * in the apply closure to reach the loopback RPC seam. Styles live in one
 * injected <style> sheet (so :hover/:focus work) and use var(--dsw-*) tokens
 * only, so skin plugins restyle this UI too.
 */
// createPortal lives in react-dom, not react (the earlier `react` import
// compiled to `import_react.createPortal` which is undefined at runtime —
// 2026-08-22 slot crash). react-dom is bundled by build-client.mjs.
import { createPortal } from 'react-dom'
import { useCallback, useEffect, useRef, useState } from 'react'

// ---- injected stylesheet (single sheet, :hover/:focus live here) ----
const CSS = `
.pc-title { font-size: 16px; font-weight: 600; line-height: 24px; color: var(--dsw-alias-label-primary); }
.pc-sub { font-size: 13px; line-height: 20px; margin-top: 4px; color: var(--dsw-alias-label-secondary); }
.pc-head { display: flex; align-items: center; gap: 10px; }
.pc-head .pc-sub { margin-top: 0; }
.pc-head .pc-btn { flex: none; }
.pc-count { display: inline-block; min-width: 16px; padding: 0 5px; margin-left: 6px; border-radius: 8px; background: var(--dsw-alias-bg-module-platform); color: var(--dsw-alias-label-secondary); font-size: 12px; text-align: center; }
.pc-tab.active .pc-count { background: var(--dsw-alias-state-business-tertiary); color: var(--dsw-alias-state-business-primary); }
.pc-tabs { display: flex; gap: 4px; margin: 16px 0 12px; border-bottom: 1px solid var(--dsw-alias-border-l2); }
.pc-tab { padding: 8px 14px; font-size: 14px; cursor: pointer; background: none; border: none; font-family: inherit; color: var(--dsw-alias-label-tertiary); border-bottom: 2px solid transparent; margin-bottom: -1px; }
.pc-tab:hover { color: var(--dsw-alias-label-secondary); }
.pc-tab.active { color: var(--dsw-alias-label-primary); border-bottom-color: var(--dsw-alias-state-business-primary); }

.pc-card { border: 1px solid var(--dsw-alias-border-l2); border-radius: 10px; padding: 14px 16px; margin-bottom: 10px; background: var(--dsw-alias-bg-layer-1); min-width: 0; transition: border-color .15s; display: flex; flex-direction: column; }
.pc-card:hover { border-color: var(--dsw-alias-border-l3); }
.pc-name { font-weight: 500; color: var(--dsw-alias-label-primary); }
.pc-ver { color: var(--dsw-alias-label-caption); font-size: 12px; }
.pc-desc { color: var(--dsw-alias-label-secondary); font-size: 13px; margin-top: 6px; word-break: break-word; overflow-wrap: break-word; }
.pc-row { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.pc-spacer { flex: 1; }
.pc-meta { display: flex; gap: 6px; flex-wrap: wrap; align-items: center; margin-top: auto; padding-top: 10px; }

.pc-badge { display: inline-flex; align-items: center; height: 20px; padding: 0 8px; border-radius: 6px; font-size: 12px; line-height: 1; }
.pc-badge.official { background: var(--dsw-alias-state-business-tertiary); color: var(--dsw-alias-state-business-primary); }
.pc-badge.installed { background: var(--dsw-alias-state-warn-tertiary); color: var(--dsw-alias-state-warn-primary); }
.pc-badge.local, .pc-badge.builtin { background: var(--dsw-alias-bg-module-platform); color: var(--dsw-alias-label-tertiary); }
.pc-tag { display: inline-flex; align-items: center; height: 20px; padding: 0 8px; border-radius: 6px; font-size: 12px; line-height: 1; background: var(--dsw-alias-bg-module-platform); color: var(--dsw-alias-label-secondary); }
.pc-tag.danger { background: var(--dsw-alias-interactive-bg-hover-danger); color: var(--dsw-alias-state-error-primary); }
.pc-switch { position: relative; flex: none; width: 36px; height: 20px; border-radius: 10px; border: none; background: rgba(0,0,0,.22); cursor: pointer; transition: background .2s ease; padding: 0; }
.pc-switch::after { content: ''; position: absolute; top: 2px; left: 2px; width: 16px; height: 16px; border-radius: 50%; background: #fff; box-shadow: 0 1px 3px rgba(0,0,0,.3); transition: left .2s ease; }
.pc-switch.on { background: var(--dsw-alias-state-success-primary); }
.pc-switch.on::after { left: 18px; }
.pc-switch:disabled { opacity: .6; cursor: default; }
body[data-ds-dark-theme] .pc-switch { background: rgba(255,255,255,.28); }
body[data-ds-dark-theme] .pc-switch.on { background: var(--dsw-alias-state-success-primary); }

.pc-toolbar { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; padding: 4px 0; }
/* 筛选区纵向容器：AI 推荐行 / 主筛选行 / 分类行三段，间距统一。 */
.pc-filter { display: flex; flex-direction: column; gap: 6px; flex: none; margin-top: 2px; }
/* 主筛选行：一行放搜索 + 来源 + 工作区按钮，不换行。 */
.pc-toolbar-main { flex-wrap: nowrap; }
/* 分类行：独立一行、横向滚动（不 wrap 成折行乱排），chip 不压缩。 */
.pc-catbar { display: flex; align-items: center; gap: 6px; overflow-x: auto; padding: 2px 0 4px; scrollbar-width: thin; scrollbar-color: var(--dsw-alias-border-l3, rgba(0,0,0,.2)) transparent; }
.pc-catbar .pc-chip { flex: none; white-space: nowrap; }
/* 市场超量提示：小号弱化文字，与筛选区视觉分离。 */
.pc-limit { margin: 2px 0 8px; font-size: 12px; line-height: 16px; color: var(--dsw-alias-label-caption); }
.pc-ai-row { display: flex; gap: 8px; align-items: center; }
.pc-ai-row .pc-btn { height: 28px; }
.pc-chip { height: 28px; padding: 0 12px; border-radius: 18px; border: 1px solid var(--dsw-alias-border-l2); background: var(--dsw-alias-bg-base); color: var(--dsw-alias-label-secondary); font-size: 13px; cursor: pointer; font-family: inherit; transition: background .15s ease, color .15s ease, border-color .15s ease; }
.pc-chip:hover { background: var(--dsw-alias-interactive-bg-hover); }
.pc-chip.active { background: var(--dsw-alias-state-business-primary); border-color: var(--dsw-alias-state-business-primary); color: var(--dsw-alias-bg-base); }

.pc-btn { height: 26px; padding: 0 10px; border-radius: 8px; border: 1px solid var(--dsw-alias-border-l2); background: var(--dsw-alias-bg-module-platform); color: var(--dsw-alias-label-primary); font-size: 12px; cursor: pointer; font-family: inherit; }
.pc-btn:hover { background: var(--dsw-alias-interactive-bg-hover); }
.pc-btn.primary { border: none; background: var(--dsw-alias-button-primary-fill); color: var(--dsw-alias-bg-base); }
.pc-btn.primary:hover { background: var(--dsw-alias-button-primary-hover); }
.pc-btn:disabled { opacity: 0.5; cursor: default; }

.pc-search { height: 28px; padding: 0 12px; border-radius: 18px; border: 1px solid var(--dsw-alias-border-l2); background: var(--dsw-alias-bg-base); color: var(--dsw-alias-label-primary); font-size: 13px; outline: none; width: 200px; font-family: inherit; }
.pc-search:focus { border-color: var(--dsw-alias-state-business-primary); }
.pc-search::placeholder { color: var(--dsw-alias-label-caption); }
/* 定制 select：剥离浏览器原生外观（高度/内边距/padding 差异是跨控件不齐的
   主因），用背景 chevron 替代系统箭头，与 chip/搜索框同高同圆角。 */
.pc-select { height: 28px; padding: 0 26px 0 12px; border-radius: 18px; border: 1px solid var(--dsw-alias-border-l2); background-color: var(--dsw-alias-bg-base); color: var(--dsw-alias-label-secondary); font-size: 13px; cursor: pointer; font-family: inherit; appearance: none; -webkit-appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 10 10' fill='none' stroke='%23777777' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M2 3.5l3 3 3-3'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 10px center; background-size: 10px 10px; }
.pc-select:hover { background-color: var(--dsw-alias-interactive-bg-hover); }
.pc-select:focus-visible { outline: none; border-color: var(--dsw-alias-state-business-primary); }
body[data-ds-dark-theme] .pc-select { background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 10 10' fill='none' stroke='%23b0b0b0' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M2 3.5l3 3 3-3'/%3E%3C/svg%3E"); }
.pc-iconbtn { width: 28px; height: 28px; padding: 0; border-radius: 18px; border: 1px solid var(--dsw-alias-border-l2); background: var(--dsw-alias-bg-base); color: var(--dsw-alias-label-secondary); cursor: pointer; display: inline-flex; align-items: center; justify-content: center; }
.pc-iconbtn:hover { background: var(--dsw-alias-interactive-bg-hover); }

.pc-grid { display: grid; gap: 12px; }
.pc-grid.double { grid-template-columns: 1fr 1fr; }
.pc-grid.single { grid-template-columns: 1fr; }

.pc-overlay { position: fixed; inset: 0; background: var(--dsw-alias-bg-mask-1); display: flex; align-items: center; justify-content: center; z-index: 100; }
.pc-panel { width: 760px; max-width: 94vw; max-height: 86vh; background: var(--dsw-alias-bg-base); border-radius: 12px; box-shadow: 0 24px 64px rgba(0,0,0,.24); display: flex; flex-direction: column; overflow: hidden; }
.pc-panel-head { flex: none; display: flex; align-items: center; padding: 20px 28px 0; }
.pc-panel-body { flex: 1; min-height: 0; display: flex; flex-direction: column; padding: 8px 28px 20px; }
.pc-scroll { flex: 1; min-height: 0; overflow: auto; }
.pc-close { background: none; border: none; color: var(--dsw-alias-label-tertiary); font-size: 20px; cursor: pointer; padding: 4px 8px; border-radius: 6px; font-family: inherit; }
.pc-close:hover { background: var(--dsw-alias-interactive-bg-hover); color: var(--dsw-alias-label-primary); }
.pc-headerbtn { height: 28px; width: 28px; display: inline-flex; align-items: center; justify-content: center; border-radius: 6px; border: none; background: transparent; cursor: pointer; color: var(--dsw-alias-label-secondary); }
.pc-headerbtn:hover { background: var(--dsw-alias-interactive-bg-hover); color: var(--dsw-alias-label-primary); }
.pc-wn-item { border-bottom: 1px solid var(--dsw-alias-border-l1); padding: 14px 0; }
.pc-wn-item:last-child { border-bottom: none; }
.pc-wn-list { margin-top: 8px; padding-left: 20px; color: var(--dsw-alias-label-secondary); font-size: 13px; }
.pc-toast { position: fixed; bottom: 32px; left: 50%; transform: translateX(-50%); padding: 10px 18px; border-radius: 10px; background: var(--dsw-alias-bg-layer-1); border: 1px solid var(--dsw-alias-border-l2); color: var(--dsw-alias-label-primary); font-size: 13px; box-shadow: 0 8px 32px rgba(0,0,0,.18); z-index: 1500; max-width: 80vw; }
.pc-toast.ok { border-color: var(--dsw-alias-state-success-primary); }
.pc-toast.error { border-color: var(--dsw-alias-state-error-primary); }
/* DSH 0.1.x 设置导航无 icon 契约（external section 一律默认齿轮）。settings-nav-icon
   标记本插件行后：隐藏壳渲染的齿轮 SVG，用与右上角 HeaderButton 相同的 2×2 网格
   图标（currentColor mask）替换，跟随原生导航 hover/active 颜色且不改变壳的
   16px 图标节奏。选择器兼容图标直接为 button 首子元素与包一层 wrapper 两种情况。 */
[data-dsh-plugin-center-settings-nav] > svg:first-child,
[data-dsh-plugin-center-settings-nav] > *:first-child > svg:first-child { display: none; }
[data-dsh-plugin-center-settings-nav]::before {
  content: '';
  flex: none;
  width: 16px;
  height: 16px;
  background: currentColor;
  -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16' fill='none' stroke='black' stroke-width='1.5' stroke-linecap='round'%3E%3Crect x='2' y='2' width='5' height='5' rx='1'/%3E%3Crect x='9' y='2' width='5' height='5' rx='1'/%3E%3Crect x='2' y='9' width='5' height='5' rx='1'/%3E%3Crect x='9' y='9' width='5' height='5' rx='1'/%3E%3C/svg%3E") center / contain no-repeat;
  mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16' fill='none' stroke='black' stroke-width='1.5' stroke-linecap='round'%3E%3Crect x='2' y='2' width='5' height='5' rx='1'/%3E%3Crect x='9' y='2' width='5' height='5' rx='1'/%3E%3Crect x='2' y='9' width='5' height='5' rx='1'/%3E%3Crect x='9' y='9' width='5' height='5' rx='1'/%3E%3C/svg%3E") center / contain no-repeat;
}
`
let cssInjected = false
function injectCss(): void {
  if (cssInjected || typeof document === 'undefined') return
  cssInjected = true
  const style = document.createElement('style')
  style.setAttribute('data-plugin', '@max-null/dsh-plugin-center')
  style.textContent = CSS
  document.head.append(style)
}

// ---- settings nav icon ----
// DSH 0.1.x 的 settings.section 注册只投影 id/order/label，设置壳对外部 section
// 一律渲染默认齿轮（无 icon 契约字段）。照 dsh-better-sidebar 的 settings-nav-icon
// 模式：MutationObserver 按当前本地化 label 标记设置对话框里本插件那一行，
// 由上面的 CSS 把齿轮替换成拼图。标记不拥有壳结构，disposer 移除标记，HMR-safe。
const SETTINGS_NAV_MARKER = 'data-dsh-plugin-center-settings-nav'
function registerSettingsNavIcon(label: () => string): () => void {
  let disposed = false
  const sync = (): void => {
    if (disposed) return
    const currentLabel = label().trim()
    const buttons = document.querySelectorAll<HTMLButtonElement>('[role="dialog"] nav button')
    for (const button of buttons) {
      const matches = currentLabel.length > 0 && button.textContent?.trim() === currentLabel
      if (matches) button.setAttribute(SETTINGS_NAV_MARKER, '')
      else button.removeAttribute(SETTINGS_NAV_MARKER)
    }
  }
  sync()
  const observer = new MutationObserver(sync)
  observer.observe(document.body, { childList: true, subtree: true, characterData: true })
  return () => {
    disposed = true
    observer.disconnect()
    document.querySelectorAll(`[${SETTINGS_NAV_MARKER}]`)
      .forEach((element) => { element.removeAttribute(SETTINGS_NAV_MARKER) })
  }
}

// ---- types (mirror the host wire shapes) ----
type PluginSource = 'official' | 'installed' | 'local' | 'builtin'
type FiberPhase = 'pending' | 'loading' | 'active' | 'failed' | 'unloading' | null

interface InstalledPlugin {
  entryId: string
  name: string
  displayName: string
  version: string | null
  description: string | null
  source: PluginSource
  enabled: boolean
  fiberPhase: FiberPhase
  compatRange: string | null
  repoUrl: string | null
  categories: string[]
}

interface MarketPlugin {
  name: string
  url: string
  spec: string
  categories: string[]
  description: { en: string; zh: string }
  stars: number | null
  npm: string | null
  version: string | null
  installed: boolean
  /** dsh-market five-dimension score (dsh-market source only). */
  score: { total: number; breakdown: Record<string, number>; explanation: string } | null
}

interface UpdateDigest {
  name: string
  fromVersion: string
  toVersion: string
  changelog: string[]
  compat: 'compatible' | 'incompatible' | 'unknown'
  compatRange: string | null
}

type Rpc = (endpoint: string, payload?: unknown) => Promise<unknown>

// ---- module-level rpc + overlay state ----
let rpc: Rpc = async () => { throw new Error('plugin-center: rpc not wired') }
let overlayOpen = false
let whatsNewOpen = false
let whatsNewDigests: UpdateDigest[] = []
const overlayListeners = new Set<() => void>()
const whatsNewListeners = new Set<() => void>()

function openOverlay(): void { overlayOpen = true; overlayListeners.forEach(l => l()) }
function closeOverlay(): void { overlayOpen = false; overlayListeners.forEach(l => l()) }
/** 0.1.7：切换开/关（SSiD 标题栏插件中心按钮再点关闭——dsh-header-unify 优先调用）。 */
function toggleOverlay(): void { overlayOpen ? closeOverlay() : openOverlay() }
function closeWhatsNew(): void {
  whatsNewOpen = false
  for (const d of whatsNewDigests) readCache[d.name] = d.toVersion
  void rpc('markRead', { versions: readCache })
  whatsNewListeners.forEach(l => l())
}
function useOverlayOpen(): boolean {
  const [open, setOpen] = useState(overlayOpen)
  useEffect(() => {
    const l = () => { setOpen(overlayOpen) }
    overlayListeners.add(l)
    return () => { overlayListeners.delete(l) }
  }, [])
  return open
}
function useWhatsNewOpen(): boolean {
  const [open, setOpen] = useState(whatsNewOpen)
  useEffect(() => {
    const l = () => { setOpen(whatsNewOpen) }
    whatsNewListeners.add(l)
    return () => { whatsNewListeners.delete(l) }
  }, [])
  return open
}

// ---- read-mark persistence (host-side) ----
let readCache: Record<string, string> = {}

// ---- client-side caches (avoid re-fetching on every tab switch) ----
let installedCache: InstalledPlugin[] | null = null
const marketCache: Record<string, { plugins: MarketPlugin[]; done: boolean }> = {}

// ---- header counts (module-level: survive settings panel remounts, so the
// numbers never flash back to 0 while a fresh fetch is in flight) ----
let countsState: { installed: number; market: number; dshMarket: number; failed: number } = { installed: 0, market: 0, dshMarket: 0, failed: 0 }
const countListeners = new Set<() => void>()
function setCounts(partial: Partial<typeof countsState>): void {
  const next = { ...countsState, ...partial }
  // Idempotent: identical values do not notify, so render loops driven by
  // count-driven effects terminate (2026-08-22: a non-idempotent notify
  // looped the panel mount effect into an ERR_INSUFFICIENT_RESOURCES storm).
  if (next.installed === countsState.installed
    && next.market === countsState.market
    && next.dshMarket === countsState.dshMarket
    && next.failed === countsState.failed) return
  countsState = next
  countListeners.forEach(l => l())
}

// ---- in-flight install/update state (module-level: survives settings panel
// remounts, so closing the panel mid-update does not revert the button to
// "Update" while the host pnpm still runs) ----
const updatingPlugins = new Set<string>()
const updatingListeners = new Set<() => void>()
function setUpdating(name: string, on: boolean): void {
  if (on) updatingPlugins.add(name)
  else updatingPlugins.delete(name)
  updatingListeners.forEach(l => l())
}
// ---- pending-toggle state: a disable/enable written to the patch layer but
// not yet applied by a restart (SSiD has no HMR). The card shows a
// "restart pending" tag while a pending action exists; toggling back clears
// it (that is a revert — the patch is rewritten, nothing waits for a
// restart, and the toast says so instead of "restart to take effect").
const pendingToggles = new Map<string, boolean>()
const pendingListeners = new Set<() => void>()
function setPendingToggle(id: string, action: 'disable' | 'enable' | null): void {
  if (action === 'disable') pendingToggles.set(id, true)
  else if (action === 'enable') pendingToggles.set(id, false)
  else pendingToggles.delete(id)
  pendingListeners.forEach(l => l())
}
function usePendingVersion(): number {
  const [v, setV] = useState(0)
  useEffect(() => {
    const l = () => { setV(x => x + 1) }
    pendingListeners.add(l)
    return () => { pendingListeners.delete(l) }
  }, [])
  return v
}
// ---- 已更新待重启卡片（2026-08-22，模块级：跨面板重开保留，重启后清空）----
// 直装/pending 的更新完成后，checkUpdates 会因磁盘版本已最新而清空更新列表，
// 但用户需要看到「已更新待重启」卡片并点击触发重启。模块级数组 + 版本号
// 驱动重渲染（同 pendingInstall 模式）。重启应用后此数组随页面重载清空。
const doneUpdatesStore: Array<{ name: string, fromVersion: string, toVersion: string }> = []
let doneUpdatesVersion = 0
const doneUpdatesListeners = new Set<() => void>()
function markDoneUpdate(entry: { name: string, fromVersion: string, toVersion: string }): void {
  if (doneUpdatesStore.some(d => d.name === entry.name)) return
  doneUpdatesStore.push(entry)
  doneUpdatesVersion++
  doneUpdatesListeners.forEach(l => l())
}
function useDoneUpdatesVersion(): number {
  const [v, setV] = useState(0)
  useEffect(() => {
    const l = () => { setV(x => x + 1) }
    doneUpdatesListeners.add(l)
    return () => { doneUpdatesListeners.delete(l) }
  }, [])
  return v
}
// ---- installed-list refresh signal: toggle/install invalidate the module
// cache and bump this, and InstalledView refetches on the change ----
let installedVersion = 0
const installedListeners = new Set<() => void>()
function bumpInstalled(): void {
  installedVersion++
  installedListeners.forEach(l => l())
}
function useInstalledVersion(): number {
  const [v, setV] = useState(0)
  useEffect(() => {
    const l = () => { setV(x => x + 1) }
    installedListeners.add(l)
    return () => { installedListeners.delete(l) }
  }, [])
  return v
}
/** Subscribe to the module-level updating set (returns a bump counter the
 *  component uses to re-render; read `updatingPlugins` directly). */
function useUpdatingVersion(): number {
  const [v, setV] = useState(0)
  useEffect(() => {
    const l = () => { setV(x => x + 1) }
    updatingListeners.add(l)
    return () => { updatingListeners.delete(l) }
  }, [])
  return v
}
/** Subscribe to the module-level header counts (same bump-counter pattern). */
function useCounts(): { installed: number; market: number; failed: number } {
  const [v, setV] = useState(0)
  useEffect(() => {
    const l = () => { setV(x => x + 1) }
    countListeners.add(l)
    return () => { countListeners.delete(l) }
  }, [])
  void v
  return countsState
}

// ---- toast (replaces the native alert) ----
let toastState: { message: string; kind: 'ok' | 'error'; until: number } | null = null
const toastListeners = new Set<() => void>()
function showToast(message: string, kind: 'ok' | 'error' = 'ok', duration = 3200): void {
  toastState = { message, kind, until: Date.now() + duration }
  toastListeners.forEach(l => l())
}

// ---- installs that need a dsh-web restart to take effect ----
const pendingInstall = new Set<string>()

function useToast(): { message: string; kind: 'ok' | 'error' } | null {
  const [t, setT] = useState(toastState)
  useEffect(() => {
    const l = () => { setT(toastState) }
    toastListeners.add(l)
    return () => { toastListeners.delete(l) }
  }, [])
  useEffect(() => {
    if (t === null) return
    const id = setTimeout(() => {
      toastState = null
      toastListeners.forEach(l => l())
    }, Math.max(0, t.until - Date.now()))
    return () => clearTimeout(id)
  }, [t])
  return t
}

async function checkWhatNew(): Promise<void> {
  try {
    const since = new Date(Date.now() - 30 * 86400_000).toISOString()
    const digests = await rpc('checkUpdates', { since }) as UpdateDigest[]
    readCache = await rpc('readVersions') as Record<string, string>
    const fresh = digests.filter(d => readCache[d.name] !== d.toVersion)
    if (fresh.length > 0) {
      whatsNewDigests = fresh
      whatsNewOpen = true
      whatsNewListeners.forEach(l => l())
    }
  } catch { /* silent */ }
}

const CATEGORIES = ['ui', 'usage', 'theme', 'model', 'session', 'memory', 'tools', 'vision', 'skill', 'workflow', 'notify', 'dev', 'market', 'fun']

// ---- i18n（2026-08-17 用户反馈：未适配 DSH 双语切换）----------------------
// DSH locale 机制：ctx.locale 服务 + `locale/change` 事件（快照 active: 'zh'|'en'）。
// 模块级 localeId + 监听器（apply 时接线），组件经 useT 订阅切换重渲染。
type LocaleId = 'zh' | 'en'
const STRINGS = {
  zh: {
    title: '插件中心', tabInstalled: '已安装', tabMarket: '市场', tabUpdates: '更新',
    headSummary: '已安装 {a} · 有更新 {b} · 失效 {c}',
    check: '检查更新', checking: '检查中…', updateAll: '更新全部（{n}）',
    searchInstalled: '搜索已安装插件', allSources: '全部来源',
    srcOfficial: '官方', srcInstalled: '用户安装', srcLocal: '本地开发', srcBuiltin: '内置',
    all: '全部', searchMarket: '搜索社区插件', allMarkets: '全部源',
    gridDouble: '双列网格', gridSingle: '单列列表',
    loadFailed: '加载失败：{e}', loading: '加载中…',
    marketLoading: '加载市场目录中…', loadMore: '正在加载更多…（已加载 {n} 个）',
    checkingUpdates: '检查更新中…', noUpdates: '没有可用的更新。', recheck: '重新检查',
    incompat: '不兼容当前 DSH', update: '更新', updating: '更新中…',
    install: '安装', installing: '安装中…',
    pendingRestart: '待重启生效', installedTag: '已安装',
    disabledTag: '已禁用', requiresDsh: '要求 DSH {r}',
    installQueued: '已发起安装 {n}，重启 dsh web 后生效', installFailed: '安装失败：{e}',
    installNotApplied: '安装未生效',
    updatedOne: '已更新 {n}，重启后生效', updateFailed: '更新失败：{e}',
    updateNotApplied: '更新未生效',
    updatedMany: '已更新 {n} 个插件，重启后生效',
    commandTitle: '在终端执行以下命令',
    commandHint: '当前应用正在运行，被锁定的文件无法在应用内替换。请先关闭应用，再在终端执行：',
    commandCopy: '复制命令', commandCopied: '已复制',
    updateRestartNow: '已下载 {n} 个更新，重启思灵后自动安装。立即重启？',
    updateRestartBusy: '有 {n} 个会话正在进行中，未执行重启；更新已准备好，稍后手动重启即可',
    updatedPendingTag: '已更新待重启',
    restartUnavailable: '当前环境不支持自动重启，请手动重启应用',
    restartAskTitle: '需要重启生效',
    restartAskBody: '已更新 {n} 个插件，重启思灵后生效（有进行中的会话时会先检查）',
    restartNowBtn: '立即重启',
    updateSummary: '更新完成：成功 {a}，失败 {b}（{c}）',
    whatsNewTitle: '插件更新', whatsNewSub: '{n} 个插件有新版本',
    later: '稍后', markAllRead: '全部标记已读', updateNow: '立即更新', close: '关闭',
    checkFail: '检查更新失败，请稍后重试',
    foundUpdates: '发现 {n} 个可更新插件', allUpToDate: '所有插件均为最新',
    disable: '禁用', enable: '启用', toggling: '处理中…',
    disabledOk: '已禁用 {n}，重启后生效', enabledOk: '已启用 {n}，重启后生效', toggleFailed: '操作失败：{e}',
    revertedDisable: '已撤销禁用 {n}', revertedEnable: '已撤销启用 {n}',
    tabDiagnose: '诊断', diagExport: '导出诊断日志', diagCopied: '诊断已复制到剪贴板',
    diagTitle: '环境与插件诊断', diagInstalled: '已安装插件（{n}）', diagDisabled: '禁用状态', diagPnpmLog: 'pnpm 日志（尾部）',
    scoreLabel: '评分',
    screenshot: '截图', noScreenshot: '无截图', screenshotFail: '截图获取失败',
    marketTooMany: '仅显示前 {n} 个（共 {m}），搜索可缩小范围',
  },
  en: {
    title: 'Plugin Center', tabInstalled: 'Installed', tabMarket: 'Market', tabUpdates: 'Updates',
    headSummary: '{a} installed · {b} updates · {c} failed',
    check: 'Check updates', checking: 'Checking…', updateAll: 'Update all（{n}）',
    searchInstalled: 'Search installed plugins', allSources: 'All sources',
    srcOfficial: 'Official', srcInstalled: 'User installed', srcLocal: 'Local dev', srcBuiltin: 'Built-in',
    all: 'All', searchMarket: 'Search community plugins', allMarkets: 'All sources',
    gridDouble: 'Two-column grid', gridSingle: 'Single-column list',
    loadFailed: 'Failed to load: {e}', loading: 'Loading…',
    marketLoading: 'Loading market catalog…', loadMore: 'Loading more… ({n} loaded)',
    checkingUpdates: 'Checking for updates…', noUpdates: 'No updates available.', recheck: 'Check again',
    incompat: 'Incompatible with current DSH', update: 'Update', updating: 'Updating…',
    install: 'Install', installing: 'Installing…',
    pendingRestart: 'Restart pending', installedTag: 'Installed',
    disabledTag: 'Disabled', requiresDsh: 'Requires DSH {r}',
    installQueued: 'Install of {n} started; restart dsh web to take effect', installFailed: 'Install failed: {e}',
    installNotApplied: 'Install did not take effect',
    updatedOne: 'Updated {n}; restart to take effect', updateFailed: 'Update failed: {e}',
    updateNotApplied: 'Update did not take effect',
    updatedMany: 'Updated {n} plugin(s); restart to take effect',
    commandTitle: 'Run this command in a terminal',
    commandHint: 'The app is running and locked files cannot be replaced in-place. Close the app first, then run:',
    commandCopy: 'Copy command', commandCopied: 'Copied',
    updateRestartNow: '{n} update(s) downloaded; auto-installs after restarting SSiD. Restart now?',
    updateRestartBusy: '{n} session(s) still in progress — no restart; updates ready, restart manually later',
    updatedPendingTag: 'Updated — restart pending',
    restartUnavailable: 'Auto-restart unavailable here; please restart manually',
    restartAskTitle: 'Restart required',
    restartAskBody: '{n} plugin(s) updated; takes effect after restarting SSiD (active sessions are checked first)',
    restartNowBtn: 'Restart now',
    updateSummary: 'Update done: {a} succeeded, {b} failed ({c})',
    whatsNewTitle: 'Plugin updates', whatsNewSub: '{n} plugins have new versions',
    later: 'Later', markAllRead: 'Mark all read', updateNow: 'Update now', close: 'Close',
    checkFail: 'Failed to check updates, please retry later',
    foundUpdates: '{n} updates found', allUpToDate: 'All plugins are up to date',
    disable: 'Disable', enable: 'Enable', toggling: 'Working…',
    disabledOk: 'Disabled {n}; restart to take effect', enabledOk: 'Enabled {n}; restart to take effect', toggleFailed: 'Failed: {e}',
    revertedDisable: 'Disable of {n} reverted', revertedEnable: 'Enable of {n} reverted',
    tabDiagnose: 'Diagnostics', diagExport: 'Export diagnostics', diagCopied: 'Diagnostics copied to clipboard',
    diagTitle: 'Environment & plugin diagnostics', diagInstalled: 'Installed plugins ({n})', diagDisabled: 'Disabled state', diagPnpmLog: 'pnpm log (tail)',
    scoreLabel: 'Score',
    screenshot: 'Screenshot', noScreenshot: 'No screenshot', screenshotFail: 'Screenshot fetch failed',
    marketTooMany: 'Showing first {n} of {m}; search to narrow down',
  },
} as const
type StringKey = keyof typeof STRINGS.zh
let localeId: LocaleId = 'zh'
const localeListeners = new Set<() => void>()
function adoptLocale(id: string | undefined): void {
  const next: LocaleId = id === 'en' ? 'en' : 'zh'
  if (next === localeId) return
  localeId = next
  localeListeners.forEach(l => l())
}
function fmt(tpl: string, vars: Record<string, unknown> = {}): string {
  return tpl.replace(/\{(\w+)\}/g, (_, k: string) => String(vars[k] ?? ''))
}
/** 文案函数 + 语言订阅：DSH 切换语言时组件自动重渲染。
 *  useCallback 稳定化：每次渲染返回同一引用，否则依赖 t 的 effect/useCallback
 *  会随渲染无限重跑（2026-08-22 ERR_INSUFFICIENT_RESOURCES 风暴根因之一）。 */
function useT(): (key: StringKey, vars?: Record<string, unknown>) => string {
  const [id, setId] = useState(localeId)
  useEffect(() => {
    const l = () => { setId(localeId) }
    localeListeners.add(l)
    return () => { localeListeners.delete(l) }
  }, [])
  return useCallback((key, vars) => fmt(STRINGS[id][key] ?? STRINGS.zh[key], vars), [id])
}

// ---- views ----
function InstalledView({ search, category, source, onToggle, togglingId }: {
  search: string
  category: string | null
  source: PluginSource | null
  onToggle: (p: InstalledPlugin) => void
  togglingId: string | null
}) {
  const t = useT()
  const installedVersion = useInstalledVersion()
  usePendingVersion()
  const [items, setItems] = useState<InstalledPlugin[] | null>(installedCache)
  const [error, setError] = useState<string | null>(null)
  useEffect(() => {
    let alive = true
    if (installedCache !== null) {
      // Cache is current (nothing invalidated it); keep showing it.
      setItems(installedCache)
      return () => { alive = false }
    }
    void rpc('listInstalled').then(
      v => { installedCache = v as InstalledPlugin[]; if (alive) setItems(installedCache) },
      e => { if (alive) setError(e instanceof Error ? e.message : String(e)) },
    )
    return () => { alive = false }
  }, [installedVersion])
  // Optimistic per-card flip: update local items immediately so only this
  // card re-renders (no whole-list refetch → no flash), then hand the RPC
  // and toast to the panel. The module cache is synced by the panel so a
  // remount shows the flipped state; nothing bumps the refetch signal.
  const handleToggleLocal = (p: InstalledPlugin) => {
    setItems(prev => prev === null ? prev : prev.map(item => item.entryId === p.entryId ? { ...item, enabled: !item.enabled } : item))
    onToggle(p)
  }
  if (error !== null) return <p className="pc-sub">{t('loadFailed', { e: error })}</p>
  if (items === null) return <p className="pc-sub">{t('loading')}</p>
  const srcLabel: Record<PluginSource, string> = {
    official: t('srcOfficial'), installed: t('srcInstalled'), local: t('srcLocal'), builtin: t('srcBuiltin'),
  }
  const q = search.trim().toLowerCase()
  const filtered = items.filter(p => {
    const matchSearch = q === ''
      || p.displayName.toLowerCase().includes(q)
      || (p.description ?? '').toLowerCase().includes(q)
      || p.name.toLowerCase().includes(q)
    const matchCategory = category === null || p.categories.includes(category)
    const matchSource = source === null || p.source === source
    return matchSearch && matchCategory && matchSource
  })
  return (
    <div>
      {filtered.map(p => (
        <div key={p.entryId} className="pc-card">
          <div className="pc-row">
            <span className="pc-name">{p.displayName}</span>
            {p.version !== null && <span className="pc-ver">v{p.version}</span>}
            <span className={`pc-badge ${p.source}`}>{srcLabel[p.source]}</span>
            <span className="pc-spacer" />
            {p.fiberPhase === 'failed' && <span className="pc-dot failed" title="failed" />}
            <button
              type="button"
              role="switch"
              aria-checked={p.enabled}
              aria-label={p.enabled ? t('disable') : t('enable')}
              title={p.enabled ? t('disable') : t('enable')}
              className={`pc-switch${p.enabled ? ' on' : ''}`}
              disabled={togglingId !== null}
              onClick={() => { handleToggleLocal(p) }}
            />
          </div>
          {p.description !== null && <div className="pc-desc">{p.description}</div>}
          <div className="pc-meta">
            {p.categories.map(c => <span key={c} className="pc-tag">{c}</span>)}
            {p.compatRange !== null && <span className="pc-tag">{t('requiresDsh', { r: p.compatRange })}</span>}
            {!p.enabled && <span className="pc-tag">{t('disabledTag')}</span>}
            {pendingToggles.has(p.entryId) && <span className="pc-tag">{t('pendingRestart')}</span>}
          </div>
        </div>
      ))}
    </div>
  )
}

function MarketView({ category, single, source, search, onCount }: { category: string | null; single: boolean; source: string; search: string; onCount: (n: number) => void }) {
  const t = useT()
  const [items, setItems] = useState<MarketPlugin[]>(marketCache[source]?.plugins ?? marketCache.all?.plugins ?? [])
  const [done, setDone] = useState(marketCache[source]?.done ?? marketCache.all?.done ?? false)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState<string | null>(null)
  const [shotBusy, setShotBusy] = useState<string | null>(null)
  const [shotUrl, setShotUrl] = useState<string | null>(null)
  const [shotName, setShotName] = useState<string | null>(null)
  const [shotZoom, setShotZoom] = useState(false)
  useEffect(() => {
    let alive = true
    let timer: ReturnType<typeof setTimeout> | undefined
    // Sync to this source's cache on switch; a missing source cache falls
    // back to the 'all' cache so the list never flashes empty while the
    // source-specific fetch is in flight (2026-08-22).
    const cached = marketCache[source]
    if (cached !== undefined) {
      setItems(cached.plugins)
      setDone(cached.done)
      onCount(cached.plugins.length)
      if (cached.done) return
    } else {
      const fallback = marketCache.all
      setItems(fallback?.plugins ?? [])
      setDone(fallback?.done ?? false)
      if (fallback !== undefined) onCount(fallback.plugins.length)
    }
    const poll = async () => {
      try {
        const r = await rpc('listMarket', { source }) as { plugins: MarketPlugin[]; done: boolean }
        if (!alive) return
        marketCache[source] = { plugins: r.plugins, done: r.done }
        setItems(r.plugins)
        setDone(r.done)
        onCount(r.plugins.length)
        if (!r.done) timer = setTimeout(poll, 1200)
      } catch (e) {
        if (alive) setError(e instanceof Error ? e.message : String(e))
      }
    }
    void poll()
    return () => { alive = false; if (timer !== undefined) clearTimeout(timer) }
  }, [source, onCount])
  if (error !== null) return <p className="pc-sub">{t('loadFailed', { e: error })}</p>
  if (items.length === 0 && !done) return <p className="pc-sub">{t('marketLoading')}</p>
  const q = search.trim().toLowerCase()
  const filtered = items.filter(m => {
    const matchSearch = q === ''
      || m.name.toLowerCase().includes(q)
      || (m.description.zh || m.description.en).toLowerCase().includes(q)
    return matchSearch && (category === null || m.categories.includes(category))
  })
  // Big sources (dsh-market ~3900) render the top of the scored/sorted list;
  // searching narrows the full set.
  const shown = filtered.slice(0, 200)
  const descOf = (m: MarketPlugin): string => localeId === 'en' ? (m.description.en || m.description.zh) : (m.description.zh || m.description.en)
  const install = (m: MarketPlugin) => {
    setBusy(m.name)
    void rpc('install', { spec: m.spec }).then(
      v => {
        const durationMs = typeof v === 'object' && v !== null ? (v as { durationMs?: number }).durationMs : undefined
        const detail = typeof v === 'object' && v !== null ? (v as { detail?: string }).detail : undefined
        if (v !== true && durationMs === undefined) throw new Error(t('installNotApplied'))
        setBusy(null)
        pendingInstall.add(m.spec)
        for (const key of Object.keys(marketCache)) {
          const c = marketCache[key]
          if (c !== undefined) c.plugins = c.plugins.map(p => p.name === m.name ? { ...p, installed: true } : p)
        }
        setItems(prev => prev.map(p => p.name === m.name ? { ...p, installed: true } : p))
        // detail 来自 host 的安装后校验（bundle 注册 / 非插件包提示）——
        // 比固定文案准确（2026-08-22：EAC 类仓库包「重启后生效」是误导）。
        showToast(detail ?? t('installQueued', { n: m.name }) + (durationMs !== undefined ? `（${(durationMs / 1000).toFixed(1)}s）` : ''), 'ok', 7000)
      },
      e => {
        setBusy(null)
        showToast(t('installFailed', { e: e instanceof Error ? e.message : String(e) }), 'error', 15000)
      },
    )
  }

  const showScreenshot = (m: MarketPlugin) => {
    if (shotBusy !== null) return
    setShotBusy(m.name)
    void rpc('screenshot', { name: m.name }).then(
      url => {
        setShotBusy(null)
        if (typeof url !== 'string' || url === '') { showToast(t('noScreenshot'), 'error', 6000); return }
        setShotName(m.name)
        setShotUrl(url)
        setShotZoom(false)
      },
      () => { setShotBusy(null); showToast(t('screenshotFail'), 'error', 6000) },
    )
  }
  return (
    <div>
      {filtered.length > 200 && <p className="pc-limit">{t('marketTooMany', { n: shown.length, m: filtered.length })}</p>}
      <div className={`pc-grid ${single ? 'single' : 'double'}`}>
        {shown.map(m => (
          <div key={m.name} className="pc-card">
            <div className="pc-row">
              <span className="pc-name">{m.name}</span>
              {m.score !== null && <span className="pc-tag" title={`${m.score.total}${m.score.explanation !== '' ? `：${m.score.explanation}` : ''}`}>{t('scoreLabel')} {m.score.total}</span>}
              {m.stars !== null && <span className="pc-ver">★ {m.stars}</span>}
              {m.version !== null && <span className="pc-ver">v{m.version}</span>}
            </div>
            <div className="pc-desc">{descOf(m)}</div>
            <div className="pc-meta">
              {m.categories.slice(0, 4).map(c => <span key={c} className="pc-tag">{c}</span>)}
              <span className="pc-spacer" />
              <button type="button" className="pc-iconbtn" title={t('screenshot')} aria-label={t('screenshot')} disabled={shotBusy !== null} onClick={() => { showScreenshot(m) }}>
                {shotBusy === m.name ? '…' : (
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                    <rect x="2" y="3.5" width="12" height="9" rx="1.5" />
                    <circle cx="8" cy="8" r="2.6" />
                    <path d="M5.5 3.5 6.4 1.8h3.2l.9 1.7" />
                  </svg>
                )}
              </button>
              {m.installed || pendingInstall.has(m.spec)
                ? <span className="pc-tag">{pendingInstall.has(m.spec) ? t('pendingRestart') : t('installedTag')}</span>
                : <button className="pc-btn primary" disabled={busy !== null} onClick={() => { install(m) }}>{busy === m.name ? t('installing') : t('install')}</button>}
            </div>
          </div>
        ))}
      </div>
      {!done && <p className="pc-sub">{t('loadMore', { n: items.length })}</p>}
      {shotUrl !== null && (
        <div className="pc-overlay" role="presentation" onClick={() => { setShotUrl(null); setShotName(null) }}>
          <div className="pc-panel" role="dialog" aria-modal="true" onClick={(e) => { e.stopPropagation() }}>
            <div className="pc-panel-head">
              <span className="pc-title">{shotName ?? ''}</span>
              <span className="pc-spacer" />
              <button type="button" className="pc-close" onClick={() => { setShotUrl(null); setShotName(null) }} aria-label={t('close')}>✕</button>
            </div>
            <div className="pc-panel-body" style={{ alignItems: 'center', overflow: shotZoom ? 'auto' : 'hidden' }}>
              <img
                src={shotUrl}
                alt={shotName ?? ''}
                onClick={() => { setShotZoom(v => !v) }}
                title={shotZoom ? '缩小' : '点击放大'}
                style={shotZoom
                  ? { maxWidth: 'none', maxHeight: 'none', width: 'auto', borderRadius: 8 }
                  : { maxWidth: '100%', maxHeight: '70vh', borderRadius: 8, objectFit: 'contain' }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function UpdatesView({ updates, refresh, updateOne, busy, doneUpdates, onDoneClick }: {
  updates: UpdateDigest[] | null
  refresh: () => void
  updateOne: (name: string, version: string) => void
  busy: string | null
  doneUpdates: Array<{ name: string, fromVersion: string, toVersion: string }>
  onDoneClick: (name: string) => void
}) {
  const t = useT()
  // Module-level in-flight set: keeps "Updating…" visible even when the panel
  // was remounted while a host update was still running (2026-08-22).
  useUpdatingVersion()
  if (updates === null) return <p className="pc-sub">{t('checkingUpdates')}</p>
  // 已更新（直装/pending）的卡片：磁盘已最新，checkUpdates 会清空更新列表，
  // 但用户需要保留卡片并点击触发重启（「已更新待重启」窗口期）。
  const doneOnly = doneUpdates.filter(d => !(updates ?? []).some(u => u.name === d.name))
  if (updates.length === 0 && doneOnly.length === 0) return (
    <div>
      <p className="pc-sub">{t('noUpdates')}</p>
      <button className="pc-btn" onClick={refresh}>{t('recheck')}</button>
    </div>
  )
  return (
    <div>
      {updates.map(u => (
        <div key={u.name} className="pc-card">
          <div className="pc-row">
            <span className="pc-name">{u.name}</span>
            <span className="pc-ver">{u.fromVersion}</span>
            <span className="pc-ver">→</span>
            <span style={{ color: 'var(--dsw-alias-state-business-primary)', fontWeight: 500 }}>{u.toVersion}</span>
            {u.compat === 'incompatible' && <span className="pc-tag danger">{t('incompat')}</span>}
            {pendingInstall.has(u.name) && <span className="pc-tag">{t('pendingRestart')}</span>}
            <span className="pc-spacer" />
            <button className="pc-btn primary" disabled={busy !== null || pendingInstall.has(u.name)} onClick={() => { updateOne(u.name, u.toVersion) }}>{busy === u.name || busy === '__all__' || updatingPlugins.has(u.name) ? t('updating') : t('update')}</button>
          </div>
          {u.changelog.length > 0 && (
            <ul className="pc-wn-list">
              {u.changelog.slice(0, 5).map((line, i) => <li key={i}>{line}</li>)}
            </ul>
          )}
        </div>
      ))}
      {doneOnly.map(d => (
        <div key={d.name} className="pc-card">
          <div className="pc-row">
            <span className="pc-name">{d.name}</span>
            {d.fromVersion !== '' && (<><span className="pc-ver">{d.fromVersion}</span><span className="pc-ver">→</span></>)}
            <span style={{ color: 'var(--dsw-alias-state-business-primary)', fontWeight: 500 }}>{d.toVersion}</span>
            <span className="pc-tag">{t('updatedPendingTag')}</span>
            <span className="pc-spacer" />
            <button className="pc-btn primary" onClick={() => { onDoneClick(d.name) }}>{t('updatedPendingTag')}</button>
          </div>
        </div>
      ))}
    </div>
  )
}

interface DiagnosticsReport {
  dshVersion: string
  baseUrl: string
  node: string
  installed: InstalledPlugin[]
  disabled: Record<string, boolean>
  pnpmLogTail: string
}

function DiagnoseView() {
  const t = useT()
  const [report, setReport] = useState<DiagnosticsReport | null>(null)
  const [error, setError] = useState<string | null>(null)
  useEffect(() => {
    let alive = true
    void rpc('diagnostics').then(
      v => { if (alive) setReport(v as DiagnosticsReport) },
      e => { if (alive) setError(e instanceof Error ? e.message : String(e)) },
    )
    return () => { alive = false }
  }, [])

  const textOf = (): string => {
    if (report === null) return 'no diagnostics'
    const lines: string[] = [
      '=== dsh-plugin-center diagnostics ===',
      `dsh: ${report.dshVersion}`,
      `node: ${report.node}`,
      `profile: ${report.baseUrl}`,
      `installed (${report.installed.length}):`,
      ...report.installed.map(p => `  ${p.enabled ? '' : '[disabled] '}${p.name}@${p.version ?? '?'} (${p.source}, ${p.fiberPhase ?? '?'})`),
      'patch disabled:',
      ...Object.entries(report.disabled).map(([id, v]) => `  ${id}: ${v ? 'disabled' : 'force-enabled'}`),
      'pnpm log tail:',
      report.pnpmLogTail,
    ]
    return lines.join('\n')
  }

  const exportLog = () => {
    const blob = new Blob([textOf()], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `plugin-center-diagnostics-${new Date().toISOString().slice(0, 19).replace(/[:T]/gu, '-')}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }
  const copy = () => {
    void navigator.clipboard?.writeText(textOf()).then(() => { showToast(t('diagCopied'), 'ok', 3000) }).catch(() => {})
  }

  if (error !== null) return <p className="pc-sub">{t('loadFailed', { e: error })}</p>
  if (report === null) return <p className="pc-sub">{t('loading')}</p>
  return (
    <div>
      <div className="pc-toolbar">
        <button className="pc-btn" onClick={exportLog}>{t('diagExport')}</button>
        <button className="pc-btn" onClick={copy}>{t('diagCopied')}</button>
      </div>
      <p className="pc-sub">{t('diagTitle')}</p>
      <div className="pc-card">
        <div className="pc-row"><span className="pc-name">dsh</span><span className="pc-ver">{report.dshVersion}</span></div>
        <div className="pc-row"><span className="pc-name">node</span><span className="pc-ver">{report.node}</span></div>
        <div className="pc-row"><span className="pc-name">profile</span><span className="pc-ver" style={{ wordBreak: 'break-all' }}>{report.baseUrl}</span></div>
      </div>
      <p className="pc-sub">{t('diagInstalled', { n: report.installed.length })}</p>
      {report.installed.map(p => (
        <div key={p.name} className="pc-card">
          <div className="pc-row">
            <span className="pc-name">{p.name}</span>
            <span className="pc-ver">v{p.version ?? '?'}</span>
            <span className={`pc-badge ${p.source}`}>{p.source}</span>
            {!p.enabled && <span className="pc-tag">{t('disabledTag')}</span>}
          </div>
        </div>
      ))}
      <p className="pc-sub">{t('diagDisabled')}</p>
      <div className="pc-card">
        {Object.keys(report.disabled).length === 0
          ? <span className="pc-ver">—</span>
          : Object.entries(report.disabled).map(([id, v]) => (
            <div key={id} className="pc-row"><span className="pc-name">{id}</span><span className="pc-ver">{v ? 'disabled' : 'enabled'}</span></div>
          ))}
      </div>
      <p className="pc-sub">{t('diagPnpmLog')}</p>
      <pre className="pc-desc" style={{ whiteSpace: 'pre-wrap', fontSize: 11 }}>{report.pnpmLogTail === '' ? '—' : report.pnpmLogTail}</pre>
    </div>
  )
}

type View = 'installed' | 'market' | 'updates' | 'diagnose'

/** 撞锁回退（官方 dsh web 等无持久消费方）：指令复制弹窗。 */
function CommandDialog({ command, copied, onCopy, onClose }: { command: string, copied: boolean, onCopy: () => void, onClose: () => void }) {
  const t = useT()
  return createPortal(
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
      <div style={{ width: 'min(560px, 92vw)', background: 'var(--dsw-alias-bg-layer-1, #131a26)', border: '1px solid var(--dsw-alias-border-l2, #1e2836)', borderRadius: 10, padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--dsw-alias-label-primary, #d8e0ea)' }}>{t('commandTitle')}</div>
        <div style={{ fontSize: 12, color: 'var(--dsw-alias-label-secondary, #67748a)', lineHeight: 1.5 }}>{t('commandHint')}</div>
        <textarea readOnly value={command} rows={Math.min(8, command.split('\n').length + 1)}
          style={{ width: '100%', boxSizing: 'border-box', background: 'var(--dsw-alias-bg-module-platform, rgba(128,148,168,.12))', color: 'var(--dsw-alias-label-primary, #d8e0ea)', border: '1px solid var(--dsw-alias-border-l2, #1e2836)', borderRadius: 6, padding: '8px 10px', fontSize: 12, fontFamily: 'monospace', resize: 'vertical' }} />
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button type="button" className="pc-btn" onClick={() => { void navigator.clipboard.writeText(command).then(onCopy).catch(() => {}) }}>{copied ? t('commandCopied') : t('commandCopy')}</button>
          <button type="button" className="pc-btn primary" onClick={onClose}>{t('close')}</button>
        </div>
      </div>
    </div>,
    document.body,
  )
}

/** 自绘「立即重启 / 稍后」确认弹窗（同 CommandDialog 样式，DSH 主题变量）。 */
function RestartDialog({ count, onRestart, onClose }: { count: number, onRestart: () => void, onClose: () => void }) {
  const t = useT()
  return createPortal(
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
      <div style={{ width: 'min(420px, 92vw)', background: 'var(--dsw-alias-bg-layer-1, #131a26)', border: '1px solid var(--dsw-alias-border-l2, #1e2836)', borderRadius: 10, padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--dsw-alias-label-primary, #d8e0ea)' }}>{t('restartAskTitle')}</div>
        <div style={{ fontSize: 12, color: 'var(--dsw-alias-label-secondary, #67748a)', lineHeight: 1.5 }}>{t('restartAskBody', { n: count })}</div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button type="button" className="pc-btn" onClick={onClose}>{t('later')}</button>
          <button
            type="button"
            style={{
              padding: '3px 12px', fontSize: 11.5, border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600,
              background: 'var(--dsw-alias-button-primary-fill)',
              color: 'var(--dsw-alias-label-primary-foreground)',
            }}
            onClick={onRestart}
          >{t('restartNowBtn')}</button>
        </div>
      </div>
    </div>,
    document.body,
  )
}

function CenterPanel({ variant = 'section' }: { variant?: 'section' | 'overlay' }) {
  const t = useT()
  const [view, setView] = useState<View>('installed')
  const [category, setCategory] = useState<string | null>(null)
  const [single, setSingle] = useState(false)
  const [source, setSource] = useState<string>('awesome')
  const [search, setSearch] = useState('')
  const [installedCategory, setInstalledCategory] = useState<string | null>(null)
  const [marketSearch, setMarketSearch] = useState('')
  const [installedSource, setInstalledSource] = useState<PluginSource | null>(null)
  // Module-level counts (survive panel remounts; never flash back to 0).
  const counts = useCounts()
  const [updates, setUpdates] = useState<UpdateDigest[] | null>(null)
  const [busyUpdate, setBusyUpdate] = useState<string | null>(null)
  const [checking, setChecking] = useState(false)
  const [togglingId, setTogglingId] = useState<string | null>(null)
  // 三段式更新 UI（2026-08-22）：直装成功 toast / 撞锁转 pending 后「立即/稍后
  // 重启」、多更新统一弹窗 / web 撞锁给指令复制弹窗。
  const [commandDialog, setCommandDialog] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const readyPending = useRef<string[]>([])
  const inUpdateAll = useRef(false)
  // 本次会话「已更新，待重启生效」的卡片（直装/pending 都进）：checkUpdates
  // 会因磁盘版本已最新而清空更新列表，但用户需要看到卡片并点击触发重启。
  // 模块级（doneUpdatesStore + useDoneUpdatesVersion），跨面板重开保留。
  useDoneUpdatesVersion()
  // 自绘「立即重启」确认弹窗（不再用原生 window.confirm，保持与 DSH 主题一致）。
  const [restartAsk, setRestartAsk] = useState(0)
  // SSiD「立即重启」：复用 dsh-ssid-panels 的 /ssid/api/sessionRoot.restart
  // （含进行中会话 busy 保护）。失败（非 SSiD / 通道缺失）仅提示。
  const runRestartNow = (n: number): void => {
    void fetch('/ssid/api/sessionRoot.restart', { method: 'POST', headers: { 'content-type': 'application/json' }, body: '{}' })
      .then(res => res.json())
      .then((body: { value?: { code?: string, activeSessions?: number } }) => {
        if (body.value?.code === 'busy') {
          showToast(t('updateRestartBusy', { n: body.value.activeSessions ?? 0 }), 'error', 8000)
        }
      })
      .catch(() => showToast(t('restartUnavailable'), 'error', 8000))
  }
  const askRestart = (n: number): void => { setRestartAsk(n) }
  const flushReady = (): void => {
    const n = readyPending.current.length
    if (n === 0) return
    readyPending.current = []
    askRestart(n)
  }

  const handleToggle = (p: InstalledPlugin) => {
    if (togglingId !== null) return
    // Patch rows match the loader entry id (e.g. "chat-rail"), not the npm
    // package name — p.entryId is the correct key (2026-08-22: passing name
    // wrote a row the loader never matches, so nothing changed after restart).
    const id = p.entryId
    const nextEnabled = !p.enabled
    // A pending action on this entry means the next click is a revert — the
    // patch returns to its previous stance, so no restart is involved and
    // the toast must not claim one.
    const wasPending = pendingToggles.has(id)
    console.log('[plugin-center] toggle', { id, fromEnabled: p.enabled, toEnabled: nextEnabled, wasPending })
    setTogglingId(p.name)
    void rpc('toggle', { id, disabled: !nextEnabled }).then(
      v => {
        setTogglingId(null)
        const nowDisabled = typeof v === 'object' && v !== null ? (v as { nowDisabled?: boolean | null }).nowDisabled : null
        console.log('[plugin-center] toggle result', { id, nowDisabled })
        if (nowDisabled === true && !wasPending) {
          setPendingToggle(id, 'disable')
          showToast(t('disabledOk', { n: p.name }), 'ok', 5000)
        } else if (nowDisabled === false && !wasPending) {
          setPendingToggle(id, 'enable')
          showToast(t('enabledOk', { n: p.name }), 'ok', 5000)
        } else if (wasPending) {
          // Revert: clear the pending marker; the patch is back to its
          // previous stance, nothing waits for a restart.
          setPendingToggle(id, null)
          showToast(nowDisabled === true ? t('revertedDisable', { n: p.name }) : t('revertedEnable', { n: p.name }), 'ok', 5000)
        }
        // Sync the module cache only — the visible card was already flipped
        // locally by InstalledView (no bump: a refetch would flash the list
        // and return the loader's pre-restart enabled snapshot anyway).
        if (installedCache !== null) {
          installedCache = installedCache.map(item => item.entryId === id ? { ...item, enabled: nextEnabled } : item)
        }
      },
      e => {
        setTogglingId(null)
        console.log('[plugin-center] toggle failed', { id, error: e instanceof Error ? e.message : String(e) })
        showToast(t('toggleFailed', { e: e instanceof Error ? e.message : String(e) }), 'error', 15000)
      },
    )
  }

  // silent：挂载自动检查不弹 toast；用户点按钮（silent=false）给明确反馈
  // （2026-08-17 用户反馈：按了「检查更新」没啥变化——原来只有 tab 徽标/列表
  // 变化，人在其他 tab 时完全无感）。
  const refreshUpdates = useCallback((silent = false) => {
    setChecking(true)
    void rpc('checkUpdates', { since: new Date(Date.now() - 30 * 86400_000).toISOString() }).then(
      v => {
        const digests = v as UpdateDigest[]
        // changelog 拉空时保留上次内容（GitHub API 限流/网络抖动会拉空——
        // 2026-08-18 用户实测更新后卡片介绍消失）。
        setUpdates(prev => digests.map(d => {
          if (d.changelog.length > 0) return d
          const old = prev?.find(p => p.name === d.name)
          return old !== undefined && old.changelog.length > 0 ? { ...d, changelog: old.changelog } : d
        }))
        setChecking(false)
        if (!silent) {
          showToast(digests.length > 0 ? t('foundUpdates', { n: digests.length }) : t('allUpToDate'))
        }
      },
      () => {
        setChecking(false)
        if (!silent) showToast(t('checkFail'), 'error')
      },
    )
  }, [t])
  useEffect(() => {
    void rpc('listInstalled').then(
      v => {
        const items = v as InstalledPlugin[]
        installedCache = items
        setCounts({ installed: items.length, failed: items.filter(p => p.fiberPhase === 'failed').length })
      },
      () => { /* keep previous counts (cached or 0) */ },
    )
    refreshUpdates(true)
  }, [refreshUpdates])

  // 市场计数与列表预载（2026-08-22：三个源全部预载，MarketView 任意 source
  // 打开都有缓存——此前只预载 'all' 而 MarketView 默认 'awesome'，tab 打开
  // 缓存未命中归零重拉；计数模块级持久，面板重开不闪 0）。服务端缓存未
  // 就绪（done=false）时每 5s 轮询直到完成，失败 15s 重试。
  useEffect(() => {
    let alive = true
    const timers: ReturnType<typeof setTimeout>[] = []
    const poll = async (src: string) => {
      if (!alive) return
      try {
        const r = await rpc('listMarket', { source: src }) as { plugins: MarketPlugin[]; done: boolean }
        if (!alive) return
        marketCache[src] = { plugins: r.plugins, done: r.done }
        if (src === 'all') setCounts({ market: r.plugins.length })
        if (src === 'dsh-market') setCounts({ dshMarket: r.plugins.length })
        if (!r.done) timers.push(setTimeout(() => { void poll(src) }, 5000))
      } catch {
        if (alive) timers.push(setTimeout(() => { void poll(src) }, 15000))
      }
    }
    void poll('all')
    void poll('awesome')
    void poll('oh-my-dsh')
    return () => { alive = false; for (const timer of timers) clearTimeout(timer) }
  }, [])

  // Stable callback: MarketView's effect depends on it — an inline lambda
  // would re-run the poll on every render (2026-08-22 loop root cause).
  const handleMarketCount = useCallback((n: number) => { setCounts({ market: n }) }, [])

  const updateOne = (name: string, version: string) => {
    setBusyUpdate(name)
    setUpdating(name, true)
    void rpc('update', { name, version }).then(
      v => {
        const value = typeof v === 'object' && v !== null ? v as { durationMs?: number, direct?: boolean, pending?: boolean, command?: string } : null
        if (value === null || (value.durationMs === undefined && value.command === undefined)) throw new Error(t('updateNotApplied'))
        setUpdating(name, false)
        setBusyUpdate(null)
        if (value.command !== undefined && value.command !== '') {
          // 撞锁且无持久消费方（官方 dsh web 等）：给 CLI 指令，用户自行执行
          setCommandDialog(value.command)
          setCopied(false)
          return
        }
        if (value.pending === true) {
          // SSiD 撞锁 → 预下载完成，重启时自动安装：打 tag + 弹「立即/稍后重启」
          pendingInstall.add(name)
          readyPending.current.push(name)
          if (!inUpdateAll.current) flushReady()
          refreshUpdates(true)
          return
        }
        // 直装成功：文件已更新，重启后生效 → 卡片保留为「已更新待重启」，
        // 点击卡片按钮触发重启确认（checkUpdates 会自然清空更新列表）。
        pendingInstall.add(name)
        markDoneUpdate({
          name,
          fromVersion: updates?.find(u => u.name === name)?.fromVersion ?? '',
          toVersion: version,
        })
        showToast(t('updatedOne', { n: name }) + (value.durationMs !== undefined ? `（${(value.durationMs / 1000).toFixed(1)}s）` : ''), 'ok', 5000)
        refreshUpdates(true)
      },
      e => {
        setUpdating(name, false)
        setBusyUpdate(null); showToast(t('updateFailed', { e: e instanceof Error ? e.message : String(e) }), 'error', 15000)
      },
    )
  }
  // 串行逐个更新（2026-08-17 实测：并发 update 会同时 spawn 多个 pnpm，
  // 同 profile 并发写导致多数失败 + busy 状态互相覆盖闪烁 = 页面闪一下没下文）。
  const updateAll = async () => {
    if (updates === null || updates.length === 0) return
    setBusyUpdate('__all__')
    inUpdateAll.current = true
    readyPending.current = []
    const commands: string[] = []
    let okCount = 0
    const okNames: string[] = []
    const failures: string[] = []
    for (const u of updates) {
      setUpdating(u.name, true)
      try {
        const v = await rpc('update', { name: u.name, version: u.toVersion }) as boolean | object
        const value = typeof v === 'object' && v !== null ? v as { durationMs?: number, direct?: boolean, pending?: boolean, command?: string } : null
        if (value === null || (value.durationMs === undefined && value.command === undefined)) throw new Error(t('updateNotApplied'))
        okCount++
        if (value.command !== undefined && value.command !== '') {
          commands.push(value.command)
          continue
        }
        if (value.pending === true) {
          readyPending.current.push(u.name)
          okNames.push(`${u.name}（待重启）`)
          continue
        }
        pendingInstall.add(u.name)
        markDoneUpdate({
          name: u.name,
          fromVersion: u.fromVersion,
          toVersion: u.toVersion,
        })
        okNames.push(value.durationMs !== undefined ? `${u.name}（${(value.durationMs / 1000).toFixed(1)}s）` : u.name)
      } catch (e) {
        failures.push(`${u.name}：${e instanceof Error ? e.message : String(e)}`)
      } finally {
        setUpdating(u.name, false)
      }
    }
    inUpdateAll.current = false
    setBusyUpdate(null)
    // 统一弹窗（多更新全部 ready 后只弹一次；指令同理合并展示）
    if (commands.length > 0) {
      setCommandDialog(commands.join('\n'))
      setCopied(false)
    } else if (readyPending.current.length > 0) {
      flushReady()
    }
    if (failures.length > 0) {
      showToast(t('updateSummary', { a: okCount, b: failures.length, c: failures.join('；') }), 'error', 15000)
    } else if (commands.length === 0 && readyPending.current.length === 0) {
      showToast(t('updatedMany', { n: okCount }) + `（${okNames.join('、')}）`, 'ok', 6000)
    }
    refreshUpdates()
  }

  const tab = (v: View, label: string, count: number | null) => (
    <button key={v} type="button" className={`pc-tab${view === v ? ' active' : ''}`} onClick={() => { setView(v) }}>
      {label}
      {count !== null && <span className="pc-count">{count}</span>}
    </button>
  )
  const tabs = (
    <div className="pc-tabs">
      {tab('installed', t('tabInstalled'), counts.installed)}
      {tab('market', t('tabMarket'), counts.market)}
      {tab('updates', t('tabUpdates'), updates?.length ?? 0)}
      {tab('diagnose', t('tabDiagnose'), null)}
    </div>
  )
  const head = (showTitle: boolean) => (
    <div className="pc-head">
      {showTitle && <span className="pc-title">{t('title')}</span>}
      <span className="pc-sub">{t('headSummary', { a: counts.installed, b: updates?.length ?? 0, c: counts.failed })}</span>
      <span className="pc-spacer" />
      <button className="pc-btn" disabled={checking} onClick={() => { refreshUpdates() }}>{checking ? t('checking') : t('check')}</button>
      <button className="pc-btn primary" disabled={!(updates?.length) || busyUpdate !== null} onClick={() => { void updateAll() }}>{t('updateAll', { n: updates?.length ?? 0 })}</button>
    </div>
  )
  const installedToolbar = view === 'installed' ? (
    <div className="pc-filter">
      <div className="pc-toolbar pc-toolbar-main">
        <input className="pc-search" value={search} onChange={e => { setSearch(e.target.value) }} placeholder={t('searchInstalled')} />
        <select className="pc-select" value={installedSource ?? ''} onChange={e => { setInstalledSource(e.target.value === '' ? null : e.target.value as PluginSource) }}>
          <option value="">{t('allSources')}</option>
          <option value="official">{t('srcOfficial')}</option>
          <option value="installed">{t('srcInstalled')}</option>
          <option value="local">{t('srcLocal')}</option>
          <option value="builtin">{t('srcBuiltin')}</option>
        </select>
      </div>
      <div className="pc-catbar">
        <button className={`pc-chip${installedCategory === null ? ' active' : ''}`} onClick={() => { setInstalledCategory(null) }}>{t('all')}</button>
        {CATEGORIES.map(c => (
          <button key={c} className={`pc-chip${installedCategory === c ? ' active' : ''}`} onClick={() => { setInstalledCategory(c) }}>{c}</button>
        ))}
      </div>
    </div>
  ) : null
  const marketToolbar = view === 'market' ? (
    <div className="pc-filter">
      <div className="pc-toolbar pc-toolbar-main">
        <input className="pc-search" style={{ flex: 1, minWidth: 120 }} value={marketSearch} onChange={e => { setMarketSearch(e.target.value) }} placeholder={t('searchMarket')} />
        <select className="pc-select" value={source} onChange={e => { setSource(e.target.value); setCategory(null) }}>
          <option value="awesome">awesome-dsh-plugin</option>
          <option value="oh-my-dsh">Oh-My-DSH</option>
          <option value="dsh-market">dsh-market</option>
          <option value="all">{t('allMarkets')}</option>
        </select>
        <span className="pc-spacer" />
        <button type="button" title={single ? t('gridDouble') : t('gridSingle')} aria-label={single ? t('gridDouble') : t('gridSingle')} className="pc-iconbtn" onClick={() => { setSingle(v => !v) }}>
          {single ? (
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="2" y="2" width="5" height="5" rx="1" /><rect x="9" y="2" width="5" height="5" rx="1" />
              <rect x="2" y="9" width="5" height="5" rx="1" /><rect x="9" y="9" width="5" height="5" rx="1" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="2" y="2" width="12" height="5" rx="1" /><rect x="2" y="9" width="12" height="5" rx="1" />
            </svg>
          )}
        </button>
      </div>
      <div className="pc-catbar">
        <button className={`pc-chip${category === null ? ' active' : ''}`} onClick={() => { setCategory(null) }}>{t('all')}</button>
        {CATEGORIES.map(c => (
          <button key={c} className={`pc-chip${category === c ? ' active' : ''}`} onClick={() => { setCategory(c) }}>{c}</button>
        ))}
      </div>
    </div>
  ) : null
  const body = (
    <>
      {view === 'installed' && <InstalledView search={search} category={installedCategory} source={installedSource} onToggle={handleToggle} togglingId={togglingId} />}
      {view === 'market' && <MarketView category={category} single={single} source={source} search={marketSearch} onCount={handleMarketCount} />}
      {view === 'updates' && <UpdatesView updates={updates} refresh={refreshUpdates} updateOne={updateOne} busy={busyUpdate} doneUpdates={doneUpdatesStore} onDoneClick={() => { askRestart(1) }} />}
      {view === 'diagnose' && <DiagnoseView />}
    </>
  )
  if (variant === 'overlay') {
    return (
      <>
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
          <div style={{ flex: 'none' }}>{head(false)}{tabs}{installedToolbar}{marketToolbar}</div>
          <div className="pc-scroll">{body}</div>
        </div>
        {commandDialog !== null && <CommandDialog command={commandDialog} copied={copied} onCopy={() => { setCopied(true) }} onClose={() => { setCommandDialog(null) }} />}
        {restartAsk > 0 && <RestartDialog count={restartAsk} onRestart={() => { const n = restartAsk; setRestartAsk(0); runRestartNow(n) }} onClose={() => { setRestartAsk(0) }} />}
      </>
    )
  }
  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
        <div style={{ flex: 'none', paddingBottom: '4px' }}>
          {head(true)}
          {tabs}
          {installedToolbar}
          {marketToolbar}
        </div>
        <div className="pc-scroll">{body}</div>
      </div>
      {commandDialog !== null && <CommandDialog command={commandDialog} copied={copied} onCopy={() => { setCopied(true) }} onClose={() => { setCommandDialog(null) }} />}
      {restartAsk > 0 && <RestartDialog count={restartAsk} onRestart={() => { const n = restartAsk; setRestartAsk(0); runRestartNow(n) }} onClose={() => { setRestartAsk(0) }} />}
    </>
  )
}

function HeaderButton() {
  const t = useT()
  return (
    <button type="button" title={t('title')} aria-label={t('title')} className="pc-headerbtn" onClick={openOverlay}>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="2" width="5" height="5" rx="1" /><rect x="9" y="2" width="5" height="5" rx="1" />
        <rect x="2" y="9" width="5" height="5" rx="1" /><rect x="9" y="9" width="5" height="5" rx="1" />
      </svg>
    </button>
  )
}

function OverlayPanel() {
  const t = useT()
  const open = useOverlayOpen()
  if (!open) return null
  return (
    // 0.1.7：点遮罩关闭——overlay 背景点击即 closeOverlay；面板内点击
    // stopPropagation 不冒泡到遮罩（面板内部交互不受影响）。
    <div className="pc-overlay" role="presentation" onClick={closeOverlay}>
      <div className="pc-panel" role="dialog" aria-modal="true" aria-label={t('title')} onClick={(e) => { e.stopPropagation() }}>
        <div className="pc-panel-head">
          <span className="pc-title">{t('title')}</span>
          <span className="pc-spacer" />
          <button type="button" className="pc-close" onClick={closeOverlay} aria-label={t('close')}>✕</button>
        </div>
        <div className="pc-panel-body">
          <CenterPanel variant="overlay" />
        </div>
      </div>
    </div>
  )
}

function Toast() {
  const t = useToast()
  if (t === null) return null
  // Portal to <body>: the shell.overlay layer sits at z-index 20, below the
  // settings dialog mask (z-index 1000), so an in-layer toast would be
  // invisible inside the settings panel (2026-08-22). Body top-level has no
  // stacking-context parent, so the toast's own z-index wins everywhere.
  return createPortal(<div className={`pc-toast ${t.kind}`}>{t.message}</div>, document.body)
}

function WhatsNewDialog() {
  const t = useT()
  const open = useWhatsNewOpen()
  const [busy, setBusy] = useState(false)
  if (!open || whatsNewDigests.length === 0) return null
  // 弹窗内串行更新全部（2026-08-17 用户反馈弹窗缺更新入口；串行防 pnpm 并发）
  const updateNow = async () => {
    setBusy(true)
    let okCount = 0
    const failures: string[] = []
    for (const u of whatsNewDigests) {
      try {
        const v = await rpc('update', { name: u.name, version: u.toVersion }) as boolean | object
        // 与插件中心页同款三段式解析（直装/pending/指令），2026-08-22：
        // 旧检查 `v !== true` 在新 host（返回 { durationMs, direct, pending,
        // command }）下必然抛“更新未生效”。
        const value = typeof v === 'object' && v !== null ? v as { durationMs?: number, direct?: boolean, pending?: boolean, command?: string } : null
        if (value === null || (value.durationMs === undefined && value.command === undefined)) throw new Error(t('updateNotApplied'))
        if (value.command !== undefined && value.command !== '') {
          // 撞锁且无消费方（官方 dsh web）：指引去插件中心查看命令（弹窗内不铺指令 UI）
          failures.push(`${u.name}：${t('commandHint')}`)
          continue
        }
        okCount++
        if (value.pending === true || value.direct === true) {
          // 与插件中心页一致：打「待重启生效」记录，卡片保留可点击重启
          pendingInstall.add(u.name)
          markDoneUpdate({ name: u.name, fromVersion: u.fromVersion, toVersion: u.toVersion })
        }
      } catch (e) {
        failures.push(`${u.name}：${e instanceof Error ? e.message : String(e)}`)
      }
    }
    setBusy(false)
    if (failures.length === 0) {
      showToast(t('updatedMany', { n: okCount }), 'ok', 6000)
      closeWhatsNew()
    } else {
      showToast(t('updateSummary', { a: okCount, b: failures.length, c: failures.join('；') }), 'error', 8000)
    }
  }
  return (
    <div className="pc-overlay" role="presentation">
      <div className="pc-panel" style={{ width: '540px' }} role="dialog" aria-modal="true" aria-label={t('whatsNewTitle')}>
        <div className="pc-panel-head">
          <span className="pc-title">{t('whatsNewTitle')}</span>
          <span className="pc-sub" style={{ marginTop: 0 }}>{t('whatsNewSub', { n: whatsNewDigests.length })}</span>
          <span className="pc-spacer" />
          <button type="button" className="pc-close" onClick={closeWhatsNew} aria-label={t('close')}>✕</button>
        </div>
        <div className="pc-panel-body" style={{ overflow: 'auto' }}>
          {whatsNewDigests.map(u => (
            <div key={u.name} className="pc-wn-item">
              <div className="pc-row">
                <span className="pc-name">{u.name}</span>
                <span className="pc-ver">{u.fromVersion}</span>
                <span className="pc-ver">→</span>
                <span style={{ color: 'var(--dsw-alias-state-business-primary)', fontWeight: 500 }}>{u.toVersion}</span>
              </div>
              {u.changelog.length > 0 && (
                <ul className="pc-wn-list">
                  {u.changelog.slice(0, 5).map((line, i) => <li key={i}>{line}</li>)}
                </ul>
              )}
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
            <button className="pc-btn" onClick={closeWhatsNew}>{t('later')}</button>
            <button className="pc-btn" onClick={closeWhatsNew}>{t('markAllRead')}</button>
            <button className="pc-btn primary" disabled={busy} onClick={() => { void updateNow() }}>{busy ? t('updating') : t('updateNow')}</button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ---- client plugin body ----
const inject = ['slots', 'connection']

// ---- 0.1.7：SSiD 标题栏统一按钮组全局控制器 ----
// SSiD 内置插件 dsh-header-unify 监听壳派发的 `ssid:titlebar` CustomEvent，
// 经这三个全局函数驱动插件中心（优先 toggle——再点关闭；开侧栏/底栏前
// 先 close 互斥）。页面卸载时清理，防页面重载/插件重载后残留旧引用。
const GLOBAL_KEYS = ['__pluginCenterOpen', '__pluginCenterToggle', '__pluginCenterClose'] as const
function installGlobals(): void {
  const w = window as unknown as Record<string, unknown>
  w.__pluginCenterOpen = openOverlay
  w.__pluginCenterToggle = toggleOverlay
  w.__pluginCenterClose = closeOverlay
  w.__pluginCenterGlobalsInstalled = true
}
function cleanupGlobals(): void {
  const w = window as unknown as Record<string, unknown>
  for (const key of GLOBAL_KEYS) delete w[key]
  delete w.__pluginCenterGlobalsInstalled
}

function apply(ctx: { slots: any; connection: any; get?: (name: string) => unknown; on?: (event: string, handler: (payload: any) => void) => void; effect?: (fn: () => (() => void) | void, name?: string) => void }): void {
  injectCss()
  // 设置导航图标：标记本插件行后由 CSS 把默认齿轮替换为拼图（HMR-safe）。
  ctx.effect?.(() => registerSettingsNavIcon(() => STRINGS[localeId].title), 'dsh-plugin-center: settings navigation icon')
  // 0.1.7：暴露全局控制器（防重复安装：已安装则不重复挂监听）。
  if ((window as unknown as Record<string, unknown>).__pluginCenterGlobalsInstalled !== true) {
    installGlobals()
    window.addEventListener('unload', cleanupGlobals)
  }
  rpc = async (endpoint: string, payload: unknown = {}): Promise<unknown> => {
    const result = await ctx.connection.rpc.call('/plugin-center', endpoint, payload)
    if (result.ok) return result.value
    throw new Error(result.error?.message ?? `plugin-center: ${endpoint} failed`)
  }

  // 双语：初始快照 + locale/change 事件（DSH 语言切换时组件经 useT 重渲染）。
  // 用 ctx.get 软获取而非 inject 声明：cordis 对未声明依赖的属性访问直接拒绝
  // （实测 "cannot get property locale without inject" 导致插件加载失败）；
  // locale 服务缺失时静默降级为中文。
  const locale = ctx.get?.('locale') as { getLocale?: () => { active?: string } } | undefined
  const initial = locale?.getLocale?.()?.active
  if (typeof initial === 'string') adoptLocale(initial)
  ctx.on?.('locale/change', (snap: { active?: string } | undefined) => { adoptLocale(snap?.active) })

  ctx.slots.inject('settings.section', () => ctx.slots.register({
    name: 'settings.section', id: 'plugin-center', order: 50, label: () => STRINGS[localeId].title,
  }, CenterPanel))

  ctx.slots.inject('conversation.session.header.utilities', () => ctx.slots.register({
    name: 'conversation.session.header.utilities', id: 'plugin-center', order: 50,
  }, HeaderButton))

  ctx.slots.inject('shell.overlay', () => ctx.slots.register({
    name: 'shell.overlay', id: 'plugin-center-panel', order: 50,
  }, OverlayPanel))

  ctx.slots.inject('shell.overlay', () => ctx.slots.register({
    name: 'shell.overlay', id: 'plugin-center-whats-new', order: 51,
  }, WhatsNewDialog))

  ctx.slots.inject('shell.overlay', () => ctx.slots.register({
    name: 'shell.overlay', id: 'plugin-center-toast', order: 52,
  }, Toast))

  void checkWhatNew()
}

export { inject, apply }
