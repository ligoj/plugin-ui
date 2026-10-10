/*
 * Secured parameter values: the API redacts a stored secured value as "-secured-". Editing a node keeps such a value
 * untouched, unless the user explicitly replaces it: the save sends `{ parameter, untouched: true }`, never the
 * redaction marker, which would be stored as the new secret.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { mount, flushPromises } from '@vue/test-utils'
import { useAuthStore, useI18nStore, pluginRegistry } from '@ligoj/host'
import NodeEditDialog from '../views/NodeEditDialog.vue'
import ParameterForm from '../components/ParameterForm.vue'
import { UNTOUCHED, buildParamWire, missingMandatory } from '../utils/pluginParams.js'
import enMessages from '../i18n/en.js'

const OWNER = { id: 'service:qa:sonarqube', refined: { id: 'service:qa' }, mode: 'link' }
const param = (id, secured, mandatory = true) => ({ id, type: 'text', owner: OWNER, mandatory, secured, availableForNode: true })
const PASSWORD = param('service:qa:sonarqube:password', true)
const URL_ = param('service:qa:sonarqube:url', false)
const USER = param('service:qa:sonarqube:user', true)
// The response of GET rest/node/{id}/parameter-value/LINK: the secured values are redacted
const VALUES = [
  { text: '-secured-', parameter: PASSWORD },
  { text: 'http://localhost:9000', parameter: URL_ },
  { text: '-secured-', parameter: USER },
]
const NODE = { id: 'service:qa:sonarqube:local', name: 'SonarQube Local', mode: 'link', refined: { id: 'service:qa:sonarqube', refined: { id: 'service:qa' } } }

function response(body, status = 200) {
  return { ok: status < 300, status, headers: { get: () => 'application/json' }, clone() { return response(body, status) }, json: async () => body, text: async () => JSON.stringify(body) }
}

// The text inputs expose their bindings; the test types through their <input>
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
beforeEach(() => {
  setActivePinia(createPinia())
  useI18nStore().merge(enMessages, 'en')
  t = useI18nStore().t
  useAuthStore().session = { admin: true }
  // The tool bundle is already there: no dynamic import
  vi.spyOn(pluginRegistry, 'has').mockReturnValue(true)
  globalThis.fetch = vi.fn(async (url, opts) => {
    if ((opts?.method || 'GET') !== 'GET') return response(null, 204)
    if (String(url).includes('/parameter-value/')) return response(VALUES)
    return response([])
  })
})

const field = (w, p) => w.find(`.tf[data-label="${p.id} *"]`)
async function openEdit() {
  const w = mount(NodeEditDialog, { props: { modelValue: false, node: NODE }, global: { stubs } })
  await w.setProps({ modelValue: true })
  await flushPromises()
  return w
}
async function save(w) {
  await w.findAll('.foot .ljbtn').find((b) => b.text() === t('common.save')).trigger('click')
  await flushPromises()
  const put = fetch.mock.calls.find(([, o]) => o?.method === 'PUT')
  return JSON.parse(put[1].body).parameters
}

describe('the wire of a secured value', () => {
  it('an untouched value keeps the stored value, and counts as set', () => {
    expect(buildParamWire(PASSWORD, UNTOUCHED)).toEqual({ parameter: PASSWORD.id, untouched: true })
    expect(missingMandatory([PASSWORD], { [PASSWORD.id]: UNTOUCHED })).toEqual([])
  })
})

describe('editing a node with stored secured values', () => {
  it('shows a stored value as hidden and kept, never the redaction marker', async () => {
    const w = await openEdit()
    for (const p of [PASSWORD, USER]) {
      expect(field(w, p).find('input').element.value).toBe('')
      expect(field(w, p).find('input').attributes('readonly')).toBeDefined()
      const input = w.findAllComponents({ name: 'LigojTextField' }).find((c) => c.props('label') === `${p.id} *`)
      expect(input.props('placeholder')).toBe(t('wizard.params.securedStored'))
    }
    expect(field(w, URL_).find('input').element.value).toBe('http://localhost:9000')
  })

  it('saving after a change of another parameter keeps the stored values untouched', async () => {
    const w = await openEdit()
    await field(w, URL_).find('input').setValue('http://sonar.example.org')
    expect(await save(w)).toEqual([
      { parameter: PASSWORD.id, untouched: true },
      { parameter: URL_.id, text: 'http://sonar.example.org' },
      { parameter: USER.id, untouched: true },
    ])
  })

  it('a replaced value is sent, the other stored value stays untouched', async () => {
    const w = await openEdit()
    await field(w, PASSWORD).find(`button[aria-label="${t('wizard.params.securedReplace')}"]`).trigger('click')
    const input = field(w, PASSWORD).find('input')
    expect(input.attributes('readonly')).toBeUndefined()
    await input.setValue('new-secret')
    expect(await save(w)).toEqual([
      { parameter: PASSWORD.id, text: 'new-secret' },
      { parameter: URL_.id, text: 'http://localhost:9000' },
      { parameter: USER.id, untouched: true },
    ])
  })

  it('the replacement can be undone, keeping the stored value', async () => {
    const w = await openEdit()
    await field(w, PASSWORD).find(`button[aria-label="${t('wizard.params.securedReplace')}"]`).trigger('click')
    await field(w, PASSWORD).find('input').setValue('new-secret')
    await w.findAll('.pkeep').find((b) => b.text().includes(t('wizard.params.securedKeep'))).trigger('click')
    expect(field(w, PASSWORD).find('input').attributes('readonly')).toBeDefined()
    expect((await save(w))[0]).toEqual({ parameter: PASSWORD.id, untouched: true })
  })
})

describe('the replacement state of a stored secured value', () => {
  const OPTIONAL = param('service:qa:sonarqube:token', true, false)
  function mountForm(value) {
    return mount(ParameterForm, {
      props: { groups: [{ params: [OPTIONAL] }], values: { [OPTIONAL.id]: value }, stored: [OPTIONAL.id] },
      global: { stubs },
    })
  }

  it('says whether the stored value is replaced or removed', () => {
    expect(mountForm('x').find('.pstored').text()).toContain(t('wizard.params.securedReplacing'))
    // An optional value left empty is not sent: the API removes the stored value
    expect(mountForm('').find('.pstored').text()).toContain(t('wizard.params.securedRemoving'))
    expect(buildParamWire(OPTIONAL, '')).toBeNull()
    expect(mountForm(UNTOUCHED).find('.pstored').exists()).toBe(false)
  })

  it('emits the replacement and the undo', async () => {
    let w = mountForm(UNTOUCHED)
    await w.find(`button[aria-label="${t('wizard.params.securedReplace')}"]`).trigger('click')
    expect(w.emitted('update')).toEqual([[OPTIONAL.id, '']])
    w = mountForm('x')
    await w.find('.pkeep').trigger('click')
    expect(w.emitted('update')).toEqual([[OPTIONAL.id, UNTOUCHED]])
  })
})
