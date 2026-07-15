export const CHAPTER_ORDER = [
  'html-css',
  'javascript',
  'es6',
  'typescript',
  'vue2',
  'vue3',
  'react',
  'node',
  'miniprogram',
  'electron',
  'browser',
  'network',
  'engineering',
  'performance',
  'scenario',
  'ai',
  'agent',
  'coding',
] as const

export type ChapterSlug = (typeof CHAPTER_ORDER)[number]
