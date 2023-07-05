import { HttpClient, HttpStatusCode } from '../protocols/http'
import { StaggeredProposalModel } from '../models/staggered-proposal-model'
import { LoadStaggeredProposal } from '../../domain/usecase/load-staggered-proposal'
import { UnexpectedError } from '../../domain/errors'
import qs from 'qs'

export class RemoteLoadStaggeredProposal implements LoadStaggeredProposal {
  constructor (
    private readonly url?: string,
    private readonly httpClient?: HttpClient<RemoteLoadStaggeredProposal.Model>
  ) {}

  async loadStaggered (params: LoadStaggeredProposal.Params): Promise<LoadStaggeredProposal.Model> {
    const urlParams = qs.stringify(params, { arrayFormat: 'comma' })

    const httpResponse = await this.httpClient.request({
      url: `${this.url}?${urlParams}`,
      method: 'get'
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
