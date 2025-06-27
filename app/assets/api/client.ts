import { create, ApiResponse, ApisauceInstance } from 'apisauce'
import cache from '../utility/cache'
import authStorage from './user/storage'
import { AxiosRequestConfig } from 'axios'

// const MY_IP = '192.168.1.237' // home
// const MY_IP = '192.168.200.208' // work
const MY_IP = '192.168.200.122' // work
// const MY_IP = 'localhost' // or '127.0.0.1'

const BACKEND_PORT = 3030

const apiClient = create({
  // baseURL: `http://${MY_IP}:${BACKEND_PORT}/api`,
  baseURL: 'https://camjam.onrender.com/api',
})

const rawGet = apiClient.get
const rawPut = apiClient.put
const rawDelete = apiClient.delete

apiClient.get = async function <T, U = T>(
  url: string,
  params?: object,
  axiosConfig?: AxiosRequestConfig,
  isStore: boolean = true
): Promise<ApiResponse<T, U>> {
  const response = await rawGet<T, U>(url, params, axiosConfig)

  if (isStore) {
    if (response.ok) {
      cache.store(url, response.data)
      return response
    }

    const data = await cache.get(url)
    return data ? ({ ok: true, data } as ApiResponse<T, U>) : response
  }

  return response
}

apiClient.put = async function <T, U = T>(
  url: string,
  params?: object,
  axiosConfig: AxiosRequestConfig = {}
): Promise<ApiResponse<T, U>> {
  const token = await authStorage.getToken()
  if (token) {
    axiosConfig.headers = {
      ...axiosConfig.headers,
      Authorization: `Bearer ${token}`,
    }
  }

  const response = await rawPut<T, U>(url, params, axiosConfig)

  if (response.ok) {
    cache.store(url, response.data)
    return response
  }

  const data = await cache.get(url)
  return data ? ({ ok: true, data } as ApiResponse<T, U>) : response
}

apiClient.delete = async function <T, U = T>(
  url: string,
  axiosConfig: AxiosRequestConfig = {}
): Promise<ApiResponse<T, U>> {
  const token = await authStorage.getToken()
  if (token) {
    axiosConfig.headers = {
      ...axiosConfig.headers,
      Authorization: `Bearer ${token}`,
    }
  }

  const response = await rawDelete<T, U>(url, axiosConfig)
  return response
}

export default apiClient
