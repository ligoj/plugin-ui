/*
 * Mode of an existing node: a LINK or CREATE node widens to ALL, keeping the subscriptions created on it. A node in ALL
 * mode lists the parameters of every mode, the ones of a single mode being optional there.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { mount, flushPromises } from '@vue/test-utils'
import { useAuthStore, useI18nStore, pluginRegistry } from '@ligoj/host'
import NodeEditDialog from '../views/NodeEditDialog.vue'
import enMessages from '../i18n/en.js'
import { modeTransitions, nodeModeParameters } from '../utils/subscriptionModes.js'

function response(body, status = 200) {
  return { ok: status < 300, status, headers: { get: () => 'application/json' }, clone() { return response(body, status) }, json: async () => body, text: async () => JSON.stringify(body) }
}

const TOOL = { id: 'service:id:ldap', mode: 'all', refined: { id: 'service:id', mode: 'all' } }
const node = (mode, tool = TOOL) => ({ id: 'service:id:ldap:local', name: 'LDAP', mode, refined: tool })
const URL_PARAM = { id: 'service:id:ldap:url', type: 'text', mandatory: true, mode: 'all', availableForNode: true }
const OU = { id: 'service:id:ou', type: 'text', mandatory: true, mode: 'create', availableForNode: true }
// GET rest/node/{id}/parameter-value/{mode}: an ALL node lists the parameters of every mode
const VALUES = {
  LINK: [{ parameter: URL_PARAM, text: 'ldap://old' }],
  ALL: [{ parameter: URL_PARAM, text: 'ldap://old' }, { parameter: OU }],
}

const stubs = {
  LjDialog: { props: ['modelValue'], template: '<div v-if="modelValue" class="ljdialog"><slot /><div class="foot"><slot name="footer" /></div></div>' },
  LjButton: { emits: ['click'], template: '<button class="ljbtn" @click="$emit(\'click\')"><slot /></button>' },
  LjSegmented: { name: 'LjSegmented', props: ['modelValue', 'options'], emits: ['update:modelValue'], template: '<div class="seg" />' },
  NodeModeChip: { name: 'NodeModeChip', props: ['mode'], template: '<span class="modechip" />' },
  ParameterForm: { name: 'ParameterForm', props: ['groups', 'values'], emits: ['update'], template: '<div class="pform" />' },
  LigojSelect: true, LigojTextField: true, NodeIcon: true, LjAvailabilityField: true,
  'v-icon': true, 'v-progress-circular': true, 'v-chip': true, 'v-tooltip': true,
}

let t
beforeEach(() => {
  setActivePinia(createPinia())
  useI18nStore().merge(enMessages, 'en')
  useI18nStore().setLocale('en')
  t = useI18nStore().t
  useAuthStore().session = { admin: true }
  vi.spyOn(pluginRegistry, 'has').mockReturnValue(true)
  globalThis.fetch = vi.fn(async (url, opts) => {
    if ((opts?.method || 'GET') !== 'GET') return response(null, 204)
    const mode = /\/parameter-value\/(\w+)/.exec(String(url))?.[1]
    return response(VALUES[mode] || [])
  })
})

describe('modeTransitions', () => {
  it('widens a LINK or CREATE node to ALL under an ALL parent', () => {
    expect(modeTransitions('link', 'all')).toEqual(['link', 'all'])
    expect(modeTransitions('CREATE', 'ALL')).toEqual(['create', 'all'])
    // A service has no parent: nothing bounds it
    expect(modeTransitions('link', undefined)).toEqual(['link', 'all'])
  })

  it('keeps any other mode', () => {
    expect(modeTransitions('all', 'all')).toEqual([])
    expect(modeTransitions('none', 'all')).toEqual([])
    expect(modeTransitions('link', 'link')).toEqual([])
  })
})

describe('nodeModeParameters', () => {
  it('makes the parameters of a single mode optional on an ALL node', () => {
    const [url, ou] = nodeModeParameters([URL_PARAM, OU], 'all')
    expect(url.mandatory).toBe(true)
    expect(ou.mandatory).toBe(false)
  })

  it('keeps them mandatory on a node of that mode', () => {
    expect(nodeModeParameters([OU], 'create')[0].mandatory).toBe(true)
  })
})

describe('NodeEditDialog mode of an existing node', () => {
  async function openEdit(n) {
    const w = mount(NodeEditDialog, { props: { modelValue: false, node: n }, global: { stubs } })
    await w.setProps({ modelValue: true })
    await flushPromises()
    return w
  }

  it('offers ALL to a LINK node under an ALL tool', async () => {
    const seg = (await openEdit(node('link'))).findComponent({ name: 'LjSegmented' })
    expect(seg.exists()).toBe(true)
    expect(seg.props('options').map((o) => o.value)).toEqual(['link', 'all'])
    expect(seg.props('modelValue')).toBe('link')
  })

  it('keeps the mode read-only otherwise', async () => {
    for (const n of [node('all'), node('none'), node('link', { ...TOOL, mode: 'link' })]) {
      const w = await openEdit(n)
      expect(w.findComponent({ name: 'LjSegmented' }).exists()).toBe(false)
      expect(w.findComponent({ name: 'NodeModeChip' }).exists()).toBe(true)
    }
  })

  it('widens to ALL with the parameters of every mode, keeping the typed values', async () => {
    const w = await openEdit(node('link'))
    w.findComponent({ name: 'ParameterForm' }).vm.$emit('update', URL_PARAM.id, 'ldap://new')
    w.findComponent({ name: 'LjSegmented' }).vm.$emit('update:modelValue', 'all')
    await flushPromises()
    expect(fetch.mock.calls.some(([url]) => String(url).includes('/parameter-value/ALL'))).toBe(true)

    await w.findAll('.foot .ljbtn').find((b) => b.text() === t('common.save')).trigger('click')
    await flushPromises()
    // Saved without the optional CREATE parameter left empty
    const put = fetch.mock.calls.find(([, o]) => o?.method === 'PUT')
    expect(put).toBeTruthy()
    const body = JSON.parse(put[1].body)
    expect(body.mode).toBe('ALL')
    expect(body.parameters).toEqual([{ parameter: URL_PARAM.id, text: 'ldap://new' }])
  })
})
