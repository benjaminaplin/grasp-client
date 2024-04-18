import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  flexRender,
  RowData,
  getSortedRowModel,
} from '@tanstack/react-table'
import { useEffect, useMemo, useState } from 'react'
import './touch-table.css'
import { Touch } from '../../types/touch'
import { Link } from 'react-router-dom'
import { relationFilterFn } from '../../utils/FilterFn'
import { DeleteButtonCell } from '../../components/delete-button-cell/DeleteButtonCell'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { getTableHeader } from '../../components/table/table-header/TableHeader'
import { format } from 'date-fns'
import Skeleton from '@mui/material/Skeleton'
import { TableCellInput } from '../../components/table/table-cell-input/TableCellInput'

declare module '@tanstack/react-table' {
  interface TableMeta<TData extends RowData> {
    updateData: (rowIndex: number, columnId: string, value: unknown) => void
  }
}

type TouchesTableType = {
  updateTouch: (updatedTouch: {touch: Partial<Touch>, id: number}) => void
  tableData: Touch[] | undefined
  refreshTableData: () => void
  companyMap: {[key: string]: string}
  touchesAreLoading: boolean
}

export const TouchesTable = ({
  updateTouch,
  tableData,
  refreshTableData,
  touchesAreLoading
}: TouchesTableType)=>  {

  const defaultColumn: Partial<ColumnDef<Touch>> = {
    cell: ({ getValue, row, column, table }) => {
      const initialValue = getValue()
      // We need to keep and update the state of the cell normally
      const [value, setValue] = useState(initialValue)
  
      // When the input is blurred, we'll call our table meta's updateData function
      const onBlur = () => {
        table.options.meta?.updateData(row.index, column.id, value)
        updateTouch({touch: {[column.id]: value}, id: row.original.id as number})
      }
  
      // If the initialValue is changed external, sync it up with our state
      useEffect(() => {
        setValue(initialValue)
      }, [initialValue])
  
      const onChange = (e: { target: { value: unknown } }) => setValue(e.target.value)
      return (
        <TableCellInput
          value={value as string}
          onChange={onChange}
          onBlur={onBlur}
          />
        )
    },
  }

  const onMutateSuccess = () => {
    // setIsTouchFormOpen(false)
    refreshTableData()
  }

  const {mutate: mutateDeleteTouch } = useMutation({
    mutationFn: (touchId: number) => {
      return axios.delete(`${import.meta.env.VITE_DEV_API_URL}/touches/${touchId}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
    },
    onSuccess: onMutateSuccess
  })
  const deleteTouch = (touchId: number) => {
    mutateDeleteTouch(touchId)
  }


  const columns = useMemo<ColumnDef<Touch>[]>(()=>[
    {
      accessorFn: row => row.type,
      id: 'type',
      header: () => <span>Type</span>,
      footer: props => props.column.id,
      cell: ({row: {original: {type, id  }}}) => {
        return type ? <Link to={`/touches/${id}`}>{type}</Link> :  ''
      },
    },{
      accessorKey: 'contact',
      id: 'contact',
      header: () => <span>Contact</span>,
      footer: props => props.column.id,
      cell: ({row: {original: {contact }}}) => {
        return contact ? <Link to={`/contacts/${contact?.id}`}>{`${contact.firstName} ${contact.lastName}`}</Link> :  ''
      },
      filterFn: relationFilterFn<Touch>(),
      enableSorting: true
    },  
    {
      accessorFn: row => row.scheduledDate,
      id: 'scheduledDate',
      header: () => <span>Date</span>,
      footer: props => props.column.id,
      enableSorting: true,
      cell: (info) => {
        return <span >{info.row.original.scheduledDate ? `${format(info.row.original.scheduledDate, "MM/dd/yyyy")}` : ''}</span>
      },
    },
    {
      accessorFn: row => row.notes,
      id: 'notes',
      header: () => <span>Notes</span>,
      footer: props => props.column.id,
    },
   
    {
      header: 'Delete',
      cell: ({row}) => <DeleteButtonCell row={row} deleteResource={(id: number) => deleteTouch(id)} />,
    }
  ],[])


  const memoColumns = useMemo<ColumnDef<Touch>[]>(() => 
     touchesAreLoading
      ? columns.map((column) => ({
          ...column,
          cell: () => <Skeleton height='32' />,
        }))
      : columns,
  [touchesAreLoading])

  const table = useReactTable({
    columns: memoColumns,
    defaultColumn,
    data: tableData || [],
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    debugTable: true,
    rowCount: tableData?.length,
    initialState: {
      sorting: [
        {
          id: 'scheduledDate',
          desc: true,  
        },
      ],
    },
    getSortedRowModel: getSortedRowModel(), //provide a sorting row model
  })

  return (
      <table>
       {getTableHeader<Touch>(table)}
        <tbody>
          {table.getRowModel().rows.map(row => {
            return (
              <tr key={row.id}>
                {row.getVisibleCells().map(cell => {
                  return (
                    <td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
  )
}
