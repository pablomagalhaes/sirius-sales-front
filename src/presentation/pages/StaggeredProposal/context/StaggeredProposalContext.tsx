import React, { createContext, useState, useMemo } from 'react'

import { SelectorsValuesTypes } from '../../../../application/enum/tariffEnum'
import { OrderTypes } from '../../../../application/enum/enum'

export const filterDefault = {
  direction: 'ASC',
  orderByList: SelectorsValuesTypes.Validity,
  page: 0,
  size: 10
}

interface StaggeredProposalProviderProps {
  children: React.ReactNode
}

export interface FilterProps {
  filter: any
  setFilter: React.Dispatch<React.SetStateAction<any>>
}

export const StaggeredProposalContext = createContext<FilterProps>(null as unknown as FilterProps)

export const StaggeredProposalProvider = ({ children }: StaggeredProposalProviderProps): JSX.Element => {
  const [filter, setFilter] = useState<any>(filterDefault)
  const newFilter = useMemo(() => ({ filter, setFilter }), [filter, setFilter])

  return <StaggeredProposalContext.Provider value={newFilter}>{children}</StaggeredProposalContext.Provider>
}
