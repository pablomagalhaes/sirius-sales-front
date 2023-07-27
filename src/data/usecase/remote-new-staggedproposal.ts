import { HttpClient, HttpStatusCode } from '../protocols/http'
import { StaggeredProposalModel } from '../models/staggered-proposal-model'
import { NNewStaggeredProposal } from '../../domain/usecase/new-staggered-proposal'
import { AccessDeniedError, UnexpectedError } from '../../domain/errors'

export class RemoteNewStaggeredProposal implements NNewStaggeredProposal {
  constructor (
    private readonly url: string,
    private readonly httpClient: HttpClient<RemoteNewStaggeredProposal.Model>
  ) {}

  async newStaggered (params: NNewStaggeredProposal.Params): Promise<NNewStaggeredProposal.Model> {
    const httpResponse = await this.httpClient.request({
      url: this.url,
      method: 'post',
      body: params
    })
    const remotNewStaggeredProposal = httpResponse.body
    switch (httpResponse.statusCode) {
      case HttpStatusCode.created: return remotNewStaggeredProposal
      // case HttpStatusCode.forbidden: throw new AccessDeniedError()
      default: throw new UnexpectedError()
    }
  }
}

export namespace RemoteNewStaggeredProposal {
  export type Model = StaggeredProposalModel
}
