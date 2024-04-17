import { useQuery } from '@tanstack/react-query'
import axios from 'axios';

const DEV_API_URL = import.meta.env.VITE_DEV_API_URL

type Method = 'get' | 'out' | 'patch' | 'delete' | 'post'
const defaultOptions = { method: 'GET' };
async function fetcher( url: string,  options: any = defaultOptions, method: Method) {
  // @ts-ignore
  const resp = await axios[method](`${DEV_API_URL}/${url}`, {
    headers: {
      'Content-Type': 'application/json'
    },
    ...options
  });
  return await resp.data;
}

export function useQueryWrapper<ResourceType>(
  query: string,
  url?: string,
  options?: any,
  method: Method | undefined = 'get',
) {
  const result =  useQuery<ResourceType[]>({
    queryKey: [query],
    queryFn: () => fetcher(url || query, options, method),
    ...options
  })
  return result
}