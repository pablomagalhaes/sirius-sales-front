import { useQuery } from '@tanstack/react-query'
import API from '../../infrastructure/api'

import { QueryKeys } from '../../application/enum/queryKeys'
import { BusinessPartnerTypes } from '../../application/enum/enum'

const useCurrencies = (): any => {
  return useQuery([QueryKeys.currencies], API.getCurrencies)
}

const useOriginDestination = (): any => {
  return useQuery([QueryKeys.originDestination], API.getOriginDestination)
}

const useMercosulCountries = (): any => {
  return useQuery([QueryKeys.countries], API.getCountries)
}

const useMercosulCities = (): any => {
  return useQuery([QueryKeys.mercosulCities], API.getMercosulCities)
}

const useMercosulStates = (): any => {
  return useQuery([QueryKeys.mercosulStates], API.getMercosulStates)
}

const useFrequency = (): any => {
  return useQuery([QueryKeys.frequency], API.getFrequency)
}

const usePartnerList = (): any => {
  const { data = [] } = useQuery([QueryKeys.agent], API.getAgents)
  const partnerList: any[] = data.map((item: any) => item?.businessPartner)
  const partnerSimpleNameList: any[] = data.map((item: any) => item?.businessPartner?.simpleName)

  return { partnerSimpleNameList, partnerList }
}

const useBusinessPartnerByType = (): any => {
  const getBusinessPartnerAir = async (): Promise<any> => {
    const data = await API.getBusinessPartnerByType(BusinessPartnerTypes.Air)
    return data
  }
  const getBusinessPartnerLand = async (): Promise<any> => {
    const data = await API.getBusinessPartnerByType(BusinessPartnerTypes.Land)
    return data
  }
  const getBusinessPartnerShipOwner = async (): Promise<any> => {
    const data = await API.getBusinessPartnerByType(BusinessPartnerTypes.ShipOwner)
    return data
  }
  const getBusinessPartnerColoader = async (): Promise<any> => {
    const data = await API.getBusinessPartnerByType(BusinessPartnerTypes.Coloader)
    return data
  }

  const { data: shipOwner = [] } = useQuery([QueryKeys.businessPartnerShipOwner], getBusinessPartnerShipOwner)
  const { data: coloader = [] } = useQuery([QueryKeys.businessPartnerColoader], getBusinessPartnerColoader)
  const { data: airPartners = [] } = useQuery([QueryKeys.businessPartnerAir], getBusinessPartnerAir)
  const { data: landPartners = [] } = useQuery([QueryKeys.businessPartnerLand], getBusinessPartnerLand)

  return { seaPartners: [...shipOwner, ...coloader], airPartners, landPartners }
}

const useProposalType = (): any => {
  return useQuery([QueryKeys.proposalType], API.getProposalType)
}

const useProposalModal = (): any => {
  return useQuery([QueryKeys.proposalModal], API.getProposalModal)
}

export {
  useCurrencies,
  useOriginDestination,
  usePartnerList,
  useMercosulCountries,
  useMercosulCities,
  useMercosulStates,
  useBusinessPartnerByType,
  useFrequency,
  useProposalType,
  useProposalModal
}
