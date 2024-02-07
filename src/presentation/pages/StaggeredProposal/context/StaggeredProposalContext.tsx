import React, { createContext, useState, useMemo } from 'react'

import { SelectorsValuesTypes } from '../../../../application/enum/staggeredProposalEnum'
import { OrderTypes , PaginationTypes } from '../../../../application/enum/enum'
import { StaggeredProposalModel } from '../../../../domain/models'

export const filterDefault = {
  page: PaginationTypes.Page,
  size: PaginationTypes.Size,
  sort: `${SelectorsValuesTypes.DateCreated},${OrderTypes.Descendent}`
}

export const emptyStaggeredProposalValue: StaggeredProposalModel = {
  idTariffProposalStatus: null,
  idBusinessPartnerCustomer: null,
  tariffType: '',
  dtValidity: '',
  dtValidityEnd: '',
  proposalTariff: []
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
