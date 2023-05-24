import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import API from '../../infrastructure/api'

import { QueryKeys } from '../../application/enum/queryKeys'

const useTariffs = (): any => {
  const [tariffType, setTariffType] = useState('')
  const [tariffModalType, setTariffModalType] = useState('')
  const [validityTariff, setValidityTariff] = useState('')

  const { data = [] } = useQuery(
    [QueryKeys.tariffs, tariffType, tariffModalType, validityTariff],
    async () => await API.getTariffs(tariffType, tariffModalType, validityTariff),
    {
      enabled: tariffType.length > 0
    }
  )
  return { data, setTariffType, setTariffModalType, setValidityTariff }
}

export default useTariffs
