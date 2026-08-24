# dsh-plugin-center

Plugin center for [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) (`dsh`) — browse, install, and update community plugins from inside the Web UI.

插件管理中心：在 DSH Web 界面里管理已安装插件、浏览社区市场、一键安装与更新。

## Features / 功能

- **Installed plugins / 已安装插件** — metadata with provenance (official / user-installed / local / builtin), categories, and DSH compatibility range.
- **Community market / 社区市场** — browse [awesome-dsh-plugin](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin) and [Oh-My-DSH](https://github.com/like-study1/Oh-My-DSH) by category, with stars and npm versions.
- **One-click install & update / 一键安装与更新** — install from the market, detect updates, update one or all.
- **What's New / 更新提示** — startup dialog listing plugins with new versions since you last looked.
- **DSH compatibility / 兼容性检查** — flags plugins whose peer range does not match the running DSH.
- **Skin-compatible / 皮肤兼容** — every color uses `var(--dsw-*)` tokens, so skin plugins restyle this UI too.

## Part of the SSID family / SSID 系列成员

This plugin belongs to the **`@max-null/*` family** — a set of plugins that together form the **[SSID (思灵 · Seek Soul in Darkness)](https://github.com/Max-Null/seek-soul-in-darkness)** desktop experience. SSID is the box that bundles them all: `dsh-capture` · `dsh-chat-rail` · `dsh-chinese-thinking` · `dsh-draft-polish` · `dsh-guardian` · `dsh-habit` · `dsh-header-unify` · `dsh-memory` · `dsh-node-appearance` · `dsh-plugin-center` · `dsh-skill-mcp-center` · `dsh-ssid-panels` · `dsh-ssid-zh-ui`.

本插件属于 **`@max-null/*` 插件系列**——这一系列共同构成 **[SSID（思灵 · Seek Soul in Darkness）](https://github.com/Max-Null/seek-soul-in-darkness)** 桌面体验。SSID 是整合它们的盒：`dsh-capture` · `dsh-chat-rail` · `dsh-chinese-thinking` · `dsh-draft-polish` · `dsh-guardian` · `dsh-habit` · `dsh-header-unify` · `dsh-memory` · `dsh-node-appearance` · `dsh-plugin-center` · `dsh-skill-mcp-center` · `dsh-ssid-panels` · `dsh-ssid-zh-ui`。

## Screenshots / 截图

| Installed / 已安装 | Market / 市场 | Updates / 更新 |
| :---: | :---: | :---: |
| ![已安装插件](assets/screenshot-installed.png) | ![社区市场](assets/screenshot-market.png) | ![更新检测](assets/screenshot-updates.png) |

## Install / 安装

```sh
dsh plugin --profile web add @max-null/dsh-plugin-center
# or from the GitHub source / 或从 GitHub 源码安装
dsh plugin --profile web add github:Max-Null/dsh-plugin-center
```

Restart `dsh web`, then open the plugin center from the header button (top-right) or the Settings → 插件中心 section.

## Development / 开发

```sh
pnpm install
pnpm build   # tsc (host) + esbuild (browser bundle)
```

## License / 许可

[MIT](./LICENSE)
