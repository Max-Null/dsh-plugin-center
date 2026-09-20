# Release Notes — @max-null/dsh-plugin-center

## 0.3.0 (2026-09-17)

本版为 minor：除修复 web 环境的面板加载失败外，插件对外**新增了一种传输形态**
（`POST /api/plugin-center`），旧的逻辑通道保留为兼容回退。

### 修复

- 修正 web 环境下插件中心面板的「加载失败：transport failure for /plugin-center/listInstalled: HTTP 405」。
  根因在宿主侧：`ctx.connection.rpc.handle()` 注册逻辑通道时会访问 `client-connection`
  未声明的 `webServer` 注入，cordis 属性代理抛错后注册静默失败（DSH 源码形态特有；
  打包内核形态不受影响）。上游报告：deepseek-ai/deepseek-harness discussions #6880。

### 变更

- 传输层改为双路径自适应：
  - 宿主提供 `connection.fetch.register` → 注册 `POST /api/plugin-center` 精确路由
    （只写 Connection 自己的路由表，不触碰 `owner.webServer`）；
  - 宿主只提供逻辑通道注册表（老打包内核）→ 自动回退 `/plugin-center`；
  - 浏览器侧先试新路由，**收到 404 才回退**（新路由未注册时 `/api/*` 是 404，根路径才是 405）。
- `connection` 服务改用 `ctx.inject(['connection'], cb)` 获取：它在插件 apply 时尚未就绪，
  且 `ctx.plugin(P)` 不等待依赖。

### 兼容性

- 插件中心对外的端点集合、请求体与响应信封（RpcResult）均未变。
- 面板端与宿主端需同版本升级（浏览器侧的传输策略随之切换）。

### 测试

- 新增 `tests/rpc-transport.test.ts`（9 条）：传输层选择、服务晚到时不抢先注册、
  路由派发、JSON 解析失败、缺 endpoint 字段与引擎异常收敛为 `internal` 信封。
- 全量 59 条通过；`npm run typecheck` 无错。

### 验证

- web（源码形态）实测：`POST /api/plugin-center` → 200，面板恢复（已安装 184 · 有更新 1 · 失效 0）。
