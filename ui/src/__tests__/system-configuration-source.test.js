import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { mount, flushPromises } from '@vue/test-utils'
import SystemConfigurationView from '../views/SystemConfigurationView.vue'

// The Source column renders icon-only; the readable name + business
// explanation live in a v-tooltip (project convention: tooltips are
// v-tooltip, never native `title`). We drive rows through the mocked
// fetch and stub the table so it renders the `cell.source` slot per row,
// plus the tooltip default slot, so we can inspect what's rendered.
const tableStub = {
  name: 'VibrantDataTable',
  props: ['items'],
  template: '<div class="tbl"><div v-for="(it, i) in items" :key="i" class="srccell"><slot name="cell.source" :item="it" /></div></div>',
}
const vtooltipStub = { template: '<span class="vtt"><slot /></span>' }
const viconStub = { template: '<i class="vi"><slot /></i>' }

// One row per known source type + a classpath-style path + an unknown type.
const ROWS = [
  { name: 'a', source: 'systemEnvironment', overridden: false },
  { name: 'b', source: 'systemProperties:foo', overridden: false },
  { name: 'c', source: 'database', overridden: true },
  { name: 'd', source: 'applicationConfig', overridden: false },
  { name: 'e', source: 'jar:file:/x/classpath/app.cfg', overridden: false },
  { name: 'f', source: 'totally-unknown-xyz', overridden: false },
]

function mountView() {
  return mount(SystemConfigurationView, {
    global: {
      stubs: {
        LjPageHeader: true, LjSearch: true, LjButton: true, LjDialog: true,
        LjAvailabilityField: true, LigojConfirmDialog: true, RowActionsCog: true,
        VibrantDataTable: tableStub,
        'v-tooltip': vtooltipStub, 'v-icon': viconStub, 'v-form': true, 'v-textarea': true,
      },
    },
  })
}

describe('SystemConfigurationView — source column', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true, status: 200,
      headers: { get: () => 'application/json' },
      json: async () => ROWS,
      text: async () => '',
      clone() { return this },
    })
  })

  it('renders the source as an icon only (no text label)', async () => {
    const w = mountView()
    await flushPromises()
    expect(w.findAll('.srccell').length).toBe(ROWS.length)
    // The legacy text label is gone everywhere.
    expect(w.find('.src-txt').exists()).toBe(false)
    // Every source pill carries exactly its icon.
    expect(w.findAll('.srcpill .vi').length).toBe(ROWS.length)
  })

  it('exposes a tooltip with the bold name and a business explanation', async () => {
    const w = mountView()
    await flushPromises()
    const first = w.findAll('.srccell')[0]
    expect(first.find('.srcpill .vtt').exists()).toBe(true)
    expect(first.find('.src-tip-name').text()).toBe('System Environment')
    expect(first.find('.src-tip-exp').exists()).toBe(true)
  })

  it('falls back to the raw source string for unknown types', async () => {
    const w = mountView()
    await flushPromises()
    const unknown = w.findAll('.srccell').at(-1)
    expect(unknown.find('.src-tip-exp').text()).toBe('totally-unknown-xyz')
  })

  it('converts the overridden indicator title into a v-tooltip', async () => {
    const w = mountView()
    await flushPromises()
    const overriddenCell = w.findAll('.srccell')[2] // row 'c' (overridden)
    expect(overriddenCell.find('.ovr .vtt').exists()).toBe(true)
    expect(w.find('.ovr[title]').exists()).toBe(false)
  })
})
