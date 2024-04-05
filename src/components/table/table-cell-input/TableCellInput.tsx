import InputBase from "@mui/material/InputBase"
type TableCellInputType = {
  value: string, 
  onBlur: () => void,
  onChange: (e: { target: { value: unknown; }; }) => void
}
export const TableCellInput = ({value, onChange, onBlur } : TableCellInputType) => {
  return (
    <InputBase
      sx={{bgcolor: 'background.paper'}}
      value={value as string}
      onChange={onChange}
      onBlur={onBlur}
    />
  )
}