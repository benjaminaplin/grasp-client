import { ReactNode, SyntheticEvent } from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableContainer from '@mui/material/TableContainer'
import Paper from '@mui/material/Paper'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'

export const AppTableContainer = ({
  children,
  dense,
  tableHeaders,
  handleChangeDense,
}: {
  children: ReactNode
  dense: boolean
  tableHeaders: ReactNode
  handleChangeDense: (event: SyntheticEvent) => void
}) => {
  return (
    <Paper>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size={dense ? 'small' : 'medium'}>
          {tableHeaders}
          <TableBody>{children}</TableBody>
        </Table>
      </TableContainer>
      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label='Dense padding'
      />
    </Paper>
  )
}
