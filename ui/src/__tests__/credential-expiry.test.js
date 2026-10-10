/*
 * Credential expiry of a node: the chip of the node list, the manual date of the node dialog. Dates are days in UTC,
 * displayed the same day whatever the browser time zone.
 */
import { describe, it, expect, beforeEach, beforeAll, afterAll, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { mount, flushPromises } from '@vue/test-utils'
import { useAuthStore, useI18nStore, pluginRegistry } from '@ligoj/host'
import CredentialExpiryChip from '../components/CredentialExpiryChip.vue'
import NodeEditDialog from '../views/NodeEditDialog.vue'
import enMessages from '../i18n/en.js'

const DAY = 86400000
const NOW = Date.parse('2026-11-20T10:00:00Z')
const NOV30 = Date.parse('2026-11-30T00:00:00Z')
const NODE = { id: 'service:scm:gitlab:local', name: 'GitLab Local', mode: 'link', refined: { id: 'service:scm:gitlab', refined: { id: 'service:scm' } } }

function response(body, status = 200) {
  return { ok: status < 300, status, headers: { get: () => 'application/json' }, clone() { return response(body, status) }, json: async () => body, text: async () => JSON.stringify(body) }
}

const stubs = {
  'v-chip': { template: '<span class="chip"><slot /></span>' },
  'v-tooltip': { template: '<span class="tip"><slot /></span>' },
  LjDialog: { props: ['modelValue'], template: '<div v-if="modelValue" class="ljdialog"><slot /><div class="foot"><slot name="footer" /></div></div>' },
  LjButton: { emits: ['click'], template: '<button class="ljbtn" @click="$emit(\'click\')"><slot /></button>' },
  LigojTextField: {
    name: 'LigojTextField',
    props: ['modelValue', 'label', 'type'],
    emits: ['update:modelValue'],
    template: '<div class="tf" :data-type="type"><input :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" /></div>',
  },
  LigojSelect: true, NodeIcon: true, NodeModeChip: true, LjSegmented: true, LjAvailabilityField: true, ParameterForm: true,
  'v-icon': true, 'v-progress-circular': true,
}

let t
const TZ = process.env.TZ
beforeAll(() => { process.env.TZ = 'America/New_York' })
afterAll(() => { process.env.TZ = TZ })
beforeEach(() => {
  setActivePinia(createPinia())
  useI18nStore().merge(enMessages, 'en')
  useI18nStore().setLocale('en')
  t = useI18nStore().t
  useAuthStore().session = { admin: true }
  vi.spyOn(pluginRegistry, 'has').mockReturnValue(true)
  globalThis.fetch = vi.fn(async (url, opts) => ((opts?.method || 'GET') === 'GET' ? response([]) : response(null, 204)))
})

describe('CredentialExpiryChip', () => {
  const chip = (node) => mount(CredentialExpiryChip, { props: { node, now: NOW }, global: { stubs } })

  it('shows nothing without urgency', () => {
    expect(chip({ credentialExpiry: NOW + 30 * DAY, credentialExpirySource: 'manual' }).find('.chip').exists()).toBe(false)
  })

  it('counts the days left of an expiring credential', () => {
    const w = chip({ credentialExpiry: NOW + 5 * DAY, credentialExpirySource: 'detected', credentialExpiryLevel: 'warning' })
    expect(w.find('.chip').text()).toContain(t('system.node.credentialExpiring', { days: 5 }))
  })

  it('flags an expired credential', () => {
    const w = chip({ credentialExpiry: NOW - DAY, credentialExpirySource: 'manual', credentialExpiryLevel: 'expired' })
    expect(w.find('.chip').text()).toContain(t('system.node.credentialExpired'))
  })

  it('shows the day of the expiry in UTC, its source in the tooltip', () => {
    const w = chip({ credentialExpiry: NOV30, credentialExpirySource: 'manual', credentialExpiryLevel: 'warning' })
    // America/New_York would display 11/29/2026 without the UTC formatting
    expect(w.find('.tip').text()).toContain('11/30/2026')
    expect(w.find('.tip').text()).toContain(t('system.node.credentialExpirySource.manual'))
  })
})

describe('NodeEditDialog credential expiry', () => {
  // The API tells the UI it stores the credential expiry
  beforeEach(() => { useAuthStore().session = { admin: true, applicationSettings: { data: { 'credential-expiry': 'true' } } } })
  async function openEdit(node) {
    const w = mount(NodeEditDialog, { props: { modelValue: false, node }, global: { stubs } })
    await w.setProps({ modelValue: true })
    await flushPromises()
    return w
  }
  const dateField = (w) => w.findAllComponents({ name: 'LigojTextField' }).find((c) => c.props('type') === 'date')
  async function save(w) {
    await w.findAll('.foot .ljbtn').find((b) => b.text() === t('common.save')).trigger('click')
    await flushPromises()
    return JSON.parse(fetch.mock.calls.find(([, o]) => o?.method === 'PUT')[1].body)
  }

  it('edits a manual date as a UTC day', async () => {
    const w = await openEdit({ ...NODE, credentialExpiry: NOV30, credentialExpirySource: 'manual' })
    expect(dateField(w).props('modelValue')).toBe('2026-11-30')
    await dateField(w).find('input').setValue('2026-12-31')
    expect((await save(w)).credentialExpiry).toBe(Date.parse('2026-12-31T00:00:00Z'))
  })

  it('a cleared date removes the expiry', async () => {
    const w = await openEdit({ ...NODE, credentialExpiry: NOV30, credentialExpirySource: 'manual' })
    dateField(w).vm.$emit('update:modelValue', null)
    expect((await save(w)).credentialExpiry).toBeNull()
  })

  it('shows a detected expiry read-only', async () => {
    let w = await openEdit({ ...NODE, credentialExpiry: NOV30, credentialExpirySource: 'detected' })
    expect(dateField(w)).toBeUndefined()
    expect(w.find('.cred-detected').text()).toContain('11/30/2026')
    w = await openEdit({ ...NODE, credentialExpirySource: 'detected' })
    expect(w.find('.cred-detected').text()).toBe(t('system.node.credentialNeverExpires'))
  })

  it('neither shows nor sends the expiry to an API without this feature', async () => {
    // An older API refuses the unknown field: no error, no warning
    useAuthStore().session = { admin: true, applicationSettings: { data: {} } }
    const w = await openEdit({ ...NODE })
    expect(dateField(w)).toBeUndefined()
    expect(w.find('.cred-detected').exists()).toBe(false)
    expect(await save(w)).not.toHaveProperty('credentialExpiry')
  })
})
