import { describe, it, expect } from 'vitest'
import { subscriptionModes } from '../utils/subscriptionModes.js'

describe('subscriptionModes', () => {
  it('maps the node mode to the offered subscription modes, any case', () => {
    expect(subscriptionModes('link')).toEqual(['link'])
    expect(subscriptionModes('LINK')).toEqual(['link'])
    expect(subscriptionModes('create')).toEqual(['create'])
    expect(subscriptionModes('ALL')).toEqual(['create', 'link'])
  })
  it('offers nothing for none, and link when the mode is missing', () => {
    expect(subscriptionModes('none')).toEqual([])
    expect(subscriptionModes(undefined)).toEqual(['link'])
    expect(subscriptionModes('')).toEqual(['link'])
  })
})
