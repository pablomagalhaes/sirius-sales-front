import { makeApiUrl } from '@/main/factories/http'
import { makeAuthorizeHttpClientDecorator } from '@/main/factories/decorators'
import { UpdateStaggeredProposal } from '@/domain/usecase'
import { RemoteUpdateStaggeredProposal } from '@/data/usecase/remote-update-staggedproposal'

export const makeRemoteUpdateStaggeredProposal = (): UpdateStaggeredProposal =>
  new RemoteUpdateStaggeredProposal(makeApiUrl('/sirius-tariff-api/tariff/tariffProposal'), makeAuthorizeHttpClientDecorator())
