import { HttpClient, HttpStatusCode } from '../protocols/http'
import { StaggeredProposalModel } from '../models/staggered-proposal-model'
import { CreateStaggeredProposal } from '../../domain/usecase/new-staggered-proposal'
import { AccessDeniedError, UnexpectedError } from '../../domain/errors'

export class RemoteNewStaggeredProposal implements CreateStaggeredProposal {
  constructor (
    private readonly url: string,
    private readonly httpClient: HttpClient<RemoteNewStaggeredProposal.Model>
  ) {}

  async newStaggered (params: CreateStaggeredProposal.Params): Promise<CreateStaggeredProposal.Model> {
    const httpResponse = await this.httpClient.request({
      url: this.url,
      method: 'post',
      body: params
    })
    const remotCreateStaggeredProposal = httpResponse.body
    switch (httpResponse.statusCode) {
      case HttpStatusCode.created: return remotCreateStaggeredProposal
      // case HttpStatusCode.forbidden: throw new AccessDeniedError()
      default: throw new UnexpectedError()
    }
  }
}

export namespace RemoteNewStaggeredProposal {
  export type Model = StaggeredProposalModel
}
