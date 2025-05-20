import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  flexRender,
  getSortedRowModel,
} from '@tanstack/react-table'
import { format } from 'date-fns'
import axios from 'axios'
import {
  ReactNode,
  SyntheticEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import { Application } from '../../types/application'
import { Link } from 'react-router-dom'
import { relationFilterFn } from '../../utils/FilterFn'
import { DeleteButtonCell } from '../../components/delete-button-cell/DeleteButtonCell'
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { getTableHeader } from '../../components/table/table-header/TableHeader'
import { TableCellInput } from '../../components/table/table-cell-input/TableCellInput'
import { defaultHeaders, fetcher } from '../../context/WrapUseQuery'
import { useLoadingColumns } from '../../components/table/hooks/use-loading-columns'
import { AppTableContainer } from '../../components/table/table-container/TableContainer'
import { getBaseUrl } from '../../service/getUrl'
import { useLocalStorage } from 'usehooks-ts'
import '../../styles/table-style.css'
import { Company } from '../../types/company'
import { PaginatedResponse } from '../../types/paginatedResponse'
import { useAuth0 } from '@auth0/auth0-react'
import { JOB_APPLICATIONS_KEY } from '../../constants/queryKeys'
import { PaginationFooter } from '../../components/table/pagination/pagination-footer'

type ApplicationsTableType = {
  setPagination: React.Dispatch<
    React.SetStateAction<{
      pageIndex: number
      pageSize: number
    }>
  >
  pagination: {
    pageIndex: number
    pageSize: number
  }
  tableData: PaginatedResponse<Application> | undefined
  isLoading: boolean
}

export const ApplicationsTable = ({
  pagination,
  setPagination,
  tableData,
  isLoading,
}: ApplicationsTableType) => {
  const { getAccessTokenSilently } = useAuth0()
  const queryClient = useQueryClient()
  const [dense, setDense] = useLocalStorage('dense', false)

  const { mutate: mutateUpdateApplication } = useMutation({
    mutationFn: async ({
      application,
      id,
    }: {
      application: Partial<Application>
      id: number
    }) => {
      const token = await getAccessTokenSilently()
      const res = axios.patch(
        `${getBaseUrl()}/job-applications/${id}`,
        JSON.stringify(application),
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      )
      return res
    },
  })

  const updateApplication = (updatedapplication: {
    application: Partial<Application>
    id: number
  }) => {
    mutateUpdateApplication(updatedapplication)
  }

  const defaultColumn: Partial<ColumnDef<Application>> = {
    cell: ({ getValue, row, column, table }) => {
      const initialValue = getValue()
      // We need to keep and update the state of the cell normally
      const [value, setValue] = useState(initialValue)

      // When the input is blurred, we'll call our table meta's updateData function
      const onBlur = () => {
        table.options.meta?.updateData(row.index, column.id, value)
        updateApplication({
          application: { [column.id]: value },
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

  const { mutate: mutateDeleteApplication } = useMutation({
    mutationFn: (applicationId: number) => {
      return fetcher(
        `${getBaseUrl()}/job-applications/${applicationId}`,
        {},
        'delete',
        getAccessTokenSilently,
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [JOB_APPLICATIONS_KEY] })
    },
  })

  const deleteApplication = (applicationId: number) => {
    mutateDeleteApplication(applicationId)
  }

  const columns = useMemo<ColumnDef<Application>[]>(
    () => [
      {
        accessorKey: 'company',
        id: 'company',
        header: () => <span>Company</span>,
        footer: (props) => props.column.id,
        cell: (info) => {
          return (
            <Link to={`/companies/${info.row.original.companyId}`}>
              {info.getValue() as ReactNode}
            </Link>
          )
        },
        filterFn: relationFilterFn<Application>(),
        enableSorting: true,
      },
      {
        accessorFn: (row) => row.role,
        id: 'role',
        header: () => <span>Role</span>,
        footer: (props) => props.column.id,
        enableSorting: true,
        cell: (info) => {
          return (
            <Link to={`/job-applications/${info.row.original.id}`}>
              {info.getValue() as ReactNode}
            </Link>
          )
        },
      },
      {
        accessorFn: (row) => row.dateApplied,
        id: 'dateApplied',
        header: () => <span>Date Applied</span>,
        cell: (info) => {
          return (
            <span>
              {info.row.original.dateApplied
                ? `${format(info.row.original.dateApplied, 'MM/dd/yyyy')}`
                : ''}
            </span>
          )
        },
        footer: (props) => props.column.id,
        sortingFn: 'datetime',
      },
      {
        accessorKey: 'interviewCount',
        id: 'interviewCount',
        header: () => <span>Interviews</span>,
        footer: (props) => props.column.id,
        filterFn: relationFilterFn<Application>(),
        enableSorting: true,
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'status',
        header: () => <span>Status</span>,
        footer: (props) => props.column.id,
        enableSorting: true,
      },
      {
        accessorFn: (row) => row.type,
        id: 'type',
        header: () => <span>Type</span>,
        footer: (props) => props.column.id,
        enableSorting: true,
      },
      {
        accessorKey: 'link',
        header: () => <span>Link</span>,
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
            deleteResource={(id: number) => deleteApplication(id)}
          />
        ),
      },
    ],
    [],
  )

  const memoColumns = useLoadingColumns<Application>(
    columns as ColumnDef<Application>[],
    isLoading,
  )

  const table = useReactTable({
    columns: memoColumns,
    defaultColumn,
    data: tableData?.data || [],
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    debugTable: true,
    rowCount: tableData?.total || 0,
    initialState: {
      sorting: [
        {
          id: 'dateApplied',
          desc: true,
        },
      ],
    },
    getSortedRowModel: getSortedRowModel(),
    onPaginationChange: setPagination, //update the pagination state when internal APIs mutate the pagination state
    state: {
      pagination,
    },
    manualPagination: true, //we're doing manual "server-side" pagination
  })

  const handleChangeDense = (event: SyntheticEvent) => {
    setDense((event.target as HTMLInputElement).checked)
  }
  const applicationTableData = table.getRowModel()?.rows

  const tableHeaders = getTableHeader<Application>(table)

  return (
    <>
      <AppTableContainer
        dense={dense}
        tableHeaders={tableHeaders}
        handleChangeDense={handleChangeDense}
      >
        {applicationTableData.map((row) => {
          return (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          )
        })}
      </AppTableContainer>
      <PaginationFooter table={table} />
    </>
  )
}
