import FormControl from "@mui/material/FormControl"
import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import Select from "@mui/material/Select"

type SelectProps = {name: string,
  value: any,
  handleChange: (evt: any) => void,
  options: any[],
  label: string
}

export const SelectInput = ({label , name, value, handleChange, options}: SelectProps) => {
  return (
    <FormControl fullWidth>
    <InputLabel id="demo-simple-select-label">{label}</InputLabel>
    <Select
      labelId="demo-simple-select-label"
      id="demo-simple-select"
      value={value}
      label={label}
      name={name}
      onChange={handleChange}
    >
      {options?.map(({label, value}) => {
        return (
          <MenuItem key={value} value={value}>{label}</MenuItem>
        )
      })}
    </Select>
  </FormControl>
  )
}