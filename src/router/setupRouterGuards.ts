import type { Router } from 'vue-router'

import { SITE_NAME } from '@/config/site'
import { chaptersBySlug } from '@/data/chapters'

export function setupRouterGuards(router: Router) {
  router.beforeEach((to) => {
    if (!to.hash && (to.name === 'home' || to.name === 'chapter')) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    }
  })

  router.afterEach((to) => {
    if (to.name === 'chapter') {
      const slug = String(to.params.slug ?? '')
      const ch = chaptersBySlug[slug]
      document.title = ch ? `${ch.documentTitle} · ${SITE_NAME}` : SITE_NAME
      return
    }
    if (to.name === 'home') {
      document.title = `目录 · ${SITE_NAME}`
    }
  })
}
