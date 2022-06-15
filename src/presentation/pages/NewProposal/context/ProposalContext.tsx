import React, { createContext, useState, useMemo } from 'react'
import { Proposal } from '../../../../domain/Proposal'

export const emptyProposalValue: Proposal = {
  idProposal: null,
  idProposalImportFreight: null,
  referenceProposal: 'Ref-000000', // referencia proposta
  idBusinessPartnerCostumer: 0, // step1 agent client
  operationType: 'FRETE - IMPORTAÇÃO', // FRETE IMPORTACAO
  idStatus: 1, // sempre passar 1
  codeUserCreation: 0, // codigo do usuario
  codeRespSeller: 0, // 0 por enquanto nao sabemos
  openingDate: '2022-04-12T13:03:46.340Z', // 2022-03-17T13:03:46.340Z//DiaDeHoje
  validityDate: '2022-05-12T13:03:46.340Z', // 2022-03-17T13:03:46.340Z//Step4Validade
  approvalDate: null, // 2022-03-17T13:03:46.340Z//null
  referenceClientProposal: 'str', // step1 cliente
  generalObservations: 'str', // Step4ObservacoesGerais
  internalObservations: 'str', // Step4ObservacoesInternas
  requester: 'str', // solicitante step1
  cargoCollectionAddress: 'str', // nao sabe
  costs: [],
  totalCosts: [],
  proposalType: 'str', // step1 tipo proposta 'cliente' 'routing order'
  idTransport: 'str', // step1 modal
  idOrigin: 'str', // id origem (if rod="NULL")
  idDestination: 'str', // id destino (if rod="NULL")
  idOriginCity: null,
  idDestinationCity: null,
  idIncoterm: 'str', // step2 incoterm id
  cargo: {
    cargo: 'str', //
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
  route: 'str', // step4 rota
  freeTime: false, // step4 freetime
  vlFreeTime: null,
  nrFreeTimeDaysDeadline: null,
  recurrency: 1, // 1
  weeklyRecurrency: 'str', // "0101100" segunda quarta e quinta
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
