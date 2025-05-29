import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  flexRender,
  CellContext,
  getSortedRowModel,
  getPaginationRowModel,
} from '@tanstack/react-table'
import { ReactNode, SyntheticEvent, useEffect, useMemo, useState } from 'react'
import { Company } from '../../types/company'
import { DeleteButtonCell } from '../../components/delete-button-cell/DeleteButtonCell'
import { Link } from 'react-router-dom'
import { getTableHeader } from '../../components/table/table-header/TableHeader'
import { TableCellInput } from '../../components/table/table-cell-input/TableCellInput'
import { useLoadingColumns } from '../../components/table/hooks/use-loading-columns'
import '../../styles/table-style.css'
import { AppTableContainer } from '../../components/table/table-container/TableContainer'
import { useLocalStorage } from 'usehooks-ts'
import { Button } from '@mui/material'
import { PaginationFooter } from '../../components/table/pagination/pagination-footer'
import { PaginatedResponse } from '../../types/paginatedResponse'

const linkToCompanyCellFn = (info: CellContext<Company, unknown>) => {
  return (
    <Link to={`/companies/${info.row.original.id}`}>
      {info.getValue() as ReactNode}
    </Link>
  )
}

type CompanysTableType = {
  updateCompany: (updatedCompany: {
    company: Partial<Company>
    id: number
  }) => void
  tableData: PaginatedResponse<Company> | undefined
  refreshTableData: () => void
  deleteCompany: (id: number) => void
  companiesAreLoading: boolean
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
}

export const CompanyTable = ({
  updateCompany,
  tableData,
  deleteCompany,
  companiesAreLoading,
  pagination,
  setPagination,
}: CompanysTableType) => {
  const [dense, setDense] = useLocalStorage('dense', false)

  const defaultColumn: Partial<ColumnDef<Company>> = {
    cell: ({ getValue, row, column, table }) => {
      const initialValue = getValue()
      // We need to keep and update the state of the cell normally
      const [value, setValue] = useState(initialValue)

      // When the input is blurred, we'll call our table meta's updateData function
      const onBlur = () => {
        table.options.meta?.updateData(row.index, column.id, value)
        updateCompany({
          company: { [column.id]: value },
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
    size: 200, //starting column size
    minSize: 50, //enforced during column resizing
    maxSize: 500, //enforced during column resizing
  }

  const columns = useMemo<ColumnDef<Company>[]>(
    () => [
      {
        accessorFn: (row) => row.name,
        id: 'name',
        header: () => <span>Name</span>,
        footer: (props) => props.column.id,
        cell: linkToCompanyCellFn,
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
            deleteResource={(id: number) => deleteCompany(id)}
          />
        ),
      },
    ],
    [],
  )

  const memoColumns = useLoadingColumns<Company>(
    columns as ColumnDef<Company>[],
    companiesAreLoading,
  )

  const paginationState = {
    pageIndex: pagination.pageIndex,
    pageSize: pagination.pageSize,
  }

  const table = useReactTable({
    columns: memoColumns,
    defaultColumn,
    data: tableData?.data || [],
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    debugTable: true,
    rowCount: tableData?.total || 0,
    getSortedRowModel: getSortedRowModel(),
    onPaginationChange: setPagination, //update the pagination state when internal APIs mutate the pagination state
    state: {
      pagination: paginationState,
    },
    manualPagination: true, //we're doing manual "server-side" pagination
  })

  const handleChangeDense = (event: SyntheticEvent) => {
    setDense((event.target as HTMLInputElement).checked)
  }

  const tableHeaders = getTableHeader<Company>(table)

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
      <PaginationFooter table={table} />
    </AppTableContainer>
  )
}
