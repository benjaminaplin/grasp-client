import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  flexRender,
  RowData,
  CellContext,
} from '@tanstack/react-table'
import { Contact } from '../../types/contact'
import { ReactNode, useEffect, useMemo, useState } from 'react'
import './contact-table.css'
import { Filter } from '../../components/table-filter/TableFilter'
import { Link } from 'react-router-dom'
import { DeleteButtonCell } from '../../components/delete-button-cell/DeleteButtonCell'

declare module '@tanstack/react-table' {
  interface TableMeta<TData extends RowData> {
    updateData: (rowIndex: number, columnId: string, value: unknown) => void
  }
}

const linkToContactCellFn = (info: CellContext<Contact, unknown>)  => {
  return <Link to={`/contacts/${info.row.original.id}`}>{info.getValue() as ReactNode}</Link>
}

type ContactsTableType = {
  updateContact: (updatedContact: {contact: Partial<Contact>, id: number}) => void,
  tableData: Contact[] | undefined,
  refreshTableData: () => void
  deleteContact: (id: number) => void
}

export const ContactsTable = ({
  updateContact,
  tableData,
  deleteContact
}: ContactsTableType)=>  {
  const defaultColumn: Partial<ColumnDef<Contact>> = {
    cell: ({ getValue, row, column, table }) => {
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

  const columns = useMemo<ColumnDef<Contact>[]>(()=>[
      {
        accessorKey: 'firstName',
        header: () => <span>First Name</span>,
        footer: props => props.column.id,
        cell: linkToContactCellFn
      },
      {
        accessorFn: row => row.lastName,
        id: 'lastName',
        header: () => <span>Last Name</span>,
        footer: props => props.column.id,
        cell: linkToContactCellFn
      },
      {
        accessorFn: row => row.closeness,
        id: 'closeness',
        header: () => <span>Closeness</span>,
        footer: props => props.column.id,
      },
      {
        accessorFn: row => row.title,
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
      {
        accessorFn: row => row.nextSteps.length,
        id: 'nextSteps',
        header: () => <span>NextSteps</span>,
        footer: props => props.column.id,
        cell: linkToContactCellFn
      },
      {
        header: 'Delete',
        cell: ({row}: CellContext<Contact, unknown>) => <DeleteButtonCell row={row} deleteResource={deleteContact} />
      }
  ],[])

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
  </>
  )
}
