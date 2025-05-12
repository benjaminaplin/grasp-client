import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { getBaseUrl } from '../service/getUrl'
import { useAuth0 } from '@auth0/auth0-react'
import { useMemo } from 'react'

export const defaultHeaders = {
  'Content-Type': 'application/json',
}

type Method = 'get' | 'out' | 'patch' | 'delete' | 'post'
const defaultOptions = { method: 'GET' }
export async function fetcher(
  url: string,
  options: any = defaultOptions,
  method: Method,
  getToken: any,
) {
  console.log('🚀 ~ method:', method)
  console.log('🚀 ~ options:', options)
  console.log('🚀 ~ url:', url)
  const token = await getToken()
  // console.log("🚀 ~ token:", token)
  const headers = { ...defaultHeaders, authorization: `Bearer ${token}` }
  console.log('🚀 ~ headers:', headers)
  // @ts-expect-error because TS telling us `axios` can't be accessed with string
  const resp = await axios[method](url, {
    headers,
    ...options,
  })
  console.log('🚀 ~ resp:', resp)

  return await resp.data
}

type PaginationParams = { page: number; limit: number }

const makeUrl = (
  query: string,
  pagination: PaginationParams | undefined,
  originalUrl?: string,
) => {
  const url = originalUrl || query
  const finalUrl = new URL(url, `${getBaseUrl()}/api`)
  if (pagination) {
    finalUrl.searchParams.set('page', pagination.page.toString())
    finalUrl.searchParams.set('limit', pagination.limit.toString())
  }

  return finalUrl.toString()
}

type FetcherOptions = Omit<any, 'onSuccess' | 'onError' | 'staleTime'>

export function useQueryWrapper<ResourceType>(
  query: string,
  url?: string,
  queryOptions?: any,
  method: Method | undefined = 'get',
  pagination?: PaginationParams,
  fetcherOptions?: FetcherOptions,
) {
  const queryKey = useMemo(
    () => [query, pagination?.page, pagination?.limit],
    [query, pagination?.page, pagination?.limit],
  )
  const { getAccessTokenSilently } = useAuth0()

  return useQuery<ResourceType>({
    queryKey,
    queryFn: () => {
      const constructedUrl = makeUrl(query, pagination, url)
      return fetcher(
        constructedUrl,
        fetcherOptions,
        method,
        getAccessTokenSilently,
      )
    },
    ...queryOptions,
  })
}
