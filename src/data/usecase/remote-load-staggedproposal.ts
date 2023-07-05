import { HttpClient, HttpStatusCode } from '../protocols/http'
import { StaggeredProposalModel } from '../models/staggered-proposal-model'
import { LoadStaggeredProposal } from '../../domain/usecase/load-staggered-proposal'
import { UnexpectedError } from '../../domain/errors'

export class RemoteLoadStaggeredProposal implements LoadStaggeredProposal {
  constructor (
    private readonly url: string,
    private readonly httpClient: HttpClient<RemoteLoadStaggeredProposal.Model>
  ) {}

  async loadStaggered (params: LoadStaggeredProposal.Params): Promise<LoadStaggeredProposal.Model> {
    console.log('entrou2')
    const httpResponse = await this.httpClient.request({
      url: this.url,
      method: 'get',
      body: params
    })
    const remoteLoadAdmin = httpResponse.body
    switch (httpResponse.statusCode) {
      case HttpStatusCode.ok: return remoteLoadAdmin
      // case HttpStatusCode.forbidden: throw new AccessDeniedError()
      default: throw new UnexpectedError()
    }
  }
}

export namespace RemoteLoadStaggeredProposal {
  export type Model = StaggeredProposalModel
}
