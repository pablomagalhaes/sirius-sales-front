import { RemoteNewStaggeredProposal } from '../../../data/usecase/remote-new-staggedproposal'
import { CreateStaggeredProposal } from '../../../domain/usecase'
// import { makeAuthorizeHttpClientDecorator } from '../decorators'
import { makeAxiosHttpClient } from '../../../main/factories/http/axios-http-client-factory'
import { makeApiUrl } from '../http'

export const makeRemoteNewStaggeredProposal = (): CreateStaggeredProposal =>
  new RemoteNewStaggeredProposal(makeApiUrl('/sirius-tariff-api/tariff/proposal/'), makeAxiosHttpClient())
