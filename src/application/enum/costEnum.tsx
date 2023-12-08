enum CostTypes {
  Tariff = 'Tarifa',
  Freight = 'Frete',
  Origin = 'Origem',
  Destiny = 'Destino'
}

enum FareItemsTypes {
  Fixed = 'FIXO',
  Bl = 'BL',
  Cw = 'CW',
  Container = 'CONTAINER',
  Fdesp = '% F.+ DESP.O',
  Ton = 'TON',
  Kilo = 'KG'
}

enum CostNameTypes {
  Fixed = 'Fixo',
  Bl = 'BL',
  Cw = 'CW',
  Container = 'Container',
  Fdesp = '%F. + Desp. O',
  Ton = 'Ton³',
  Kilo = 'KG'
}

enum TooltipTypes {
  Fdesp = '% de frete + Despesa Origem'
}

export { CostTypes, FareItemsTypes, CostNameTypes, TooltipTypes }
