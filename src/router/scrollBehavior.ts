import { nextTick } from 'vue'
import type { RouterScrollBehavior } from 'vue-router'

import { readAnchorScrollMarginPx } from '@/utils/anchorOffset'

/** 等布局稳定后再滚动，避免切换章节或首屏渲染时找不到节点 / 位置偏上 */
function afterLayoutPaint(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => resolve())
    })
  })
}

function elementByHash(hash: string): HTMLElement | null {
  if (!hash || hash === '#') return null
  const id = decodeURIComponent(hash.slice(1))
  if (!id) return null
  return document.getElementById(id)
}

/** 与 CSS --anchor-scroll-margin 一致：吸顶头高度 + 少量空隙（像素） */
function anchorScrollOffsetPx(): number {
  return readAnchorScrollMarginPx()
}

export const scrollBehavior: RouterScrollBehavior = async (to, _from, savedPosition) => {
  if (savedPosition) return savedPosition
  if (to.hash) {
    await nextTick()
    await afterLayoutPaint()
    const el = elementByHash(to.hash)
    if (!el) {
      return { el: to.hash, behavior: 'smooth' }
    }
    const offset = anchorScrollOffsetPx()
    const y = el.getBoundingClientRect().top + window.scrollY - offset
    return {
      left: 0,
      top: Math.max(0, Math.round(y)),
      behavior: 'smooth',
    }
  }
  return { top: 0, left: 0, behavior: 'instant' }
}
