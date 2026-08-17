window.__ModuleLoader__.load({
  id: "@max-null/dsh-plugin-center",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;

"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// client/index.tsx
var index_exports = {};
__export(index_exports, {
  apply: () => apply,
  inject: () => inject
});
module.exports = __toCommonJS(index_exports);
var import_react = require("react");
var import_jsx_runtime = require("react/jsx-runtime");
var CSS = `
.pc-title { font-size: 18px; font-weight: 600; line-height: 26px; color: var(--dsw-alias-label-primary); }
.pc-sub { font-size: 13px; line-height: 20px; margin-top: 4px; color: var(--dsw-alias-label-tertiary); }
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
.pc-dot { flex: none; width: 8px; height: 8px; border-radius: 50%; background: var(--dsw-alias-state-success-primary); }
.pc-dot.failed { background: var(--dsw-alias-state-error-primary); }

.pc-toolbar { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; padding: 4px 0; }
.pc-chip { height: 28px; padding: 0 12px; border-radius: 18px; border: 1px solid var(--dsw-alias-border-l2); background: var(--dsw-alias-bg-base); color: var(--dsw-alias-label-secondary); font-size: 13px; cursor: pointer; font-family: inherit; }
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
.pc-select { height: 28px; padding: 0 8px; border-radius: 18px; border: 1px solid var(--dsw-alias-border-l2); background: var(--dsw-alias-bg-base); color: var(--dsw-alias-label-secondary); font-size: 13px; cursor: pointer; font-family: inherit; }
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
.pc-toast { position: fixed; bottom: 32px; left: 50%; transform: translateX(-50%); padding: 10px 18px; border-radius: 10px; background: var(--dsw-alias-bg-layer-1); border: 1px solid var(--dsw-alias-border-l2); color: var(--dsw-alias-label-primary); font-size: 13px; box-shadow: 0 8px 32px rgba(0,0,0,.18); z-index: 200; max-width: 80vw; }
.pc-toast.ok { border-color: var(--dsw-alias-state-success-primary); }
.pc-toast.error { border-color: var(--dsw-alias-state-error-primary); }
`;
var cssInjected = false;
function injectCss() {
  if (cssInjected || typeof document === "undefined") return;
  cssInjected = true;
  const style = document.createElement("style");
  style.setAttribute("data-plugin", "@max-null/dsh-plugin-center");
  style.textContent = CSS;
  document.head.append(style);
}
var rpc = async () => {
  throw new Error("plugin-center: rpc not wired");
};
var overlayOpen = false;
var whatsNewOpen = false;
var whatsNewDigests = [];
var overlayListeners = /* @__PURE__ */ new Set();
var whatsNewListeners = /* @__PURE__ */ new Set();
function openOverlay() {
  overlayOpen = true;
  overlayListeners.forEach((l) => l());
}
function closeOverlay() {
  overlayOpen = false;
  overlayListeners.forEach((l) => l());
}
function closeWhatsNew() {
  whatsNewOpen = false;
  for (const d of whatsNewDigests) readCache[d.name] = d.toVersion;
  void rpc("markRead", { versions: readCache });
  whatsNewListeners.forEach((l) => l());
}
function useOverlayOpen() {
  const [open, setOpen] = (0, import_react.useState)(overlayOpen);
  (0, import_react.useEffect)(() => {
    const l = () => {
      setOpen(overlayOpen);
    };
    overlayListeners.add(l);
    return () => {
      overlayListeners.delete(l);
    };
  }, []);
  return open;
}
function useWhatsNewOpen() {
  const [open, setOpen] = (0, import_react.useState)(whatsNewOpen);
  (0, import_react.useEffect)(() => {
    const l = () => {
      setOpen(whatsNewOpen);
    };
    whatsNewListeners.add(l);
    return () => {
      whatsNewListeners.delete(l);
    };
  }, []);
  return open;
}
var readCache = {};
var installedCache = null;
var marketCache = {};
var toastState = null;
var toastListeners = /* @__PURE__ */ new Set();
function showToast(message, kind = "ok", duration = 3200) {
  toastState = { message, kind, until: Date.now() + duration };
  toastListeners.forEach((l) => l());
}
var pendingInstall = /* @__PURE__ */ new Set();
function useToast() {
  const [t, setT] = (0, import_react.useState)(toastState);
  (0, import_react.useEffect)(() => {
    const l = () => {
      setT(toastState);
    };
    toastListeners.add(l);
    return () => {
      toastListeners.delete(l);
    };
  }, []);
  (0, import_react.useEffect)(() => {
    if (t === null) return;
    const id = setTimeout(() => {
      toastState = null;
      toastListeners.forEach((l) => l());
    }, Math.max(0, t.until - Date.now()));
    return () => clearTimeout(id);
  }, [t]);
  return t;
}
async function checkWhatNew() {
  try {
    const since = new Date(Date.now() - 30 * 864e5).toISOString();
    const digests = await rpc("checkUpdates", { since });
    readCache = await rpc("readVersions");
    const fresh = digests.filter((d) => readCache[d.name] !== d.toVersion);
    if (fresh.length > 0) {
      whatsNewDigests = fresh;
      whatsNewOpen = true;
      whatsNewListeners.forEach((l) => l());
    }
  } catch {
  }
}
var CATEGORIES = ["ui", "usage", "theme", "model", "session", "memory", "tools", "vision", "skill", "workflow", "notify", "dev", "market", "fun"];
var STRINGS = {
  zh: {
    title: "\u63D2\u4EF6\u4E2D\u5FC3",
    tabInstalled: "\u5DF2\u5B89\u88C5",
    tabMarket: "\u5E02\u573A",
    tabUpdates: "\u66F4\u65B0",
    headSummary: "\u5DF2\u5B89\u88C5 {a} \xB7 \u6709\u66F4\u65B0 {b} \xB7 \u5931\u6548 {c}",
    check: "\u68C0\u67E5\u66F4\u65B0",
    checking: "\u68C0\u67E5\u4E2D\u2026",
    updateAll: "\u66F4\u65B0\u5168\u90E8\uFF08{n}\uFF09",
    searchInstalled: "\u641C\u7D22\u5DF2\u5B89\u88C5\u63D2\u4EF6",
    allSources: "\u5168\u90E8\u6765\u6E90",
    srcOfficial: "\u5B98\u65B9",
    srcInstalled: "\u7528\u6237\u5B89\u88C5",
    srcLocal: "\u672C\u5730\u5F00\u53D1",
    srcBuiltin: "\u5185\u7F6E",
    all: "\u5168\u90E8",
    searchMarket: "\u641C\u7D22\u793E\u533A\u63D2\u4EF6",
    allMarkets: "\u5168\u90E8\u6E90",
    gridDouble: "\u53CC\u5217\u7F51\u683C",
    gridSingle: "\u5355\u5217\u5217\u8868",
    loadFailed: "\u52A0\u8F7D\u5931\u8D25\uFF1A{e}",
    loading: "\u52A0\u8F7D\u4E2D\u2026",
    marketLoading: "\u52A0\u8F7D\u5E02\u573A\u76EE\u5F55\u4E2D\u2026",
    loadMore: "\u6B63\u5728\u52A0\u8F7D\u66F4\u591A\u2026\uFF08\u5DF2\u52A0\u8F7D {n} \u4E2A\uFF09",
    checkingUpdates: "\u68C0\u67E5\u66F4\u65B0\u4E2D\u2026",
    noUpdates: "\u6CA1\u6709\u53EF\u7528\u7684\u66F4\u65B0\u3002",
    recheck: "\u91CD\u65B0\u68C0\u67E5",
    incompat: "\u4E0D\u517C\u5BB9\u5F53\u524D DSH",
    update: "\u66F4\u65B0",
    updating: "\u66F4\u65B0\u4E2D\u2026",
    install: "\u5B89\u88C5",
    installing: "\u5B89\u88C5\u4E2D\u2026",
    pendingRestart: "\u5F85\u91CD\u542F\u751F\u6548",
    installedTag: "\u5DF2\u5B89\u88C5",
    disabledTag: "\u5DF2\u7981\u7528",
    requiresDsh: "\u8981\u6C42 DSH {r}",
    installQueued: "\u5DF2\u53D1\u8D77\u5B89\u88C5 {n}\uFF0C\u91CD\u542F dsh web \u540E\u751F\u6548",
    installFailed: "\u5B89\u88C5\u5931\u8D25\uFF1A{e}",
    installNotApplied: "\u5B89\u88C5\u672A\u751F\u6548",
    updatedOne: "\u5DF2\u66F4\u65B0 {n}\uFF0C\u91CD\u542F dsh web \u540E\u751F\u6548",
    updateFailed: "\u66F4\u65B0\u5931\u8D25\uFF1A{e}",
    updateNotApplied: "\u66F4\u65B0\u672A\u751F\u6548",
    updatedMany: "\u5DF2\u66F4\u65B0 {n} \u4E2A\u63D2\u4EF6\uFF0C\u91CD\u542F dsh web \u540E\u751F\u6548",
    updateSummary: "\u66F4\u65B0\u5B8C\u6210\uFF1A\u6210\u529F {a}\uFF0C\u5931\u8D25 {b}\uFF08{c}\uFF09",
    whatsNewTitle: "\u63D2\u4EF6\u66F4\u65B0",
    whatsNewSub: "{n} \u4E2A\u63D2\u4EF6\u6709\u65B0\u7248\u672C",
    later: "\u7A0D\u540E",
    markAllRead: "\u5168\u90E8\u6807\u8BB0\u5DF2\u8BFB",
    updateNow: "\u7ACB\u5373\u66F4\u65B0",
    close: "\u5173\u95ED",
    checkFail: "\u68C0\u67E5\u66F4\u65B0\u5931\u8D25\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5",
    foundUpdates: "\u53D1\u73B0 {n} \u4E2A\u53EF\u66F4\u65B0\u63D2\u4EF6",
    allUpToDate: "\u6240\u6709\u63D2\u4EF6\u5747\u4E3A\u6700\u65B0"
  },
  en: {
    title: "Plugin Center",
    tabInstalled: "Installed",
    tabMarket: "Market",
    tabUpdates: "Updates",
    headSummary: "{a} installed \xB7 {b} updates \xB7 {c} failed",
    check: "Check updates",
    checking: "Checking\u2026",
    updateAll: "Update all\uFF08{n}\uFF09",
    searchInstalled: "Search installed plugins",
    allSources: "All sources",
    srcOfficial: "Official",
    srcInstalled: "User installed",
    srcLocal: "Local dev",
    srcBuiltin: "Built-in",
    all: "All",
    searchMarket: "Search community plugins",
    allMarkets: "All sources",
    gridDouble: "Two-column grid",
    gridSingle: "Single-column list",
    loadFailed: "Failed to load: {e}",
    loading: "Loading\u2026",
    marketLoading: "Loading market catalog\u2026",
    loadMore: "Loading more\u2026 ({n} loaded)",
    checkingUpdates: "Checking for updates\u2026",
    noUpdates: "No updates available.",
    recheck: "Check again",
    incompat: "Incompatible with current DSH",
    update: "Update",
    updating: "Updating\u2026",
    install: "Install",
    installing: "Installing\u2026",
    pendingRestart: "Restart pending",
    installedTag: "Installed",
    disabledTag: "Disabled",
    requiresDsh: "Requires DSH {r}",
    installQueued: "Install of {n} started; restart dsh web to take effect",
    installFailed: "Install failed: {e}",
    installNotApplied: "Install did not take effect",
    updatedOne: "Updated {n}; restart dsh web to take effect",
    updateFailed: "Update failed: {e}",
    updateNotApplied: "Update did not take effect",
    updatedMany: "Updated {n} plugins; restart dsh web to take effect",
    updateSummary: "Update done: {a} succeeded, {b} failed ({c})",
    whatsNewTitle: "Plugin updates",
    whatsNewSub: "{n} plugins have new versions",
    later: "Later",
    markAllRead: "Mark all read",
    updateNow: "Update now",
    close: "Close",
    checkFail: "Failed to check updates, please retry later",
    foundUpdates: "{n} updates found",
    allUpToDate: "All plugins are up to date"
  }
};
var localeId = "zh";
var localeListeners = /* @__PURE__ */ new Set();
function adoptLocale(id) {
  const next = id === "en" ? "en" : "zh";
  if (next === localeId) return;
  localeId = next;
  localeListeners.forEach((l) => l());
}
function fmt(tpl, vars = {}) {
  return tpl.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ""));
}
function useT() {
  const [id, setId] = (0, import_react.useState)(localeId);
  (0, import_react.useEffect)(() => {
    const l = () => {
      setId(localeId);
    };
    localeListeners.add(l);
    return () => {
      localeListeners.delete(l);
    };
  }, []);
  return (key, vars) => fmt(STRINGS[id][key] ?? STRINGS.zh[key], vars);
}
function InstalledView({ search, category, source }) {
  const t = useT();
  const [items, setItems] = (0, import_react.useState)(installedCache);
  const [error, setError] = (0, import_react.useState)(null);
  (0, import_react.useEffect)(() => {
    if (installedCache !== null) return;
    let alive = true;
    void rpc("listInstalled").then(
      (v) => {
        installedCache = v;
        if (alive) setItems(installedCache);
      },
      (e) => {
        if (alive) setError(e instanceof Error ? e.message : String(e));
      }
    );
    return () => {
      alive = false;
    };
  }, []);
  if (error !== null) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "pc-sub", children: t("loadFailed", { e: error }) });
  if (items === null) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "pc-sub", children: t("loading") });
  const srcLabel = {
    official: t("srcOfficial"),
    installed: t("srcInstalled"),
    local: t("srcLocal"),
    builtin: t("srcBuiltin")
  };
  const q = search.trim().toLowerCase();
  const filtered = items.filter((p) => {
    const matchSearch = q === "" || p.displayName.toLowerCase().includes(q) || (p.description ?? "").toLowerCase().includes(q) || p.name.toLowerCase().includes(q);
    const matchCategory = category === null || p.categories.includes(category);
    const matchSource = source === null || p.source === source;
    return matchSearch && matchCategory && matchSource;
  });
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: filtered.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "pc-card", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "pc-row", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "pc-name", children: p.displayName }),
      p.version !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "pc-ver", children: [
        "v",
        p.version
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `pc-badge ${p.source}`, children: srcLabel[p.source] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "pc-spacer" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `pc-dot${p.fiberPhase === "failed" ? " failed" : ""}` })
    ] }),
    p.description !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pc-desc", children: p.description }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "pc-meta", children: [
      p.categories.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "pc-tag", children: c }, c)),
      p.compatRange !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "pc-tag", children: t("requiresDsh", { r: p.compatRange }) }),
      !p.enabled && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "pc-tag", children: t("disabledTag") })
    ] })
  ] }, p.entryId)) });
}
function MarketView({ category, single, source, search, onCount }) {
  const t = useT();
  const [items, setItems] = (0, import_react.useState)(marketCache[source]?.plugins ?? []);
  const [done, setDone] = (0, import_react.useState)(marketCache[source]?.done ?? false);
  const [error, setError] = (0, import_react.useState)(null);
  const [busy, setBusy] = (0, import_react.useState)(null);
  (0, import_react.useEffect)(() => {
    let alive = true;
    let timer;
    const cached = marketCache[source];
    if (cached !== void 0) {
      setItems(cached.plugins);
      setDone(cached.done);
      onCount(cached.plugins.length);
      if (cached.done) return;
    } else {
      setItems([]);
      setDone(false);
      onCount(0);
    }
    const poll = async () => {
      try {
        const r = await rpc("listMarket", { source });
        if (!alive) return;
        marketCache[source] = { plugins: r.plugins, done: r.done };
        setItems(r.plugins);
        setDone(r.done);
        onCount(r.plugins.length);
        if (!r.done) timer = setTimeout(poll, 1200);
      } catch (e) {
        if (alive) setError(e instanceof Error ? e.message : String(e));
      }
    };
    void poll();
    return () => {
      alive = false;
      if (timer !== void 0) clearTimeout(timer);
    };
  }, [source, onCount]);
  if (error !== null) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "pc-sub", children: t("loadFailed", { e: error }) });
  if (items.length === 0 && !done) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "pc-sub", children: t("marketLoading") });
  const q = search.trim().toLowerCase();
  const filtered = items.filter((m) => {
    const matchSearch = q === "" || m.name.toLowerCase().includes(q) || (m.description.zh || m.description.en).toLowerCase().includes(q);
    return matchSearch && (category === null || m.categories.includes(category));
  });
  const descOf = (m) => localeId === "en" ? m.description.en || m.description.zh : m.description.zh || m.description.en;
  const install = (m) => {
    setBusy(m.name);
    void rpc("install", { spec: m.spec }).then(
      (v) => {
        if (v !== true) throw new Error(t("installNotApplied"));
        setBusy(null);
        pendingInstall.add(m.spec);
        for (const key of Object.keys(marketCache)) {
          const c = marketCache[key];
          if (c !== void 0) c.plugins = c.plugins.map((p) => p.name === m.name ? { ...p, installed: true } : p);
        }
        setItems((prev) => prev.map((p) => p.name === m.name ? { ...p, installed: true } : p));
        showToast(t("installQueued", { n: m.name }), "ok", 5e3);
      },
      (e) => {
        setBusy(null);
        showToast(t("installFailed", { e: e instanceof Error ? e.message : String(e) }), "error", 8e3);
      }
    );
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `pc-grid ${single ? "single" : "double"}`, children: filtered.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "pc-card", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "pc-row", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "pc-name", children: m.name }),
        m.stars !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "pc-ver", children: [
          "\u2605 ",
          m.stars
        ] }),
        m.version !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "pc-ver", children: [
          "v",
          m.version
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pc-desc", children: descOf(m) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "pc-meta", children: [
        m.categories.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "pc-tag", children: c }, c)),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "pc-spacer" }),
        m.installed || pendingInstall.has(m.spec) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "pc-tag", children: pendingInstall.has(m.spec) ? t("pendingRestart") : t("installedTag") }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { className: "pc-btn primary", disabled: busy !== null, onClick: () => {
          install(m);
        }, children: busy === m.name ? t("installing") : t("install") })
      ] })
    ] }, m.name)) }),
    !done && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "pc-sub", children: t("loadMore", { n: items.length }) })
  ] });
}
function UpdatesView({ updates, refresh, updateOne, busy }) {
  const t = useT();
  if (updates === null) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "pc-sub", children: t("checkingUpdates") });
  if (updates.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "pc-sub", children: t("noUpdates") }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { className: "pc-btn", onClick: refresh, children: t("recheck") })
  ] });
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: updates.map((u) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "pc-card", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "pc-row", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "pc-name", children: u.name }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "pc-ver", children: u.fromVersion }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "pc-ver", children: "\u2192" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { color: "var(--dsw-alias-state-business-primary)", fontWeight: 500 }, children: u.toVersion }),
      u.compat === "incompatible" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "pc-tag danger", children: t("incompat") }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "pc-spacer" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { className: "pc-btn primary", disabled: busy !== null, onClick: () => {
        updateOne(u.name);
      }, children: busy === u.name || busy === "__all__" ? t("updating") : t("update") })
    ] }),
    u.changelog.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { className: "pc-wn-list", children: u.changelog.slice(0, 5).map((line, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: line }, i)) })
  ] }, u.name)) });
}
function CenterPanel({ variant = "section" }) {
  const t = useT();
  const [view, setView] = (0, import_react.useState)("installed");
  const [category, setCategory] = (0, import_react.useState)(null);
  const [single, setSingle] = (0, import_react.useState)(false);
  const [source, setSource] = (0, import_react.useState)("awesome");
  const [search, setSearch] = (0, import_react.useState)("");
  const [installedCategory, setInstalledCategory] = (0, import_react.useState)(null);
  const [marketSearch, setMarketSearch] = (0, import_react.useState)("");
  const [installedSource, setInstalledSource] = (0, import_react.useState)(null);
  const [installedCount, setInstalledCount] = (0, import_react.useState)(0);
  const [failedCount, setFailedCount] = (0, import_react.useState)(0);
  const [marketCount, setMarketCount] = (0, import_react.useState)(0);
  const [updates, setUpdates] = (0, import_react.useState)(null);
  const [busyUpdate, setBusyUpdate] = (0, import_react.useState)(null);
  const [checking, setChecking] = (0, import_react.useState)(false);
  const refreshUpdates = (0, import_react.useCallback)((silent = false) => {
    setChecking(true);
    void rpc("checkUpdates", { since: new Date(Date.now() - 30 * 864e5).toISOString() }).then(
      (v) => {
        const digests = v;
        setUpdates((prev) => digests.map((d) => {
          if (d.changelog.length > 0) return d;
          const old = prev?.find((p) => p.name === d.name);
          return old !== void 0 && old.changelog.length > 0 ? { ...d, changelog: old.changelog } : d;
        }));
        setChecking(false);
        if (!silent) {
          showToast(digests.length > 0 ? t("foundUpdates", { n: digests.length }) : t("allUpToDate"));
        }
      },
      () => {
        setChecking(false);
        if (!silent) showToast(t("checkFail"), "error");
      }
    );
  }, [t]);
  (0, import_react.useEffect)(() => {
    void rpc("listInstalled").then(
      (v) => {
        const items = v;
        setInstalledCount(items.length);
        setFailedCount(items.filter((p) => p.fiberPhase === "failed").length);
      },
      () => {
      }
    );
    refreshUpdates(true);
  }, [refreshUpdates]);
  (0, import_react.useEffect)(() => {
    let alive = true;
    let timer = null;
    const poll = async () => {
      if (!alive) return;
      try {
        const r = await rpc("listMarket", { source: "all" });
        if (!alive) return;
        marketCache.all = { plugins: r.plugins, done: r.done };
        setMarketCount(r.plugins.length);
        if (!r.done) timer = setTimeout(() => {
          void poll();
        }, 5e3);
      } catch {
        if (alive) timer = setTimeout(() => {
          void poll();
        }, 15e3);
      }
    };
    void poll();
    return () => {
      alive = false;
      if (timer !== null) clearTimeout(timer);
    };
  }, []);
  const updateOne = (name) => {
    setBusyUpdate(name);
    void rpc("update", { name }).then(
      (v) => {
        if (v !== true) throw new Error(t("updateNotApplied"));
        setBusyUpdate(null);
        showToast(t("updatedOne", { n: name }), "ok", 5e3);
      },
      (e) => {
        setBusyUpdate(null);
        showToast(t("updateFailed", { e: e instanceof Error ? e.message : String(e) }), "error", 8e3);
      }
    );
  };
  const updateAll = async () => {
    if (updates === null || updates.length === 0) return;
    setBusyUpdate("__all__");
    let okCount = 0;
    const okNames = [];
    const failures = [];
    for (const u of updates) {
      try {
        const v = await rpc("update", { name: u.name });
        if (v !== true) throw new Error(t("updateNotApplied"));
        okCount++;
        okNames.push(u.name);
      } catch (e) {
        failures.push(`${u.name}\uFF1A${e instanceof Error ? e.message : String(e)}`);
      }
    }
    setBusyUpdate(null);
    if (failures.length === 0) {
      showToast(t("updatedMany", { n: okCount }) + `\uFF08${okNames.join("\u3001")}\uFF09`, "ok", 6e3);
    } else {
      showToast(t("updateSummary", { a: okCount, b: failures.length, c: failures.join("\uFF1B") }), "error", 8e3);
    }
    refreshUpdates();
  };
  const tab = (v, label, count) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", { type: "button", className: `pc-tab${view === v ? " active" : ""}`, onClick: () => {
    setView(v);
  }, children: [
    label,
    count !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "pc-count", children: count })
  ] }, v);
  const tabs = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "pc-tabs", children: [
    tab("installed", t("tabInstalled"), installedCount),
    tab("market", t("tabMarket"), marketCount),
    tab("updates", t("tabUpdates"), updates?.length ?? 0)
  ] });
  const head = (showTitle) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "pc-head", children: [
    showTitle && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "pc-title", children: t("title") }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "pc-sub", children: t("headSummary", { a: installedCount, b: updates?.length ?? 0, c: failedCount }) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "pc-spacer" }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { className: "pc-btn", disabled: checking, onClick: () => {
      refreshUpdates();
    }, children: checking ? t("checking") : t("check") }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { className: "pc-btn primary", disabled: !updates?.length || busyUpdate !== null, onClick: () => {
      void updateAll();
    }, children: t("updateAll", { n: updates?.length ?? 0 }) })
  ] });
  const installedToolbar = view === "installed" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "pc-toolbar", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { className: "pc-search", value: search, onChange: (e) => {
      setSearch(e.target.value);
    }, placeholder: t("searchInstalled") }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", { className: "pc-select", value: installedSource ?? "", onChange: (e) => {
      setInstalledSource(e.target.value === "" ? null : e.target.value);
    }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "", children: t("allSources") }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "official", children: t("srcOfficial") }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "installed", children: t("srcInstalled") }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "local", children: t("srcLocal") }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "builtin", children: t("srcBuiltin") })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { className: `pc-chip${installedCategory === null ? " active" : ""}`, onClick: () => {
      setInstalledCategory(null);
    }, children: t("all") }),
    CATEGORIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { className: `pc-chip${installedCategory === c ? " active" : ""}`, onClick: () => {
      setInstalledCategory(c);
    }, children: c }, c))
  ] }) : null;
  const marketToolbar = view === "market" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "pc-toolbar", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { className: "pc-search", value: marketSearch, onChange: (e) => {
      setMarketSearch(e.target.value);
    }, placeholder: t("searchMarket") }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", { className: "pc-select", value: source, onChange: (e) => {
      setSource(e.target.value);
      setCategory(null);
    }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "awesome", children: "awesome-dsh-plugin" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "oh-my-dsh", children: "Oh-My-DSH" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "all", children: t("allMarkets") })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { className: `pc-chip${category === null ? " active" : ""}`, onClick: () => {
      setCategory(null);
    }, children: t("all") }),
    CATEGORIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { className: `pc-chip${category === c ? " active" : ""}`, onClick: () => {
      setCategory(c);
    }, children: c }, c)),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "pc-spacer" }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", title: single ? t("gridDouble") : t("gridSingle"), "aria-label": single ? t("gridDouble") : t("gridSingle"), className: "pc-iconbtn", onClick: () => {
      setSingle((v) => !v);
    }, children: single ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", { width: "14", height: "14", viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", strokeWidth: "1.5", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", { x: "2", y: "2", width: "5", height: "5", rx: "1" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", { x: "9", y: "2", width: "5", height: "5", rx: "1" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", { x: "2", y: "9", width: "5", height: "5", rx: "1" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", { x: "9", y: "9", width: "5", height: "5", rx: "1" })
    ] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", { width: "14", height: "14", viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", strokeWidth: "1.5", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", { x: "2", y: "2", width: "12", height: "5", rx: "1" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", { x: "2", y: "9", width: "12", height: "5", rx: "1" })
    ] }) })
  ] }) : null;
  const body = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    view === "installed" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InstalledView, { search, category: installedCategory, source: installedSource }),
    view === "market" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MarketView, { category, single, source, search: marketSearch, onCount: setMarketCount }),
    view === "updates" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UpdatesView, { updates, refresh: refreshUpdates, updateOne, busy: busyUpdate })
  ] });
  if (variant === "overlay") {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { flex: "none" }, children: [
        head(false),
        tabs,
        installedToolbar,
        marketToolbar
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pc-scroll", children: body })
    ] });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", flexDirection: "column", height: "100%", minHeight: 0 }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { flex: "none", paddingBottom: "4px" }, children: [
      head(true),
      tabs,
      installedToolbar,
      marketToolbar
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pc-scroll", children: body })
  ] });
}
function HeaderButton() {
  const t = useT();
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", title: t("title"), "aria-label": t("title"), className: "pc-headerbtn", onClick: openOverlay, children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", strokeWidth: "1.5", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", { x: "2", y: "2", width: "5", height: "5", rx: "1" }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", { x: "9", y: "2", width: "5", height: "5", rx: "1" }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", { x: "2", y: "9", width: "5", height: "5", rx: "1" }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", { x: "9", y: "9", width: "5", height: "5", rx: "1" })
  ] }) });
}
function OverlayPanel() {
  const t = useT();
  const open = useOverlayOpen();
  if (!open) return null;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pc-overlay", role: "presentation", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "pc-panel", role: "dialog", "aria-modal": "true", "aria-label": t("title"), children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "pc-panel-head", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "pc-title", children: t("title") }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "pc-spacer" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", className: "pc-close", onClick: closeOverlay, "aria-label": t("close"), children: "\u2715" })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pc-panel-body", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CenterPanel, { variant: "overlay" }) })
  ] }) });
}
function Toast() {
  const t = useToast();
  if (t === null) return null;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `pc-toast ${t.kind}`, children: t.message });
}
function WhatsNewDialog() {
  const t = useT();
  const open = useWhatsNewOpen();
  const [busy, setBusy] = (0, import_react.useState)(false);
  if (!open || whatsNewDigests.length === 0) return null;
  const updateNow = async () => {
    setBusy(true);
    let okCount = 0;
    const failures = [];
    for (const u of whatsNewDigests) {
      try {
        const v = await rpc("update", { name: u.name });
        if (v !== true) throw new Error(t("updateNotApplied"));
        okCount++;
      } catch (e) {
        failures.push(`${u.name}\uFF1A${e instanceof Error ? e.message : String(e)}`);
      }
    }
    setBusy(false);
    if (failures.length === 0) {
      showToast(t("updatedMany", { n: okCount }), "ok", 6e3);
      closeWhatsNew();
    } else {
      showToast(t("updateSummary", { a: okCount, b: failures.length, c: failures.join("\uFF1B") }), "error", 8e3);
    }
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pc-overlay", role: "presentation", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "pc-panel", style: { width: "540px" }, role: "dialog", "aria-modal": "true", "aria-label": t("whatsNewTitle"), children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "pc-panel-head", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "pc-title", children: t("whatsNewTitle") }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "pc-sub", style: { marginTop: 0 }, children: t("whatsNewSub", { n: whatsNewDigests.length }) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "pc-spacer" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", className: "pc-close", onClick: closeWhatsNew, "aria-label": t("close"), children: "\u2715" })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "pc-panel-body", style: { overflow: "auto" }, children: [
      whatsNewDigests.map((u) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "pc-wn-item", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "pc-row", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "pc-name", children: u.name }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "pc-ver", children: u.fromVersion }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "pc-ver", children: "\u2192" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { color: "var(--dsw-alias-state-business-primary)", fontWeight: 500 }, children: u.toVersion })
        ] }),
        u.changelog.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { className: "pc-wn-list", children: u.changelog.slice(0, 5).map((line, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: line }, i)) })
      ] }, u.name)),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "16px" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { className: "pc-btn", onClick: closeWhatsNew, children: t("later") }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { className: "pc-btn", onClick: closeWhatsNew, children: t("markAllRead") }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { className: "pc-btn primary", disabled: busy, onClick: () => {
          void updateNow();
        }, children: busy ? t("updating") : t("updateNow") })
      ] })
    ] })
  ] }) });
}
var inject = ["slots", "connection"];
function apply(ctx) {
  injectCss();
  rpc = async (endpoint, payload = {}) => {
    const result = await ctx.connection.rpc.call("/plugin-center", endpoint, payload);
    if (result.ok) return result.value;
    throw new Error(result.error?.message ?? `plugin-center: ${endpoint} failed`);
  };
  const locale = ctx.get?.("locale");
  const initial = locale?.getLocale?.()?.active;
  if (typeof initial === "string") adoptLocale(initial);
  ctx.on?.("locale/change", (snap) => {
    adoptLocale(snap?.active);
  });
  ctx.slots.inject("settings.section", () => ctx.slots.register({
    name: "settings.section",
    id: "plugin-center",
    order: 50,
    label: () => STRINGS[localeId].title
  }, CenterPanel));
  ctx.slots.inject("conversation.session.header.utilities", () => ctx.slots.register({
    name: "conversation.session.header.utilities",
    id: "plugin-center",
    order: 50
  }, HeaderButton));
  ctx.slots.inject("shell.overlay", () => ctx.slots.register({
    name: "shell.overlay",
    id: "plugin-center-panel",
    order: 50
  }, OverlayPanel));
  ctx.slots.inject("shell.overlay", () => ctx.slots.register({
    name: "shell.overlay",
    id: "plugin-center-whats-new",
    order: 51
  }, WhatsNewDialog));
  ctx.slots.inject("shell.overlay", () => ctx.slots.register({
    name: "shell.overlay",
    id: "plugin-center-toast",
    order: 52
  }, Toast));
  void checkWhatNew();
}
    return module.exports;
  },
});

