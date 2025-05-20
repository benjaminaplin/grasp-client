import { Table } from '@tanstack/react-table'
import { Company } from '../../../types/company'
import Button from '@mui/material/Button'

export const PaginationFooter = ({ table }: { table: Table<any> }) => {
  return (
    <>
      <Button
        onClick={() => table.firstPage()}
        disabled={!table.getCanPreviousPage()}
      >
        {'<<'}
      </Button>
      <Button
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
      >
        {'<'}
      </Button>
      <Button
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}
      >
        {'>'}
      </Button>
      <Button
        onClick={() => table.lastPage()}
        disabled={!table.getCanNextPage()}
      >
        {'>>'}
      </Button>
      <select
        value={table.getState().pagination.pageSize}
        onChange={(e) => {
          table.setPageSize(Number(e.target.value))
        }}
      >
        {[10, 20, 30, 40, 50].map((pageSize) => (
          <option key={pageSize} value={pageSize}>
            {pageSize}
          </option>
        ))}
      </select>
    </>
  )
}
