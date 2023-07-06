import { RemoteUpdateStatusStaggeredProposal } from '../../../data/usecase/remote-update-status-staggedproposal'
import { UpdateStatusStaggeredProposal } from '../../../domain/usecase'
import { makeAxiosHttpClient } from '../../../main/factories/http/axios-http-client-factory'
import { makeApiUrl } from '../http'

export const makeRemoteUpdateStatusStaggeredProposal = (): UpdateStatusStaggeredProposal =>
  new RemoteUpdateStatusStaggeredProposal(makeApiUrl('/sirius-tariff-api/tariff/proposal'), makeAxiosHttpClient())
