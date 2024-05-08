import { render, screen } from '@testing-library/react'
import { TableCellInput } from './TableCellInput'
import { describe, it, vi } from 'vitest'

describe('CellTableInput', () => {
  const mockOnBlur = vi.fn()
  const mockOnChange = vi.fn()
  it('renders checkbox if input type is stringified boolean', () => {
    render(
      <TableCellInput
        value='true'
        onChange={mockOnChange}
        onBlur={mockOnBlur}
      />,
    )
    expect(screen.getByRole('checkbox'))
    expect(screen.queryByRole('textbox')).toBeNull()
  })

  it('renders textbox if input type is stringified boolean', () => {
    render(
      <TableCellInput
        value='not boolean'
        onChange={mockOnChange}
        onBlur={mockOnBlur}
      />,
    )
    expect(screen.queryByRole('checkbox')).toBeNull()
    expect(screen.getByRole('textbox'))
  })
})
