import { inject, type Ref } from 'vue'
import { useRoute } from 'vue-router'

import { chapterActiveTocIdKey } from '@/composables/chapterTocActive'

/** 侧栏 / 移动 TOC：滚动 spy 优先，无 spy 时回退到地址 hash */
export function useChapterTocHighlight(slug: string) {
  const route = useRoute()
  const activeTocId = inject(chapterActiveTocIdKey, null)

  function isCurrentAnchor(id: string): boolean {
    if (route.name !== 'chapter') return false
    if (String(route.params.slug ?? '') !== slug) return false
    if (activeTocId?.value) return activeTocId.value === id
    return route.hash === `#${id}`
  }

  return { isCurrentAnchor, activeTocId: activeTocId as Ref<string | null> | null }
}
