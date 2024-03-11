import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  flexRender,
  RowData,
} from '@tanstack/react-table'
import { ReactNode, useEffect, useMemo, useState } from 'react'
import './application-table.css'
import { Filter } from './application-table-filter'
import { Application } from '../../types/application'
import { Link } from 'react-router-dom'
import { InvertColorsOff } from '@mui/icons-material'

declare module '@tanstack/react-table' {
  interface TableMeta<TData extends RowData> {
    updateData: (rowIndex: number, columnId: string, value: unknown) => void
  }
}

type ApplicationsTableType = {
  updateApplication: (updatedApplication: {application: Partial<Application>, id: number}) => void,
  tableData: Application[] | undefined,
  refreshTableData: () => void
}

export const ApplicationsTable = ({
  updateApplication,
  tableData,
  refreshTableData
}: ApplicationsTableType)=>  {
  const defaultColumn: Partial<ColumnDef<Application>> = {
    cell: ({ getValue, row, column, table }) => {
      const initialValue = getValue()
      // We need to keep and update the state of the cell normally
      const [value, setValue] = useState(initialValue)
  
      // When the input is blurred, we'll call our table meta's updateData function
      const onBlur = () => {
        table.options.meta?.updateData(row.index, column.id, value)
        updateApplication({application: {[column.id]: value}, id: row.original.id as number})
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

  const columns = useMemo<ColumnDef<Application>[]>(()=>[
      {
        accessorKey: 'type',
        header: () => <span>Type</span>,
        footer: props => props.column.id,
      },
      {
        accessorFn: row => row.role,
        id: 'role',
        header: () => <span>Role</span>,
        footer: props => props.column.id,
      },
      {
        accessorFn: row => row.notes,
        id: 'notes',
        header: () => <span>Notes</span>,
        footer: props => props.column.id,
      },
      {
        accessorKey: 'company',
        id: 'company',
        header: () => <span>Company</span>,
        footer: props => props.column.id,
        cell: (info) => {
          return <Link to={`/companies/${info.row.original.companyId}`}>{info.getValue() as ReactNode}</Link>
      }
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
