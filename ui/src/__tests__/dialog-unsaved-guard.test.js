/*
 * Unsaved changes of the edit dialogs: each one hands its form to LjDialog as `guard`, the dialog asking before
 * discarding a change (host LjDialog tests), and its Cancel goes through the dialog `close`. What a dialog writes by
 * itself, a load, a cascade of selections or a default value, is no change: the guarded value stays the same.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { nextTick } from 'vue'
import { setActivePinia, createPinia } from 'pinia'
import { mount, flushPromises } from '@vue/test-utils'
import { useAuthStore, useI18nStore, pluginRegistry } from '@ligoj/host'
import SystemUserView from '../views/SystemUserView.vue'
import SystemRoleView from '../views/SystemRoleView.vue'
import SystemHookView from '../views/SystemHookView.vue'
import SystemConfigurationView from '../views/SystemConfigurationView.vue'
import ApiTokenView from '../views/ApiTokenView.vue'
import ProjectEditDialog from '../views/ProjectEditDialog.vue'
import PluginAutomationDialog from '../components/PluginAutomationDialog.vue'
import NodeEditDialog from '../views/NodeEditDialog.vue'
import SubscribeWizardView from '../views/SubscribeWizardView.vue'
import enMessages from '../i18n/en.js'

const close = vi.fn()
const stubs = {
  // The guarded dialog: its `close` is the one its content and footer call
  LjDialog: {
    name: 'LjDialog',
    props: ['modelValue', 'guard', 'guardReady', 'title'],
    setup: () => ({ close }),
    template: '<div v-if="modelValue" class="ljdialog"><slot :close="close" /><div class="foot"><slot name="footer" :close="close" /></div></div>',
  },
  LjButton: { emits: ['click'], template: '<button class="ljbtn" @click="$emit(\'click\')"><slot /></button>' },
  LjPageHeader: { template: '<div class="hdr"><slot name="actions" /></div>' },
  LjDataTable: true, LjSearch: true, LjSegmented: true, LjStatus: true, LjAvailabilityField: true, LigojTextField: true,
  LigojTextarea: true, LigojAutocomplete: true, LigojSelect: true, LigojCombobox: true, LjConfirmDialog: true,
  LigojConfirmDialog: true, ApiVerifyDialog: true, RowActionsCog: true, NodeIcon: true, NodeModeChip: true,
  SubscriptionStatus: true, ParameterForm: true, PluginAutomationDialog: true, CronField: true,
  'v-tooltip': true, 'v-icon': true, 'v-progress-circular': true, 'v-chip': true, 'v-alert': true, 'v-switch': true,
  'v-form': { template: '<form><slot /></form>' },
}

function json(body) {
  return { ok: true, status: 200, headers: { get: () => 'application/json' }, clone() { return json(body) }, json: async () => body, text: async () => JSON.stringify(body) }
}
const PARAM = { id: 'service:qa:sonarqube:url', type: 'text', mandatory: true, mode: 'all', availableForNode: true, defaultValue: 'http://sonar' }
// Each GET by path, the most specific first
function respond(url) {
  const u = new URL(String(url), 'http://h/')
  const refined = u.searchParams.get('refined')
  if (refined === 'service') return { data: [{ id: 'service:qa', name: 'QA' }] }
  if (refined === 'service:qa') return { data: [{ id: 'service:qa:sonarqube', name: 'SonarQube', mode: 'all' }] }
  if (refined === 'service:qa:sonarqube') return { data: [{ id: 'service:qa:sonarqube:local', name: 'Local', mode: 'link' }] }
  if (u.pathname.includes('/parameter-value/')) return [{ parameter: PARAM, text: 'http://stored' }]
  if (u.pathname.includes('/parameter/')) return [PARAM]
  if (u.pathname.includes('system/plugin/schedule')) return { checkEnabled: true, checkCron: '0 0 1 * * *' }
  return { data: [], recordsTotal: 0, recordsFiltered: 0 }
}

beforeEach(() => {
  setActivePinia(createPinia())
  useI18nStore().merge(enMessages, 'en')
  useAuthStore().session = { admin: true }
  close.mockClear()
  vi.spyOn(pluginRegistry, 'has').mockReturnValue(true)
  globalThis.fetch = vi.fn(async (url, opts) => ((opts?.method || 'GET') === 'GET' ? json(respond(url)) : json({})))
})

const openDialog = (w) => w.findAllComponents({ name: 'LjDialog' }).find((d) => d.props('modelValue'))
const guardOf = (w) => JSON.stringify(openDialog(w).props('guard'))
async function cancel(w) {
  const button = openDialog(w).findAll('.ljbtn').find((b) => b.text() === useI18nStore().t('common.cancel'))
  await button.trigger('click')
  return close.mock.calls.length
}

// The guarded value: the same while the dialog writes by itself, changed by an edit of the user
async function expectGuarded(w, edit) {
  const dialog = openDialog(w)
  expect(dialog.props('guard')).not.toBeUndefined()
  expect(dialog.props('guardReady')).not.toBe(false)
  const unchanged = guardOf(w)
  await flushPromises()
  expect(guardOf(w)).toBe(unchanged)
  edit(w.vm)
  await nextTick()
  expect(guardOf(w)).not.toBe(unchanged)
  expect(await cancel(w)).toBe(1)
}

describe('inline edit dialogs', () => {
  it.each([
    ['system user', SystemUserView, (vm) => vm.openNew(), (vm) => { vm.editForm.login = 'jdoe' }],
    ['system user edition', SystemUserView, (vm) => vm.openEdit({ login: 'jdoe', roles: [] }), (vm) => { vm.editForm.roles = [1] }],
    ['system role', SystemRoleView, (vm) => vm.openNew(), (vm) => { vm.editForm.name = 'AUDITOR' }],
    ['system hook', SystemHookView, (vm) => vm.openNew(), (vm) => { vm.editForm.command = 'echo' }],
    ['configuration', SystemConfigurationView, (vm) => vm.openNew(), (vm) => { vm.editForm.value = 'v' }],
    ['API token', ApiTokenView, (vm) => vm.openCreate(), (vm) => { vm.createName = 'ci' }],
  ])('%s', async (_, view, open, edit) => {
    const w = mount(view, { global: { stubs, mocks: { $router: { push: vi.fn() } } } })
    await flushPromises()
    open(w.vm)
    await nextTick()
    await expectGuarded(w, edit)
  })
})

describe('edit dialog components', () => {
  async function opened(component, props = {}) {
    const w = mount(component, { props: { modelValue: false, ...props }, global: { stubs } })
    await w.setProps({ modelValue: true })
    await nextTick()
    return w
  }

  it('project', async () => {
    await expectGuarded(await opened(ProjectEditDialog, { project: null }), (vm) => { vm.form.name = 'Alpha' })
  })

  it('project edition', async () => {
    const project = { id: 1, name: 'Alpha', pkey: 'alpha', description: '' }
    await expectGuarded(await opened(ProjectEditDialog, { project }), (vm) => { vm.form.description = 'More' })
  })

  it('plugin automation, its form ready once its schedule is read', async () => {
    const w = mount(PluginAutomationDialog, { props: { modelValue: false }, global: { stubs } })
    await w.setProps({ modelValue: true })
    expect(openDialog(w).props('guardReady')).toBe(false)
    await flushPromises()
    expect(openDialog(w).props('guardReady')).toBe(true)
    expect(openDialog(w).props('guard')).toMatchObject({ checkEnabled: true, checkCron: '0 0 1 * * *' })
    await expectGuarded(w, (vm) => { vm.form.maintenanceEnabled = true })
  })

  it('node creation: the cascade of selections and the default values are no change', async () => {
    const w = await opened(NodeEditDialog)
    await expectGuarded(w, (vm) => { vm.form.name = 'Local' })
    // A value of a parameter, a typed identifier
    const unchanged = { ...JSON.parse(guardOf(w)), name: '' }
    w.vm.form.name = ''
    w.vm.paramValues[PARAM.id] = 'http://other'
    await nextTick()
    expect(JSON.parse(guardOf(w))).toEqual({ ...unchanged, values: { [PARAM.id]: 'http://other' } })
    w.vm.paramValues[PARAM.id] = 'http://sonar'
    w.vm.form.id = 'service:qa:sonarqube:local'
    await nextTick()
    expect(JSON.parse(guardOf(w))).toEqual({ ...unchanged, id: 'service:qa:sonarqube:local' })
  })

  it('node edition: the stored values are no change, the mode is one', async () => {
    const node = { id: 'service:qa:sonarqube:local', name: 'Local', mode: 'link', refined: { id: 'service:qa:sonarqube', mode: 'all', refined: { id: 'service:qa' } } }
    const w = await opened(NodeEditDialog, { node })
    await expectGuarded(w, (vm) => { vm.paramValues[PARAM.id] = 'http://other' })
    w.vm.paramValues[PARAM.id] = 'http://stored'
    await flushPromises()
    const unchanged = guardOf(w)
    w.vm.selected.mode = 'all'
    await flushPromises()
    expect(guardOf(w)).not.toBe(unchanged)
  })

  it('subscription wizard: the cascade of selections and the default values are no change', async () => {
    const w = await opened(SubscribeWizardView, { projectId: 1, projectName: 'P' })
    await expectGuarded(w, (vm) => { vm.paramValues[PARAM.id] = 'http://other' })
  })
})
