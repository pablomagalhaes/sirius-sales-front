const orderButtonMenuItems = [
  {
    value: 'referenceProposal',
    description: 'Ref. proposta'
  },
  {
    value: 'customerName',
    description: 'Nome do cliente'
  },
  {
    value: 'userCreationName',
    description: 'Responsável'
  },
  {
    value: 'idTransport',
    description: 'Modal'
  },
  {
    value: 'idOrigin',
    description: 'Origem'
  },
  {
    value: 'idDestination',
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

export { orderButtonMenuItems, menuItems }
