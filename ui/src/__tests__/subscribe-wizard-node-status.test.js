/*
 * Subscribe wizard: the instance select shows the last known status of each
 * instance, in the list and on the picked one, with the shared status dot.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { mount, flushPromises } from '@vue/test-utils'
import { useI18nStore, pluginRegistry } from '@ligoj/host'
import SubscribeWizardView from '../views/SubscribeWizardView.vue'
import enMessages from '../i18n/en.js'

function json(body) { return { ok: true, status: 200, headers: { get: () => 'application/json' }, json: () => Promise.resolve(body), text: () => Promise.resolve(JSON.stringify(body)) } }

const INSTANCES = [
  { id: 'service:qa:sonarqube:cloud', name: 'Cloud', mode: 'link', status: 'up' },
  { id: 'service:qa:sonarqube:local', name: 'Local', mode: 'link', status: 'down' },
]
// The instances carry their status only when the wizard asks for it
function respond(url) {
  const u = new URL(String(url), 'http://h/')
  const refined = u.searchParams.get('refined')
  if (refined === 'service') return { data: [{ id: 'service:qa', name: 'QA' }] }
  if (refined === 'service:qa') return { data: [{ id: 'service:qa:sonarqube', name: 'SonarQube' }] }
  if (refined === 'service:qa:sonarqube') return { data: INSTANCES.map(({ status, ...n }) => (u.searchParams.get('status') === 'true' ? { ...n, status } : n)) }
  return []
}

// Renders the selection and the item slots of every select; the status dot shows the node it was given
const stubs = {
  LjDialog: { props: ['modelValue'], template: '<div v-if="modelValue"><slot /><slot name="footer" /></div>' },
  LigojSelect: {
    props: ['items', 'modelValue'],
    template: '<div class="lsel"><div class="sel"><slot name="selection" :item="modelValue" /></div><div v-for="it in items" :key="it.id" class="it"><slot name="item" :item="it" :props="{}" /></div></div>',
  },
  'v-list-item': { props: ['title', 'subtitle'], template: '<div class="li"><slot name="prepend" />{{ title }}<slot name="append" /></div>' },
  SubscriptionStatus: { props: { node: Object, readonly: Boolean }, template: '<i class="nstatus" :data-node="node?.id" :data-status="node?.status" :data-readonly="String(readonly)" />' },
  NodeIcon: true, ParameterForm: true, LjSegmented: true, LjButton: true,
}

async function open() {
  const w = mount(SubscribeWizardView, { props: { modelValue: false, projectId: 1, projectName: 'P' }, global: { stubs } })
  await w.setProps({ modelValue: true })
  await flushPromises()
  return w
}
const instanceSelect = (w) => w.findAll('.lsel').at(2)
const dots = (el) => el.findAll('.nstatus').map((d) => `${d.attributes('data-node')}=${d.attributes('data-status')}`)

describe('SubscribeWizardView — instance status', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    useI18nStore().merge(enMessages, 'en')
    // The tool's bundle counts as loaded: the parameters load does not import it
    pluginRegistry.register('qa-sonarqube', { id: 'qa-sonarqube', install: () => {} })
    globalThis.fetch = vi.fn((url) => Promise.resolve(json(respond(url))))
  })

  it('asks the API for the status of the instances', async () => {
    await open()
    const urls = globalThis.fetch.mock.calls.map((c) => String(c[0]))
    expect(urls.find((u) => u.includes('refined=service%3Aqa%3Asonarqube'))).toContain('status=true')
  })

  it('shows the status of each listed instance and of the picked one', async () => {
    const w = await open()
    const select = instanceSelect(w)
    expect(dots(select.find('.sel'))).toEqual(['service:qa:sonarqube:cloud=up'])
    expect(select.findAll('.it').map(dots)).toEqual([['service:qa:sonarqube:cloud=up'], ['service:qa:sonarqube:local=down']])
  })

  it('shows the status only: a click on a dot picks or opens, it does not refresh', async () => {
    const w = await open()
    expect(instanceSelect(w).findAll('.nstatus').map((d) => d.attributes('data-readonly'))).toEqual(['true', 'true', 'true'])
  })

  it('shows no status on the service and tool selects', async () => {
    const w = await open()
    expect(dots(w.findAll('.lsel').at(0))).toEqual([])
    expect(dots(w.findAll('.lsel').at(1))).toEqual([])
  })
})
