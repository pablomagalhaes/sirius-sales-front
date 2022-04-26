import { CargoVolume } from './CargoVolume'
import { Cost } from './Cost'
import { TotalCost } from './TotalCost'

export interface Proposal {
  id?: Number | null
  referenceProposal: string // referencia proposta
  idBusinessPartnerCostumer: Number // cliente step1
  operationType: string // FRETE IMPORTACAO
  idStatus: Number // sempre passar 1
  codeUserCreation: Number // codigo do usuario
  codeRespSeller: Number // 0 por enquanto nao sabemos
  openingDate: string // 2022-03-17T13:03:46.340Z//DiaDeHoje
  validityDate: string // 2022-03-17T13:03:46.340Z//Step4Validade
  approvalDate: Date | null // 2022-03-17T13:03:46.340Z//null
  referenceClientProposal: string // step4 referencia
  generalObservations: string // Step4ObservacoesGerais
  internalObservations: string // Step4ObservacoesInternas
  requester: string // solicitante step1
  cargoCollectionAddress: string // endereco de coleta step2
  costs: Cost[]
  totalCosts: TotalCost[]
  proposalType: string // step1 tipo proposta 'cliente' 'routing order'
  idTransport: string // step1 modal
  idOrigin: string // id origem (if rod="NULL") step2
  idDestination: string // id destino (if rod="NULL") step2
  idBusinessPartnerAgent: 0 // step2 agent
  idIncoterm: string // step2 incoterm id
  cargo: {
    cargo: string // descricao
    idPackaging: Number
    idContainerType: string
    isDangerous: boolean // step3 perigoso
    idImoType: Number // id IMO
    idTemperature: Number // step 3 id temperatura
    idCargoContractingType: Number // id especificacoes step3 (null observar comportamento)
    codeUn: Number // step 3 codigo
    cargoVolumes: CargoVolume[] // array de items adicionados
  }
  transitTime: Number // step4 transit time
  idFrequency: Number // step 4 id frequency
  route: string // step4 rota
  freeTime: boolean // true step4
  recurrency: Number// 1
  weeklyRecurrency: string // "0101100" segunda quarta e quinta
}
