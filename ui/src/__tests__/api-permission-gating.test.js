/*
 * API-permission gating: every action firing a write call is hidden when the
 * session's `apiAuthorizations` do not grant its path and verb
 * (`useAuthStore().isAllowedApi`). Each action is checked twice: hidden for a
 * session without any API permission, shown when only its own permission is
 * granted (which also pins the path + verb it is gated by).
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { mount, flushPromises } from '@vue/test-utils'
import { useAuthStore, useI18nStore } from '@ligoj/host'
import ProjectListView from '../views/ProjectListView.vue'
import SystemPluginView from '../views/SystemPluginView.vue'
import SystemNodeView from '../views/SystemNodeView.vue'
import NodeEditDialog from '../views/NodeEditDialog.vue'
import SystemConfigurationView from '../views/SystemConfigurationView.vue'
import SystemHookView from '../views/SystemHookView.vue'
import SystemRoleView from '../views/SystemRoleView.vue'
import SystemUserView from '../views/SystemUserView.vue'
import enMessages from '../i18n/en.js'

const dataTables = (rows) => ({ data: rows, recordsTotal: rows.length, recordsFiltered: rows.length })
const TOOL = { id: 'service:build:jenkins', name: 'Jenkins', mode: 'all', status: 'UP' }
const INSTANCE = { id: 'service:build:jenkins:1', name: 'Jenkins CI', mode: 'all', status: 'UP' }
const PLUGIN = {
  plugin: { artifact: 'plugin-build-jenkins', version: '1.0.0', type: 'TOOL' }, node: { id: 'service:build:jenkins', name: 'Jenkins' },
  disabled: false, loaded: true, latestLocalVersion: '1.0.1', newVersion: '1.0.2',
}

// Response of each GET, by path prefix (the most specific first).
const RESPONSES = [
  ['rest/project', dataTables([{ id: 1, name: 'Alpha', pkey: 'alpha', subscriptions: [] }])],
  ['rest/system/hook', dataTables([{ id: 1, name: 'deploy', command: 'echo', match: '{"path":"system/.*","method":"POST"}', inject: [], timeout: 10, delay: 0 }])],
  ['rest/system/security/role', [{ id: 1, name: 'AUDITOR', authorizations: [] }]],
  ['rest/system/user', dataTables([{ login: 'jdoe', roles: [] }])],
  ['rest/system/configuration', [{ name: 'my.key', value: 'v', source: 'database' }]],
  ['rest/node/status/subscription', []],
  ['rest/node', [TOOL, INSTANCE]],
  ['rest/system/plugin/schedule', {}],
  ['rest/system/plugin', [PLUGIN]],
]

function jsonResponse(body) {
  return {
    ok: true, status: 200,
    headers: { get: () => 'application/json' },
    clone() { return jsonResponse(body) },
    json: async () => body,
    text: async () => JSON.stringify(body),
  }
}

// Render-the-slot stubs: header actions, rows (+ their actions cog), table
// tools, dialogs (+ footer). The table stub requests its first page on mount
// and turns a row click into `row-click`.
const stubs = {
  LjPageHeader: { template: '<div class="hdr"><slot name="actions" /></div>' },
  LjButton: { emits: ['click'], template: '<button class="ljbtn" @click="$emit(\'click\')"><slot /></button>' },
  LjDialog: { props: ['modelValue'], template: '<div v-if="modelValue" class="ljdialog"><slot /><div class="foot"><slot name="footer" /></div></div>' },
  LjConfirmDialog: { props: ['modelValue'], template: '<div v-if="modelValue" class="confirm"><slot /></div>' },
  LigojConfirmDialog: { props: ['modelValue'], template: '<div v-if="modelValue" class="confirm"><slot /></div>' },
  RowActionsCog: { template: '<div class="cog"><slot /></div>' },
  LjDataTable: {
    props: ['items'],
    emits: ['update:options', 'row-click'],
    mounted() { this.$emit('update:options', { page: 1, itemsPerPage: 25, sortBy: [] }) },
    template: '<div class="vdt"><div v-for="(it, i) in items" :key="i" class="row" @click="$emit(\'row-click\', it)"><slot name="actions" :item="it" />'
      + '<span class="version-cell"><slot name="cell.version" :item="it" /></span></div><div class="tools"><slot name="tools-extra" /></div></div>',
  },
  LjSearch: true, LjSegmented: true, LjStatus: true, LjAvailabilityField: true, LigojTextField: true, LigojTextarea: true, LigojAutocomplete: true,
  LigojSelect: true, LigojCombobox: true, NodeIcon: true, NodeModeChip: true, SubscriptionStatus: true, PluginAutomationDialog: true,
  ProjectEditDialog: true, NodeEditDialog: true,
  'v-tooltip': true, 'v-icon': true, 'v-progress-circular': true, 'v-form': { template: '<form><slot /></form>' },
}

let t
function grant(...permissions) {
  useAuthStore().session = { roles: ['USER'], apiAuthorizations: permissions.map(([method, pattern]) => ({ method, pattern })) }
}
async function mountView(component, props) {
  const w = mount(component, { props, global: { stubs, mocks: { $router: { push: vi.fn() } } } })
  await flushPromises()
  return w
}
const texts = (w, selector) => w.findAll(selector).map((b) => b.text().trim())

beforeEach(() => {
  setActivePinia(createPinia())
  useI18nStore().merge(enMessages, 'en')
  t = useI18nStore().t
  globalThis.fetch = vi.fn((url, opts) => {
    if ((opts?.method || 'GET') !== 'GET') return Promise.resolve(jsonResponse({}))
    const match = RESPONSES.find(([prefix]) => String(url).includes(prefix))
    return Promise.resolve(jsonResponse(match ? match[1] : {}))
  })
})

// [view, label key, location selector, verb, pattern]
const ACTIONS = [
  [ProjectListView, 'project.new', '.hdr .ljbtn', 'POST', '^rest/project'],
  [ProjectListView, 'common.edit', '.row button', 'PUT', '^rest/project'],
  [ProjectListView, 'common.delete', '.row button', 'DELETE', '^rest/project'],
  [SystemHookView, 'system.hook.new', '.hdr .ljbtn', 'POST', '^rest/system/hook'],
  [SystemHookView, 'common.edit', '.row button', 'PUT', '^rest/system/hook'],
  [SystemHookView, 'common.delete', '.row button', 'DELETE', '^rest/system/hook'],
  [SystemRoleView, 'system.role.new', '.hdr .ljbtn', 'POST', '^rest/system/security/role'],
  [SystemRoleView, 'common.edit', '.row button', 'PUT', '^rest/system/security/role'],
  [SystemRoleView, 'common.delete', '.row button', 'DELETE', '^rest/system/security/role'],
  [SystemUserView, 'system.user.new', '.hdr .ljbtn', 'POST', '^rest/system/user'],
  [SystemUserView, 'common.edit', '.row button', 'PUT', '^rest/system/user'],
  [SystemUserView, 'profile.apiVerify', '.row button', 'GET', '^rest/system/security/role/withAuth'],
  [SystemUserView, 'common.delete', '.row button', 'DELETE', '^rest/system/user'],
  [SystemConfigurationView, 'system.config.new', '.hdr .ljbtn', 'POST', '^rest/system/configuration'],
  [SystemConfigurationView, 'common.edit', '.row button', 'POST', '^rest/system/configuration'],
  [SystemConfigurationView, 'common.delete', '.row button', 'DELETE', '^rest/system/configuration'],
  [SystemConfigurationView, 'system.config.encryptToggle', '.crypto .ck-title', 'POST', '^rest/system/security/crypto'],
  [SystemNodeView, 'system.node.new', '.hdr .ljbtn', 'POST', '^rest/node'],
  [SystemNodeView, 'system.node.refreshStatus', '.row button', 'POST', '^rest/node/status/refresh'],
  [SystemNodeView, 'system.node.refreshStatuses', '.tools button', 'POST', '^rest/node/status/refresh'],
  [SystemNodeView, 'system.node.createInstance', '.row button', 'POST', '^rest/node'],
  [SystemNodeView, 'common.edit', '.row button', 'PUT', '^rest/node'],
  [SystemNodeView, 'common.delete', '.row button', 'DELETE', '^rest/node'],
  [SystemPluginView, 'system.plugin.automation', '.hdr .ljbtn', 'PUT', '^rest/system/plugin/schedule'],
  [SystemPluginView, 'system.plugin.checkVersions', '.hdr .ljbtn', 'POST', '^rest/system/plugin/schedule/check'],
  [SystemPluginView, 'system.plugin.restart', '.hdr .ljbtn', 'PUT', '^rest/system/plugin/restart'],
  [SystemPluginView, 'system.plugin.upload', '.hdr .ljbtn', 'PUT', '^rest/system/plugin/upload'],
  [SystemPluginView, 'system.plugin.install', '.hdr .ljbtn', 'POST', '^rest/system/plugin'],
  [SystemPluginView, 'system.plugin.disable', '.row button', 'PUT', '^rest/system/plugin'],
  [SystemPluginView, 'system.plugin.delete', '.row button', 'DELETE', '^rest/system/plugin'],
]

describe('API-permission gating of the actions', () => {
  for (const [view, key, selector, method, pattern] of ACTIONS) {
    it(`${view.__name}: '${key}' needs ${method} ${pattern}`, async () => {
      grant()
      expect(texts(await mountView(view), selector)).not.toContain(t(key))
      grant([method, pattern])
      expect(texts(await mountView(view), selector)).toContain(t(key))
    })
  }

  it('a permission with a null method grants every verb', async () => {
    grant([null, '^rest/project'])
    const w = await mountView(ProjectListView)
    expect(texts(w, '.hdr .ljbtn')).toContain(t('project.new'))
    expect(texts(w, '.row button')).toEqual([t('common.edit'), t('common.delete')])
  })

  it('an administrator sees every action whatever the permissions', async () => {
    useAuthStore().session = { admin: true, apiAuthorizations: [] }
    const w = await mountView(SystemHookView)
    expect(texts(w, '.hdr .ljbtn')).toContain(t('system.hook.new'))
    expect(texts(w, '.row button')).toEqual([t('common.edit'), t('common.delete')])
  })

  for (const view of [ProjectListView, SystemHookView, SystemUserView, SystemConfigurationView, SystemNodeView, SystemPluginView]) {
    it(`${view.__name}: the row cog is hidden when none of its actions is allowed`, async () => {
      grant()
      const w = await mountView(view)
      expect(w.findAll('.row').length).toBeGreaterThan(0)
      expect(w.find('.row .cog').exists()).toBe(false)
    })
  }

  it('SystemRoleView keeps the cog for the local verification without any permission', async () => {
    grant()
    expect(texts(await mountView(SystemRoleView), '.row button')).toEqual([t('profile.apiVerify')])
  })
})

describe('API-permission gating of the edit dialogs', () => {
  // [view, verb, pattern] of the edit save (the dialog is opened by a row click)
  const SAVES = [
    [SystemHookView, 'PUT', '^rest/system/hook'],
    [SystemRoleView, 'PUT', '^rest/system/security/role'],
    [SystemUserView, 'PUT', '^rest/system/user'],
    [SystemConfigurationView, 'POST', '^rest/system/configuration'],
  ]
  for (const [view, method, pattern] of SAVES) {
    it(`${view.__name}: the row opens the dialog, saving needs ${method} ${pattern}`, async () => {
      grant()
      let w = await mountView(view)
      await w.find('.row').trigger('click')
      expect(w.find('.ljdialog').exists()).toBe(true)
      expect(texts(w, '.ljdialog .foot .ljbtn')).not.toContain(t('common.save'))
      grant([method, pattern])
      w = await mountView(view)
      await w.find('.row').trigger('click')
      expect(texts(w, '.ljdialog .foot .ljbtn')).toContain(t('common.save'))
    })
  }

  it('NodeEditDialog: updating needs PUT rest/node, creating needs POST rest/node', async () => {
    const edit = { modelValue: true, node: { ...INSTANCE, refined: TOOL } }
    const create = { modelValue: true, seed: null }
    const submit = (w) => w.findAll('.ljdialog .foot .ljbtn').filter((b) => [t('common.save'), t('wizard.action.createNode')].includes(b.text().trim()))
    grant(['POST', '^rest/node'])
    expect(submit(await mountView(NodeEditDialog, edit))).toHaveLength(0)
    expect(submit(await mountView(NodeEditDialog, create))).toHaveLength(1)
    grant(['PUT', '^rest/node'])
    expect(submit(await mountView(NodeEditDialog, edit))).toHaveLength(1)
    expect(submit(await mountView(NodeEditDialog, create))).toHaveLength(0)
  })
})

describe('API-permission gating of the plug-in version chips', () => {
  const calls = (method) => globalThis.fetch.mock.calls.filter((c) => (c[1]?.method || 'GET') === method).map((c) => String(c[0]))

  it('cancelling the staged version needs DELETE rest/system/plugin', async () => {
    grant()
    let w = await mountView(SystemPluginView)
    await w.find('.vchip.local').trigger('click')
    expect(calls('DELETE')).toEqual([])
    grant(['DELETE', '^rest/system/plugin'])
    w = await mountView(SystemPluginView)
    await w.find('.vchip.local').trigger('click')
    expect(calls('DELETE')).toEqual([expect.stringContaining('rest/system/plugin/plugin-build-jenkins/1.0.1')])
  })

  it('installing the new version needs POST rest/system/plugin', async () => {
    grant()
    let w = await mountView(SystemPluginView)
    await w.find('.vchip.up').trigger('click')
    expect(calls('POST')).toEqual([])
    grant(['POST', '^rest/system/plugin'])
    w = await mountView(SystemPluginView)
    await w.find('.vchip.up').trigger('click')
    expect(calls('POST')).toEqual([expect.stringContaining('rest/system/plugin/plugin-build-jenkins?')])
  })
})
