<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const visible = ref(false)

let resizeObserver: ResizeObserver | null = null

/** 滚动条从顶到底的可滚行程（px） */
function maxScrollY() {
  const root = document.documentElement
  return Math.max(0, root.scrollHeight - root.clientHeight)
}

/** 从零算起，滚过可滚行程的 1/3 后显示 */
function scrollThreshold() {
  return Math.round(maxScrollY() / 3)
}

function updateVisible() {
  const max = maxScrollY()
  if (max <= 0) {
    visible.value = false
    return
  }
  visible.value = window.scrollY > scrollThreshold()
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  window.addEventListener('scroll', updateVisible, { passive: true })
  window.addEventListener('resize', updateVisible, { passive: true })
  resizeObserver = new ResizeObserver(updateVisible)
  resizeObserver.observe(document.documentElement)
  updateVisible()
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateVisible)
  window.removeEventListener('resize', updateVisible)
  resizeObserver?.disconnect()
  resizeObserver = null
})
</script>

<template>
  <Transition name="scroll-top-fab">
    <button
      v-show="visible"
      type="button"
      class="scroll-top-fab"
      aria-label="回到顶部"
      @click="scrollToTop"
    >
      <span class="scroll-top-fab__icon" aria-hidden="true">
        <span class="scroll-top-fab__bar scroll-top-fab__bar--left" />
        <span class="scroll-top-fab__bar scroll-top-fab__bar--right" />
        <span class="scroll-top-fab__bar scroll-top-fab__bar--stem" />
      </span>
    </button>
  </Transition>
</template>
