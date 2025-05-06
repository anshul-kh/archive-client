import { useState } from 'react'
import axiosClient from '@/lib/axios-client'

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

// interface UseApiOptions {
//   url?: string
//   method?: HttpMethod
// }

interface RequestOptions {
  url?: string
  method?: HttpMethod
  data?: any
  params?: any
  headers?: any
}

export const useAxios = (defaultUrl?: string, defaultMethod: HttpMethod = 'GET') => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<any>(null)

  const request = async (
    options: RequestOptions = {},
    overrideUrl?: string
  ) => {
    const {
      url = defaultUrl,
      method = defaultMethod,
      data: bodyData,
      params,
      headers,
    } = options

    const finalUrl = overrideUrl || url
    if (!finalUrl) throw new Error('URL is required for request')

    setLoading(true)
    setError(null)

    try {
      const response = await axiosClient.request({
        method,
        url: finalUrl,
        data: bodyData,
        params,
        headers,
      })

      setData(response.data)
      return response.data
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Unexpected error'
      setError(message)
      return null
    } finally {
      setLoading(false)
    }
  }

  return { request, loading, error, data }
}


