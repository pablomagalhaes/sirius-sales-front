import React, { createContext, useState, useMemo } from 'react'

import { ImportStaggeredProposalModel } from '../../../../domain/models'

export const emptyImportStaggeredProposalValue: ImportStaggeredProposalModel = {
  idTariff: null,
  tariffType: '',
  tariffModalType: '',
  txChargeType: null,
  idBusinessPartnerAgent: null,
  nmAgent: '',
  idBusinessPartnerTransporter: null,
  dsBusinessPartnerTransporter: '',
  origin: '',
  destination: '',
  originCity: null,
  destinationCity: null,
  transitTime: null,
  validityDate: '',
  currency: '',
  route: '',
  frequency: null,
  tariffTypeValues: [],
  originDestination: [],
  closeToValidity: false
}

interface ImportStaggeredProposalContextProviderProps {
  children: React.ReactNode
}

export interface ImportStaggeredProposalProps {
  importstaggeredproposal: ImportStaggeredProposalModel
  setImportStaggeredProposal: React.Dispatch<React.SetStateAction<ImportStaggeredProposalModel>>
}

export const ImportStaggeredProposalContext = createContext<ImportStaggeredProposalProps>(null as unknown as ImportStaggeredProposalProps)

export const ImportStaggeredProposalContextProvider = ({ children }: ImportStaggeredProposalContextProviderProps): JSX.Element => {
  const [importstaggeredproposal, setImportStaggeredProposal] = useState<ImportStaggeredProposalModel>(emptyImportStaggeredProposalValue)

  const newImportStaggeredProposal = useMemo(() => ({ importstaggeredproposal, setImportStaggeredProposal }),
    [importstaggeredproposal, setImportStaggeredProposal])

  return <ImportStaggeredProposalContext.Provider value={newImportStaggeredProposal}>{children}</ImportStaggeredProposalContext.Provider>
}
