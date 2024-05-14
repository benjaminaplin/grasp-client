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
  const resp = await axios[method](`${getBaseUrl()}/${url}`, {
    headers: { ...defaultHeaders, authorization: `Bearer ${token}` },
    ...options,
  })
  return await resp.data
}

export function useQueryWrapper<ResourceType>(
  query: string,
  url?: string,
  options?: any,
  method: Method | undefined = 'get',
) {
  const { getAccessTokenSilently } = useAuth0()
  const result = useQuery<ResourceType>({
    queryKey: [query],
    queryFn: () =>
      fetcher(url || query, options, method, getAccessTokenSilently),
    ...options,
  })
  return result
}
