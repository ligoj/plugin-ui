/*
 * Client-side paging + sorting for an LjDataTable fed with an in-memory list
 * (small admin lists loaded in one call: nodes, API tokens, caches...).
 *
 * LjDataTable owns only the pager / sort UI: it renders the items it receives
 * and emits `update:options`. Feed `onOptions` to that event, hand `paged` to
 * `:items` and `total` to `:items-length`, and the table pages and sorts the
 * list as the user expects. Sorting compares numbers numerically and anything
 * else as case-insensitive strings.
 */
import { computed, ref, unref } from 'vue'

/**
 * @param {import('vue').Ref<Array>|(() => Array)} source The full (already filtered) list.
 * @param {{defaultSort?: string, defaultOrder?: 'asc'|'desc', perPage?: number}} [options]
 */
export function useClientTable(source, { defaultSort = '', defaultOrder = 'asc', perPage: initialPerPage = 25 } = {}) {
  const page = ref(1)
  const perPage = ref(initialPerPage)
  const sortKey = ref(defaultSort)
  const sortOrder = ref(defaultOrder)
  const all = computed(() => (typeof source === 'function' ? source() : unref(source)) || [])

  function onOptions(o) {
    page.value = o?.page || 1
    perPage.value = o?.itemsPerPage || initialPerPage
    sortKey.value = o?.sortBy?.[0]?.key || defaultSort
    sortOrder.value = o?.sortBy?.[0]?.order || defaultOrder
  }

  const sorted = computed(() => {
    const k = sortKey.value
    if (!k) return all.value
    const dir = sortOrder.value === 'desc' ? -1 : 1
    return [...all.value].sort((a, b) => {
      const va = a?.[k], vb = b?.[k]
      if (typeof va === 'number' && typeof vb === 'number') return dir * (va - vb)
      return dir * String(va ?? '').toLowerCase().localeCompare(String(vb ?? '').toLowerCase())
    })
  })
  const total = computed(() => all.value.length)
  const paged = computed(() => {
    // Keep the page inside the list: a filter shrinking the list must not leave an empty page
    const pages = Math.max(1, Math.ceil(total.value / perPage.value))
    const p = Math.min(page.value, pages)
    const start = (p - 1) * perPage.value
    return sorted.value.slice(start, start + perPage.value)
  })
  return { paged, total, sorted, onOptions, page, perPage, sortKey, sortOrder }
}
