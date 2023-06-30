import { LocalStorageAdapter } from '../../infra/cache'
import { ID_ORGANIZATION_TYPE } from '../../enums'
import { makeAuthorizeHttpClientDecorator } from '../../main/factories/decorators'

export class ServiceUser {
  localStorageAdapter = new LocalStorageAdapter()
  httpClient = makeAuthorizeHttpClientDecorator()
  isTransporter (): boolean {
    if (Number(this.getOrganizationType()) === ID_ORGANIZATION_TYPE.TRANSPORTER) {
      return true
    } else {
      return false
    }
  }

  getOrganizationType (): number {
    return Number(this.localStorageAdapter.get('organization_type'))
  }

  getToken (): number {
    return this.localStorageAdapter.get('token')
  }

  isAlwaysLogged (): boolean {
    const isTrue = this.localStorageAdapter.get('always_logged') === 'true'
    return isTrue
  }

  getRefreshToken (): string {
    return this.localStorageAdapter.get('refresh_token')
  }

  async setUserOnStorage (response: any): Promise<void> {
    this.localStorageAdapter.set('token', response?.access_token)
    this.localStorageAdapter.set('organization_type', response?.idOrganizationType)
    this.localStorageAdapter.set('organization', response?.idOrganization)
    this.localStorageAdapter.set('companys', response?.idCompanyList)
    this.localStorageAdapter.set('access_token_expiration_date', response?.expires_in)
    this.localStorageAdapter.set('jti', response?.jti)
    this.localStorageAdapter.set('scope', response?.scope)
    this.localStorageAdapter.set('token_type', response?.token_type)
    this.localStorageAdapter.set('refresh_token', response?.refresh_token)
    await this.setUserInfo()
  }

  async setUserInfo (): Promise<void> {
    const httpResponse = await this.httpClient.request({
      url: '/api/users/current',
      method: 'get'
    })
    this.localStorageAdapter.set('user_role', httpResponse.body?.group?.oauthAuthoritys?.map(v => v?.txAuthority))
    this.localStorageAdapter.set('user_name', httpResponse.body?.txUser)
    this.localStorageAdapter.set('always_logged', httpResponse.body?.ckAlwaysLoggedIn.toString())
    this.localStorageAdapter.set('user_current_user', httpResponse?.body)
    this.localStorageAdapter.set('dtExpiration', httpResponse.body?.dtExpiration)
  }

  async refreshAuthenticate (): Promise<void> {
    const form = new FormData()
    form.append('grant_type', 'refresh_token')
    form.append('refresh_token', this.getRefreshToken())
    const httpResponse = await this.httpClient.request({
      url: '/api/oauth/token',
      method: 'post',
      headers: {
        Authorization: 'Basic ZnRhX2NvbnRyb2w6ZnRhX2NvbnRyb2w='
      },
      body: form
    })
    this.setUserOnStorage(httpResponse)
  }
}
