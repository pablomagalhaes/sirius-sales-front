import { notification } from 'antd'
import axios, { AxiosResponse } from 'axios'
import { HttpRequest, HttpResponse, HttpClient, HttpStatusCode } from '../../data/protocols/http'
import { LocalStorageAdapter } from '../cache'
// import { refreshAuthenticate } from '../../dataSource/request'
// import { setUserOnStorage } from '@/utils/users'

import instance from '../../infrastructure/instance'

export class AxiosHttpClient implements HttpClient {
  async request (data: HttpRequest): Promise<HttpResponse> {
    let axiosResponse: AxiosResponse
    const storage = new LocalStorageAdapter()
    try {
      axiosResponse = await instance.request({
        url: data.url,
        method: data.method,
        data: data.body,
        headers: data.headers
      })
    } catch (error) {
      axiosResponse = error.response
      const axiosStatus: number = error?.response?.status
      const axiosMessage: string = error?.response?.data?.message || 'Erro'
      notification.error({
        message: `Error: ${axiosStatus?.toString()}`,
        description: axiosMessage
      })

      if (axiosStatus === HttpStatusCode.unauthorized) {
        console.log('unauthorized')

        const alwaysLogged = JSON.parse(storage.get('always_logged'))
        if (alwaysLogged) {
          // const response = await refreshAuthenticate()
        //   setUserOnStorage(response)
          //window.location.reload()
        } else {
          //storage.clear()
          //window.location.href = '/login'
        }
      }
    }
    return {
      statusCode: axiosResponse.status,
      body: axiosResponse.data
    }
  }
}
