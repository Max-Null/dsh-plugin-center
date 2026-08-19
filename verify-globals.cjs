// verify-globals.cjs — 0.1.7 全局控制器（__pluginCenterOpen/Toggle/Close）验证。
// node 模拟浏览器环境执行 client.js，验证 apply 后全局 API 的存在、可调用、
// unload 清理与重复 apply 守卫。用法：node verify-globals.cjs
'use strict'

const fs = require('node:fs')
const path = require('node:path')

const source = fs.readFileSync(path.join(__dirname, 'client.js'), 'utf8')

let failures = 0
const check = (name, cond, extra) => {
  if (cond) console.log(`  ok   ${name}`)
  else { failures++; console.log(`  FAIL ${name}${extra ? ` — ${extra}` : ''}`) }
}

// ── 模拟浏览器环境 ─────────────────────────────────────────────
let unloadHandler = null
let unloadCount = 0
global.window = {
  __ModuleLoader__: {
    load(handoff) {
      // client.js 顶部 require('react') 是 external，模块初始化即执行；
      // 组件不被渲染，stub 对象即可（仅存引用，调用时才解成员）。
      const stub = {}
      const exportsObj = handoff.factory((id) => {
        if (id === 'react' || id === 'react/jsx-runtime') return stub
        throw new Error(`unexpected require: ${id}`)
      })
      global.__handoff = { id: handoff.id, exports: exportsObj }
    },
  },
  addEventListener(name, fn) { if (name === 'unload') { unloadHandler = fn; unloadCount++ } },
}
global.document = {
  createElement(tag) { return tag === 'style' ? { setAttribute() {}, set textContent(v) {} } : {} },
  head: { append() {} },
}

// ── 执行 client.js（触发 __ModuleLoader__.load）──────────────
// eslint-disable-next-line no-eval
eval(source)

check('handoff.id 为 @max-null/dsh-plugin-center', global.__handoff?.id === '@max-null/dsh-plugin-center', global.__handoff?.id)
check('exports 含 apply/inject', typeof global.__handoff?.exports?.apply === 'function' && Array.isArray(global.__handoff.exports.inject))

// ── 调用 apply，验证全局 API ───────────────────────────────────
const slots = { inject() {} }
const ctx = {
  slots,
  connection: { rpc: { call: async () => ({ ok: true, value: {} }) } },
  get: () => undefined,
  on: () => {},
}
global.__handoff.exports.apply(ctx)

check('__pluginCenterOpen 已暴露', typeof window.__pluginCenterOpen === 'function')
check('__pluginCenterToggle 已暴露', typeof window.__pluginCenterToggle === 'function')
check('__pluginCenterClose 已暴露', typeof window.__pluginCenterClose === 'function')
check('已挂 unload 监听', typeof unloadHandler === 'function')

// 可调用性：open/toggle/close 各调一次不抛错（幂等）
let threw = false
try {
  window.__pluginCenterOpen()
  window.__pluginCenterToggle()
  window.__pluginCenterClose()
  window.__pluginCenterToggle()
} catch (e) {
  threw = true
  console.log('  [err]', e.message)
}
check('open/toggle/close 可调用不抛错', !threw)

// 重复 apply：守卫生效，不重复挂 unload 监听
global.__handoff.exports.apply(ctx)
check('重复 apply 不重复挂 unload 监听', unloadCount === 1, `unloadCount=${unloadCount}`)

// unload 清理：三个 API 全部删除
if (typeof unloadHandler === 'function') unloadHandler()
check('unload 后 __pluginCenterOpen 已清理', window.__pluginCenterOpen === undefined)
check('unload 后 __pluginCenterToggle 已清理', window.__pluginCenterToggle === undefined)
check('unload 后 __pluginCenterClose 已清理', window.__pluginCenterClose === undefined)

// ── 静态断言：遮罩点击关闭（React 渲染在模拟环境不展开，验证产物结构）──
check('产物含遮罩 onClick=closeOverlay', /pc-overlay[\s\S]{0,200}?onClick:\s*closeOverlay/.test(source))
check('产物含面板 stopPropagation', /stopPropagation/.test(source))
check('产物含 toggleOverlay 三元逻辑', /function toggleOverlay\(\)\s*\{\s*overlayOpen \? closeOverlay\(\) : openOverlay\(\)/.test(source))

console.log(failures === 0 ? '\nALL PASS' : `\n${failures} FAILURE(S)`)
process.exit(failures === 0 ? 0 : 1)
