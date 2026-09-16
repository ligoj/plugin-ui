import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { mount, flushPromises } from '@vue/test-utils'
import { useAuthStore } from '@ligoj/host'
import ProjectEditDialog from '../views/ProjectEditDialog.vue'

function jsonResponse(body) {
  return Promise.resolve({
    ok: true, status: 200,
    headers: { get: (k) => (k === 'content-type' ? 'application/json' : null) },
    json: () => Promise.resolve(body), text: () => Promise.resolve(JSON.stringify(body)),
  })
}

describe('ProjectEditDialog — team leader search', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    globalThis.fetch = vi.fn(() => jsonResponse({ data: [{ id: 'fdaugan', firstName: 'Fabrice', lastName: 'Daugan' }], recordsTotal: 1 }))
  })

  it('sends the typed text as the DataTables search criterion the user API reads', async () => {
    const w = mount(ProjectEditDialog, { shallow: true, props: { modelValue: true, project: null } })
    await flushPromises()
    w.vm.leaderSearch = 'Fabrice'
    await w.vm.loadLeaders()
    const url = String(globalThis.fetch.mock.calls.at(-1)[0])
    expect(url).toContain('rest/service/id/user?')
    expect(url).toContain('search[value]=Fabrice')
    expect(url).not.toContain('q=')
    expect(w.vm.leaderItems).toEqual([{ id: 'fdaugan', label: 'fdaugan — Fabrice Daugan' }])
  })

  it('labels the candidates and the current leader by the visual identifier', async () => {
    useAuthStore().session = { applicationSettings: { data: { 'service:id:visual-id-name': 'customAttributes.employeeId' } } }
    globalThis.fetch = vi.fn(() => jsonResponse({ data: [{ id: 'fdaugan', firstName: 'Fabrice', lastName: 'Daugan', customAttributes: { employeeId: 'E-42' } }], recordsTotal: 1 }))
    const project = { id: 7, name: 'P', pkey: 'p', teamLeader: { id: 'mtuyer', firstName: 'Marc', lastName: 'Tuyer', customAttributes: { employeeId: 'E-7' } } }
    const w = mount(ProjectEditDialog, { shallow: true, props: { modelValue: true, project } })
    await flushPromises()
    // The edited project's leader, before any search: visual id + name, value = the login
    expect(w.vm.leaderDisplayItems[0]).toEqual({ id: 'mtuyer', label: 'E-7 — Marc Tuyer' })
    await w.vm.loadLeaders()
    expect(w.vm.leaderItems).toEqual([{ id: 'fdaugan', label: 'E-42 — Fabrice Daugan' }])
  })

  it('accepts a project list row, whose teamLeader is the displayed visual id: the login stays the value', async () => {
    useAuthStore().session = { applicationSettings: { data: { 'service:id:visual-id-name': 'customAttributes.uidFonctionnel' } } }
    const row = { id: 1, name: 'Démo #1', pkey: 'demo-1', teamLeader: 'UID Ragnar', teamLeaderName: 'Ragnar Ahmed',
      teamLeaderUser: { id: 'ragnar', firstName: 'Ragnar', lastName: 'Ahmed', customAttributes: { uidFonctionnel: 'UID Ragnar' } } }
    const w = mount(ProjectEditDialog, { shallow: true, props: { modelValue: true, project: row } })
    await flushPromises()
    expect(w.vm.form.teamLeader).toBe('ragnar')
    expect(w.vm.leaderDisplayItems[0]).toEqual({ id: 'ragnar', label: 'UID Ragnar — Ragnar Ahmed' })
  })

  it('sends no criterion when nothing is typed', async () => {
    const w = mount(ProjectEditDialog, { shallow: true, props: { modelValue: true, project: null } })
    await flushPromises()
    w.vm.leaderSearch = '   '
    await w.vm.loadLeaders()
    const url = String(globalThis.fetch.mock.calls.at(-1)[0])
    expect(url).toContain('rest/service/id/user?rows=20')
    expect(url).not.toContain('search')
  })
})
