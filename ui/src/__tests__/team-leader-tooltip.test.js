/*
 * The team leader details, in the tooltip of the leader on the project page and in the project list: the same rows,
 * only the details the identity provider returned.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { mount, flushPromises } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import { useAuthStore, useI18nStore } from '@ligoj/host'
import TeamLeaderTooltip from '../components/TeamLeaderTooltip.vue'
import ProjectListView from '../views/ProjectListView.vue'
import ProjectDetailView from '../views/ProjectDetailView.vue'
import enMessages from '../i18n/en.js'

const LEADER = {
  id: 'fdaugan', firstName: 'Fabrice', lastName: 'Daugan', company: 'ligoj', mails: ['fdaugan@sample.com', 'fd@sample.com'],
  groups: ['dev', 'ops'], customAttributes: { employeeId: 'E-42', site: '' },
}
const PROJECT = { id: 1, name: 'P1', pkey: 'p1', teamLeader: LEADER, subscriptions: [] }

function json(body) {
  return Promise.resolve({ ok: true, status: 200, headers: { get: () => 'application/json' }, json: () => Promise.resolve(body), text: () => Promise.resolve(JSON.stringify(body)) })
}
// The tooltip content inline: its slot
const VTooltip = { name: 'VTooltip', props: ['location'], template: '<div class="tt" :data-location="location"><slot /></div>' }
const rows = (w) => w.findAll('.lt-row').map((r) => [r.find('.lt-k').text(), r.find('.lt-v').text()])

beforeEach(() => {
  setActivePinia(createPinia())
  useI18nStore().merge(enMessages, 'en')
  useAuthStore().session = { admin: true, applicationSettings: { data: { 'service:id:visual-id-name': 'customAttributes.employeeId' } } }
  globalThis.fetch = vi.fn((url) => json(String(url).startsWith('rest/project?') ? { data: [PROJECT], recordsTotal: 1, recordsFiltered: 1 } : PROJECT))
})

describe('TeamLeaderTooltip', () => {
  it('lists the known details of the leader, the empty ones left out', () => {
    const w = mount(TeamLeaderTooltip, { props: { user: LEADER }, global: { stubs: { VTooltip } } })
    expect(w.find('.lt-head').text()).toBe('Team Leader')
    expect(rows(w)).toEqual([
      ['Name', 'Fabrice Daugan'], ['Identifier', 'E-42'], ['Login', 'fdaugan'], ['Mail', 'fdaugan@sample.com, fd@sample.com'],
      ['Company', 'ligoj'], ['Groups', 'dev, ops'], ['employeeId', 'E-42'],
    ])
  })

  it('does not repeat the login when it is the identifier', () => {
    useAuthStore().session = { admin: true }
    const w = mount(TeamLeaderTooltip, { props: { user: { id: 'fdaugan' } }, global: { stubs: { VTooltip } } })
    expect(rows(w)).toEqual([['Identifier', 'fdaugan']])
  })
})

describe('team leader tooltip in the project views', () => {
  const router = () => createRouter({ history: createMemoryHistory(), routes: [{ path: '/:pathMatch(.*)*', component: { template: '<div />' } }] })

  it('gives the details of the leader in the project list', async () => {
    const LjDataTable = {
      props: ['items'], emits: ['update:options'],
      mounted() { this.$emit('update:options', { page: 1, itemsPerPage: 25, sortBy: [] }) },
      template: '<div class="vdt"><div v-for="it in items" :key="it.id" class="row"><slot name="cell.teamLeader" :item="it" /></div></div>',
    }
    const w = mount(ProjectListView, { shallow: true, global: { plugins: [router()], stubs: { LjDataTable } } })
    await flushPromises()
    expect(w.find('.tl-pill').text()).toContain('E-42')
    expect(w.findComponent(TeamLeaderTooltip).props('user')).toEqual(LEADER)
  })

  it('gives the same details on the project page', async () => {
    const r = router()
    await r.push('/project/1')
    const LjPageHeader = { template: '<div class="hdr"><slot name="title-append" /></div>' }
    const w = mount(ProjectDetailView, { shallow: true, global: { plugins: [r], stubs: { LjPageHeader, VChip: { template: '<span class="chip"><slot /></span>' } } } })
    await flushPromises()
    expect(w.findComponent(TeamLeaderTooltip).props()).toEqual({ user: LEADER, location: 'bottom' })
  })
})
