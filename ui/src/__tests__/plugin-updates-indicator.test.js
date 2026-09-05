import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import { setActivePinia, createPinia } from 'pinia'
import { createRouter, createMemoryHistory } from 'vue-router'
import { useAuthStore, useI18nStore } from '@ligoj/host'
import en from '../i18n/en.js'
import PluginUpdatesIndicator from '../components/PluginUpdatesIndicator.vue'

const vuetify = createVuetify({ components })
const router = createRouter({ history: createMemoryHistory(), routes: [{ path: '/', component: { template: '<div />' } }, { path: '/system/plugin', component: { template: '<div />' } }] })

function mountWith(session) {
  useAuthStore().session = session
  return mount(PluginUpdatesIndicator, { global: { plugins: [vuetify, router] } })
}

describe('<PluginUpdatesIndicator /> (app-bar picto)', () => {
  beforeEach(() => { setActivePinia(createPinia()); useI18nStore().merge(en, 'en') })

  it('shows the badge to administrators when the last check found newer versions', async () => {
    const w = mountWith({ admin: true, applicationSettings: { data: { 'plugin-updates': 'plugin-b:2.0,plugin-a:1.5' } } })
    expect(w.find('button.pu-btn').exists()).toBe(true)
    expect(w.text()).toContain('2')
    expect(w.find('button').attributes('aria-label')).toContain('plugin-a 1.5, plugin-b 2.0')
    await w.find('button').trigger('click')
    await router.isReady()
    expect(router.currentRoute.value.path).toBe('/system/plugin')
  })

  it('renders nothing for non-administrators or without updates', () => {
    expect(mountWith({ admin: false, applicationSettings: { data: { 'plugin-updates': 'plugin-a:1.5' } } }).find('button').exists()).toBe(false)
    expect(mountWith({ admin: true, applicationSettings: { data: { 'plugin-updates': '' } } }).find('button').exists()).toBe(false)
    expect(mountWith({ admin: true }).find('button').exists()).toBe(false)
  })
})
