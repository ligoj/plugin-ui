/*
 * The audit rows of an auditable entity, shared by the project audit dialog and the configuration editor.
 */
import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { mount } from '@vue/test-utils'
import { useI18nStore } from '@ligoj/host'
import AuditRows from '../components/AuditRows.vue'
import AuditDialog from '../components/AuditDialog.vue'
import enMessages from '../i18n/en.js'

const NOW = Date.UTC(2026, 9, 10, 12, 0, 0)
const TARGET = { createdDate: NOW, createdBy: '_system', lastModifiedDate: NOW, lastModifiedBy: 'ligoj-admin' }
const stubs = {
  'v-icon': true,
  LjDialog: { props: ['modelValue'], template: '<div v-if="modelValue" class="dlg"><slot /><slot name="footer" /></div>' },
  LjButton: true,
}
const values = (w) => w.findAll('.aud-v').map((v) => v.text())

beforeEach(() => {
  setActivePinia(createPinia())
  const i18n = useI18nStore()
  i18n.merge(enMessages, 'en')
  i18n.locale = 'en'
})

describe('AuditRows', () => {
  it('shows the creation and the last modification, in the active locale', () => {
    const [createdDate, createdBy, modifiedDate, modifiedBy] = values(mount(AuditRows, { props: { target: TARGET }, global: { stubs } }))
    expect(createdDate).toContain('October')
    expect(createdBy).toBe('System')
    expect(modifiedDate).toContain('2026')
    expect(modifiedBy).toBe('ligoj-admin')
  })

  it('shows a dash for the absent or invalid audit data', () => {
    expect(values(mount(AuditRows, { props: { target: { createdDate: 'not a date' } }, global: { stubs } }))).toEqual(['—', '—', '—', '—'])
    expect(values(mount(AuditRows, { props: { target: null }, global: { stubs } }))).toEqual(['—', '—', '—', '—'])
  })

  it('is the content of the project audit dialog, in the active locale instead of French', () => {
    const w = mount(AuditDialog, { props: { modelValue: true, target: TARGET }, global: { stubs } })
    expect(w.findComponent(AuditRows).exists()).toBe(true)
    expect(values(w)[0]).toContain('October')
    expect(values(w)[0]).not.toContain('octobre')
  })
})
