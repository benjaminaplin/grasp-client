import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  flexRender,
  CellContext,
  getSortedRowModel,
} from '@tanstack/react-table'
import { Contact } from '../../types/contact'
import {
  ReactNode,
  SyntheticEvent,
  useCallback,
  useEffect,
  useState,
} from 'react'
import { Link } from 'react-router-dom'
import { DeleteButtonCell } from '../../components/delete-button-cell/DeleteButtonCell'
import { getTableHeader } from '../../components/table/table-header/TableHeader'
import { TableCellInput } from '../../components/table/table-cell-input/TableCellInput'
import { EditButtonCell } from '../../components/edit-button-cell/EditButtonCell'
import { Company } from '../../types/company'
import { useLoadingColumns } from '../../components/table/hooks/use-loading-columns'
import { AppTableContainer } from '../../components/table/table-container/TableContainer'
import { useLocalStorage } from 'usehooks-ts'
import '../../styles/table-style.css'
import { PaginationParams } from '../../hooks/usePagination'

const linkToContactCellFn = (info: CellContext<Contact, unknown>) => {
  return (
    <Link to={`/contacts/${info.row.original.id}`}>
      {info.getValue() as ReactNode}
    </Link>
  )
}

type ContactsTableType = {
  contactsAreLoading: boolean
  updateContact: (updatedContact: {
    contact: Partial<Contact>
    id: number
  }) => void
  tableData: Contact[] | undefined
  refreshTableData: () => void
  deleteContact: (id: number) => void
  handleOpenContactForm: (contactId: number | undefined) => void
}

export const ContactsTable = ({
  updateContact,
  tableData,
  deleteContact,
  contactsAreLoading,
  handleOpenContactForm,
}: ContactsTableType) => {
  const initial: PaginationParams = { page: 1, limit: 10 }
  const [pagination, setPagination] = useState<PaginationParams>(initial)
  const handlePageChange = useCallback((_e: unknown, newPage: number) => {
    setPagination((prev) =>
      prev.page === newPage + 1 ? prev : { ...prev, page: newPage + 1 },
    )
  }, [])

  const handleLimitChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newLimit = parseInt(event.target.value, 10)
      setPagination((prev) =>
        prev.limit === newLimit ? prev : { page: 1, limit: newLimit },
      )
    },
    [],
  )

  const defaultColumn: Partial<ColumnDef<Contact>> = {
    cell: ({ getValue, row, column, table }) => {
      const initialValue = getValue()
      // We need to keep and update the state of the cell normally
      const [value, setValue] = useState(initialValue)

      // When the input is blurred, we'll call our table meta's updateData function
      const onBlur = () => {
        table.options.meta?.updateData(row.index, column.id, value)
        updateContact({
          contact: { [column.id]: value },
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
  const [dense, setDense] = useLocalStorage('dense', false)

  const columns = [
    {
      accessorKey: 'firstName',
      header: () => <span>First Name</span>,
      footer: (props: { column: { id: number } }) => props.column.id,
      cell: linkToContactCellFn,
    },
    {
      accessorFn: (row: { lastName: any }) => row.lastName,
      id: 'lastName',
      header: () => <span>Last Name</span>,
      footer: (props: { column: { id: number } }) => props.column.id,
      cell: linkToContactCellFn,
    },
    {
      accessorFn: (row: { closeness: any }) => row.closeness,
      id: 'closeness',
      header: () => <span>Closeness</span>,
      footer: (props: { column: { id: number } }) => props.column.id,
    },
    {
      accessorFn: (row: { title: any }) => row.title,
      id: 'title',
      header: () => <span>Title</span>,
      footer: (props: { column: { id: number } }) => props.column.id,
    },
    {
      accessorFn: (row: { type: any }) => row.type,
      id: 'type',
      header: () => <span>Type</span>,
      footer: (props: { column: { id: number } }) => props.column.id,
    },
    {
      accessorFn: (row: { notes: string }) => row.notes,
      id: 'notes',
      header: () => <span>Notes</span>,
      footer: (props: { column: { id: number } }) => props.column.id,
    },
    {
      accessorFn: (row: { company: Company }) => row.company,
      id: 'company',
      header: () => <span>Company</span>,
      footer: (props: { column: { id: number } }) => props.column.id,
      // @ts-expect-error because TS doesn't have type for `original`
      cell: ({ row: { original } }) => <div>{original?.company?.name}</div>,
    },

    {
      accessorFn: (row: { nextSteps: string | any[] }) => row.nextSteps.length,
      id: 'nextSteps',
      header: () => <span>NextSteps</span>,
      footer: (props: { column: { id: number } }) => props.column.id,
      cell: linkToContactCellFn,
    },
    {
      accessorFn: (row: { touches: string | any[] }) => row.touches.length,
      id: 'touches',
      header: () => <span>Touches</span>,
      footer: (props: { column: { id: number } }) => props.column.id,
      // @ts-expect-error because we don't have type for `original`
      cell: ({ row: { original } }) => (
        <Link to={`/touches`}>{original?.touches?.length}</Link>
      ),
    },
    {
      header: 'Edit',
      cell: ({ row }: CellContext<Contact, unknown>) => (
        <EditButtonCell
          row={row}
          editResource={() => handleOpenContactForm(row.original?.id)}
        />
      ),
    },
    {
      header: 'Delete',
      cell: ({ row }: CellContext<Contact, unknown>) => (
        <DeleteButtonCell row={row} deleteResource={deleteContact} />
      ),
    },
  ]

  const memoColumns = useLoadingColumns<Contact>(
    columns as ColumnDef<Contact>[],
    contactsAreLoading,
  )

  const table = useReactTable({
    columns: memoColumns,
    defaultColumn,
    data: tableData || [],
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    debugTable: true,
    rowCount: tableData?.length,
    getSortedRowModel: getSortedRowModel(),
  })

  const tableHeaders = getTableHeader<Contact>(table)
  const count = tableData?.total || 0
  const paginationProps = {
    ...pagination,
    count,
    pageIndex: Math.max(pagination.page - 1, 0),
    rowsPerPage: pagination.limit || 10,
  }
  const handleChangeDense = (event: SyntheticEvent) => {
    setDense((event.target as HTMLInputElement).checked)
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
