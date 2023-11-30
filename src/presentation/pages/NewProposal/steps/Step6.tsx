import React, { useEffect, useState, useContext, useImperativeHandle } from 'react'
import CostTable from '../../../components/CostTable/CostTable'
import { I18n } from 'react-redux-i18n'
import { Title, Subtitle, Separator } from '../style'
import { ItemModalData } from '../../../components/ItemModal/ItemModal'
import { ProposalContext, ProposalProps } from '../context/ProposalContext'
import { CostTableItem } from '../../../components/CostModal/CostModal'
import { Cost } from '../../../../domain/Cost'
import { TotalCost } from '../../../../domain/TotalCost'
import { CalculationDataProps } from '../../../components/ChargeTable'
import API from '../../../../infrastructure/api'
import { Agents } from './Step2'
import { CostTypes } from '../../../../application/enum/costEnum'
import FormatNumber from '../../../../application/utils/formatNumber'
import { ModalTypes } from '../../../../application/enum/enum'

interface Step5Props {
  costData: any
  modal: string
  setCompleted: (completed: any) => void
  setFilled: (filled: any) => void
  specifications: string
  containerItems: ItemModalData[]
  setUndoMessage: React.Dispatch<React.SetStateAction<{
    step3: boolean
    step6origin: boolean
    step6destiny: boolean
    step5: boolean
  }>>
  undoMessage: { step3: boolean, step6origin: boolean, step6destiny: boolean, step5: boolean }
  serviceList: any[]
  containerTypeList: any[]
  calculationData: CalculationDataProps
  invalidInput: boolean
  updateTableIdsRef: any
  agentList: Agents[]
  setTotalCosts: any
}

export interface TotalCostTable {
  idTotalCost?: number | null
  name: string
  value: {
    buy: number
    sale: number
  }
}

const Step6 = ({
  setFilled,
  costData,
  modal,
  specifications,
  setCompleted,
  containerItems,
  setUndoMessage,
  undoMessage,
  serviceList,
  containerTypeList,
  calculationData,
  invalidInput,
  updateTableIdsRef,
  agentList,
  setTotalCosts
}: Step5Props): JSX.Element => {
  const [dataOrigin, setDataOrigin] = useState<CostTableItem[]>([])
  const [dataDestiny, setDataDestiny] = useState<CostTableItem[]>([])
  const [dataTotalCostOrigin, setDataTotalCostOrigin] = useState<TotalCostTable[]>([])
  const [dataTotalCostDestiny, setDataTotalCostDestiny] = useState<TotalCostTable[]>([])
  const [loadedTotalCostsOrigIds, setLoadedTotalCostsOrigIds] = useState<number[]>([])
  const [loadedTotalCostsDestIds, setLoadedTotalCostsDestIds] = useState<number[]>([])

  const { proposal, setProposal }: ProposalProps = useContext(ProposalContext)

  const [loadedTable, setLoadedTable] = useState(false)

  useImperativeHandle(updateTableIdsRef, () => ({
    updateStep5Ids () {
      let originId = 0
      let destinyId = 0
      if (proposal?.idProposal !== undefined && proposal?.idProposal !== null) {
        const newOriginTable = [...dataOrigin]
        const newTotalCostOrigIds: number[] = []
        const newDestinyTable = [...dataDestiny]
        const newTotalCostDestIds: number[] = []
        for (const totalCost of proposal.totalCosts) {
          if (totalCost.costType === CostTypes.Origin) {
            newTotalCostOrigIds.push(Number(totalCost.idTotalCost))
          } else if (totalCost.costType === CostTypes.Destiny) {
            newTotalCostDestIds.push(Number(totalCost.idTotalCost))
          }
        }
        setLoadedTotalCostsOrigIds(newTotalCostOrigIds)
        setLoadedTotalCostsDestIds(newTotalCostDestIds)
        for (const cost of proposal.costs) {
          if (cost.costType === CostTypes.Origin) {
            newOriginTable[originId].idCost = cost.idCost
            newOriginTable[originId++].idProposal = proposal.idProposal
          } else if (cost.costType === CostTypes.Destiny) {
            newDestinyTable[destinyId].idCost = cost.idCost
            newDestinyTable[destinyId++].idProposal = proposal.idProposal
          }
        }
        setDataOrigin(newOriginTable)
        setDataDestiny(newDestinyTable)
      }
    }
  }))

  useEffect(() => {
    const loadedDataOrigin: CostTableItem[] = []
    const loadedDataDestiny: CostTableItem[] = []

    let id = 0
    if (proposal?.idProposal !== undefined && proposal?.idProposal !== null) {
      void new Promise<void>((resolve) => {
        setTimeout(() => resolve(), 1000)
      }).then(() => {
        const waitAllData = async (): Promise<void> => {
          for (const cost of proposal.costs) {
            const getContainer = new Promise((resolve) => {
              if (specifications === 'fcl') {
                API.getContainer()
                .then((response) => {
                  const getContainer = response.find((container) => container.idContainer === cost.idContainer)
                  if(getContainer) {
                    resolve(String(getContainer.container))
                  } else {
                    resolve("")
                  }
                })
              } else {
                (resolve(null))
              }
            })

            const getService = new Promise((resolve) => {
              API.getService(cost.idService)
                .then((response) => resolve(response?.service))
                .catch((err) => console.log(err))
            })

            void await Promise.all([getContainer, getService]).then((response) => {
              const loadedItem: CostTableItem = {
                idCost: cost.idCost,
                idProposal: proposal.idProposal,
                agent: cost.agent,
                buyCurrency: cost.idCurrencyPurchase === '' ? 'BRL' : String(cost.idCurrencyPurchase),
                buyMin: cost.valueMinimumPurchase === 0 ? null : completeDecimalPlaces(cost.valueMinimumPurchase),
                buyValue: cost.valuePurchase === 0 ? '' : completeDecimalPlaces(cost.valuePurchase),
                description: String(response[1]),
                id: id++,
                saleCurrency: cost.idCurrencySale === '' ? 'BRL' : String(cost.idCurrencySale),
                saleMin: cost.valueMinimumSale === 0 ? null : completeDecimalPlaces(cost.valueMinimumSale),
                saleValue: cost.valueSale === 0 ? '' : completeDecimalPlaces(cost.valueSale),
                selectedContainer: response[0] === null ? null : String(response[0]),
                type: String(cost.billingType),
                buyValueCalculated: null,
                saleValueCalculated: null
              }
              if (cost.costType === CostTypes.Origin) {
                loadedDataOrigin.push(loadedItem)
              } if (cost.costType === CostTypes.Destiny) {
                loadedDataDestiny.push(loadedItem)
              }
            })
          }
          setDataOrigin(loadedDataOrigin)
          setDataDestiny(loadedDataDestiny)
          setLoadedTable(true)
        }
        void waitAllData()

        const loadedTotalCostsOrig: any[] = []
        const loadedTotalCostsDest: any[] = []
        proposal.totalCosts.forEach((totalCost: TotalCost) => {
          if (totalCost.costType === CostTypes.Origin) {
            loadedTotalCostsOrig.push(totalCost.idTotalCost)
          } if (totalCost.costType === CostTypes.Destiny) {
            loadedTotalCostsDest.push(totalCost.idTotalCost)
          }
        })
        setLoadedTotalCostsOrigIds(loadedTotalCostsOrig)
        setLoadedTotalCostsDestIds(loadedTotalCostsDest)
      })
    } else {
      setLoadedTable(true)
    }
  }, [])

  useEffect(() => {
    const newAgent = dataOrigin.map((obj, index) => {
      return {
        ...obj,
        agent: {
          idBusinessPartnerAgent: proposal.agents[index]?.idBusinessPartnerAgent,
          idBusinessPartnerTransportCompany: proposal.agents[index]?.idBusinessPartnerTransportCompany
        }
      }
    })

    setDataOrigin(newAgent)
    setDataDestiny(newAgent)
  }, [proposal.agents])

  useEffect(() => {
    let actualCostArray = proposal.costs
    actualCostArray = actualCostArray.filter((cost) => (cost.costType === CostTypes.Tariff || cost.costType === CostTypes.Freight) && cost)
    const newOriginTableData: Cost[] = []
    dataOrigin.forEach((row) => {
      newOriginTableData.push({
        id: row.idCost === undefined ? null : row.idCost,
        idCost: row.idCost === undefined ? null : row.idCost,
        idProposal: proposal?.idProposal === undefined ? null : proposal?.idProposal,
        idService: serviceList.filter((serv) => serv.service === row.description)[0]?.idService, // id Descricao
        idContainer: specifications === 'fcl' ? containerTypeList.filter((cont) => cont.container === row.selectedContainer)[0]?.idContainer : null, // containerMODAL
        agent: row.agent,
        costType: CostTypes.Origin, // 'Origem''Destino''Tarifa'
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
        isSale: row.saleValue !== null, // checkbox venda
        valueSaleTotal: FormatNumber.convertNumberToDecimal(Number(row.saleValueCalculated)),
        valuePurchaseTotal: FormatNumber.convertNumberToDecimal(Number(row.buyValueCalculated))
      })
    })
    const newDestinyTableData: Cost[] = []
    dataDestiny.forEach((row) => {
      newDestinyTableData.push({
        id: row.idCost === undefined ? null : row.idCost,
        idCost: row.idCost === undefined ? null : row.idCost,
        idProposal: proposal?.idProposal === undefined ? null : proposal?.idProposal,
        idService: serviceList.filter((serv) => serv.service === row.description)[0]?.idService, // id Descricao
        idContainer: specifications === 'fcl' ? containerTypeList.filter((cont) => cont.container === row.selectedContainer)[0]?.idContainer : null, // containerMODAL
        agent: row.agent,
        costType: CostTypes.Destiny, // 'Origem''Destino''Tarifa'
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
        isSale: Number(row.saleValue) !== 0, // checkbox venda
        valueSaleTotal: FormatNumber.convertNumberToDecimal(Number(row.saleValueCalculated)),
        valuePurchaseTotal: FormatNumber.convertNumberToDecimal(Number(row.buyValueCalculated))
      })
    })

    let actualTotalCostArray = proposal.totalCosts
    actualTotalCostArray = actualTotalCostArray.filter((cost) => (cost?.costType === CostTypes.Tariff || cost?.costType === CostTypes.Freight) && cost)
    const newTotalCostOrigin: TotalCost[] = []
    dataTotalCostOrigin.forEach((currency, index) => {
      if (currency.value.buy !== 0 || currency.value.sale !== 0) {
        newTotalCostOrigin.push({
          idTotalCost: loadedTotalCostsOrigIds[index] === undefined ? null : loadedTotalCostsOrigIds[index],
          idProposal: loadedTotalCostsOrigIds[index] === undefined ? null : proposal?.idProposal,
          costType: CostTypes.Origin, // 'Origem''Destino''Tarifa'
          idCurrency: currency.name, // id moeda
          valueTotalSale: FormatNumber.convertNumberToDecimal(currency.value.sale), // total sale da moeda
          valueTotalPurchase: FormatNumber.convertNumberToDecimal(currency.value.buy) // total compra da moeda
        })
      }
    })
    const newTotalCostDestiny: TotalCost[] = []
    dataTotalCostDestiny.forEach((currency, index) => {
      if (currency.value.buy !== 0 || currency.value.sale !== 0) {
        newTotalCostDestiny.push({
          idTotalCost: loadedTotalCostsDestIds[index] === undefined ? null : loadedTotalCostsDestIds[index],
          idProposal: loadedTotalCostsDestIds[index] === undefined ? null : proposal?.idProposal,
          costType: CostTypes.Destiny, // 'Origem''Destino''Tarifa'
          idCurrency: currency.name, // id moeda
          valueTotalSale: FormatNumber.convertNumberToDecimal(currency.value.sale), // total sale da moeda
          valueTotalPurchase: FormatNumber.convertNumberToDecimal(currency.value.buy) // total compra da moeda
        })
      }
    })
    const newTotal: TotalCost[] = actualTotalCostArray.concat(newTotalCostOrigin.concat(newTotalCostDestiny))
    setProposal({ ...proposal, totalCosts: newTotal, costs: actualCostArray.concat(newOriginTableData.concat(newDestinyTableData)) })
  }, [dataOrigin, dataDestiny, dataTotalCostDestiny, dataTotalCostOrigin, setDataOrigin, setDataDestiny])

  useEffect(() => {
    if (dataOrigin.length > 0 && dataDestiny.length > 0) {
      setCompleted((currentState) => {
        return { ...currentState, step6: true }
      })
      setFilled((currentState) => {
        return { ...currentState, step6: true }
      })
    } else {
      setCompleted((currentState) => {
        return { ...currentState, step6: modal === ModalTypes.Land }
      })
      setFilled((currentState) => {
        return { ...currentState, step6: false }
      })
    }
  }, [dataDestiny, dataOrigin])

  useEffect(() => {
    setTotalCosts([...dataTotalCostDestiny, ...dataTotalCostOrigin])
  }, [dataTotalCostDestiny, dataTotalCostOrigin])

  const completeDecimalPlaces = (num: number | null): string | null => {
    if (num === null) return null
    return num.toFixed(2)
  }

  return (
    <Separator>
      <Title>
        6. {I18n.t('pages.newProposal.step6.title')}
        <Subtitle>{I18n.t('pages.newProposal.step6.subtitle')}</Subtitle>
      </Title>
      {loadedTable && <CostTable
        agentList={agentList}
        modalTitle={I18n.t('pages.newProposal.step6.originCost')}
        title={I18n.t('pages.newProposal.step6.origin')}
        totalCostLabel={I18n.t('pages.newProposal.step6.totalOrigin')}
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
        errorMessage={invalidInput && modal !== ModalTypes.Land ? I18n.t('pages.newProposal.step6.errorOrigin') : ''}
      />
      }
      {loadedTable && <CostTable
        agentList={agentList}
        modalTitle={I18n.t('pages.newProposal.step6.destinationCost')}
        title={I18n.t('pages.newProposal.step6.destiny')}
        totalCostLabel={I18n.t('pages.newProposal.step6.totalDestiny')}
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
        errorMessage={invalidInput && modal !== ModalTypes.Land ? I18n.t('pages.newProposal.step6.errorDestiny') : ''}
      />
      }
    </Separator>
  )
}

export default Step6
