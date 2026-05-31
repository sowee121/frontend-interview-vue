/** 与 CSS --anchor-scroll-margin 一致（由 SiteHeader 写入） */
export function readAnchorScrollMarginPx(): number {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue('--anchor-scroll-margin')
    .trim()
  if (raw.endsWith('px')) {
    const n = Number.parseFloat(raw)
    if (!Number.isNaN(n)) return n
  }
  const header = document.querySelector('.site-header')
  if (header instanceof HTMLElement) {
    return Math.ceil(header.getBoundingClientRect().height) + 12
  }
  return 96
}
