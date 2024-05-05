import { ColumnDef } from '@tanstack/react-table'
import { useMemo } from 'react'
import { Skeleton } from '@mui/material'

export const useLoadingColumns = <Resource,>(
  columns: ColumnDef<Resource>[],
  resourceIsLoading: boolean,
) => {
  const memoColumns = useMemo(
    () =>
      resourceIsLoading
        ? columns.map((column) => ({
            ...column,
            cell: () => <Skeleton height='32' />,
          }))
        : columns,
    [resourceIsLoading],
  )
  return memoColumns
}
