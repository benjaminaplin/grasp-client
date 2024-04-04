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
import { Contact } from '../../types/contact'
import { ReactNode, useEffect, useMemo, useState } from 'react'
import './contact-table.css'
import { Filter } from '../../components/table/table-filter/TableFilter'
import { Link } from 'react-router-dom'
import { DeleteButtonCell } from '../../components/delete-button-cell/DeleteButtonCell'
import { getTableHeader } from '../../components/table/table-header/TableHeader'
import { Loader } from '../../components/loaders/Loader'
import { Skeleton } from '@mui/material'

declare module '@tanstack/react-table' {
  interface TableMeta<TData extends RowData> {
    updateData: (rowIndex: number, columnId: string, value: unknown) => void
  }
}

const linkToContactCellFn = (info: CellContext<Contact, unknown>)  => {
  return <Link to={`/contacts/${info.row.original.id}`}>{info.getValue() as ReactNode}</Link>
}

type ContactsTableType = {
  contactsAreLoading: boolean
  updateContact: (updatedContact: {contact: Partial<Contact>, id: number}) => void,
  tableData: Contact[] | undefined,
  refreshTableData: () => void
  deleteContact: (id: number) => void
}

export const ContactsTable = ({
  updateContact,
  tableData,
  deleteContact,
  contactsAreLoading
}: ContactsTableType)=>  {
  console.log('loading',contactsAreLoading)
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

  const columns = [
      {
        accessorKey: 'firstName',
        header: () => <span>First Name</span>,
        footer: (props: { column: { id: any } }) => props.column.id,
        cell: linkToContactCellFn
      },
      {
        accessorFn: (row: { lastName: any }) => row.lastName,
        id: 'lastName',
        header: () => <span>Last Name</span>,
        footer: (props: { column: { id: any } }) => props.column.id,
        cell: linkToContactCellFn
      },
      {
        accessorFn: (row: { closeness: any }) => row.closeness,
        id: 'closeness',
        header: () => <span>Closeness</span>,
        footer: (props: { column: { id: any } }) => props.column.id,
      },
      {
        accessorFn: (row: { title: any }) => row.title,
        id: 'title',
        header: () => <span>Title</span>,
        footer: (props: { column: { id: any } }) => props.column.id,
      },
      {
        accessorFn: (row: { type: any }) => row.type,
        id: 'type',
        header: () => <span>Type</span>,
        footer: (props: { column: { id: any } }) => props.column.id,
      },
      {
        accessorFn: (row: { notes: any }) => row.notes,
        id: 'notes',
        header: () => <span>Notes</span>,
        footer: (props: { column: { id: any } }) => props.column.id,
      },
      {
        accessorFn: (row: { nextSteps: string | any[] }) => row.nextSteps.length,
        id: 'nextSteps',
        header: () => <span>NextSteps</span>,
        footer: (props: { column: { id: any } }) => props.column.id,
        cell: linkToContactCellFn
      },
      {
        header: 'Delete',
        cell: ({row}: CellContext<Contact, unknown>) => <DeleteButtonCell row={row} deleteResource={deleteContact} />
      }
  ]
  
  const memoColumns = useMemo<ColumnDef<Contact>[]>(() => 
     contactsAreLoading
      ? columns.map((column) => ({
          ...column,
          cell: () => <Skeleton />,
        }))
      : columns,
  [contactsAreLoading])

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
          {getTableHeader<Contact>(table)}        <tbody>
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
