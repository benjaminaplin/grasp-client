import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { getBaseUrl } from '../service/getUrl'
import { useAuth0 } from '@auth0/auth0-react'

export const defaultHeaders = {
  'Content-Type': 'application/json',
}

type Method = 'get' | 'out' | 'patch' | 'delete' | 'post'
const defaultOptions = { method: 'GET' }
async function fetcher(
  url: string,
  options: any = defaultOptions,
  method: Method,
  getToken: any,
) {
  const token = await getToken()
  console.log('token', token)
  // @ts-expect-error because TS telling us `axios` can't be accessed with string
  const resp = await axios[method](url, {
    headers: { ...defaultHeaders, authorization: `Bearer ${token}` },
    ...options,
  })
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

export function useQueryWrapper<ResourceType>(
  query: string,
  url?: string,
  options?: any,
  method: Method | undefined = 'get',
  pagination?: PaginationParams,
) {
  const { getAccessTokenSilently } = useAuth0()
  const constructedUrl = makeUrl(query, pagination, url)
  const result = useQuery<ResourceType>({
    queryKey: [query],
    queryFn: () =>
      fetcher(constructedUrl, options, method, getAccessTokenSilently),

    ...options,
  })
  return result
}
