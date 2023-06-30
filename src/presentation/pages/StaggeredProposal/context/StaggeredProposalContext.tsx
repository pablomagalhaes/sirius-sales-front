import React, { createContext, useState, useMemo } from 'react'
import { StaggeredProposalModel } from '../../../../domain/models'

export const emptyStaggeredProposalValue: StaggeredProposalModel = {
  idTariffProposalStatus: 1,
  idBusinessPartnerCustomer: 1,
  tariffType: 'IMPORT',
  dtValidity: '2023-03-12T00:00-03:00',
  dtValidityEnd: '2023-03-15T00:00-03:00',
  proposalTariff: [
    {
      origin: 'ARBUE',
      destination: 'SSZ',
      idAgent: 1,
      idBusinessPartnerTransporter: 2,
      currency: 'ARS',
      frequency: 1,
      vlFrequency: 3,
      freightValues: [
        {
          vlMinimum: '90',
          until45kg: '4.56',
          until100kg: '4.57',
          until300kg: '4.58',
          until500kg: '50.01',
          until1000kg: '1000.52',
          buyOrSell: 'BUY'
        },
        {
          vlMinimum: '90',
          until45kg: '4.56',
          until100kg: '4.57',
          until300kg: '4.58',
          until500kg: '50.01',
          until1000kg: '1000.52',
          buyOrSell: 'SELL'
        }
      ]
    }
  ]
}

interface StaggeredProposalContextProviderProps {
  children: React.ReactNode
}

export interface StaggeredProposalProps {
  staggeredproposal: StaggeredProposalModel
  setStaggeredProposal: React.Dispatch<React.SetStateAction<StaggeredProposalModel>>
}

export const StaggeredProposalContext = createContext<StaggeredProposalProps>(null as unknown as StaggeredProposalProps)

export const StaggeredProposalContextProvider = ({ children }: StaggeredProposalContextProviderProps): JSX.Element => {
  const [staggeredproposal, setStaggeredProposal] = useState<StaggeredProposalModel>(emptyStaggeredProposalValue)
  const newStaggeredProposal = useMemo(() => ({ staggeredproposal, setStaggeredProposal }), [staggeredproposal, setStaggeredProposal])

  return <StaggeredProposalContext.Provider value={newStaggeredProposal}>{children}</StaggeredProposalContext.Provider>
}
