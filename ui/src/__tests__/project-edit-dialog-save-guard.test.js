/*
 * Project edit dialog: a successful save closes the dialog without the unsaved-changes confirmation, even when
 * the parent leaves the page from the `saved` event, as the project list does after a creation.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { defineComponent, h, ref } from 'vue'
import { setActivePinia, createPinia } from 'pinia'
import { createRouter, createMemoryHistory, RouterView, useRouter } from 'vue-router'
import { mount, flushPromises } from '@vue/test-utils'
import ProjectEditDialog from '../views/ProjectEditDialog.vue'

const FormStub = { template: '<form><slot /></form>', methods: { validate: () => Promise.resolve({ valid: true }), resetValidation() {} } }
const DialogStub = { props: ['modelValue'], template: '<div v-if="modelValue" class="dlg"><slot /></div>' }
const ConfirmStub = { props: ['modelValue', 'title'], template: '<div v-if="modelValue" class="unsaved">{{ title }}</div>' }

describe('ProjectEditDialog, save and unsaved-changes guard', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.removeItem('ligoj.skipUnsavedConfirmation')
    globalThis.fetch = vi.fn(() => Promise.resolve({ ok: true, status: 200, headers: { get: () => 'application/json' }, json: () => Promise.resolve(77), text: () => Promise.resolve('77') }))
  })

  it('lets the parent navigate from the saved event of a filled form', async () => {
    // Same reaction as the project list: open the created project
    const List = defineComponent({
      setup() {
        const open = ref(true)
        const router = useRouter()
        return () => h(ProjectEditDialog, { modelValue: open.value, 'onUpdate:modelValue': (v) => { open.value = v }, onSaved: ({ id }) => router.push(`/project/${id}`) })
      },
    })
    const router = createRouter({ history: createMemoryHistory(), routes: [{ path: '/', component: List }, { path: '/project/:id', component: { template: '<i class="detail" />' } }] })
    router.push('/')
    await router.isReady()
    const w = mount(RouterView, { global: { plugins: [router], stubs: { 'v-dialog': DialogStub, 'v-form': FormStub, 'v-card': { template: '<div><slot /></div>' }, 'v-card-text': { template: '<div><slot /></div>' }, 'v-icon': true, LjConfirmDialog: ConfirmStub, LigojTextField: true, LigojTextarea: true, LigojAutocomplete: true } } })
    await flushPromises()
    const dialog = w.findComponent(ProjectEditDialog)
    Object.assign(dialog.vm.form, { name: 'Alpha', pkey: 'alpha', teamLeader: 'jdoe' })
    await flushPromises()

    await dialog.vm.save()
    await flushPromises()
    expect(w.find('.unsaved').exists()).toBe(false)
    expect(router.currentRoute.value.path).toBe('/project/77')
  })
})
