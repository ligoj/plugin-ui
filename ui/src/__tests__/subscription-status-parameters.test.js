/*
 * Parameters in the SubscriptionStatus tooltip: a plugin summarizes the values it
 * knows (`parameterSummary` feature, e.g. a JSON role mapping as "3 roles: ..."),
 * any other long value is cut, secrets stay masked.
 */
import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { useI18nStore, pluginRegistry } from '@ligoj/host'
import SubscriptionStatus from '../components/SubscriptionStatus.vue'
import enMessages from '../i18n/en.js'

const ROLES = '{\n  "admin": { "view-permissions": ["*"] },\n  "dev": { "view-permissions": ["browse"] },\n  "test": { "view-permissions": ["browse"] }\n}'
const LONG = 'https://registry.example.com/repository/' + 'a'.repeat(80)
// A subscription of the tool `service:sumtest:<tool>`
const sub = (tool) => ({
  id: 7, status: 'UP',
  node: { id: `service:sumtest:${tool}:local`, name: 'Local', refined: { id: `service:sumtest:${tool}`, name: tool } },
  parameters: { [`service:sumtest:${tool}:roles`]: ROLES, [`service:sumtest:${tool}:url`]: LONG, [`service:sumtest:${tool}:password`]: 'secret', [`service:sumtest:${tool}:name`]: 'repo' },
})
const stubs = {
  'v-tooltip': { template: '<div class="tt"><slot name="activator" :props="{}" /><div class="tip"><slot /></div></div>' },
  'v-icon': true, NodeIcon: true,
}
// The tool plugin: it summarizes its role mapping only
const toolPlugin = {
  id: 'sumtest-nexus',
  install: () => {},
  feature(action, ctx) {
    if (action !== 'parameterSummary') throw new Error(`Plugin "sumtest-nexus" has no feature "${action}"`)
    return ctx.parameter === 'service:sumtest:nexus:roles' ? `${Object.keys(JSON.parse(ctx.value)).length} roles` : null
  },
}
const values = (w) => Object.fromEntries(w.findAll('.sst-param').map((r) => [r.find('.sst-pk').text(), r.find('.sst-pv').text()]))

describe('SubscriptionStatus — parameter values', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    useI18nStore().merge(enMessages, 'en')
  })

  it('shows the summary the tool plugin gives, once its bundle is loaded', async () => {
    const w = mount(SubscriptionStatus, { props: { subscription: sub('nexus') }, global: { stubs } })
    pluginRegistry.register('sumtest-nexus', toolPlugin)
    await nextTick()
    expect(values(w)['service:sumtest:nexus:roles']).toBe('3 roles')
    expect(values(w)['service:sumtest:nexus:name']).toBe('repo')
  })

  it('cuts any other long value, a JSON one included', () => {
    // No plugin registered for this tool
    const w = mount(SubscriptionStatus, { props: { subscription: sub('raw') }, global: { stubs } })
    const url = values(w)['service:sumtest:raw:url']
    expect(url).toHaveLength(60)
    expect(url).toBe(LONG.slice(0, 59) + '…')
    // No plugin summary: the JSON is shown on one line, cut
    expect(values(w)['service:sumtest:raw:roles']).toBe('{ "admin": { "view-permissions": ["*"] }, "dev": { "view-pe…')
  })

  it('keeps the secrets masked', () => {
    pluginRegistry.register('sumtest-nexus', toolPlugin)
    const w = mount(SubscriptionStatus, { props: { subscription: sub('nexus') }, global: { stubs } })
    expect(values(w)['service:sumtest:nexus:password']).toBe('••••••')
  })
})
