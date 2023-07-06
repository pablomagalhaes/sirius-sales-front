import API from '../../../infrastructure/api'
import { ValidityTypes } from '../../../application/enum/tariffEnum'
import { ModalTypes, IconTypes, AcitivityTypes } from '../../../application/enum/enum'
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
  try {
    const res = await API.getTariffsByFilter(filter.direction, filter.orderByList, filter.page, filter.size)
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

export { getValidityFilter, getActivityFilter, getModalFilter, convertToDecimal, getTariffByFilter, capitalizeFirstLetter, chooseStatusColor, chooseStatusLabel }
