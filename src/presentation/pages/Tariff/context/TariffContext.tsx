import React, { createContext, useState, useMemo } from 'react'

import { SelectorsValuesTypes } from '../../../../application/enum/tariffEnum'
import { OrderTypes , PaginationTypes } from '../../../../application/enum/enum'

export const filterDefault = {
  tariffModalType: '',
  validityTariff: '',
  tariffType: '',
  sort: `${SelectorsValuesTypes.Validity},${OrderTypes.Ascendent}`,
  page: PaginationTypes.Page,
  size: PaginationTypes.Size
}

interface TariffContextProviderProps {
  children: React.ReactNode
}

export interface FilterProps {
  filter: any
  setFilter: React.Dispatch<React.SetStateAction<any>>
}

export const TariffContext = createContext<FilterProps>(null as unknown as FilterProps)

export const TariffContextProvider = ({ children }: TariffContextProviderProps): JSX.Element => {
  const [filter, setFilter] = useState<any>(filterDefault)
  const newFilter = useMemo(() => ({ filter, setFilter }), [filter, setFilter])

  return <TariffContext.Provider value={newFilter}>{children}</TariffContext.Provider>
}
