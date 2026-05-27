<script setup lang="ts">
import { onMounted, onUnmounted, useTemplateRef } from 'vue'
import { storeToRefs } from 'pinia'

import HeaderChapterTabs from '@/components/HeaderChapterTabs.vue'
import { useAppStore } from '@/stores/app'

const app = useAppStore()
const { siteTitle } = storeToRefs(app)

const HEADER_ANCHOR_GAP = 12

const headerRoot = useTemplateRef<HTMLElement>('headerRoot')

function publishHeaderMetrics() {
  const el = headerRoot.value
  if (!el) return
  const h = Math.ceil(el.getBoundingClientRect().height)
  document.documentElement.style.setProperty('--sticky-header-height', `${h}px`)
  document.documentElement.style.setProperty(
    '--anchor-scroll-margin',
    `${h + HEADER_ANCHOR_GAP}px`,
  )
}

let ro: ResizeObserver | null = null

onMounted(() => {
  publishHeaderMetrics()
  const el = headerRoot.value
  if (el && typeof ResizeObserver !== 'undefined') {
    ro = new ResizeObserver(() => publishHeaderMetrics())
    ro.observe(el)
  }
  window.addEventListener('resize', publishHeaderMetrics)
})

onUnmounted(() => {
  ro?.disconnect()
  ro = null
  window.removeEventListener('resize', publishHeaderMetrics)
})
</script>

<template>
  <header ref="headerRoot" class="site-header">
    <div class="site-header-inner">
      <div class="site-title">
        <RouterLink :to="{ name: 'home' }">{{ siteTitle }}</RouterLink>
      </div>
      <div class="site-header-right">
        <HeaderChapterTabs />
      </div>
    </div>
  </header>
</template>
