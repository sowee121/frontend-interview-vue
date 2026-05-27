import { createRouter, createWebHistory } from 'vue-router'

import { chaptersBySlug } from '@/data/chapters'
import HomeView from '@/views/HomeView.vue'

import { scrollBehavior } from './scrollBehavior'
import { setupRouterGuards } from './setupRouterGuards'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior,
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/chapters/:slug',
      name: 'chapter',
      component: () => import('@/views/ChapterPageView.vue'),
      beforeEnter: (to) => {
        const slug = String(to.params.slug ?? '')
        if (!chaptersBySlug[slug]) return { name: 'home' }
      },
    },
  ],
})

setupRouterGuards(router)

export default router
