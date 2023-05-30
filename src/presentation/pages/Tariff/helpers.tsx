import { ValidityTypes, IconTypes, AcitivityTypes } from '../../../application/enum/tariffEnum'
import { ModalTypes } from '../../../application/enum/enum'

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

const convertToDecimal = (value: number): string => String(value.toFixed(2)).replace('.', ',')

export { getValidityFilter, getActivityFilter, getModalFilter, convertToDecimal }
