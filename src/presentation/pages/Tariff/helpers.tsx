import API from '../../../infrastructure/api'
import { ValidityTypes, TariffItemsTypes } from '../../../application/enum/tariffEnum'
import { ModalTypes, IconTypes, AcitivityTypes, TxChargeTypes } from '../../../application/enum/enum'
import { I18n } from 'react-redux-i18n'

const getModalFilter = (quickFilterList): string => {
  const modalFilter = quickFilterList.find((item) => item.type === 'modal')
  let type: string = ''
  if (modalFilter !== undefined) {
    switch (modalFilter.status) {
      case 'Aéreo':
        type = ModalTypes.Air
        break
      case 'Marítimo':
        type = ModalTypes.Sea
        break
      case 'Rodoviário':
        type = ModalTypes.Land
        break
      default:
        break
    }
  }
  return type
}

const getActivityFilter = (quickFilterList): string => {
  const activityFilter = quickFilterList.find((item) => item.type === 'activity')
  let type: string = ''
  if (activityFilter !== undefined) {
    switch (activityFilter.status) {
      case 'Importação':
        type = AcitivityTypes.Import
        break
      case 'Exportação':
        type = AcitivityTypes.Export
        break
      default:
        break
    }
  }
  return type
}

const getValidityFilter = (quickFilterList): string => {
  const validityFilter = quickFilterList
    .find((item) => item.type === IconTypes.Warn || item.type === IconTypes.Main)
  let type: string = ValidityTypes.Valid
  if (validityFilter !== undefined) {
    switch (validityFilter.status) {
      case 'Vencimento próximo':
        type = ValidityTypes.CloseValidity
        break
      case 'Vencidas':
        type = ValidityTypes.Expired
        break
      default:
        break
    }
  }
  return type
}

const getTariffByFilter = async (filter?: any): Promise<any> => {

  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  const Orderby = `${filter.orderByList},${filter.direction}`

  try {
    const res = await API.getTariffsByFilter(filter.direction, Orderby, filter.page, filter.size)
    return res
  } catch (error) {
    console.log(error)
  }
}

const convertToDecimal = (value: number): string => String(value.toFixed(2)).replace('.', ',')

const capitalizeFirstLetter = (word: any): string => {
  // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
  return word.charAt(0) + word.substring(1).toLowerCase()
}

const chooseStatusColor = (status: any): string => {
  switch (status) {
    case I18n.t('pages.tariff.tariffTableProcessing.sucessLabel'):
      return '#6CD99A'
    case I18n.t('pages.tariff.tariffTableProcessing.errorLabel'):
      return '#FF7373'
    case I18n.t('pages.tariff.tariffTableProcessing.parcialLabel'):
      return '#F2D16D'
    default:
      return '#D9DCE6'
  }
}

let statusLabel = ''

const chooseStatusLabel = (status: any): string => {
  const sucess = I18n.t('pages.tariff.tariffTableProcessing.sucessLabel')
  switch (status) {
    case sucess:
      statusLabel = 'Sucesso'
      return statusLabel
    // eslint-disable-next-line no-duplicate-case
    case 'PARCIAL':
      statusLabel = 'Parcial'
      return statusLabel
    // eslint-disable-next-line no-duplicate-case
    case 'ERRO':
      statusLabel = 'Erro'
      return statusLabel
    default:
      return status
  }
}

const orderCsv = (tariff: any): any => {
  let response
  const getTariffTypeValue = (type: string): string => {
    const res = tariff.tariffTypeValues.find(each => each.tariffType.description === type)
    if (res !== undefined) return convertToDecimal(res.value)
    return ''
  }
  if (tariff.tariffModalType !== '') {
    switch (tariff.tariffModalType) {
      case ModalTypes.Air:
        response = {
          'Cia Aérea': tariff.dsBusinessPartnerTransporter,
          País: tariff.originDestination[0]?.name,
          Origem: tariff.origin,
          Destino: tariff.destination,
          'Transit Time': tariff.transitTime,
          Validade: new Date(tariff.validityDate).toLocaleDateString('pt-BR'),
          Moeda: tariff.currency,
          'Vl Minimo': getTariffTypeValue(TariffItemsTypes.Minimun),
          '45kg': getTariffTypeValue(TariffItemsTypes.Until45),
          '100kg': getTariffTypeValue(TariffItemsTypes.Until100),
          '300kg': getTariffTypeValue(TariffItemsTypes.Until300),
          '500kg': getTariffTypeValue(TariffItemsTypes.Until500),
          '1ton': getTariffTypeValue(TariffItemsTypes.Until1000),
          Rota: tariff.route,
          Frequência: tariff.frequency ? tariff.frequency : ''
        }
        break
      case ModalTypes.Sea:
        if (tariff.txChargeType === TxChargeTypes.Lcl) {
          response = {
            'Armador/Coloader': tariff.dsBusinessPartnerTransporter,
            País: tariff.originDestination[0]?.name,
            Origem: tariff.origin,
            Destino: tariff.destination,
            'Transit Time': tariff.transitTime,
            Validade: new Date(tariff.validityDate).toLocaleDateString('pt-BR'),
            Moeda: tariff.currency,
            'Vl Minimo': getTariffTypeValue(TariffItemsTypes.Minimun),
            'Vl até 7w/m': getTariffTypeValue(TariffItemsTypes.Vluntil7wm),
            Acima: getTariffTypeValue(TariffItemsTypes.Over),
            Rota: tariff.route,
            Frequência: tariff.frequency ? tariff.frequency : ''
          }
        }
        if (tariff.txChargeType === TxChargeTypes.Fcl) {
          response = {
            'Armador/Coloader': tariff.dsBusinessPartnerTransporter,
            País: tariff.originDestination[0]?.name,
            Origem: tariff.origin,
            Destino: tariff.destination,
            'Transit Time': tariff.transitTime,
            Validade: new Date(tariff.validityDate).toLocaleDateString('pt-BR'),
            Moeda: tariff.currency,
            'Vl Container 20': getTariffTypeValue(TariffItemsTypes.Vlcontainer20),
            'Vl Container 40': getTariffTypeValue(TariffItemsTypes.Vlcontainer40),
            Rota: tariff.route,
            Frequência: tariff.frequency ? tariff.frequency : ''
          }
        }
        break
      case ModalTypes.Land:
        response = {
          'Transp Rodoviária': tariff.dsBusinessPartnerTransporter,
          'País Origem': tariff.originCountry,
          'Estado Origem': tariff.originState,
          'Cidade Origem': tariff.originCity,
          'País Destino': tariff.destinationCountry,
          'Estado Destino': tariff.destinationState,
          'Cidade Destino': tariff.destinationCity,
          'Transit Time': tariff.transitTime,
          Validade: new Date(tariff.validityDate).toLocaleDateString('pt-BR'),
          Moeda: tariff.currency,
          'Vl Geral Ded.': getTariffTypeValue(TariffItemsTypes.Vlgeneralded),
          'Vl IMO Ded.': getTariffTypeValue(TariffItemsTypes.Vlimoded),
          'Vl Geral Cons.': getTariffTypeValue(TariffItemsTypes.Vlgeneralcons),
          'Vl IMO Cons.': getTariffTypeValue(TariffItemsTypes.Vlimocons),
          Rota: tariff.route,
          Frequência: tariff.frequency ? tariff.frequency : ''
        }
        break
      default:
        break
    }
  }
  return response
}

export { orderCsv, getValidityFilter, getActivityFilter, getModalFilter, convertToDecimal, getTariffByFilter, capitalizeFirstLetter, chooseStatusColor, chooseStatusLabel }
