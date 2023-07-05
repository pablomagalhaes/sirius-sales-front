import { StaggeredProposalModel } from '../models/staggered-proposal-model'

export interface LoadStaggeredProposal {
 
  loadStaggered: (params: LoadStaggeredProposal.Params) => Promise<LoadStaggeredProposal.Model>

}

export namespace LoadStaggeredProposal {

  export type Params = {
    page: number
    size: number
    orderByList: string
  }

  export type Model = StaggeredProposalModel
}
