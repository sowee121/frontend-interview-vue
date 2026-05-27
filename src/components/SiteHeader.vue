<script setup lang="ts">
import { computed, onMounted, onUnmounted, useSlots, useTemplateRef } from 'vue'
import { storeToRefs } from 'pinia'

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

const slots = useSlots()
const hasNavExtra = computed(() => {
  const render = slots['nav-extra']
  if (!render) return false
  const nodes = render()
  return Array.isArray(nodes) && nodes.length > 0
})

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
        <div v-if="hasNavExtra" class="site-header-slot">
          <slot name="nav-extra" />
        </div>
        <nav class="site-header-quick" aria-label="快捷入口">
          <RouterLink class="site-header-quick__link" :to="{ name: 'home' }">首页</RouterLink>
          <RouterLink
            class="site-header-quick__link"
            :to="{ name: 'chapter', params: { slug: 'javascript' } }"
          >
            JavaScript
          </RouterLink>
          <RouterLink
            class="site-header-quick__link"
            :to="{ name: 'chapter', params: { slug: 'react' } }"
          >
            React
          </RouterLink>
          <RouterLink
            class="site-header-quick__link"
            :to="{ name: 'chapter', params: { slug: 'vue' } }"
          >
            Vue
          </RouterLink>
        </nav>
      </div>
    </div>
  </header>
</template>
