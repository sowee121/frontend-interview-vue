<script setup lang="ts">
import type { ChapterDef } from '@/data/chapters'

defineProps<{
  chapter: ChapterDef
}>()
</script>

<template>
  <RouterLink
    class="chapter-card"
    :to="{ name: 'chapter', params: { slug: chapter.slug } }"
  >
    <h2 class="chapter-card__title">{{ chapter.title }}</h2>
    <p class="chapter-card__desc">{{ chapter.description }}</p>
  </RouterLink>
</template>
