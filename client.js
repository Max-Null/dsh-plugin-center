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
/* \u6765\u6E90\u4ED3\u5E93\u77ED\u540D\uFF1A\u53EF\u6536\u7F29 + \u622A\u65AD\u7701\u7565(\u957F owner/repo \u4E0D\u6491\u7834 nowrap \u884C),title \u663E\u793A\u5168\u6587\u3002 */
.pc-src { flex: 0 1 auto; min-width: 0; max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--dsw-alias-label-caption); font-size: 12px; cursor: default; }
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

.pc-btn { padding: 5px 14px; border-radius: 8px; border: 1px solid var(--dsw-alias-border-l2); background: transparent; color: var(--dsw-alias-label-primary); font-size: 13px; line-height: 1.5; cursor: pointer; font-family: inherit; flex-shrink: 0; white-space: nowrap; }
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
/* \u5F39\u7A97\u5E95\u8272\u53EA\u7531\u300C\u5F39\u7A97\u4E0D\u900F\u660E\u5EA6\u300D\u51B3\u5B9A\uFF082026-09-14 \u7528\u6237\u62A5\u544A\u7684\u53D6\u503C\u9519\u4F4D\uFF09\uFF1A
   \u76AE\u80A4\u63D2\u4EF6 dsh-dream-skin \u7684 shadeTokens2 \u628A --dsw-alias-bg-base \u7684 alpha \u7ED1\u5728
   \u300C\u58C1\u7EB8\u900F\u660E\u5EA6\u300D\u6ED1\u6746\u4E0A\uFF0C\u76F4\u63A5\u53D6\u5B83\u4F1A\u8BA9\u5F39\u7A97\u8DDF\u7740\u58C1\u7EB8\u53D8\u900F\u3001\u800C\u5F39\u7A97\u81EA\u5DF1\u7684\u6ED1\u6746\u5931\u6548\u3002
   \u5B83\u53E6\u63D0\u4F9B\u4E24\u4E2A\u53D8\u91CF\uFF1A--dsh-dream-skin-modal-fill\uFF08\u5F39\u7A97\u586B\u5145\u6743\u91CD %\uFF09\u4E0E
   --dsh-dream-skin-composer-base\uFF08\u76AE\u80A4\u57FA\u8272\uFF0C\u4E0D\u5E26 alpha\uFF09\u3002\u6709\u76AE\u80A4\u65F6\u6309
   \u300C\u57FA\u8272 \xD7 \u5F39\u7A97\u6743\u91CD\u300D\u53D6\u8272\u2014\u2014\u7528\u4E0D\u5E26 alpha \u7684\u57FA\u8272\u624D\u4E0D\u4F1A\u628A\u4E24\u4E2A alpha \u590D\u5408\u8D77\u6765\uFF0C
   \u4E0E\u5B98\u65B9\u5B83\u81EA\u5DF1\u4FEE composer \u65F6\u7684\u53D6\u820D\u4E00\u81F4\uFF1B\u65E0\u76AE\u80A4\u65F6\u53D8\u91CF\u7F3A\u7701\uFF0C\u516C\u5F0F\u9000\u5316\u4E3A
   bg-base \xD7 100% = \u539F\u503C\uFF0C\u884C\u4E3A\u4E0D\u53D8\u3002\u7B2C\u4E00\u884C\u662F\u4E0D\u652F\u6301 color-mix \u7684\u5F15\u64CE\u7684\u964D\u7EA7\u3002 */
.pc-panel { width: 760px; max-width: 94vw; max-height: 86vh; background: var(--dsw-alias-bg-base); background: color-mix(in srgb, var(--dsh-dream-skin-composer-base, var(--dsw-alias-bg-base)) var(--dsh-dream-skin-modal-fill, 100%), transparent); border-radius: 12px; box-shadow: 0 24px 64px rgba(0,0,0,.24); display: flex; flex-direction: column; overflow: hidden; }
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
.pc-wn-item.pc-wn-read { opacity: .55; }
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
var rpc = async () => {
  throw new Error("plugin-center: rpc not wired");
};
var updatesCache = null;
var sessionsSvc = null;
var workspacesSvc = null;
var uiWorkspaceSvc = null;
var llmRetains = /* @__PURE__ */ new Map();
var LLM_RESULT_TTL_MS = 30 * 6e4;
var STRINGS = {
  zh: {
    title: "\u63D2\u4EF6\u4E2D\u5FC3",
    tabInstalled: "\u5DF2\u5B89\u88C5",
    tabMarket: "\u5E02\u573A",
    tabUpdates: "\u66F4\u65B0",
    tabUpdateHint: "\u8FD9\u4E9B\u63D2\u4EF6\u6709\u66F4\u65B0\u7248\u672C\uFF1B\u70B9\u300C\u66F4\u65B0\u300D\u4F1A\u6253\u5F00\u5B98\u65B9\u5B89\u88C5\u5BF9\u8BDD\u6846\u3002",
    tabUpdateEmpty: "\u5168\u90E8\u662F\u6700\u65B0\u7248\u672C\u3002",
    tabUpdateRecheck: "\u91CD\u65B0\u68C0\u67E5",
    tabUpdateDo: "\u66F4\u65B0",
    tabUpdateIncompat: "\u4E0E\u5F53\u524D\u5185\u6838\u4E0D\u517C\u5BB9",
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
    srcRepo: "\u6765\u6E90\u4ED3\u5E93",
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
    llmMismatch: "\u540C\u540D\u5F02\u6E90",
    llmMismatchHint: "npm \u540C\u540D\u5305\u4E0E\u672C\u5730\u4E0A\u6E38\u4E0D\u662F\u540C\u4E00\u9879\u76EE,\u5347\u7EA7\u4F1A\u4E22\u5931\u5B9A\u5236\u529F\u80FD",
    llmScopeSsid: "\u66F4\u65B0\u8303\u56F4\uFF1A\u4EC5\u601D\u7075\u5E94\u7528\u5185\u7684\u63D2\u4EF6\uFF08AI \u52A9\u624B\u53EA\u52A8\u8FD9\u4E00\u5904\uFF0C\u4E0D\u4F1A\u5F71\u54CD\u4F60\u5176\u4ED6\u5730\u65B9\u7684\u5B89\u88C5\uFF09",
    llmScopeWeb: "\u66F4\u65B0\u8303\u56F4\uFF1A\u4EC5\u5F53\u524D DSH Web \u5E94\u7528\u5185\u7684\u63D2\u4EF6\uFF08AI \u52A9\u624B\u53EA\u52A8\u8FD9\u4E00\u5904\uFF0C\u4E0D\u4F1A\u5F71\u54CD\u4F60\u5176\u4ED6\u5730\u65B9\u7684\u5B89\u88C5\uFF09",
    llmConfirm: "\u786E\u8BA4\u5E76\u6267\u884C",
    llmCancel: "\u53D6\u6D88",
    llmPromptReady: "LLM \u66F4\u65B0\u5DF2\u53D1\u8D77\uFF1A{name}\u3002\u8BF7\u5728\u4F1A\u8BDD\u4E2D\u6309 dsh-plugin-upgrade skill \u51B3\u7B56\u6267\u884C\u3002",
    llmPromptRestart: "LLM \u66F4\u65B0\u5B8C\u6210\u540E\u8BF7\u91CD\u542F DSH web\uFF0C\u63D2\u4EF6\u5217\u8868\u5C06\u5237\u65B0\u4E3A\u6700\u65B0\u7248\u672C\u3002",
    llmPreparing: "\u91C7\u96C6\u63D2\u4EF6\u4FE1\u606F\u4E2D\u2026",
    llmPreparedError: "\u4FE1\u606F\u5305\u91C7\u96C6\u5931\u8D25\uFF1A{e}",
    llmSessionLink: "\u67E5\u770B\u4F1A\u8BDD",
    llmSessionMissing: "\u4F1A\u8BDD\u5DF2\u4E0D\u5B58\u5728(\u53EF\u80FD\u88AB\u6E05\u7406),\u8BF7\u5728\u4F1A\u8BDD\u5217\u8868\u4E2D\u67E5\u770B\u5386\u53F2\u8BB0\u5F55",
    llmBusy: "LLM \u6267\u884C\u4E2D\u2026",
    llmDone: "LLM \u66F4\u65B0\u5B8C\u6210\uFF1A{name} \u2014 {d}",
    llmFailed: "LLM \u66F4\u65B0\u5931\u8D25\uFF1A{name} \u2014 {d}",
    llmKept: "LLM \u51B3\u7B56\uFF1A\u4FDD\u6301 {name}\uFF08\u672A\u66F4\u65B0\uFF09\u2014 {d}",
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
    whatsNewSub: "{n} \u4E2A\u6709\u65B0\u7248\u672C\uFF0C\u5176\u4E2D {m} \u4E2A\u672A\u8BFB",
    readTag: "\u5DF2\u8BFB",
    changelogNone: "\u6682\u65E0\u53D8\u66F4\u8BF4\u660E\uFF08GitHub \u9650\u6D41\u6216\u4ED3\u5E93\u65E0\u8BB0\u5F55\uFF0C\u7A0D\u540E\u81EA\u52A8\u91CD\u8BD5\uFF09",
    githubChanges: "GitHub \u53D8\u66F4 \u2197",
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
    tabUpdateHint: "These plugins have newer versions; Update opens the official install dialog.",
    tabUpdateEmpty: "Everything is up to date.",
    tabUpdateRecheck: "Check again",
    tabUpdateDo: "Update",
    tabUpdateIncompat: "Incompatible with this kernel",
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
    srcRepo: "Source repo",
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
    llmMismatch: "Mismatched upstream",
    llmMismatchHint: "The npm package with this name is a different project \u2014 updating would lose local customizations",
    llmScopeSsid: "Scope: plugins inside SSiD only (AI touches just this place, nothing elsewhere)",
    llmScopeWeb: "Scope: plugins inside this DSH Web app only (AI touches just this place, nothing elsewhere)",
    llmConfirm: "Confirm & run",
    llmCancel: "Cancel",
    llmPromptReady: "LLM update launched: {name}. Decide & execute in session per dsh-plugin-upgrade skill.",
    llmPromptRestart: "Restart DSH web after the LLM update completes so the plugin list refreshes to latest.",
    llmPreparing: "Preparing plugin info\u2026",
    llmPreparedError: "Prepare failed: {e}",
    llmSessionLink: "View session",
    llmSessionMissing: "Session no longer exists (may have been cleaned up); check the session list",
    llmBusy: "LLM running\u2026",
    llmDone: "LLM update done: {name} \u2014 {d}",
    llmFailed: "LLM update failed: {name} \u2014 {d}",
    llmKept: "LLM decided: keep {name} (no update) \u2014 {d}",
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
    whatsNewSub: "{n} with new versions, {m} unread",
    readTag: "Read",
    changelogNone: "No changelog available (GitHub rate limit or no repo history; retried automatically)",
    githubChanges: "GitHub changes \u2197",
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
function UpdateTab({ install, openPackage }) {
  const t = useT();
  const [items, setItems] = (0, import_react.useState)(updatesCache);
  const [error, setError] = (0, import_react.useState)(null);
  const [busy, setBusy] = (0, import_react.useState)(false);
  const load = (0, import_react.useCallback)(() => {
    setBusy(true);
    setError(null);
    void rpc("checkUpdates", {}).then(
      (v) => {
        const list = v;
        updatesCache = list;
        setItems(list);
        setBusy(false);
      },
      (e) => {
        setError(e instanceof Error ? e.message : String(e));
        setBusy(false);
      }
    );
  }, []);
  (0, import_react.useEffect)(() => {
    if (updatesCache === null) load();
  }, [load]);
  if (error !== null) {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "pc-sub", children: t("loadFailed", { e: error }) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", className: "pc-btn", onClick: load, children: t("tabUpdateRecheck") })
    ] });
  }
  if (busy || items === null) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "pc-sub", children: t("checking") });
  if (items.length === 0) {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "pc-sub", children: t("tabUpdateEmpty") }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", className: "pc-btn", onClick: load, children: t("tabUpdateRecheck") })
    ] });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", flexDirection: "column", gap: 8 }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "pc-sub", children: t("tabUpdateHint") }),
    items.map((u) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "pc-card", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 8 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "button",
          {
            type: "button",
            className: "pc-name",
            style: { background: "none", border: 0, padding: 0, cursor: "pointer", font: "inherit" },
            onClick: () => {
              openPackage(u.name);
            },
            children: u.name
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "pc-ver", children: [
          u.fromVersion,
          " \u2192 ",
          u.toVersion
        ] }),
        u.compat === "incompatible" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "pc-tag warn", children: t("tabUpdateIncompat") }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { marginLeft: "auto" }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "button",
          {
            type: "button",
            className: "pc-btn",
            disabled: u.compat === "incompatible",
            onClick: () => {
              install({ spec: `${u.name}@${u.toVersion}`, title: u.name, version: u.toVersion });
            },
            children: t("tabUpdateDo")
          }
        ) })
      ] }),
      u.changelog.slice(0, 3).map((line, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pc-sub", children: line }, i))
    ] }, u.name))
  ] });
}
var inject = ["slots", "connection", "sessions", "workspaces", "uiWorkspace"];
function apply(ctx) {
  injectCss();
  sessionsSvc = ctx.sessions ?? null;
  workspacesSvc = ctx.workspaces ?? null;
  uiWorkspaceSvc = ctx.uiWorkspace ?? null;
  ctx.effect?.(() => () => {
    for (const retained of llmRetains.values()) retained.release?.();
    llmRetains.clear();
  }, "dsh-plugin-center: LLM update session retains");
  rpc = async (endpoint, payload = {}) => {
    const response = await fetch("/api/plugin-center", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ endpoint, payload })
    });
    if (response.status === 404) {
      const legacy = await ctx.connection.rpc.call("/plugin-center", endpoint, payload);
      if (legacy.ok) return legacy.value;
      throw new Error(legacy.error?.message ?? `plugin-center: ${endpoint} failed`);
    }
    if (!response.ok) throw new Error(`plugin-center: ${endpoint} failed (HTTP ${response.status})`);
    const result = await response.json();
    if (result.ok) return result.value;
    throw new Error(result.error?.message ?? `plugin-center: ${endpoint} failed`);
  };
  const locale = ctx.get?.("locale");
  const initial = locale?.getLocale?.()?.active;
  if (typeof initial === "string") adoptLocale(initial);
  ctx.on?.("locale/change", (snap) => {
    adoptLocale(snap?.active);
  });
  ctx.slots.inject("plugins.tab", () => ctx.slots.register({
    name: "plugins.tab",
    id: "plugin-center-updates",
    order: 10,
    label: () => STRINGS[localeId].tabUpdates
  }, UpdateTab));
}
    return module.exports;
  },
});

