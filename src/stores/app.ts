import { defineStore } from 'pinia'
import { ref } from 'vue'

import { SITE_NAME } from '@/config/site'

/** 跨页面公共状态：站点名、最近阅读的章节（可扩展主题等） */
export const useAppStore = defineStore('app', () => {
  const siteTitle = ref(SITE_NAME)
  const lastVisitedChapterSlug = ref<string | null>(null)

  function recordChapterVisit(slug: string) {
    lastVisitedChapterSlug.value = slug
  }

  return { siteTitle, lastVisitedChapterSlug, recordChapterVisit }
})
