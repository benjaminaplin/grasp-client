import { useState } from 'react'

export interface PaginationParams {
  page: number
  limit: number
}

export function usePagination(
  initial: PaginationParams = { page: 1, limit: 10 },
) {
  const [pagination, setPagination] = useState<PaginationParams>(initial)

  const handlePageChange = (_: unknown, newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage + 1 })) // MUI uses 0-based
  }

  const handleLimitChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newLimit = parseInt(event.target.value, 10)
    setPagination({ page: 1, limit: newLimit })
  }

  return {
    pagination,
    pageIndex: pagination.page - 1, // MUI's zero-based page index
    handlePageChange,
    handleLimitChange,
    setPagination,
  }
}
