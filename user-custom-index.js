import { useI18nStore } from '@ligoj/host'
import enMessages from './i18n/en.js'
import frMessages from './i18n/fr.js'
import service from './service.js'
import DemoProjectExtension from './components/ProjectExtension.vue'

const parameterField = {
  parameterField: service.parameterField,
}
//const emit = defineEmits(['update:modelValue', 'saved'])

const features = {
  renderFeatures: service.renderFeatures,
  renderDetailsKey: service.renderDetailsKey,
  sample: service.sample,
  editExtension(ctx) {
    if (ctx.target !== 'project') {
      return null
    }
    return {
     component: DemoProjectExtension,
     apiPath: "rest/service/dgfip/dgfip/simpleProject",
     beforeSave(payload) {
//        emit('saved', { id: isEdit.value ? props.project.id : id, created: !isEdit.value })
        const tags = String(payload.demoTags ?? '').split(',').map((tag) => tag.trim()).filter(Boolean)
        const dialog = { ...payload }
     },
    }
  },
}

export default {
  id: 'dgfip-dgfip',
  label: 'Dgfip',
  requires: ['dgfip'],
  // No routes / component — screens come from the tool plugins and the
  // host's generic subscription rows.
  install() {
    const i18n = useI18nStore()
    i18n.merge(enMessages, 'en')
    i18n.merge(frMessages, 'fr')
  },
  feature(action, ...args) {
    const fn = features[action]
    if (!fn) throw new Error(`Plugin "dgfip" has no feature "${action}"`)
    return fn(...args)
  },
  service,
  meta: { icon: 'mdi-source-branch', color: 'teal-darken-2' },
}

export { service }
