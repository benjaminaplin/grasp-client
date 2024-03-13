import { Row } from "@tanstack/react-table"

export const relationFilterFn = <ColumnType>() => (row: Row<ColumnType>, columnId: string, filterValue: string) => {
  const rowValue = row.getValue(columnId)
  if(!rowValue){
    return false
  }
  return (rowValue as string)?.toLowerCase()?.includes(filterValue)
}