/*
 * The configuration view shows the audit data of the stored entries: when each one was last modified, with the
 * audit rows of the project view (created on / by, modified on / by) in a tooltip and in the edit dialog. Secured
 * values stay hidden.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { mount, flushPromises } from '@vue/test-utils'
import { useAuthStore, useI18nStore } from '@ligoj/host'
import SystemConfigurationView from '../views/SystemConfigurationView.vue'
import AuditRows from '../components/AuditRows.vue'
import enMessages from '../i18n/en.js'

const NOW = Date.UTC(2026, 9, 10, 12, 0, 0)
const DAY = 86400000
const ROWS = [
  { name: 'db.recent', source: 'database', persisted: true, value: 'v1', createdDate: NOW - 10 * DAY, createdBy: '_system', lastModifiedDate: NOW - 3 * DAY, lastModifiedBy: 'ligoj-admin' },
  { name: 'db.secured', source: 'database', persisted: true, secured: true, createdDate: NOW - 400 * DAY, createdBy: '_system', lastModifiedDate: NOW - 400 * DAY, lastModifiedBy: '_system' },
  { name: 'env.only', source: 'systemEnvironment', persisted: false, value: 'x' },
  // Never modified since its creation: its creation is its last modification
  { name: 'db.created', source: 'database', persisted: true, value: 'v2', createdDate: NOW - DAY, createdBy: 'ligoj-admin' },
]

const tableStub = {
  name: 'LjDataTable',
  props: ['items', 'headers'],
  emits: ['update:options', 'row-click'],
  template: '<div class="tbl"><div v-for="it in items" :key="it.name" class="row" :data-name="it.name" @click="$emit(\'row-click\', it)"><slot name="cell.lastModifiedDate" :item="it" /></div></div>',
}
const stubs = {
  LjPageHeader: true, LjSearch: true, LjButton: true, LjAvailabilityField: true, LigojConfirmDialog: true, RowActionsCog: true,
  LigojTextarea: true, 'v-form': { template: '<form><slot /></form>' }, 'v-icon': true,
  LjDialog: { props: ['modelValue'], template: '<div v-if="modelValue" class="dlg"><slot /></div>' },
  LjDataTable: tableStub,
  'v-tooltip': { props: ['text'], template: '<span class="vtt">{{ text }}<slot /></span>' },
}

async function mountView() {
  const w = mount(SystemConfigurationView, { global: { stubs } })
  await flushPromises()
  return w
}
const cell = (w, name) => w.find(`.row[data-name="${name}"]`)
const order = (w) => w.findAll('.row').map((r) => r.attributes('data-name'))

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date'] })
  vi.setSystemTime(NOW)
  setActivePinia(createPinia())
  const i18n = useI18nStore()
  i18n.merge(enMessages, 'en')
  i18n.locale = 'en'
  useAuthStore().session = { admin: true }
  globalThis.fetch = vi.fn(async () => ({
    ok: true, status: 200, headers: { get: () => 'application/json' },
    json: async () => ROWS, text: async () => '', clone() { return this },
  }))
})
afterEach(() => { vi.useRealTimers() })

describe('SystemConfigurationView: audit data', () => {
  it('shows only when each stored entry was last modified', async () => {
    const w = await mountView()
    expect(cell(w, 'db.recent').find('.audit-when').text()).toBe('3 days ago')
    expect(cell(w, 'db.secured').find('.audit-when').text()).toBe('last year')
    expect(cell(w, 'db.recent').find('.audit-who').exists()).toBe(false)
  })

  it('details the creation and the last modification in a tooltip, with the audit rows of the project view', async () => {
    const tip = (await mountView()).find('.row[data-name="db.recent"] .vtt')
    const rows = tip.findComponent(AuditRows)
    expect(rows.props()).toMatchObject({ target: { name: 'db.recent' }, dense: true })
    expect(tip.text()).toContain(useI18nStore().t('common.createdDate'))
    expect(tip.text()).toContain('System')
    expect(tip.text()).toContain('ligoj-admin')
  })

  it('explains the absent audit data of an entry defined outside the database', async () => {
    const w = await mountView()
    expect(cell(w, 'env.only').find('.audit-none').text()).toContain('—')
    expect(cell(w, 'env.only').find('.vtt').text()).toBe(enMessages['system.config.auditNone'])
  })

  it('sorts by the last modification, the entries without audit data last in both orders', async () => {
    const w = await mountView()
    const table = w.findComponent({ name: 'LjDataTable' })
    table.vm.$emit('update:options', { page: 1, itemsPerPage: 25, sortBy: [{ key: 'lastModifiedDate', order: 'desc' }] })
    await flushPromises()
    expect(order(w)).toEqual(['db.created', 'db.recent', 'db.secured', 'env.only'])
    table.vm.$emit('update:options', { page: 1, itemsPerPage: 25, sortBy: [{ key: 'lastModifiedDate', order: 'asc' }] })
    await flushPromises()
    expect(order(w)).toEqual(['db.secured', 'db.recent', 'db.created', 'env.only'])
  })

  it('exports the last modification as date and user', async () => {
    const header = (await mountView()).findComponent({ name: 'LjDataTable' }).props('headers').find((h) => h.key === 'lastModifiedDate')
    expect(header.sortable).toBe(true)
    expect(header.exportValue(ROWS[0])).toContain('· ligoj-admin')
    expect(header.exportValue(ROWS[2])).toBe('')
  })

  it('shows the audit data in the edit dialog, never a secured value', async () => {
    const w = await mountView()
    await cell(w, 'db.secured').trigger('click')
    const rows = w.find('.dlg').findComponent(AuditRows)
    expect(rows.exists()).toBe(true)
    expect(rows.props('target').name).toBe('db.secured')
    expect(w.find('.dlg .cfg-audit').text()).not.toContain('•')
    await cell(w, 'env.only').trigger('click')
    expect(w.find('.dlg').findComponent(AuditRows).exists()).toBe(false)
  })
})
