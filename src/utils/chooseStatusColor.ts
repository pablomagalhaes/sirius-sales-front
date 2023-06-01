import { I18n } from 'react-redux-i18n'

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
export default chooseStatusColor