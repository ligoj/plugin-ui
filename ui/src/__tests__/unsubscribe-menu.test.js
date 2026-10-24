/*
 * The row menu of a subscription, on the project page and on the home page: it offers to unsubscribe, with the
 * remote-data option only for a subscription Ligoj created whose tool plugin is installed. Without that plugin,
 * only the subscription is removed, and the dialog says so.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { mount, flushPromises } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import { useAuthStore, useI18nStore } from '@ligoj/host'
import UnsubscribeMenu from '../components/UnsubscribeMenu.vue'
import SubscriptionGroupCard from '../components/SubscriptionGroupCard.vue'
import SubscriptionsPanel from '../components/SubscriptionsPanel.vue'
import HomeView from '../views/HomeView.vue'
import { isToolPluginInstalled } from '../utils/subscriptionPlugin.js'
import enMessages from '../i18n/en.js'

const NODE = { id: 'service:build:jenkins:1', name: 'CI', refined: { id: 'service:build:jenkins', name: 'Jenkins' } }
const CREATED = { id: 1, status: 'UP', mode: 'create', node: NODE }
const EVENT = { currentTarget: { getBoundingClientRect: () => ({ right: 300, bottom: 40 }) } }

function json(body) { return { ok: true, status: 200, headers: { get: () => 'application/json' }, json: () => Promise.resolve(body), text: () => Promise.resolve(JSON.stringify(body)) } }
const NO_CONTENT = { ok: true, status: 204, headers: { get: () => null }, json: () => Promise.resolve(null), text: () => Promise.resolve('') }
const ConfirmStub = { props: ['modelValue', 'title', 'loading'], emits: ['confirm', 'update:modelValue'], template: '<div v-if="modelValue" class="confirm"><slot /></div>' }
const CheckboxStub = { props: ['modelValue', 'label'], emits: ['update:modelValue'], template: '<label class="remote"><input type="checkbox" :checked="modelValue" @change="$emit(\'update:modelValue\', $event.target.checked)" />{{ label }}</label>' }
const stubs = { LjConfirmDialog: ConfirmStub, 'v-checkbox': CheckboxStub, 'v-icon': true }
const deletes = () => globalThis.fetch.mock.calls.filter((c) => c[1]?.method === 'DELETE').map((c) => String(c[0]))

beforeEach(() => {
  setActivePinia(createPinia())
  useI18nStore().merge(enMessages, 'en')
  globalThis.fetch = vi.fn((url, opts) => Promise.resolve((opts?.method || 'GET') === 'DELETE' ? NO_CONTENT : json({})))
})

// The session lists the installed backend plugins
const install = (...plugins) => { useAuthStore().session = { admin: true, applicationSettings: { plugins } } }

describe('isToolPluginInstalled', () => {
  it('reads the tool plugin of the subscription in the installed plugins', () => {
    expect(isToolPluginInstalled(CREATED, ['service:build', 'service:build:jenkins'])).toBe(true)
    // The service plugin alone does not handle the data of the tool
    expect(isToolPluginInstalled(CREATED, ['service:build'])).toBe(false)
    // Unknown: an older API, or no tool in the node
    expect(isToolPluginInstalled(CREATED, undefined)).toBe(true)
    expect(isToolPluginInstalled({ id: 3, node: { id: 'service:build' } }, ['service:build'])).toBe(true)
  })
})

describe('UnsubscribeMenu', () => {
  async function openDialog(sub) {
    const w = mount(UnsubscribeMenu, { global: { stubs } })
    w.vm.open(EVENT, sub)
    await flushPromises()
    expect(w.findAll('.rowmenu button').map((b) => b.text())).toEqual(['Unsubscribe'])
    await w.find('.rowmenu button').trigger('click')
    await flushPromises()
    return w
  }

  it('offers the remote data of a created subscription when its tool plugin is installed', async () => {
    install('service:build', 'service:build:jenkins')
    const w = await openDialog(CREATED)
    expect(w.find('.confirm').text()).toContain('Remove subscription to CI?')
    expect(w.find('.remote').exists()).toBe(true)
    expect(w.find('.unsub-missing').exists()).toBe(false)
  })

  it('only removes the subscription when its tool plugin is missing, and tells it', async () => {
    install('service:build')
    const w = await openDialog(CREATED)
    expect(w.find('.remote').exists()).toBe(false)
    expect(w.find('.unsub-missing').text()).toContain('The plugin of this tool is not installed')
    w.findComponent(ConfirmStub).vm.$emit('confirm')
    await flushPromises()
    expect(deletes()).toEqual(['rest/subscription/1'])
    expect(w.emitted('unsubscribed')).toHaveLength(1)
  })
})

describe('the home page row menu', () => {
  it('unsubscribes from the home page too, then reloads the subscriptions', async () => {
    install('service:build')
    globalThis.fetch = vi.fn((url, opts) => {
      if ((opts?.method || 'GET') === 'DELETE') return Promise.resolve(NO_CONTENT)
      if (String(url) === 'rest/subscription') return Promise.resolve(json({ nodes: [], projects: [], subscriptions: [] }))
      return Promise.resolve(json({}))
    })
    const router = createRouter({ history: createMemoryHistory(), routes: [{ path: '/:pathMatch(.*)*', component: { template: '<div />' } }] })
    const w = mount(HomeView, { shallow: true, global: { plugins: [router], stubs: { ...stubs, UnsubscribeMenu: false } } })
    await flushPromises()
    const panel = w.findComponent(SubscriptionsPanel)
    expect(panel.props('cog')).toBe(true)
    panel.vm.$emit('rowmenu', { event: EVENT, sub: { id: 7, node: NODE } })
    await flushPromises()
    await w.find('.rowmenu button').trigger('click')
    await flushPromises()
    w.findComponent(ConfirmStub).vm.$emit('confirm')
    await flushPromises()
    expect(deletes()).toEqual(['rest/subscription/7'])
    expect(globalThis.fetch.mock.calls.filter((c) => String(c[0]) === 'rest/subscription')).toHaveLength(2)
  })
})

describe('SubscriptionGroupCard', () => {
  it('hides the row menu button when the panel has no menu', () => {
    const group = { key: 'k', name: 'Jenkins', rows: [{ name: 'P', status: 'ok', pills: [], sub: { id: 1, node: NODE } }] }
    const card = (props) => mount(SubscriptionGroupCard, { shallow: true, props: { group, ...props } })
    expect(card({}).find('.rowcog').exists()).toBe(true)
    expect(card({ cog: false }).find('.rowcog').exists()).toBe(false)
  })
})
