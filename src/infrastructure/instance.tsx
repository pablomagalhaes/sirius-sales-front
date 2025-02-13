import axios from 'axios'

export const URL = process.env.BASE_URL_GATEWAY

const instance = axios.create({
  baseURL: URL,
  headers: {
    'Content-Type': 'application/json;'
  }
})

const getTokenFromLocalStorage = (): string => {
  const token = localStorage.getItem('token')
  if (token === null) {
    return ''
  }
  return token
}

instance.interceptors.request.use((config: any) => {
  const token = getTokenFromLocalStorage()
  config.headers.Authorization = `Bearer ${token}`

  return config
})

export default instance
