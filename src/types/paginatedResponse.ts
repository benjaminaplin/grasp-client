export interface PaginatedResponse<T> {
  page: number
  limit: number
  total: number
  pages: number
  data: T[]
}
