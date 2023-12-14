import { Agent } from '../Agent'
import { CargoVolume } from '../CargoVolume'
import { Cost } from '../Cost'
import { TotalCost } from '../TotalCost'
import { ProfitsProps } from '../ProfitsProps'
import { FreeTimeDemurrage } from '../FreeTimeDemurrage'

export interface Proposal {
  idProposal?: number | null
  idProposalImportFreight?: number | null
  referenceProposal: string // referencia proposta
  idBusinessPartnerCustomer: number // cliente step1
  operationType: string // IMPORT FREIGHT
  idProposalStatus: number // sempre passar 1
  codeUserCreation: number // codigo do usuario
  openingDate?: string // 2022-03-17T13:03:46.340Z//DiaDeHoje
  validityDate: string // 2022-03-17T13:03:46.340Z//Step4Validade
  referenceClientProposal: string // step4 referencia
  generalObservations: string // Step4ObservacoesGerais
  internalObservations: string // Step4ObservacoesInternas
  requester: string // solicitante step1
  cargoCollectionAddress: string // endereco de coleta step2
  cargoDeliveryAddress: string // endereco de entrega step2
  costs: Cost[]
  totalCosts: TotalCost[]
  proposalType: string // step1 tipo proposta 'cliente' 'routing order'
  idTransport: string // step1 modal
  originDestiny: any
  idOrigin: string // id origem (if rod="NULL") step2
  idDestination: string // id destino (if rod="NULL") step2
  originCityName: string
  originCityId: string
  destinationCityName: string
  destinationCityId: string
  idIncoterm: string // step2 incoterm id
  cargo: Array<{
    id?: number | null
    txCargo: string // descricao
    isDangerous: boolean // step3 perigoso
    idImoType: number // id IMO
    idTemperature: number // step 3 id temperatura
    idCargoContractingType: number | null // id especificacoes step3 (null observar comportamento)
    codeUnDangerous: number // step 3 codigo
    cargoVolumes?: CargoVolume[] // array de items adicionados
    vlCwPurchase: number | null // chargeable weight compra
    vlCwSale: number | null // chargeable weight venda
  }>
  transitTime: number // step4 transit time
  idFrequency: number // step 4 id frequency
  route: string // step4 rota
  freeTimeDemurrages: FreeTimeDemurrage[]
  recurrency: number// 1
  weeklyRecurrency: string // "0101100" segunda quarta e quinta
  transportIncluded: boolean
  clearenceIncluded: boolean
  agents: Agent[]
  profits: ProfitsProps[]
}
