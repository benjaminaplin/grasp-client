import { Filter } from '../table-filter/TableFilter'
import { Table, flexRender } from "@tanstack/react-table"

export const getTableHeader = <ResourceType,>( table: Table<ResourceType>) => {
  return (
    <thead>
    {table.getHeaderGroups().map(headerGroup => (
      <tr key={headerGroup.id}>
        {headerGroup.headers.map(header => {
          return (
            <th key={header.id} colSpan={header.colSpan}>
              {header.isPlaceholder ? null : (
                <div>
                  <div style={{cursor: 'pointer'}} onClick={header.column.getToggleSortingHandler()} >

                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                    )}
                  </div>
                  {header.column.getCanFilter() ? (
                    <div style={{display: 'flex'}}>
                    <Filter column={header.column} table={table} />
                    {{
                      asc: " 🔼",
                      desc: " 🔽",
                    }[header.column.getIsSorted() as string] ?? null}
                    </div>
                  ) : null}
             
                </div>
              )}
            </th>
          )
        })}
      </tr>
    ))}
  </thead>
  )
}