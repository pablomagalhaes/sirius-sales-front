import { RemoteUpdateStaggeredProposal } from '../../../data/usecase/remote-update-staggedproposal'
import { UpdateStaggeredProposal } from '../../../domain/usecase'
// import { makeAuthorizeHttpClientDecorator } from '../decorators'
import { makeAxiosHttpClient } from '../../../main/factories/http/axios-http-client-factory'
import { makeApiUrl } from '../http'

export const makeRemoteUpdateStaggeredProposal = (): UpdateStaggeredProposal =>
  new RemoteUpdateStaggeredProposal(makeApiUrl('/sirius-tariff-api/tariff/tariffProposal'), makeAxiosHttpClient())
