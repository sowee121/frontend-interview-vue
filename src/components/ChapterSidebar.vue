<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router'

import type { TocItem } from '@/data/chapters'

const props = defineProps<{
  slug: string
  toc: TocItem[]
}>()

const route = useRoute()

/** 同章节下仅当地址 hash 与该项一致时为「当前锚点」 */
function isCurrentAnchor(id: string) {
  if (route.name !== 'chapter') return false
  if (String(route.params.slug ?? '') !== props.slug) return false
  return route.hash === `#${id}`
}
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
            :class="{ 'toc-link--current': isCurrentAnchor(item.id) }"
            :aria-current="isCurrentAnchor(item.id) ? 'location' : undefined"
            @click="navigate"
          >
            {{ item.label }}
          </a>
        </RouterLink>
      </li>
    </ul>
  </aside>
</template>
