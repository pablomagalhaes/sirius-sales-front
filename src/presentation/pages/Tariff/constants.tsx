import { SelectorsValuesTypes } from '../../../application/enum/tariffEnum'
import { ModalTypes } from '../../../application/enum/enum'
import { I18n } from 'react-redux-i18n'
import { OrderButtonMenuItems } from '../../components/OrderComponent/OrderBy'

const orderButtonMenuItems = (modal: string): OrderButtonMenuItems[] => {
  const getBusinessPartnerType = (): string => {
    switch (modal) {
      case ModalTypes.Sea:
        return I18n.t('pages.tariff.orderSelectors.seaBusinessPartner')
      case ModalTypes.Land:
        return I18n.t('pages.tariff.orderSelectors.landBusinessPartner')
    }
    return I18n.t('pages.tariff.orderSelectors.airBusinessPartner')
  }
  return [
    {
      value: SelectorsValuesTypes.Agent,
      description: I18n.t('pages.tariff.orderSelectors.agent')
    },
    {
      value: SelectorsValuesTypes.PartnerTransporter,
      description: getBusinessPartnerType()
    },
    {
      value: modal === ModalTypes.Land ? SelectorsValuesTypes.CityOrigin : SelectorsValuesTypes.Origin,
      description: I18n.t('pages.tariff.orderSelectors.origin')
    },
    {
      value: modal === ModalTypes.Land ? SelectorsValuesTypes.CityDestination : SelectorsValuesTypes.Destination,
      description: I18n.t('pages.tariff.orderSelectors.destination')
    },
    {
      value: SelectorsValuesTypes.Validity,
      description: I18n.t('pages.tariff.orderSelectors.validity')
    }
  ]
}

const orderButtonMenuItemsTable = (modal: string): any => {
  return [
    {
      value: 'dtProcess',
      description: I18n.t('pages.tariff.tariffProcessing.orderSelectors.dtProcess')
    },
    {
      value: 'uploadStatus.txStatus',
      description: I18n.t('pages.tariff.tariffProcessing.orderSelectors.uploadStatus')
    }
  ]
}

export { orderButtonMenuItems, orderButtonMenuItemsTable }
