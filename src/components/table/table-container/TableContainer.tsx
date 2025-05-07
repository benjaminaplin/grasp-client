import { ReactNode, SyntheticEvent } from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableContainer from '@mui/material/TableContainer'
import Paper from '@mui/material/Paper'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'
import TablePagination from '@mui/material/TablePagination'

export const AppTableContainer = ({
  children,
  dense,
  tableHeaders,
  handleChangeDense,
  pagination,
  handleChangeRowsPerPage,
  handleChangePage,
}: {
  children: ReactNode
  dense: boolean
  tableHeaders: ReactNode
  pagination: any
  handleChangeDense: (event: SyntheticEvent) => void
  handleChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement>) => void
  handleChangePage: (event: React.MouseEvent | null, page: number) => void
}) => {
  console.log('🚀 ~ pagination:', pagination)
  return (
    <Paper>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size={dense ? 'small' : 'medium'}>
          {tableHeaders}
          <TableBody>{children}</TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component='div'
        count={pagination.count}
        page={pagination.pageIndex}
        onPageChange={handleChangePage}
        rowsPerPage={pagination.rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[10, 25, 50]}
      />
      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label='Dense padding'
      />
    </Paper>
  )
}
