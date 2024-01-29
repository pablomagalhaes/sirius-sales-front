const orderButtonMenuItems = [
  {
    value: 'referenceProposal',
    description: 'Ref. proposta'
  },
  {
    value: 'customer.customerName',
    description: 'Nome do cliente'
  },
  {
    value: 'userCreationName',
    description: 'Responsável'
  },
  {
    value: 'transportMode',
    description: 'Modal'
  },
  {
    value: 'originDestiny.idOrigin',
    description: 'Origem'
  },
  {
    value: 'originDestiny.idDestination',
    description: 'Destino'
  },
  {
    value: 'openingDate',
    description: 'Dt. abertura'
  },
  {
    value: 'validityDate',
    description: 'Dt. validade'
  }
]

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

export { TableRows, orderButtonMenuItems, menuItems }
