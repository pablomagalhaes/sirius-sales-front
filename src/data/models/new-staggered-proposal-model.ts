export interface StaggeredProposalModel {
  idTariffProposalStatus: number
  idBusinessPartnerCustomer: number
  tariffType: string
  dtValidity: string
  dtValidityEnd: string
  proposalTariff: ProposalTariff[]
  freightValues: FreightValues[]
}
interface ProposalTariff {
  idProposalTariff: number
  origin: string
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

export interface Modals {
  idTransportMode: number
  txTransportMode: string
}
