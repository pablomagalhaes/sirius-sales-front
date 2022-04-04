export interface Cost {
  idProposal: Number
  idService: Number // id Descricao
  containerType: string | null// containerMODAL
  idBusinessPartnerAgent: Number // AgenteMODALcusto
  costType: string // 'Origem''Destino''Tarifa'
  billingType: string // Tipo -MODAL
  valuePurchase: Number | null // valor compra
  valuePurchasePercent: Number | null // 0 por enquanto
  valueMinimumPurchase: Number | null // minimo compra
  valueSale: Number | null // valor venda
  valueSalePercent: Number // 0 por enquanto
  valueMinimumSale: Number | null // minimo venda
  idCurrencyPurchase: string | null // tipo moeda
  idCurrencySale: string | null // tipo moeda
  isPurchase: boolean // checkbox compra
  isSale: boolean // checkbox venda
}
