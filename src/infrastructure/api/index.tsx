import instance from '../instance'
import qs from 'qs'

const getContainerType = async (params?): Promise<any> => {
  try {
    const res = await instance.get(`/sirius-master-data-api/container/type/${params !== undefined ? String(params) : ''}`)
    return res.data
  } catch (error) {
    console.error(error)
  }
}

const getCurrencies = async (): Promise<any> => {
  try {
    const res = await instance.get('/sirius-master-data-api/currencies/')
    return res.data
  } catch (error) {
    console.error(error)
  }
}

const getIncoterms = async (): Promise<any> => {
  try {
    const res = await instance.get('/sirius-master-data-api/incoterms/')
    return res.data
  } catch (error) {
    console.error(error)
  }
}

const getPackaging = async (): Promise<any> => {
  try {
    const res = await instance.get('/sirius-master-data-api/packaging/')
    return res.data
  } catch (error) {
    console.error(error)
  }
}

const getOriginDestination = async (): Promise<any> => {
  try {
    const res = await instance.get('/sirius-master-data-api/origins/destinations/resumo')
    return res.data
  } catch (error) {
    console.error(error)
  }
}

const getOriginDestinationByModal = async (params): Promise<any> => {
  try {
    const res = await instance.get(`/sirius-master-data-api/origins/destinations/transport/${String(params)}`)
    return res.data
  } catch (error) {
    console.error(error)
  }
}

const getOriginDestinationById = async (params): Promise<any> => {
  try {
    const res = await instance.get(`/sirius-master-data-api/origins/destinations/${String(params)}`)
    return res.data
  } catch (error) {
    console.error(error)
  }
}

const getFrequency = async (): Promise<any> => {
  try {
    const res = await instance.get('/sirius-master-data-api/frequency')
    return res.data
  } catch (error) {
    console.error(error)
  }
}

const getAgents = async (): Promise<any> => {
  try {
    const res = await instance.get('/sirius-business-partner-api/business/partner/class/classification/agente')
    return res.data
  } catch (error) {
    console.error(error)
  }
}

const getBusinessPartnerByType = async (type: string): Promise<any> => {
  try {
    const res = await instance.get(`/sirius-business-partner-api/business/partner/class/classification/${type}`)
    return res.data
  } catch (error) {
    console.error(error)
  }
}

const getTemperature = async (params?): Promise<any> => {
  try {
    const res = await instance.get(`/sirius-master-data-api/temperature/${params !== undefined ? String(params) : ''}`)
    return res.data
  } catch (error) {
    console.error(error)
  }
}

const getImo = async (params?): Promise<any> => {
  try {
    const res = await instance.get(`/sirius-master-data-api/imo/type/${params !== undefined ? String(params) : ''}`)
    return res.data
  } catch (error) {
    console.error(error)
  }
}

const getPartner = async (): Promise<any> => {
  try {
    const res = await instance.get('/sirius-business-partner-api/business/partner/class/classification/cliente')
    return res.data
  } catch (error) {
    console.error(error)
  }
}

const getService = async (params?): Promise<any> => {
  try {
    const res = await instance.get(`/sirius-business-proposal-api/service/${params !== undefined ? String(params) : ''}`)
    return res.data
  } catch (error) {
    console.error(error)
  }
}

const getProposals = async (params): Promise<any> => {
  try {
    const res = await instance.get('/sirius-business-proposal-api/proposal/filter', {
      params,
      paramsSerializer: params => {
        return qs.stringify(params, { arrayFormat: 'comma' })
      }
    })
    return res.data
  } catch (error) {
    console.error(error)
  }
}

const postProposal = async (params): Promise<any> => {
  try {
    const res = await instance.post('/sirius-business-proposal-api/proposal', params)
    return res.data
  } catch (error) {
    console.error(error)
  }
}

const postTotalCalculation = async (params): Promise<any> => {
  try {
    const res = await instance.post('/sirius-business-proposal-api/costs/calculation/total', params)
    return res.data
  } catch (error) {
    console.error(error)
  }
}

const getProposal = async (params): Promise<any> => {
  try {
    const res = await instance.get(`/sirius-business-proposal-api/proposal/${String(params)}`)
    return res.data
  } catch (error) {
    console.error(error)
  }
}

const putProposal = async (id, params): Promise<any> => {
  try {
    const res = await instance.put(`/sirius-business-proposal-api/proposal/${String(id)}`, params)
    return res.data
  } catch (error) {
    console.error(error)
  }
}

const putStatus = async (id: any, status: string, reason?: string): Promise<any> => {
  const payload = reason === undefined ? `${String(status)}` : `${String(status)}/${String(reason)}`
  try {
    const res = await instance.put(`/sirius-business-proposal-api/proposal/${String(id)}/status/${payload}`)
    return res.data
  } catch (error) {
    console.error(error)
  }
}

const getBusinessPartnerCostumer = async (params): Promise<any> => {
  try {
    const res = await instance.get(`/sirius-business-partner-api/business/partner/${String(params)}`)
    return res.data
  } catch (error) {
    console.error(error)
  }
}

const getCountries = async (): Promise<any> => {
  try {
    const res = await instance.get('/sirius-master-data-api/countries/mercosul')
    return res.data
  } catch (error) {
    console.error(error)
  }
}
const getMercosulCities = async (): Promise<any> => {
  try {
    const res = await instance.get('/sirius-master-data-api/city/mercosul')
    return res.data
  } catch (error) {
    console.error(error)
  }
}

const getMercosulStates = async (): Promise<any> => {
  try {
    const res = await instance.get('/sirius-master-data-api/states/mercosul')
    return res.data
  } catch (error) {
    console.error(error)
  }
}

const getStates = async (params): Promise<any> => {
  try {
    const res = await instance.get(`/sirius-master-data-api/countries/${String(params)}/states`)
    return res.data
  } catch (error) {
    console.error(error)
    return ('error')
  }
}

const getCities = async (params): Promise<any> => {
  try {
    const res = await instance.get(`/sirius-master-data-api/city/states/${String(params)}/cities`)
    return res.data
  } catch (error) {
    console.error(error)
    return ('error')
  }
}

const getCityById = async (params): Promise<any> => {
  try {
    const res = await instance.get(`/sirius-master-data-api/city/${String(params)}`)
    return res.data
  } catch (error) {
    console.error(error)
    return ('error')
  }
}

const getCountProposal = async (params): Promise<any> => {
  try {
    const res = await instance.get('/sirius-business-proposal-api/proposal/count', {
      params,
      paramsSerializer: params => {
        return qs.stringify(params, { arrayFormat: 'comma' })
      }
    })
    return res.data
  } catch (error) {
    console.error(error)
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
  getMercosulStates
}

export default API
