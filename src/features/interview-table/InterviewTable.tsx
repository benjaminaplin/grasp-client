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
import { format } from 'date-fns'
import Skeleton from '@mui/material/Skeleton'

declare module '@tanstack/react-table' {
  interface TableMeta<TData extends RowData> {
    updateData: (rowIndex: number, columnId: string, value: unknown) => void
  }
}

type InterviewsTableType = {
  updateInterview: (updatedInterview: {interview: Partial<Interview>, id: number}) => void
  tableData: Interview[] | undefined
  refreshTableData: () => void
  companyMap: {[key: string]: string}
  interviewsAreLoading: boolean
}

export const InterviewsTable = ({
  updateInterview,
  tableData,
  refreshTableData,
  companyMap,
  interviewsAreLoading
}: InterviewsTableType)=>  {
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

  const {mutate: mutateDeleteInterview } = useMutation({
    mutationFn: (interviewId: number) => {
      return axios.delete(`${import.meta.env.VITE_DEV_API_URL}/interviews/${interviewId}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
    },
    onSuccess: onMutateSuccess
  })
  const deleteInterview = (interviewId: number) => {
    mutateDeleteInterview(interviewId)
  }


  const columns = useMemo<ColumnDef<Interview>[]>(()=>[
    {
      accessorFn: row => row.round,
      id: 'round',
      header: () => <span>Round</span>,
      footer: props => props.column.id,
      enableSorting: true
    },
    {
      accessorFn: row => row.date,
      id: 'date',
      header: () => <span>Date</span>,
      footer: props => props.column.id,
      enableSorting: true,
      cell: (info) => {
        return <span >{info.row.original.date ? `${format(info.row.original.date, "MM/dd/yyyy")}` : ''}</span>
      },
    },
    {
      accessorKey: 'jobApplication',
      id: 'jobApplication',
      header: () => <span>Application</span>,
      footer: props => props.column.id,
      cell: ({row: {original: {jobApplication, jobApplicationId }}}) => {
        const role = jobApplication?.role
        const company = jobApplication?.companyId && companyMap?.[jobApplication?.companyId]
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
      cell: ({row}) => <DeleteButtonCell row={row} deleteResource={(id: number) => deleteInterview(id)} />,
    }
  ],[])


  const memoColumns = useMemo<ColumnDef<Interview>[]>(() => 
     interviewsAreLoading
      ? columns.map((column) => ({
          ...column,
          cell: () => <Skeleton />,
        }))
      : columns,
  [interviewsAreLoading])

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
