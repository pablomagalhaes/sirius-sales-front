export interface ImportStaggeredProposalModel {
  idTariff: number
  tariffType: string
  tariffModalType: string
  txChargeType: null
  idBusinessPartnerAgent: number
  nmAgent: string
  idBusinessPartnerTransporter: number
  dsBusinessPartnerTransporter: string
  origin: string
  destination: string
  originCity: null
  destinationCity: null
  transitTime: number
  validityDate: string
  currency: string
  route: string
  frequency: null
  tariffTypeValues: tariffTypeValues[]
  originDestination: originDestination[]
  closeToValidity: boolean
}

interface tariffTypeValues {
  idTariffTypeValues: number
  value: number
  tariffType: tariffType
  buyOrSell: string
}

interface tariffType {
  idTariffType: number
  description: string

}

interface originDestination {
  idOriginDestination: string
  name: string
  region: string
}
