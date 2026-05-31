import { computed, nextTick, onMounted, onUnmounted, ref, watch, type Ref } from 'vue'
import { useRoute } from 'vue-router'

import { readAnchorScrollMarginPx } from '@/utils/anchorOffset'

const SCROLL_IDLE_MS = 120

type SectionRef = { id: string; el: HTMLElement }

function resolveActiveSectionId(
  sections: SectionRef[],
  headerOffset: number,
): string | null {
  if (!sections.length) return null

  const ids = sections.map((s) => s.id)
  const doc = document.documentElement
  const nearBottom = window.innerHeight + window.scrollY >= doc.scrollHeight - 48
  if (nearBottom) return ids[ids.length - 1]!

  const line = headerOffset + 12
  let current: string | null = null
  for (const { id, el } of sections) {
    if (el.getBoundingClientRect().top <= line) current = id
  }
  // 仍在章节标题/导语区、尚无题目越过基准线时不默认高亮第一项
  return current
}

/** 单一高亮 id：无滚动命中时不亮；滚动与 hash 不一致时以滚动为准 */
export function resolveChapterTocHighlightId(
  hash: string,
  scrollActiveId: string | null | undefined,
  tocIds: readonly string[],
): string | null {
  const idSet = new Set(tocIds)
  const hashId = hash ? decodeURIComponent(hash.replace(/^#/, '')) : ''
  const scrollId = scrollActiveId ?? null

  if (!scrollId) return null
  if (hashId && scrollId !== hashId && idSet.has(scrollId)) return scrollId
  if (hashId && idSet.has(hashId)) return hashId
  if (idSet.has(scrollId)) return scrollId
  return null
}

function afterLayoutPaint(cb: () => void) {
  requestAnimationFrame(() => {
    requestAnimationFrame(cb)
  })
}

/** 停滚后同步地址栏 hash；id 为空时清除锚点 */
function syncUrlHash(id: string | null) {
  const base = `${window.location.pathname}${window.location.search}`
  if (!id) {
    if (window.location.hash) history.replaceState(history.state, '', base)
    return
  }
  const nextHash = `#${id}`
  if (window.location.hash === nextHash) return
  history.replaceState(history.state, '', `${base}${nextHash}`)
}

/** 滚动正文时推算当前 TOC 项；停滚后静默同步地址栏 hash。 */
export function useChapterTocScroll(getSectionIds: () => string[]): {
  highlightId: Ref<string | null>
} {
  const route = useRoute()
  const scrollActiveId = ref<string | null>(null)
  let sections: SectionRef[] = []
  let raf = 0
  let navLockTargetId: string | null = null
  let scrollIdleTimer: ReturnType<typeof setTimeout> | undefined
  let resizeObserver: ResizeObserver | null = null
  const supportsScrollEnd = typeof window !== 'undefined' && 'onscrollend' in window

  function bindSections() {
    sections = getSectionIds()
      .map((id) => {
        const el = document.getElementById(id)
        return el ? { id, el } : null
      })
      .filter((s): s is SectionRef => s !== null)
  }

  function update() {
    if (navLockTargetId) return
    if (!sections.length) bindSections()
    const ids = getSectionIds()
    if (!ids.length) {
      scrollActiveId.value = null
      return
    }
    if (sections.length !== ids.length) bindSections()
    const next = resolveActiveSectionId(sections, readAnchorScrollMarginPx())
    if (scrollActiveId.value !== next) scrollActiveId.value = next
  }

  function scheduleUpdate() {
    cancelAnimationFrame(raf)
    raf = requestAnimationFrame(update)
  }

  function unlockNavLock() {
    if (!navLockTargetId) return
    navLockTargetId = null
    update()
  }

  /** 滚动稳定：更新高亮，必要时替换地址栏锚点 */
  function onScrollSettled() {
    if (navLockTargetId) unlockNavLock()
    else update()
    syncUrlHash(scrollActiveId.value)
  }

  function bumpScrollIdle() {
    if (scrollIdleTimer) clearTimeout(scrollIdleTimer)
    scrollIdleTimer = setTimeout(() => {
      scrollIdleTimer = undefined
      onScrollSettled()
    }, SCROLL_IDLE_MS)
  }

  function onScroll() {
    if (navLockTargetId) {
      if (!supportsScrollEnd) bumpScrollIdle()
      return
    }
    scheduleUpdate()
    if (!supportsScrollEnd) bumpScrollIdle()
  }

  function onScrollEnd() {
    onScrollSettled()
  }

  function resetNavLock() {
    navLockTargetId = null
    if (scrollIdleTimer) {
      clearTimeout(scrollIdleTimer)
      scrollIdleTimer = undefined
    }
  }

  function rebind() {
    scrollActiveId.value = null
    resetNavLock()
    sections = []
    nextTick(() => {
      afterLayoutPaint(() => {
        bindSections()
        update()
      })
    })
  }

  watch(
    () => [String(route.params.slug ?? ''), getSectionIds().join('|')].join('::'),
    rebind,
    { immediate: true },
  )

  watch(
    () => route.hash,
    (hash) => {
      if (route.name !== 'chapter' || !hash) return
      const id = decodeURIComponent(hash.replace(/^#/, ''))
      if (!getSectionIds().includes(id)) return
      scrollActiveId.value = id
      navLockTargetId = id
    },
    { immediate: true },
  )

  const highlightId = computed(() =>
    resolveChapterTocHighlightId(route.hash, scrollActiveId.value, getSectionIds()),
  )

  onMounted(() => {
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', scheduleUpdate, { passive: true })
    if (supportsScrollEnd) {
      window.addEventListener('scrollend', onScrollEnd, { passive: true })
    }
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(scheduleUpdate)
      resizeObserver.observe(document.documentElement)
    }
    nextTick(() => afterLayoutPaint(update))
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('resize', scheduleUpdate)
    if (supportsScrollEnd) {
      window.removeEventListener('scrollend', onScrollEnd)
    }
    resizeObserver?.disconnect()
    resizeObserver = null
    resetNavLock()
    cancelAnimationFrame(raf)
  })

  return { highlightId }
}
