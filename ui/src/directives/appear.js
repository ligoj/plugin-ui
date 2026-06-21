/*
 * v-appear — fire the bound callback ONCE, the first time the element scrolls
 * into view (IntersectionObserver). Used to lazily fetch a subscription row's
 * full details (status/refresh) only when the row actually appears, rather than
 * up-front for every subscription.
 *
 * Usage: <div v-appear="() => onRowAppear(sub)">. The callback is invoked at
 * most once; the observer disconnects immediately after.
 */
export const vAppear = {
  mounted(el, binding) {
    const cb = binding.value
    if (typeof cb !== 'function') return
    // No IntersectionObserver (jsdom/tests/old browsers) → fire immediately.
    if (typeof IntersectionObserver === 'undefined') { cb(); return }
    const io = new IntersectionObserver((entries, obs) => {
      for (const e of entries) {
        if (e.isIntersecting) { obs.disconnect(); el._appearIO = null; cb(); break }
      }
    }, { rootMargin: '120px' })
    io.observe(el)
    el._appearIO = io
  },
  unmounted(el) {
    if (el._appearIO) { el._appearIO.disconnect(); el._appearIO = null }
  },
}
