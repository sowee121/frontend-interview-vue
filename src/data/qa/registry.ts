import type { ChapterPayload } from '@/types/qa-content'
import type { ChapterSlug } from '@/data/constants'

import agent from './json/agent.json'
import browser from './json/browser.json'
import coding from './json/coding.json'
import engineering from './json/engineering.json'
import htmlCss from './json/html-css.json'
import es6 from './json/es6.json'
import javascript from './json/javascript.json'
import network from './json/network.json'
import node from './json/node.json'
import performance from './json/performance.json'
import react from './json/react.json'
import miniprogram from './json/miniprogram.json'
import scenario from './json/scenario.json'
import typescript from './json/typescript.json'
import vue2 from './json/vue2.json'
import vue3 from './json/vue3.json'

/** 各章正文与题目：直接维护同目录 json；import 进包，勿手写 HTML 片段 */
export const chapterPayloads: Record<ChapterSlug, ChapterPayload> = {
  javascript: javascript as ChapterPayload,
  es6: es6 as ChapterPayload,
  coding: coding as ChapterPayload,
  typescript: typescript as ChapterPayload,
  'html-css': htmlCss as ChapterPayload,
  browser: browser as ChapterPayload,
  network: network as ChapterPayload,
  node: node as ChapterPayload,
  performance: performance as ChapterPayload,
  engineering: engineering as ChapterPayload,
  react: react as ChapterPayload,
  miniprogram: miniprogram as ChapterPayload,
  vue2: vue2 as ChapterPayload,
  vue3: vue3 as ChapterPayload,
  scenario: scenario as ChapterPayload,
  agent: agent as ChapterPayload,
}
