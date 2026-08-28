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
var import_react_dom = require("react-dom");
var import_react = require("react");
var import_jsx_runtime = require("react/jsx-runtime");
var CSS = `
.pc-title { font-size: 18px; font-weight: 600; line-height: 26px; color: var(--dsw-alias-label-primary); }
.pc-sub { font-size: 13px; line-height: 20px; margin-top: 4px; color: var(--dsw-alias-label-tertiary); }
.pc-head { display: flex; align-items: center; gap: 10px; }
.pc-head .pc-sub { margin-top: 0; }
.pc-head .pc-btn { flex: none; }
.pc-count { display: inline-block; min-width: 16px; padding: 0 5px; margin-left: 6px; border-radius: 999px; background: var(--dsw-alias-bg-module-platform); color: var(--dsw-alias-label-secondary); font-size: 11px; font-weight: 500; line-height: 17px; text-align: center; }
.pc-tab.active .pc-count { background: var(--dsw-alias-state-business-tertiary); color: var(--dsw-alias-state-business-primary); }
.pc-tabs { display: flex; gap: 22px; align-items: flex-end; margin: 16px 0 12px; border-bottom: 1px solid var(--dsw-alias-border-l2); }
.pc-tab { padding: 7px 1px 9px; font-size: 13px; line-height: 20px; cursor: pointer; background: none; border: none; font-family: inherit; color: var(--dsw-alias-label-tertiary); position: relative; }
.pc-tab:hover { color: var(--dsw-alias-label-primary); }
.pc-tab.active { color: var(--dsw-alias-label-primary); }
.pc-tab.active::after { content: ''; position: absolute; left: 0; right: 0; bottom: -1px; height: 2px; border-radius: 2px 2px 0 0; background: var(--dsw-alias-label-primary); }
.pc-tab:focus-visible { outline: 2px solid var(--dsw-alias-state-business-primary); outline-offset: 2px; border-radius: 2px; }

.pc-card { border: 1px solid var(--dsw-alias-border-l2); border-radius: 12px; padding: 14px 16px; margin-bottom: 10px; background: var(--dsw-alias-bg-layer-3); min-width: 0; transition: border-color .16s, background .16s; display: flex; flex-direction: column; }
.pc-card:hover { border-color: var(--dsw-alias-label-dimmed); }
.pc-name { font-size: 15px; font-weight: 600; line-height: 1.4; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--dsw-alias-label-primary); }
.pc-ver { color: var(--dsw-alias-label-caption); font-size: 12px; }
.pc-desc { color: var(--dsw-alias-label-tertiary); font-size: 13px; margin-top: 6px; word-break: break-word; overflow-wrap: break-word; }
.pc-row { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.pc-spacer { flex: 1; }
.pc-meta { display: flex; gap: 6px; flex-wrap: wrap; align-items: center; margin-top: auto; padding-top: 10px; }

.pc-badge { display: inline-flex; align-items: center; padding: 1px 8px; border-radius: 999px; font-size: 11px; font-weight: 500; line-height: 17px; white-space: nowrap; }
.pc-badge.official { background: var(--dsw-alias-state-business-tertiary); color: var(--dsw-alias-state-business-primary); }
.pc-badge.installed { background: var(--dsw-alias-state-warn-tertiary); color: var(--dsw-alias-state-warn-primary); }
.pc-badge.local, .pc-badge.builtin { background: var(--dsw-alias-bg-module-platform); color: var(--dsw-alias-label-tertiary); }
.pc-tag { display: inline-flex; align-items: center; padding: 1px 8px; border-radius: 999px; font-size: 11px; font-weight: 500; line-height: 17px; white-space: nowrap; background: var(--dsw-alias-bg-module-platform); color: var(--dsw-alias-label-secondary); }
.pc-tag.danger { background: var(--dsw-alias-interactive-bg-hover-danger); color: var(--dsw-alias-state-error-primary); }
.pc-tag.warn { background: var(--dsw-alias-bg-module-warning); color: var(--dsw-alias-state-warning-primary); }
.pc-switch { position: relative; flex: none; width: 40px; height: 22px; border-radius: 11px; border: none; background: var(--dsw-alias-border-l4, rgba(0,0,0,.16)); cursor: pointer; transition: background .15s ease; padding: 0; }
.pc-switch::after { content: ''; position: absolute; top: 3px; left: 3px; width: 16px; height: 16px; border-radius: 50%; background: #fff; transition: left .15s ease; }
.pc-switch.on { background: var(--dsw-alias-state-business-primary, #4FC3F7); }
.pc-switch.on::after { left: 21px; }
.pc-switch:disabled { opacity: .6; cursor: default; }

.pc-toolbar { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; padding: 4px 0; }
/* \u7B5B\u9009\u533A\u7EB5\u5411\u5BB9\u5668\uFF1AAI \u63A8\u8350\u884C / \u4E3B\u7B5B\u9009\u884C / \u5206\u7C7B\u884C\u4E09\u6BB5\uFF0C\u95F4\u8DDD\u7EDF\u4E00\u3002 */
.pc-filter { display: flex; flex-direction: column; gap: 6px; flex: none; margin-top: 2px; }
/* \u4E3B\u7B5B\u9009\u884C\uFF1A\u4E00\u884C\u653E\u641C\u7D22 + \u6765\u6E90 + \u5DE5\u4F5C\u533A\u6309\u94AE\uFF0C\u4E0D\u6362\u884C\u3002 */
.pc-toolbar-main { flex-wrap: nowrap; }
/* \u5206\u7C7B\u884C\uFF1A\u72EC\u7ACB\u4E00\u884C\u3001\u6A2A\u5411\u6EDA\u52A8\uFF08\u4E0D wrap \u6210\u6298\u884C\u4E71\u6392\uFF09\uFF0Cchip \u4E0D\u538B\u7F29\u3002 */
.pc-catbar { display: flex; align-items: center; gap: 6px; overflow-x: auto; padding: 2px 0 4px; scrollbar-width: thin; scrollbar-color: var(--dsw-alias-border-l3, rgba(0,0,0,.2)) transparent; }
.pc-catbar .pc-chip { flex: none; white-space: nowrap; }
/* \u5E02\u573A\u8D85\u91CF\u63D0\u793A\uFF1A\u5C0F\u53F7\u5F31\u5316\u6587\u5B57\uFF0C\u4E0E\u7B5B\u9009\u533A\u89C6\u89C9\u5206\u79BB\u3002 */
.pc-limit { margin: 2px 0 8px; font-size: 12px; line-height: 16px; color: var(--dsw-alias-label-caption); }
.pc-ai-row { display: flex; gap: 8px; align-items: center; }
.pc-ai-row .pc-btn { height: 28px; }
.pc-chip { height: 28px; padding: 0 12px; border-radius: 14px; border: 1px solid var(--dsw-alias-border-l2); background: transparent; color: var(--dsw-alias-label-secondary); font-size: 12px; line-height: 18px; cursor: pointer; font-family: inherit; transition: background .15s ease, color .15s ease, border-color .15s ease; }
.pc-chip:hover { background: var(--dsw-alias-interactive-bg-hover); }
.pc-chip.active { background: var(--dsw-alias-label-primary); border-color: var(--dsw-alias-label-primary); color: var(--dsw-alias-bg-layer-3); }

.pc-btn { padding: 5px 14px; border-radius: 8px; border: 1px solid var(--dsw-alias-border-l2); background: transparent; color: var(--dsw-alias-label-primary); font-size: 13px; line-height: 1.5; cursor: pointer; font-family: inherit; }
.pc-btn:hover { background: var(--dsw-alias-interactive-bg-hover); }
.pc-btn.primary { border: none; background: var(--dsw-alias-button-primary-fill); color: var(--dsw-alias-label-primary-foreground); }
.pc-btn.primary:hover { background: var(--dsw-alias-button-primary-hover); }
.pc-btn:disabled { opacity: 0.5; cursor: default; }

.pc-search { height: 34px; padding: 0 12px; border-radius: 8px; border: 1px solid var(--dsw-alias-border-l2); background: var(--dsw-alias-bg-layer-3); color: var(--dsw-alias-label-primary); font-size: 13px; line-height: 1.5; outline: none; width: 200px; font-family: inherit; }
.pc-search:focus { border-color: var(--dsw-alias-brand-primary); }
.pc-search::placeholder { color: var(--dsw-alias-label-dimmed); }
/* \u5B9A\u5236 select\uFF1A\u5265\u79BB\u6D4F\u89C8\u5668\u539F\u751F\u5916\u89C2\uFF08\u9AD8\u5EA6/\u5185\u8FB9\u8DDD/padding \u5DEE\u5F02\u662F\u8DE8\u63A7\u4EF6\u4E0D\u9F50\u7684
   \u4E3B\u56E0\uFF09\uFF0C\u7528\u80CC\u666F chevron \u66FF\u4EE3\u7CFB\u7EDF\u7BAD\u5934\uFF0C\u4E0E\u8F93\u5165\u6846\u540C\u9AD8\u540C\u5706\u89D2\u3002 */
.pc-select { height: 34px; padding: 0 26px 0 12px; border-radius: 8px; border: 1px solid var(--dsw-alias-border-l2); background-color: var(--dsw-alias-bg-layer-3); color: var(--dsw-alias-label-secondary); font-size: 13px; line-height: 1.5; cursor: pointer; font-family: inherit; appearance: none; -webkit-appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 10 10' fill='none' stroke='%23777777' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M2 3.5l3 3 3-3'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 10px center; background-size: 10px 10px; }
.pc-select:hover { background-color: var(--dsw-alias-interactive-bg-hover); }
.pc-select:focus-visible { outline: none; border-color: var(--dsw-alias-brand-primary); }
body[data-ds-dark-theme] .pc-select { background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 10 10' fill='none' stroke='%23b0b0b0' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M2 3.5l3 3 3-3'/%3E%3C/svg%3E"); }
.pc-iconbtn { width: 28px; height: 28px; padding: 6px; border-radius: 7px; border: none; background: transparent; color: var(--dsw-alias-label-tertiary); cursor: pointer; display: inline-flex; align-items: center; justify-content: center; }
.pc-iconbtn:hover { background: var(--dsw-alias-bg-layer-1); color: var(--dsw-alias-label-primary); }

.pc-grid { display: grid; gap: 12px; }
.pc-grid.double { grid-template-columns: 1fr 1fr; }
.pc-grid.single { grid-template-columns: 1fr; }

.pc-overlay { position: fixed; inset: 0; background: var(--dsw-alias-bg-mask-1); display: flex; align-items: center; justify-content: center; z-index: 100; }
.pc-panel { width: 760px; max-width: 94vw; max-height: 86vh; background: var(--dsw-alias-bg-base); border-radius: 12px; box-shadow: 0 24px 64px rgba(0,0,0,.24); display: flex; flex-direction: column; overflow: hidden; }
.pc-panel-head { flex: none; display: flex; align-items: center; padding: 20px 28px 0; }
.pc-panel-body { flex: 1; min-height: 0; display: flex; flex-direction: column; padding: 8px 28px 20px; }
.pc-panel-footer { flex: none; display: flex; justify-content: flex-end; align-items: center; gap: 8px; padding: 14px 28px; border-top: 1px solid var(--dsw-alias-border-l2); }
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
var llmUpdating = /* @__PURE__ */ new Set();
var llmUpdatingListeners = /* @__PURE__ */ new Set();
function setLlmUpdating(name, on) {
  if (on) llmUpdating.add(name);
  else llmUpdating.delete(name);
  llmUpdatingListeners.forEach((l) => l());
}
function useLlmUpdatingVersion() {
  const [v, setV] = (0, import_react.useState)(0);
  (0, import_react.useEffect)(() => {
    const l = () => {
      setV((x) => x + 1);
    };
    llmUpdatingListeners.add(l);
    return () => {
      llmUpdatingListeners.delete(l);
    };
  }, []);
  return v;
}
var llmConfirm = null;
var llmConfirmListeners = /* @__PURE__ */ new Set();
function setLlmConfirm(state) {
  llmConfirm = state;
  llmConfirmListeners.forEach((l) => l());
}
function useLlmConfirm() {
  const [state, setState] = (0, import_react.useState)(llmConfirm);
  (0, import_react.useEffect)(() => {
    const l = () => {
      setState(llmConfirm);
    };
    llmConfirmListeners.add(l);
    return () => {
      llmConfirmListeners.delete(l);
    };
  }, []);
  return state;
}
var llmSessionId = null;
function setLlmSessionId(id) {
  llmSessionId = id;
}
var llmFallbackPrompt = null;
var llmFallbackListeners = /* @__PURE__ */ new Set();
function setLlmFallback(prompt) {
  llmFallbackPrompt = prompt;
  llmFallbackListeners.forEach((l) => l());
}
function useLlmFallback() {
  const [p, setP] = (0, import_react.useState)(llmFallbackPrompt);
  (0, import_react.useEffect)(() => {
    const l = () => {
      setP(llmFallbackPrompt);
    };
    llmFallbackListeners.add(l);
    return () => {
      llmFallbackListeners.delete(l);
    };
  }, []);
  return p;
}
var sessionsSvc = null;
var workspacesSvc = null;
var llmResults = /* @__PURE__ */ new Map();
var llmResultListeners = /* @__PURE__ */ new Set();
function setLlmResult(name, rec) {
  if (rec === null) llmResults.delete(name);
  else llmResults.set(name, rec);
  llmResultListeners.forEach((l) => l());
}
function useLlmResultVersion() {
  const [v, setV] = (0, import_react.useState)(0);
  (0, import_react.useEffect)(() => {
    const l = () => {
      setV((x) => x + 1);
    };
    llmResultListeners.add(l);
    return () => {
      llmResultListeners.delete(l);
    };
  }, []);
  return v;
}
var llmPollTimers = /* @__PURE__ */ new Map();
var LLM_POLL_MS = 5e3;
var LLM_POLL_MAX = 240;
function stopLlmPolling(name) {
  const t = llmPollTimers.get(name);
  if (t !== void 0) {
    window.clearInterval(t);
    llmPollTimers.delete(name);
  }
}
async function convergeLlmState(name) {
  const rec = await rpc("llm-update.result", { name }).catch(() => null);
  if (rec !== null && rec.status !== "running" && rec.status !== "pending") {
    stopLlmPolling(name);
    setLlmUpdating(name, false);
    setLlmResult(name, rec);
    const S = STRINGS[localeId];
    const brief = rec.detail.length > 120 ? `${rec.detail.slice(0, 120)}\u2026` : rec.detail;
    showToast(
      rec.status === "success" ? S.llmDone.replace("{name}", name).replace("{d}", brief) : rec.status === "failed" ? S.llmFailed.replace("{name}", name).replace("{d}", brief) : S.llmEnded.replace("{name}", name),
      rec.status === "success" ? "ok" : "error",
      12e3
    );
    return true;
  }
  const sid = llmSessionByPlugin.get(name);
  if (sid !== void 0) {
    const row = sessionsSvc?.list?.getSnapshot?.()?.byId?.[sid];
    if (row !== void 0 && row.running === false) {
      stopLlmPolling(name);
      setLlmUpdating(name, false);
      setLlmResult(name, { at: Date.now(), action: "ended", detail: "", status: "ended" });
      showToast(STRINGS[localeId].llmEnded.replace("{name}", name), "error", 1e4);
      return true;
    }
  }
  return false;
}
function startLlmPolling(name) {
  if (llmPollTimers.has(name)) return;
  let count = 0;
  const timer = window.setInterval(() => {
    count++;
    void convergeLlmState(name).then((done) => {
      if (!done && count >= LLM_POLL_MAX) stopLlmPolling(name);
    });
  }, LLM_POLL_MS);
  llmPollTimers.set(name, timer);
}
async function restoreLlmStates(names) {
  const list = sessionsSvc?.list?.getSnapshot?.();
  const rows = list?.byId === void 0 ? [] : Object.values(list.byId);
  const updateSession = rows.find((r) => (r.displayTitle ?? "").includes("\u63D2\u4EF6\u66F4\u65B0") || (r.title ?? "").includes("\u63D2\u4EF6\u66F4\u65B0"));
  for (const name of names) {
    if (llmUpdating.has(name) || llmResults.has(name)) continue;
    try {
      const rec = await rpc("llm-update.result", { name });
      if (rec === null) continue;
      if (rec.status === "running" || rec.status === "pending") {
        if (updateSession !== void 0 && updateSession.running !== false && updateSession.id !== void 0) {
          setLlmUpdating(name, true);
          llmSessionByPlugin.set(name, updateSession.id);
          startLlmPolling(name);
        } else {
          setLlmUpdating(name, false);
          setLlmResult(name, { at: rec.at, action: "ended", detail: "", status: "ended" });
        }
      } else {
        setLlmResult(name, rec);
      }
    } catch {
    }
  }
}
var llmSessionByPlugin = /* @__PURE__ */ new Map();
var pendingToggles = /* @__PURE__ */ new Map();
var pendingListeners = /* @__PURE__ */ new Set();
function setPendingToggle(id, action) {
  if (action === "disable") pendingToggles.set(id, true);
  else if (action === "enable") pendingToggles.set(id, false);
  else pendingToggles.delete(id);
  pendingListeners.forEach((l) => l());
}
function usePendingVersion() {
  const [v, setV] = (0, import_react.useState)(0);
  (0, import_react.useEffect)(() => {
    const l = () => {
      setV((x) => x + 1);
    };
    pendingListeners.add(l);
    return () => {
      pendingListeners.delete(l);
    };
  }, []);
  return v;
}
var doneUpdatesStore = [];
var doneUpdatesVersion = 0;
var doneUpdatesListeners = /* @__PURE__ */ new Set();
function markDoneUpdate(entry) {
  if (doneUpdatesStore.some((d) => d.name === entry.name)) return;
  doneUpdatesStore.push(entry);
  doneUpdatesVersion++;
  doneUpdatesListeners.forEach((l) => l());
}
function useDoneUpdatesVersion() {
  const [v, setV] = (0, import_react.useState)(0);
  (0, import_react.useEffect)(() => {
    const l = () => {
      setV((x) => x + 1);
    };
    doneUpdatesListeners.add(l);
    return () => {
      doneUpdatesListeners.delete(l);
    };
  }, []);
  return v;
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
var wnToday = () => (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
var wnShownTodayCache = null;
function wnShownToday() {
  if (wnShownTodayCache === null) {
    wnShownTodayCache = rpc("whatsNewDaily").then((v) => String(v?.day ?? "") === wnToday()).catch(() => false);
  }
  return wnShownTodayCache;
}
async function checkWhatNew() {
  try {
    const since = new Date(Date.now() - 30 * 864e5).toISOString();
    const digests = await rpc("checkUpdates", { since });
    readCache = await rpc("readVersions");
    const fresh = digests.filter((d) => readCache[d.name] !== d.toVersion);
    if (fresh.length > 0 && !await wnShownToday()) {
      whatsNewDigests = fresh;
      whatsNewOpen = true;
      void rpc("markWhatsNewDaily", { day: wnToday() });
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
    llmUpdate: "LLM \u66F4\u65B0",
    llmUpdating: "LLM \u51B3\u7B56\u4E2D\u2026",
    llmConfirmTitle: "\u786E\u8BA4 LLM \u66F4\u65B0",
    llmSourceBadge: "\u6765\u6E90\uFF1A{s}",
    llmVendorWarn: "\u672C\u5730\u5B9A\u5236!\u673A\u68B0\u66F4\u65B0\u4F1A\u8986\u76D6,\u5148\u6838\u5BF9\u4F5C\u8005\u662F\u5426\u5DF2\u91C7\u7EB3",
    llmScopeSsid: "\u66F4\u65B0\u8303\u56F4\uFF1A\u4EC5\u601D\u7075\u5E94\u7528\u5185\u7684\u63D2\u4EF6\uFF08AI \u52A9\u624B\u53EA\u52A8\u8FD9\u4E00\u5904\uFF0C\u4E0D\u4F1A\u5F71\u54CD\u4F60\u5176\u4ED6\u5730\u65B9\u7684\u5B89\u88C5\uFF09",
    llmScopeWeb: "\u66F4\u65B0\u8303\u56F4\uFF1A\u4EC5\u5F53\u524D DSH Web \u5E94\u7528\u5185\u7684\u63D2\u4EF6\uFF08AI \u52A9\u624B\u53EA\u52A8\u8FD9\u4E00\u5904\uFF0C\u4E0D\u4F1A\u5F71\u54CD\u4F60\u5176\u4ED6\u5730\u65B9\u7684\u5B89\u88C5\uFF09",
    llmConfirm: "\u786E\u8BA4\u5E76\u6267\u884C",
    llmCancel: "\u53D6\u6D88",
    llmPromptReady: "LLM \u66F4\u65B0\u5DF2\u53D1\u8D77\uFF1A{name}\u3002\u8BF7\u5728\u4F1A\u8BDD\u4E2D\u6309 dsh-plugin-upgrade skill \u51B3\u7B56\u6267\u884C\u3002",
    llmPreparing: "\u91C7\u96C6\u63D2\u4EF6\u4FE1\u606F\u4E2D\u2026",
    llmPreparedError: "\u4FE1\u606F\u5305\u91C7\u96C6\u5931\u8D25\uFF1A{e}",
    llmSessionLink: "\u67E5\u770B\u4F1A\u8BDD",
    llmBusy: "LLM \u6267\u884C\u4E2D\u2026",
    llmDone: "LLM \u66F4\u65B0\u5B8C\u6210\uFF1A{name} \u2014 {d}",
    llmFailed: "LLM \u66F4\u65B0\u5931\u8D25\uFF1A{name} \u2014 {d}",
    llmRes_success: "LLM \u5DF2\u66F4\u65B0",
    llmRes_keep: "LLM \u4FDD\u6301\u4E0D\u52A8",
    llmRes_failed: "LLM \u5931\u8D25",
    llmRes_running: "LLM \u6267\u884C\u4E2D",
    llmRes_ended: "LLM \u5DF2\u7ED3\u675F",
    llmEnded: "LLM \u66F4\u65B0\u5DF2\u7ED3\u675F\uFF1A{name}(\u672A\u56DE\u4F20\u51B3\u7B56,\u53EF\u67E5\u770B\u4F1A\u8BDD)",
    llmUpdateAll: "LLM \u66F4\u65B0\u5168\u90E8\uFF08{n}\uFF09",
    llmConfirmBody: "\u4EE5\u4E0B {n} \u4E2A\u63D2\u4EF6\u5C06\u7531 LLM Agent \u6309 dsh-plugin-upgrade skill \u51B3\u7B56\u5E76\u6267\u884C\u66F4\u65B0\u3002",
    llmConfirmSkipped: "\u91C7\u96C6\u5931\u8D25\u5C06\u8DF3\u8FC7\uFF1A{s}",
    llmFallbackTitle: "\u5C06\u63D0\u793A\u8BCD\u7C98\u8D34\u5230\u4F1A\u8BDD\u6267\u884C",
    llmFallbackHint: "\u65E0\u6CD5\u81EA\u52A8\u53D1\u8D77\u300C\u63D2\u4EF6\u66F4\u65B0\u300D\u4F1A\u8BDD\uFF08\u4F1A\u8BDD/\u5DE5\u4F5C\u533A\u670D\u52A1\u4E0D\u53EF\u7528\u6216\u6CA1\u6709\u53EF\u7528\u5DE5\u4F5C\u533A\uFF09\u3002\u8BF7\u590D\u5236\u4EE5\u4E0B\u63D0\u793A\u8BCD\uFF0C\u5728\u4EFB\u610F\u4F1A\u8BDD\u4E2D\u7C98\u8D34\u5E76\u53D1\u9001\uFF0CAgent \u5C06\u6309 dsh-plugin-upgrade skill \u51B3\u7B56\u6267\u884C\u3002",
    install: "\u5B89\u88C5",
    installing: "\u5B89\u88C5\u4E2D\u2026",
    pendingRestart: "\u5F85\u91CD\u542F\u751F\u6548",
    installedTag: "\u5DF2\u5B89\u88C5",
    disabledTag: "\u5DF2\u7981\u7528",
    requiresDsh: "\u8981\u6C42 DSH {r}",
    installQueued: "\u5DF2\u53D1\u8D77\u5B89\u88C5 {n}\uFF0C\u91CD\u542F dsh web \u540E\u751F\u6548",
    installFailed: "\u5B89\u88C5\u5931\u8D25\uFF1A{e}",
    installNotApplied: "\u5B89\u88C5\u672A\u751F\u6548",
    updatedOne: "\u5DF2\u66F4\u65B0 {n}\uFF0C\u91CD\u542F\u540E\u751F\u6548",
    updatedHot: "\u5DF2\u66F4\u65B0 {n}\uFF0C\u524D\u7AEF\u5DF2\u70ED\u751F\u6548\uFF0C\u65E0\u9700\u91CD\u542F",
    updateFailed: "\u66F4\u65B0\u5931\u8D25\uFF1A{e}",
    updateNotApplied: "\u66F4\u65B0\u672A\u751F\u6548",
    updatedMany: "\u5DF2\u66F4\u65B0 {n} \u4E2A\u63D2\u4EF6\uFF0C\u91CD\u542F\u540E\u751F\u6548",
    updatedManyHot: "\u5DF2\u66F4\u65B0 {n} \u4E2A\u63D2\u4EF6\uFF0C\u524D\u7AEF\u5DF2\u70ED\u751F\u6548",
    commandTitle: "\u5728\u7EC8\u7AEF\u6267\u884C\u4EE5\u4E0B\u547D\u4EE4",
    commandHint: "\u5F53\u524D\u5E94\u7528\u6B63\u5728\u8FD0\u884C\uFF0C\u88AB\u9501\u5B9A\u7684\u6587\u4EF6\u65E0\u6CD5\u5728\u5E94\u7528\u5185\u66FF\u6362\u3002\u8BF7\u5148\u5173\u95ED\u5E94\u7528\uFF0C\u518D\u5728\u7EC8\u7AEF\u6267\u884C\uFF1A",
    commandCopy: "\u590D\u5236\u547D\u4EE4",
    commandCopied: "\u5DF2\u590D\u5236",
    updateRestartNow: "\u5DF2\u4E0B\u8F7D {n} \u4E2A\u66F4\u65B0\uFF0C\u91CD\u542F\u601D\u7075\u540E\u81EA\u52A8\u5B89\u88C5\u3002\u7ACB\u5373\u91CD\u542F\uFF1F",
    updateRestartBusy: "\u6709 {n} \u4E2A\u4F1A\u8BDD\u6B63\u5728\u8FDB\u884C\u4E2D\uFF0C\u672A\u6267\u884C\u91CD\u542F\uFF1B\u66F4\u65B0\u5DF2\u51C6\u5907\u597D\uFF0C\u7A0D\u540E\u624B\u52A8\u91CD\u542F\u5373\u53EF",
    updatedPendingTag: "\u5DF2\u66F4\u65B0\u5F85\u91CD\u542F",
    restartUnavailable: "\u5F53\u524D\u73AF\u5883\u4E0D\u652F\u6301\u81EA\u52A8\u91CD\u542F\uFF0C\u8BF7\u624B\u52A8\u91CD\u542F\u5E94\u7528",
    restartAskTitle: "\u9700\u8981\u91CD\u542F\u751F\u6548",
    restartAskBody: "\u5DF2\u66F4\u65B0 {n} \u4E2A\u63D2\u4EF6\uFF0C\u91CD\u542F\u601D\u7075\u540E\u751F\u6548\uFF08\u6709\u8FDB\u884C\u4E2D\u7684\u4F1A\u8BDD\u65F6\u4F1A\u5148\u68C0\u67E5\uFF09",
    restartNowBtn: "\u7ACB\u5373\u91CD\u542F",
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
    revertedDisable: "\u5DF2\u64A4\u9500\u7981\u7528 {n}",
    revertedEnable: "\u5DF2\u64A4\u9500\u542F\u7528 {n}",
    tabDiagnose: "\u8BCA\u65AD",
    diagExport: "\u5BFC\u51FA\u8BCA\u65AD\u65E5\u5FD7",
    diagCopied: "\u8BCA\u65AD\u5DF2\u590D\u5236\u5230\u526A\u8D34\u677F",
    diagTitle: "\u73AF\u5883\u4E0E\u63D2\u4EF6\u8BCA\u65AD",
    diagInstalled: "\u5DF2\u5B89\u88C5\u63D2\u4EF6\uFF08{n}\uFF09",
    diagDisabled: "\u7981\u7528\u72B6\u6001",
    diagPnpmLog: "pnpm \u65E5\u5FD7\uFF08\u5C3E\u90E8\uFF09",
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
    llmUpdate: "LLM update",
    llmUpdating: "LLM deciding\u2026",
    llmConfirmTitle: "Confirm LLM update",
    llmSourceBadge: "Source: {s}",
    llmVendorWarn: "Local custom build! Mechanical update would overwrite \u2014 verify upstream adoption first",
    llmScopeSsid: "Scope: plugins inside SSiD only (AI touches just this place, nothing elsewhere)",
    llmScopeWeb: "Scope: plugins inside this DSH Web app only (AI touches just this place, nothing elsewhere)",
    llmConfirm: "Confirm & run",
    llmCancel: "Cancel",
    llmPromptReady: "LLM update launched: {name}. Decide & execute in session per dsh-plugin-upgrade skill.",
    llmPreparing: "Preparing plugin info\u2026",
    llmPreparedError: "Prepare failed: {e}",
    llmSessionLink: "View session",
    llmBusy: "LLM running\u2026",
    llmDone: "LLM update done: {name} \u2014 {d}",
    llmFailed: "LLM update failed: {name} \u2014 {d}",
    llmRes_success: "LLM updated",
    llmRes_keep: "LLM kept",
    llmRes_failed: "LLM failed",
    llmRes_running: "LLM running",
    llmRes_ended: "LLM ended",
    llmEnded: "LLM update ended: {name} (no decision returned; view session)",
    llmUpdateAll: "LLM update all\uFF08{n}\uFF09",
    llmConfirmBody: "LLM Agent will decide & run the update for these {n} plugin(s) per the dsh-plugin-upgrade skill.",
    llmConfirmSkipped: "Skipped (prepare failed): {s}",
    llmFallbackTitle: "Paste the prompt into a session",
    llmFallbackHint: 'Could not auto-launch a "plugin update" session (sessions/workspaces unavailable or no workspace). Copy the prompt below and paste it into any session; the agent will decide per the dsh-plugin-upgrade skill.',
    install: "Install",
    installing: "Installing\u2026",
    pendingRestart: "Restart pending",
    installedTag: "Installed",
    disabledTag: "Disabled",
    requiresDsh: "Requires DSH {r}",
    installQueued: "Install of {n} started; restart dsh web to take effect",
    installFailed: "Install failed: {e}",
    installNotApplied: "Install did not take effect",
    updatedOne: "Updated {n}; restart to take effect",
    updatedHot: "Updated {n}; hot-applied in the browser, no restart needed",
    updateFailed: "Update failed: {e}",
    updateNotApplied: "Update did not take effect",
    updatedMany: "Updated {n} plugin(s); restart to take effect",
    updatedManyHot: "Updated {n} plugin(s); hot-applied, no restart needed",
    commandTitle: "Run this command in a terminal",
    commandHint: "The app is running and locked files cannot be replaced in-place. Close the app first, then run:",
    commandCopy: "Copy command",
    commandCopied: "Copied",
    updateRestartNow: "{n} update(s) downloaded; auto-installs after restarting SSiD. Restart now?",
    updateRestartBusy: "{n} session(s) still in progress \u2014 no restart; updates ready, restart manually later",
    updatedPendingTag: "Updated \u2014 restart pending",
    restartUnavailable: "Auto-restart unavailable here; please restart manually",
    restartAskTitle: "Restart required",
    restartAskBody: "{n} plugin(s) updated; takes effect after restarting SSiD (active sessions are checked first)",
    restartNowBtn: "Restart now",
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
    revertedDisable: "Disable of {n} reverted",
    revertedEnable: "Enable of {n} reverted",
    tabDiagnose: "Diagnostics",
    diagExport: "Export diagnostics",
    diagCopied: "Diagnostics copied to clipboard",
    diagTitle: "Environment & plugin diagnostics",
    diagInstalled: "Installed plugins ({n})",
    diagDisabled: "Disabled state",
    diagPnpmLog: "pnpm log (tail)",
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
  usePendingVersion();
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
      p.fiberPhase === "failed" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "pc-dot failed", title: "failed" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        "button",
        {
          type: "button",
          role: "switch",
          "aria-checked": p.enabled,
          "aria-label": p.enabled ? t("disable") : t("enable"),
          title: p.enabled ? t("disable") : t("enable"),
          className: `pc-switch${p.enabled ? " on" : ""}`,
          disabled: togglingId !== null,
          onClick: () => {
            handleToggleLocal(p);
          }
        }
      )
    ] }),
    p.description !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pc-desc", children: p.description }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "pc-meta", children: [
      p.categories.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "pc-tag", children: c }, c)),
      p.compatRange !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "pc-tag", children: t("requiresDsh", { r: p.compatRange }) }),
      !p.enabled && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "pc-tag", children: t("disabledTag") }),
      pendingToggles.has(p.entryId) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "pc-tag", children: t("pendingRestart") })
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
        const detail = typeof v === "object" && v !== null ? v.detail : void 0;
        if (v !== true && durationMs === void 0) throw new Error(t("installNotApplied"));
        setBusy(null);
        pendingInstall.add(m.spec);
        for (const key of Object.keys(marketCache)) {
          const c = marketCache[key];
          if (c !== void 0) c.plugins = c.plugins.map((p) => p.name === m.name ? { ...p, installed: true } : p);
        }
        setItems((prev) => prev.map((p) => p.name === m.name ? { ...p, installed: true } : p));
        showToast(detail ?? t("installQueued", { n: m.name }) + (durationMs !== void 0 ? `\uFF08${(durationMs / 1e3).toFixed(1)}s\uFF09` : ""), "ok", 7e3);
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
    filtered.length > 200 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "pc-limit", children: t("marketTooMany", { n: shown.length, m: filtered.length }) }),
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
        }, children: shotBusy === m.name ? "\u2026" : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", { width: "14", height: "14", viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", strokeWidth: "1.5", "aria-hidden": "true", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", { x: "2", y: "3.5", width: "12", height: "9", rx: "1.5" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", { cx: "8", cy: "8", r: "2.6" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M5.5 3.5 6.4 1.8h3.2l.9 1.7" })
        ] }) }),
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
function UpdatesView({ updates, refresh, updateOne, busy, doneUpdates, onDoneClick }) {
  const t = useT();
  useUpdatingVersion();
  useLlmUpdatingVersion();
  useLlmResultVersion();
  (0, import_react.useEffect)(() => {
    if (updates === null) return;
    void restoreLlmStates(updates.map((u) => u.name));
  }, [updates]);
  if (updates === null) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "pc-sub", children: t("checkingUpdates") });
  const doneOnly = doneUpdates.filter((d) => !(updates ?? []).some((u) => u.name === d.name));
  if (updates.length === 0 && doneOnly.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "pc-sub", children: t("noUpdates") }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { className: "pc-btn", onClick: refresh, children: t("recheck") })
  ] });
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
    updates.map((u) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "pc-card", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "pc-row", style: { flexWrap: "nowrap" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "pc-name", children: u.name }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "pc-ver", children: u.fromVersion }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "pc-ver", children: "\u2192" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { color: "var(--dsw-alias-state-business-primary)", fontWeight: 500 }, children: u.toVersion }),
        u.compat === "incompatible" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "pc-tag danger", children: t("incompat") }),
        pendingInstall.has(u.name) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "pc-tag", children: t("pendingRestart") }),
        llmUpdating.has(u.name) && llmResults.get(u.name) === void 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "pc-tag", children: t("llmBusy") }),
        llmResults.get(u.name) !== void 0 && (() => {
          const r = llmResults.get(u.name);
          const cls = r.status === "success" ? "" : r.status === "failed" ? "danger" : "warn";
          return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `pc-tag ${cls}`, title: r.detail, children: t(`llmRes_${r.status}`) });
        })(),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "pc-spacer" }),
        llmSessionByPlugin.has(u.name) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { className: "pc-btn", onClick: () => {
          const id = llmSessionByPlugin.get(u.name);
          if (id !== void 0) sessionsSvc?.open?.(id);
        }, children: t("llmSessionLink") }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { className: "pc-btn primary", disabled: busy !== null || pendingInstall.has(u.name) || llmUpdating.has(u.name) && llmResults.get(u.name) === void 0, onClick: () => {
          llmPrepare(u.name);
        }, children: llmUpdating.has(u.name) && llmResults.get(u.name) === void 0 ? t("llmBusy") : t("llmUpdate") })
      ] }),
      u.changelog.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { className: "pc-wn-list", children: u.changelog.slice(0, 5).map((line, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: line }, i)) })
    ] }, u.name)),
    doneOnly.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pc-card", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "pc-row", style: { flexWrap: "nowrap" }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "pc-name", children: d.name }),
      d.fromVersion !== "" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "pc-ver", children: d.fromVersion }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "pc-ver", children: "\u2192" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { color: "var(--dsw-alias-state-business-primary)", fontWeight: 500 }, children: d.toVersion }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "pc-tag", children: t("updatedPendingTag") }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "pc-spacer" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { className: "pc-btn primary", onClick: () => {
        onDoneClick(d.name);
      }, children: t("updatedPendingTag") })
    ] }) }, d.name))
  ] });
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
function CommandDialog({ command, copied, onCopy, onClose }) {
  const t = useT();
  return (0, import_react_dom.createPortal)(
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { position: "fixed", inset: 0, background: "rgba(0,0,0,.55)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { width: "min(560px, 92vw)", background: "var(--dsw-alias-bg-layer-3)", border: "1px solid var(--dsw-alias-border-l2)", borderRadius: 12, padding: 14, display: "flex", flexDirection: "column", gap: 10 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13, fontWeight: 600, color: "var(--dsw-alias-label-primary, #d8e0ea)" }, children: t("commandTitle") }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 12, color: "var(--dsw-alias-label-secondary, #67748a)", lineHeight: 1.5 }, children: t("commandHint") }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        "textarea",
        {
          readOnly: true,
          value: command,
          rows: Math.min(8, command.split("\n").length + 1),
          style: { width: "100%", boxSizing: "border-box", background: "var(--dsw-alias-bg-module-platform, rgba(128,148,168,.12))", color: "var(--dsw-alias-label-primary, #d8e0ea)", border: "1px solid var(--dsw-alias-border-l2, #1e2836)", borderRadius: 6, padding: "8px 10px", fontSize: 12, fontFamily: "monospace", resize: "vertical" }
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 8, justifyContent: "flex-end" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", className: "pc-btn", onClick: () => {
          void navigator.clipboard.writeText(command).then(onCopy).catch(() => {
          });
        }, children: copied ? t("commandCopied") : t("commandCopy") }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", className: "pc-btn primary", onClick: onClose, children: t("close") })
      ] })
    ] }) }),
    document.body
  );
}
function RestartDialog({ count, onRestart, onClose }) {
  const t = useT();
  return (0, import_react_dom.createPortal)(
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { position: "fixed", inset: 0, background: "rgba(0,0,0,.55)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { width: "min(420px, 92vw)", background: "var(--dsw-alias-bg-layer-3)", border: "1px solid var(--dsw-alias-border-l2)", borderRadius: 12, padding: 14, display: "flex", flexDirection: "column", gap: 10 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13, fontWeight: 600, color: "var(--dsw-alias-label-primary, #d8e0ea)" }, children: t("restartAskTitle") }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 12, color: "var(--dsw-alias-label-secondary, #67748a)", lineHeight: 1.5 }, children: t("restartAskBody", { n: count }) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 8, justifyContent: "flex-end" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", className: "pc-btn", onClick: onClose, children: t("later") }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "button",
          {
            type: "button",
            style: {
              padding: "3px 12px",
              fontSize: 11.5,
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
              fontWeight: 600,
              background: "var(--dsw-alias-button-primary-fill)",
              color: "var(--dsw-alias-label-primary-foreground)"
            },
            onClick: onRestart,
            children: t("restartNowBtn")
          }
        )
      ] })
    ] }) }),
    document.body
  );
}
function llmPrepare(name) {
  setLlmConfirm({ name, pkgs: [], error: null, skipped: [], preparing: true });
  void rpc("llm-update.prepare", { name }).then(
    (v) => setLlmConfirm({ name, pkgs: [v], error: null, skipped: [], preparing: false }),
    (e) => setLlmConfirm({ name, pkgs: [], error: e instanceof Error ? e.message : String(e), skipped: [], preparing: false })
  );
}
function llmPrepareAll(names) {
  setLlmConfirm({ name: "__all__", pkgs: [], error: null, skipped: [], preparing: true });
  void (async () => {
    const pkgs = [];
    const skipped = [];
    for (const n of names) {
      try {
        pkgs.push(await rpc("llm-update.prepare", { name: n }));
      } catch (e) {
        skipped.push(`${n}: ${e instanceof Error ? e.message : String(e)}`);
      }
    }
    setLlmConfirm({ name: "__all__", pkgs, error: null, skipped, preparing: false });
  })();
}
async function ensureLlmUpdateSession() {
  const list = sessionsSvc?.list?.getSnapshot?.();
  const rows = list?.byId === void 0 ? [] : Object.values(list.byId);
  const existing = rows.find((r) => (r.displayTitle ?? "").includes("\u63D2\u4EF6\u66F4\u65B0") || (r.title ?? "").includes("\u63D2\u4EF6\u66F4\u65B0"));
  if (existing?.id !== void 0) {
    sessionsSvc?.open?.(existing.id);
    return existing.id;
  }
  const ws = workspacesSvc?.list?.getSnapshot?.();
  const wsId = ws?.recentWorkspaceId ?? ws?.items?.[0]?.id;
  if (wsId === void 0 || wsId === "") return null;
  const id = await workspacesSvc?.connectWorkspace?.(wsId);
  if (id === void 0 || id === "") return null;
  sessionsSvc?.open?.(id);
  return id;
}
async function llmExecute(pkgs, name) {
  const S = STRINGS[localeId];
  setLlmConfirm(null);
  for (const p of pkgs) setLlmUpdating(p.name, true);
  const prompt = pkgs.length === 1 ? pkgs[0].prompt : [
    `\u8BF7\u4F9D\u6B21\u5904\u7406\u4EE5\u4E0B ${pkgs.length} \u4E2A\u63D2\u4EF6\u7684\u66F4\u65B0(\u6BCF\u4E2A\u63D2\u4EF6\u72EC\u7ACB\u6309 dsh-plugin-upgrade skill \u51B3\u7B56):`,
    "",
    ...pkgs.flatMap((p, i) => [`===== \u63D2\u4EF6 ${i + 1}/${pkgs.length}: ${p.name} =====`, p.prompt])
  ].join("\n");
  void rpc("llm-update.log", { name, action: "prompt-sent", detail: prompt.split("\n").slice(0, 3).join(" "), status: "running" });
  try {
    const id = await ensureLlmUpdateSession();
    if (id === null) throw new Error("no-session-target");
    const session = sessionsSvc?.binding?.(id)?.session;
    if (session?.prompt === void 0) throw new Error("no-session-face");
    const res = await session.prompt([{ type: "text", text: prompt }], "queue");
    if (res?.ok !== true) {
      throw new Error(res?.error?.message ?? "prompt rejected");
    }
    session.rename?.("\u63D2\u4EF6\u66F4\u65B0").catch(() => {
    });
    setLlmSessionId(id);
    for (const p of pkgs) llmSessionByPlugin.set(p.name, id);
    for (const p of pkgs) startLlmPolling(p.name);
    showToast(S.llmPromptReady.replace("{name}", pkgs.length === 1 ? pkgs[0].name : `${pkgs.length} \u4E2A\u63D2\u4EF6`), "ok", 8e3);
    if (name === "__all__") closeWhatsNew();
  } catch (e) {
    for (const p of pkgs) setLlmUpdating(p.name, false);
    setLlmFallback(prompt);
    showToast(`${e instanceof Error ? e.message : String(e)}`, "error", 6e3);
  }
}
function LlmConfirmDialog() {
  const t = useT();
  const state = useLlmConfirm();
  if (state === null) return null;
  const skipText = state.skipped.length === 0 ? null : t("llmConfirmSkipped", { s: state.skipped.join("\uFF1B") });
  const failText = state.error !== null && state.error !== "" ? state.error : state.skipped.length > 0 ? state.skipped.join("\uFF1B") : "(unknown)";
  const body = state.preparing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 12, color: "var(--dsw-alias-label-secondary, #67748a)" }, children: t("llmPreparing") }) : state.pkgs.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 12, color: "var(--dsw-alias-state-error-fill, #e5534b)", lineHeight: 1.5 }, children: t("llmPreparedError", { e: failText }) }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", flexDirection: "column", gap: 8, maxHeight: "46vh", overflow: "auto" }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 12, color: "var(--dsw-alias-label-secondary, #67748a)", lineHeight: 1.5 }, children: t("llmConfirmBody", { n: state.pkgs.length }) }),
    skipText !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 11.5, color: "var(--dsw-alias-state-warning-fill, #d9a53f)" }, children: skipText }),
    state.pkgs.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { border: "1px solid var(--dsw-alias-border-l2, #1e2836)", borderRadius: 8, padding: "8px 10px", display: "flex", flexDirection: "column", gap: 4 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "pc-row", style: { flexWrap: "nowrap" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "pc-name", children: p.name }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "pc-ver", children: p.fromVersion }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "pc-ver", children: "\u2192" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { color: "var(--dsw-alias-state-business-primary)", fontWeight: 500 }, children: p.toVersion ?? "\u2014" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `pc-tag${p.source === "npm" || p.source === "official" ? "" : " warn"}`, children: t("llmSourceBadge", { s: p.source }) }),
        p.isVendorModified && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "pc-tag warn", title: t("llmVendorWarn"), children: "vendor" }),
        p.compat === "incompatible" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "pc-tag danger", children: t("incompat") })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 11.5, color: "var(--dsw-alias-label-secondary, #67748a)" }, children: p.runtimeLabel === "SSID" ? t("llmScopeSsid") : t("llmScopeWeb") }),
      p.changelog.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { className: "pc-wn-list", style: { margin: 0 }, children: p.changelog.slice(0, 5).map((line, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: line }, i)) })
    ] }, p.name))
  ] });
  const canRun = state.preparing === false && state.pkgs.length > 0;
  return (0, import_react_dom.createPortal)(
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { position: "fixed", inset: 0, background: "rgba(0,0,0,.55)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1e4 }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { width: "min(560px, 92vw)", background: "var(--dsw-alias-bg-layer-3)", border: "1px solid var(--dsw-alias-border-l2)", borderRadius: 12, padding: 14, display: "flex", flexDirection: "column", gap: 10 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13, fontWeight: 600, color: "var(--dsw-alias-label-primary, #d8e0ea)" }, children: t("llmConfirmTitle") }),
      body,
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 8, justifyContent: "flex-end" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", className: "pc-btn", disabled: state.preparing, onClick: () => {
          setLlmConfirm(null);
        }, children: t("llmCancel") }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "button",
          {
            type: "button",
            style: {
              padding: "3px 12px",
              fontSize: 11.5,
              border: "none",
              borderRadius: 6,
              cursor: canRun ? "pointer" : "not-allowed",
              fontWeight: 600,
              background: "var(--dsw-alias-button-primary-fill)",
              color: "var(--dsw-alias-label-primary-foreground)",
              opacity: canRun ? 1 : 0.55
            },
            disabled: !canRun,
            onClick: () => {
              void llmExecute(state.pkgs, state.name);
            },
            children: t("llmConfirm")
          }
        )
      ] })
    ] }) }),
    document.body
  );
}
function LlmPromptFallbackDialog() {
  const t = useT();
  const prompt = useLlmFallback();
  if (prompt === null) return null;
  const [copied, setCopied] = (0, import_react.useState)(false);
  return (0, import_react_dom.createPortal)(
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { position: "fixed", inset: 0, background: "rgba(0,0,0,.55)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1e4 }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { width: "min(680px, 92vw)", background: "var(--dsw-alias-bg-layer-3)", border: "1px solid var(--dsw-alias-border-l2)", borderRadius: 12, padding: 14, display: "flex", flexDirection: "column", gap: 10 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13, fontWeight: 600, color: "var(--dsw-alias-label-primary, #d8e0ea)" }, children: t("llmFallbackTitle") }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 12, color: "var(--dsw-alias-label-secondary, #67748a)", lineHeight: 1.5 }, children: t("llmFallbackHint") }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        "textarea",
        {
          readOnly: true,
          value: prompt,
          rows: Math.min(10, prompt.split("\n").length + 1),
          style: { width: "100%", boxSizing: "border-box", background: "var(--dsw-alias-bg-module-platform, rgba(128,148,168,.12))", color: "var(--dsw-alias-label-primary, #d8e0ea)", border: "1px solid var(--dsw-alias-border-l2, #1e2836)", borderRadius: 6, padding: "8px 10px", fontSize: 12, fontFamily: "monospace", resize: "vertical" }
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 8, justifyContent: "flex-end" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", className: "pc-btn", onClick: () => {
          void navigator.clipboard.writeText(prompt).then(() => setCopied(true)).catch(() => {
          });
        }, children: copied ? t("commandCopied") : t("commandCopy") }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", className: "pc-btn primary", onClick: () => {
          setLlmFallback(null);
        }, children: t("close") })
      ] })
    ] }) }),
    document.body
  );
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
  const [commandDialog, setCommandDialog] = (0, import_react.useState)(null);
  const [copied, setCopied] = (0, import_react.useState)(false);
  const readyPending = (0, import_react.useRef)([]);
  const inUpdateAll = (0, import_react.useRef)(false);
  useDoneUpdatesVersion();
  const [restartAsk, setRestartAsk] = (0, import_react.useState)(0);
  const runRestartNow = (n) => {
    void fetch("/ssid/api/sessionRoot.restart", { method: "POST", headers: { "content-type": "application/json" }, body: "{}" }).then((res) => res.json()).then((body2) => {
      if (body2.ok !== true) {
        showToast(t("restartUnavailable"), "error", 8e3);
        return;
      }
      if (body2.value?.code === "busy") {
        showToast(t("updateRestartBusy", { n: body2.value.activeSessions ?? 0 }), "error", 8e3);
      }
    }).catch(() => showToast(t("restartUnavailable"), "error", 8e3));
  };
  const askRestart = (n) => {
    setRestartAsk(n);
  };
  const flushReady = () => {
    const n = readyPending.current.length;
    if (n === 0) return;
    readyPending.current = [];
    askRestart(n);
  };
  const handleToggle = (p) => {
    if (togglingId !== null) return;
    const id = p.entryId;
    const nextEnabled = !p.enabled;
    const wasPending = pendingToggles.has(id);
    console.log("[plugin-center] toggle", { id, name: p.name, fromEnabled: p.enabled, toEnabled: nextEnabled, wasPending });
    setTogglingId(p.name);
    void rpc("toggle", { id, name: p.name, disabled: !nextEnabled }).then(
      (v) => {
        setTogglingId(null);
        const nowDisabled = typeof v === "object" && v !== null ? v.nowDisabled : null;
        console.log("[plugin-center] toggle result", { id, nowDisabled });
        if (nowDisabled === true && !wasPending) {
          setPendingToggle(id, "disable");
          showToast(t("disabledOk", { n: p.name }), "ok", 5e3);
        } else if (nowDisabled === false && !wasPending) {
          setPendingToggle(id, "enable");
          showToast(t("enabledOk", { n: p.name }), "ok", 5e3);
        } else if (wasPending) {
          setPendingToggle(id, null);
          showToast(nowDisabled === true ? t("revertedDisable", { n: p.name }) : t("revertedEnable", { n: p.name }), "ok", 5e3);
        }
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
        const value = typeof v === "object" && v !== null ? v : null;
        if (value === null || value.durationMs === void 0 && value.command === void 0) throw new Error(t("updateNotApplied"));
        setUpdating(name, false);
        setBusyUpdate(null);
        if (value.command !== void 0 && value.command !== "") {
          setCommandDialog(value.command);
          setCopied(false);
          return;
        }
        if (value.hot === true) {
          showToast(t("updatedHot", { n: name }) + (value.durationMs !== void 0 ? `\uFF08${(value.durationMs / 1e3).toFixed(1)}s\uFF09` : ""), "ok", 5e3);
          refreshUpdates(true);
          return;
        }
        if (value.pending === true) {
          pendingInstall.add(name);
          readyPending.current.push(name);
          if (!inUpdateAll.current) flushReady();
          refreshUpdates(true);
          return;
        }
        pendingInstall.add(name);
        markDoneUpdate({
          name,
          fromVersion: updates?.find((u) => u.name === name)?.fromVersion ?? "",
          toVersion: version
        });
        showToast(t("updatedOne", { n: name }) + (value.durationMs !== void 0 ? `\uFF08${(value.durationMs / 1e3).toFixed(1)}s\uFF09` : ""), "ok", 5e3);
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
    inUpdateAll.current = true;
    readyPending.current = [];
    const commands = [];
    let okCount = 0;
    let hotCount = 0;
    const okNames = [];
    const failures = [];
    for (const u of updates) {
      setUpdating(u.name, true);
      try {
        const v = await rpc("update", { name: u.name, version: u.toVersion });
        const value = typeof v === "object" && v !== null ? v : null;
        if (value === null || value.durationMs === void 0 && value.command === void 0) throw new Error(t("updateNotApplied"));
        okCount++;
        if (value.command !== void 0 && value.command !== "") {
          commands.push(value.command);
          continue;
        }
        if (value.hot === true) {
          hotCount++;
          okNames.push(value.durationMs !== void 0 ? `${u.name}\uFF08${(value.durationMs / 1e3).toFixed(1)}s\uFF09` : u.name);
          continue;
        }
        if (value.pending === true) {
          readyPending.current.push(u.name);
          okNames.push(`${u.name}\uFF08\u5F85\u91CD\u542F\uFF09`);
          continue;
        }
        pendingInstall.add(u.name);
        markDoneUpdate({
          name: u.name,
          fromVersion: u.fromVersion,
          toVersion: u.toVersion
        });
        okNames.push(value.durationMs !== void 0 ? `${u.name}\uFF08${(value.durationMs / 1e3).toFixed(1)}s\uFF09` : u.name);
      } catch (e) {
        failures.push(`${u.name}\uFF1A${e instanceof Error ? e.message : String(e)}`);
      } finally {
        setUpdating(u.name, false);
      }
    }
    inUpdateAll.current = false;
    setBusyUpdate(null);
    if (commands.length > 0) {
      setCommandDialog(commands.join("\n"));
      setCopied(false);
    } else if (readyPending.current.length > 0) {
      flushReady();
    }
    if (failures.length > 0) {
      showToast(t("updateSummary", { a: okCount, b: failures.length, c: failures.join("\uFF1B") }), "error", 15e3);
    } else if (commands.length === 0 && readyPending.current.length === 0 && hotCount === okCount) {
      showToast(t("updatedManyHot", { n: okCount }) + `\uFF08${okNames.join("\u3001")}\uFF09`, "ok", 6e3);
    } else if (commands.length === 0 && readyPending.current.length === 0) {
      showToast(t("updatedMany", { n: okCount }) + `\uFF08${okNames.join("\u3001")}\uFF09`, "ok", 6e3);
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
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "pc-sub", children: t("headSummary", { a: counts.installed, b: updates === null ? "\u2026" : updates.length, c: counts.failed }) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "pc-spacer" }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { className: "pc-btn", disabled: checking, onClick: () => {
      refreshUpdates();
    }, children: checking ? t("checking") : t("check") }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { className: "pc-btn primary", disabled: !updates?.length || busyUpdate !== null, onClick: () => {
      void updateAll();
    }, children: t("updateAll", { n: updates?.length ?? 0 }) })
  ] });
  const installedToolbar = view === "installed" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "pc-filter", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "pc-toolbar pc-toolbar-main", children: [
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
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "pc-catbar", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { className: `pc-chip${installedCategory === null ? " active" : ""}`, onClick: () => {
        setInstalledCategory(null);
      }, children: t("all") }),
      CATEGORIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { className: `pc-chip${installedCategory === c ? " active" : ""}`, onClick: () => {
        setInstalledCategory(c);
      }, children: c }, c))
    ] })
  ] }) : null;
  const marketToolbar = view === "market" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "pc-filter", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "pc-toolbar pc-toolbar-main", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { className: "pc-search", style: { flex: 1, minWidth: 120 }, value: marketSearch, onChange: (e) => {
        setMarketSearch(e.target.value);
      }, placeholder: t("searchMarket") }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", { className: "pc-select", value: source, onChange: (e) => {
        setSource(e.target.value);
        setCategory(null);
      }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "awesome", children: "awesome-dsh-plugin" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "oh-my-dsh", children: "Oh-My-DSH" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "dsh-market", children: "dsh-market" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "all", children: t("allMarkets") })
      ] }),
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
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "pc-catbar", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { className: `pc-chip${category === null ? " active" : ""}`, onClick: () => {
        setCategory(null);
      }, children: t("all") }),
      CATEGORIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { className: `pc-chip${category === c ? " active" : ""}`, onClick: () => {
        setCategory(c);
      }, children: c }, c))
    ] })
  ] }) : null;
  const body = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    view === "installed" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InstalledView, { search, category: installedCategory, source: installedSource, onToggle: handleToggle, togglingId }),
    view === "market" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MarketView, { category, single, source, search: marketSearch, onCount: handleMarketCount }),
    view === "updates" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UpdatesView, { updates, refresh: refreshUpdates, updateOne, busy: busyUpdate, doneUpdates: doneUpdatesStore, onDoneClick: () => {
      askRestart(1);
    } }),
    view === "diagnose" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DiagnoseView, {})
  ] });
  if (variant === "overlay") {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { flex: "none" }, children: [
          head(false),
          tabs,
          installedToolbar,
          marketToolbar
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pc-scroll", children: body })
      ] }),
      commandDialog !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommandDialog, { command: commandDialog, copied, onCopy: () => {
        setCopied(true);
      }, onClose: () => {
        setCommandDialog(null);
      } }),
      restartAsk > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RestartDialog, { count: restartAsk, onRestart: () => {
        const n = restartAsk;
        setRestartAsk(0);
        runRestartNow(n);
      }, onClose: () => {
        setRestartAsk(0);
      } })
    ] });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", flexDirection: "column", height: "100%", minHeight: 0 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { flex: "none", paddingBottom: "4px" }, children: [
        head(true),
        tabs,
        installedToolbar,
        marketToolbar
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pc-scroll", children: body })
    ] }),
    commandDialog !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommandDialog, { command: commandDialog, copied, onCopy: () => {
      setCopied(true);
    }, onClose: () => {
      setCommandDialog(null);
    } }),
    restartAsk > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RestartDialog, { count: restartAsk, onRestart: () => {
      const n = restartAsk;
      setRestartAsk(0);
      runRestartNow(n);
    }, onClose: () => {
      setRestartAsk(0);
    } })
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
  return (0, import_react_dom.createPortal)(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `pc-toast ${t.kind}`, children: t.message }), document.body);
}
function WhatsNewDialog() {
  const t = useT();
  const open = useWhatsNewOpen();
  const [busy, setBusy] = (0, import_react.useState)(false);
  useLlmUpdatingVersion();
  useLlmConfirm();
  if (!open || whatsNewDigests.length === 0) return null;
  const updateNow = async () => {
    setBusy(true);
    let okCount = 0;
    let hotCount = 0;
    const failures = [];
    for (const u of whatsNewDigests) {
      try {
        const v = await rpc("update", { name: u.name, version: u.toVersion });
        const value = typeof v === "object" && v !== null ? v : null;
        if (value === null || value.durationMs === void 0 && value.command === void 0) throw new Error(t("updateNotApplied"));
        if (value.command !== void 0 && value.command !== "") {
          failures.push(`${u.name}\uFF1A${t("commandHint")}`);
          continue;
        }
        okCount++;
        if (value.hot === true) {
          hotCount++;
          continue;
        }
        if (value.pending === true || value.direct === true) {
          pendingInstall.add(u.name);
          markDoneUpdate({ name: u.name, fromVersion: u.fromVersion, toVersion: u.toVersion });
        }
      } catch (e) {
        failures.push(`${u.name}\uFF1A${e instanceof Error ? e.message : String(e)}`);
      }
    }
    setBusy(false);
    if (failures.length === 0) {
      showToast(hotCount === okCount ? t("updatedManyHot", { n: okCount }) : t("updatedMany", { n: okCount }), "ok", 6e3);
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
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pc-panel-body", style: { overflow: "auto" }, children: whatsNewDigests.map((u) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "pc-wn-item", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "pc-row", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "pc-name", children: u.name }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "pc-ver", children: u.fromVersion }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "pc-ver", children: "\u2192" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { color: "var(--dsw-alias-state-business-primary)", fontWeight: 500 }, children: u.toVersion })
      ] }),
      u.changelog.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { className: "pc-wn-list", children: u.changelog.slice(0, 5).map((line, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: line }, i)) })
    ] }, u.name)) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "pc-panel-footer", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { className: "pc-btn", onClick: closeWhatsNew, children: t("later") }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { className: "pc-btn", onClick: closeWhatsNew, children: t("markAllRead") }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { className: "pc-btn primary", disabled: busy || llmUpdating.size > 0 || llmConfirm !== null, onClick: () => {
        llmPrepareAll(whatsNewDigests.map((u) => u.name));
      }, children: llmUpdating.size > 0 ? t("llmBusy") : t("llmUpdateAll", { n: whatsNewDigests.length }) })
    ] })
  ] }) });
}
var inject = ["slots", "connection", "sessions", "workspaces"];
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
  sessionsSvc = ctx.sessions ?? null;
  workspacesSvc = ctx.workspaces ?? null;
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
  ctx.slots.inject("shell.overlay", () => ctx.slots.register({
    name: "shell.overlay",
    id: "plugin-center-llm-confirm",
    order: 53
  }, LlmConfirmDialog));
  ctx.slots.inject("shell.overlay", () => ctx.slots.register({
    name: "shell.overlay",
    id: "plugin-center-llm-fallback",
    order: 54
  }, LlmPromptFallbackDialog));
  void checkWhatNew();
}
    return module.exports;
  },
});

