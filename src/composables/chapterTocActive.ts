import type { InjectionKey, Ref } from 'vue'

/** 章节页侧栏 / 移动 TOC 共用的当前锚点 id（由滚动 spy 更新） */
export const chapterActiveTocIdKey: InjectionKey<Ref<string | null>> = Symbol('chapterActiveTocId')
