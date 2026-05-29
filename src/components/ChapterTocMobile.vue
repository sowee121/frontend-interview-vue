<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

import type { TocItem } from '@/data/chapters'
import { useChapterTocHighlight } from '@/composables/useChapterTocHighlight'

const props = defineProps<{
  slug: string
  toc: TocItem[]
}>()

const route = useRoute()
const isOpen = ref(false)

const { isCurrentAnchor } = useChapterTocHighlight(props.slug)

function closeSheet() {
  isOpen.value = false
}

function toggleSheet() {
  isOpen.value = !isOpen.value
}

function onTocNavigate(navigate: () => void) {
  navigate()
  closeSheet()
}

function onEscape(e: KeyboardEvent) {
  if (e.key === 'Escape' && isOpen.value) closeSheet()
}

watch(isOpen, (open) => {
  document.body.style.overflow = open ? 'hidden' : ''
})

watch(
  () => route.hash,
  () => {
    if (isOpen.value) closeSheet()
  },
)

watch(
  () => props.slug,
  () => {
    closeSheet()
  },
)

onMounted(() => {
  window.addEventListener('keydown', onEscape)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onEscape)
  document.body.style.overflow = ''
})
</script>

<template>
  <div class="toc-mobile">
    <Transition name="toc-backdrop">
      <div
        v-if="isOpen"
        class="toc-backdrop"
        aria-hidden="true"
        @click="closeSheet"
      />
    </Transition>

    <Transition name="toc-sheet">
      <div
        v-if="isOpen"
        class="toc-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="toc-sheet-title"
      >
        <p id="toc-sheet-title" class="toc-sheet__title">本章跳转</p>
        <ul class="toc-list toc-list--sheet">
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
                @click="onTocNavigate(navigate)"
              >
                {{ item.label }}
              </a>
            </RouterLink>
          </li>
        </ul>
      </div>
      </Transition>

    <button
      type="button"
      class="toc-fab"
      :class="{ 'toc-fab--open': isOpen }"
      :aria-expanded="isOpen"
      :aria-label="isOpen ? '关闭本章目录' : '打开本章目录'"
      @click="toggleSheet"
    >
      <span class="toc-fab__icon" aria-hidden="true">
        <span class="toc-fab__bar" />
        <span class="toc-fab__bar" />
        <span class="toc-fab__bar" />
      </span>
    </button>
  </div>
</template>
