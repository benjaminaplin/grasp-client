import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';

type DatePickerType = {
  label: string, 
  value?: Dayjs | null,
  onChange: any,
  name: string
}

const AppDatePicker = ({ label, value, onChange, name }: DatePickerType) => {
  return (
  <DatePicker 
    name={name}
    label={label}
    value={dayjs(value)}
    onChange={onChange}
  />    
  )
}

export default AppDatePicker