import React from 'react'

import {
  ClientCell,
  AirplaneCell,
  OriginCell,
  LabelCell,
  ResponsibleCell,
  StatusCell,
  MenuIconCell
} from 'fiorde-fe-components'

interface CardFilterProps {
  iconType: 'warn' | 'import' | 'export' | 'plane' | 'ship' | 'truck' | ''
  status: string
  value: string
}

const cardFilters: CardFilterProps[] = [
  {
    iconType: 'warn',
    value: '170',
    status: 'aberta'
  },
  {
    iconType: '',
    value: '61',
    status: 'ag. ret. cliente'
  },
  {
    iconType: '',
    value: '5',
    status: 'renegociação'
  },
  {
    iconType: '',
    value: '80',
    status: 'IO concluída'
  },
  {
    iconType: '',
    value: '12',
    status: 'rejeitada'
  },
  {
    iconType: '',
    value: '28',
    status: 'aprovada'
  },
  {
    iconType: 'truck',
    value: '10',
    status: 'rodoviário'
  },
  {
    iconType: 'plane',
    value: '40',
    status: 'aéreo'
  },
  {
    iconType: 'ship',
    value: '160',
    status: 'marítimo'
  }
]

const infiniteScrollRows = (): any => {
  const array: any = []
  Array.from(Array(20), (value, i: number) => {
    const item = {
      key: i,
      reference: 'Ref. PC-000004/20',
      client: 'EUROFARMA LABORATORIOS',
      origin: 'GUARULHOS',
      destination: 'MANAUS',
      opening: '26/01/2021',
      shelfLife: '10/07/2023',
      iconterm: 'CFR',
      numio: '000001/20',
      responsible: 'Cristina A.',
      status: 'aberto'
    }
    return array.push(item)
  }
  )
  return array
}

const infiniteScrollColumns = [
  {
    label: 'Referência/Cliente',
    key: 'refClient',
    render: ({ reference, client }: any) => (
      <ClientCell title={reference} subtitle={client} />
    ),
    size: 4
  },
  {
    label: 'Modal',
    key: 'modal',
    render: () => <AirplaneCell />,
    size: 1
  },
  {
    label: 'Origem',
    key: 'origin',
    render: ({ origin }: any) => <OriginCell>{origin}</OriginCell>,
    size: 4
  },
  {
    label: 'Destino',
    key: 'destination',
    render: ({ destination }: any) => <LabelCell>{destination}</LabelCell>,
    size: 2
  },
  {
    label: 'Incoterm',
    key: 'inconterm',
    render: ({ iconterm }: any) => <LabelCell>{iconterm}</LabelCell>,
    size: 2
  },
  {
    label: 'Abertura',
    key: 'opening',
    render: ({ opening }: any) => <LabelCell>{opening}</LabelCell>,
    size: 3
  },
  {
    label: 'Validade',
    key: 'shelfLife',
    render: ({ shelfLife, key }: any) => <LabelCell>{shelfLife}</LabelCell>,
    size: 3
  },
  {
    label: 'Núm.IO',
    key: 'numio',
    render: ({ numio }: any) => <LabelCell>{numio}</LabelCell>,
    size: 3
  },
  {
    label: 'Responsável',
    key: 'responsible',
    render: ({ responsible }: any) => (
      <ResponsibleCell>{responsible}</ResponsibleCell>
    ),
    size: 3
  },
  {
    label: '',
    key: 'status',
    render: ({ status }: any) => (
      <StatusCell type={status === 'rascunho' ? 'draft' : 'agree'}>
        {status}
      </StatusCell>
    ),
    size: 2
  },
  {
    label: '',
    key: 'menu',
    render: () => <MenuIconCell />,
    size: 2
  }
]

const floatingButtonMenuItems = [
  {
    iconType: 'edit',
    label: 'Editar',
    onClick: () => console.log('click')
  },
  {
    iconType: 'duplicate',
    label: 'Duplicar',
    onClick: () => console.log('click')
  },
  {
    iconType: 'cancel',
    label: 'Cancelar',
    onClick: () => console.log('click')
  },
  {
    iconType: 'approved',
    label: 'Definir como aprovada',
    onClick: () => console.log('click')
  }
]

const menuItemsSelector = [
  {
    label: 'Etapa',
    checkboxList1: [
      'Embarque',
      'Chegada',
      'Presença de carga',
      'Registro DI',
      'Desembaraço',
      'Emissão de NF',
      'Entrega',
      'Faturamento'
    ]
  },
  {
    label: 'Modal/Origem/Destino',
    checkboxList1: ['Aéreo', 'Marítimo', 'Rodoviário'],
    pickerListOptions1: ['Guarulhos', 'Campinas'],
    pickerListOptions2: ['Guarulhos', 'Campinas'],
    pickerLabel1: 'Origem',
    pickerLabel2: 'Destino',
    title1: 'Modal'
  },
  {
    label: 'Cliente',
    pickerListOptions1: ['7211 - 3V do Brasil', '18 - ABBOT'],
    pickerListOptions2: [
      '50742 - ABBOT ADD SP (0032 - 12)',
      '51217 - ABBOT INT ADC (0032 - 12)'
    ],
    pickerLabel1: 'Grupo de cliente (cód ou nome)',
    pickerLabel2: 'Cliente (cód ou nome)'
  },
  {
    label: 'Produto/Planta',
    pickerListOptions1: [
      'MR7300071BBN - ÁCIDO GLACIAL',
      'MR7300082BBN - ÁCIDO ACÉTICO'
    ],
    pickerListOptions2: ['ABBOT ADD SP (0032-12)', 'ABBOT INT ADC (0032-12)'],
    pickerLabel1: 'Produto (cód SKU ou descrição)',
    pickerLabel2: 'Planta (cód ou nome)'
  },
  {
    label: 'Status/Canal',
    checkboxList1: ['On time', 'Delayed'],
    checkboxList2: ['Verde', 'Amarelo', 'Vermelho', 'Cinza'],
    title1: 'Status',
    title2: 'Canal'
  },
  {
    label: 'ETA',
    hasDatePicker: true,
    dateRanges: [
      { label: 'Últimos 7 dias', lastDays: 7 },
      { label: 'Últimos 15 dias', lastDays: 14 },
      { label: 'Últimos 30 dias', lastDays: 29 },
      { label: 'Últimos 3 meses', lastDays: 89 },
      { label: 'Início do mês até hoje', lastDays: -1 },
      { label: 'Customizado' }
    ]
  },
  {
    label: 'ETD',
    hasDatePicker: true,
    dateRanges: [
      { label: 'Últimos 7 dias', lastDays: 7 },
      { label: 'Últimos 15 dias', lastDays: 14 },
      { label: 'Últimos 30 dias', lastDays: 29 },
      { label: 'Últimos 3 meses', lastDays: 89 },
      { label: 'Início do mês até hoje', lastDays: -1 },
      { label: 'Customizado' }
    ]
  },
  {
    label: 'Fornecedor',
    pickerListOptions1: ['ABBOT ADD SP (0032-12)', 'ABBOT INT ADC (0032-12)'],
    pickerLabel1: 'Fornecedor (nome)'
  },
  {
    label: 'Teste',
    checkboxList1: ['Text', 'Printing', 'Typesetting'],
    pickerListOptions1: ['Contrary', 'There'],
    pickerLabel1: 'Picker 1'
  },
  {
    label: 'Testing 2',
    checkboxList1: ['Lorem', 'Ipsum', 'Simply'],
    checkboxList2: ['Curabitur', 'Etiam', 'Vestibulum', 'Etiam'],
    title1: 'check box 1',
    title2: 'check box 2',
    pickerListOptions1: ['Lorem', 'ipsum'],
    pickerLabel1: 'Picker label 1',
    pickerListOptions2: ['Lorem', 'ipsum'],
    pickerLabel2: 'Picker label 2'
  }
]

export {
  cardFilters,
  infiniteScrollRows,
  infiniteScrollColumns,
  floatingButtonMenuItems,
  menuItemsSelector
}
