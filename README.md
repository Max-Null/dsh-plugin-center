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

## Install / 安装

```sh
dsh plugin --profile web add github:Max-Null/dsh-plugin-center
# or, once published to npm / 或通过 npm（发布后）
dsh plugin --profile web add @max-null/dsh-plugin-center
```

Restart `dsh web`, then open the plugin center from the header button (top-right) or the Settings → 插件中心 section.

## Development / 开发

```sh
pnpm install
pnpm build   # tsc (host) + esbuild (browser bundle)
```

## License / 许可

[MIT](./LICENSE)
