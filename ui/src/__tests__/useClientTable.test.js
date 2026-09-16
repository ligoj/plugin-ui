import { describe, it, expect } from 'vitest'
import { ref } from 'vue'
import { useClientTable } from '../useClientTable.js'

const ROWS = [
  { id: 'b', name: 'Bravo', size: 10 },
  { id: 'a', name: 'alpha', size: 2 },
  { id: 'c', name: 'Charlie', size: 30 },
]

describe('useClientTable() — in-memory paging and sorting for LjDataTable', () => {
  it('pages the list according to the table options', () => {
    const t = useClientTable(ref(ROWS), { defaultSort: 'id', perPage: 2 })
    expect(t.total.value).toBe(3)
    expect(t.paged.value.map((r) => r.id)).toEqual(['a', 'b'])
    t.onOptions({ page: 2, itemsPerPage: 2, sortBy: [{ key: 'id', order: 'asc' }] })
    expect(t.paged.value.map((r) => r.id)).toEqual(['c'])
  })

  it('sorts strings case-insensitively and numbers numerically, in both directions', () => {
    const t = useClientTable(() => ROWS)
    t.onOptions({ page: 1, itemsPerPage: 25, sortBy: [{ key: 'name', order: 'asc' }] })
    expect(t.paged.value.map((r) => r.name)).toEqual(['alpha', 'Bravo', 'Charlie'])
    t.onOptions({ page: 1, itemsPerPage: 25, sortBy: [{ key: 'size', order: 'desc' }] })
    expect(t.paged.value.map((r) => r.size)).toEqual([30, 10, 2])
  })

  it('keeps the current page valid when the list shrinks, and keeps the source order without a sort key', () => {
    const rows = ref(ROWS)
    const t = useClientTable(rows, { perPage: 2 })
    expect(t.paged.value.map((r) => r.id)).toEqual(['b', 'a'])
    t.onOptions({ page: 2, itemsPerPage: 2, sortBy: [] })
    expect(t.paged.value.map((r) => r.id)).toEqual(['c'])
    rows.value = ROWS.slice(0, 1)
    expect(t.paged.value.map((r) => r.id)).toEqual(['b'])
  })
})
