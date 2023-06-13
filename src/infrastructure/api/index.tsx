import instance from '../instance'
import qs from 'qs'
import { toast } from 'react-toastify'

const getContainerType = async (params?): Promise<any> => {
  const url: string = `/sirius-master-data-api/container/type/${params !== undefined ? String(params) : ''}`
  try {
    const res = await instance.get(url)
    return res.data
  } catch (error) {
    toast.error(String(error) + ' | Request:  ' + String(url))
  }
}

const getCurrencies = async (): Promise<any> => {
  const url: string = '/sirius-master-data-api/currencies/'
  try {
    const res = await instance.get(url)
    return res.data
  } catch (error) {
    toast.error(String(error) + ' | Request:  ' + String(url))
  }
}

const getIncoterms = async (): Promise<any> => {
  const url: string = '/sirius-master-data-api/incoterms/'
  try {
    const res = await instance.get(url)
    return res.data
  } catch (error) {
    toast.error(String(error) + ' | Request:  ' + String(url))
  }
}

const getPackaging = async (): Promise<any> => {
  const url: string = '/sirius-master-data-api/packaging/'
  try {
    const res = await instance.get(url)
    return res.data
  } catch (error) {
    toast.error(String(error) + ' | Request:  ' + String(url))
  }
}

const getOriginDestination = async (): Promise<any> => {
  const url: string = '/sirius-master-data-api/origins/destinations/resumo'
  try {
    const res = await instance.get(url)
    return res.data
  } catch (error) {
    toast.error(String(error) + ' | Request:  ' + String(url))
  }
}

const getOriginDestinationByModal = async (params): Promise<any> => {
  const url: string = `/sirius-master-data-api/origins/destinations/transport/${String(params)}`
  try {
    const res = await instance.get(url)
    return res.data
  } catch (error) {
    toast.error(String(error) + ' | Request:  ' + String(url))
  }
}

const getOriginDestinationById = async (params): Promise<any> => {
  const url: string = `/sirius-master-data-api/origins/destinations/${String(params)}`
  try {
    const res = await instance.get(url)
    return res.data
  } catch (error) {
    toast.error(String(error) + ' | Request:  ' + String(url))
  }
}

const getFrequency = async (): Promise<any> => {
  const url: string = '/sirius-master-data-api/frequency'
  try {
    const res = await instance.get(url)
    return res.data
  } catch (error) {
    toast.error(String(error) + ' | Request:  ' + String(url))
  }
}

const getAgents = async (): Promise<any> => {
  const url: string = '/sirius-business-partner-api/business/partner/class/classification/agente'
  try {
    const res = await instance.get(url)
    return res.data
  } catch (error) {
    toast.error(String(error) + ' | Request:  ' + String(url))
  }
}

const getBusinessPartnerByType = async (type: string): Promise<any> => {
  const url: string = `/sirius-business-partner-api/business/partner/class/classification/${type}`
  try {
    const res = await instance.get(url)
    return res.data
  } catch (error) {
    toast.error(String(error) + ' | Request:  ' + String(url))
  }
}

const getTemperature = async (params?): Promise<any> => {
  const url: string = `/sirius-master-data-api/temperature/${params !== undefined ? String(params) : ''}`
  try {
    const res = await instance.get(url)
    return res.data
  } catch (error) {
    toast.error(String(error) + ' | Request:  ' + String(url))
  }
}

const getImo = async (params?): Promise<any> => {
  const url: string = `/sirius-master-data-api/imo/type/${params !== undefined ? String(params) : ''}`
  try {
    const res = await instance.get(url)
    return res.data
  } catch (error) {
    toast.error(String(error) + ' | Request:  ' + String(url))
  }
}

const getPartner = async (): Promise<any> => {
  const url: string = '/sirius-business-partner-api/business/partner/class/classification/cliente'
  try {
    const res = await instance.get(url)
    return res.data
  } catch (error) {
    toast.error(String(error) + ' | Request:  ' + String(url))
  }
}

const getService = async (params?): Promise<any> => {
  const url: string = `/sirius-business-proposal-api/service/${params !== undefined ? String(params) : ''}`
  try {
    const res = await instance.get(url)
    return res.data
  } catch (error) {
    toast.error(String(error) + ' | Request:  ' + String(url))
  }
}

const getProposals = async (params): Promise<any> => {
  const url: string = '/sirius-business-proposal-api/proposal/filter'
  try {
    const res = await instance.get(url, {
      params,
      paramsSerializer: params => {
        return qs.stringify(params, { arrayFormat: 'comma' })
      }
    })
    return res.data
  } catch (error) {
    toast.error(String(error) + ' | Request:  ' + String(url))
  }
}

const postProposal = async (params): Promise<any> => {
  const url: string = '/sirius-business-proposal-api/proposal'
  try {
    const res = await instance.post(url, params)
    return res.data
  } catch (error) {
    toast.error(String(error) + ' | Request:  ' + String(url))
  }
}

const postTotalCalculation = async (params): Promise<any> => {
  const url: string = '/sirius-business-proposal-api/costs/calculation/total'
  try {
    const res = await instance.post(url, params)
    return res.data
  } catch (error) {
    toast.error(String(error) + ' | Request:  ' + String(url))
  }
}

const getProposal = async (params): Promise<any> => {
  const url: string = `/sirius-business-proposal-api/proposal/${String(params)}`
  try {
    const res = await instance.get(url)
    return res.data
  } catch (error) {
    toast.error(String(error) + ' | Request:  ' + String(url))
  }
}

const putProposal = async (id, params): Promise<any> => {
  const url: string = `/sirius-business-proposal-api/proposal/${String(id)}`
  try {
    const res = await instance.put(url, params)
    return res.data
  } catch (error) {
    toast.error(String(error) + ' | Request:  ' + String(url))
  }
}

const putStatus = async (id: any, status: string, reason?: string): Promise<any> => {
  const payload = reason === undefined ? `${String(status)}` : `${String(status)}?reasonStatus=${String(reason)}`
  const url: string = `/sirius-business-proposal-api/proposal/${String(id)}/status/${payload}`
  try {
    const res = await instance.put(url)
    return res.data
  } catch (error) {
    toast.error(String(error) + ' | Request:  ' + String(url))
  }
}

const getBusinessPartnerCostumer = async (params): Promise<any> => {
  const url: string = `/sirius-business-partner-api/business/partner/${String(params)}`
  try {
    const res = await instance.get(url)
    return res.data
  } catch (error) {
    toast.error(String(error) + ' | Request:  ' + String(url))
  }
}

const getCountries = async (): Promise<any> => {
  const url: string = '/sirius-master-data-api/countries/mercosul'
  try {
    const res = await instance.get(url)
    return res.data
  } catch (error) {
    toast.error(String(error) + ' | Request:  ' + String(url))
  }
}
const getMercosulCities = async (): Promise<any> => {
  const url: string = '/sirius-master-data-api/city/mercosul'
  try {
    const res = await instance.get(url)
    return res.data
  } catch (error) {
    toast.error(String(error) + ' | Request:  ' + String(url))
  }
}

const getMercosulStates = async (): Promise<any> => {
  const url: string = '/sirius-master-data-api/states/mercosul'
  try {
    const res = await instance.get(url)
    return res.data
  } catch (error) {
    toast.error(String(error) + ' | Request:  ' + String(url))
  }
}

const getStates = async (params): Promise<any> => {
  const url: string = `/sirius-master-data-api/countries/${String(params)}/states`
  try {
    const res = await instance.get(url)
    return res.data
  } catch (error) {
    toast.error(String(error) + ' | Request:  ' + String(url))
    return ('error')
  }
}

const getCities = async (params): Promise<any> => {
  const url: string = `/sirius-master-data-api/city/states/${String(params)}/cities`
  try {
    const res = await instance.get(url)
    return res.data
  } catch (error) {
    toast.error(String(error) + ' | Request:  ' + String(url))
    return ('error')
  }
}

const getCityById = async (params): Promise<any> => {
  const url: string = `/sirius-master-data-api/city/${String(params)}`
  try {
    const res = await instance.get(url)
    return res.data
  } catch (error) {
    toast.error(String(error) + ' | Request:  ' + String(url))
    return ('error')
  }
}

const getCountProposal = async (params): Promise<any> => {
  const url: string = '/sirius-business-proposal-api/proposal/count'
  try {
    const res = await instance.get(url, {
      params,
      paramsSerializer: params => {
        return qs.stringify(params, { arrayFormat: 'comma' })
      }
    })
    return res.data
  } catch (error) {
    toast.error(String(error) + ' | Request:  ' + String(url))
  }
}

const getTariffs = async (params): Promise<any> => {
  const url: string = '/sirius-tariff-api/tariff/region/country/'
  try {
    const res = await instance.get(url, {
      params,
      paramsSerializer: params => {
        return qs.stringify(params, { arrayFormat: 'comma' })
      }
    })
    return res.data
  } catch (error) {
    toast.error(String(error) + ' | Request:  ' + String(url))
  }
}

const downloadProposal = async (language: string, idProposal: string): Promise<any> => {
  const url: string = `/sirius-business-proposal-api/proposal/report/${idProposal}/PDF/${language}`
  try {
    const res = await instance.get(url)
    return res.data
  } catch (error) {
    toast.error(String(error) + ' | Request:  ' + String(url))
  }
}

const getTariffsByCountry = async (params): Promise<any> => {
  const url: string = '/sirius-tariff-api/tariff/filter'
  try {
    const res = await instance.get(url, {
      params,
      paramsSerializer: params => {
        return qs.stringify(params, { arrayFormat: 'comma' })
      }
    })
    return res.data
  } catch (error) {
    toast.error(String(error) + ' | Request:  ' + String(url))
  }
}

const editTariff = async (idTariff: string, params): Promise<any> => {
  const url: string = `/sirius-tariff-api/tariff/${idTariff}`
  try {
    const res = await instance.put(url, params)
    return res.data
  } catch (error) {
    toast.error(String(error) + ' | Request:  ' + String(url))
  }
}

const uploadTariff = async (type: string, modal: string, setProgress: Function, params: any, agent?: number): Promise<any> => {
  const url: string = agent !== undefined && agent !== null
    ? `/sirius-tariff-api/tariff/${type}/${modal}?idAgent=${agent}`
    : `/sirius-tariff-api/tariff/${type}/${modal}`

  try {
    const res = await instance.post(url, params, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: data => {
        setProgress(Math.round((100 * data.loaded) / data.total))
      }
    })
    return res.data
  } catch (error) {
    toast.error(String(error) + ' | Request:  ' + String(url))
    return 'error'
  }
}

const API = {
  getContainerType,
  getCurrencies,
  getIncoterms,
  getPackaging,
  getOriginDestination,
  getPartner,
  getFrequency,
  getAgents,
  getTemperature,
  getImo,
  getService,
  getProposals,
  postProposal,
  postTotalCalculation,
  getProposal,
  getBusinessPartnerCostumer,
  getBusinessPartnerByType,
  getOriginDestinationById,
  getOriginDestinationByModal,
  putProposal,
  putStatus,
  getCountries,
  getStates,
  getCities,
  getCityById,
  getCountProposal,
  getMercosulCities,
  getMercosulStates,
  getTariffs,
  getTariffsByCountry,
  downloadProposal,
  editTariff,
  uploadTariff
}

export default API
