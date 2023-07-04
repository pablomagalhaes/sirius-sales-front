import { Proposal } from '../Proposal'

export interface NewProposal {
  post?: (params: NewProposal.Model) => Promise<NewProposal.Model>
  setProposal: (value: any) => void
  proposal: NewProposal.Model
  getProposal: () => any
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace NewProposal {
  export type Model = Proposal
}
