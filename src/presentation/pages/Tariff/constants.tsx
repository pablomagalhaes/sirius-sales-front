const orderButtonMenuItems = (modal: string): any => {
    const getBusinessPartnerType = (): string => {
      switch (modal) {
        case 'SEA':
          return 'Armador/Coloader'
        case 'LAND':
          return 'Transportadora'
      }
      return 'Cia. Aérea'
    }
    return [
      {
        value: 'nmAgent',
        description: 'Agente'
      },
      {
        value: 'dsBusinessPartnerTransporter',
        description: getBusinessPartnerType()
      },
      {
        value: modal === 'LAND' ? 'cityOrigin' : 'origin',
        description: 'Origem'
      },
      {
        value: modal === 'LAND' ? 'cityDestination' : 'destination',
        description: 'Destino'
      },
      {
        value: 'validityDate',
        description: 'Validade'
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

export { orderButtonMenuItems, menuItems, columns, rows }
