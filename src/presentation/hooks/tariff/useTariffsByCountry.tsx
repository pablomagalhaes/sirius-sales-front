import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import API from '../../../infrastructure/api'

import { QueryKeys } from '../../../application/enum/queryKeys'

const useTariffsByCountry = (): any => {
  const [params, setParams] = useState()
  const getTariffsByCountry = async (): Promise<any> => {
    if (params !== undefined) {
      const data = await API.getTariffsByCountry(params)
      return data
    }
  }

  const { data, refetch } = useQuery(
    [QueryKeys.tariffsByCountry, params],
    getTariffsByCountry,
    {
      enabled: params !== undefined
    }
  )
  if (data !== undefined && params !== undefined) return { content: data.content, totalElements: data.totalElements, setParams, refetch, params }
  return { content: [], totalElements: 0, setParams, refetch, params }
}

export default useTariffsByCountry
