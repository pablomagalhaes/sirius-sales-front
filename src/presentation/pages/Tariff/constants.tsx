import { SelectorsValuesTypes } from '../../../application/enum/tariffEnum'
import { ModalTypes } from '../../../application/enum/utilsEnum'
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

const menuItems = {
  dateRanges: [
    { label: 'Últimos 7 dias', lastDays: 7 },
    { label: 'Últimos 15 dias', lastDays: 14 },
    { label: 'Últimos 30 dias', lastDays: 29 },
    { label: 'Último trimestre', lastDays: 89 },
    { label: 'Início do mês até hoje', lastDays: -1 },
    { label: 'Customizado' }
  ],
  processTypes: [
    'Frete - Importação',
    'Frete - Exportação',
    'Desembaraço',
    'Consultoria',
    'FTA'
  ],
  modal: ['Aéreo', 'Marítimo', 'Rodoviário'],
  statusTypes: ['Aberta', 'Ag. Retorno Cliente', 'Em Revisão', 'Rejeitada', 'Cancelada', 'Aprovada']
}

const columns = {
  AIR: ['Agente', 'Cia. Aérea', 'Origem e destino', 'Tr. time', 'Validade', 'Moeda', 'Mínimo', 'Valor (de +45kg a 1ton)'],
  SEA: {
    LCL: ['Agente', 'Cia. Marítima', 'Origem e destino', 'Tr. time', 'Validade', 'Moeda', 'Mínimo', 'Até 7w/m', 'Acima'],
    FCL: ['Agente', 'Cia. Marítima', 'Origem e destino', 'Tr. time', 'Validade', 'Moeda', 'Vlr. container(20)', 'Vlr. container(40)']
  },
  LAND: ['Agente', 'Transportadora', 'Origem e destino', 'Tr. time', 'Validade', 'Moeda', 'Geral/IMO Ded.', 'Geral/ IMO Cons']
}

const rows = {
  AIR: ['agent', 'airCompany', 'originDestiny', 'transitTime', 'validity', 'currency', 'minimun', 'value'],
  SEA: {
    LCL: ['agent', 'seaCompany', 'originDestiny', 'transitTime', 'validity', 'currency', 'minimun', 'under7w', 'over'],
    FCL: ['agent', 'seaCompany', 'originDestiny', 'transitTime', 'validity', 'currency', 'container20', 'container40']
  },
  LAND: ['agent', 'landCompany', 'originDestiny', 'transitTime', 'validity', 'currency', 'geralImoDed', 'geralImoCons']
}

const cardFilters = [
  {
    iconType: 'import',
    status: 'Importação',
    uniqueChoice: true
  },
  {
    iconType: 'export',
    status: 'Exportação',
    uniqueChoice: true
  },
  {
    iconType: 'plane',
    status: 'Aéreo',
    uniqueChoice: true
  },
  {
    iconType: 'ship',
    status: 'Marítimo',
    uniqueChoice: true
  },
  {
    iconType: 'truck',
    status: 'Rodoviário',
    uniqueChoice: true
  },
  {
    iconType: 'warn',
    status: 'Vencimento próximo',
    uniqueChoice: true
  },
  {
    iconType: 'alert',
    status: 'Vencidas',
    uniqueChoice: true
  }
]

export { orderButtonMenuItems, menuItems, columns, rows, cardFilters }
