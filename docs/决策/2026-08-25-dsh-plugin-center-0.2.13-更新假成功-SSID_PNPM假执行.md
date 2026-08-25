# 插件中心更新假成功 v2：SSID_PNPM 指向 pnpm.cjs，Windows 假执行

> 决策日期：2026-08-25 · 状态：已实施（dsh-plugin-center v0.2.13，未发布）
> 关联：2026-08-18《插件中心更新假成功-pnpm最小发布年龄政策》（第一轮，根因不同，未覆盖本问题）
> 波及：全部 SSiD v0.1.11+ 安装版（SSID_PNPM 注入后），插件中心更新 + 重启消费 pending + 首启 pnpm install

## 1. 现象（另一台电脑，用户 21020935）

插件中心「立即更新」两个插件，全部失败：

```
更新完成：成功 0，失败 2（dsh-better-sidebar: update dsh-better-sidebar 失败：
pnpm add 未生效（exit 0，安装版本仍为 0.16.0）。若重试仍失败，请在项目目录
(C:\Users\21020935\dsh\profiles\ssid\) 手动执行: pnpm add -w dsh-better-sidebar@0.16.1; …）
```

这是 v0.2.12「no-op 识破」的报错（exit 0 但版本未变 → 报真实错误）。
本机 8/25 同症状：连续 3 次 **142ms** 静默成功、spec/版本均未变（v0.2.12 commit 描述）。

## 2. 排查与根因（全部实证）

1. **排除发布年龄**：隔离实验（minAge 0 / 默认两种配置）`pnpm add -w pkg@ver`
   均真实安装（精确版本触发 pnpm 自动写 minimumReleaseAgeExclude，8/18 结论再次验证）；
   0.16.1/0.4.12 发布时间 8/25 03:10-03:22 UTC 并非 root cause。
2. **排除 range 语义**：隔离 workspace 中 `add -w dsh-dream-skin@0.4.12`
   （range ^0.4.10）真实升级（对照本机 profile 也成功：0.4.11→0.4.12，12.1s）。
3. **命中**：`SSID_PNPM`（SSiD shell/main.mjs 注入，2026-08-23 起）指向
   `resources/app.asar.unpacked/node_modules/pnpm/bin/pnpm.cjs`（**node 脚本**；
   pnpm 11.21 的 bin 目录只有 .cjs/.mjs，无 .cmd）。插件中心
   `runPnpm → runOne → spawn(command, {shell:true})` 把 pnpm.cjs **当可执行命令**：
   - Windows cmd 不认 `.cjs` 扩展名 → 交给文件关联（ShellExecute）**假执行**：
     cmd 立即 exit 0，node 从未在目标 cwd 运行（输出重定向实测 **0 字节**）；
   - 该候选是候选链**第一优先**，假 exit 0 短路后续真实候选（PATH pnpm / npx pnpm@11）；
   - 结果：pnpm 没跑 → 版本未变 → 142ms「静默成功」。本机 8/25 复现的 142ms
     与案发现场吻合。
4. **同病消费点**：kernel.ts `applyPendingPluginUpdates`（重启消费 pending 清单，
   spawnSync 同形态）与 main.mjs `pnpmCandidates`（首启 profile 初始化
   `pnpm install`，exit 0 即 break）同样假执行。
5. 安装版捆绑确认：shell/package.json `"pnpm": "11.21.0"`（生产依赖）+
   `asarUnpack: node_modules/pnpm/**` → 安装版必然带 pnpm.cjs → SSID_PNPM 必然注入。

## 3. 修复（三处，同模式：.cjs 必须以 node 显式执行）

1. **dsh-plugin-center/src/update.ts**：`pnpmExecCommand(bundled)`——
   SSID_PNPM 以 .cjs/.mjs/.js 结尾时包成 `"<node>" "<pnpm.cjs>"`；
   node = `SSID_MCP_NODE`（SSiD 注入）→ 本进程 execPath（官方 dsh 是 node）→ PATH node。
   非脚本形态（pnpm.exe）原样使用。`pnpmCommandCandidates` 接入。
2. **seek-soul-in-darkness/shell/kernel.ts**：`applyPendingPluginUpdates` 候选
   SSID_PNPM 同规则包 node（kernel 在主进程，execPath 是 Electron，用
   SSID_MCP_NODE / PATH node）。
3. **seek-soul-in-darkness/shell/main.mjs**：`pnpmCandidates()` 同规则
   （NVM node → PATH node——该函数运行于 bootKernel 前，SSID_MCP_NODE 尚未注入）。

`SSID_PNPM` 注入值保持 pnpm.cjs 路径（语义不变），修复集中在消费端。

## 4. 验证（真实安装版 pnpm.cjs 端到端）

```text
修前  spawn(<pnpm.cjs> + args, shell:true)        → exit 0、版本不变、无输出（复现）
修后  spawn('"node" "<pnpm.cjs>"' + args, shell:true)              → exit 0、0.4.11→0.4.12 ✓
修后  spawnSync('"node" "<pnpm.cjs>"', [args], shell:true)（kernel 形态）→ exit 0、0.4.11→0.4.14 ✓
```

dsh-plugin-center typecheck/build 通过；shell typecheck 通过；main.mjs 语法检查通过。

## 5. 发布链 / 用户侧

- 修复并入 dsh-plugin-center **v0.2.13**（与禁用功能修复同版本，npm publish 前需
  pnpm build 重打 dist/update.js）；
- SSiD 侧 kernel/main 修复随下一次 SSiD 发布（shell 源码）；
- **已装用户临时解法（无需等发版）**：在 profile 目录手动执行
  `npx --yes pnpm@11 add -w dsh-better-sidebar@0.16.1`（npx 避免用户机器全局
  pnpm major 不一致；PATH 有 pnpm 11 也可直接 `pnpm add -w …`）。

## 6. 遗留观察

- v0.2.12 的「no-op 识破」报错是有价值的（结束假成功循环），保留；
- 之前 `SSID_PNPM` 生效期间所有「成功」更新均需复查（归档预制的版本即安装版
  自带版本，未受影响；8/24 19:21 前后的 add 走的是 PATH pnpm 真装，log 佐证
  时长 9-14s/133-171ms 与输出形态）。

## 7. 复现/取证命令（备忘）

```text
cmd /c "<pnpm.cjs 路径>" --version > out.txt    # exit 0 + out.txt 0 字节 = 假执行
node .verify-pnpm-exec.mjs（临时，已删）          # 修前/修后对照
```
