import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { mount, flushPromises } from '@vue/test-utils'
import { VibrantDataTable, VibrantConfirmDialog, useI18nStore } from '@ligoj/host'
import SystemHookView from '../views/SystemHookView.vue'
import enMessages from '../i18n/en.js'

// One server-paginated hook row (DataTables shape). `match` is the JSON
// string the view splits into the path / method columns.
const HOOK = {
  id: 1, name: 'deploy', command: 'echo hi', workingDirectory: '/opt/app',
  match: '{"path":"system/.*","method":"POST"}', inject: [], timeout: 10, delay: 0,
}

function jsonResponse(body) {
  return {
    ok: true, status: 200,
    headers: { get: () => 'application/json' },
    clone() { return jsonResponse(body) },
    json: async () => body,
    text: async () => JSON.stringify(body),
  }
}

// Render-the-slot stubs so the header actions, table rows, dialogs and row
// menu are reachable from the test (Vuetify is externalized in the plugin
// build, hence the v-* stubs too).
const stubs = {
  LjPageHeader: { template: '<div class="hdr"><slot name="subtitle" /><slot name="actions" /></div>' },
  LjSearch: { template: '<input class="search" />' },
  LjButton: { emits: ['click'], template: '<button class="ljbtn" @click="$emit(\'click\')"><slot /></button>' },
  LjDialog: { props: ['modelValue'], template: '<div v-if="modelValue" class="ljdialog"><slot /><slot name="footer" /></div>' },
  LjAvailabilityField: { template: '<div class="avail" />' },
  VibrantConfirmDialog: { props: ['modelValue'], emits: ['confirm'], template: '<div v-if="modelValue" class="confirm"><slot /></div>' },
  RowActionsCog: { template: '<div class="cog"><slot /></div>' },
  VibrantDataTable: {
    props: ['headers', 'items', 'itemsLength', 'loading', 'defaultSort'],
    template: '<div class="vdt"><div v-for="it in items" :key="it.id" class="row"><slot name="actions" :item="it" /></div></div>',
  },
  'v-form': { template: '<form><slot /></form>' },
  'v-select': true, 'v-text-field': true, 'v-combobox': true, 'v-icon': true,
}

function mountView() {
  return mount(SystemHookView, { global: { stubs } })
}

describe('SystemHookView', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    useI18nStore().merge(enMessages, 'en')
    globalThis.fetch = vi.fn().mockResolvedValue(
      jsonResponse({ recordsTotal: 1, recordsFiltered: 1, data: [HOOK] }),
    )
  })

  it('renders the data table with the expected columns', () => {
    const w = mountView()
    const table = w.findComponent(VibrantDataTable)
    expect(table.exists()).toBe(true)
    expect(table.props('headers').map((h) => h.key)).toEqual(['name', 'method', 'path', 'command', 'delay'])
    expect(table.props('defaultSort')).toBe('name')
  })

  it('queries rest/system/hook (name asc) when the table requests options', async () => {
    const w = mountView()
    await w.findComponent(VibrantDataTable).vm.$emit('update:options', { page: 1, itemsPerPage: 25, sortBy: [] })
    await flushPromises()

    const url = globalThis.fetch.mock.calls[0][0]
    expect(url).toContain('rest/system/hook')
    expect(url).toContain('sidx=name')
  })

  it('opens the create dialog when clicking New', async () => {
    const w = mountView()
    expect(w.find('.ljdialog').exists()).toBe(false)
    await w.find('.ljbtn').trigger('click')
    expect(w.find('.ljdialog').exists()).toBe(true)
  })

  it('deletes a hook through the confirm dialog (DELETE on its id)', async () => {
    const w = mountView()
    // Populate the table, then open the row's delete confirm and confirm it.
    await w.findComponent(VibrantDataTable).vm.$emit('update:options', { page: 1, itemsPerPage: 25, sortBy: [] })
    await flushPromises()

    await w.find('.cog button.danger').trigger('click')
    await w.findComponent(VibrantConfirmDialog).vm.$emit('confirm')
    await flushPromises()

    const delCall = globalThis.fetch.mock.calls.find((c) => c[1]?.method === 'DELETE')
    expect(delCall).toBeTruthy()
    expect(delCall[0]).toBe('rest/system/hook/1')
  })
})
