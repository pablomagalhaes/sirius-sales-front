import React, { createContext, useState, useMemo } from 'react'
import { Proposal } from '../../../../domain/Proposal'

export const emptyProposalValue: Proposal = {
  idProposal: null,
  idProposalImportFreight: null,
  referenceProposal: 'Ref-000000', // referencia proposta
  customerId: 0, // step1 agent client
  operationType: 'FRETE - IMPORTAÇÃO', // FRETE IMPORTACAO
  idStatus: 1, // sempre passar 1
  codeUserCreation: 0, // codigo do usuario
  codeRespSeller: 0, // 0 por enquanto nao sabemos
  openingDate: '2022-04-12T13:03:46.340Z', // 2022-03-17T13:03:46.340Z//DiaDeHoje
  validityDate: '2022-05-12T13:03:46.340Z', // 2022-03-17T13:03:46.340Z//Step4Validade
  approvalDate: null, // 2022-03-17T13:03:46.340Z//null
  referenceClientProposal: '', // step1 cliente
  generalObservations: '', // Step4ObservacoesGerais
  internalObservations: '', // Step4ObservacoesInternas
  requester: '', // solicitante step1
  cargoCollectionAddress: '', // nao sabe
  costs: [],
  totalCosts: [],
  proposalType: '', // step1 tipo proposta 'cliente' 'routing order'
  idTransport: '', // step1 modal
  idOrigin: '', // id origem (if rod="NULL")
  idDestination: '', // id destino (if rod="NULL")
  originCityName: '',
  originCityId: '',
  destinationCityName: '',
  destinationCityId: '',
  idIncoterm: '', // step2 incoterm id
  cargo: {
    cargo: '', //
    isDangerous: true, // step3 perigoso
    idImoType: 0, // id IMO
    idTemperature: 0, // step 3 id temperatura
    idCargoContractingType: 1, // id especificacoes step3 (null observar comportamento)
    codeUn: 0, // step 3 codigo
    cargoVolumes: [],
    vlCwPurchase: null, // chargeable weight compra
    vlCwSale: null // chargeable weight venda
  },
  transitTime: 0, // step4 transit time
  idFrequency: 0, // step 4 id frequency
  route: '', // step4 rota
  freeTime: false, // step4 freetime
  vlFreeTime: null,
  nrFreeTimeDaysDeadline: null,
  recurrency: 1, // 1
  weeklyRecurrency: '', // "0101100" segunda quarta e quinta
  transportIncluded: false,
  clearenceIncluded: false,
  agents: []
}

interface ProposalContextProviderProps {
  children: React.ReactNode
}

export interface ProposalProps {
  proposal: Proposal
  setProposal: React.Dispatch<React.SetStateAction<Proposal>>
}

export const ProposalContext = createContext<ProposalProps>(null as unknown as ProposalProps)

export const ProposalContextProvider = ({ children }: ProposalContextProviderProps): JSX.Element => {
  const [proposal, setProposal] = useState<Proposal>(emptyProposalValue)
  const newProposal = useMemo(() => ({ proposal, setProposal }), [proposal, setProposal])

  return <ProposalContext.Provider value={newProposal}>{children}</ProposalContext.Provider>
}