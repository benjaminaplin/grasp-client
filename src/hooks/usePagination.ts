import { useCallback, useMemo, useState } from 'react'

export interface PaginationParams {
  page: number
  limit: number
}

export function usePagination(
  initial: PaginationParams = { page: 0, limit: 10 },
) {
  const [pagination, setPagination] = useState<PaginationParams>(initial)
  const handlePageChange = useCallback((_: unknown, newPage: number) => {
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

  const pageIndex = useMemo(() => pagination.page - 1, [pagination.page])

  return {
    pagination,
    pageIndex,
    handlePageChange,
    handleLimitChange,
    setPagination,
  }
}
