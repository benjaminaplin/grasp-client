import FormControl from "@mui/material/FormControl"
import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import Select from "@mui/material/Select"

type SelectProps = {name: string,
  value: any,
  handleChange: (evt: any) => void,
  options: any[]
}

export const SelectInput = ({name, value, handleChange, options}: SelectProps) => {
  return (
    <FormControl fullWidth>
    <InputLabel id="demo-simple-select-label">{name}</InputLabel>
    <Select
      labelId="demo-simple-select-label"
      id="demo-simple-select"
      value={value}
      label={name}
      onChange={handleChange}
    >
      {options.map((label: any, value: any) => {
        return (
          <MenuItem value={value}>{label}</MenuItem>
        )
      })}
    </Select>
  </FormControl>
  )
}