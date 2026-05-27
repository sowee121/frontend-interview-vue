<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, useTemplateRef, watch } from 'vue'
import { useRoute } from 'vue-router'

import { chapters } from '@/data/chapters'

const route = useRoute()
const trackEl = useTemplateRef<HTMLElement>('trackEl')

function scrollActiveIntoView(behavior: ScrollBehavior = 'smooth') {
  const track = trackEl.value
  if (!track) return
  const active = track.querySelector<HTMLElement>('.router-link-active')
  active?.scrollIntoView({ inline: 'center', block: 'nearest', behavior })
}

function updateScrollHints() {
  const track = trackEl.value
  const nav = track?.parentElement
  if (!track || !nav) return
  const overflow = track.scrollWidth > track.clientWidth + 1
  const atStart = track.scrollLeft <= 1
  const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 1
  nav.classList.toggle('site-header-quick--fade-start', overflow && !atStart)
  nav.classList.toggle('site-header-quick--fade-end', overflow && !atEnd)
}

let ro: ResizeObserver | null = null

onMounted(() => {
  nextTick(() => {
    scrollActiveIntoView('instant')
    updateScrollHints()
  })
  const track = trackEl.value
  track?.addEventListener('scroll', updateScrollHints, { passive: true })
  if (track && typeof ResizeObserver !== 'undefined') {
    ro = new ResizeObserver(() => updateScrollHints())
    ro.observe(track)
  }
  window.addEventListener('resize', updateScrollHints)
})

onUnmounted(() => {
  const track = trackEl.value
  track?.removeEventListener('scroll', updateScrollHints)
  ro?.disconnect()
  ro = null
  window.removeEventListener('resize', updateScrollHints)
})

watch(
  () => [route.name, route.params.slug] as const,
  () => {
    nextTick(() => {
      scrollActiveIntoView('smooth')
      updateScrollHints()
    })
  },
)
</script>

<template>
  <nav class="site-header-quick" aria-label="章节导航">
    <div ref="trackEl" class="site-header-quick__track">
      <RouterLink
        v-for="ch in chapters"
        :key="ch.slug"
        class="site-header-quick__link"
        :to="{ name: 'chapter', params: { slug: ch.slug } }"
      >
        {{ ch.title }}
      </RouterLink>
    </div>
  </nav>
</template>
