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
function showToast(message, kind = "ok") {
  toastState = { message, kind };
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
    }, 3200);
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
var SOURCE_LABEL = { official: "\u5B98\u65B9", installed: "\u7528\u6237\u5B89\u88C5", local: "\u672C\u5730\u5F00\u53D1", builtin: "\u5185\u7F6E" };
var CATEGORIES = ["ui", "usage", "theme", "model", "session", "memory", "tools", "vision", "skill", "workflow", "notify", "dev", "market", "fun"];
function InstalledView({ search, category, source }) {
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
  if (error !== null) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "pc-sub", children: [
    "\u52A0\u8F7D\u5931\u8D25\uFF1A",
    error
  ] });
  if (items === null) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "pc-sub", children: "\u52A0\u8F7D\u4E2D\u2026" });
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
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `pc-badge ${p.source}`, children: SOURCE_LABEL[p.source] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "pc-spacer" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `pc-dot${p.fiberPhase === "failed" ? " failed" : ""}` })
    ] }),
    p.description !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pc-desc", children: p.description }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "pc-meta", children: [
      p.categories.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "pc-tag", children: c }, c)),
      p.compatRange !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "pc-tag", children: [
        "\u8981\u6C42 DSH ",
        p.compatRange
      ] }),
      !p.enabled && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "pc-tag", children: "\u5DF2\u7981\u7528" })
    ] })
  ] }, p.entryId)) });
}
function MarketView({ category, single, source, search, onCount }) {
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
  if (error !== null) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "pc-sub", children: [
    "\u52A0\u8F7D\u5931\u8D25\uFF1A",
    error
  ] });
  if (items.length === 0 && !done) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "pc-sub", children: "\u52A0\u8F7D\u5E02\u573A\u76EE\u5F55\u4E2D\u2026" });
  const q = search.trim().toLowerCase();
  const filtered = items.filter((m) => {
    const matchSearch = q === "" || m.name.toLowerCase().includes(q) || (m.description.zh || m.description.en).toLowerCase().includes(q);
    return matchSearch && (category === null || m.categories.includes(category));
  });
  const install = (m) => {
    setBusy(m.name);
    void rpc("install", { spec: m.spec }).then(
      () => {
        setBusy(null);
        pendingInstall.add(m.spec);
        for (const key of Object.keys(marketCache)) {
          const c = marketCache[key];
          if (c !== void 0) c.plugins = c.plugins.map((p) => p.name === m.name ? { ...p, installed: true } : p);
        }
        setItems((prev) => prev.map((p) => p.name === m.name ? { ...p, installed: true } : p));
        showToast(`\u5DF2\u53D1\u8D77\u5B89\u88C5 ${m.name}\uFF0C\u91CD\u542F dsh web \u540E\u751F\u6548`);
      },
      (e) => {
        setBusy(null);
        showToast(`\u5B89\u88C5\u5931\u8D25\uFF1A${e instanceof Error ? e.message : String(e)}`, "error");
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
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pc-desc", children: m.description.zh || m.description.en }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "pc-meta", children: [
        m.categories.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "pc-tag", children: c }, c)),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "pc-spacer" }),
        m.installed || pendingInstall.has(m.spec) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "pc-tag", children: pendingInstall.has(m.spec) ? "\u5F85\u91CD\u542F\u751F\u6548" : "\u5DF2\u5B89\u88C5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { className: "pc-btn primary", disabled: busy !== null, onClick: () => {
          install(m);
        }, children: busy === m.name ? "\u5B89\u88C5\u4E2D\u2026" : "\u5B89\u88C5" })
      ] })
    ] }, m.name)) }),
    !done && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "pc-sub", children: [
      "\u6B63\u5728\u52A0\u8F7D\u66F4\u591A\u2026\uFF08\u5DF2\u52A0\u8F7D ",
      items.length,
      " \u4E2A\uFF09"
    ] })
  ] });
}
function UpdatesView({ updates, refresh, updateOne, busy }) {
  if (updates === null) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "pc-sub", children: "\u68C0\u67E5\u66F4\u65B0\u4E2D\u2026" });
  if (updates.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "pc-sub", children: "\u6CA1\u6709\u53EF\u7528\u7684\u66F4\u65B0\u3002" }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { className: "pc-btn", onClick: refresh, children: "\u91CD\u65B0\u68C0\u67E5" })
  ] });
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: updates.map((u) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "pc-card", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "pc-row", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "pc-name", children: u.name }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "pc-ver", children: u.fromVersion }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "pc-ver", children: "\u2192" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { color: "var(--dsw-alias-state-business-primary)", fontWeight: 500 }, children: u.toVersion }),
      u.compat === "incompatible" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "pc-tag danger", children: "\u4E0D\u517C\u5BB9\u5F53\u524D DSH" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "pc-spacer" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { className: "pc-btn primary", disabled: busy !== null, onClick: () => {
        updateOne(u.name);
      }, children: busy === u.name || busy === "__all__" ? "\u66F4\u65B0\u4E2D\u2026" : "\u66F4\u65B0" })
    ] }),
    u.changelog.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { className: "pc-wn-list", children: u.changelog.slice(0, 5).map((line, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: line }, i)) })
  ] }, u.name)) });
}
function CenterPanel({ variant = "section" }) {
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
  const refreshUpdates = (0, import_react.useCallback)(() => {
    void rpc("checkUpdates", { since: new Date(Date.now() - 30 * 864e5).toISOString() }).then(
      (v) => {
        setUpdates(v);
      },
      () => {
      }
    );
  }, []);
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
    refreshUpdates();
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
      () => {
        setBusyUpdate(null);
        showToast(`\u5DF2\u66F4\u65B0 ${name}\uFF0C\u91CD\u542F dsh web \u540E\u751F\u6548`);
      },
      (e) => {
        setBusyUpdate(null);
        showToast(`\u66F4\u65B0\u5931\u8D25\uFF1A${e instanceof Error ? e.message : String(e)}`, "error");
      }
    );
  };
  const updateAll = async () => {
    if (updates === null || updates.length === 0) return;
    setBusyUpdate("__all__");
    let okCount = 0;
    const failures = [];
    for (const u of updates) {
      try {
        await rpc("update", { name: u.name });
        okCount++;
      } catch (e) {
        failures.push(`${u.name}\uFF1A${e instanceof Error ? e.message : String(e)}`);
      }
    }
    setBusyUpdate(null);
    if (failures.length === 0) {
      showToast(`\u5DF2\u66F4\u65B0 ${okCount} \u4E2A\u63D2\u4EF6\uFF0C\u91CD\u542F dsh web \u540E\u751F\u6548`);
    } else {
      showToast(`\u66F4\u65B0\u5B8C\u6210\uFF1A\u6210\u529F ${okCount}\uFF0C\u5931\u8D25 ${failures.length}\uFF08${failures.join("\uFF1B")}\uFF09`, "error");
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
    tab("installed", "\u5DF2\u5B89\u88C5", installedCount),
    tab("market", "\u5E02\u573A", marketCount),
    tab("updates", "\u66F4\u65B0", updates?.length ?? 0)
  ] });
  const head = (showTitle) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "pc-head", children: [
    showTitle && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "pc-title", children: "\u63D2\u4EF6\u4E2D\u5FC3" }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "pc-sub", children: [
      "\u5DF2\u5B89\u88C5 ",
      installedCount,
      " \xB7 \u6709\u66F4\u65B0 ",
      updates?.length ?? 0,
      " \xB7 \u5931\u6548 ",
      failedCount
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "pc-spacer" }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { className: "pc-btn", onClick: refreshUpdates, children: "\u68C0\u67E5\u66F4\u65B0" }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", { className: "pc-btn primary", disabled: !updates?.length || busyUpdate !== null, onClick: () => {
      void updateAll();
    }, children: [
      "\u66F4\u65B0\u5168\u90E8\uFF08",
      updates?.length ?? 0,
      "\uFF09"
    ] })
  ] });
  const installedToolbar = view === "installed" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "pc-toolbar", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { className: "pc-search", value: search, onChange: (e) => {
      setSearch(e.target.value);
    }, placeholder: "\u641C\u7D22\u5DF2\u5B89\u88C5\u63D2\u4EF6" }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", { className: "pc-select", value: installedSource ?? "", onChange: (e) => {
      setInstalledSource(e.target.value === "" ? null : e.target.value);
    }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "", children: "\u5168\u90E8\u6765\u6E90" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "official", children: "\u5B98\u65B9" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "installed", children: "\u7528\u6237\u5B89\u88C5" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "local", children: "\u672C\u5730\u5F00\u53D1" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "builtin", children: "\u5185\u7F6E" })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { className: `pc-chip${installedCategory === null ? " active" : ""}`, onClick: () => {
      setInstalledCategory(null);
    }, children: "\u5168\u90E8" }),
    CATEGORIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { className: `pc-chip${installedCategory === c ? " active" : ""}`, onClick: () => {
      setInstalledCategory(c);
    }, children: c }, c))
  ] }) : null;
  const marketToolbar = view === "market" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "pc-toolbar", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { className: "pc-search", value: marketSearch, onChange: (e) => {
      setMarketSearch(e.target.value);
    }, placeholder: "\u641C\u7D22\u793E\u533A\u63D2\u4EF6" }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", { className: "pc-select", value: source, onChange: (e) => {
      setSource(e.target.value);
      setCategory(null);
    }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "awesome", children: "awesome-dsh-plugin" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "oh-my-dsh", children: "Oh-My-DSH" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "all", children: "\u5168\u90E8\u6E90" })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { className: `pc-chip${category === null ? " active" : ""}`, onClick: () => {
      setCategory(null);
    }, children: "\u5168\u90E8" }),
    CATEGORIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { className: `pc-chip${category === c ? " active" : ""}`, onClick: () => {
      setCategory(c);
    }, children: c }, c)),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "pc-spacer" }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", title: single ? "\u53CC\u5217\u7F51\u683C" : "\u5355\u5217\u5217\u8868", "aria-label": "\u5207\u6362\u5E03\u5C40", className: "pc-iconbtn", onClick: () => {
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
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", title: "\u63D2\u4EF6\u4E2D\u5FC3", "aria-label": "\u63D2\u4EF6\u4E2D\u5FC3", className: "pc-headerbtn", onClick: openOverlay, children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", strokeWidth: "1.5", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", { x: "2", y: "2", width: "5", height: "5", rx: "1" }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", { x: "9", y: "2", width: "5", height: "5", rx: "1" }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", { x: "2", y: "9", width: "5", height: "5", rx: "1" }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", { x: "9", y: "9", width: "5", height: "5", rx: "1" })
  ] }) });
}
function OverlayPanel() {
  const open = useOverlayOpen();
  if (!open) return null;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pc-overlay", role: "presentation", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "pc-panel", role: "dialog", "aria-modal": "true", "aria-label": "\u63D2\u4EF6\u4E2D\u5FC3", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "pc-panel-head", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "pc-title", children: "\u63D2\u4EF6\u4E2D\u5FC3" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "pc-spacer" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", className: "pc-close", onClick: closeOverlay, "aria-label": "\u5173\u95ED", children: "\u2715" })
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
  const open = useWhatsNewOpen();
  const [busy, setBusy] = (0, import_react.useState)(false);
  if (!open || whatsNewDigests.length === 0) return null;
  const updateNow = async () => {
    setBusy(true);
    let okCount = 0;
    const failures = [];
    for (const u of whatsNewDigests) {
      try {
        await rpc("update", { name: u.name });
        okCount++;
      } catch (e) {
        failures.push(`${u.name}\uFF1A${e instanceof Error ? e.message : String(e)}`);
      }
    }
    setBusy(false);
    if (failures.length === 0) {
      showToast(`\u5DF2\u66F4\u65B0 ${okCount} \u4E2A\u63D2\u4EF6\uFF0C\u91CD\u542F dsh web \u540E\u751F\u6548`);
      closeWhatsNew();
    } else {
      showToast(`\u66F4\u65B0\u5B8C\u6210\uFF1A\u6210\u529F ${okCount}\uFF0C\u5931\u8D25 ${failures.length}\uFF08${failures.join("\uFF1B")}\uFF09`, "error");
    }
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pc-overlay", role: "presentation", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "pc-panel", style: { width: "540px" }, role: "dialog", "aria-modal": "true", "aria-label": "\u63D2\u4EF6\u66F4\u65B0", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "pc-panel-head", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "pc-title", children: "\u63D2\u4EF6\u66F4\u65B0" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "pc-sub", style: { marginTop: 0 }, children: [
        whatsNewDigests.length,
        " \u4E2A\u63D2\u4EF6\u6709\u65B0\u7248\u672C"
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "pc-spacer" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", className: "pc-close", onClick: closeWhatsNew, "aria-label": "\u5173\u95ED", children: "\u2715" })
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
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { className: "pc-btn", onClick: closeWhatsNew, children: "\u7A0D\u540E" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { className: "pc-btn", onClick: closeWhatsNew, children: "\u5168\u90E8\u6807\u8BB0\u5DF2\u8BFB" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { className: "pc-btn primary", disabled: busy, onClick: () => {
          void updateNow();
        }, children: busy ? "\u66F4\u65B0\u4E2D\u2026" : "\u7ACB\u5373\u66F4\u65B0" })
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
  ctx.slots.inject("settings.section", () => ctx.slots.register({
    name: "settings.section",
    id: "plugin-center",
    order: 50,
    label: () => "\u63D2\u4EF6\u4E2D\u5FC3"
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

