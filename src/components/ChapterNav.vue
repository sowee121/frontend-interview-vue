<script setup lang="ts">
import type { ChapterDef } from '@/data/chapters'

defineProps<{
  prev?: ChapterDef
  next?: ChapterDef
}>()
</script>

<template>
  <nav class="site-header-chapter" aria-label="章节导航">
    <span class="site-header-chapter__label">章节</span>
    <RouterLink
      v-if="prev"
      :to="{ name: 'chapter', params: { slug: prev.slug } }"
    >
      ← {{ prev.title }}
    </RouterLink>
    <span v-else class="nav-muted">First</span>
    <span class="site-header-chapter__sep" aria-hidden="true">·</span>
    <RouterLink
      v-if="next"
      :to="{ name: 'chapter', params: { slug: next.slug } }"
    >
      {{ next.title }} →
    </RouterLink>
    <span v-else class="nav-muted">Last</span>
  </nav>
</template>
