# 前端面试速记

[![Vue 3](https://img.shields.io/badge/Vue-3.5-42b883?logo=vuedotjs)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite)](https://vite.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![pnpm](https://img.shields.io/badge/pnpm-9+-F69220?logo=pnpm)](https://pnpm.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)

面向前端工程师的面试题库静态站点：按专题章节组织高频面试题与精炼参考答案，支持章内目录跳转与编程题代码高亮，适合在桌面或手机浏览器中随时复习。内容以 JSON 维护（`RichSegment` 结构化片段），构建时打包进前端，**无需后端服务**。

## 目录

- [在线预览](#在线预览)
- [功能特性](#功能特性)
- [技术栈](#技术栈)
- [快速开始](#快速开始)
- [常用脚本](#常用脚本)
- [项目结构](#项目结构)
- [如何贡献](#如何贡献)
- [部署](#部署)
- [维护清单](#维护清单)
- [相关链接](#相关链接)
- [许可证](#许可证)

## 在线预览

- Demo（待补充）：`<your-demo-url>`

建议使用 Cloudflare Pages / Vercel（开箱即用支持 History 路由回退）。如果使用 GitHub Pages，需要额外处理 SPA 404 回退（见下方“部署”）。

## 功能特性

| 特性 | 说明 |
|------|------|
| 11 个专题章节 | JavaScript、TypeScript、HTML/CSS、浏览器、网络与安全、性能、工程化、React、Vue、场景题、编程手写题 |
| 章内目录 | 侧栏锚点，长文快速定位 |
| 结构化答案 | `src/data/qa/json/*.json`，避免手写 HTML 碎片 |
| 代码高亮 | 编程章使用 highlight.js |
| History 路由 | `/chapters/:slug`，URL 简洁可分享 |

## 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | Vue 3、Vue Router、Pinia |
| 构建 | Vite 8、TypeScript、`vue-tsc` |
| 样式 | Sass |
| 质量 | ESLint、Prettier、Oxlint |

## 快速开始

**环境要求**：Node.js `^20.19.0` 或 `>=22.12.0`，[pnpm](https://pnpm.io/) 9+

```sh
git clone https://github.com/sowee121/frontend-interview-vue.git
cd frontend-interview-vue
pnpm install
pnpm dev
```

浏览器访问 [http://localhost:5173](http://localhost:5173)。

## 常用脚本

| 命令 | 说明 |
|------|------|
| `pnpm dev` | 本地开发（HMR） |
| `pnpm build` | 类型检查 + 生产构建，产物在 `dist/` |
| `pnpm preview` | 本地预览构建结果 |
| `pnpm lint` | ESLint + Oxlint 检查并尝试自动修复 |
| `pnpm format` | Prettier 格式化 `src/` |

## 项目结构

```
frontend-interview-vue/
├── src/
│   ├── data/qa/json/       # 各章题目与答案（主要维护入口）
│   ├── data/qa/registry.ts # 章节 JSON 注册
│   ├── data/constants.ts   # 章节顺序 CHAPTER_ORDER
│   ├── components/         # 答案渲染、侧栏、布局等
│   ├── views/              # 首页、章节页
│   └── router/             # 路由与锚点滚动
├── scripts/
│   └── reorder-qa-chapters.mjs  # 按配置重排各章题目顺序
└── dist/                   # pnpm build 输出（勿提交，见 .gitignore）
```

## 如何贡献

1. Fork 本仓库并创建分支（如 `feat/add-vue-question`）。
2. 编辑对应章节：`src/data/qa/json/<slug>.json`（`slug` 见 `src/data/constants.ts`）。
3. 本地运行 `pnpm dev` 预览，确保 `pnpm build` 通过。
4. 提交 Pull Request，简要说明新增/修改的知识点与原因（为何更常考、更准确、更易懂）。

题目字段说明见 [`src/types/qa-content.ts`](src/types/qa-content.ts)（`QaItem`、`RichSegment` 等）。

批量调整章节内题目顺序（会按配置重排各章 `items`）：

```sh
node scripts/reorder-qa-chapters.mjs
```

## 部署

构建产物目录为 **`dist/`**，可部署到任意支持静态文件托管的平台。

| 平台 | 构建命令 | 输出目录 | 备注 |
|------|----------|----------|------|
| Cloudflare Pages / Vercel | `pnpm install && pnpm build` | `dist` | 推荐；History 路由回退通常开箱即用 |
| GitHub Pages | 同上（建议 GitHub Actions） | `dist` | 需处理 SPA 404（如 `404.html` 回退） |

项目使用 Vue Router **History** 模式，托管侧需将未知路径回退到 `index.html`。

## 维护清单

- **发布/迁移时**：
  - [ ] 在「在线预览」处填写实际 Demo 地址
  - [ ] 确认未提交 `dist/`、`node_modules/`、`.env*` 等构建产物或敏感文件
  - [ ] 若新增章节/调整顺序：同步更新 `src/data/constants.ts` 与相关说明
- **日常维护**：
  - [ ] 新增题目尽量保持“短问短答 + 可验证”的风格，避免泛泛而谈
  - [ ] 涉及代码示例：优先给出可运行/可复现的最小片段

## 文档维护

发生以下变更时，请同步更新本 README：

| 变更类型 | 需更新的章节 |
|----------|--------------|
| 增删章节、`CHAPTER_ORDER` | 功能特性、项目结构 |
| 修改 `package.json` 的 scripts / engines | 快速开始、常用脚本 |
| 更换部署平台或构建方式 | 部署 |
| 修改站点名称（`src/config/site.ts`） | 标题、简介 |

仅修改某道题的文案时，一般无需改 README。

## 相关链接

- [Vue 3](https://vuejs.org/) · [Vite](https://vite.dev/) · [Vue Router](https://router.vuejs.org/)
- 推荐 IDE：[VS Code](https://code.visualstudio.com/) + [Vue - Official (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.volar)

## 许可证

本项目采用 [MIT License](./LICENSE) 开源。

如果本项目对你有帮助，欢迎 Star 或提交 PR 补充题目。
