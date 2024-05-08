import TableHead from '@mui/material/TableHead'
import { Filter } from '../table-filter/TableFilter'
import { Table, flexRender } from '@tanstack/react-table'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'

export const getTableHeader = <ResourceType,>(table: Table<ResourceType>) => {
  return (
    <TableHead>
      {table.getHeaderGroups().map((headerGroup) => (
        <TableRow key={headerGroup.id}>
          {headerGroup.headers.map((header) => {
            return (
              <TableCell key={header.id} colSpan={header.colSpan}>
                {header.isPlaceholder ? null : (
                  <div>
                    <div
                      style={{ cursor: 'pointer' }}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                    </div>
                    {header.column.getCanFilter() ? (
                      <div style={{ display: 'flex' }}>
                        <Filter column={header.column} table={table} />
                        {{
                          asc: <KeyboardArrowUpIcon />,
                          desc: <KeyboardArrowDownIcon />,
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    ) : null}
                  </div>
                )}
              </TableCell>
            )
          })}
        </TableRow>
      ))}
    </TableHead>
  )
}
