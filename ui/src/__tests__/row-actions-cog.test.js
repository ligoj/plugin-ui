import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { mount } from '@vue/test-utils'
import RowActionsCog from '../components/RowActionsCog.vue'

const stubs = {
  'v-menu': { template: '<div><slot name="activator" :props="{}" /><slot /></div>' },
  'v-icon': { template: '<i class="vicon"><slot /></i>' },
}

beforeEach(() => { setActivePinia(createPinia()) })

describe('RowActionsCog', () => {
  it('opens the row actions from vertical dots', () => {
    const w = mount(RowActionsCog, { global: { stubs } })
    expect(w.find('.lj-iconbtn .vicon').text()).toBe('mdi-dots-vertical')
  })
})
