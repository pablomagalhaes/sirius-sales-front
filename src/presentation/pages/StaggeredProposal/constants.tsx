
import { SelectorsValuesTypes } from '../../../application/enum/tariffEnum'
import { ModalTypes } from '../../../application/enum/enum'
import { I18n } from 'react-redux-i18n'

const orderButtonMenuItems = (modal: string): any => {
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

// mock
const TableRows = (): any => {
  const array: any = []
  Array.from(Array(20), (value, i: number) => {
    const item = {
      key: i,
      reference: 'PC-000004/20',
      client: 'EUROFARMA LABORATORIOS',
      origin: 'GUARULHOS',
      destination: 'MANAUS',
      opening: '26/01/2021',
      shelfLife: '10/07/2023',
      iconterm: 'CFR',
      numio: '000001/20',
      responsible: 'Cristina A.',
      status: 'aberto',
      type: 'importation'
    }
    return array.push(item)
  })
  return array
}

export { TableRows, orderButtonMenuItems }
