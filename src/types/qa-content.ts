/** 答案段落中的内联片段（无 HTML 字符串） */
export type RichSegment =
  | { type: 'text'; value: string }
  | { type: 'strong'; value: string }
  | { type: 'code'; value: string; highlight?: boolean }

/** RichAnswer：编程题章节仅对函数实现块启用高亮 */
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

export interface ChapterPayload {
  slug: string
  title: string
  documentTitle: string
  description: string
  lead: string
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
