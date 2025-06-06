import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  flexRender,
  getSortedRowModel,
} from '@tanstack/react-table'
import { SyntheticEvent, useEffect, useMemo, useState } from 'react'
import { Interview } from '../../types/interview'
import { Link } from 'react-router-dom'
import { relationFilterFn } from '../../utils/FilterFn'
import { DeleteButtonCell } from '../../components/delete-button-cell/DeleteButtonCell'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { getTableHeader } from '../../components/table/table-header/TableHeader'
import { format } from 'date-fns'
import { TableCellInput } from '../../components/table/table-cell-input/TableCellInput'
import { defaultHeaders } from '../../context/WrapUseQuery'
import { Company } from '../../types/company'
import { useLoadingColumns } from '../../components/table/hooks/use-loading-columns'
import { getBaseUrl } from '../../service/getUrl'
import { AppTableContainer } from '../../components/table/table-container/TableContainer'
import { useLocalStorage } from 'usehooks-ts'
import '../../styles/table-style.css'
import { PaginatedResponse } from '../../types/paginatedResponse'

type InterviewsTableType = {
  updateInterview: (updatedInterview: {
    interview: Partial<Interview>
    id: number
  }) => void
  tableData: PaginatedResponse<Interview> | undefined
  refreshTableData: () => void
  companyMap: { [key: string]: Company[] }
  interviewsAreLoading: boolean
}

export const InterviewsTable = ({
  updateInterview,
  tableData,
  refreshTableData,
  companyMap,
  interviewsAreLoading,
}: InterviewsTableType) => {
  const [dense, setDense] = useLocalStorage('dense', false)

  const defaultColumn: Partial<ColumnDef<Interview>> = {
    cell: ({ getValue, row, column, table }) => {
      const initialValue = getValue()
      // We need to keep and update the state of the cell normally
      const [value, setValue] = useState(initialValue)

      // When the input is blurred, we'll call our table meta's updateData function
      const onBlur = () => {
        table.options.meta?.updateData(row.index, column.id, value)
        updateInterview({
          interview: { [column.id]: value },
          id: row.original.id as number,
        })
      }

      // If the initialValue is changed external, sync it up with our state
      useEffect(() => {
        setValue(initialValue)
      }, [initialValue])

      const onChange = (e: { target: { value: unknown } }) =>
        setValue(e.target.value)
      return (
        <TableCellInput
          value={value as string}
          onChange={onChange}
          onBlur={onBlur}
        />
      )
    },
  }

  const onMutateSuccess = () => {
    // setIsInterviewFormOpen(false)
    refreshTableData()
  }

  const { mutate: mutateDeleteInterview } = useMutation({
    mutationFn: (interviewId: number) => {
      return axios.delete(`${getBaseUrl()}/interviews/${interviewId}`, {
        headers: defaultHeaders,
      })
    },
    onSuccess: onMutateSuccess,
  })
  const deleteInterview = (interviewId: number) => {
    mutateDeleteInterview(interviewId)
  }

  const columns = useMemo<ColumnDef<Interview>[]>(
    () => [
      {
        accessorFn: (row) => row.round,
        id: 'round',
        header: () => <span>Round</span>,
        footer: (props) => props.column.id,
        enableSorting: true,
      },
      {
        accessorFn: (row) => row.date,
        id: 'date',
        header: () => <span>Date</span>,
        footer: (props) => props.column.id,
        enableSorting: true,
        cell: (info) => {
          return (
            <span>
              {info.row.original.date
                ? `${format(info.row.original.date, 'MM/dd/yyyy')}`
                : ''}
            </span>
          )
        },
      },
      {
        accessorKey: 'jobApplication',
        id: 'jobApplication',
        header: () => <span>Application</span>,
        footer: (props) => props.column.id,
        cell: ({
          row: {
            original: { jobApplication, jobApplicationId },
          },
        }) => {
          const role = jobApplication?.role
          const company = jobApplication?.company?.name || { name: null }
          return (
            <Link
              to={`/job-applications/${jobApplicationId}`}
            >{`${role} ${jobApplication?.company?.name}`}</Link>
          )
        },
        filterFn: relationFilterFn<Interview>(),
        enableSorting: true,
      },
      {
        accessorKey: 'status',
        header: () => <span>Status</span>,
        footer: (props) => props.column.id,
        enableSorting: true,
      },
      {
        accessorFn: (row) => row.notes,
        id: 'notes',
        header: () => <span>Notes</span>,
        footer: (props) => props.column.id,
      },
      {
        header: 'Delete',
        cell: ({ row }) => (
          <DeleteButtonCell
            row={row}
            deleteResource={(id: number) => deleteInterview(id)}
          />
        ),
      },
    ],
    [],
  )

  const memoColumns = useLoadingColumns<Interview>(
    columns as ColumnDef<Interview>[],
    interviewsAreLoading,
  )

  const handleChangeDense = (event: SyntheticEvent) => {
    setDense((event.target as HTMLInputElement).checked)
  }

  const table = useReactTable({
    columns: memoColumns,
    defaultColumn,
    data: tableData?.data || [],
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    debugTable: true,
    rowCount: tableData?.total,
    initialState: {
      sorting: [
        {
          id: 'dateApplied',
          desc: true,
        },
      ],
    },
    getSortedRowModel: getSortedRowModel(),
  })
  const tableHeaders = getTableHeader<Interview>(table)

  return (
    <AppTableContainer
      dense={dense}
      tableHeaders={tableHeaders}
      handleChangeDense={handleChangeDense}
    >
      {table.getRowModel().rows.map((row) => {
        return (
          <tr key={row.id}>
            {row.getVisibleCells().map((cell) => {
              return (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              )
            })}
          </tr>
        )
      })}
    </AppTableContainer>
  )
}
