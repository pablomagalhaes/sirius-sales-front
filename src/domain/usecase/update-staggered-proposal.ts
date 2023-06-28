import { StaggeredProposalModel } from '../models/staggered-proposal-model'

export interface UpdateStaggeredProposal {
  update: (params: UpdateStaggeredProposal.Params) => Promise<UpdateStaggeredProposal.Model>
}

export namespace UpdateStaggeredProposal {

  export type Params = {
    idBusinessPartnerCustomer: number
    tariffType: string
    dtValidity: string
    dtValidityEnd: string
    proposalTariff: ProposalTariff[]
  }

  interface ProposalTariff {
    origin?: string
    destination: string
    idAgent: number
    idBusinessPartnerTransporter: number
    currency: string
    frequency: number
    vlFrequency: number
    freightValues: FreightValues[]
  }

  interface FreightValues {
    vlMinimum: string
    until45kg: string
    until100kg: string
    until300kg: string
    until500kg: string
    until1000kg: string
    buyOrSell: string
  }
  export type Model = StaggeredProposalModel
}
