import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  flexRender,
  getSortedRowModel,
} from '@tanstack/react-table'
import { ReactNode, SyntheticEvent, useEffect, useMemo, useState } from 'react'
import { NextStep } from '../../types/next-step'
import { Link } from 'react-router-dom'
import { relationFilterFn } from '../../utils/FilterFn'
import { DeleteButtonCell } from '../../components/delete-button-cell/DeleteButtonCell'
import { getTableHeader } from '../../components/table/table-header/TableHeader'
import { TableCellInput } from '../../components/table/table-cell-input/TableCellInput'
import { coerceStringToBool } from '../../utils/coerce-str-bool'
import { format } from 'date-fns'
import { useLoadingColumns } from '../../components/table/hooks/use-loading-columns'
import { useLocalStorage } from 'usehooks-ts'
import { AppTableContainer } from '../../components/table/table-container/TableContainer'
import '../../styles/table-style.css'

type NextStepTableType = {
  updateNextStep: (updatedNextStep: {
    nextStep: Partial<NextStep>
    id: number
  }) => void
  tableData: NextStep[] | undefined
  refreshTableData: () => void
  deleteNextStep: (id: number) => void
  areNextStepsLoading: boolean
}

export const NextStepTable = ({
  updateNextStep,
  tableData,
  deleteNextStep,
  areNextStepsLoading,
}: NextStepTableType) => {
  const [dense, setDense] = useLocalStorage('dense', false)

  const defaultColumn: Partial<ColumnDef<NextStep>> = {
    cell: ({ getValue, row, column, table }) => {
      const getInitialValue = () => {
        const initialValue = getValue()
        const inputValue = coerceStringToBool(initialValue)
        return inputValue
      }
      // We need to keep and update the state of the cell normally
      const [value, setValue] = useState(getInitialValue)
      // When the input is blurred, we'll call our table meta's updateData function
      const onBlur = () => {
        table.options.meta?.updateData(row.index, column.id, value)
        updateNextStep({
          nextStep: { ...row.original, [column.id]: value },
          id: row.original.id as number,
        })
      }

      // If the initialValue is changed external, sync it up with our state
      useEffect(() => {
        const initialValue = getInitialValue()
        setValue(initialValue)
      }, [])

      const onChange = (e: {
        target: { value: unknown; checked: boolean | undefined }
      }) => {
        const isCheckBox =
          typeof e.target?.checked === 'boolean' &&
          (e.target.value === 'on' || e.target.value === 'off')

        const inputValue = isCheckBox ? e.target.checked : e.target.value
        if (isCheckBox) {
          updateNextStep({
            nextStep: { ...row.original, [column.id]: e.target?.checked },
            id: row.original.id as number,
          })
        }
        setValue(inputValue)
      }

      return (
        <TableCellInput
          value={value as string}
          onChange={onChange as any}
          onBlur={onBlur}
        />
      )
    },
  }

  const columns = useMemo<ColumnDef<NextStep>[]>(
    () => [
      {
        accessorFn: (row) => row.action,
        id: 'action',
        header: () => <span>Action</span>,
        footer: (props) => props.column.id,
      },
      {
        accessorFn: (row) => row.notes,
        id: 'notes',
        header: () => <span>Notes</span>,
        footer: (props) => props.column.id,
      },
      {
        accessorKey: 'contact',
        id: 'contact',
        header: () => <span>Contact</span>,
        footer: (props) => props.column.id,
        cell: (info) => {
          return (
            <Link to={`/contacts/${info.row.original.contactId}`}>
              {info.getValue() as ReactNode}
            </Link>
          )
        },
        filterFn: relationFilterFn<NextStep>(),
      },
      {
        accessorKey: 'dueDate',
        id: 'dueDate',
        header: () => <span>Due Date</span>,
        footer: (props) => props.column.id,
        cell: (info) => {
          return (
            <span>
              {info.row.original.dueDate
                ? `${format(info.row.original.dueDate, 'MM/dd/yyyy')}`
                : ''}
            </span>
          )
        },
      },
      {
        accessorFn: (row) => row.completed,
        id: 'completed',
        header: () => <span>Completed</span>,
        footer: (props) => props.column.id,
      },
      {
        header: 'Delete',
        cell: ({ row }) => (
          <DeleteButtonCell row={row} deleteResource={deleteNextStep} />
        ),
      },
    ],
    [],
  )

  const memoColumns = useLoadingColumns<NextStep>(
    columns as ColumnDef<NextStep>[],
    areNextStepsLoading,
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
    initialState: {
      sorting: [
        {
          id: 'completed',
          desc: false,
        },
      ],
    },
  })

  const handleChangeDense = (event: SyntheticEvent) => {
    setDense((event.target as HTMLInputElement).checked)
  }

  const tableHeaders = getTableHeader<NextStep>(table)

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
