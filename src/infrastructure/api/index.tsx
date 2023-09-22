import instance from '../instance'
import React from 'react'
import { AxiosError } from 'axios'
import qs from 'qs'
import { toast } from 'react-toastify'
import ToastAlertIcon from '../../application/icons/ToastAlertIcon'

const toastErrorMessage = (error: AxiosError, url: string): any => {
  if(error.response.status > 499) {
    return toast.error(
      <>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <ToastAlertIcon />
          <div style={{ fontWeight: '600'}}>Por favor, entre em contato com o suporte técnico.</div>
        </div>
        <hr />
        <div>{String(error)}  Request:  {String(url)}</div>
      </>, { icon: false }
    )
  } else {
    return toast.error(
      <>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <ToastAlertIcon />
          <div>{String(error)}  Request:  {String(url)}</div>
        </div>
      </>, { icon: false }
    )
  } 
}

const getContainerType = async (params?): Promise<any> => {
  const url: string = `/sirius-master-data-api/container/type/${params !== undefined ? String(params) : ''}`
  try {
    const res = await instance.get(url)
    return res.data
  } catch (error) {
    toastErrorMessage(error, url)
  }
}

const getCurrencies = async (): Promise<any> => {
  const url: string = '/sirius-master-data-api/currencies/'
  try {
    const res = await instance.get(url)
    return res.data
  } catch (error) {
    toastErrorMessage(error, url)
  }
}

const getIncoterms = async (): Promise<any> => {
  const url: string = '/sirius-master-data-api/incoterms/'
  try {
    const res = await instance.get(url)
    return res.data
  } catch (error) {
    toastErrorMessage(error, url)
  }
}

const getPackaging = async (): Promise<any> => {
  const url: string = '/sirius-master-data-api/packaging/'
  try {
    const res = await instance.get(url)
    return res.data
  } catch (error) {
    toastErrorMessage(error, url)
  }
}

const getOriginDestination = async (): Promise<any> => {
  const url: string = '/sirius-master-data-api/origins/destinations/resumo'
  try {
    const res = await instance.get(url)
    return res.data
  } catch (error) {
    toastErrorMessage(error, url)
  }
}

const getOriginDestinationByModal = async (params): Promise<any> => {
  const url: string = `/sirius-master-data-api/origins/destinations/transport/${String(params)}`
  try {
    const res = await instance.get(url)
    return res.data
  } catch (error) {
    toastErrorMessage(error, url)
  }
}

const getOriginDestinationById = async (params): Promise<any> => {
  const url: string = `/sirius-master-data-api/origins/destinations/${String(params)}`
  try {
    const res = await instance.get(url)
    return res.data
  } catch (error) {
    toastErrorMessage(error, url)
  }
}

const getFrequency = async (): Promise<any> => {
  const url: string = '/sirius-master-data-api/frequency'
  try {
    const res = await instance.get(url)
    return res.data
  } catch (error) {
    toastErrorMessage(error, url)
  }
}

const getAgents = async (): Promise<any> => {
  const url: string = '/sirius-business-partner-api/business/partner/class/classification/agente'
  try {
    const res = await instance.get(url)
    return res.data
  } catch (error) {
    toastErrorMessage(error, url)
  }
}

const getBusinessPartnerByType = async (type: string): Promise<any> => {
  const url: string = `/sirius-business-partner-api/business/partner/class/classification/${type}`
  try {
    const res = await instance.get(url)
    return res.data
  } catch (error) {
    toastErrorMessage(error, url)
  }
}

const getTemperature = async (params?): Promise<any> => {
  const url: string = `/sirius-master-data-api/temperature/${params !== undefined ? String(params) : ''}`
  try {
    const res = await instance.get(url)
    return res.data
  } catch (error) {
    toastErrorMessage(error, url)
  }
}

const getImo = async (params?): Promise<any> => {
  const url: string = `/sirius-master-data-api/imo/type/${params !== undefined ? String(params) : ''}`
  try {
    const res = await instance.get(url)
    return res.data
  } catch (error) {
    toastErrorMessage(error, url)
  }
}

const getPartner = async (): Promise<any> => {
  const url: string = '/sirius-business-partner-api/business/partner/class/classification/cliente'
  try {
    const res = await instance.get(url)
    return res.data
  } catch (error) {
    toastErrorMessage(error, url)
  }
}

const getService = async (params?): Promise<any> => {
  const url: string = `/sirius-business-proposal-api/service/${params !== undefined ? String(params) : ''}`
  try {
    const res = await instance.get(url)
    return res.data
  } catch (error) {
    toastErrorMessage(error, url)
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
    toastErrorMessage(error, url)
  }
}

const postProposal = async (params): Promise<any> => {
  const url: string = '/sirius-business-proposal-api/proposal'
  try {
    const res = await instance.post(url, params)
    return res.data
  } catch (error) {
    toastErrorMessage(error, url)
  }
}

const postTotalCalculation = async (params): Promise<any> => {
  const url: string = '/sirius-business-proposal-api/costs/calculation/total'
  try {
    const res = await instance.post(url, params)
    return res.data
  } catch (error) {
    toastErrorMessage(error, url)
  }
}

const getProposal = async (params): Promise<any> => {
  const url: string = `/sirius-business-proposal-api/proposal/${String(params)}`
  try {
    const res = await instance.get(url)
    return res.data
  } catch (error) {
    toastErrorMessage(error, url)
  }
}

const putProposal = async (id, params): Promise<any> => {
  const url: string = `/sirius-business-proposal-api/proposal/${String(id)}`
  try {
    const res = await instance.put(url, params)
    return res.data
  } catch (error) {
    toastErrorMessage(error, url)
  }
}

const putStatus = async (id: any, status: string, reason?: string, detail?: string): Promise<any> => {
  const url: string = `/sirius-business-proposal-api/proposal/${String(id)}/status/${String(status)}`
  try {
    const res = await instance.put(url, {
      dsRejectReason: detail,
      reasonStatus: reason
    })
    return res.data
  } catch (error) {
    toastErrorMessage(error, url)
  }
}

const getBusinessPartnerCostumer = async (params): Promise<any> => {
  const url: string = `/sirius-business-partner-api/business/partner/${String(params)}`
  try {
    const res = await instance.get(url)
    return res.data
  } catch (error) {
    toastErrorMessage(error, url)
  }
}

const getCountries = async (): Promise<any> => {
  const url: string = '/sirius-master-data-api/countries/mercosul'
  try {
    const res = await instance.get(url)
    return res.data
  } catch (error) {
    toastErrorMessage(error, url)
  }
}
const getMercosulCities = async (): Promise<any> => {
  const url: string = '/sirius-master-data-api/city/mercosul'
  try {
    const res = await instance.get(url)
    return res.data
  } catch (error) {
    toastErrorMessage(error, url)
  }
}

const getMercosulStates = async (): Promise<any> => {
  const url: string = '/sirius-master-data-api/states/mercosul'
  try {
    const res = await instance.get(url)
    return res.data
  } catch (error) {
    toastErrorMessage(error, url)
  }
}

const getStates = async (params): Promise<any> => {
  const url: string = `/sirius-master-data-api/countries/${String(params)}/states`
  try {
    const res = await instance.get(url)
    return res.data
  } catch (error) {
    toastErrorMessage(error, url)
    return ('error')
  }
}

const getCities = async (params): Promise<any> => {
  const url: string = `/sirius-master-data-api/city/states/${String(params)}/cities`
  try {
    const res = await instance.get(url)
    return res.data
  } catch (error) {
    toastErrorMessage(error, url)
    return ('error')
  }
}

const getCityById = async (params): Promise<any> => {
  const url: string = `/sirius-master-data-api/city/${String(params)}`
  try {
    const res = await instance.get(url)
    return res.data
  } catch (error) {
    toastErrorMessage(error, url)
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
    toastErrorMessage(error, url)
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
    toastErrorMessage(error, url)
  }
}

const getTariffsByFilter = async (direction: string, orderByList: string, page: number, size: number): Promise<any> => {
  const url: string = `/sirius-tariff-api/upload/file/filter?direction=${String(direction)}&orderByList=${String(orderByList)}&page=${Number(page)}&size=${Number(size)}`
  try {
    const res = await instance.get(url)
    return res.data
  } catch (error) {
    toastErrorMessage(error, url)
  }
}

const downloadProposal = async (language: string, idProposal: string): Promise<any> => {
  const url: string = `/sirius-business-proposal-api/proposal/report/${idProposal}/PDF/${language}`
  try {
    const res = await instance.get(url)
    return res.data
  } catch (error) {
    toastErrorMessage(error, url)
  }
}

const downloadStaggeredProposal = async (language: string, idProposal: string): Promise<any> => {
  const url: string = `/sirius-tariff-api/tariff/proposal/report/${idProposal}/PDF/${language}`
  try {
    const res = await instance.get(url)
    return res.data
  } catch (error) {
    toastErrorMessage(error, url)
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
    toastErrorMessage(error, url)
  }
}

const editTariff = async (idTariff: string, params): Promise<any> => {
  const url: string = `/sirius-tariff-api/tariff/${idTariff}`
  try {
    const res = await instance.put(url, params)
    return res.data
  } catch (error) {
    toastErrorMessage(error, url)
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
    toastErrorMessage(error, url)
    return 'error'
  }
}

const getTariffProposal = async (id: string): Promise<any> => {
  const url: string = `/sirius-tariff-api/tariff/proposal/${id}`
  try {
    const res = await instance.get(url)
    return res.data
  } catch (error) {
    toastErrorMessage(error, url)
  }
}

const putTariffProposal = async (id: string, params: any): Promise<any> => {
  const url: string = `/sirius-tariff-api/tariff/proposal/${id}`
  try {
    const res = await instance.put(url, params)
    return res.data
  } catch (error) {
    toastErrorMessage(error, url)
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
  uploadTariff,
  getTariffsByFilter,
  getTariffProposal,
  putTariffProposal,
  downloadStaggeredProposal
}

export default API
