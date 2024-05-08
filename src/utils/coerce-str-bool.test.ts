import { describe, it } from 'vitest'
import { coerceStringToBool } from './coerce-str-bool'

describe('coerceStringToBool', () => {
  it('coerces a stringified boolean to a boolean', () => {
    expect(coerceStringToBool('true')).toBe(true)
    expect(coerceStringToBool('false')).toBe(false)
  })
  it('returns the value as is if string is not stringified boolean', () => {
    expect(coerceStringToBool('not a bool')).toBe('not a bool')
  })
})
