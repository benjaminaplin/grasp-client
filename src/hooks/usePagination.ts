import { useState } from 'react'

export interface PaginationParams {
  page: number
  limit: number
}

export type PaginationProps = {
  page: number
  limit: number
  count: number | undefined
  rowsPerPage: number
  pageIndex: number
}

export const usePagination = () => {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  })

  return { pagination, setPagination }
}
