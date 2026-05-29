import { nextTick, onMounted, onUnmounted, ref, watch, type Ref } from 'vue'

function readAnchorScrollMarginPx(): number {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue('--anchor-scroll-margin')
    .trim()
  const n = Number.parseFloat(raw)
  if (Number.isFinite(n) && n > 0) return n
  return 108
}

function resolveActiveSectionId(ids: string[], headerOffset: number): string | null {
  if (!ids.length) return null

  const doc = document.documentElement
  const nearBottom =
    window.innerHeight + window.scrollY >= doc.scrollHeight - 48
  if (nearBottom) return ids[ids.length - 1]!

  const line = headerOffset + 12
  let current: string | null = null
  for (const id of ids) {
    const el = document.getElementById(id)
    if (!el) continue
    if (el.getBoundingClientRect().top <= line) current = id
  }
  return current ?? ids[0]!
}

/**
 * 根据主内容滚动位置更新当前 TOC 项（与 hash 点击互补，不改写地址栏）。
 */
export function useChapterScrollSpy(sectionIds: () => string[]): {
  activeId: Ref<string | null>
} {
  const activeId = ref<string | null>(null)
  let raf = 0

  function update() {
    activeId.value = resolveActiveSectionId(
      sectionIds(),
      readAnchorScrollMarginPx(),
    )
  }

  function scheduleUpdate() {
    cancelAnimationFrame(raf)
    raf = requestAnimationFrame(update)
  }

  watch(
    sectionIds,
    () => {
      nextTick(scheduleUpdate)
    },
    { deep: true },
  )

  onMounted(() => {
    nextTick(() => {
      update()
      window.addEventListener('scroll', scheduleUpdate, { passive: true })
      window.addEventListener('resize', scheduleUpdate, { passive: true })
    })
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', scheduleUpdate)
    window.removeEventListener('resize', scheduleUpdate)
    cancelAnimationFrame(raf)
  })

  return { activeId }
}
