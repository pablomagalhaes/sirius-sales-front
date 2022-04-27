export interface TotalCost {
  id?: number | null
  idProposal?: number
  costType: string // 'Origem''Destino''Tarifa'
  idCurrency: string // id moeda
  valueTotalSale: number // total sale da moeda
  valueTotalPurchase: number // total compra da moeda
}
