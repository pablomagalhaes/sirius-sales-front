import React, { useContext, useEffect, useImperativeHandle, useState, Fragment } from 'react'
import { I18n } from 'react-redux-i18n'
import { MessageContainer, Separator, Subtitle, Title } from '../style'
import FareModal, {
  FareModalData,
  initialState
} from '../../../components/FareModal/FareModal'
import {
  Box,
  FormControl,
  FormLabel,
  Grid,
  InputAdornment,
  withTheme
} from '@material-ui/core'
import { ItemModalData } from '../../../components/ItemModal/ItemModal'
import { ButtonWrapper, HeightDiv, NumberInput, StyledPaper, LineSeparator, ErrorText } from './StepsStyles'
import { Button, Messages } from 'fiorde-fe-components'
import { ProposalContext, ProposalProps } from '../context/ProposalContext'
import { Cost } from '../../../../domain/Cost'
import { TotalCost } from '../../../../domain/TotalCost'
import API from '../../../../infrastructure/api'
import Autocomplete from '@material-ui/lab/Autocomplete'
import ControlledInput from '../../../components/ControlledInput'
import FormatNumber from '../../../../application/utils/formatNumber'
import SurchargeTable from '../../../components/SurchargeTable/index'
import TotalSurcharge from '../../../components/TotalSurcharge'
import { RedColorSpan } from '../../../components/StyledComponents/modalStyles'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown'
import { CalculationDataProps } from '../../../components/ChargeTable'

interface Step6Props {
  totalCosts: any
  containerItems: ItemModalData[]
  costData: any
  modal: string
  setCompleted: (completed: any) => void
  setFilled: (filled: any) => void
  specifications: string
  setUndoMessage: React.Dispatch<
  React.SetStateAction<{
    step3: boolean
    step5origin: boolean
    step5destiny: boolean
    step6: boolean
  }>
  >
  undoMessage: {
    step3: boolean
    step5origin: boolean
    step5destiny: boolean
    step6: boolean
  }
  serviceList: any[]
  containerTypeList: any[]
  theme: any
  calculationData: CalculationDataProps
  invalidInput: boolean
  updateTableIdsRef: any
  cw: number
  cwSale: number
}

const enum ID_CARGO_CONTRACTING_TYPE {
  FCL = 1,
  LCL = 2,
  BREAK_BULK = 3,
  RO_RO = 4
}

const FclCargoContractingType = ID_CARGO_CONTRACTING_TYPE.FCL
const ContractingTypeWithoutFcl = [
  ID_CARGO_CONTRACTING_TYPE.LCL,
  ID_CARGO_CONTRACTING_TYPE.BREAK_BULK,
  ID_CARGO_CONTRACTING_TYPE.RO_RO
]

const decimalToString = (value: number | null | undefined): string => {
  if (value !== null && value !== undefined) { return String(value?.toFixed(2)).replace('.', ',') }
  return ''
}

const makeTableData = (costs): any => {
  const getTarifas = costs.filter(cost => cost.costType === 'Tarifa')
  return getTarifas.map(cost => ({
    idCost: cost.idCost,
    selectedContainer: cost.idContainerType,
    agent: cost.agent,
    type: cost.billingType,
    saleCurrency: cost.idCurrencySale,
    saleValue: decimalToString(cost.valueSale),
    minimumValue: decimalToString(cost.valueMinimumSale)
  }))
}

const Step6 = ({
  setFilled,
  costData,
  modal,
  setCompleted,
  specifications,
  containerItems,
  setUndoMessage,
  undoMessage,
  serviceList,
  containerTypeList,
  theme,
  calculationData,
  invalidInput,
  updateTableIdsRef,
  cw,
  cwSale,
  totalCosts
}: Step6Props): JSX.Element => {
  const [open, setOpen] = useState(false)
  const [copyTable, setCopyTable] = useState<FareModalData[]>([])
  const [chargeData, setChargeData] = useState<FareModalData>(initialState)
  const [currencyList, setCurrencyList] = useState<any[]>([])
  const { proposal, setProposal }: ProposalProps = useContext(ProposalContext)
  const [dataTotalCost, setDataTotalCost] = useState<any[]>([])
  const [loadedTotalCostsIds, setLoadedTotalCostsIds] = useState<number[]>([])
  const [agentList, setAgentsList] = useState<any[]>([])
  const [businessPartner, setBusinessPartner] = useState<any[]>([])
  const [totalCharge, setTotalCharge] = useState<number>(0)

  const handleOpen = (): void => setOpen(true)
  const handleClose = (): void => {
    setOpen(false)
    setChargeData(initialState)
  }

  const currencyArray = new Map()

  // const [tableData, setTableData] = useState<FareModalData[]>([])
  const [tableData, setTableData] = useState<FareModalData[]>(makeTableData(proposal.costs))
  const [data, setData] = useState<any[]>(
    proposal.agents.map(newAgent => ({
      idCost: proposal.costs.find((cost): any => {
        if (cost.costType === 'Frete') {
          if (cost?.agent?.idBusinessPartnerAgent === newAgent?.idBusinessPartnerAgent) {
            return true
          }
        }
        return false
      })?.idCost,
      company: '',
      agent: {
        id: newAgent.id,
        idBusinessPartnerAgent: newAgent.idBusinessPartnerAgent,
        idBusinessPartnerTransportCompany: newAgent.idBusinessPartnerTransportCompany,
        proposalId: null
      },
      currencySale: '',
      currencyPurchase: proposal.costs.find((cost): any => {
        if (cost.costType === 'Frete') {
          if (cost?.agent?.idBusinessPartnerAgent === newAgent?.idBusinessPartnerAgent) {
            return true
          }
        }
        return false
      })?.idCurrencyPurchase,
      valueSale: '',
      valuePurchase: decimalToString(proposal.costs.find((cost): any => {
        if (cost.costType === 'Frete') {
          if (cost?.agent?.idBusinessPartnerAgent === newAgent?.idBusinessPartnerAgent) {
            return true
          }
        }
        return false
      })?.valuePurchase),
      tableData: []
    }))
  )
  const [dataContainer, setDataContainer] = useState(proposal.cargo[0].cargoVolumes.map((item, index) => ({
    idCost: proposal.costs.filter(cost => cost.costType === 'Frete')[index]?.idCost ?? null,
    idContainerType: item.idContainerType,
    currencySale: proposal.costs.filter(cost => cost.costType === 'Frete')[index]?.idCurrencySale ?? '',
    currencyPurchase: proposal.costs.filter(cost => cost.costType === 'Frete')[index]?.idCurrencyPurchase ?? '',
    valueSale: decimalToString(proposal.costs.filter(cost => cost.costType === 'Frete')[index]?.valueSale),
    valuePurchase: decimalToString(proposal.costs.filter(cost => cost.costType === 'Frete')[index]?.valuePurchase)
  })))

  const [dataSales, setDataSales] = useState<any>({
    idCost: proposal.costs.find(cost => cost.costType === 'Frete' && (cost.agent === null || cost.agent.idBusinessPartnerAgent === null))?.idCost ?? null,
    currencySale: String(proposal.costs.find(cost => cost.costType === 'Frete' && (cost.agent === null || cost.agent.idBusinessPartnerAgent === null))?.idCurrencySale ?? ''),
    valueSale: String(proposal.costs.find(cost => cost.costType === 'Frete' && (cost.agent === null || cost.agent.idBusinessPartnerAgent === null))?.valueSale?.toFixed(2) ?? '')
  })

  useEffect(() => {
    const currentAgentsId = data.map(currentAgent => currentAgent.agent.idBusinessPartnerAgent)
    const currentAgentsTransportCompanyId = data.map(currentAgent => currentAgent.agent.idBusinessPartnerTransportCompany)
    const getNewAgents = proposal.agents.filter(agent => !currentAgentsId.includes(agent.idBusinessPartnerAgent) && !currentAgentsTransportCompanyId.includes(agent.idBusinessPartnerTransportCompany))
    const newDataWithNewAgents = getNewAgents.map(newAgent => ({
      company: '',
      agent: {
        idBusinessPartnerAgent: newAgent.idBusinessPartnerAgent,
        idBusinessPartnerTransportCompany: newAgent.idBusinessPartnerTransportCompany
      },
      currencySale: '',
      currencyPurchase: '',
      valueSale: '',
      valuePurchase: '',
      tableData: []
    }))
    const unionAgents = [...data, ...newDataWithNewAgents]
    const getAllAgents = unionAgents.map(unionAgent => unionAgent.agent.idBusinessPartnerAgent)
    const getOnlyAgentsExists = proposal.agents.filter(currentProposalAgent => getAllAgents.includes(currentProposalAgent.idBusinessPartnerAgent)).map(agent => agent.idBusinessPartnerAgent)
    const getOnlyDataExists = unionAgents.filter(unionAgent => getOnlyAgentsExists.includes(unionAgent.agent.idBusinessPartnerAgent))
    setData(getOnlyDataExists)

    const getidBusinessPartnerAgents = proposal.agents.map(agent => agent.idBusinessPartnerAgent)
    const newTableData = tableData.filter(row => getidBusinessPartnerAgents.includes(row?.agent?.idBusinessPartnerAgent))
    setTableData(newTableData)
  }, [proposal.agents])

  useEffect(() => {
    const currentContainer = dataContainer.map(currentContainer => currentContainer.idContainerType)
    const getNewCargos = proposal.cargo[0].cargoVolumes.filter(cargo => !currentContainer.includes(cargo.idContainerType))
    const newDataWithNewCargos = getNewCargos.map(newCargo => ({
      idCost: null,
      idContainerType: newCargo.idContainerType,
      currencySale: '',
      currencyPurchase: '',
      valueSale: '',
      valuePurchase: ''
    }))
    const unionCargos = [...dataContainer, ...newDataWithNewCargos]
    const getAllCargos = unionCargos.map(unionAgent => unionAgent.idContainerType)
    const getOnlyCargosExists = proposal.cargo[0].cargoVolumes.filter(currentProsalCargoVolumes => getAllCargos.includes(currentProsalCargoVolumes.idContainerType)).map(cargo => cargo.idContainerType)
    const getOnlyDataExists = unionCargos.filter(unionAgent => getOnlyCargosExists.includes(unionAgent.idContainerType))
    setDataContainer(getOnlyDataExists)
  }, [proposal.cargo[0]])

  useEffect(() => {
    loadAgentsList()
    if (proposal.idTransport !== '') void loadBusinessPartner()
  }, [proposal.idTransport])

  const loadAgentsList = (): void => {
    API.getAgents()
      .then((response) => setAgentsList(response))
      .catch((err) => console.log(err))
  }

  const loadBusinessPartner = async (): Promise<void> => {
    if (proposal.idTransport === 'SEA') {
      await getBusinessPartnerSea()
    } else {
      const response = await API.getBusinessPartnerByType(getBusinessPartnerType())
      setBusinessPartner(response)
    }
  }

  const getBusinessPartnerSea = async (): Promise<void> => {
    const responseShipOwner = await API.getBusinessPartnerByType('ARMADOR')
    const responseColoader = await API.getBusinessPartnerByType('COLOADER')
    if (responseShipOwner !== undefined && responseColoader !== undefined) {
      setBusinessPartner([...responseColoader, ...responseShipOwner])
    }
  }

  const getBusinessPartnerType = (): string => {
    switch (proposal.idTransport) {
      case 'AIR':
        return 'CIA. AEREA'
      case 'LAND':
        return 'TRANS. INTERNACIONAL'
    }
    return ''
  }

  const getServiceType = (): any => {
    let service

    switch (proposal.idTransport) {
      case 'AIR':
        service = 'FRETE AÉREO'
        break
      case 'LAND':
        service = 'FRETE RODOVIÁRIO INTERNACIONAL'
        break
      case 'SEA':
        service = 'FRETE MARITIMO'
        break
    }

    return serviceList.filter((serv) => serv.service === service)[0]?.idService
  }

  const getFreightCost = (): Cost[] => {
    const freightCostArrayNew: Cost[] = []
    const resultado = proposal.costs.filter(cost => cost.costType !== 'Frete')
    proposal.costs = resultado

    if (proposal.idTransport === 'AIR' || proposal.idTransport === 'LAND' || (proposal.idTransport === 'SEA' && ContractingTypeWithoutFcl.includes(proposal.cargo[0].idCargoContractingType))) {
      data.forEach((item): void => {
        const freightCostNew = {
          id: item?.idCost,
          idCost: item?.idCost,
          idProposal: proposal.idProposal,
          idService: getServiceType(),
          billingType: '',
          idContainerType: null,
          valuePurchasePercent: null,
          valueMinimumPurchase: null,
          valueSalePercent: 0,
          valueMinimumSale: null,
          agent: {
            id: item.agent.id,
            idBusinessPartnerAgent: item.agent.idBusinessPartnerAgent,
            idBusinessPartnerTransportCompany: item.agent.idBusinessPartnerTransportCompany,
            proposalId: item.agent.proposalId
          },
          costType: 'Frete',
          idCurrencySale: item.currencySale,
          idCurrencyPurchase: item.currencyPurchase,
          valueSale: Number(String(item.valueSale).replace(',', '.')),
          valuePurchase: Number(String(item.valuePurchase).replace(',', '.')),
          isPurchase: false,
          isSale: true
        }
        freightCostArrayNew.push(freightCostNew)
      })
      if (proposal.idTransport === 'AIR' || proposal.idTransport === 'LAND' || (proposal.idTransport === 'SEA' && ContractingTypeWithoutFcl.includes(proposal.cargo[0].idCargoContractingType))) {
        const freightCostSale = {
          id: dataSales.idCost,
          idCost: dataSales.idCost,
          idProposal: proposal.idProposal,
          idService: getServiceType(),
          billingType: '',
          idContainerType: null,
          valuePurchasePercent: null,
          valueMinimumPurchase: null,
          valueSalePercent: 0,
          valueMinimumSale: null,
          agent: {
            id: null,
            idBusinessPartnerAgent: null,
            idBusinessPartnerTransportCompany: null,
            proposalId: null
          },
          costType: 'Frete',
          idCurrencySale: dataSales.currencySale,
          idCurrencyPurchase: dataSales.currencySale,
          valueSale: Number(dataSales.valueSale.replace(',', '.')),
          valuePurchase: Number(dataSales.valueSale.replace(',', '.')),
          isPurchase: false,
          isSale: true
        }
        freightCostArrayNew.push(freightCostSale)
      }
    }

    if ((proposal.idTransport === 'SEA' && proposal.cargo[0].idCargoContractingType === FclCargoContractingType)) {
      dataContainer.forEach((item): void => {
        const freightCostNew = {
          id: item?.idCost,
          idCost: item?.idCost,
          idProposal: proposal?.idProposal === undefined ? null : proposal?.idProposal,
          idService: getServiceType(),
          billingType: '',
          idContainerType: null,
          valuePurchasePercent: null,
          valueMinimumPurchase: null,
          valueSalePercent: 0,
          valueMinimumSale: null,
          agent: {
            id: proposal.agents[0].id,
            idBusinessPartnerAgent: proposal.agents[0].idBusinessPartnerAgent,
            idBusinessPartnerTransportCompany: proposal.agents[0].idBusinessPartnerTransportCompany,
            proposalId: null
          },
          costType: 'Frete',
          idCurrencySale: item.currencySale,
          idCurrencyPurchase: item.currencyPurchase,
          valueSale: Number(String(item.valueSale).replace(',', '.')),
          valuePurchase: Number(String(item.valuePurchase).replace(',', '.')),
          isPurchase: false,
          isSale: true
        }
        freightCostArrayNew.push(freightCostNew)
      })
    }

    return freightCostArrayNew
  }

  useImperativeHandle(updateTableIdsRef, () => ({
    updateStep6Ids () {
      let tableDataId = 0
      if (proposal?.idProposal !== undefined && proposal?.idProposal !== null) {
        const newTableData = [...tableData]
        const newLoadedTotalCostsIds: number[] = []
        for (const cost of proposal.costs) {
          if (cost.costType === 'Tarifa') {
            newTableData[tableDataId].idCost = cost.idCost
            newTableData[tableDataId++].idProposal = proposal.idProposal
          }
        }
        setTableData(newTableData)
        for (const totalCost of proposal.totalCosts) {
          if (totalCost.costType === 'Tarifa') {
            newLoadedTotalCostsIds.push(Number(totalCost.id))
          }
          setLoadedTotalCostsIds(newLoadedTotalCostsIds)
        }
      }
    }
  }))

  useEffect(() => {
    setTableData([])
    setCopyTable([])
    setChargeData(initialState)
    setUndoMessage({
      step3: false,
      step5origin: false,
      step5destiny: false,
      step6: false
    })
  }, [modal])

  useEffect(() => {
    const loadedData: FareModalData[] = []

    let id = 0
    if (proposal.idProposal !== undefined && proposal.idProposal !== null) {
      void new Promise<void>((resolve) => {
        setTimeout(() => resolve(), 1000)
      }).then(() => {
        const waitAllData = async (): Promise<void> => {
          for (const cost of proposal.costs) {
            const getContainer: any = new Promise((resolve) => {
              if (specifications === 'fcl' && cost.idContainerType !== null) {
                API.getContainerType(cost.idContainerType)
                  .then((response) => resolve(String(response?.description)))
                  .catch((err) => console.log(err))
              } else {
                resolve(null)
              }
            })

            const getService = new Promise((resolve) => {
              API.getService(cost.idService)
                .then((response) => resolve(response?.service))
                .catch((err) => console.log(err))
            })

            const getDescription = await getContainer

            const getTotalItemValue = new Promise((resolve) => {
              if (cost.costType === 'Tarifa') {
                const indexContainer = containerItems.findIndex(
                  (container) => getDescription === container.type
                )
                const totalCostCalculationData = {
                  costType: cost.billingType,
                  quantityContainer:
                    specifications === 'fcl'
                      ? Number(containerItems[indexContainer]?.amount)
                      : 0,
                  valueGrossWeight: isNaN(Number(calculationData?.weight))
                    ? 0
                    : calculationData?.weight,
                  valueCubage: isNaN(Number(calculationData?.cubage))
                    ? 0
                    : calculationData?.cubage,
                  valueWeightCubed: isNaN(Number(calculationData?.cubageWeight))
                    ? 0
                    : calculationData?.cubageWeight,
                  valuePurchase: 0,
                  valueSale: Number(cost.valueSale),
                  idCurrencyPurchase: cost.idCurrencyPurchase,
                  idCurrencySale: cost.idCurrencySale,
                  valuePurchaseCW:
                    cost.billingType === 'CW'
                      ? Number(proposal.cargo[0].vlCwPurchase)
                      : null,
                  valueSaleCW:
                    cost.billingType === 'CW'
                      ? Number(proposal.cargo[0].vlCwSale)
                      : null
                }
                API.postTotalCalculation(totalCostCalculationData)
                  .then((response) => {
                    resolve(Number(response?.valueSale))
                  })
                  .catch((err) => {
                    resolve('')
                    console.log(err)
                  })
              } else {
                resolve('')
              }
            })

            void (await Promise.all([
              getContainer,
              getService,
              getTotalItemValue
            ]).then((response) => {
              const loadedItem: FareModalData = {
                idCost: cost.idCost,
                idProposal: proposal.idProposal,
                id: id++,
                saleCurrency:
                  cost.idCurrencySale === ''
                    ? 'BRL'
                    : String(cost.idCurrencySale),
                saleValue:
                  cost.valueSale === 0
                    ? ''
                    : completeDecimalPlaces(cost.valueSale),
                minimumValue:
                  cost.valueMinimumSale === 0
                    ? ''
                    : completeDecimalPlaces(cost.valueMinimumSale),
                expense: String(response[1]),
                selectedContainer:
                  response[0] === null ? null : String(response[0]),
                type: String(cost.billingType),
                totalItem:
                  cost.valueSale === 0
                    ? ''
                    : Number(response[2]).toFixed(2).replace('.', ',')
              }
              if (proposal.idTransport === 'AIR' || proposal.idTransport === 'LAND' || (proposal.idTransport === 'SEA' && ContractingTypeWithoutFcl.includes(proposal.cargo[0].idCargoContractingType))) {
                if (cost.costType === 'Tarifa') {
                  const getAgentByTarifaAgent = proposal.agents.find(agent => agent.idBusinessPartnerAgent === cost.agent.idBusinessPartnerAgent)
                  loadedItem.agent = getAgentByTarifaAgent // novo agente vinculado ao custo
                }
              }
              if (cost.costType === 'Tarifa') {
                loadedData.push(loadedItem)
              }
            }))
          }
          setTableData(loadedData)
        }
        void waitAllData()

        const loadedTotalCosts: any[] = []
        proposal.totalCosts.forEach((totalCost: TotalCost) => {
          if (totalCost.costType === 'Tarifa') {
            loadedTotalCosts.push(totalCost.id)
          }
        })
        setLoadedTotalCostsIds(loadedTotalCosts)
        setTableData(loadedData)
      })
    }
  }, [])

  useEffect(() => {
    let actualCostArray = proposal.costs
    actualCostArray = actualCostArray.filter(
      (cost) => cost.costType !== 'Tarifa' && cost && cost.costType !== 'Frete'
    )
    const newFareItems: Cost[] = []

    tableData.forEach((row) => {
      newFareItems.push({
        id: row.idCost === undefined ? null : row.idCost,
        idCost: row.idCost === undefined ? null : row.idCost,
        idProposal:
          proposal?.idProposal === undefined ? null : proposal?.idProposal,
        idService: serviceList.filter((serv) => serv.service === row.expense)[0]
          ?.idService, // id Descricao
        idContainerType:
          specifications === 'fcl'
            ? containerTypeList.filter(
              (cont) => cont.description === row.selectedContainer
            )[0]?.id
            : null, // containerMODAL
        agent: {
          id: row.agent?.id,
          idBusinessPartnerAgent: row.agent?.idBusinessPartnerAgent,
          idBusinessPartnerTransportCompany: row.agent?.idBusinessPartnerTransportCompany,
          proposalId: row.agent?.proposalId ?? null
        },
        costType: 'Tarifa', // 'Origem''Destino''Tarifa'
        billingType: row.type, // Tipo -MODAL
        valuePurchase: null, // valor compra
        valuePurchasePercent: 0, // 0 por enquanto
        valueMinimumPurchase: null, // minimo compra
        valueSale: Number(row.saleValue.replace(',', '.')), // valor venda
        valueSalePercent: 0, // 0 por enquanto
        valueMinimumSale: Number(row.minimumValue.replace(',', '.')), // minimo venda
        idCurrencyPurchase: 'nul', // tipo moeda NOTNULL VARCHAR(3)
        idCurrencySale: row.saleCurrency, // tipo moeda
        isPurchase: false, // checkbox compra
        isSale: row.saleValue !== null // checkbox venda
      })
    })

    let actualTotalCostArray = proposal.totalCosts
    actualTotalCostArray = actualTotalCostArray.filter(
      (cost) => cost.costType !== 'Tarifa' && cost
    )
    const newTotalCostFare: TotalCost[] = []
    dataTotalCost.forEach((currency, index) => {
      newTotalCostFare.push({
        id:
          loadedTotalCostsIds[index] === undefined
            ? null
            : loadedTotalCostsIds[index],
        idProposal:
          proposal?.idProposal === undefined ? null : proposal?.idProposal,
        costType: 'Tarifa', // 'Origem''Destino''Tarifa'
        idCurrency: currency.name, // id moeda
        valueTotalSale: currency.value, // total sale da moeda
        valueTotalPurchase: 0 // total compra da moeda
      })
    })
    newFareItems.push(...getFreightCost())

    setProposal({
      ...proposal,
      agents: proposal.agents,
      totalCosts: actualTotalCostArray.concat(newTotalCostFare),
      costs: actualCostArray.concat(newFareItems)
    })
  }, [data, dataTotalCost, dataContainer])

  useEffect(() => {
    if (proposal.idTransport === 'AIR' || proposal.idTransport === 'LAND' || (proposal.idTransport === 'SEA' && ContractingTypeWithoutFcl.includes(proposal.cargo[0].idCargoContractingType))) {
      if (data.every(d => d.currencyPurchase !== '') && data.every(d => d.valuePurchase !== '')) {
        setCompleted((currentState) => {
          return { ...currentState, step6: true }
        })
        setFilled((currentState) => {
          return { ...currentState, step6: true }
        })
      } else {
        setFilled((currentState) => {
          return { ...currentState, step6: false }
        })
        setCompleted((currentState) => {
          return { ...currentState, step6: false }
        })
      }
    }

    if (proposal.idTransport === 'SEA' && proposal.cargo[0].idCargoContractingType === FclCargoContractingType) {
      if (dataContainer.every(d => d.currencyPurchase !== '') && dataContainer.every(d => d.valuePurchase !== '')) {
        setCompleted((currentState) => {
          return { ...currentState, step6: true }
        })
        setFilled((currentState) => {
          return { ...currentState, step6: true }
        })
      } else {
        setFilled((currentState) => {
          return { ...currentState, step6: false }
        })
        setCompleted((currentState) => {
          return { ...currentState, step6: false }
        })
      }
    }

    setDataTotalCost(
      Array.from(currencyArray, ([name, value]) => ({ name, value }))
    )
  }, [tableData, data, dataContainer, tableData.length])

  useEffect(() => {
    const newTableData: FareModalData[] = []
    const waitAllData = async (): Promise<void> => {
      for (const item of tableData) {
        void (await new Promise((resolve) => {
          const totalCostCalculationData = getTotalCalculationData(item)
          API.postTotalCalculation(totalCostCalculationData)
            .then((response) => {
              item.totalItem = Number(response?.valueSale)
                ?.toFixed(2)
                .replace('.', ',')
              resolve(newTableData.push(item))
            })
            .catch((err) => {
              resolve('')
              console.log(err)
            })
        }))
      }
      setTableData(newTableData)
    }
    void waitAllData()
  }, [containerItems, calculationData, proposal.cargo[0]])

  useEffect(() => {
    let total = 0
    const getSalesFreight = proposal.costs
      .filter(cost => cost.costType === 'Frete' && cost.valueSale !== null && cost.valueSale > 0)
    const salesData = getSalesFreight.map(cost => ({
      idCost: cost.idCost,
      selectedContainer: cost.idContainerType,
      agent: cost.agent,
      type: 'TON',
      saleCurrency: cost.idCurrencySale,
      saleValue: decimalToString(cost.valueSale),
      minimumValue: decimalToString(cost.valueMinimumSale)
    }))
    const waitAllData = async (): Promise<void> => {
      for (const item of salesData) {
        void (await new Promise((resolve) => {
          const totalCostCalculationData = getTotalCalculationData(item)
          API.postTotalCalculation(totalCostCalculationData)
            .then((response) => {
              resolve(total = response.valueSale)
            })
            .catch((err) => {
              resolve('')
              console.log(err)
            })
        }))
      }
      setTotalCharge(total)
    }
    void waitAllData()
  }, [dataSales, proposal.costs])

  useEffect(() => {
    void (async function () {
      await API.getCurrencies()
        .then((response) => setCurrencyList(response))
        .catch((err) => console.log(err))
    })()
  }, [])

  const getTotalCalculationData = (item): any => {
    const indexContainer = containerItems.findIndex(
      (container) => item.selectedContainer === container.type
    )
    return {
      costType: item.type,
      quantityContainer:
        specifications === 'fcl'
          ? Number(containerItems[indexContainer].amount)
          : 0,
      valueGrossWeight: isNaN(Number(calculationData?.weight))
        ? 0
        : calculationData?.weight,
      valueCubage: isNaN(Number(calculationData?.cubage))
        ? 0
        : calculationData?.cubage,
      valueWeightCubed: isNaN(Number(calculationData?.cubageWeight))
        ? 0
        : calculationData?.cubageWeight,
      valuePurchase: 0,
      valueSale: Number(item.saleValue.replace(',', '.')),
      idCurrencyPurchase: '',
      idCurrencySale: item.saleCurrency,
      valuePurchaseCW:
        item.type === 'CW' ? Number(proposal.cargo[0].vlCwPurchase) : null,
      valueSaleCW: item.type === 'CW' ? Number(proposal.cargo[0].vlCwSale) : null
    }
  }

  const handleAdd = (item: FareModalData): void => {
    setUndoMessage({
      step3: false,
      step5origin: false,
      step5destiny: false,
      step6: false
    })

    const totalCostCalculationData = getTotalCalculationData(item)

    void (async function () {
      await API.postTotalCalculation(totalCostCalculationData)
        .then((response) => {
          item.totalItem = Number(response.valueSale)
            .toFixed(2)
            .replace('.', ',')
          item.saleCurrency = response.idCurrencySale

          if (item.id !== null) {
            const editData = [...tableData]
            const index = editData.findIndex((i) => i.id === item.id)
            editData[index] = item
            setTableData(editData)
          } else {
            const lastIndex = tableData?.length - 1
            const newItem = {
              ...item,
              id:
                tableData.length === 0 ? 0 : Number(tableData[lastIndex].id) + 1
            }
            setTableData([...tableData, newItem])
          }
          setChargeData(initialState)
        })
        .catch((err) => console.log(err))
    })()
  }

  const removeClickHandler = (id: number | null): void => {
    setCopyTable(tableData)
    setTableData((tableData) => {
      return tableData.filter((data) => data.id !== id)
    })
    setUndoMessage({
      step3: false,
      step5origin: false,
      step5destiny: false,
      step6: true
    })
  }

  const editClickHandler = (tableData: FareModalData): void => {
    setChargeData(tableData)
    handleOpen()
  }

  const selectTypeModal = (): string => {
    switch (modal) {
      case 'AIR':
        return String(I18n.t('pages.newProposal.step6.companyAir'))
      case 'SEA':
        return String(I18n.t('pages.newProposal.step6.companySea'))
      case 'LAND':
        return String(I18n.t('pages.newProposal.step6.companyLand'))
    }
    return String(I18n.t('pages.newProposal.step6.companySea'))
  }

  const completeDecimalPlaces = (num: number | null): string => {
    if (num === null) return '0'
    return num.toFixed(2).replace('.', ',')
  }

  const getSumTotalItem = (): string => {
    let totalSum: number = 0
    for (let index = 0; index < tableData.length; index++) {
      const item = tableData[index]
      const MinValue = Number(item.minimumValue?.replace(',', '.'))
      const SaleValue = Number(item.saleValue?.replace(',', '.'))
      const TotalItem = Number(item.totalItem?.replace(',', '.'))

      if (item.type === 'FIXO' || item.type === 'BL') {
        if (MinValue > SaleValue) {
          totalSum = totalSum + Number(item.minimumValue?.replace(',', '.'))
        }
        if (MinValue <= SaleValue) {
          totalSum = totalSum + Number(item.saleValue?.replace(',', '.'))
        }
      }

      if (item.type === 'KG' || item.type === 'CW' || item.type === 'CONTAINER') {
        if (MinValue > TotalItem) {
          totalSum = totalSum + Number(item.minimumValue?.replace(',', '.'))
        }
        if (MinValue <= TotalItem) {
          totalSum = totalSum + Number(item.totalItem?.replace(',', '.'))
        }
      }
    }
    return totalSum.toFixed(2).replace('.', ',')
  }

  function disabledAddFareButton (): boolean {
    if (proposal.idTransport === 'AIR' || proposal.idTransport === 'LAND' || (proposal.idTransport === 'SEA' && ContractingTypeWithoutFcl.includes(proposal.cargo[0].idCargoContractingType))) {
      if (dataSales.currencySale !== null) {
        return false
      }
    }
    if (proposal.idTransport === 'SEA' && proposal.cargo[0].idCargoContractingType === FclCargoContractingType) {
      if (dataContainer[0]?.currencySale !== '' && dataContainer.every(row => row.currencySale === dataContainer[0].currencySale)) {
        return false
      }
    }
    return true
  }

  function renderTotalSurchage (): JSX.Element | undefined {
    if (proposal.idTransport === 'AIR' || proposal.idTransport === 'LAND') {
      if (dataSales.valueSale !== '' && dataSales.currencySale !== null) {
        return (
          <TotalSurcharge
            currency={dataSales.currencySale}
            value={dataSales.valueSale}
            totalOtherFare={getSumTotalItem()}
            cw={cw}
            cwSale={cwSale}
            modal={modal}
            data={data}
            totalCosts={totalCosts}
          />
        )
      }
    }
    if ((proposal.idTransport === 'SEA' && proposal.cargo[0].idCargoContractingType === FclCargoContractingType)) {
      if (dataContainer.every(row => row.valueSale !== '') && // algum campo de venda nao preenchido
        dataContainer.every(row => row.currencySale !== '' && row.currencySale !== null) && // algum campo de moeda nao preenchido
        dataContainer.every(row => row.currencySale === dataContainer[0].currencySale) // todos os campos de moeda precisam ter o mesmo valor
      ) {
        return (
          <TotalSurcharge
            currency={dataContainer[0]?.currencySale}
            value={dataContainer.reduce((total, item) => Number(item.valueSale?.replace(',', '.')) + total, 0).toFixed(2).replace('.', ',')}
            totalOtherFare={getSumTotalItem()}
            cw={cw}
            cwSale={cwSale}
            modal={modal}
            data={data}
            totalCosts={totalCosts}
          />
        )
      }
    }
    if (proposal.idTransport === 'SEA' && ContractingTypeWithoutFcl.includes(proposal.cargo[0].idCargoContractingType)) {
      if (dataSales.valueSale !== '' && dataSales.currencySale !== null) {
        return (
          <TotalSurcharge
            currency={dataSales.currencySale}
            value={decimalToString(Number(totalCharge))}
            totalOtherFare={getSumTotalItem()}
            cw={cw}
            cwSale={cwSale}
            modal={modal}
            data={data}
            totalCosts={totalCosts}
          />
        )
      }
    }
  }

  function makeCurrencyOnFareModal (): string {
    if (proposal.idTransport === 'AIR' || proposal.idTransport === 'LAND' || (proposal.idTransport === 'SEA' && ContractingTypeWithoutFcl.includes(proposal.cargo[0].idCargoContractingType))) {
      return dataSales.currencySale
    }
    if ((proposal.idTransport === 'SEA' && proposal.cargo[0].idCargoContractingType === FclCargoContractingType)) {
      if (dataContainer.length > 0) {
        return dataContainer[0]?.currencySale
      }
    }
    return ''
  }

  function makeSurchargeTable (agentList: any[]): JSX.Element | undefined {
    if (proposal.idTransport === 'AIR' || proposal.idTransport === 'LAND' || (proposal.idTransport === 'SEA' && ContractingTypeWithoutFcl.includes(proposal.cargo[0].idCargoContractingType))) {
      return (
        <SurchargeTable
          data={tableData}
          costData={costData}
          modal={modal}
          specifications={specifications}
          remove={removeClickHandler}
          edit={editClickHandler}
          dataFields={dataSales}
          agentList={agentList}
        />
      )
    }
    if ((proposal.idTransport === 'SEA' && proposal.cargo[0].idCargoContractingType === FclCargoContractingType)) {
      return (
        <SurchargeTable
          data={tableData}
          costData={costData}
          modal={modal}
          specifications={specifications}
          remove={removeClickHandler}
          edit={editClickHandler}
          dataFields={data[0]}
          agentList={agentList}
        />
      )
    }
  }

  function handleValueSale (newValue: string): void {
    const getCosts = [...proposal.costs]
    const verifyIfCostsHasNullAgent = getCosts.some(cost => cost.costType === 'Frete' && cost.agent.idBusinessPartnerAgent === null)
    if (verifyIfCostsHasNullAgent) {
      const handleCosts = getCosts.map(cost => {
        if (cost.costType === 'Frete' && cost.agent.idBusinessPartnerAgent === null) {
          return {
            ...cost,
            valueSale: Number(newValue.replace('.', '').replace(',', '.').replace(/[^\d.]/g, ''))
          }
        }
        return cost
      })
      setProposal({
        ...proposal,
        costs: handleCosts
      })
      setDataSales({ ...dataSales, valueSale: newValue })
    } else {
      const newCost = {
        valueSale: Number(newValue.replace('.', '').replace(',', '.').replace(/[^\d.]/g, '')),
        idCurrencySale: null,
        agent: {
          idBusinessPartnerAgent: null,
          idBusinessPartnerTransportCompany: null
        },
        billingType: '',
        idContainerType: null,
        costType: 'Frete',
        id: null,
        idCost: null,
        idCurrencyPurchase: '',
        idProposal: null,
        idService: getCosts[0].idService,
        isPurchase: false,
        isSale: true,
        valueMinimumPurchase: null,
        valueMinimumSale: null,
        valuePurchase: 0,
        valuePurchasePercent: null,
        valueSalePercent: 0
      }
      setProposal({
        ...proposal,
        costs: [...proposal.costs, newCost]
      })
      setDataSales({ ...dataSales, valueSale: Number(newValue.replace('.', '').replace(',', '.').replace(/[^\d.]/g, '')) })
    }
  }

  function handleCurrencySale (newValue: string): void {
    const getCosts = [...proposal.costs]
    const verifyIfCostsHasNullAgent = getCosts.some(cost => cost.costType === 'Frete' && cost.agent.idBusinessPartnerAgent === null)
    if (verifyIfCostsHasNullAgent) {
      const handleCosts = getCosts.map(cost => {
        if (cost.costType === 'Frete' && cost.agent.idBusinessPartnerAgent === null) {
          return {
            ...cost,
            idCurrencySale: newValue
          }
        }
        return cost
      })
      setProposal({
        ...proposal,
        costs: handleCosts
      })
      setDataSales({ ...dataSales, currencySale: newValue })
      setTableData(tableData.map(row => ({ ...row, saleCurrency: newValue })))
    } else {
      const newCost = {
        idCurrencySale: newValue,
        agent: {
          id: null,
          idBusinessPartnerAgent: null,
          idBusinessPartnerTransportCompany: null,
          proposalId: null
        },
        billingType: '',
        idContainerType: null,
        costType: 'Frete',
        id: null,
        idCost: null,
        idCurrencyPurchase: '',
        idProposal: null,
        idService: getCosts[0].idService,
        isPurchase: false,
        isSale: true,
        valueMinimumPurchase: null,
        valueMinimumSale: null,
        valuePurchase: 0,
        valuePurchasePercent: null,
        valueSale: 0,
        valueSalePercent: 0
      }
      setProposal({
        ...proposal,
        costs: [...proposal.costs, newCost]
      })
      setDataSales({ ...dataSales, currencySale: newValue })
      setTableData(tableData.map(row => ({ ...row, saleCurrency: newValue })))
    }
  }

  function handleCurrencyPurchase (idBusinessPartnerAgent, newData: any, newValue: string): void {
    const getCosts = proposal.costs
    const handleCosts = getCosts.map(cost => {
      if (cost.costType === 'Frete' && cost.agent.idBusinessPartnerAgent === idBusinessPartnerAgent) {
        return {
          ...cost,
          idCurrencyPurchase: newValue
        }
      }
      return cost
    })
    setProposal({
      ...proposal,
      costs: handleCosts
    })
    setData(newData)
  }

  function handleValuePurchase (idBusinessPartnerAgent, newData: any, newValue: string): void {
    const getCosts = proposal.costs
    const handleCosts = getCosts.map(cost => {
      if (cost.costType === 'Frete' && cost.agent.idBusinessPartnerAgent === idBusinessPartnerAgent) {
        return {
          ...cost,
          valuePurchase: Number(newValue.replace('.', '').replace(',', '.').replace(/[^\d.]/g, ''))
        }
      }
      return cost
    })
    setProposal({
      ...proposal,
      costs: handleCosts
    })
    setData(newData)
  }

  function handleContainerChange (newData, field, newValue, index, hasNumber: boolean): void {
    const getCostsCostTypeFrete = proposal.costs.filter(cost => cost.costType === 'Frete')
    const getCostsAnotherCostType = proposal.costs.filter(cost => cost.costType !== 'Frete')
    if (hasNumber) {
      getCostsCostTypeFrete[index][field] = Number(newValue.replace('.', '').replace(',', '.').replace(/[^\d.]/g, ''))
    } else {
      getCostsCostTypeFrete[index][field] = newValue
    }
    const handleCosts = [...getCostsAnotherCostType, ...getCostsCostTypeFrete]
    setProposal({
      ...proposal,
      costs: handleCosts
    })
    setDataContainer(newData)
  }

  function getAgentNameByidBusinessPartnerAgent (idBusinessPartnerAgent: any): string {
    return agentList.find((agent: any) => agent.businessPartner.id === idBusinessPartnerAgent)?.businessPartner?.simpleName
  }

  function getCorporateNameByidBusinessPartnerAgent (idBusinessPartnerTransportCompany: any): string {
    return businessPartner?.find((partner: any) => partner?.businessPartner?.id === idBusinessPartnerTransportCompany)?.businessPartner?.simpleName
  }

  return (

    <Separator>
      <HeightDiv>
        <Title>
          6. {I18n.t('pages.newProposal.step6.title')}
          <Subtitle>{I18n.t('pages.newProposal.step6.subtitle')}</Subtitle>
        </Title>
        <FormControl variant='outlined' size='small' className='form-size'>

          <>

            {(() => {
              if (proposal.idTransport === 'AIR' || proposal.idTransport === 'LAND' || (proposal.idTransport === 'SEA' && ContractingTypeWithoutFcl.includes(proposal.cargo[0].idCargoContractingType))) {
                return (
                  <>

                    <Grid item xs={6}>
                      <FormLabel component="legend"><strong>{'Tarifas de compra por agente'}</strong></FormLabel>
                    </Grid>
                    {proposal.agents.length > 0 &&
                      ((proposal.agents[0].idBusinessPartnerAgent !== null) && (proposal.agents[0].idBusinessPartnerTransportCompany !== null)) && (
                        <Grid container spacing={5}>
                          <Grid item xs={3}>
                            <FormLabel component='legend'>
                              {I18n.t('pages.newProposal.step6.agent')}
                            </FormLabel>
                          </Grid>
                          <Grid item xs={3}>
                            <FormLabel component='legend'>{selectTypeModal()}</FormLabel>
                          </Grid>
                          <Grid item xs={2}>
                            <FormLabel component='legend' error={invalidInput && data.some((each) => each.currencyPurchase === '')}>
                              {I18n.t('pages.newProposal.step6.currencyPurchase')}
                              <RedColorSpan> *</RedColorSpan>
                            </FormLabel>
                          </Grid>
                          <Grid item xs={2}>
                            <FormLabel component='legend' error={invalidInput && data.some((each) => each.valuePurchase === '' || each.valuePurchase === '0')}>
                              {I18n.t('pages.newProposal.step6.valuePurchase')}
                              <RedColorSpan> *</RedColorSpan>
                            </FormLabel>
                          </Grid>
                        </Grid>
                    )}
                    {proposal.agents.map((selectedAgent, index) => {
                      return ((selectedAgent.idBusinessPartnerAgent !== null) && (selectedAgent.idBusinessPartnerTransportCompany !== null)) && (
                          <Fragment key={index}>
                            <Grid container spacing={5}>
                              <Grid item xs={3}>
                                <FormLabel component='legend'>{getAgentNameByidBusinessPartnerAgent(selectedAgent.idBusinessPartnerAgent)}</FormLabel>
                              </Grid>
                              <Grid item xs={3}>
                                <FormLabel component='legend'>{getCorporateNameByidBusinessPartnerAgent(selectedAgent.idBusinessPartnerTransportCompany)}</FormLabel>
                              </Grid>
                              <Grid item xs={2}>
                                <Autocomplete freeSolo value={data[index]?.currencyPurchase} onChange={(e, newValue) => {
                                  const newData = [...data]
                                  newData[index].currencyPurchase = String(newValue ?? '')
                                  handleCurrencyPurchase(newData[index].agent.idBusinessPartnerAgent, newData, newValue)
                                }}
                                  options={currencyList.map((item) => item.id)} renderInput={(params) => (
                                    <div ref={params.InputProps.ref}>
                                      <ControlledInput {...params} id="currencies" toolTipTitle={I18n.t('components.itemModal.requiredField')} invalid={invalidInput && data[index].currencyPurchase === ''}
                                        variant="outlined" size="small" placeholder={I18n.t('components.itemModal.choose')}
                                        InputProps={{
                                          endAdornment: (
                                            <InputAdornment position='end'>
                                              <Box style={{ position: 'absolute', top: '7px', right: '0' }} {...params.inputProps} >
                                                <ArrowDropDownIcon />
                                              </Box>
                                            </InputAdornment>
                                          )
                                        }}
                                      />
                                    </div>
                                  )}
                                  PaperComponent={(params: any) => <StyledPaper {...params} />}
                                />
                              </Grid>
                              <Grid item xs={2}>
                                <NumberInput decimalSeparator={','} thousandSeparator={'.'} decimalScale={2} format={(value: string) => FormatNumber.rightToLeftFormatter(value, 2)}
                                  customInput={ControlledInput} onChange={(e) => {
                                    const newData = [...data]
                                    newData[index].valuePurchase = e.target.value
                                    handleValuePurchase(newData[index].agent.idBusinessPartnerAgent, newData, e.target.value)
                                  }} toolTipTitle={I18n.t('components.itemModal.requiredField')}
                                  invalid={invalidInput && (data[index]?.valuePurchase === '' || data[index]?.valuePurchase === '0')} value={data[index]?.valuePurchase} variant='outlined' size='small' />
                              </Grid>
                            </Grid>
                          </Fragment>
                      )
                    })}
                    <Fragment>
                      <Grid container spacing={5}>
                        <Grid item xs={6}>
                          <FormLabel component='legend' error={invalidInput && (dataSales.currencySale === '' || dataSales.currencySale === '0')} style={{ textAlign: 'right' }}>
                            Especificar o valor do frete para venda:
                            </FormLabel>
                        </Grid>
                        <Grid item xs={2} style={{ alignSelf: 'end' }}>
                          <Autocomplete
                            freeSolo
                            value={dataSales.currencySale}
                            onChange={(e, newValue) => handleCurrencySale(newValue)}
                            options={currencyList.map((item) => item.id)} renderInput={(params) => (
                              <div ref={params.InputProps.ref}>
                                <ControlledInput {...params} id="currencies" toolTipTitle={I18n.t('components.itemModal.requiredField')} invalid={invalidInput && (dataSales.currencySale === '' || dataSales.currencySale === '0')}
                                  variant="outlined" size="small" placeholder={I18n.t('components.itemModal.choose')}
                                  InputProps={{
                                    endAdornment: (
                                      <InputAdornment position='end'>
                                        <Box style={{ position: 'absolute', top: '7px', right: '0' }} {...params.inputProps} >
                                          <ArrowDropDownIcon />
                                        </Box>
                                      </InputAdornment>
                                    )
                                  }}
                                />
                              </div>
                            )}
                            PaperComponent={(params: any) => <StyledPaper {...params} />}
                          />
                        </Grid>
                        <Grid item xs={2} style={{ alignSelf: 'end' }}>
                          <NumberInput decimalSeparator={','} thousandSeparator={'.'} decimalScale={2} format={(value: string) => FormatNumber.rightToLeftFormatter(value, 2)}
                            customInput={ControlledInput} onChange={(e, newValue) => handleValueSale(e.target.value)} toolTipTitle={I18n.t('components.itemModal.requiredField')}
                            invalid={invalidInput && (dataSales.valueSale === '' || dataSales.valueSale === '0')} value={dataSales.valueSale} variant='outlined' size='small' />
                        </Grid>
                      </Grid>
                    </Fragment>
                  </>
                )
              }
            })()}

            {(() => {
              if ((proposal.idTransport === 'SEA' && proposal.cargo[0].idCargoContractingType === FclCargoContractingType)) {
                return (
                  <>

                    <Grid item xs={6}>
                      <FormLabel component="legend"><strong>{'Tarifas de compra e venda por container'}</strong></FormLabel>
                    </Grid>

                    <LineSeparator />

                    <Grid item xs={6}>
                      <FormLabel component="legend">{'Agente: '}<strong>{getAgentNameByidBusinessPartnerAgent(proposal.agents[0].idBusinessPartnerAgent)}</strong>{' / Cia. Marítima: '}<strong>{getCorporateNameByidBusinessPartnerAgent(proposal.agents[0].idBusinessPartnerTransportCompany)}</strong></FormLabel>
                    </Grid>

                    {proposal.cargo[0].cargoVolumes.length > 0 &&
                      dataContainer.length === proposal.cargo[0].cargoVolumes.length && (
                        <Grid container spacing={5}>
                          <Grid item xs={3}>
                            <FormLabel component='legend'>
                              Container
                            </FormLabel>
                          </Grid>
                          <Grid item xs={2}>
                            <FormLabel component='legend'>
                              {I18n.t('pages.newProposal.step6.currencyPurchase')}
                              <RedColorSpan> *</RedColorSpan>
                            </FormLabel>
                          </Grid>
                          <Grid item xs={2}>
                            <FormLabel component='legend'>
                              {I18n.t('pages.newProposal.step6.valuePurchase')}
                              <RedColorSpan> *</RedColorSpan>
                            </FormLabel>
                          </Grid>
                          <Grid item xs={2}>
                            <FormLabel component='legend'>
                              {I18n.t('pages.newProposal.step6.currencySale')}
                              <RedColorSpan> *</RedColorSpan>
                            </FormLabel>
                          </Grid>
                          <Grid item xs={2}>
                            <FormLabel component='legend'>
                              {I18n.t('pages.newProposal.step6.valueSale')}
                              <RedColorSpan> *</RedColorSpan>
                            </FormLabel>
                          </Grid>
                        </Grid>
                    )}
                    {proposal.cargo[0].cargoVolumes.map((cargoVolume, index, array) => {
                      return (dataContainer.length === array.length) && (
                          <Fragment key={index}>

                            <Grid container spacing={5}>
                              <Grid item xs={3}>
                                <FormLabel component='legend'>{cargoVolume.type}</FormLabel>
                              </Grid>

                              <Grid item xs={2}>
                                <Autocomplete
                                  freeSolo
                                  value={dataContainer[index]?.currencyPurchase}
                                  onChange={(e, newValue) => {
                                    const newData = [...dataContainer]
                                    newData[index].currencyPurchase = String(newValue ?? '')
                                    handleContainerChange(newData, 'currencyPurchase', newValue, index, false)
                                  }}
                                  options={currencyList.map((item) => item.id)}
                                  renderInput={(params) => (
                                    <div ref={params.InputProps.ref}>
                                      <ControlledInput
                                        {...params}
                                        id="currencies"
                                        toolTipTitle={I18n.t('components.itemModal.requiredField')}
                                        invalid={invalidInput && dataContainer[index]?.currencyPurchase === ''}
                                        variant="outlined"
                                        size="small"
                                        placeholder={I18n.t('components.itemModal.choose')}
                                        InputProps={{
                                          endAdornment: (
                                            <InputAdornment position='end'>
                                              <Box style={{ position: 'absolute', top: '7px', right: '0' }} {...params.inputProps} >
                                                <ArrowDropDownIcon />
                                              </Box>
                                            </InputAdornment>
                                          )
                                        }}
                                      />
                                    </div>
                                  )}
                                  PaperComponent={(params: any) => <StyledPaper {...params} />}
                                />
                              </Grid>

                              <Grid item xs={2}>
                                <NumberInput
                                  decimalSeparator={','}
                                  thousandSeparator={'.'}
                                  decimalScale={2}
                                  format={(value: string) => FormatNumber.rightToLeftFormatter(value, 2)}
                                  customInput={ControlledInput}
                                  onChange={(e) => {
                                    const newData = [...dataContainer]
                                    newData[index].valuePurchase = e.target.value
                                    handleContainerChange(newData, 'valuePurchase', e.target.value, index, true)
                                  }}
                                  toolTipTitle={I18n.t('components.itemModal.requiredField')}
                                  invalid={invalidInput && (dataContainer[index].valuePurchase === '' || dataContainer[index].valuePurchase === '0')}
                                  value={dataContainer[index].valuePurchase}
                                  variant='outlined'
                                  size='small'
                                />
                              </Grid>

                              <Grid item xs={2}>
                                <>
                                  <Autocomplete
                                    freeSolo
                                    value={dataContainer[index].currencySale}
                                    onChange={(e, newValue) => {
                                      const newData = [...dataContainer]
                                      newData[index].currencySale = String(newValue ?? '')
                                      handleContainerChange(newData, 'currencySale', newValue, index, false)
                                    }}
                                    options={currencyList.map((item) => item.id)}
                                    renderInput={(params) => (
                                      <div ref={params.InputProps.ref}>
                                        <ControlledInput
                                          {...params}
                                          id="currencies"
                                          toolTipTitle={I18n.t('components.itemModal.requiredField')}
                                          invalid={invalidInput && dataContainer.some(row => row.currencySale !== dataContainer[0].currencySale)}
                                          variant="outlined"
                                          size="small"
                                          placeholder={I18n.t('components.itemModal.choose')}
                                          InputProps={{
                                            endAdornment: (
                                              <InputAdornment position='end'>
                                                <Box style={{ position: 'absolute', top: '7px', right: '0' }} {...params.inputProps} >
                                                  <ArrowDropDownIcon />
                                                </Box>
                                              </InputAdornment>
                                            )
                                          }}
                                        />
                                      </div>
                                    )}
                                    PaperComponent={(params: any) => <StyledPaper {...params} />}
                                  />
                                  {dataContainer.some(row => row.currencySale !== dataContainer[0].currencySale) &&
                                    <ErrorText>
                                      {I18n.t('pages.newProposal.step6.differentCurrencySale')}
                                    </ErrorText>
                                  }
                                </>
                              </Grid>

                              <Grid item xs={2}>
                                <NumberInput
                                  decimalSeparator={','}
                                  thousandSeparator={'.'}
                                  decimalScale={2}
                                  format={(value: string) => FormatNumber.rightToLeftFormatter(value, 2)}
                                  customInput={ControlledInput}
                                  onChange={(e) => {
                                    const newData = [...dataContainer]
                                    newData[index].valueSale = e.target.value
                                    setDataContainer(newData)
                                    handleContainerChange(newData, 'valueSale', e.target.value, index, true)
                                  }}
                                  toolTipTitle={I18n.t('components.itemModal.requiredField')}
                                  invalid={invalidInput && (dataContainer[index].valueSale === '' || dataContainer[index].valueSale === '0')}
                                  value={dataContainer[index].valueSale}
                                  variant='outlined'
                                  size='small'
                                />
                              </Grid>

                            </Grid>

                          </Fragment>

                      )
                    })}
                  </>
                )
              }
            })()}
          </>

          <LineSeparator />

          <Grid item xs={6}>
            <FormLabel component="legend"><strong>{'Outras tarifas / surcharges'}</strong></FormLabel>
          </Grid>

        </FormControl>
        {makeSurchargeTable(agentList)}
        <ButtonWrapper>
          <Button
            onAction={handleOpen}
            text={I18n.t('pages.newProposal.step6.addFare')}
            icon="add"
            backgroundGreen={false}
            tooltip={
              costData === 0
                ? I18n.t('pages.newProposal.step6.addFareTooltip')
                : I18n.t('pages.newProposal.step6.addFare')
            }
            disabled={costData === 0 || disabledAddFareButton()}
          />
        </ButtonWrapper>
        <FareModal
          dataProp={chargeData}
          action={handleAdd}
          open={open}
          setClose={handleClose}
          title={I18n.t('components.fareModal.newFare')}
          modal={modal}
          specifications={specifications}
          containerItems={containerItems}
          currency={makeCurrencyOnFareModal()}
          AllAgents={agentList}
        />
        {renderTotalSurchage()}
      </HeightDiv>
      {undoMessage.step6 && (
        <MessageContainer>
          <Messages
            closable={true}
            severity="success"
            buttonText={I18n.t('pages.newProposal.step3.messageUndoDelete')}
            closeAlert={() => {
              setUndoMessage({
                step3: false,
                step5origin: false,
                step5destiny: false,
                step6: false
              })
            }}
            closeMessage=""
            goBack={() => {
              setTableData(copyTable)
              setUndoMessage({
                step3: false,
                step5origin: false,
                step5destiny: false,
                step6: false
              })
            }}
            message={I18n.t('pages.newProposal.step3.messageDeleteItem')}
          />
        </MessageContainer>
      )}
    </Separator>
  )
}

export default withTheme(Step6)
