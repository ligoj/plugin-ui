import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { nextTick } from 'vue'
import { useAuthStore, useAppStore, useI18nStore } from '@ligoj/host'
import BugReportDialog from '../components/BugReportDialog.vue'
import enMessages from '../i18n/en.js'

// Moved from the host (#121): the dialog now self-binds to app.bugDialogOpen
// instead of a modelValue prop, and its bugReport.* labels live in plugin-ui's
// i18n bundle (merged into the shared store here so `t()` resolves to English).
// Vuetify is externalized in the plugin build, so we stub v-dialog (render its
// slot inline) and v-icon rather than installing the real plugin.
const stubs = {
  'v-dialog': { template: '<div class="v-dialog"><slot /></div>' },
  'v-icon': { template: '<i class="v-icon"><slot /></i>' },
}

let wrapper

async function openDialog() {
  useAppStore().openBugDialog()
  wrapper = mount(BugReportDialog, { global: { stubs } })
  await nextTick()
  await nextTick()
  return wrapper
}

const template = () => wrapper.find('.bug-template').element.value

function seedSession(applicationSettings) {
  const auth = useAuthStore()
  auth.session = {
    userName: 'tester',
    roles: ['USER'],
    uiAuthorizations: ['.*'],
    apiAuthorizations: [],
    applicationSettings: applicationSettings ?? {
      buildVersion: '4.0.2-test',
      plugins: ['service:id:ldap', 'service:prov:aws'],
    },
  }
}

describe('<BugReportDialog>', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    useI18nStore().merge(enMessages, 'en')
    window.location.hash = '#/about'
  })

  it('builds a template containing the version, the URL and the plugins', async () => {
    seedSession()
    await openDialog()

    const text = template()
    expect(text).toContain('4.0.2-test')
    expect(text).toContain('#/about')
    expect(text).toContain('service:id:ldap')
    expect(text).toContain('service:prov:aws')
    expect(text).toContain('## Description')
    expect(text).toContain('## Context')
  })

  it('uses the path when there is no hash, and never leaks a domain', async () => {
    seedSession()
    window.location.hash = ''
    await openDialog()

    const text = template()
    // jsdom default pathname is "/"; no protocol/host should appear.
    expect(text).not.toContain('http')
    expect(text).not.toContain('localhost')
  })

  it('copies the template to the clipboard via the Clipboard API', async () => {
    seedSession()
    const writeText = vi.fn().mockResolvedValue()
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } })
    await openDialog()

    await wrapper.find('.bug-btn.primary').trigger('click')

    expect(writeText).toHaveBeenCalledTimes(1)
    const copied = writeText.mock.calls[0][0]
    expect(copied).toContain('4.0.2-test')
    expect(copied).toContain('service:id:ldap')
    delete navigator.clipboard
  })

  it('falls back gracefully when the Clipboard API is unavailable', async () => {
    seedSession()
    delete navigator.clipboard
    document.execCommand = vi.fn().mockReturnValue(true)
    await openDialog()

    // Should not throw, and should fall back to execCommand('copy').
    await wrapper.find('.bug-btn.primary').trigger('click')
    expect(document.execCommand).toHaveBeenCalledWith('copy')
  })

  it('links to the Ligoj GitHub issue form in a new tab', async () => {
    seedSession()
    await openDialog()

    const link = wrapper.find('.bug-foot a.bug-btn')
    expect(link.attributes('href')).toContain('https://github.com/ligoj/ligoj/issues/new')
    expect(link.attributes('target')).toBe('_blank')
    expect(link.attributes('rel')).toContain('noopener')
  })

  it('shows a no-plugin placeholder when none are installed', async () => {
    seedSession({ buildVersion: '1.0', plugins: [] })
    await openDialog()

    const text = template()
    expect(text).toContain('1.0')
    expect(text).toContain('Installed plugins')
    expect(text).toContain('(none)')
  })
})
