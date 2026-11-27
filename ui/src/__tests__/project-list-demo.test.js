/*
 * Project list in demo mode: the demonstration projects are rows like the others, with the leader user the
 * tooltip and the edit dialog read.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { mount, flushPromises } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import { LjDataTable, useAuthStore, useDemoMode } from '@ligoj/host'
import ProjectListView from '../views/ProjectListView.vue'

describe('ProjectListView, demo mode', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    useAuthStore().session = { admin: true }
    useDemoMode().setEnabled(true)
    const body = { data: [{ id: 5, name: 'Real', pkey: 'real', teamLeader: { id: 'jdoe', firstName: 'John' } }], recordsTotal: 1 }
    globalThis.fetch = vi.fn(() => Promise.resolve({ ok: true, status: 200, headers: { get: () => 'application/json' }, json: () => Promise.resolve(body), text: () => Promise.resolve(JSON.stringify(body)) }))
  })
  afterEach(() => useDemoMode().setEnabled(false))

  it('gives every row with a team leader its leader user', async () => {
    const router = createRouter({ history: createMemoryHistory(), routes: [{ path: '/:pathMatch(.*)*', component: { template: '<div />' } }] })
    const w = mount(ProjectListView, { shallow: true, global: { plugins: [router] } })
    await flushPromises()
    const rows = w.findComponent(LjDataTable).props('items')
    expect(rows.length).toBe(5)
    expect(rows.filter((r) => r.teamLeader).length).toBe(5)
    for (const row of rows) expect(row.teamLeaderUser?.id).toBeTruthy()
    // A demo row keeps its own shape
    const demo = rows.find((r) => r.id === -1)
    expect(demo).toMatchObject({ teamLeader: 'fdaugan', teamLeaderUser: { id: 'fdaugan' }, subs: 4, tools: ['Jira', 'Jenkins'], health: 0.82 })
  })
})
