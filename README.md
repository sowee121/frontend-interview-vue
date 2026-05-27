# 前端面试速记

[![Vue 3](https://img.shields.io/badge/Vue-3.5-42b883?logo=vuedotjs)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite)](https://vite.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![pnpm](https://img.shields.io/badge/pnpm-9+-F69220?logo=pnpm)](https://pnpm.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![Live Demo](https://img.shields.io/badge/demo-GitHub%20Pages-2ea44f)](https://sowee121.github.io/frontend-interview-vue/)

面向前端工程师的面试题库静态站点：11 个专题章节、结构化 JSON 答案、章内目录与代码高亮，支持桌面与手机浏览器复习。内容构建时打包进前端，**无需后端**。

**在线访问**：https://sowee121.github.io/frontend-interview-vue/

## 目录

- [功能特性](#功能特性)
- [技术栈](#技术栈)
- [快速开始](#快速开始)
- [常用脚本](#常用脚本)
- [项目结构](#项目结构)
- [贡献指南](#贡献指南)
- [部署说明](#部署说明)
- [许可证](#许可证)

## 功能特性

| 特性 | 说明 |
|------|------|
| 11 个专题 | JavaScript、TypeScript、HTML/CSS、浏览器、网络与安全、性能、工程化、React、Vue、场景题、编程手写题 |
| 章内目录 | 侧栏锚点，长文快速定位 |
| 结构化答案 | `src/data/qa/json/*.json` + `RichSegment`，避免手写 HTML |
| 代码高亮 | 编程题章节使用 highlight.js |
| History 路由 | `/chapters/:slug`，链接可分享、可刷新 |

## 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | Vue 3、Vue Router、Pinia |
| 构建 | Vite 8、TypeScript、`vue-tsc` |
| 样式 | Sass |
| 质量 | ESLint、Prettier、Oxlint |

## 快速开始

**环境**：Node.js `^20.19.0` 或 `>=22.12.0`，[pnpm](https://pnpm.io/) 9+

```sh
git clone https://github.com/sowee121/frontend-interview-vue.git
cd frontend-interview-vue
pnpm install
pnpm dev
```

本地开发默认根路径 [http://localhost:5173](http://localhost:5173)（与 GitHub Pages 子路径无关，便于日常改题）。

若要本地验证**与线上一致**的生产构建：

```sh
pnpm build
pnpm preview
```

预览地址一般为 `http://localhost:4173/frontend-interview-vue/`（以终端输出为准）。

## 常用脚本

| 命令 | 说明 |
|------|------|
| `pnpm dev` | 本地开发（HMR） |
| `pnpm build` | 类型检查 + 生产构建；`postbuild` 会生成 `dist/404.html`（Pages SPA 回退） |
| `pnpm preview` | 预览 `dist/` |
| `pnpm lint` | ESLint + Oxlint |
| `pnpm format` | Prettier 格式化 `src/` |

## 项目结构

```
frontend-interview-vue/
├── .github/workflows/deploy.yml   # GitHub Pages 自动部署
├── src/
│   ├── data/qa/json/            # 各章题目与答案（主要维护入口）
│   ├── data/qa/registry.ts      # 章节 JSON 注册
│   ├── data/constants.ts        # 章节顺序 CHAPTER_ORDER
│   ├── components/              # 答案渲染、侧栏、布局
│   ├── views/                   # 首页、章节页
│   └── router/                  # History 路由与锚点滚动
├── scripts/reorder-qa-chapters.mjs
└── dist/                        # 构建产物（已 gitignore，勿提交）
```

## 贡献指南

欢迎通过 Issue / PR 补充或订正题目。

1. Fork 本仓库，创建分支（如 `feat/add-vue-question`）。
2. 编辑 `src/data/qa/json/<slug>.json`（`slug` 见 [`src/data/constants.ts`](src/data/constants.ts)）。
3. `pnpm dev` 本地预览，`pnpm build` 确保通过。
4. 提交 PR，简要说明知识点与改动原因。

字段定义见 [`src/types/qa-content.ts`](src/types/qa-content.ts)（`QaItem`、`RichSegment` 等）。

批量重排章节内题目顺序：

```sh
node scripts/reorder-qa-chapters.mjs
```

**维护建议**：答案宜「短问短答、可验证」；代码示例优先最小可复现片段。仅改单题文案时无需改 README；增删章节或调整 `CHAPTER_ORDER` 时请同步更新上文「功能特性」与「项目结构」。

## 部署说明

### GitHub Pages（当前方案）

| 项 | 说明 |
|----|------|
| 访问地址 | https://sowee121.github.io/frontend-interview-vue/ |
| 触发方式 | 推送到 `main` 分支，由 [deploy.yml](.github/workflows/deploy.yml) 自动构建部署 |
| 仓库设置 | Settings → Pages → Source 选择 **GitHub Actions** |
| 子路径 | 生产构建 `base` 为 `/frontend-interview-vue/`（见 [`vite.config.ts`](vite.config.ts)） |
| History 回退 | `pnpm build` 后 `postbuild` 复制 `index.html` → `404.html`，支持深链刷新 |

> 分享根地址时，GitHub 可能将无末尾 `/` 的 URL 重定向到带 `/` 的形式，属托管平台默认行为，不影响使用。

### 其他静态托管

产物目录为 `dist/`，亦可部署到 Cloudflare Pages、Vercel 等。需满足：

- 构建命令：`pnpm install && pnpm build`
- 输出目录：`dist`
- History 模式：未知路径回退到 `index.html`（或等效 SPA 规则）
- 若部署在子路径，需同步修改 Vite `base` 与路由 `import.meta.env.BASE_URL`

## 相关链接

- [Vue 3](https://vuejs.org/) · [Vite](https://vite.dev/) · [Vue Router](https://router.vuejs.org/)
- 推荐 IDE：[VS Code](https://code.visualstudio.com/) + [Vue - Official (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.volar)

## 许可证

本项目采用 [MIT License](./LICENSE) 开源。若对你有帮助，欢迎 Star 或提交 PR。
