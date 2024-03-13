import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  flexRender,
  RowData,
  CellContext,
} from '@tanstack/react-table'
import { ReactNode, useEffect, useMemo, useState } from 'react'
import './company-table.css'
import { Filter } from '../../components/table-filter/TableFilter'
import { Company } from '../../types/company'
import { DeleteButtonCell } from '../../components/delete-button-cell/DeleteButtonCell'
import { Link } from 'react-router-dom'

declare module '@tanstack/react-table' {
  interface TableMeta<TData extends RowData> {
    updateData: (rowIndex: number, columnId: string, value: unknown) => void
  }
}

const linkToCompanyCellFn = (info: CellContext<Company, unknown>)  => {
  return <Link to={`/companies/${info.row.original.id}`}>{info.getValue() as ReactNode}</Link>
}

type CompanysTableType = {
  updateCompany: (updatedCompany: {company: Partial<Company>, id: number}) => void,
  tableData: Company[] | undefined,
  refreshTableData: () => void
}

export const CompanyTable = ({
  updateCompany,
  tableData,
  refreshTableData
}: CompanysTableType)=>  {
  const defaultColumn: Partial<ColumnDef<Company>> = {
    cell: ({ getValue, row, column, table }) => {
      const initialValue = getValue()
      // We need to keep and update the state of the cell normally
      const [value, setValue] = useState(initialValue)
  
      // When the input is blurred, we'll call our table meta's updateData function
      const onBlur = () => {
        table.options.meta?.updateData(row.index, column.id, value)
        updateCompany({company: {[column.id]: value}, id: row.original.id as number})
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

  const columns = useMemo<ColumnDef<Company>[]>(()=>[
      {
        accessorFn: row => row.name,
        id: 'name',
        header: () => <span>Name</span>,
        footer: props => props.column.id,
        cell: linkToCompanyCellFn 
      },
      {
        accessorFn: row => row.notes,
        id: 'notes',
        header: () => <span>Notes</span>,
        footer: props => props.column.id,
      },
      {
        header: 'Delete',
        cell: ({row}) => <DeleteButtonCell row={row} deleteResource={(id: number) => console.log('deleting', id)} />
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
