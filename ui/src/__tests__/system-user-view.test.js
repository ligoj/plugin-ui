import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { mount, flushPromises } from '@vue/test-utils'
import { useAuthStore, useI18nStore } from '@ligoj/host'
import SystemUserView from '../views/SystemUserView.vue'
import enMessages from '../i18n/en.js'

// A user with a role granted by a group of the identity provider
const USER = { login: 'jdoe', roles: [], federatedRoles: [{ id: 'hr-api', name: 'HR-API' }] }

function jsonResponse(body) {
  return {
    ok: true, status: 200,
    headers: { get: () => 'application/json' },
    clone() { return jsonResponse(body) },
    json: async () => body,
    text: async () => JSON.stringify(body),
  }
}

const stubs = {
  LjPageHeader: { template: '<div class="hdr"><slot name="actions" /></div>' },
  LjButton: { emits: ['click'], template: '<button class="ljbtn" @click="$emit(\'click\')"><slot /></button>' },
  RowActionsCog: { template: '<div class="cog"><slot /></div>' },
  LjDialog: { props: ['modelValue'], template: '<div v-if="modelValue" class="dlg"><slot /></div>' },
  LjDataTable: {
    props: ['headers', 'items', 'itemsLength', 'loading'],
    emits: ['update:options'],
    // The real table asks its first page once mounted
    mounted() { this.$emit('update:options', { page: 1, itemsPerPage: 25, sortBy: [] }) },
    template: '<div class="vdt"><div v-for="it in items" :key="it.login" class="row"><slot name="cell.roles" :item="it" /></div></div>',
  },
  // The tooltip content inline: its slot
  'v-tooltip': { props: ['text'], template: '<div class="tt" :data-text="text"><slot /></div>' },
  ApiVerifyDialog: true, LigojConfirmDialog: true, LigojAutocomplete: true, LigojTextField: true,
  'v-icon': true, 'v-form': { template: '<form><slot /></form>' },
}

beforeEach(() => {
  setActivePinia(createPinia())
  useI18nStore().merge(enMessages, 'en')
  useAuthStore().session = { admin: true }
  globalThis.fetch = vi.fn((url) => Promise.resolve(jsonResponse(String(url).startsWith('rest/system/user')
    ? { data: [USER], recordsTotal: 1, recordsFiltered: 1 } : [])))
})

// The tooltip of each federated role: its whole text, and the highlighted group
const tooltips = (scope) => scope.findAll('.rchip--federated .tt').map((tt) => [tt.text(), tt.find('.tt-group').text()])

describe('SystemUserView federated roles', () => {
  it('highlights the group granting the role in the tooltip of the list', async () => {
    const w = mount(SystemUserView, { global: { stubs } })
    await flushPromises()
    expect(tooltips(w.find('.vdt'))).toEqual([['Granted by the group hr-api of the identity provider', 'hr-api']])
  })

  it('highlights it in the tooltip of the edit dialog too', async () => {
    const w = mount(SystemUserView, { global: { stubs } })
    await flushPromises()
    w.vm.openEdit(USER)
    await flushPromises()
    expect(tooltips(w.find('.dlg'))).toEqual([['Granted by the group hr-api of the identity provider', 'hr-api']])
  })
})
