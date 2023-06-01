import React from 'react'
import { I18n } from 'react-redux-i18n'

console.log(I18n.t('pages.tariff.tariffTableProcessing.sucessLabel'))

const sucess = I18n.t('pages.tariff.tariffTableProcessing.sucessLabel')
console.log('sucess', sucess)

console.log(I18n.t('pages.tariff.table.sucessLabel'))

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
export default chooseStatusLabel
