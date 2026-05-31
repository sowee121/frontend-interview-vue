<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

import type { TocItem } from '@/data/chapters'

const props = defineProps<{
  slug: string
  toc: TocItem[]
  highlightId?: string | null
}>()

const route = useRoute()

const activeId = computed(() => {
  if (route.name !== 'chapter') return null
  if (String(route.params.slug ?? '') !== props.slug) return null
  return props.highlightId ?? null
})
</script>

<template>
  <aside class="sidebar sidebar--desktop">
    <p class="sidebar__title">本章跳转</p>
    <ul class="toc-list">
      <li v-for="item in toc" :key="item.id">
        <RouterLink
          v-slot="{ href, navigate }"
          custom
          :to="{
            name: 'chapter',
            params: { slug },
            hash: '#' + item.id,
          }"
        >
          <a
            :href="href"
            class="toc-link"
            :class="{ 'toc-link--current': activeId === item.id }"
            :aria-current="activeId === item.id ? 'location' : undefined"
            @click="navigate"
          >
            {{ item.label }}
          </a>
        </RouterLink>
      </li>
    </ul>
  </aside>
</template>
