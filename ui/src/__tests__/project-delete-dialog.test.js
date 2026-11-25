/*
 * Project deletion dialog: the subscriptions removed with the project are counted, and the remote-data option of
 * the unsubscribe dialog is offered only when at least one of them was created by Ligoj (CREATE mode).
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { mount, flushPromises } from '@vue/test-utils'
import { useAuthStore, useI18nStore, useErrorStore } from '@ligoj/host'
import ProjectDeleteDialog from '../views/ProjectDeleteDialog.vue'
import enMessages from '../i18n/en.js'

const JENKINS = { id: 'service:build:jenkins:1', name: 'CI', refined: { id: 'service:build:jenkins', name: 'Jenkins' } }
const SONAR = { id: 'service:qa:sonarqube:1', name: 'QA', refined: { id: 'service:qa:sonarqube', name: 'SonarQube' } }
const CREATED = { id: 1, mode: 'create', node: JENKINS }
const CREATED_2 = { id: 3, mode: 'CREATE', node: SONAR }
const LINKED = { id: 2, mode: 'link', node: JENKINS }

function json(body) { return { ok: true, status: 200, headers: { get: () => 'application/json' }, json: () => Promise.resolve(body), text: () => Promise.resolve(JSON.stringify(body)) } }
const ConfirmStub = { props: ['modelValue', 'title', 'loading'], emits: ['confirm', 'update:modelValue'], template: '<div v-if="modelValue" class="confirm"><slot /></div>' }
const CheckboxStub = { props: ['modelValue', 'label'], emits: ['update:modelValue'], template: '<label class="remote"><input type="checkbox" :checked="modelValue" @change="$emit(\'update:modelValue\', $event.target.checked)" />{{ label }}</label>' }

/** Mount the closed dialog, then open it on the project: its detail is fetched at that time. */
async function openDialog(detail, { failDetail = false } = {}) {
  globalThis.fetch = vi.fn((url, opts) => {
    if ((opts?.method || 'GET') === 'DELETE') return Promise.resolve({ ok: true, status: 204, headers: { get: () => null }, json: () => Promise.resolve(null), text: () => Promise.resolve('') })
    if (failDetail) return Promise.resolve({ ok: false, status: 500, headers: { get: () => 'application/json' }, json: () => Promise.resolve({}), text: () => Promise.resolve('{}') })
    return Promise.resolve(json(detail))
  })
  const w = mount(ProjectDeleteDialog, {
    props: { modelValue: false, project: { id: 401, name: 'Alpha' } },
    global: { stubs: { LjConfirmDialog: ConfirmStub, 'v-checkbox': CheckboxStub } },
  })
  await w.setProps({ modelValue: true })
  await flushPromises()
  return w
}
function calls(method) { return globalThis.fetch.mock.calls.filter((c) => (c[1]?.method || 'GET') === method).map((c) => String(c[0])) }
function toasts() { return useErrorStore().errors.filter((e) => e.severity === 'success').map((e) => e.message) }
async function confirm(w) {
  w.findComponent(ConfirmStub).vm.$emit('confirm')
  await flushPromises()
}

describe('ProjectDeleteDialog', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    useI18nStore().merge(enMessages, 'en')
    useAuthStore().session = { admin: true }
  })

  it('does not load the project while closed', async () => {
    globalThis.fetch = vi.fn(() => Promise.resolve(json({})))
    mount(ProjectDeleteDialog, { props: { modelValue: false, project: { id: 401, name: 'Alpha' } }, global: { stubs: { LjConfirmDialog: ConfirmStub, 'v-checkbox': CheckboxStub } } })
    await flushPromises()
    expect(globalThis.fetch).not.toHaveBeenCalled()
  })

  it('counts the subscriptions and offers the remote-data option, sent only when checked', async () => {
    const w = await openDialog({ id: 401, name: 'Alpha', subscriptions: [CREATED, LINKED, CREATED_2] })
    expect(calls('GET')).toEqual(['rest/project/401'])
    expect(w.find('.confirm').text()).toContain('Are you sure you want to delete Alpha?')
    expect(w.find('.pd-subs').text()).toBe('3')
    expect(w.find('.pd-created').text()).toBe('2')
    expect(w.find('.remote').exists()).toBe(true)
    expect(w.find('.remote').text()).toContain('2')

    // Unchecked by default: plain deletion
    await confirm(w)
    expect(calls('DELETE')).toEqual(['rest/project/401'])
    expect(toasts()).toEqual(['Project Alpha deleted'])
    expect(w.emitted('deleted')).toHaveLength(1)
    expect(w.emitted('update:modelValue').at(-1)).toEqual([false])
  })

  it('forwards the option when checked, and resets it at the next opening', async () => {
    const w = await openDialog({ id: 401, name: 'Alpha', subscriptions: [CREATED] })
    await w.find('.remote input').setValue(true)
    await confirm(w)
    expect(calls('DELETE')).toEqual(['rest/project/401?deleteRemoteData=true'])
    expect(toasts()).toEqual(['Project Alpha deleted, with the remote data of its 1 created subscription(s)'])

    // Reopened: unchecked again
    await w.setProps({ modelValue: false })
    await w.setProps({ modelValue: true })
    await flushPromises()
    expect(w.find('.remote input').element.checked).toBe(false)
  })

  it('has no option when the project only links its subscriptions', async () => {
    const w = await openDialog({ id: 401, name: 'Alpha', subscriptions: [LINKED] })
    expect(w.find('.pd-subs').text()).toBe('1')
    expect(w.find('.pd-created').exists()).toBe(false)
    expect(w.find('.remote').exists()).toBe(false)
    await confirm(w)
    expect(calls('DELETE')).toEqual(['rest/project/401'])
  })

  it('has no counter and no option for a project without subscription', async () => {
    const w = await openDialog({ id: 401, name: 'Alpha', subscriptions: [] })
    expect(w.find('.pd-subs').exists()).toBe(false)
    expect(w.find('.remote').exists()).toBe(false)
  })

  it('offers the option only for the created subscriptions whose tool plugin is installed', async () => {
    useAuthStore().session = { admin: true, applicationSettings: { plugins: ['service:build:jenkins'] } }
    const w = await openDialog({ id: 401, name: 'Alpha', subscriptions: [CREATED, CREATED_2] })
    // SonarQube plugin is missing: its data cannot be deleted
    expect(w.find('.pd-created').text()).toBe('2')
    expect(w.find('.remote').text()).toContain('1')
    expect(w.find('.pd-missing').exists()).toBe(true)

    useAuthStore().session = { admin: true, applicationSettings: { plugins: [] } }
    const none = await openDialog({ id: 401, name: 'Alpha', subscriptions: [CREATED] })
    expect(none.find('.remote').exists()).toBe(false)
    expect(none.find('.pd-missing').exists()).toBe(true)
  })

  it('still deletes without option when the project detail cannot be loaded', async () => {
    const w = await openDialog(null, { failDetail: true })
    expect(w.find('.pd-subs').exists()).toBe(false)
    expect(w.find('.remote').exists()).toBe(false)
    await confirm(w)
    expect(calls('DELETE')).toEqual(['rest/project/401'])
  })

  it('does nothing without project', async () => {
    const w = await openDialog({})
    await w.setProps({ project: null })
    await confirm(w)
    expect(calls('DELETE')).toEqual([])
  })
})
