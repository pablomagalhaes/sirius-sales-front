export interface Cost {
  id?: number | null
  idProposal: number
  idService: number // id Descricao
  containerType: string | null// containerMODAL
  idBusinessPartnerAgent: number // AgenteMODALcusto
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
}
