export interface CostAgent {
  id?: number | null
  idBusinessPartnerAgent?: number | null
  idBusinessPartnerTransportCompany?: number | null
  proposalId?: number | null
}
export interface Cost {
  id?: number | null
  idCost: number | null
  idProposal?: number | null
  idService: number // id Descricao
  idContainerType: string | null// containerMODAL
  agent: CostAgent
  costType: string // 'Origem''Destino''Tarifa'
  billingType: string // Tipo -MODAL
  valuePurchase: number | null // valor compra
  valuePurchasePercent: number | null // 0 por enquanto
  valueMinimumPurchase: number | null // minimo compra
  valueSale: number | null // valor venda
  valueSalePercent: number // 0 por enquanto
  valueMinimumSale: number | null // minimo venda
  idCurrencyPurchase: string | null // tipo moeda
  idCurrencySale: string | null // tipo moeda
  isPurchase: boolean // checkbox compra
  isSale: boolean // checkbox venda
  valueSaleTotal: number | null
  valuePurchaseTotal: number | null
  idTariff?: number | null
}
