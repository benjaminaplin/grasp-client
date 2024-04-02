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
import './interview-table.css'
import { Interview } from '../../types/interview'
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

type InterviewsTableType = {
  updateInterview: (updatedInterview: {interview: Partial<Interview>, id: number}) => void,
  tableData: Interview[] | undefined,
  refreshTableData: () => void
  companyMap: {[key: string]: string}
}

export const InterviewsTable = ({
  updateInterview,
  tableData,
  refreshTableData,
  companyMap
}: InterviewsTableType)=>  {
  console.log('companyMap', companyMap)
  const defaultColumn: Partial<ColumnDef<Interview>> = {
    cell: ({ getValue, row, column, table }) => {
      const initialValue = getValue()
      // We need to keep and update the state of the cell normally
      const [value, setValue] = useState(initialValue)
  
      // When the input is blurred, we'll call our table meta's updateData function
      const onBlur = () => {
        table.options.meta?.updateData(row.index, column.id, value)
        updateInterview({interview: {[column.id]: value}, id: row.original.id as number})
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
    // setIsInterviewFormOpen(false)
    refreshTableData()
  }

  const {mutate: mutateDeleteContact } = useMutation({
    mutationFn: (interviewId: number) => {
      return axios.delete(`${import.meta.env.VITE_DEV_API_URL}/job-Interviews/${interviewId}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
    },
    onSuccess: onMutateSuccess
  })
  const deleteContact = (interviewId: number) => {
    mutateDeleteContact(interviewId)
  }
  const columns = useMemo<ColumnDef<Interview>[]>(()=>[
    {
      id: 'index',
      cell: (info) => (
         <span >{`${info.row.index + 1}`}</span>
      )
    },
    {
      accessorFn: row => row.round,
      id: 'round',
      header: () => <span>Round</span>,
      footer: props => props.column.id,
      enableSorting: true
    },
    {
      accessorKey: 'jobApplication',
      id: 'jobApplication',
      header: () => <span>Application</span>,
      footer: props => props.column.id,
      cell: ({row: {original: {jobApplication, jobApplicationId }}}) => {
        console.log('jobApp', jobApplication)
        console.log("companyMap", companyMap)
        const role = jobApplication?.role
        const company = jobApplication?.companyId && companyMap?.[jobApplication?.companyId]
        console.log('companyId', jobApplication?.companyId)
        return <Link to={`/job-applications/${jobApplicationId}`}>{`${role} ${company}`}</Link>
      },
      filterFn: relationFilterFn<Interview>(),
      enableSorting: true
    },  
    {
      accessorKey: 'status',
      header: () => <span>Status</span>,
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
      <table>
       {getTableHeader<Interview>(table)}
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
