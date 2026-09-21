import { describe, it, expect } from 'vitest'
import { modesFromParameters, nodeModes, subscriptionModes } from '../utils/subscriptionModes.js'

describe('subscriptionModes', () => {
  it('maps the node mode to the offered subscription modes, any case', () => {
    expect(subscriptionModes('link')).toEqual(['link'])
    expect(subscriptionModes('LINK')).toEqual(['link'])
    expect(subscriptionModes('create')).toEqual(['create'])
    expect(subscriptionModes('ALL')).toEqual(['create', 'link'])
  })
  it('offers nothing for none, and everything when the mode is missing (ALL is the entity default)', () => {
    expect(subscriptionModes('none')).toEqual([])
    expect(subscriptionModes(undefined)).toEqual(['create', 'link'])
    expect(subscriptionModes(null)).toEqual(['create', 'link'])
    expect(subscriptionModes('')).toEqual(['create', 'link'])
  })
})

describe('nodeModes — modes a new node may take under its parent (backend checkMode)', () => {
  it('allows everything under an all parent, most permissive first, a missing mode being ALL', () => {
    expect(nodeModes('ALL')).toEqual(['all', 'create', 'link', 'none'])
    expect(nodeModes(undefined)).toEqual(['all', 'create', 'link', 'none'])
    expect(nodeModes(null)).toEqual(['all', 'create', 'link', 'none'])
  })
  it('allows the parent mode and none under a link or create parent', () => {
    expect(nodeModes('link')).toEqual(['link', 'none'])
    expect(nodeModes('CREATE')).toEqual(['create', 'none'])
  })
  it('allows only none under a none parent, never an empty choice', () => {
    expect(nodeModes('none')).toEqual(['none'])
  })
})

describe('modesFromParameters — modes a tool supports, from its parameters', () => {
  const p = (...ids) => ids.map((id) => ({ id }))
  it('offers every mode as soon as one parameter is in the default ALL mode (Jenkins)', () => {
    // url/user/token/job are ALL (listed for NONE too), template-job is CREATE only
    expect(modesFromParameters({ none: p('url', 'user', 'job'), link: p('url', 'user', 'job'), create: p('url', 'user', 'job', 'template') })).toEqual(['all', 'create', 'link'])
  })
  it('offers only the specific modes when no parameter is ALL', () => {
    expect(modesFromParameters({ none: [], link: p('a'), create: [] })).toEqual(['link'])
    expect(modesFromParameters({ none: [], link: [], create: p('b') })).toEqual(['create'])
    expect(modesFromParameters({ none: [], link: p('a'), create: p('b') })).toEqual(['create', 'link'])
  })
  it('falls back to the default, every mode, without any parameter or on bad input', () => {
    expect(modesFromParameters({ none: [], link: [], create: [] })).toEqual(['all', 'create', 'link'])
    expect(modesFromParameters()).toEqual(['all', 'create', 'link'])
    expect(modesFromParameters({ none: null, link: 'x', create: undefined })).toEqual(['all', 'create', 'link'])
  })
})
