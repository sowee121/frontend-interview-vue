import { computed } from 'vue'
import { useRoute } from 'vue-router'

import { CHAPTER_ORDER, type ChapterSlug } from '@/data/constants'
import { chaptersBySlug, getChapterNeighbors } from '@/data/chapters'
import { chapterPayloads } from '@/data/qa/registry'
import type { ChapterDef, ChapterPayload } from '@/types/qa-content'

export function useChapterFromRoute() {
  const route = useRoute()
  const slug = computed(() => String(route.params.slug ?? ''))
  const chapter = computed<ChapterDef | undefined>(() => chaptersBySlug[slug.value])
  const prev = computed(() => getChapterNeighbors(slug.value).prev)
  const next = computed(() => getChapterNeighbors(slug.value).next)

  const payload = computed<ChapterPayload | undefined>(() => {
    const s = slug.value
    if (!(CHAPTER_ORDER as readonly string[]).includes(s)) return undefined
    return chapterPayloads[s as ChapterSlug]
  })

  return { slug, chapter, prev, next, payload }
}
