import { StaggeredProposalModel } from '../models/staggered-proposal-model'

export interface UpdateStatusStaggeredProposal {

  updateStatusStaggered: (params: UpdateStatusStaggeredProposal.Params) => Promise<UpdateStatusStaggeredProposal.Model>

}

export namespace UpdateStatusStaggeredProposal {

  export type Params = {
    id: number
    status: string
    value?: string
    detail?: string
  }

  export type Model = StaggeredProposalModel
}
