import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  flexRender,
  RowData,
  getSortedRowModel,
} from '@tanstack/react-table'
import { format } from 'date-fns'
import { ReactNode, useEffect, useMemo, useState } from 'react'
import './application-table.css'
import { Filter } from '../../components/table/table-filter/TableFilter'
import { Application } from '../../types/application'
import { Link } from 'react-router-dom'
import { relationFilterFn } from '../../utils/FilterFn'
import { DeleteButtonCell } from '../../components/delete-button-cell/DeleteButtonCell'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { getTableHeader } from '../../components/table/table-header/TableHeader'

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

  const onMutateSuccess = () => {
    // setIsApplicationFormOpen(false)
    refreshTableData()
  }

  const {mutate: mutateDeleteContact } = useMutation({
    mutationFn: (applicationId: number) => {
      return axios.delete(`${import.meta.env.VITE_DEV_API_URL}/job-applications/${applicationId}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
    },
    onSuccess: onMutateSuccess
  })
  const deleteContact = (applicationId: number) => {
    mutateDeleteContact(applicationId)
  }

  const columns = useMemo<ColumnDef<Application>[]>(()=>[
    {
      id: 'index',
      cell: (info) => (
         <span >{`${info.row.index + 1}`}</span>
      )
    },
    {
      accessorFn: row => row.role,
      id: 'role',
      header: () => <span>Role</span>,
      footer: props => props.column.id,
      enableSorting: true
    },
    {
      accessorFn: row => row.type,
      id: 'type',
      header: () => <span>Type</span>,
      footer: props => props.column.id,
      enableSorting: true
    },
    {
      accessorFn: row => row.dateApplied,
      id: 'dateApplied',
      header: () => <span>Date Applied</span>,
      cell: (info) => {
        return <span >{info.row.original.dateApplied ? `${format(info.row.original.dateApplied, "MM/dd/yyyy")}` : ''}</span>
      },
      footer: props => props.column.id,
      sortingFn: 'datetime',
    },
    {
      accessorKey: 'company',
      id: 'company',
      header: () => <span>Company</span>,
      footer: props => props.column.id,
      cell: (info) => {
        return <Link to={`/companies/${info.row.original.companyId}`}>{info.getValue() as ReactNode}</Link>
      },
      filterFn: relationFilterFn<Application>(),
      enableSorting: true
    },  
    {
      accessorKey: 'status',
      header: () => <span>Status</span>,
      footer: props => props.column.id,
      enableSorting: true
    },
    {
      accessorKey: 'link',
      header: () => <span>Link</span>,
      footer: props => props.column.id,
      enableSorting: true
    },
    {
      accessorFn: row => row.notes,
      id: 'notes',
      header: () => <span>Notes</span>,
      footer: props => props.column.id,
    },
    {
      header: 'Delete',
      cell: ({row}) => <DeleteButtonCell row={row} deleteResource={(id: number) => deleteContact(id)} />,
    }
  ],[])

  const table = useReactTable({
    columns,
    defaultColumn,
    data: tableData || [],
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    debugTable: true,
    rowCount: tableData?.length,
    initialState: {
      sorting: [
        {
          id: 'dateApplied',
          desc: true,  
        },
      ],
    },
    getSortedRowModel: getSortedRowModel(), //provide a sorting row model
  })

  return (
    <>
      <table>
        {getTableHeader<Application>(table)}
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
