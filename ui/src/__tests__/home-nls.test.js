/*
 * HomeView: the KPIs and the demo dataset are translated, the numbers follow the active language.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { mount, flushPromises } from '@vue/test-utils'
import { useI18nStore } from '@ligoj/host'
import enMessages from '../i18n/en.js'
import frMessages from '../i18n/fr.js'
import HomeView from '../views/HomeView.vue'
import { DEMO_PROJECTS, DEMO_TOOLS } from '../demo/demoData.js'

const json = (body) => ({ ok: true, status: 200, headers: { get: () => 'application/json' }, json: () => Promise.resolve(body), text: () => Promise.resolve(JSON.stringify(body)) })

beforeEach(() => {
  setActivePinia(createPinia())
  const i18n = useI18nStore()
  i18n.merge(enMessages, 'en')
  i18n.merge(frMessages, 'fr')
  i18n.locale = 'en'
  globalThis.fetch = vi.fn((url) => Promise.resolve(json(String(url).includes('system/user') ? { recordsTotal: 12345, data: [] } : {})))
})

async function mountHome() {
  const w = mount(HomeView, { shallow: true })
  await flushPromises()
  return w
}

describe('HomeView translations', () => {
  it('names the KPIs in English and formats the numbers accordingly', async () => {
    const w = await mountHome()
    expect(w.vm.kpis.map((k) => k.l)).toEqual(['Projects', 'Tools', 'Subscriptions', 'Users'])
    expect(w.vm.kpis[3].v).toBe('12,345')
  })

  it('names the KPIs in French and formats the numbers accordingly', async () => {
    useI18nStore().locale = 'fr'
    const w = await mountHome()
    expect(w.vm.kpis.map((k) => k.l)).toEqual(['Projets', 'Outils', 'Souscriptions', 'Utilisateurs'])
    expect(w.vm.kpis[3].v).toBe((12345).toLocaleString('fr'))
  })

  it('translates the demo tools and their pills', async () => {
    const w = await mountHome()
    const jira = w.vm.demoGroups.find((g) => g.name === 'Jira')
    expect(jira.kind).toBe('Issue tracking')
    expect(jira.rows[0].pills).toEqual(['38 open', '73 closed'])
    const jenkins = w.vm.demoGroups.find((g) => g.name === 'Jenkins')
    expect(jenkins.rows.flatMap((r) => r.pills)).toEqual(['#1842', 'failed', '#77', 'unstable'])
  })

  it('has every demo text in both languages', () => {
    const keys = DEMO_TOOLS.flatMap((t) => [t.kindKey, ...t.rows.flatMap((r) => r.p.filter((p) => p.key).map((p) => p.key))])
    for (const key of new Set(keys)) {
      expect(enMessages[key]).toBeTruthy()
      expect(frMessages[key]).toBeTruthy()
    }
  })

  it('names no real company in the demo dataset', () => {
    expect(JSON.stringify([DEMO_TOOLS, DEMO_PROJECTS])).not.toMatch(/\bEDF\b|airbus/i)
  })
})
