import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { nextTick } from 'vue'

// Runner list returned by GET rest/system/task.
const RUNNERS = [
  { key: 'importCatalogResource', label: 'ImportCatalogStatus', type: 'node', stats: { total: 3, running: 1, succeeded: 1, failed: 1 } },
  { key: 'subRunner', label: 'SubStatus', type: 'subscription', stats: { total: 0, running: 0, succeeded: 0, failed: 0 } },
]

// Single shared fake data table so we can assert load() calls across the test.
const dtStub = {
  items: { value: [] }, totalItems: { value: 0 }, loading: { value: false },
  search: { value: '' }, load: vi.fn(), loadAll: vi.fn(),
}
const useDataTableSpy = vi.fn(() => dtStub)

vi.mock('@ligoj/host', () => ({
  useApi: () => ({ get: vi.fn().mockResolvedValue(RUNNERS) }),
  useAppStore: () => ({ setBreadcrumbs: vi.fn() }),
  useI18nStore: () => ({ t: (k) => k, locale: 'en' }),
  useDataTable: (...args) => useDataTableSpy(...args),
  NodeIcon: { name: 'NodeIcon', props: ['node'], template: '<i class="nicon" />' },
  LjPageHeader: { template: '<div class="hdr"><slot name="subtitle" /></div>' },
  LjDialog: { props: ['modelValue'], template: '<div v-if="modelValue" class="ljdialog"><slot /><slot name="footer" /></div>' },
  LjButton: { template: '<button><slot /></button>' },
  LjSegmented: { name: 'LjSegmented', props: ['modelValue', 'options'], emits: ['update:modelValue'], template: '<div class="seg" />' },
  VibrantDataTable: { name: 'VibrantDataTable', props: ['headers', 'items', 'itemsLength', 'loading', 'defaultSort', 'defaultOrder'], template: '<div class="vdt" />' },
}))

import SystemTaskView from '../views/SystemTaskView.vue'

function mountView() {
  return mount(SystemTaskView, { global: { stubs: { 'v-icon': true, 'v-progress-circular': true, 'v-tooltip': true } } })
}

describe('SystemTaskView', () => {
  beforeEach(() => {
    useDataTableSpy.mockClear()
    dtStub.load.mockClear()
  })

  it('renders one card per runner, grouped, with stats', async () => {
    const w = mountView()
    await flushPromises()
    const cards = w.findAll('.card')
    expect(cards).toHaveLength(2)
    // Two non-empty sections (node + subscription).
    expect(w.findAll('.section')).toHaveLength(2)
    // The node runner shows its total (3) and the succeeded segment is 1/3 wide.
    expect(cards[0].text()).toContain('3')
    const succeeded = cards[0].find('.seg.succeeded')
    expect(succeeded.attributes('style')).toContain('33.3')
  })

  it('opens the dialog and wires useDataTable on the runner endpoint', async () => {
    const w = mountView()
    await flushPromises()
    expect(w.find('.ljdialog').exists()).toBe(false)

    await w.findAll('.card')[0].trigger('click')
    expect(w.find('.ljdialog').exists()).toBe(true)
    expect(useDataTableSpy).toHaveBeenCalledTimes(1)
    const [endpoint, opts] = useDataTableSpy.mock.calls[0]
    expect(endpoint).toBe('system/task/importCatalogResource')
    expect(opts.defaultSort).toBe('start')
    expect(opts.defaultOrder).toBe('desc')
  })

  it('passes the status filter through extraParams and reloads', async () => {
    const w = mountView()
    await flushPromises()
    await w.findAll('.card')[0].trigger('click')

    const opts = useDataTableSpy.mock.calls[0][1]
    expect(opts.extraParams()).toEqual({})

    // Change the status filter -> extraParams reflects it and the table reloads.
    await w.findComponent({ name: 'LjSegmented' }).vm.$emit('update:modelValue', 'running')
    await nextTick()
    expect(opts.extraParams()).toEqual({ status: 'running' })
    expect(dtStub.load).toHaveBeenCalled()
  })
})
