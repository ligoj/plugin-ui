import { describe, it, expect } from 'vitest'
import { pluginState, togglePath } from '../pluginToggle.js'

const installed = (extra) => ({ plugin: { artifact: 'plugin-x', version: '1.0.0' }, ...extra })

describe('plugin view enable/disable switch (plug-in loaded state, applied by a restart)', () => {
  it('derives the status from the persisted switch and the class-path state', () => {
    expect(pluginState(installed({ loaded: true, disabled: false }))).toMatchObject({ key: 'active', status: 'ok', enabled: true, restartRequired: false })
    expect(pluginState(installed({ loaded: true, disabled: true }))).toMatchObject({ key: 'disabling', status: 'warn', enabled: false, restartRequired: true })
    expect(pluginState(installed({ loaded: false, disabled: true }))).toMatchObject({ key: 'disabled', status: 'idle', enabled: false, restartRequired: false })
    expect(pluginState(installed({ loaded: false, disabled: false }))).toMatchObject({ key: 'enabling', status: 'warn', enabled: true, restartRequired: true })
  })

  it('flags a removal and a staged installation as restart-pending states', () => {
    expect(pluginState(installed({ loaded: true, deleted: true }))).toMatchObject({ key: 'deleted', status: 'warn' })
    // Staged jar, never installed: no persisted version yet
    expect(pluginState({ plugin: { artifact: 'plugin-new' }, latestLocalVersion: '2.0.0' })).toMatchObject({ key: 'pending', status: 'warn', pending: true, enabled: true })
    // ... unless disabled before any restart
    expect(pluginState({ plugin: { artifact: 'plugin-new' }, latestLocalVersion: '2.0.0', disabled: true })).toMatchObject({ key: 'disabled', status: 'idle', pending: false, enabled: false })
  })

  it('tolerates entries without the state fields (older backend): the node availability tells the loaded state', () => {
    expect(pluginState({ plugin: { version: '1.0.0' } })).toMatchObject({ key: 'active', enabled: true, loaded: true })
    expect(pluginState({ plugin: { version: '1.0.0' }, node: { enabled: false } })).toMatchObject({ key: 'enabling', loaded: false })
  })

  it('targets the plug-in enable/disable endpoints', () => {
    expect(togglePath('plugin-build-jenkins', false)).toBe('rest/system/plugin/plugin-build-jenkins/disable')
    expect(togglePath('plugin-build-jenkins', true)).toBe('rest/system/plugin/plugin-build-jenkins/enable')
  })
})
