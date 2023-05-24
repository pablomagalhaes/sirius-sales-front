import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import API from '../../infrastructure/api'

import { QueryKeys } from '../../application/enum/queryKeys'

const useTariffsByCountry = (): any => {
  const [params, setParams] = useState()

  const getTariffsByCountry = async (): Promise<any> => {
    const data = await API.getTariffsByCountry(params)
    return data
  }

  const { data } = useQuery(
    [QueryKeys.tariffsByCountry, params],
    getTariffsByCountry,
    {
      enabled: params !== undefined,
      staleTime: 0
    }
  )
  if (data !== undefined) return { content: data.content, totalElements: data.totalElements, setParams }
  return { content: [], totalElements: 0, setParams }
}

export default useTariffsByCountry
