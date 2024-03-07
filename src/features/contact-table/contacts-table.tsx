import {
  Column,
  Table,
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  RowData,
} from '@tanstack/react-table'
import {  useQuery } from '@tanstack/react-query'
import { Contact } from '../../types/contact'
import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react'
import './contact-table.css'

declare module '@tanstack/react-table' {
  interface TableMeta<TData extends RowData> {
    updateData: (rowIndex: number, columnId: string, value: unknown) => void
  }
}
function useSkipper() {
  const shouldSkipRef = useRef(true)
  const shouldSkip = shouldSkipRef.current

  // Wrap a function with this to skip a pagination reset temporarily
  const skip = useCallback(() => {
    shouldSkipRef.current = false
  }, [])

  useEffect(() => {
    shouldSkipRef.current = true
  })

  return [shouldSkip, skip] as const
}

function Filter({
  column,
  table,
}: {
  column: Column<any, any>
  table: Table<any>
}) {
  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id)

  const columnFilterValue = column.getFilterValue()

  return typeof firstValue === 'number' ? (
    <div className="flex space-x-2">
      <input
        type="number"
        value={(columnFilterValue as [number, number])?.[0] ?? ''}
        onChange={e =>
          column.setFilterValue((old: [number, number]) => [
            e.target.value,
            old?.[1],
          ])
        }
        placeholder={`Min`}
        className="w-24 border shadow rounded"
      />
      <input
        type="number"
        value={(columnFilterValue as [number, number])?.[1] ?? ''}
        onChange={e =>
          column.setFilterValue((old: [number, number]) => [
            old?.[0],
            e.target.value,
          ])
        }
        placeholder={`Max`}
        className="w-24 border shadow rounded"
      />
    </div>
  ) : (
    <input
      type="text"
      value={(columnFilterValue ?? '') as string}
      onChange={e => column.setFilterValue(e.target.value)}
      placeholder={`Search...`}
      className="w-36 border shadow rounded"
    />
  )
}

const DEV_API_URL = import.meta.env.VITE_DEV_API_URL

export const ContactsTable = ({updateContact}:{updateContact: (updatedContact: {contact: Partial<Contact>, id: number}) => void})=>  {
  const [tableData, setTableData] = useState<never[]>([])
  const defaultColumn: Partial<ColumnDef<Contact>> = {
    cell: ({ getValue, row, column, table }) => {
      console.log('column', column)
      const initialValue = getValue()
      // We need to keep and update the state of the cell normally
      const [value, setValue] = useState(initialValue)
  
      // When the input is blurred, we'll call our table meta's updateData function
      const onBlur = () => {
        table.options.meta?.updateData(row.index, column.id, value)
        updateContact({contact: {[column.id]: value}, id: row.original.id as number})
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

  const rerender = useReducer(() => ({}), {})[1]

  const columns = useMemo<ColumnDef<Contact>[]>(()=>[
      {
        accessorKey: 'firstName',
        footer: props => props.column.id,
      },
      {
        accessorFn: row => row.lastName,
        id: 'lastName',
        header: () => <span>Last Name</span>,
        footer: props => props.column.id,
      },
      {
        accessorFn: row => row.lastName,
        id: 'title',
        header: () => <span>Title</span>,
        footer: props => props.column.id,
      },
      {
        accessorFn: row => row.type,
        id: 'type',
        header: () => <span>Type</span>,
        footer: props => props.column.id,
      },
      {
        accessorFn: row => row.notes,
        id: 'notes',
        header: () => <span>Notes</span>,
        footer: props => props.column.id,
      },
  ],[])

  const { data } = useQuery({
    queryKey: ['test'],
    queryFn: () => fetch(`${DEV_API_URL}/contacts`).then((res: any) => {
      return res.json()
    }),
  })
  const [autoResetPageIndex, skipAutoResetPageIndex] = useSkipper()
  const refreshData = () => {}
  const table = useReactTable({
    columns,
    defaultColumn,
    data: data || [],
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    meta: {
      updateData: (rowIndex, columnId, value) => {
        // Skip page index reset until after next rerender
        skipAutoResetPageIndex()
        setTableData((old: any) =>
          old.map((row: any, index: number) => {
            if (index === rowIndex) {
              return {
                ...old[rowIndex]!,
                [columnId]: value,
              }
            }
            return row
          })
        )
      },
    },
    debugTable: true,
  })

  // ...render your table
  return (
    <div className="p-2">
    <div className="h-2" />
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
    <div className="h-2" />
    <div className="flex items-center gap-2">
      <button
        className="border rounded p-1"
        onClick={() => table.setPageIndex(0)}
        disabled={!table.getCanPreviousPage()}
      >
        {'<<'}
      </button>
      <button
        className="border rounded p-1"
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
      >
        {'<'}
      </button>
      <button
        className="border rounded p-1"
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}
      >
        {'>'}
      </button>
      <button
        className="border rounded p-1"
        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
        disabled={!table.getCanNextPage()}
      >
        {'>>'}
      </button>
      <span className="flex items-center gap-1">
        <div>Page</div>
        <strong>
          {table.getState().pagination.pageIndex + 1} of{' '}
          {table.getPageCount()}
        </strong>
      </span>
      <span className="flex items-center gap-1">
        | Go to page:
        <input
          type="number"
          defaultValue={table.getState().pagination.pageIndex + 1}
          onChange={e => {
            const page = e.target.value ? Number(e.target.value) - 1 : 0
            table.setPageIndex(page)
          }}
          className="border p-1 rounded w-16"
        />
      </span>
      <select
        value={table.getState().pagination.pageSize}
        onChange={e => {
          table.setPageSize(Number(e.target.value))
        }}
      >
        {[10, 20, 30, 40, 50].map(pageSize => (
          <option key={pageSize} value={pageSize}>
            Show {pageSize}
          </option>
        ))}
      </select>
    </div>
    <div>{table.getRowModel().rows.length} Rows</div>
    <div>
      <button onClick={() => rerender()}>Force Rerender</button>
    </div>
    <div>
      <button onClick={() => refreshData()}>Refresh Data</button>
    </div>
  </div>
  )
}
