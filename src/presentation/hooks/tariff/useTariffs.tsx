import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import API from '../../../infrastructure/api'

import { QueryKeys } from '../../../application/enum/queryKeys'

const useTariffs = (): any => {
  const [tariffType, setTariffType] = useState('')
  const [params, setParams] = useState()

  const changeFilterList = (filter): void => {
    setTariffType(filter?.tariffType)
    setParams(filter)
  }

  const { data = [], refetch } = useQuery(
    [QueryKeys.tariffs, params],
    async () => await API.getTariffs(params),
    {
      enabled: tariffType.length > 0
    }
  )
  return { data, changeFilterList, refetch }
}

export default useTariffs
