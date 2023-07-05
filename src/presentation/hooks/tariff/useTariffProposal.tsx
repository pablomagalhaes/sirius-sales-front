import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import API from '../../../infrastructure/api'

import { QueryKeys } from '../../../application/enum/queryKeys'

const useTariffProposal = (loadStaggeredProposal): any => {
  const [params, setParams] = useState()

  const getTariffProposal = async (): Promise<any> => {
    if (params !== undefined) {
      const data = await loadStaggeredProposal.loadStaggered(params)
      return data
    }
  }

  const { data, refetch } = useQuery(
    [QueryKeys.tariffProposal, params],
    getTariffProposal,
    {
      enabled: params !== undefined
    }
  )
  if (data !== undefined) return { content: data.content, totalElements: data.totalElements, setParams, refetch }
  return { content: [], totalElements: 0, setParams, refetch }
}

export default useTariffProposal
