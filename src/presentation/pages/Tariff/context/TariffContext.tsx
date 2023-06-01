import React, { createContext, useState, useMemo } from 'react'

import { SelectorsValuesTypes } from '../../../../application/enum/tariffEnum'
import { OrderTypes } from '../../../../application/enum/enum'

export const filterDefault = {
  tariffModalType: '',
  validityTariff: '',
  tariffType: '',
  orderByList: `${SelectorsValuesTypes.Validity},${OrderTypes.Ascendent}`,
  page: 0,
  size: 10
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
