export interface StaggeredProposalModel {
  // map(arg0: (item: any, index: any) => JSX.Element): unknown
  idTariffProposalStatus: number
  idBusinessPartnerCustomer: number
  tariffType: string
  dtValidity: string
  dtValidityEnd: string
  proposalTariff: ProposalTariff[]
  referenceTariffProposal?: string
  idTariffCustomer?: string
}
interface ProposalTariff {
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
