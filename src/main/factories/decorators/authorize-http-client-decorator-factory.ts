import { AuthorizeHttpClientDecorator } from '../../decorators'
import { makeLocalStorageAdapter } from '../../factories/cache'
import { makeAxiosHttpClient } from '../../factories/http'
import { HttpClient } from '../../../data/protocols/http'

export const makeAuthorizeHttpClientDecorator = (): HttpClient =>
  new AuthorizeHttpClientDecorator(makeLocalStorageAdapter(), makeAxiosHttpClient())
