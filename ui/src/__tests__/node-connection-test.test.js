/*
 * The connection test of the node dialog: the form is checked by the tool before it is saved
 * (POST rest/node/status/check, the save payload), the result is shown under the parameters.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { mount, flushPromises } from '@vue/test-utils'
import { useAuthStore, useErrorStore, useI18nStore, pluginRegistry } from '@ligoj/host'
import NodeEditDialog from '../views/NodeEditDialog.vue'
import enMessages from '../i18n/en.js'

const OWNER = { id: 'service:qa:sonarqube', refined: { id: 'service:qa' }, mode: 'link' }
const param = (id, secured) => ({ id, type: 'text', owner: OWNER, mandatory: true, secured, availableForNode: true })
const PASSWORD = param('service:qa:sonarqube:password', true)
const URL_ = param('service:qa:sonarqube:url', false)
const USER = param('service:qa:sonarqube:user', true)
const VALUES = [
  { text: '-secured-', parameter: PASSWORD },
  { text: 'http://localhost:9000', parameter: URL_ },
  { text: '-secured-', parameter: USER },
]
const INSTANCE = { id: 'service:qa:sonarqube:local', name: 'SonarQube Local', mode: 'link', refined: { id: 'service:qa:sonarqube', refined: { id: 'service:qa' } } }
const TOOL = { id: 'service:qa:sonarqube', name: 'SonarQube', mode: 'link', refined: { id: 'service:qa' } }

function response(body, status = 200) {
  return { ok: status < 300, status, headers: { get: (name) => (String(name).toLowerCase() === 'content-type' ? 'application/json' : null) }, clone() { return response(body, status) }, json: async () => body, text: async () => JSON.stringify(body) }
}

const stubs = {
  LjDialog: { props: ['modelValue'], template: '<div v-if="modelValue" class="ljdialog"><slot /><div class="foot"><slot name="footer" /></div></div>' },
  LjButton: { emits: ['click'], template: '<button class="ljbtn" @click="$emit(\'click\')"><slot /></button>' },
  LigojTextField: {
    name: 'LigojTextField',
    props: ['modelValue', 'label', 'readonly', 'placeholder', 'hint', 'type', 'rules', 'autofocus'],
    emits: ['update:modelValue'],
    template: '<div class="tf" :data-label="label"><input :value="modelValue" :readonly="readonly" @input="$emit(\'update:modelValue\', $event.target.value)" /><slot name="append-inner" /></div>',
  },
  'v-tooltip': { template: '<span class="tip"><slot name="activator" :props="{}" /></span>' },
  'v-btn': { emits: ['click'], template: '<button class="vbtn" @click="$emit(\'click\')"><slot /></button>' },
  LigojSelect: true, NodeIcon: true, NodeModeChip: true, LjSegmented: true, LjAvailabilityField: true,
  'v-icon': true, 'v-chip': true, 'v-checkbox': true, 'v-progress-circular': true,
}

let t
let check
beforeEach(() => {
  setActivePinia(createPinia())
  useI18nStore().merge({ ...enMessages, 'service:qa:sonarqube:user': 'User', 'error.rule.sonar-login': 'SonarQube refused these credentials' }, 'en')
  t = useI18nStore().t
  // The API offers the connection check
  useAuthStore().session = { admin: true, applicationSettings: { data: { 'node-connection-check': 'true' } } }
  vi.spyOn(pluginRegistry, 'has').mockReturnValue(true)
  check = { up: true }
  globalThis.fetch = vi.fn(async (url, opts) => {
    if (opts?.method === 'POST' && String(url).includes('rest/node/status/check')) return response(check)
    if ((opts?.method || 'GET') !== 'GET') return response(null, 204)
    if (String(url).includes('/parameter-value/')) return response(VALUES)
    return response([])
  })
})

async function openEdit(node = INSTANCE) {
  const w = mount(NodeEditDialog, { props: { modelValue: false, node }, global: { stubs } })
  await w.setProps({ modelValue: true })
  await flushPromises()
  return w
}
const testButton = (w) => w.findAll('.foot .ljbtn').find((b) => b.text() === t('system.node.test.action'))
async function runTest(w) {
  await testButton(w).trigger('click')
  await flushPromises()
}
const field = (w, p) => w.find(`.tf[data-label="${p.id} *"]`)
// The result is a toast: the snackbar stack of the host
const toasts = () => useErrorStore().errors
const ofNode = expect.objectContaining({ id: INSTANCE.id })

describe('the connection test of a node', () => {
  it('sends the save payload with the stored secrets untouched, and saves nothing', async () => {
    const w = await openEdit()
    await field(w, URL_).find('input').setValue('http://sonar.example.org')
    await runTest(w)
    const posts = fetch.mock.calls.filter(([, o]) => o?.method === 'POST')
    expect(posts.map(([u]) => String(u))).toEqual(['rest/node/status/check'])
    expect(JSON.parse(posts[0][1].body)).toEqual({
      id: INSTANCE.id, node: 'service:qa:sonarqube', name: INSTANCE.name, mode: 'LINK', untouchedParameters: false,
      parameters: [
        { parameter: PASSWORD.id, untouched: true },
        { parameter: URL_.id, text: 'http://sonar.example.org' },
        { parameter: USER.id, untouched: true },
      ],
    })
    expect(fetch.mock.calls.some(([, o]) => o?.method === 'PUT')).toBe(false)
  })

  it('shows a successful connection as a toast of the node, nothing in the form', async () => {
    const w = await openEdit()
    await runTest(w)
    expect(toasts()).toEqual([expect.objectContaining({ severity: 'success', message: t('system.node.test.up'), node: ofNode })])
    expect(w.find('.testline').exists()).toBe(false)
  })

  it('names the faulty parameter with the translated rule', async () => {
    check = { up: false, errors: { [USER.id]: [{ rule: 'sonar-login' }] } }
    const w = await openEdit()
    await runTest(w)
    expect(toasts()).toEqual([expect.objectContaining({
      severity: 'error', title: t('system.node.test.down'), message: 'User: SonarQube refused these credentials', node: ofNode,
    })])
  })

  it('shows a failure with its reason', async () => {
    check = { up: false, message: 'node-check-failed' }
    const w = await openEdit()
    await runTest(w)
    expect(toasts()).toEqual([expect.objectContaining({ severity: 'error', title: t('system.node.test.down'), message: t('error.node-check-failed') })])
  })

  it('shows a failure without any reason', async () => {
    check = { up: false }
    const w = await openEdit()
    await runTest(w)
    expect(toasts()).toEqual([expect.objectContaining({ severity: 'error', title: null, message: t('system.node.test.down') })])
  })

  it('is disabled while a mandatory parameter is missing', async () => {
    const w = await openEdit()
    await field(w, PASSWORD).find(`button[aria-label="${t('wizard.params.securedReplace')}"]`).trigger('click')
    expect(testButton(w).attributes('disabled')).toBeDefined()
  })

  it('is offered for an instance only, with the permission', async () => {
    expect(testButton(await openEdit(TOOL))).toBeUndefined()
    useAuthStore().session = { roles: ['USER'], applicationSettings: { data: { 'node-connection-check': 'true' } }, apiAuthorizations: [{ method: 'PUT', pattern: '^rest/node' }] }
    expect(testButton(await openEdit())).toBeUndefined()
    useAuthStore().session = { roles: ['USER'], applicationSettings: { data: { 'node-connection-check': 'true' } }, apiAuthorizations: [{ method: 'PUT', pattern: '^rest/node' }, { method: 'POST', pattern: '^rest/node/status/check' }] }
    expect(testButton(await openEdit())).toBeDefined()
  })

  it('is not offered by an API without the connection check', async () => {
    // An older API would answer a 404, read as a failed connection
    useAuthStore().session = { admin: true, applicationSettings: { data: {} } }
    expect(testButton(await openEdit())).toBeUndefined()
  })

  it('says a tool cannot test a connection, never a false success', async () => {
    check = { up: false, message: 'node-check-unsupported' }
    const w = await openEdit()
    await runTest(w)
    expect(toasts()).toEqual([expect.objectContaining({ severity: 'info', message: t('system.node.test.unsupported'), node: ofNode })])
  })

  it('gives no verdict on a refused request: the error is reported as for a save', async () => {
    globalThis.fetch = vi.fn(async (url, opts) => {
      if (opts?.method === 'POST') return response({ errors: { name: [{ rule: 'NotBlank' }] } }, 400)
      if (String(url).includes('/parameter-value/')) return response(VALUES)
      return response([])
    })
    const w = await openEdit()
    await runTest(w)
    // Only the refusal, toasted as for a save
    expect(toasts().filter((e) => e.severity !== 'error' || e.title === t('system.node.test.down'))).toEqual([])
  })

  it('drops a result arriving after a change of the form', async () => {
    let release
    globalThis.fetch = vi.fn(async (url, opts) => {
      if (opts?.method === 'POST') return new Promise((resolve) => { release = () => resolve(response({ up: true })) })
      if (String(url).includes('/parameter-value/')) return response(VALUES)
      return response([])
    })
    const w = await openEdit()
    await testButton(w).trigger('click')
    await field(w, URL_).find('input').setValue('http://changed-while-testing')
    release()
    await flushPromises()
    // The answer was about the former URL
    expect(toasts()).toEqual([])
  })

  it('a new node: tested once it has a name and an identifier of its own', async () => {
    const w = mount(NodeEditDialog, { props: { modelValue: false, seed: { service: { id: 'service:qa', name: 'QA' }, tool: TOOL } }, global: { stubs } })
    await w.setProps({ modelValue: true })
    await flushPromises()
    // The identifier is still the tool's prefix, and there is no name: a check would only be refused
    expect(testButton(w).attributes('disabled')).toBeDefined()
    w.vm.form.name = 'Sonar 2'
    await flushPromises()
    expect(testButton(w).attributes('disabled')).toBeDefined()
    w.vm.form.id = 'service:qa:sonarqube:sonar2'
    await flushPromises()
    expect(testButton(w).attributes('disabled')).toBeUndefined()
  })
})
