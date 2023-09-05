import React, { useContext, useEffect, useImperativeHandle, useState } from 'react'
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
import { ButtonWrapper, HeightDiv, NumberInput, StyledPaper, LineSeparator, UpperContainer, LowerContainer, TotalContainer, FreightContainer, CargoContainer } from './StepsStyles'
import { Button, Messages } from 'fiorde-fe-components'
import { ProposalContext, ProposalProps } from '../../NewProposal/context/ProposalContext'
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
import { CostTypes, FareItemsTypes } from '../../../../application/enum/costEnum'
import { ModalTypes, AcitivityTypes } from '../../../../application/enum/enum'
import RemoveIcon from '../../../../application/icons/RemoveIcon'

import TariffImportAirModal from '../../../components/TariffImport/TariffImportAirModal'
import TariffImportLclModal from '../../../components/TariffImport/TariffImportLclModal'


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
  if (value !== null && value !== undefined) { return FormatNumber.convertNumberToString(value) }
  return ''
}

const makeTableData = (costs): any => {
  const getTarifas = costs?.filter(cost => cost.costType === CostTypes.Tariff)
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
  const [openImport, setOpenImport] = useState<boolean>(false)
  const [disable, setDisable] = useState<any[]>([])

  const handleOpen = (): void => setOpen(true)
  const handleClose = (): void => {
    setOpen(false)
    setChargeData(initialState)
  }

  const currencyArray = new Map()

  // const [tableData, setTableData] = useState<FareModalData[]>([])
  const [tableData, setTableData] = useState<FareModalData[]>(makeTableData(proposal?.costs))
  const [data, setData] = useState<any[]>(
    proposal?.agents.map(newAgent => ({
      idCost: proposal.costs.find((cost): any => {
        if (cost.costType === CostTypes.Freight) {
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
        if (cost.costType === CostTypes.Freight) {
          if (cost?.agent?.idBusinessPartnerAgent === newAgent?.idBusinessPartnerAgent) {
            return true
          }
        }
        return false
      })?.idCurrencyPurchase,
      valueSale: '',
      valuePurchase: decimalToString(proposal.costs.find((cost): any => {
        if (cost.costType === CostTypes.Freight) {
          if (cost?.agent?.idBusinessPartnerAgent === newAgent?.idBusinessPartnerAgent && cost.valuePurchase !== null) {
            return true
          }
        }
        return false
      })?.valuePurchase),
      tableData: []
    }))
  )
  const [dataContainer, setDataContainer] = useState(proposal.cargo[0].cargoVolumes.map((item, index) => ({
    idCost: proposal.costs.filter(cost => cost.costType === CostTypes.Freight)[index]?.idCost ?? null,
    idContainerType: item.idContainerType,
    currencySale: proposal.costs.filter(cost => cost.costType === CostTypes.Freight)[index]?.idCurrencySale ?? '',
    currencyPurchase: proposal.costs.filter(cost => cost.costType === CostTypes.Freight)[index]?.idCurrencyPurchase ?? '',
    valueSale: decimalToString(proposal.costs.filter(cost => cost.costType === CostTypes.Freight)[index]?.valueSale),
    valuePurchase: decimalToString(proposal.costs.filter(cost => cost.costType === CostTypes.Freight)[index]?.valuePurchase),
    valueQuantity: item.valueQuantity
  })))

  const getValueSale = (): string[] => {
    return proposal.agents.map((agent) => {
      return proposal.costs
        .find(cost => cost.costType === CostTypes.Freight && cost.valuePurchase === null && cost.agent?.idBusinessPartnerAgent === agent.idBusinessPartnerAgent)?.valueSale?.toFixed(2) ?? ''
    })
  }

  const [dataSales, setDataSales] = useState<any>({
    idCost: proposal.costs.find(cost => cost.costType === CostTypes.Freight && (cost.agent === null || cost.agent.idBusinessPartnerAgent === null))?.idCost ?? null,
    currencySale: String(proposal.costs.find(cost => cost.costType === CostTypes.Freight && (cost.valuePurchase === null))?.idCurrencySale ?? ''),
    valueSale: getValueSale()
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
      valuePurchase: '',
      valueQuantity: newCargo.valueQuantity
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
    const resultado = proposal.costs.filter(cost => cost.costType !== CostTypes.Freight)
    proposal.costs = resultado

    if (proposal.idTransport === 'AIR' || proposal.idTransport === 'LAND' || (proposal.idTransport === 'SEA' && proposal.cargo[0].idCargoContractingType !== null && ContractingTypeWithoutFcl.includes(proposal.cargo[0].idCargoContractingType))) {
      data.forEach((item, index): void => {
        const agent = proposal.agents[index]
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
            id: agent.id,
            idBusinessPartnerAgent: agent.idBusinessPartnerAgent,
            idBusinessPartnerTransportCompany: agent.idBusinessPartnerTransportCompany,
            proposalId: null
          },
          costType: CostTypes.Freight,
          idCurrencySale: item.currencySale,
          idCurrencyPurchase: item.currencyPurchase,
          valueSale: FormatNumber.convertStringToNumber(String(item.valueSale)),
          valuePurchase: FormatNumber.convertStringToNumber(String(item.valuePurchase)),
          isPurchase: false,
          isSale: true,
          valueSaleTotal: null,
          valuePurchaseTotal: null
        }
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
            id: agent.id,
            idBusinessPartnerAgent: agent.idBusinessPartnerAgent,
            idBusinessPartnerTransportCompany: agent.idBusinessPartnerTransportCompany,
            proposalId: null
          },
          costType: CostTypes.Freight,
          idCurrencySale: dataSales.currencySale,
          idCurrencyPurchase: dataSales.currencySale,
          valueSale: FormatNumber.convertStringToNumber(dataSales.valueSale[index]),
          valuePurchase: null,
          isPurchase: false,
          isSale: true,
          valueSaleTotal: null,
          valuePurchaseTotal: null
        }
        freightCostArrayNew.push(freightCostNew)
        freightCostArrayNew.push(freightCostSale)
      })
    }

    if ((proposal.idTransport === 'SEA' && proposal.cargo[0].idCargoContractingType === FclCargoContractingType)) {
      dataContainer.forEach((item, index): void => {
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
          costType: CostTypes.Freight,
          idCurrencySale: item.currencySale,
          idCurrencyPurchase: item.currencyPurchase,
          valueSale: FormatNumber.convertStringToNumber(String(item.valueSale)),
          valuePurchase: FormatNumber.convertStringToNumber(String(item.valuePurchase)),
          isPurchase: false,
          isSale: true,
          valueSaleTotal: null,
          valuePurchaseTotal: null
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
          if (cost.costType === CostTypes.Tariff) {
            newTableData[tableDataId].idCost = cost.idCost
            newTableData[tableDataId++].idProposal = proposal.idProposal
          }
        }
        setTableData(newTableData)
        for (const totalCost of proposal.totalCosts) {
          if (totalCost.costType === CostTypes.Tariff) {
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
              if (cost.costType === CostTypes.Tariff) {
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
                    : FormatNumber.convertNumberToString(Number(response[2]))
              }
              if (proposal.idTransport === 'AIR' || proposal.idTransport === 'LAND' || (proposal.idTransport === 'SEA' && proposal.cargo[0].idCargoContractingType !== null && ContractingTypeWithoutFcl.includes(proposal.cargo[0].idCargoContractingType))) {
                if (cost.costType === CostTypes.Tariff) {
                  const getAgentByTarifaAgent = proposal.agents.find(agent => agent.idBusinessPartnerAgent === cost.agent.idBusinessPartnerAgent)
                  loadedItem.agent = getAgentByTarifaAgent // novo agente vinculado ao custo
                }
              }
              if (cost.costType === CostTypes.Tariff) {
                loadedData.push(loadedItem)
              }
            }))
          }
          setTableData(loadedData)
        }
        void waitAllData()

        const loadedTotalCosts: any[] = []
        proposal.totalCosts.forEach((totalCost: TotalCost) => {
          if (totalCost.costType === CostTypes.Tariff) {
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
      (cost) => cost.costType !== CostTypes.Tariff && cost && cost.costType !== CostTypes.Freight
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
        costType: CostTypes.Tariff,
        billingType: row.type, // Tipo -MODAL
        valuePurchase: null, // valor compra
        valuePurchasePercent: 0, // 0 por enquanto
        valueMinimumPurchase: null, // minimo compra
        valueSale: FormatNumber.convertStringToNumber(row.saleValue), // valor venda
        valueSalePercent: 0, // 0 por enquanto
        valueMinimumSale: FormatNumber.convertStringToNumber(row.minimumValue), // minimo venda
        idCurrencyPurchase: 'nul', // tipo moeda NOTNULL VARCHAR(3)
        idCurrencySale: row.saleCurrency, // tipo moeda
        isPurchase: false, // checkbox compra
        isSale: row.saleValue !== null, // checkbox venda
        valueSaleTotal: row.type === FareItemsTypes.Fixed || row.type === FareItemsTypes.Bl
          ? FormatNumber.convertStringToNumber(row.saleValue)
          : FormatNumber.convertStringToNumber(row.totalItem),
        valuePurchaseTotal: null
      })
    })

    const actualTotalCostArray = proposal.totalCosts
    const newTotalCostFare: TotalCost[] = []
    dataTotalCost.forEach((currency, index) => {
      newTotalCostFare.push({
        id:
          loadedTotalCostsIds[index] === undefined
            ? null
            : loadedTotalCostsIds[index],
        idProposal:
          proposal?.idProposal === undefined ? null : proposal?.idProposal,
        costType: CostTypes.Tariff,
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
    if (proposal.idTransport === 'AIR' || proposal.idTransport === 'LAND' || (proposal.idTransport === 'SEA' && proposal.cargo[0].idCargoContractingType !== null && ContractingTypeWithoutFcl.includes(proposal.cargo[0].idCargoContractingType))) {
      if (data.every(d => d.currencyPurchase !== '') &&
      data.every(d => d.valuePurchase !== '') &&
      dataSales.valueSale?.length !== 0 &&
      (dataSales.valueSale.every(value => value !== '' && value !== '0')) &&
      (dataSales.currencySale !== '' && dataSales.currencySale !== '0' && dataSales.currencySale !== null)) {
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
              item.totalItem = FormatNumber.convertNumberToString(Number(response?.valueSale))
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
      .filter(cost => cost.costType === CostTypes.Freight && cost.valueSale !== null && cost.valueSale > 0)
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
      valueSale: FormatNumber.convertStringToNumber(item.saleValue),
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
          item.totalItem = FormatNumber.convertNumberToString(Number(response?.valueSale))
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
    return FormatNumber.convertNumberToString(num)
  }

  const getSumTotalItem = (): string => {
    let totalSum: number = 0
    for (let index = 0; index < tableData.length; index++) {
      const item = tableData[index]
      const MinValue = FormatNumber.convertStringToNumber(item.minimumValue)
      const TotalItem = FormatNumber.convertStringToNumber(item.totalItem)

      if (MinValue > TotalItem) {
        totalSum = totalSum + FormatNumber.convertStringToNumber(item.minimumValue)
      }
      if (MinValue <= TotalItem) {
        totalSum = totalSum + FormatNumber.convertStringToNumber(item.totalItem)
      }
    }
    return FormatNumber.convertNumberToString(totalSum)
  }

  function disabledAddFareButton (): boolean {
    if (proposal.idTransport === 'AIR' || proposal.idTransport === 'LAND' || (proposal.idTransport === 'SEA' && proposal.cargo[0].idCargoContractingType !== null && ContractingTypeWithoutFcl.includes(proposal.cargo[0].idCargoContractingType))) {
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
      if (dataSales.valueSale?.length > 0 && dataSales.currencySale !== null) {
        return (
          <TotalSurcharge
            currency={dataSales.currencySale}
            value={FormatNumber.convertNumberToString(dataSales.valueSale.reduce((total: number, item: string) => FormatNumber.convertStringToNumber(item) + total, 0))}
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
            value={FormatNumber.convertNumberToString(dataContainer.reduce((total, item) => FormatNumber.convertStringToNumber(item.valueSale) * Number(item.valueQuantity) + total, 0))}
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
    if (proposal.idTransport === 'SEA' && proposal.cargo[0].idCargoContractingType !== null && ContractingTypeWithoutFcl.includes(proposal.cargo[0].idCargoContractingType)) {
      if (dataSales.valueSale?.length > 0 && dataSales.currencySale !== null) {
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
    if (proposal.idTransport === 'AIR' || proposal.idTransport === 'LAND' || (proposal.idTransport === 'SEA' && proposal.cargo[0].idCargoContractingType !== null && ContractingTypeWithoutFcl.includes(proposal.cargo[0].idCargoContractingType))) {
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
    if (proposal.idTransport === 'AIR' || proposal.idTransport === 'LAND' || (proposal.idTransport === 'SEA' && proposal.cargo[0].idCargoContractingType !== null && ContractingTypeWithoutFcl.includes(proposal.cargo[0].idCargoContractingType))) {
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

  function handleValueSale (newValue: string, agent: any, index: number): void {
    const getCosts = [...proposal.costs]
    const verifyIfCostsHasNullPurchase = getCosts.some(cost => cost.costType === CostTypes.Freight && cost.valuePurchase === null)
    if (verifyIfCostsHasNullPurchase) {
      const handleCosts = getCosts.map(cost => {
        if (cost.costType === CostTypes.Freight && cost.agent.idBusinessPartnerAgent === agent.idBusinessPartnerAgent) {
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
      const newDataSales = [...dataSales.valueSale]
      newDataSales[index] = newValue
      setDataSales({ ...dataSales, valueSale: [...newDataSales] })
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
        costType: CostTypes.Freight,
        id: null,
        idCost: null,
        idCurrencyPurchase: '',
        idProposal: null,
        idService: getCosts[0].idService,
        isPurchase: false,
        isSale: true,
        valueMinimumPurchase: null,
        valueMinimumSale: null,
        valuePurchase: null,
        valuePurchasePercent: null,
        valueSalePercent: 0,
        valueSaleTotal: null,
        valuePurchaseTotal: null
      }
      setProposal({
        ...proposal,
        costs: [...proposal.costs, newCost]
      })
      const newDataSales = [...dataSales.valueSale]
      newDataSales[index] = Number(newValue.replace('.', '').replace(',', '.').replace(/[^\d.]/g, ''))
      setDataSales({ ...dataSales, valueSale: [...newDataSales] })
    }
  }

  function handleCurrencySale (newValue: string): void {
    const getCosts = [...proposal.costs]
    const verifyIfCostsHasNullPurchase = getCosts.some(cost => cost.costType === CostTypes.Freight && cost.valuePurchase === null)
    if (verifyIfCostsHasNullPurchase) {
      const handleCosts = getCosts.map(cost => {
        if (cost.costType === CostTypes.Freight && cost.valuePurchase === null) {
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
        costType: CostTypes.Freight,
        id: null,
        idCost: null,
        idCurrencyPurchase: '',
        idProposal: null,
        idService: getCosts[0].idService,
        isPurchase: false,
        isSale: true,
        valueMinimumPurchase: null,
        valueMinimumSale: null,
        valuePurchase: null,
        valuePurchasePercent: null,
        valueSale: 0,
        valueSalePercent: 0,
        valueSaleTotal: null,
        valuePurchaseTotal: null
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
      if (cost.costType === CostTypes.Freight && cost.agent.idBusinessPartnerAgent === idBusinessPartnerAgent) {
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
      if (cost.costType === CostTypes.Freight && cost.agent.idBusinessPartnerAgent === idBusinessPartnerAgent) {
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
    const getCostsCostTypeFrete = proposal.costs.filter(cost => cost.costType === CostTypes.Freight)
    const getCostsAnotherCostType = proposal.costs.filter(cost => cost.costType !== CostTypes.Freight)
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

  function inputValidation (field: any): boolean {
    return field === '' || field === '0' || field === null
  }

  const getPurchase = (value: string, currency: string, index: number): void => {
    const newData = [...data]
    newData[index].valuePurchase = value
    newData[index].currencyPurchase = currency
    handleValuePurchase(newData[index].agent.idBusinessPartnerAgent, newData, value)
    handleCurrencyPurchase(newData[index].agent.idBusinessPartnerAgent, newData, currency)
    const newArr = [...disable]
    newArr[index] = true
    setDisable(newArr)
  }

  const cleanPurchase = (index: number): void => {
    const newData = [...data]
    newData[index].valuePurchase = ''
    newData[index].currencyPurchase = ''
    handleValuePurchase(newData[index].agent.idBusinessPartnerAgent, newData, '')
    handleCurrencyPurchase(newData[index].agent.idBusinessPartnerAgent, newData, '')
    const newArr = [...disable]
    newArr[index] = false
    setDisable(newArr)
  }

  const createTariffImportModal = (selectedAgent: any, index: number): JSX.Element => {
    if (modal === ModalTypes.Sea && proposal.cargo[0].idCargoContractingType !== null && ContractingTypeWithoutFcl.includes(proposal.cargo[0].idCargoContractingType)) {
      return (
        <TariffImportLclModal
          setClose={() => setOpenImport(false)}
          open={openImport}
          typeModal={selectTypeModal()}
          importFilter={{
            idOrigin: proposal.originDestiny[0]?.idOrigin,
            idDestination: proposal.originDestiny[0]?.idDestination,
            idBusinessPartnerAgent: selectedAgent.idBusinessPartnerAgent,
            idBusinessPartnerTransportCompany: selectedAgent.idBusinessPartnerTransportCompany
          }}
          calculationData={calculationData}
          getPurchase={getPurchase}
          index={index}
          type={AcitivityTypes.Export}
        />
    
      )
    } else if (modal === ModalTypes.Air) {
      return (
        <TariffImportAirModal
          setClose={() => setOpenImport(false)}
          open={openImport}
          typeModal={selectTypeModal()}
          importFilter={{
            idOrigin: proposal.originDestiny[0]?.idOrigin,
            idDestination: proposal.originDestiny[0]?.idDestination,
            idBusinessPartnerAgent: selectedAgent.idBusinessPartnerAgent,
            idBusinessPartnerTransportCompany: selectedAgent.idBusinessPartnerTransportCompany
          }}
          calculationData={calculationData}
          getPurchase={getPurchase}
          index={index}
          type={AcitivityTypes.Export}
          cwSale={cwSale}
        />
      )
    } else {
      return <></>
    }
  }

  if (proposal.agents.length > 0 && costData !== 0) {
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
              if (proposal.idTransport === 'AIR' || proposal.idTransport === 'LAND' || (proposal.idTransport === 'SEA' && proposal.cargo[0].idCargoContractingType !== null && ContractingTypeWithoutFcl.includes(proposal.cargo[0].idCargoContractingType))) {
                return (
                  <>
                    <Grid item xs={6}>
                      <FormLabel component="legend"><strong>{I18n.t('pages.newProposal.step6.freightByAgent')}</strong></FormLabel>
                    </Grid>
                    {proposal.agents.map((selectedAgent, index) => {
                      return ((selectedAgent.idBusinessPartnerAgent !== null) && (selectedAgent.idBusinessPartnerTransportCompany !== null)) && (
                        <TotalContainer key={index}>
                          <UpperContainer>
                            <Grid container spacing={0}>
                              <Grid item xs={1}>
                                <FormLabel component='legend'>
                                  {I18n.t('pages.newProposal.step6.agent')}:
                                </FormLabel>
                              </Grid>
                              <Grid item xs={11}>
                                <FormLabel component='legend'>
                                  <strong>
                                    {getAgentNameByidBusinessPartnerAgent(selectedAgent.idBusinessPartnerAgent)}
                                  </strong>
                                </FormLabel>
                              </Grid>
                              <Grid item xs={1} style={{ marginTop: '-15px' }}>
                                <FormLabel component='legend'>{selectTypeModal()}</FormLabel>
                              </Grid>
                              <Grid item xs={11} style={{ marginTop: '-15px' }}>
                                <FormLabel component='legend'>
                                  <strong>
                                    {getCorporateNameByidBusinessPartnerAgent(selectedAgent.idBusinessPartnerTransportCompany)}
                                  </strong>
                                </FormLabel>
                              </Grid>
                            </Grid>
                          </UpperContainer>
                          <LowerContainer>
                            <Grid container spacing={5}>
                              <Grid item xs={2}>
                                <FormLabel component='legend' error={invalidInput && data.some((each) => inputValidation(each.currencyPurchase))}>
                                  {I18n.t('pages.newProposal.step6.currencyPurchase')}
                                  <RedColorSpan> *</RedColorSpan>
                                </FormLabel>
                              </Grid>
                              <Grid item xs={2}>
                                <FormLabel component='legend' error={invalidInput && data.some((each) => inputValidation(each.valuePurchase))}>
                                  {I18n.t('pages.newProposal.step6.valuePurchase')}
                                  <RedColorSpan> *</RedColorSpan>
                                </FormLabel>
                              </Grid>
                              <Grid item xs={2}>
                                <FormLabel component='legend' error={invalidInput && inputValidation(dataSales.currencySale)}>
                                  {I18n.t('pages.newProposal.step6.currencySale')}
                                  <RedColorSpan> *</RedColorSpan>
                                </FormLabel>
                              </Grid>
                              <Grid item xs={2}>
                                <FormLabel component='legend' error={invalidInput && (dataSales.valueSale?.length === 0 || inputValidation(dataSales.valueSale[index]))}>
                                  {I18n.t('pages.newProposal.step6.valueSale')}
                                  <RedColorSpan> *</RedColorSpan>
                                </FormLabel>
                              </Grid>
                            </Grid>
                            <Grid container spacing={5} style={{ marginTop: '-35px' }}>
                              <Grid item xs={2}>
                                <Autocomplete freeSolo value={data[index]?.currencyPurchase} disabled={disable[index]} onChange={(e, newValue) => {
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
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                  <NumberInput decimalSeparator={','} thousandSeparator={'.'} decimalScale={2} format={(value: string) => FormatNumber.rightToLeftFormatter(value, 2)}
                                    disabled={disable[index]}
                                    customInput={ControlledInput} onChange={(e) => {
                                      const newData = [...data]
                                      newData[index].valuePurchase = e.target.value
                                      handleValuePurchase(newData[index].agent.idBusinessPartnerAgent, newData, e.target.value)
                                    }} toolTipTitle={I18n.t('components.itemModal.requiredField')}
                                    invalid={invalidInput && inputValidation(data[index]?.valuePurchase)} value={data[index]?.valuePurchase} variant='outlined' size='small' />
                                  <div style={{ marginLeft: '10px' }}>
                                    <RemoveIcon onClick={() => cleanPurchase(index)} />
                                  </div>
                                </div>
                              </Grid>
                              <Grid item xs={2}>
                                <Autocomplete
                                  freeSolo
                                  value={dataSales.currencySale}
                                  onChange={(e, newValue) => handleCurrencySale(newValue)}
                                  options={currencyList.map((item) => item.id)} renderInput={(params) => (
                                    <div ref={params.InputProps.ref}>
                                      <ControlledInput {...params} id="currencies" toolTipTitle={I18n.t('components.itemModal.requiredField')}
                                      invalid={invalidInput && inputValidation(dataSales.currencySale)}
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
                                  customInput={ControlledInput} onChange={(e, newValue) => handleValueSale(e.target.value, selectedAgent, index)} toolTipTitle={I18n.t('components.itemModal.requiredField')}
                                  invalid={invalidInput && (dataSales.valueSale?.length === 0 || inputValidation(dataSales.valueSale[index]))} value={dataSales.valueSale[index]} variant='outlined' size='small' />
                              </Grid>
                            </Grid>
                            <ButtonWrapper>
                              <Button
                                onAction={() => setOpenImport(true)}
                                text={I18n.t('pages.newProposal.step6.importButton')}
                                icon="tariff"
                                backgroundGreen={true}
                                tooltip={I18n.t('pages.newProposal.step6.importButton')}
                                disabled={false}
                              />
                            </ButtonWrapper>
                            {createTariffImportModal(selectedAgent, index)}
                          </LowerContainer>
                        </TotalContainer>
                      )
                    })}
                  </>
                )
              }
            })()}

            {(() => {
              if ((proposal.idTransport === 'SEA' && proposal.cargo[0].idCargoContractingType === FclCargoContractingType)) {
                return (
                  <>

                  <Grid item xs={6}>
                    <FormLabel component="legend"><strong>{I18n.t('pages.newProposal.step6.freightByAgent')}</strong></FormLabel>
                  </Grid>

                  <LineSeparator />
                  <TotalContainer>
                    <CargoContainer>
                    <Grid container spacing={0}>
                      <Grid item xs={1}>
                        <FormLabel component="legend">
                        {I18n.t('pages.newProposal.step6.agent')}:
                        </FormLabel>
                      </Grid>
                      <Grid item xs={11}>
                        <FormLabel component="legend">
                        <strong>{ getAgentNameByidBusinessPartnerAgent(proposal?.agents[0]?.idBusinessPartnerAgent)}</strong>
                        </FormLabel>
                      </Grid>
                      <Grid item xs={1}>
                        <FormLabel component="legend">
                          {selectTypeModal()}:
                        </FormLabel>
                      </Grid>
                      <Grid item xs={11}>
                        <FormLabel component="legend">
                          <strong>{getCorporateNameByidBusinessPartnerAgent(proposal?.agents[0]?.idBusinessPartnerTransportCompany)}</strong>
                        </FormLabel>
                      </Grid>
                    </Grid>
                    </CargoContainer>
                    {proposal.cargo[0].cargoVolumes.map((cargoVolume, index, array) => {
                      return (dataContainer.length === array.length) && (
                        <CargoContainer className="line-bottom">
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
                          <Grid container spacing={5}>
                            <Grid item xs={3} style={{ marginTop: '-15px' }}>
                              <FormLabel component='legend'><strong>{cargoVolume.type}</strong></FormLabel>
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
                                invalid={invalidInput && inputValidation(dataContainer[index].valuePurchase)}
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
                                    const newData = dataContainer.map((data) => {
                                      data.currencySale = String(newValue ?? '')
                                      return data
                                    })
                                    // const newData = [...dataContainer]
                                    // newData[index].currencySale = String(newValue ?? '')
                                    handleContainerChange(newData, 'currencySale', newValue, index, false)
                                  }}
                                  options={currencyList.map((item) => item.id)}
                                  renderInput={(params) => (
                                    <div ref={params.InputProps.ref}>
                                      <ControlledInput
                                        {...params}
                                        id="currencies"
                                        toolTipTitle={I18n.t('components.itemModal.requiredField')}
                                        invalid={invalidInput && dataContainer[index]?.currencySale === ''}
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
                                invalid={invalidInput && inputValidation(dataContainer[index].valueSale)}
                                value={dataContainer[index].valueSale}
                                variant='outlined'
                                size='small'
                              />
                            </Grid>

                          </Grid>
                          <ButtonWrapper>
                            <Button
                              onAction={() => console.log('')}
                              text={I18n.t('pages.newProposal.step6.importButton')}
                              icon="tariff"
                              backgroundGreen={true}
                              tooltip={I18n.t('pages.newProposal.step6.importButton')}
                              disabled={false}
                            />
                          </ButtonWrapper>

                        </CargoContainer>

                      )
                    })}

                  </TotalContainer>
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
  } else {
    return (
      <Separator>
        <HeightDiv>
          <Title>
            6. {I18n.t('pages.newProposal.step6.title')}
            <Subtitle>{I18n.t('pages.newProposal.step6.subtitle')}</Subtitle>
          </Title>
          <TotalContainer>
            <FreightContainer>
              {I18n.t('pages.newProposal.step6.addFareTooltip')}
            </FreightContainer>
          </TotalContainer>
        </HeightDiv>
      </Separator>
    )
  }
}

export default withTheme(Step6)
