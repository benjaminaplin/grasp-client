import CheckBox from '@mui/material/Checkbox'
import InputBase from '@mui/material/InputBase'
import { coerceStringToBool } from '../../../utils/coerce-str-bool'

type TableCellInputType = {
  value: string
  onBlur: () => void
  onChange: (e: { target: { value: unknown } }) => void
}
export const TableCellInput = ({
  value,
  onChange,
  onBlur,
}: TableCellInputType) => {
  const inputVal = coerceStringToBool(value)

  if (typeof inputVal === 'boolean') {
    return (
      <CheckBox
        checked={inputVal}
        onChange={(e) => {
          onChange(e)
        }}
        value={inputVal ? 'on' : 'off'}
      />
    )
  }

  return (
    <InputBase
      sx={{ bgcolor: 'background.paper', width: '100%' }}
      value={inputVal}
      onChange={onChange}
      onBlur={onBlur}
    />
  )
}
