import { HttpClient, HttpStatusCode } from '../protocols/http'
import { StaggeredProposalModel } from '../models/staggered-proposal-model'
import { UpdateStatusStaggeredProposal } from '../../domain/usecase/update-status-staggered-proposal'
import { UnexpectedError } from '../../domain/errors'

export class RemoteUpdateStatusStaggeredProposal implements UpdateStatusStaggeredProposal {
  constructor (
    private readonly url?: string,
    private readonly httpClient?: HttpClient<RemoteUpdateStatusStaggeredProposal.Model>
  ) {}

  async updateStatusStaggered (params: UpdateStatusStaggeredProposal.Params): Promise<UpdateStatusStaggeredProposal.Model> {
    const { id, status, value, detail } = params
    const httpResponse = await this.httpClient.request({
      url: `${this.url}/${id}/${status}`,
      method: 'put',
      body: {
        reasonStatus: value,
        dsRejectReason: detail
      }
    })
    const remoteUpdateAdmin = httpResponse.body
    switch (httpResponse.statusCode) {
      case HttpStatusCode.ok: return remoteUpdateAdmin
      default: throw new UnexpectedError()
    }
  }
}

export namespace RemoteUpdateStatusStaggeredProposal {
  export type Model = StaggeredProposalModel
}
