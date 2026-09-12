import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { mount, flushPromises } from '@vue/test-utils'
import { useI18nStore, LjConfirmDialog, LjDataTable } from '@ligoj/host'
import SystemPluginView from '../views/SystemPluginView.vue'
import enMessages from '../i18n/en.js'

const ConfirmStub = { props: ['modelValue'], emits: ['confirm'], template: '<div v-if="modelValue" class="confirm"><slot /></div>' }

// Three plug-ins: an active one, a disabled one and one scheduled for removal.
const ACTIVE = { plugin: { artifact: 'plugin-build-jenkins', version: '1.0.0', type: 'TOOL' }, node: { id: 'service:build:jenkins', name: 'Jenkins' }, disabled: false, loaded: true }
const DISABLED = { plugin: { artifact: 'plugin-id-ldap', version: '1.0.0', type: 'TOOL' }, node: { id: 'service:id:ldap', name: 'LDAP' }, disabled: true, loaded: false }
const DELETED = { plugin: { artifact: 'plugin-bt', version: '1.0.0', type: 'SERVICE' }, node: { id: 'service:bt', name: 'BT' }, disabled: false, loaded: true, deleted: true }

function jsonResponse(body) {
  return {
    ok: true, status: 200,
    headers: { get: () => 'application/json' },
    clone() { return jsonResponse(body) },
    json: async () => body,
    text: async () => JSON.stringify(body),
  }
}

// Stubs render only the per-row #actions slot: the cog (RowActionsCog) exposes
// its menu items as plain buttons, like the node view.
const stubs = {
  LjPageHeader: { template: '<div class="hdr"><slot name="subtitle" /><slot name="actions" /></div>' },
  LjButton: { emits: ['click'], template: '<button class="ljbtn" @click="$emit(\'click\')"><slot /></button>' },
  LjDialog: { props: ['modelValue'], template: '<div v-if="modelValue"><slot /></div>' },
  LjStatus: { template: '<span />' },
  LigojTextField: true, LigojAutocomplete: true, NodeIcon: true, PluginAutomationDialog: true,
  RowActionsCog: { template: '<div class="cog"><slot /></div>' },
  LigojConfirmDialog: ConfirmStub,
  LjDataTable: {
    props: ['headers', 'items', 'itemsLength', 'loading'],
    template: '<div class="vdt">'
      + '<div v-for="it in items" :key="it.id" class="row">'
      + '<span class="enabled-cell"><slot name="cell.enabled" :item="it" /></span>'
      + '<slot name="actions" :item="it" /></div></div>',
  },
  'v-tooltip': { template: '<div class="tt"><slot name="activator" :props="{}" /></div>' },
  'v-icon': { template: '<i class="icon"><slot /></i>' },
  'v-progress-circular': true, 'v-checkbox': true, 'v-file-input': true, 'v-list-item': true,
}

function mountView() {
  return mount(SystemPluginView, { global: { stubs } })
}
function calls(method) {
  return globalThis.fetch.mock.calls.filter((c) => (c[1]?.method || 'GET') === method).map((c) => c[0])
}
function menuButtons(row) {
  return row.findAll('.cog button')
}

describe('SystemPluginView row actions', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    useI18nStore().merge(enMessages, 'en')
    globalThis.fetch = vi.fn((url, opts) => {
      const method = opts?.method || 'GET'
      if (method === 'GET' && String(url).startsWith('rest/system/plugin?')) return Promise.resolve(jsonResponse([ACTIVE, DISABLED, DELETED]))
      if (method === 'GET' && String(url).startsWith('rest/system/plugin/schedule')) return Promise.resolve(jsonResponse({}))
      return Promise.resolve(jsonResponse({}))
    })
  })

  it('has no dedicated enabled column: the toggle lives in the row cog with the delete action', async () => {
    const w = mountView()
    await flushPromises()
    const rows = w.findAll('.row')
    expect(rows).toHaveLength(3)
    // The former switch column is gone (no header, no cell content).
    const table = w.findComponent(LjDataTable)
    expect(table.props('headers').map((h) => h.key)).not.toContain('enabled')
    expect(w.find('.switch').exists()).toBe(false)
    expect(rows[0].find('.enabled-cell').text()).toBe('')

    // Active row: "Disable" + "Delete".
    const active = menuButtons(rows[0])
    expect(active).toHaveLength(2)
    expect(active[0].text()).toContain('Disable')
    expect(active[1].text()).toContain('Delete')
    expect(active[1].classes()).toContain('danger')
    // Disabled row: "Enable" + "Delete".
    const disabled = menuButtons(rows[1])
    expect(disabled[0].text()).toContain('Enable')
    expect(disabled[1].text()).toContain('Delete')
    // Deletion scheduled: no cog, only the indicator.
    expect(rows[2].find('.cog').exists()).toBe(false)
    expect(rows[2].find('.deleted').exists()).toBe(true)
  })

  it('enables a disabled plug-in from the cog (PUT …/enable) then reloads', async () => {
    const w = mountView()
    await flushPromises()
    await menuButtons(w.findAll('.row')[1])[0].trigger('click')
    await flushPromises()
    expect(calls('PUT')).toEqual(['rest/system/plugin/plugin-id-ldap/enable'])
    expect(calls('GET').filter((u) => String(u).startsWith('rest/system/plugin?')).length).toBeGreaterThanOrEqual(2)
  })

  it('disabling an active plug-in asks for confirmation before PUT …/disable', async () => {
    const w = mountView()
    await flushPromises()
    await menuButtons(w.findAll('.row')[0])[0].trigger('click')
    await flushPromises()
    expect(calls('PUT')).toEqual([])
    expect(w.find('.confirm').exists()).toBe(true)
    await w.findComponent(LjConfirmDialog).vm.$emit('confirm')
    await flushPromises()
    expect(calls('PUT')).toEqual(['rest/system/plugin/plugin-build-jenkins/disable'])
  })

  it('deletes from the cog after confirmation (DELETE rest/system/plugin/{artifact})', async () => {
    const w = mountView()
    await flushPromises()
    await menuButtons(w.findAll('.row')[0])[1].trigger('click')
    await flushPromises()
    expect(calls('DELETE')).toEqual([])
    await w.findComponent(LjConfirmDialog).vm.$emit('confirm')
    await flushPromises()
    expect(calls('DELETE')).toEqual(['rest/system/plugin/plugin-build-jenkins'])
  })
})
