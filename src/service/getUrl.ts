const DEV_API_URL = import.meta.env.VITE_DEV_API_URL
const PROD_API_URL = import.meta.env.VITE_PROD_API_URL

export const getBaseUrl = () => {
  if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    return DEV_API_URL
  }
  return PROD_API_URL
}
