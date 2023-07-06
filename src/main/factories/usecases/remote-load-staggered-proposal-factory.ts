import { RemoteLoadStaggeredProposal } from '../../../data/usecase/remote-load-staggedproposal'
import { LoadStaggeredProposal } from '../../../domain/usecase'
// import { makeAuthorizeHttpClientDecorator } from '../decorators'
import { makeAxiosHttpClient } from '../../../main/factories/http/axios-http-client-factory'
import { makeApiUrl } from '../http'

export const makeRemoteLoadStaggeredProposal = (): LoadStaggeredProposal =>
  new RemoteLoadStaggeredProposal(makeApiUrl('/sirius-tariff-api/tariff/proposal'), makeAxiosHttpClient())
