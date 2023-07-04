import React, { createContext, useState, useMemo } from 'react'

import { SelectorsValuesTypes } from '../../../../application/enum/tariffEnum'
import { OrderTypes } from '../../../../application/enum/enum'
import { StaggeredProposalModel } from '../../../../domain/models'

export const filterDefault = {
  page: 0,
  size: 10,
  orderByList: `${SelectorsValuesTypes.Reference},${OrderTypes.Descendent}`
}

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
  filter: any
  setFilter: React.Dispatch<React.SetStateAction<any>>
}

export const StaggeredProposalContext = createContext<StaggeredProposalProps>(null as unknown as StaggeredProposalProps)

export const StaggeredProposalContextProvider = ({ children }: StaggeredProposalContextProviderProps): JSX.Element => {
  const [staggeredproposal, setStaggeredProposal] = useState<StaggeredProposalModel>(emptyStaggeredProposalValue)
  const [filter, setFilter] = useState<any>(filterDefault)
  const newStaggeredProposal = useMemo(() => ({ staggeredproposal, setStaggeredProposal, filter, setFilter }), 
    [staggeredproposal, setStaggeredProposal, filter, setFilter])

  return <StaggeredProposalContext.Provider value={newStaggeredProposal}>{children}</StaggeredProposalContext.Provider>
}
