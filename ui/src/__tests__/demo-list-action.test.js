import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useDemoMode } from '@ligoj/host'
import pluginUiDef from '../index.js'
import DemoProjectListAction from '../components/DemoProjectListAction.vue'

describe('plugin-ui demo actionExtension (project list toolbar)', () => {
  beforeEach(() => { setActivePinia(createPinia()); useDemoMode().setEnabled(false) })

  it('contributes the toolbar action only in demo mode and only for the project list', () => {
    expect(pluginUiDef.feature('actionExtension', { target: 'project' })).toBeNull()
    useDemoMode().setEnabled(true)
    expect(pluginUiDef.feature('actionExtension', { target: 'project' })).toEqual({ action: DemoProjectListAction })
    expect(pluginUiDef.feature('actionExtension', { target: 'user' })).toBeNull()
  })
})
