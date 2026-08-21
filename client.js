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
.pc-dot.off { background: var(--dsw-alias-label-tertiary, rgba(0,0,0,.25)); }

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
.pc-toast { position: fixed; bottom: 32px; left: 50%; transform: translateX(-50%); padding: 10px 18px; border-radius: 10px; background: var(--dsw-alias-bg-layer-1); border: 1px solid var(--dsw-alias-border-l2); color: var(--dsw-alias-label-primary); font-size: 13px; box-shadow: 0 8px 32px rgba(0,0,0,.18); z-index: 1500; max-width: 80vw; }
.pc-toast.ok { border-color: var(--dsw-alias-state-success-primary); }
.pc-toast.error { border-color: var(--dsw-alias-state-error-primary); }
/* DSH 0.1.x \u8BBE\u7F6E\u5BFC\u822A\u65E0 icon \u5951\u7EA6\uFF08external section \u4E00\u5F8B\u9ED8\u8BA4\u9F7F\u8F6E\uFF09\u3002settings-nav-icon
   \u6807\u8BB0\u672C\u63D2\u4EF6\u884C\u540E\uFF1A\u9690\u85CF\u58F3\u6E32\u67D3\u7684\u9F7F\u8F6E SVG\uFF0C\u7528\u4E0E\u53F3\u4E0A\u89D2 HeaderButton \u76F8\u540C\u7684 2\xD72 \u7F51\u683C
   \u56FE\u6807\uFF08currentColor mask\uFF09\u66FF\u6362\uFF0C\u8DDF\u968F\u539F\u751F\u5BFC\u822A hover/active \u989C\u8272\u4E14\u4E0D\u6539\u53D8\u58F3\u7684
   16px \u56FE\u6807\u8282\u594F\u3002\u9009\u62E9\u5668\u517C\u5BB9\u56FE\u6807\u76F4\u63A5\u4E3A button \u9996\u5B50\u5143\u7D20\u4E0E\u5305\u4E00\u5C42 wrapper \u4E24\u79CD\u60C5\u51B5\u3002 */
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
var SETTINGS_NAV_MARKER = "data-dsh-plugin-center-settings-nav";
function registerSettingsNavIcon(label) {
  let disposed = false;
  const sync = () => {
    if (disposed) return;
    const currentLabel = label().trim();
    const buttons = document.querySelectorAll('[role="dialog"] nav button');
    for (const button of buttons) {
      const matches = currentLabel.length > 0 && button.textContent?.trim() === currentLabel;
      if (matches) button.setAttribute(SETTINGS_NAV_MARKER, "");
      else button.removeAttribute(SETTINGS_NAV_MARKER);
    }
  };
  sync();
  const observer = new MutationObserver(sync);
  observer.observe(document.body, { childList: true, subtree: true, characterData: true });
  return () => {
    disposed = true;
    observer.disconnect();
    document.querySelectorAll(`[${SETTINGS_NAV_MARKER}]`).forEach((element) => {
      element.removeAttribute(SETTINGS_NAV_MARKER);
    });
  };
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
function toggleOverlay() {
  overlayOpen ? closeOverlay() : openOverlay();
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
var countsState = { installed: 0, market: 0, dshMarket: 0, failed: 0 };
var countListeners = /* @__PURE__ */ new Set();
function setCounts(partial) {
  const next = { ...countsState, ...partial };
  if (next.installed === countsState.installed && next.market === countsState.market && next.dshMarket === countsState.dshMarket && next.failed === countsState.failed) return;
  countsState = next;
  countListeners.forEach((l) => l());
}
var updatingPlugins = /* @__PURE__ */ new Set();
var updatingListeners = /* @__PURE__ */ new Set();
function setUpdating(name, on) {
  if (on) updatingPlugins.add(name);
  else updatingPlugins.delete(name);
  updatingListeners.forEach((l) => l());
}
var installedListeners = /* @__PURE__ */ new Set();
function useInstalledVersion() {
  const [v, setV] = (0, import_react.useState)(0);
  (0, import_react.useEffect)(() => {
    const l = () => {
      setV((x) => x + 1);
    };
    installedListeners.add(l);
    return () => {
      installedListeners.delete(l);
    };
  }, []);
  return v;
}
function useUpdatingVersion() {
  const [v, setV] = (0, import_react.useState)(0);
  (0, import_react.useEffect)(() => {
    const l = () => {
      setV((x) => x + 1);
    };
    updatingListeners.add(l);
    return () => {
      updatingListeners.delete(l);
    };
  }, []);
  return v;
}
function useCounts() {
  const [v, setV] = (0, import_react.useState)(0);
  (0, import_react.useEffect)(() => {
    const l = () => {
      setV((x) => x + 1);
    };
    countListeners.add(l);
    return () => {
      countListeners.delete(l);
    };
  }, []);
  return countsState;
}
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
    allUpToDate: "\u6240\u6709\u63D2\u4EF6\u5747\u4E3A\u6700\u65B0",
    disable: "\u7981\u7528",
    enable: "\u542F\u7528",
    toggling: "\u5904\u7406\u4E2D\u2026",
    disabledOk: "\u5DF2\u7981\u7528 {n}\uFF0C\u91CD\u542F\u540E\u751F\u6548",
    enabledOk: "\u5DF2\u542F\u7528 {n}\uFF0C\u91CD\u542F\u540E\u751F\u6548",
    toggleFailed: "\u64CD\u4F5C\u5931\u8D25\uFF1A{e}",
    tabDiagnose: "\u8BCA\u65AD",
    diagExport: "\u5BFC\u51FA\u8BCA\u65AD\u65E5\u5FD7",
    diagCopied: "\u8BCA\u65AD\u5DF2\u590D\u5236\u5230\u526A\u8D34\u677F",
    diagTitle: "\u73AF\u5883\u4E0E\u63D2\u4EF6\u8BCA\u65AD",
    diagInstalled: "\u5DF2\u5B89\u88C5\u63D2\u4EF6\uFF08{n}\uFF09",
    diagDisabled: "\u7981\u7528\u72B6\u6001",
    diagPnpmLog: "pnpm \u65E5\u5FD7\uFF08\u5C3E\u90E8\uFF09",
    aiTitle: "AI \u63A8\u8350",
    aiPlaceholder: "\u63CF\u8FF0\u4F60\u7684\u9700\u6C42\uFF0C\u8BA9 AI \u63A8\u8350\u63D2\u4EF6\u2026\uFF08\u4F8B\u5982\uFF1A\u80FD\u9884\u89C8 Markdown \u7684\u63D2\u4EF6\uFF09",
    aiAsk: "\u63A8\u8350",
    aiAsking: "AI \u601D\u8003\u4E2D\u2026",
    aiFail: "AI \u63A8\u8350\u5931\u8D25\uFF1A{e}",
    scoreLabel: "\u8BC4\u5206",
    screenshot: "\u622A\u56FE",
    noScreenshot: "\u65E0\u622A\u56FE",
    screenshotFail: "\u622A\u56FE\u83B7\u53D6\u5931\u8D25",
    marketTooMany: "\u4EC5\u663E\u793A\u524D {n} \u4E2A\uFF08\u5171 {m}\uFF09\uFF0C\u641C\u7D22\u53EF\u7F29\u5C0F\u8303\u56F4"
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
    allUpToDate: "All plugins are up to date",
    disable: "Disable",
    enable: "Enable",
    toggling: "Working\u2026",
    disabledOk: "Disabled {n}; restart to take effect",
    enabledOk: "Enabled {n}; restart to take effect",
    toggleFailed: "Failed: {e}",
    tabDiagnose: "Diagnostics",
    diagExport: "Export diagnostics",
    diagCopied: "Diagnostics copied to clipboard",
    diagTitle: "Environment & plugin diagnostics",
    diagInstalled: "Installed plugins ({n})",
    diagDisabled: "Disabled state",
    diagPnpmLog: "pnpm log (tail)",
    aiTitle: "AI recommendation",
    aiPlaceholder: "Describe what you need \u2014 e.g. a Markdown preview plugin\u2026",
    aiAsk: "Recommend",
    aiAsking: "AI is thinking\u2026",
    aiFail: "AI recommendation failed: {e}",
    scoreLabel: "Score",
    screenshot: "Screenshot",
    noScreenshot: "No screenshot",
    screenshotFail: "Screenshot fetch failed",
    marketTooMany: "Showing first {n} of {m}; search to narrow down"
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
  return (0, import_react.useCallback)((key, vars) => fmt(STRINGS[id][key] ?? STRINGS.zh[key], vars), [id]);
}
function InstalledView({ search, category, source, onToggle, togglingId }) {
  const t = useT();
  const installedVersion = useInstalledVersion();
  const [items, setItems] = (0, import_react.useState)(installedCache);
  const [error, setError] = (0, import_react.useState)(null);
  (0, import_react.useEffect)(() => {
    let alive = true;
    if (installedCache !== null) {
      setItems(installedCache);
      return () => {
        alive = false;
      };
    }
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
  }, [installedVersion]);
  const handleToggleLocal = (p) => {
    setItems((prev) => prev === null ? prev : prev.map((item) => item.entryId === p.entryId ? { ...item, enabled: !item.enabled } : item));
    onToggle(p);
  };
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
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `pc-dot${p.fiberPhase === "failed" ? " failed" : ""}${!p.enabled ? " off" : ""}` })
    ] }),
    p.description !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pc-desc", children: p.description }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "pc-meta", children: [
      p.categories.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "pc-tag", children: c }, c)),
      p.compatRange !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "pc-tag", children: t("requiresDsh", { r: p.compatRange }) }),
      !p.enabled && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "pc-tag", children: t("disabledTag") }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "pc-spacer" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { className: "pc-btn", disabled: togglingId !== null, onClick: () => {
        handleToggleLocal(p);
      }, children: togglingId === p.name ? t("toggling") : p.enabled ? t("disable") : t("enable") })
    ] })
  ] }, p.entryId)) });
}
function MarketView({ category, single, source, search, onCount }) {
  const t = useT();
  const [items, setItems] = (0, import_react.useState)(marketCache[source]?.plugins ?? marketCache.all?.plugins ?? []);
  const [done, setDone] = (0, import_react.useState)(marketCache[source]?.done ?? marketCache.all?.done ?? false);
  const [error, setError] = (0, import_react.useState)(null);
  const [busy, setBusy] = (0, import_react.useState)(null);
  const [shotBusy, setShotBusy] = (0, import_react.useState)(null);
  const [shotUrl, setShotUrl] = (0, import_react.useState)(null);
  const [shotName, setShotName] = (0, import_react.useState)(null);
  const [shotZoom, setShotZoom] = (0, import_react.useState)(false);
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
      const fallback = marketCache.all;
      setItems(fallback?.plugins ?? []);
      setDone(fallback?.done ?? false);
      if (fallback !== void 0) onCount(fallback.plugins.length);
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
  const shown = filtered.slice(0, 200);
  const descOf = (m) => localeId === "en" ? m.description.en || m.description.zh : m.description.zh || m.description.en;
  const install = (m) => {
    setBusy(m.name);
    void rpc("install", { spec: m.spec }).then(
      (v) => {
        const durationMs = typeof v === "object" && v !== null ? v.durationMs : void 0;
        if (v !== true && durationMs === void 0) throw new Error(t("installNotApplied"));
        setBusy(null);
        pendingInstall.add(m.spec);
        for (const key of Object.keys(marketCache)) {
          const c = marketCache[key];
          if (c !== void 0) c.plugins = c.plugins.map((p) => p.name === m.name ? { ...p, installed: true } : p);
        }
        setItems((prev) => prev.map((p) => p.name === m.name ? { ...p, installed: true } : p));
        showToast(t("installQueued", { n: m.name }) + (durationMs !== void 0 ? `\uFF08${(durationMs / 1e3).toFixed(1)}s\uFF09` : ""), "ok", 5e3);
      },
      (e) => {
        setBusy(null);
        showToast(t("installFailed", { e: e instanceof Error ? e.message : String(e) }), "error", 15e3);
      }
    );
  };
  const showScreenshot = (m) => {
    if (shotBusy !== null) return;
    setShotBusy(m.name);
    void rpc("screenshot", { name: m.name }).then(
      (url) => {
        setShotBusy(null);
        if (typeof url !== "string" || url === "") {
          showToast(t("noScreenshot"), "error", 6e3);
          return;
        }
        setShotName(m.name);
        setShotUrl(url);
        setShotZoom(false);
      },
      () => {
        setShotBusy(null);
        showToast(t("screenshotFail"), "error", 6e3);
      }
    );
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
    filtered.length > 200 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "pc-sub", children: t("marketTooMany", { n: shown.length, m: filtered.length }) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `pc-grid ${single ? "single" : "double"}`, children: shown.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "pc-card", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "pc-row", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "pc-name", children: m.name }),
        m.score !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "pc-tag", title: `${m.score.total}${m.score.explanation !== "" ? `\uFF1A${m.score.explanation}` : ""}`, children: [
          t("scoreLabel"),
          " ",
          m.score.total
        ] }),
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
        m.categories.slice(0, 4).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "pc-tag", children: c }, c)),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "pc-spacer" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", className: "pc-iconbtn", title: t("screenshot"), "aria-label": t("screenshot"), disabled: shotBusy !== null, onClick: () => {
          showScreenshot(m);
        }, children: shotBusy === m.name ? "\u2026" : "\u{1F4F7}" }),
        m.installed || pendingInstall.has(m.spec) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "pc-tag", children: pendingInstall.has(m.spec) ? t("pendingRestart") : t("installedTag") }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { className: "pc-btn primary", disabled: busy !== null, onClick: () => {
          install(m);
        }, children: busy === m.name ? t("installing") : t("install") })
      ] })
    ] }, m.name)) }),
    !done && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "pc-sub", children: t("loadMore", { n: items.length }) }),
    shotUrl !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pc-overlay", role: "presentation", onClick: () => {
      setShotUrl(null);
      setShotName(null);
    }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "pc-panel", role: "dialog", "aria-modal": "true", onClick: (e) => {
      e.stopPropagation();
    }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "pc-panel-head", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "pc-title", children: shotName ?? "" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "pc-spacer" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", className: "pc-close", onClick: () => {
          setShotUrl(null);
          setShotName(null);
        }, "aria-label": t("close"), children: "\u2715" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pc-panel-body", style: { alignItems: "center", overflow: shotZoom ? "auto" : "hidden" }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        "img",
        {
          src: shotUrl,
          alt: shotName ?? "",
          onClick: () => {
            setShotZoom((v) => !v);
          },
          title: shotZoom ? "\u7F29\u5C0F" : "\u70B9\u51FB\u653E\u5927",
          style: shotZoom ? { maxWidth: "none", maxHeight: "none", width: "auto", borderRadius: 8 } : { maxWidth: "100%", maxHeight: "70vh", borderRadius: 8, objectFit: "contain" }
        }
      ) })
    ] }) })
  ] });
}
function UpdatesView({ updates, refresh, updateOne, busy }) {
  const t = useT();
  useUpdatingVersion();
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
        updateOne(u.name, u.toVersion);
      }, children: busy === u.name || busy === "__all__" || updatingPlugins.has(u.name) ? t("updating") : t("update") })
    ] }),
    u.changelog.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { className: "pc-wn-list", children: u.changelog.slice(0, 5).map((line, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: line }, i)) })
  ] }, u.name)) });
}
function DiagnoseView() {
  const t = useT();
  const [report, setReport] = (0, import_react.useState)(null);
  const [error, setError] = (0, import_react.useState)(null);
  (0, import_react.useEffect)(() => {
    let alive = true;
    void rpc("diagnostics").then(
      (v) => {
        if (alive) setReport(v);
      },
      (e) => {
        if (alive) setError(e instanceof Error ? e.message : String(e));
      }
    );
    return () => {
      alive = false;
    };
  }, []);
  const textOf = () => {
    if (report === null) return "no diagnostics";
    const lines = [
      "=== dsh-plugin-center diagnostics ===",
      `dsh: ${report.dshVersion}`,
      `node: ${report.node}`,
      `profile: ${report.baseUrl}`,
      `installed (${report.installed.length}):`,
      ...report.installed.map((p) => `  ${p.enabled ? "" : "[disabled] "}${p.name}@${p.version ?? "?"} (${p.source}, ${p.fiberPhase ?? "?"})`),
      "patch disabled:",
      ...Object.entries(report.disabled).map(([id, v]) => `  ${id}: ${v ? "disabled" : "force-enabled"}`),
      "pnpm log tail:",
      report.pnpmLogTail
    ];
    return lines.join("\n");
  };
  const exportLog = () => {
    const blob = new Blob([textOf()], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `plugin-center-diagnostics-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 19).replace(/[:T]/gu, "-")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };
  const copy = () => {
    void navigator.clipboard?.writeText(textOf()).then(() => {
      showToast(t("diagCopied"), "ok", 3e3);
    }).catch(() => {
    });
  };
  if (error !== null) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "pc-sub", children: t("loadFailed", { e: error }) });
  if (report === null) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "pc-sub", children: t("loading") });
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "pc-toolbar", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { className: "pc-btn", onClick: exportLog, children: t("diagExport") }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { className: "pc-btn", onClick: copy, children: t("diagCopied") })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "pc-sub", children: t("diagTitle") }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "pc-card", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "pc-row", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "pc-name", children: "dsh" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "pc-ver", children: report.dshVersion })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "pc-row", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "pc-name", children: "node" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "pc-ver", children: report.node })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "pc-row", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "pc-name", children: "profile" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "pc-ver", style: { wordBreak: "break-all" }, children: report.baseUrl })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "pc-sub", children: t("diagInstalled", { n: report.installed.length }) }),
    report.installed.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pc-card", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "pc-row", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "pc-name", children: p.name }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "pc-ver", children: [
        "v",
        p.version ?? "?"
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `pc-badge ${p.source}`, children: p.source }),
      !p.enabled && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "pc-tag", children: t("disabledTag") })
    ] }) }, p.name)),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "pc-sub", children: t("diagDisabled") }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pc-card", children: Object.keys(report.disabled).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "pc-ver", children: "\u2014" }) : Object.entries(report.disabled).map(([id, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "pc-row", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "pc-name", children: id }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "pc-ver", children: v ? "disabled" : "enabled" })
    ] }, id)) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "pc-sub", children: t("diagPnpmLog") }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", { className: "pc-desc", style: { whiteSpace: "pre-wrap", fontSize: 11 }, children: report.pnpmLogTail === "" ? "\u2014" : report.pnpmLogTail })
  ] });
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
  const counts = useCounts();
  const [updates, setUpdates] = (0, import_react.useState)(null);
  const [busyUpdate, setBusyUpdate] = (0, import_react.useState)(null);
  const [checking, setChecking] = (0, import_react.useState)(false);
  const [togglingId, setTogglingId] = (0, import_react.useState)(null);
  const [aiQuery, setAiQuery] = (0, import_react.useState)("");
  const [aiBusy, setAiBusy] = (0, import_react.useState)(false);
  const [aiResult, setAiResult] = (0, import_react.useState)(null);
  const [aiError, setAiError] = (0, import_react.useState)(null);
  const handleToggle = (p) => {
    if (togglingId !== null) return;
    const id = p.entryId;
    const nextEnabled = !p.enabled;
    console.log("[plugin-center] toggle", { id, fromEnabled: p.enabled, toEnabled: nextEnabled });
    setTogglingId(p.name);
    void rpc("toggle", { id, disabled: !nextEnabled }).then(
      (v) => {
        setTogglingId(null);
        const nowDisabled = typeof v === "object" && v !== null ? v.nowDisabled : null;
        console.log("[plugin-center] toggle result", { id, nowDisabled });
        showToast(nowDisabled === true ? t("disabledOk", { n: p.name }) : t("enabledOk", { n: p.name }), "ok", 5e3);
        if (installedCache !== null) {
          installedCache = installedCache.map((item) => item.entryId === id ? { ...item, enabled: nextEnabled } : item);
        }
      },
      (e) => {
        setTogglingId(null);
        console.log("[plugin-center] toggle failed", { id, error: e instanceof Error ? e.message : String(e) });
        showToast(t("toggleFailed", { e: e instanceof Error ? e.message : String(e) }), "error", 15e3);
      }
    );
  };
  const askAi = () => {
    const q = aiQuery.trim();
    if (q === "" || aiBusy) return;
    setAiBusy(true);
    setAiResult(null);
    setAiError(null);
    void rpc("suggest", { query: q }).then(
      (v) => {
        setAiBusy(false);
        setAiResult(v);
      },
      (e) => {
        setAiBusy(false);
        setAiError(e instanceof Error ? e.message : String(e));
      }
    );
  };
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
        installedCache = items;
        setCounts({ installed: items.length, failed: items.filter((p) => p.fiberPhase === "failed").length });
      },
      () => {
      }
    );
    refreshUpdates(true);
  }, [refreshUpdates]);
  (0, import_react.useEffect)(() => {
    let alive = true;
    const timers = [];
    const poll = async (src) => {
      if (!alive) return;
      try {
        const r = await rpc("listMarket", { source: src });
        if (!alive) return;
        marketCache[src] = { plugins: r.plugins, done: r.done };
        if (src === "all") setCounts({ market: r.plugins.length });
        if (src === "dsh-market") setCounts({ dshMarket: r.plugins.length });
        if (!r.done) timers.push(setTimeout(() => {
          void poll(src);
        }, 5e3));
      } catch {
        if (alive) timers.push(setTimeout(() => {
          void poll(src);
        }, 15e3));
      }
    };
    void poll("all");
    void poll("awesome");
    void poll("oh-my-dsh");
    return () => {
      alive = false;
      for (const timer of timers) clearTimeout(timer);
    };
  }, []);
  const handleMarketCount = (0, import_react.useCallback)((n) => {
    setCounts({ market: n });
  }, []);
  const updateOne = (name, version) => {
    setBusyUpdate(name);
    setUpdating(name, true);
    void rpc("update", { name, version }).then(
      (v) => {
        const durationMs = typeof v === "object" && v !== null ? v.durationMs : void 0;
        if (v !== true && durationMs === void 0) throw new Error(t("updateNotApplied"));
        setUpdating(name, false);
        setBusyUpdate(null);
        showToast(t("updatedOne", { n: name }) + (durationMs !== void 0 ? `\uFF08${(durationMs / 1e3).toFixed(1)}s\uFF09` : ""), "ok", 5e3);
        refreshUpdates(true);
      },
      (e) => {
        setUpdating(name, false);
        setBusyUpdate(null);
        showToast(t("updateFailed", { e: e instanceof Error ? e.message : String(e) }), "error", 15e3);
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
      setUpdating(u.name, true);
      try {
        const v = await rpc("update", { name: u.name, version: u.toVersion });
        const durationMs = typeof v === "object" && v !== null ? v.durationMs : void 0;
        if (v !== true && durationMs === void 0) throw new Error(t("updateNotApplied"));
        okCount++;
        okNames.push(durationMs !== void 0 ? `${u.name}\uFF08${(durationMs / 1e3).toFixed(1)}s\uFF09` : u.name);
      } catch (e) {
        failures.push(`${u.name}\uFF1A${e instanceof Error ? e.message : String(e)}`);
      } finally {
        setUpdating(u.name, false);
      }
    }
    setBusyUpdate(null);
    if (failures.length === 0) {
      showToast(t("updatedMany", { n: okCount }) + `\uFF08${okNames.join("\u3001")}\uFF09`, "ok", 6e3);
    } else {
      showToast(t("updateSummary", { a: okCount, b: failures.length, c: failures.join("\uFF1B") }), "error", 15e3);
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
    tab("installed", t("tabInstalled"), counts.installed),
    tab("market", t("tabMarket"), counts.market),
    tab("updates", t("tabUpdates"), updates?.length ?? 0),
    tab("diagnose", t("tabDiagnose"), null)
  ] });
  const head = (showTitle) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "pc-head", children: [
    showTitle && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "pc-title", children: t("title") }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "pc-sub", children: t("headSummary", { a: counts.installed, b: updates?.length ?? 0, c: counts.failed }) }),
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
  const aiBar = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", flexDirection: "column", gap: 8, flex: "none" }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "pc-ai-row", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        "input",
        {
          className: "pc-search",
          style: { flex: 1 },
          value: aiQuery,
          onChange: (e) => {
            setAiQuery(e.target.value);
          },
          onKeyDown: (e) => {
            if (e.key === "Enter") askAi();
          },
          placeholder: t("aiPlaceholder")
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { className: "pc-btn primary", disabled: aiBusy || aiQuery.trim() === "", onClick: askAi, children: aiBusy ? t("aiAsking") : t("aiAsk") })
    ] }),
    aiError !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "pc-sub", style: { color: "var(--dsw-alias-state-error-primary)" }, children: t("aiFail", { e: aiError }) }),
    aiResult !== null && aiResult.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pc-grid single", children: aiResult.map((item) => {
      const plugin = marketCache.all?.plugins.find((p) => p.spec === item.name || p.name === item.name);
      const installed = plugin?.installed === true || (installedCache ?? []).some((p) => p.name === item.name);
      return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "pc-card", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "pc-row", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "pc-name", children: item.name }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "pc-spacer" }),
          plugin !== void 0 && plugin.stars !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "pc-ver", children: [
            "\u2605 ",
            plugin.stars
          ] }),
          installed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "pc-tag", children: t("installedTag") }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            "button",
            {
              className: "pc-btn primary",
              onClick: () => {
                if (plugin === void 0) {
                  showToast(t("installFailed", { e: "\u672A\u5728\u5E02\u573A\u76EE\u5F55\u4E2D\u627E\u5230\u8BE5\u63D2\u4EF6\uFF0C\u8BF7\u624B\u52A8\u5B89\u88C5" }), "error", 8e3);
                  return;
                }
                void rpc("install", { spec: plugin.spec }).then(
                  () => {
                    pendingInstall.add(plugin.spec);
                    showToast(t("installQueued", { n: item.name }), "ok", 5e3);
                  },
                  (e) => showToast(t("installFailed", { e: e instanceof Error ? e.message : String(e) }), "error", 15e3)
                );
              },
              children: t("install")
            }
          )
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pc-desc", children: item.reason })
      ] }, item.name);
    }) })
  ] });
  const marketToolbar = view === "market" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", flexDirection: "column", gap: 8, flex: "none" }, children: [
    aiBar,
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "pc-toolbar", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { className: "pc-search", value: marketSearch, onChange: (e) => {
        setMarketSearch(e.target.value);
      }, placeholder: t("searchMarket") }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", { className: "pc-select", value: source, onChange: (e) => {
        setSource(e.target.value);
        setCategory(null);
      }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "awesome", children: "awesome-dsh-plugin" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "oh-my-dsh", children: "Oh-My-DSH" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", { value: "dsh-market", children: [
          "dsh-market\uFF08",
          counts.dshMarket,
          "\uFF09"
        ] }),
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
    ] })
  ] }) : null;
  const body = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    view === "installed" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InstalledView, { search, category: installedCategory, source: installedSource, onToggle: handleToggle, togglingId }),
    view === "market" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MarketView, { category, single, source, search: marketSearch, onCount: handleMarketCount }),
    view === "updates" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UpdatesView, { updates, refresh: refreshUpdates, updateOne, busy: busyUpdate }),
    view === "diagnose" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DiagnoseView, {})
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
  return (
    // 0.1.7：点遮罩关闭——overlay 背景点击即 closeOverlay；面板内点击
    // stopPropagation 不冒泡到遮罩（面板内部交互不受影响）。
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pc-overlay", role: "presentation", onClick: closeOverlay, children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "pc-panel", role: "dialog", "aria-modal": "true", "aria-label": t("title"), onClick: (e) => {
      e.stopPropagation();
    }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "pc-panel-head", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "pc-title", children: t("title") }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "pc-spacer" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", className: "pc-close", onClick: closeOverlay, "aria-label": t("close"), children: "\u2715" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pc-panel-body", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CenterPanel, { variant: "overlay" }) })
    ] }) })
  );
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
        const v = await rpc("update", { name: u.name, version: u.toVersion });
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
var GLOBAL_KEYS = ["__pluginCenterOpen", "__pluginCenterToggle", "__pluginCenterClose"];
function installGlobals() {
  const w = window;
  w.__pluginCenterOpen = openOverlay;
  w.__pluginCenterToggle = toggleOverlay;
  w.__pluginCenterClose = closeOverlay;
  w.__pluginCenterGlobalsInstalled = true;
}
function cleanupGlobals() {
  const w = window;
  for (const key of GLOBAL_KEYS) delete w[key];
  delete w.__pluginCenterGlobalsInstalled;
}
function apply(ctx) {
  injectCss();
  ctx.effect?.(() => registerSettingsNavIcon(() => STRINGS[localeId].title), "dsh-plugin-center: settings navigation icon");
  if (window.__pluginCenterGlobalsInstalled !== true) {
    installGlobals();
    window.addEventListener("unload", cleanupGlobals);
  }
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

