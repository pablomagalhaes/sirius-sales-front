import { HttpClient, HttpRequest, HttpResponse, HttpStatusCode } from '@/data/protocols/http'
import { notification } from 'antd'
import { LocalStorageAdapter } from '@/infra/cache'
import { ServiceUser } from '@/data/usecase/service-user'

export class AuthorizeHttpClientDecorator implements HttpClient {
  constructor (
    private readonly storage: LocalStorageAdapter,
    private readonly httpClient: HttpClient
  ) {}

  async request (data: HttpRequest): Promise<HttpResponse> {
    const token: string = this.storage.get('token')
    if (token) {
      Object.assign(data, {
        headers: Object.assign({
          Authorization: `Bearer ${token}`
        }, data.headers || {})
      })
    }
    const httpResponse = await this.httpClient.request(data)
    switch (httpResponse.statusCode) {
      case HttpStatusCode.ok:
        if (data.method !== 'get') {
          notification.success({
            message: 'Sucesso!',
            description: httpResponse?.body?.message
          })
        }
        break
      case HttpStatusCode.alert:
        notification.warning({
          message: 'Alerta!',
          description: httpResponse?.body?.message
        })
        break
      default:
        notification.error({
          message: 'Erro!',
          description: httpResponse?.body?.message
        })
        break
    }

    if (httpResponse.statusCode === HttpStatusCode.unauthorized) {
      const user = new ServiceUser()
      if (user.isAlwaysLogged()) {
        await user.refreshAuthenticate()
        window.location.reload()
      } else {
        this.storage.clear()
        window.location.href = '/login'
      }
    }
    return httpResponse
  }
}
