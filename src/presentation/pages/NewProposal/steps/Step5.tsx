import React, { useEffect, useState, useContext } from 'react'
import CostTable from '../../../components/CostTable/CostTable'
import { I18n } from 'react-redux-i18n'
import { Title, Subtitle, Separator } from '../style'
import { ItemModalData } from '../../../components/ItemModal/ItemModal'
import { ProposalContext, ProposalProps } from '../context/ProposalContext'
import { CostTableItem } from '../../../components/CostModal/CostModal'
import { Cost } from '../../../../domain/Cost'
import { TotalCost } from '../../../../domain/TotalCost'
import { CalculationDataProps } from '../../../components/ChargeTable'

interface Step5Props {
  costData: any
  modal: string
  setCompleted: (completed: any) => void
  setFilled: (filled: any) => void
  specifications: string
  containerItems: ItemModalData[]
  setUndoMessage: React.Dispatch<React.SetStateAction<{
    step3: boolean
    step5origin: boolean
    step5destiny: boolean
    step6: boolean
  }>>
  undoMessage: { step3: boolean, step5origin: boolean, step5destiny: boolean, step6: boolean }
  serviceList: any[]
  containerTypeList: any[]
  calculationData: CalculationDataProps
}

export interface TotalCostTable {
  name: string
  value: {
    buy: number
    sale: number
  }
}

// Listas são mock, serão alteradas posteriormente
export const agentList = ['Agente1', 'Agente2', 'Agente3']

const Step5 = ({ setFilled, costData, modal, specifications, setCompleted, containerItems, setUndoMessage, undoMessage, serviceList, containerTypeList, calculationData }: Step5Props): JSX.Element => {
  const [dataOrigin, setDataOrigin] = useState<CostTableItem[]>([])
  const [dataDestiny, setDataDestiny] = useState<CostTableItem[]>([])
  const [dataTotalCostOrigin, setDataTotalCostOrigin] = useState<TotalCostTable[]>([])
  const [dataTotalCostDestiny, setDataTotalCostDestiny] = useState<TotalCostTable[]>([])

  const { proposal, setProposal }: ProposalProps = useContext(ProposalContext)

  useEffect(() => {
    let actualCostArray = proposal.costs
    actualCostArray = actualCostArray.filter((cost) => cost.costType === 'Tarifa' && cost)
    const newOriginTableData: Cost[] = []
    dataOrigin.forEach((row) => {
      newOriginTableData.push({
        idProposal: 0,
        idService: serviceList.filter((serv) => serv.service === row.description)[0]?.id, // id Descricao
        containerType: specifications === 'fcl' ? containerTypeList.filter((cont) => cont.description === row.selectedContainer)[0]?.id : '', // containerMODAL
        idBusinessPartnerAgent: agentList.indexOf(row.agent) + 1, // data.agent, // AgenteMODALcusto
        costType: 'Origem', // 'Origem''Destino''Tarifa'
        billingType: row.type, // Tipo -MODAL
        valuePurchase: Number(row.buyValue), // valor compra
        valuePurchasePercent: 0, // 0 por enquanto
        valueMinimumPurchase: Number(row.buyMin), // minimo compra
        valueSale: Number(row.saleValue), // valor venda
        valueSalePercent: 0, // 0 por enquanto
        valueMinimumSale: Number(row.saleMin), // minimo venda
        idCurrencyPurchase: row.buyCurrency, // tipo moeda
        idCurrencySale: row.saleCurrency, // tipo moeda
        isPurchase: row.buyValue !== null, // checkbox compra
        isSale: row.saleValue !== null // checkbox venda
      })
    })
    const newDestinyTableData: Cost[] = []
    dataDestiny.forEach((row) => {
      newDestinyTableData.push({
        idProposal: 0,
        idService: serviceList.filter((serv) => serv.service === row.description)[0]?.id, // id Descricao
        containerType: specifications === 'fcl' ? containerTypeList.filter((cont) => cont.description === row.selectedContainer)[0]?.id : '', // containerMODAL
        idBusinessPartnerAgent: 0, // data.agent, // AgenteMODALcusto
        costType: 'Destino', // 'Origem''Destino''Tarifa'
        billingType: row.type, // Tipo -MODAL
        valuePurchase: Number(row.buyValue), // valor compra
        valuePurchasePercent: 0, // 0 por enquanto
        valueMinimumPurchase: Number(row.buyMin), // minimo compra
        valueSale: Number(row.saleValue), // valor venda
        valueSalePercent: 0, // 0 por enquanto
        valueMinimumSale: Number(row.saleMin), // minimo venda
        idCurrencyPurchase: row.buyCurrency, // tipo moeda
        idCurrencySale: row.saleCurrency, // tipo moeda
        isPurchase: Number(row.buyValue) !== 0, // checkbox compra
        isSale: Number(row.saleValue) !== 0 // checkbox venda
      })
    })

    let actualTotalCostArray = proposal.totalCosts
    actualTotalCostArray = actualTotalCostArray.filter((cost) => cost.costType === 'Tarifa' && cost)
    const newTotalCostOrigin: TotalCost[] = []
    dataTotalCostOrigin.forEach((currency) => {
      newTotalCostOrigin.push({
        costType: 'Origem', // 'Origem''Destino''Tarifa'
        idCurrency: currency.name, // id moeda
        valueTotalSale: currency.value.sale, // total sale da moeda
        valueTotalPurchase: currency.value.buy // total compra da moeda
      })
    })
    const newTotalCostDestiny: TotalCost[] = []
    dataTotalCostDestiny.forEach((currency) => {
      newTotalCostDestiny.push({
        costType: 'Destino', // 'Origem''Destino''Tarifa'
        idCurrency: currency.name, // id moeda
        valueTotalSale: currency.value.sale, // total sale da moeda
        valueTotalPurchase: currency.value.buy // total compra da moeda
      })
    })
    const newTotal: TotalCost[] = actualTotalCostArray.concat(newTotalCostOrigin.concat(newTotalCostDestiny))
    setProposal({ ...proposal, totalCosts: newTotal, costs: actualCostArray.concat(newOriginTableData.concat(newDestinyTableData)) })
  }, [dataOrigin, dataDestiny, dataTotalCostDestiny, dataTotalCostOrigin])

  useEffect(() => {
    if (dataOrigin.length > 0 && dataDestiny.length > 0) {
      setCompleted((currentState) => {
        return { ...currentState, step5: true }
      })
      setFilled((currentState) => {
        return { ...currentState, step5: true }
      })
    } else {
      setCompleted((currentState) => {
        return { ...currentState, step5: false }
      })
      setFilled((currentState) => {
        return { ...currentState, step5: false }
      })
    }
  }, [dataDestiny, dataOrigin])

  return (
    <Separator>
      <Title>
        5. {I18n.t('pages.newProposal.step5.title')}
        <Subtitle>{I18n.t('pages.newProposal.step5.subtitle')}</Subtitle>
      </Title>
      <CostTable
        modalTitle={I18n.t('pages.newProposal.step5.originCost')}
        title={I18n.t('pages.newProposal.step5.origin')}
        totalCostLabel={I18n.t('pages.newProposal.step5.totalOrigin')}
        costData={costData}
        modal={modal}
        specifications={specifications}
        tableData={dataOrigin}
        setTableData={setDataOrigin}
        setTotalCostData={setDataTotalCostOrigin}
        containerItems={containerItems}
        undoMessage={undoMessage}
        setUndoMessage={setUndoMessage}
        serviceList={serviceList}
        calculationData={calculationData}
      />
      <CostTable
        modalTitle={I18n.t('pages.newProposal.step5.destinationCost')}
        title={I18n.t('pages.newProposal.step5.destiny')}
        totalCostLabel={I18n.t('pages.newProposal.step5.totalDestiny')}
        costData={costData}
        modal={modal}
        specifications={specifications}
        tableData={dataDestiny}
        setTableData={setDataDestiny}
        setTotalCostData={setDataTotalCostDestiny}
        containerItems={containerItems}
        undoMessage={undoMessage}
        setUndoMessage={setUndoMessage}
        serviceList={serviceList}
        calculationData={calculationData}
      />
    </Separator>
  )
}

export default Step5
