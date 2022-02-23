import apisauce from 'apisauce'

const TIMEOUT = 60 * 2 * 1000

export const URL = process.env.BASE_URL_GATEWAY

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const create = () => {
  const api = apisauce.create({
    baseURL: process.env.BASE_URL_GATEWAY,
    headers: {
      'Cache-Control': 'no-cache'
    },
    timeout: TIMEOUT
  })

  api.axiosInstance.interceptors.request.use((config: any) => {
    const token = getTokenFromLocalStorage()
    config.headers.Authorization = `Bearer ${token}`

    return config
  })

  const getTokenFromLocalStorage = (): string => {
    const token = localStorage.getItem('token')
    if (token === null) {
      return ''
    }
    return token
  }

  const getCurrencies = (): any => api.get('/sirius-master-data-api/currencies/')

  const getIncoterm = (): any => api.get('/sirius-master-data-api/incoterms/')

  const getTransport = (): any => api.get('/sirius-master-data-api/transport/')

  const getOriginDestination = (): any => api.get('/sirius-master-data-api/origins/destinations/resumo')

  return {
    apisauceInstance: api,

    getTokenFromLocalStorage,
    getCurrencies,
    getIncoterm,
    getTransport,
    getOriginDestination
  }
}

const api = create()

export default api
