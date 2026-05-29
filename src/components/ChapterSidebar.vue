<script setup lang="ts">
import { RouterLink } from 'vue-router'

import type { TocItem } from '@/data/chapters'
import { useChapterTocHighlight } from '@/composables/useChapterTocHighlight'

const props = defineProps<{
  slug: string
  toc: TocItem[]
}>()

const { isCurrentAnchor } = useChapterTocHighlight(props.slug)
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
