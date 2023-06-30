import { HttpClient, HttpStatusCode } from '../protocols/http'
import { StaggeredProposalModel } from '../models/staggered-proposal-model'
import { UpdateStaggeredProposal } from '../../domain/usecase/update-staggered-proposal'
import { AccessDeniedError, UnexpectedError } from '../../domain/errors'

export class RemoteUpdateStaggeredProposal implements UpdateStaggeredProposal {
  constructor (
    private readonly url: string,
    private readonly httpClient: HttpClient<RemoteUpdateStaggeredProposal.Model>
  ) {}

  async updateStaggered (params: UpdateStaggeredProposal.Params): Promise<UpdateStaggeredProposal.Model> {
    const httpResponse = await this.httpClient.request({
      url: this.url,
      method: 'post',
      body: params
    })
    const remoteUpdateAdmin = httpResponse.body
    switch (httpResponse.statusCode) {
      case HttpStatusCode.ok: return remoteUpdateAdmin
      // case HttpStatusCode.forbidden: throw new AccessDeniedError()
      default: throw new UnexpectedError()
    }
  }
}

export namespace RemoteUpdateStaggeredProposal {
  export type Model = StaggeredProposalModel
}
