import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import API from '../../../infrastructure/api'

import { QueryKeys } from '../../../application/enum/queryKeys'

const useTariffs = (): any => {
  const [tariffType, setTariffType] = useState('')
  const [tariffModalType, setTariffModalType] = useState('')
  const [validityTariff, setValidityTariff] = useState('')

  const changeFilterList = (tariff: string, modal: string, validity: string): void => {
    setTariffType(tariff)
    setTariffModalType(modal)
    setValidityTariff(validity)
  }

  const { data = [] } = useQuery(
    [QueryKeys.tariffs, tariffType, tariffModalType, validityTariff],
    async () => await API.getTariffs(tariffType, tariffModalType, validityTariff),
    {
      enabled: tariffType.length > 0
    }
  )
  return { data, changeFilterList }
}

export default useTariffs
