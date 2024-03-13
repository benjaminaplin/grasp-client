import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  flexRender,
  RowData,
} from '@tanstack/react-table'
import { ReactNode, useEffect, useMemo, useState } from 'react'
import './next-step-table.css'
import { Filter } from '../../components/table-filter/TableFilter'
import { NextStep } from '../../types/next-step'
import { Link } from 'react-router-dom'
import { relationFilterFn } from '../../utils/FilterFn'

declare module '@tanstack/react-table' {
  interface TableMeta<TData extends RowData> {
    updateData: (rowIndex: number, columnId: string, value: unknown) => void
  }
}

type NextStepTableType = {
  updateNextStep: (updatedNextStep: {nextStep: Partial<NextStep>, id: number}) => void,
  tableData: NextStep[] | undefined,
  refreshTableData: () => void
}

export const NextStepTable = ({
  updateNextStep,
  tableData,
  refreshTableData
}: NextStepTableType)=>  {
  const defaultColumn: Partial<ColumnDef<NextStep>> = {
    cell: ({ getValue, row, column, table }) => {
      const initialValue = getValue()
      // We need to keep and update the state of the cell normally
      const [value, setValue] = useState(initialValue)
  
      // When the input is blurred, we'll call our table meta's updateData function
      const onBlur = () => {
        table.options.meta?.updateData(row.index, column.id, value)
        updateNextStep({nextStep: {[column.id]: value}, id: row.original.id as number})
      }
  
      // If the initialValue is changed external, sync it up with our state
      useEffect(() => {
        setValue(initialValue)
      }, [initialValue])
  
      return (
        <input
          value={value as string}
          onChange={e => setValue(e.target.value)}
          onBlur={onBlur}
        />
      )
    },
  }

  const columns = useMemo<ColumnDef<NextStep>[]>(()=>[
      {
        accessorKey: 'type',
        header: () => <span>Type</span>,
        footer: props => props.column.id,
      },
      {
        accessorFn: row => row.action,
        id: 'action',
        header: () => <span>Action</span>,
        footer: props => props.column.id,
      },
      {
        accessorFn: row => row.notes,
        id: 'notes',
        header: () => <span>Notes</span>,
        footer: props => props.column.id,
      },
      {
        accessorKey: 'contact',
        id: 'contact',
        header: () => <span>Contact</span>,
        footer: props => props.column.id,
        cell: (info) => {
          return <Link to={`/contacts/${info.row.original.contactId}`}>{info.getValue() as ReactNode}</Link>
        },
        filterFn: relationFilterFn<NextStep>()
      },
  ],[])

  const refreshData = () => refreshTableData()
  const table = useReactTable({
    columns,
    defaultColumn,
    data: tableData || [],
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    debugTable: true,
    rowCount: tableData?.length
  })

  return (
    <>
      <table>
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => {
                return (
                  <th key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder ? null : (
                      <div>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {header.column.getCanFilter() ? (
                          <div>
                            <Filter column={header.column} table={table} />
                          </div>
                        ) : null}
                      </div>
                    )}
                  </th>
                )
              })}
            </tr>
          ))}
        </thead>
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
      <div/>
    </>
  )
}
