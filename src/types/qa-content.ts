/** 答案段落中的内联片段（无 HTML 字符串） */
export type RichSegment =
  | { type: 'text'; value: string }
  | { type: 'strong'; value: string }
  | { type: 'code'; value: string; highlight?: boolean }

/** RichAnswer：coding / electron 章对「单段纯 code」启用块级高亮 */
export type SyntaxHighlightMode = 'off' | 'coding-functions'

export interface QaItem {
  id: string
  /** 侧栏目录文案 */
  navLabel: string
  /** 题目标题（主行） */
  question: string
  /** 题面补充说明（次行，小号浅色）；可选 */
  questionNote?: string
  /** 多段 <p>，每段由若干内联片段顺序拼接 */
  answer: RichSegment[][]
}

/** 章节导语中的外链（可选） */
export interface ChapterLeadLink {
  href: string
  label: string
}

export interface ChapterPayload {
  slug: string
  title: string
  documentTitle: string
  description: string
  lead: string
  /** 导语末尾可点击链接，如对照阮一峰 ES6 教程 */
  leadLink?: ChapterLeadLink
  items: QaItem[]
}

export interface TocItem {
  id: string
  label: string
}

export interface ChapterDef {
  slug: string
  title: string
  documentTitle: string
  description: string
  toc: TocItem[]
}
