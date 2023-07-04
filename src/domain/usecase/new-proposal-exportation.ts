import { Proposal } from '../Proposal'

export interface NewProposalExportation {
  post?: (params: NewProposalExportation.Model) => Promise<NewProposalExportation.Model>
  setProposal: (value: any) => void
  proposal: NewProposalExportation.Model
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace NewProposalExportation {
  export type Model = Proposal
}
