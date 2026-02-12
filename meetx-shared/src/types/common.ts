export type ApiError = {
  code: string
  message: string
  details?: Record<string, unknown>
}

export type ApiResponse<T> = {
  ok: boolean
  data?: T
  error?: ApiError
}

export type Paginated<T> = {
  items: T[]
  total: number
  page: number
  pageSize: number
}
