import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { mount, flushPromises } from '@vue/test-utils'
import { VibrantDataTable } from '@ligoj/host'
import SystemUserLogView from '../views/SystemUserLogView.vue'

// Heavy host chrome (page header, table) is stubbed — we only verify the
// view wires useDataTable('user-log') and hands the right headers to the
// table, and that a table option change drives a GET against the endpoint.
function mountView() {
  return mount(SystemUserLogView, {
    global: { stubs: { LjPageHeader: true, VibrantDataTable: true } },
  })
}

describe('SystemUserLogView', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        recordsTotal: 1,
        recordsFiltered: 1,
        data: [{ id: 1, user: 'ligoj-admin', date: 1781632761013, message: 'Boom', url: '#/x' }],
      }),
    })
  })

  it('mounts and renders the data table with the expected columns', () => {
    const w = mountView()
    const table = w.findComponent(VibrantDataTable)
    expect(table.exists()).toBe(true)
    expect(table.props('headers').map((h) => h.key)).toEqual(['date', 'user', 'message', 'url'])
    expect(table.props('defaultSort')).toBe('date')
    expect(table.props('defaultOrder')).toBe('desc')
  })

  it('queries rest/user-log (date desc) when the table requests options', async () => {
    const w = mountView()
    await w.findComponent(VibrantDataTable).vm.$emit('update:options', { page: 1, itemsPerPage: 25, sortBy: [] })
    await flushPromises()

    expect(globalThis.fetch).toHaveBeenCalledTimes(1)
    const url = globalThis.fetch.mock.calls[0][0]
    expect(url).toContain('rest/user-log')
    expect(url).toContain('sidx=date')
    expect(url).toContain('sord=desc')
  })
})
