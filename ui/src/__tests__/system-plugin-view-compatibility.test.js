/*
 * A plug-in the host loader refused, because it imports exports this host lacks, is marked in the plug-in view with
 * the missing names and the host version.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { mount, flushPromises } from '@vue/test-utils'
import { useAuthStore, useI18nStore } from '@ligoj/host'
import { registerHostModules, checkBundle, _resetCompatibility } from '@/plugins/compatibility.js'
import SystemPluginView from '../views/SystemPluginView.vue'
import enMessages from '../i18n/en.js'

const SONAR = { plugin: { artifact: 'plugin-qa-sonarqube', version: '1.1.0', type: 'TOOL' }, node: { id: 'service:qa:sonarqube', name: 'SonarQube' }, disabled: false, loaded: true }
const JENKINS = { plugin: { artifact: 'plugin-build-jenkins', version: '1.0.0', type: 'TOOL' }, node: { id: 'service:build:jenkins', name: 'Jenkins' }, disabled: false, loaded: true }

function jsonResponse(body) {
  return { ok: true, status: 200, headers: { get: () => 'application/json' }, clone() { return jsonResponse(body) }, json: async () => body, text: async () => JSON.stringify(body) }
}

// Only the version cell of each row is rendered; a tooltip shows its text
const stubs = {
  LjPageHeader: { template: '<div class="hdr"><slot name="subtitle" /><slot name="actions" /></div>' },
  LjButton: { template: '<button class="ljbtn"><slot /></button>' },
  LjDialog: true, LjStatus: true, LigojTextField: true, LigojAutocomplete: true, NodeIcon: true, PluginAutomationDialog: true,
  RowActionsCog: true, LigojConfirmDialog: true,
  LjDataTable: {
    props: ['items'],
    template: '<div class="vdt"><div v-for="it in items" :key="it.id" class="row" :data-id="it.artifact"><slot name="cell.version" :item="it" /></div></div>',
  },
  'v-tooltip': { props: ['text'], template: '<span class="tt">{{ text }}</span>' },
  'v-icon': true, 'v-progress-circular': true, 'v-checkbox': true, 'v-file-input': true, 'v-list-item': true,
}

describe('SystemPluginView and the host compatibility', () => {
  beforeEach(async () => {
    setActivePinia(createPinia())
    useI18nStore().merge(enMessages, 'en')
    useAuthStore().session = { admin: true, applicationSettings: { buildVersion: '5.0.0' } }
    _resetCompatibility()
    registerHostModules({ '@ligoj/host': { useApi: 1 } })
    globalThis.fetch = vi.fn(async (url) => {
      if (String(url) === 'sonar-bundle') return { ok: true, status: 200, text: async () => 'import { useApi as a, remoteSearchField as b } from "@ligoj/host";' }
      if (String(url).startsWith('rest/system/plugin?')) return jsonResponse([SONAR, JENKINS])
      return jsonResponse({})
    })
    await checkBundle('qa-sonarqube', 'sonar-bundle')
  })

  it('marks a plug-in the host refused, with the missing names and the host version', async () => {
    const w = mount(SystemPluginView, { global: { stubs } })
    await flushPromises()
    const t = useI18nStore().t
    const chip = w.find('.row[data-id="plugin-qa-sonarqube"] .vchip.incompatible')
    expect(chip.text()).toContain(t('system.plugin.incompatible'))
    expect(chip.find('.tt').text()).toBe(t('system.plugin.incompatibleTooltip', { version: '5.0.0', missing: 'remoteSearchField' }))
    expect(w.find('.row[data-id="plugin-build-jenkins"] .vchip.incompatible').exists()).toBe(false)
  })
})
