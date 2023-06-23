import { StaggeredProposalModel } from '../models'

export interface UpdateStaggeredProposal {
  update: (params: UpdateStaggeredProposal.Params) => Promise<UpdateStaggeredProposal.Model>
}

export namespace UpdateStaggeredProposal {
  export type Params = {
    idBusinessPartnerCustomer: number
  }

  export type Model = StaggeredProposalModel
}
