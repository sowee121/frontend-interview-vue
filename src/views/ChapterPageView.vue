<script setup lang="ts">
import { watch } from 'vue'

import ArticleShell from '@/components/ArticleShell.vue'
import ChapterArticle from '@/components/ChapterArticle.vue'
import ChapterLayout from '@/components/ChapterLayout.vue'
import ChapterSidebar from '@/components/ChapterSidebar.vue'
import ChapterTocMobile from '@/components/ChapterTocMobile.vue'
import SiteFooter from '@/components/SiteFooter.vue'
import SiteHeader from '@/components/SiteHeader.vue'
import { useChapterFromRoute } from '@/composables/useChapterFromRoute'
import { useAppStore } from '@/stores/app'

const { chapter, payload } = useChapterFromRoute()
const app = useAppStore()

watch(
  () => chapter.value?.slug,
  (s) => {
    if (s) app.recordChapterVisit(s)
  },
  { immediate: true },
)
</script>

<template>
  <template v-if="chapter && payload">
    <SiteHeader />

    <ChapterLayout>
      <template #sidebar>
        <ChapterSidebar :slug="chapter.slug" :toc="chapter.toc" />
      </template>

      <RouterLink class="layout__back-link" :to="{ name: 'home' }">← 返回目录</RouterLink>
      <ArticleShell>
        <ChapterArticle :payload="payload" />
      </ArticleShell>
    </ChapterLayout>

    <ChapterTocMobile :slug="chapter.slug" :toc="chapter.toc" />

    <SiteFooter />
  </template>
</template>
