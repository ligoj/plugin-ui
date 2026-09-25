/*
 * Unsubscribe from the project page: an explicit confirmation dialog, with the
 * remote-data option only for a subscription Ligoj created (CREATE mode).
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { mount, flushPromises } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import { useI18nStore, useErrorStore } from '@ligoj/host'
import ProjectDetailView from '../views/ProjectDetailView.vue'
import enMessages from '../i18n/en.js'

const NODE = { id: 'service:build:jenkins:1', name: 'CI', refined: { id: 'service:build:jenkins', name: 'Jenkins' } }
const CREATED = { id: 1, status: 'UP', mode: 'create', node: NODE }
const LINKED = { id: 2, status: 'UP', mode: 'link', node: NODE }

function json(body) { return { ok: true, status: 200, headers: { get: () => 'application/json' }, json: () => Promise.resolve(body), text: () => Promise.resolve(JSON.stringify(body)) } }
const ConfirmStub = { props: ['modelValue', 'title', 'loading'], emits: ['confirm', 'update:modelValue'], template: '<div v-if="modelValue" class="confirm"><slot /></div>' }
const CheckboxStub = { props: ['modelValue', 'label'], emits: ['update:modelValue'], template: '<label class="remote"><input type="checkbox" :checked="modelValue" @change="$emit(\'update:modelValue\', $event.target.checked)" />{{ label }}</label>' }

async function mountView(project) {
  globalThis.fetch = vi.fn((url, opts) => {
    if ((opts?.method || 'GET') === 'DELETE') return Promise.resolve({ ok: true, status: 204, headers: { get: () => null }, json: () => Promise.resolve(null), text: () => Promise.resolve('') })
    if (String(url).includes('status/refresh')) return Promise.resolve(json({}))
    return Promise.resolve(json(project))
  })
  const router = createRouter({ history: createMemoryHistory(), routes: [{ path: '/project/:id', component: { template: '<div />' } }] })
  await router.push('/project/401')
  const w = mount(ProjectDetailView, { shallow: true, global: { plugins: [router], stubs: { LjConfirmDialog: ConfirmStub, 'v-checkbox': CheckboxStub } } })
  await flushPromises()
  return w
}
function deletes() { return globalThis.fetch.mock.calls.filter((c) => c[1]?.method === 'DELETE').map((c) => String(c[0])) }

describe('ProjectDetailView — unsubscribe dialog', () => {
  beforeEach(() => { setActivePinia(createPinia()); useI18nStore().merge(enMessages, 'en') })

  it('offers the remote-data option for a created subscription and sends it only when checked', async () => {
    const w = await mountView({ id: 401, name: 'P', subscriptions: [CREATED] })
    w.vm.openRowMenu({ currentTarget: { getBoundingClientRect: () => ({ right: 0, bottom: 0 }) } }, CREATED)
    w.vm.deleteSub()
    await flushPromises()
    expect(w.find('.confirm').exists()).toBe(true)
    expect(w.find('.confirm').text()).toContain('Remove subscription to CI?')
    expect(w.find('.remote').exists()).toBe(true)
    expect(deletes()).toEqual([])

    // Unchecked: plain deletion, confirmed by a toast
    w.findComponent(ConfirmStub).vm.$emit('confirm')
    await flushPromises()
    expect(deletes()).toEqual(['rest/subscription/1'])
    const toasts = () => useErrorStore().errors.filter((e) => e.severity === 'success').map((e) => e.message)
    expect(toasts()).toEqual(['Subscription to CI removed'])

    // Checked: the flag travels with the request
    w.vm.deleteSub(); w.vm.openRowMenu({ currentTarget: { getBoundingClientRect: () => ({ right: 0, bottom: 0 }) } }, CREATED); w.vm.deleteSub()
    await flushPromises()
    await w.find('.remote input').setValue(true)
    w.findComponent(ConfirmStub).vm.$emit('confirm')
    await flushPromises()
    expect(deletes().at(-1)).toBe('rest/subscription/1?deleteRemoteData=true')
    // A distinct confirmation when the remote data were deleted too
    expect(toasts().at(-1)).toBe('Subscription to CI removed and its remote data deleted on the target service')
  })

  it('has no remote-data option for a linked subscription', async () => {
    const w = await mountView({ id: 401, name: 'P', subscriptions: [LINKED] })
    w.vm.openRowMenu({ currentTarget: { getBoundingClientRect: () => ({ right: 0, bottom: 0 }) } }, LINKED)
    w.vm.deleteSub()
    await flushPromises()
    expect(w.find('.confirm').exists()).toBe(true)
    expect(w.find('.remote').exists()).toBe(false)
    w.findComponent(ConfirmStub).vm.$emit('confirm')
    await flushPromises()
    expect(deletes()).toEqual(['rest/subscription/2'])
    expect(useErrorStore().errors.filter((e) => e.severity === 'success').map((e) => e.message)).toEqual(['Subscription to CI removed'])
  })
})
