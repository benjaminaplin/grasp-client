import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { getBaseUrl } from '../service/getUrl'
import { useAuth0 } from '@auth0/auth0-react'

export const defaultHeaders = {
  'Content-Type': 'application/json',
}

type Method = 'get' | 'out' | 'patch' | 'delete' | 'post'
const defaultOptions = { method: 'GET' }
export async function fetcher(
  url: string,
  payload: any,
  options: any = defaultOptions,
  method: Method,
  getToken: any,
) {
  const token = await getToken()
  const headers = { ...defaultHeaders, authorization: `Bearer ${token}` }

  // @ts-expect-error because TS telling us `axios` can't be accessed with string
  const resp = await axios[method](url, payload, {
    headers,
    ...options,
  })

  return await resp.data
}

type FetcherOptions = Omit<any, 'onSuccess' | 'onError' | 'staleTime'>

export function useMutationWrapper<ResourceType>(
  url?: string,
  method: Method | undefined = 'get',
  payload?: any,
  queryOptions?: any,
  fetcherOptions?: FetcherOptions,
) {
  let fetchUrl = `${getBaseUrl()}/${url}`

  const { getAccessTokenSilently } = useAuth0()

  return useMutation<ResourceType>({
    mutationFn: () =>
      fetcher(
        fetchUrl,
        JSON.stringify(payload),
        fetcherOptions,
        method,
        getAccessTokenSilently,
      ),
    ...queryOptions,
  })
}
