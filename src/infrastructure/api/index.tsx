import instance from '../instance'
import qs from 'qs'

const getContainerType = async (): Promise<any> => {
  try {
    const res = await instance.get('/sirius-master-data-api/container/type/')
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

const getIncoterm = async (): Promise<any> => {
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

const getTemperature = async (): Promise<any> => {
  try {
    const res = await instance.get('/sirius-master-data-api/temperature')
    return res.data
  } catch (error) {
    console.error(error)
  }
}

const getImo = async (): Promise<any> => {
  try {
    const res = await instance.get('/sirius-master-data-api/imo/type')
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

const getService = async (): Promise<any> => {
  try {
    const res = await instance.get('/sirius-business-proposal-api/service')
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
    const res = await instance.post('/sirius-business-proposal-api/proposalimportfreight', params)
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

const API = {
  getContainerType,
  getCurrencies,
  getIncoterm,
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
  postTotalCalculation
}

export default API
