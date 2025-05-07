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
import { ReactNode, SyntheticEvent, useEffect, useMemo, useState } from 'react'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import { Application } from '../../types/application'
import { Link } from 'react-router-dom'
import { relationFilterFn } from '../../utils/FilterFn'
import { DeleteButtonCell } from '../../components/delete-button-cell/DeleteButtonCell'
import { useMutation } from '@tanstack/react-query'
import { getTableHeader } from '../../components/table/table-header/TableHeader'
import { TableCellInput } from '../../components/table/table-cell-input/TableCellInput'
import { defaultHeaders, useQueryWrapper } from '../../context/WrapUseQuery'
import { useLoadingColumns } from '../../components/table/hooks/use-loading-columns'
import { AppTableContainer } from '../../components/table/table-container/TableContainer'
import { getBaseUrl } from '../../service/getUrl'
import { useLocalStorage } from 'usehooks-ts'
import '../../styles/table-style.css'
import { usePagination } from '../../hooks/usePagination'
import { Company } from '../../types/company'

type ApplicationsTableType = {
  companies: Company[] | undefined
  handleUpdateRowCount: (count: number) => void
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

export const ApplicationsTable = ({
  companies,
  handleUpdateRowCount,
}: ApplicationsTableType) => {
  const [dense, setDense] = useLocalStorage('dense', false)
  const { pagination, pageIndex, handlePageChange, handleLimitChange } =
    usePagination()
  console.log('🚀 ~ pagination:', pagination)

  const {
    data: applications,
    refetch: refetchApplications,
    isLoading: areApplicationsLoading,
  } = useQueryWrapper<Application[]>(
    'job-applications',
    undefined,
    undefined,
    undefined,
    pagination,
  )

  const onMutateSuccess = () => {
    // setIsApplicationFormOpen(false)
    refetchApplications()
  }

  const { mutate: mutateDeleteContact } = useMutation({
    mutationFn: (applicationId: number) => {
      return axios.delete(`${getBaseUrl()}/job-applications/${applicationId}`, {
        headers: defaultHeaders,
      })
    },
    onSuccess: onMutateSuccess,
  })
  const deleteContact = (applicationId: number) => {
    mutateDeleteContact(applicationId)
  }

  const columns = useMemo<ColumnDef<Application>[]>(
    () => [
      {
        accessorFn: (row) => row.role,
        id: 'role',
        header: () => <span>Role</span>,
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
        accessorKey: 'company',
        id: 'company',
        header: () => <span>Company</span>,
        footer: (props) => props.column.id,
        cell: (info) => {
          console.log('🚀 ~ count:', count)
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
        accessorKey: 'status',
        header: () => <span>Status</span>,
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
            deleteResource={(id: number) => deleteContact(id)}
          />
        ),
      },
    ],
    [],
  )

  const memoColumns = useLoadingColumns<Application>(
    columns as ColumnDef<Application>[],
    areApplicationsLoading,
  )

  const table = useReactTable({
    columns: memoColumns,
    defaultColumn,
    data: applications || [],
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    debugTable: true,
    rowCount: applications?.length,
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

  const handleChangeDense = (event: SyntheticEvent) => {
    setDense((event.target as HTMLInputElement).checked)
  }
  // @ts-expect-error need to figure out
  const applicationTableData = table
    .getRowModel()
    ?.rows?.map((a: Application) => ({
      ...a,
      company:
        companies?.find((c: Company) => c.id === a.companyId)?.name || null,
    }))

  const tableHeaders = getTableHeader<Application>(table)
  const count = applicationTableData.length
  console.log('count', count)
  const paginationProps = {
    ...pagination,
    count,
    rowsPerPage: pagination.limit,
    pageIndex,
  }

  return (
    <AppTableContainer
      dense={dense}
      tableHeaders={tableHeaders}
      handleChangeDense={handleChangeDense}
      pagination={paginationProps}
      handleChangePage={handlePageChange}
      handleChangeRowsPerPage={handleLimitChange}
    >
      {applicationTableData.map((row) => {
        return (
          <TableRow key={row.id}>
            {/* @ts-expect-error need to figure out */}
            {row.getVisibleCells().map((cell) => {
              return (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              )
            })}
          </TableRow>
        )
      })}
    </AppTableContainer>
  )
}
