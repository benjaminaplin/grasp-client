import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  flexRender,
  RowData,
  CellContext,
  getSortedRowModel,
} from '@tanstack/react-table'
import { ReactNode, useEffect, useMemo, useState } from 'react'
import './company-table.css'
import { Company } from '../../types/company'
import { DeleteButtonCell } from '../../components/delete-button-cell/DeleteButtonCell'
import { Link } from 'react-router-dom'
import { getTableHeader } from '../../components/table/table-header/TableHeader'
import Skeleton from '@mui/material/Skeleton'

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
  refreshTableData: () => void,
  deleteCompany: (id: number) => void,
  companiesAreLoading: boolean
}

export const CompanyTable = ({
  updateCompany,
  tableData,
  deleteCompany,
  companiesAreLoading
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
        cell: ({row}) => <DeleteButtonCell row={row} deleteResource={(id: number) => deleteCompany(id)} />
      },
  ],[])

  const memoColumns = useMemo<ColumnDef<Company>[]>(() => 
     companiesAreLoading
      ? columns.map((column) => ({
          ...column,
          cell: () => <Skeleton />,
        }))
      : columns,
  [companiesAreLoading])

  const table = useReactTable({
    columns: memoColumns,
    defaultColumn,
    data: tableData || [],
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    debugTable: true,
    rowCount: tableData?.length,
    getSortedRowModel: getSortedRowModel(), //provide a sorting row model

  })

  return (
    <>
      <table>
        {getTableHeader<Company>(table)}
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
