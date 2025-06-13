import axios from 'axios'

const BASE_URL =
  process.env.NODE_ENV === 'production' ? '/api/' : '//localhost:3030/api/'

const instance = axios.create({ withCredentials: true })

export const httpService = {
  get(endpoint: string, data: any) {
    return ajax(endpoint, 'GET', data)
  },
  post(endpoint: string, data: any) {
    return ajax(endpoint, 'POST', data)
  },
  put(endpoint: string, data: any) {
    return ajax(endpoint, 'PUT', data)
  },
  delete(endpoint: string, data: any) {
    return ajax(endpoint, 'DELETE', data)
  },
}

async function ajax(endpoint: string, method = 'GET', data = null) {
  const url = `${BASE_URL}${endpoint}`
  const params = method === 'GET' ? data : null

  const options = { url, method, data, params }

  try {
    const res = await instance(options)
    return res.data
  } catch (err: Error | any) {
    console.dir(err)
    if (err.response && err.response.status === 401) {
      // Handle unauthorized access, e.g., navigate to login screen
      // For now, we will just throw the error
    }
    throw err
  }
}
