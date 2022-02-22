/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import axios from 'axios'

export const URL = `${String(process.env.REACT_APP_API_URL)}/api`

const instance = axios.create({
  baseURL: URL
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
