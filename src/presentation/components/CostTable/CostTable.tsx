import React, { useContext, useEffect, useState } from 'react'

import { TableBody, TableHead, TableRow, Grid, FormLabel } from '@material-ui/core'

import {
  ButtonContainer,
  Default,
  DeleteIconDiv,
  Description,
  EditIconDiv,
  ErrorText,
  Footer,
  Header,
  MainDiv,
  RedColorSpan,
  RowReverseDiv,
  SecondaryValue,
  StyledTable,
  StyledTableCell,
  TableHeadRow,
  Title,
  TotalCostLabel,
  Type
} from './CostTableStyles'
import EditIcon from '../../../application/icons/EditIcon'
import RemoveIcon from '../../../application/icons/RemoveIcon'
import { I18n } from 'react-redux-i18n'
import { Button, Messages } from 'fiorde-fe-components'
import CostModal, { CostTableItem, initialState } from '../CostModal/CostModal'
import { ItemModalData } from '../ItemModal/ItemModal'
import { CalculationDataProps } from '../ChargeTable'
import { MessageContainer } from '../../pages/NewProposal/style'
import { TotalCostTable } from '../../pages/NewProposal/steps/Step6'
import API from '../../../infrastructure/api'
import { ProposalProps, ProposalContext } from '../../pages/NewProposal/context/ProposalContext'
import { Agents } from '../../pages/NewProposal/steps/Step2'
import { FareItemsTypes, CostTypes } from '../../../application/enum/costEnum'
import { ModalTypes } from '../../../application/enum/enum'
import { TARIFF_COST_TABLE_SPAN_AGENT } from '../../../ids'
import GetNamesByID from '../../../application/utils/getNamesByID'
import { useCalculationTypes } from '../../hooks/index'

interface CostTableProps {
  agentList: Agents[]
  title: string
  totalCostLabel: string
  modalTitle: string
  costData: any
  modal: string
  specifications: string
  containerItems: ItemModalData[]
  setUndoMessage: React.Dispatch<React.SetStateAction<{
    step3: boolean
    step6origin: boolean
    step6destiny: boolean
    step5: boolean
  }>>
  undoMessage: { step3: boolean, step6origin: boolean, step6destiny: boolean, step5: boolean }
  tableData: CostTableItem[]
  setTableData: React.Dispatch<React.SetStateAction<CostTableItem[]>>
  setTotalCostData: React.Dispatch<React.SetStateAction<TotalCostTable[]>>
  serviceList: any[]
  calculationData: CalculationDataProps
  errorMessage: string
  dataTotalCostOrigin: TotalCostTable[]
  totalCostArray?: any[]
}

const CostTable = ({
  agentList,
  modalTitle,
  title,
  costData,
  modal,
  specifications,
  containerItems,
  setUndoMessage,
  undoMessage,
  tableData,
  setTableData,
  setTotalCostData,
  serviceList,
  calculationData,
  errorMessage,
  dataTotalCostOrigin,
  totalCostArray
}: CostTableProps): JSX.Element => {
  const [open, setOpen] = useState(false)
  const [data, setData] = useState<CostTableItem[]>([])
  const [copyTable, setCopyTable] = useState<CostTableItem[]>([])
  const [chargeData, setChargeData] = useState<CostTableItem>(initialState)
  const currencyList = new Map()
  const handleOpen = (): void => setOpen(true)
  const handleClose = (): void => setOpen(false)
  const { proposal }: ProposalProps = useContext(ProposalContext)

  const { data: calculationTypes = [] } = useCalculationTypes()

  const editClickHandler = (tableData: CostTableItem): void => {
    setChargeData({ ...tableData, buyValueCalculated: null, saleValueCalculated: null })
    handleOpen()
  }

  const removeClickHandler = (id: number | null): void => {
    setCopyTable(data)
    const newTableData = [...data]
    setData(newTableData.filter((data) => data.id !== id))
    if (title === I18n.t('pages.newProposal.step6.origin')) {
      setUndoMessage({ step3: false, step6origin: true, step6destiny: false, step5: false })
    } else {
      setUndoMessage({ step3: false, step6origin: false, step6destiny: true, step5: false })
    }
  }

  const addClickHandler = (): void => {
    setChargeData(initialState)
    setUndoMessage({ step3: false, step6origin: false, step6destiny: false, step5: false })
    handleOpen()
  }

  const handleAdd = (item: CostTableItem): void => {
    if (item.id !== null) {
      const editData = [...data]
      const index = editData.findIndex((i) => i.id === item.id)
      editData[index] = item
      setData(editData)
    } else {
      const MaxValue = data.length
      const newItem = { ...item, id: MaxValue + 1 }
      setData([...data, newItem])
    }
  }

  useEffect(() => {
    setTableData(data)
    setTotalCostData(Array.from(currencyList, ([name, value]) => ({ name, value })))
  }, [data])

  useEffect(() => {
    const copyData = containerItems.length > 0
      ? data.filter(item => (containerItems.findIndex(container => item.selectedContainer === container.type) !== -1) || item.selectedContainer === null).map((item) => {
        const indexContainer = containerItems.findIndex(container => item.selectedContainer === container.type)

        const newData = {
          costType: GetNamesByID.getTxCalculationTypeById(calculationTypes, item.idCalculationType),
          quantityContainer: specifications === 'fcl' ? Number(containerItems[indexContainer].amount) : 0,
          valueGrossWeight: isNaN(Number(calculationData?.weight)) ? 0 : calculationData?.weight,
          valueCubage: isNaN(Number(calculationData?.cubage)) ? 0 : calculationData?.cubage,
          valueWeightCubed: isNaN(Number(calculationData?.cubageWeight)) ? 0 : calculationData?.cubageWeight,
          valuePurchase: Number(item.buyValue),
          valueSale: Number(item.saleValue),
          idCurrencyPurchase: item.buyCurrency,
          idCurrencySale: item.saleCurrency,
          valuePurchaseCW: item.type === 'CW' ? proposal.cargo[0].vlCwPurchase : null,
          valueSaleCW: item.type === 'CW' ? proposal.cargo[0].vlCwSale : null
        }

        void (async function () {
          await API.postTotalCalculation(newData)
            .then((response) => {
              item.buyValueCalculated = response.valuePurchase
              item.saleValueCalculated = response.valueSale
              item.buyCurrency = response.idCurrencyPurchase
              item.saleCurrency = response.idCurrencySale
            })
            .catch((err) => console.log(err))
        })()
        calculateTotalCost(item.buyCurrency, item.saleCurrency, item.buyValueCalculated, item.saleValueCalculated, item.buyMin, item.saleMin)
        return item
      })
      : []
    setData(copyData)
  }, [calculationData, containerItems, proposal?.cargo[0]])

  useEffect(() => {
    setCopyTable([])
    setChargeData(initialState)
    setData([])
    setUndoMessage({ step3: false, step6origin: false, step6destiny: false, step5: false })
  }, [modal])

  const waitLoadAllData = async (): Promise<void> => {
    const totalFreight = totalCostArray?.find((total) => total.costType === CostTypes.Freight)
    const totalTariff = totalCostArray?.find((total) => total.costType === CostTypes.Tariff)
    const allData = tableData.map(async (item): Promise<CostTableItem> => {
      const indexContainer = containerItems.findIndex(container => item.selectedContainer === container.type)
      const data = {
        costType: item.idCalculationType,
        quantityContainer: specifications === 'fcl' ? Number(containerItems[indexContainer]?.amount) : 0,
        valueGrossWeight: isNaN(Number(calculationData?.weight)) ? 0 : calculationData?.weight,
        valueCubage: isNaN(Number(calculationData?.cubage)) ? 0 : calculationData?.cubage,
        valueWeightCubed: isNaN(Number(calculationData?.cubageWeight)) ? 0 : calculationData?.cubageWeight,
        valuePurchase: Number(item.buyValue),
        valueSale: Number(item.saleValue),
        idCurrencyPurchase: item.buyCurrency,
        idCurrencySale: item.saleCurrency
      }
      const totalCalculationData =
      GetNamesByID.getTxCalculationTypeById(calculationTypes, data.costType) === FareItemsTypes.Cw
        ? {
            ...data,
            costType: GetNamesByID.getTxCalculationTypeById(calculationTypes, data.costType),
            valuePurchaseCW: proposal.cargo[0].vlCwPurchase,
            valueSaleCW: proposal.cargo[0].vlCwSale
          }
        : GetNamesByID.getTxCalculationTypeById(calculationTypes, data.costType) === FareItemsTypes.Fdesp
          ? {
              ...data,
              costType: GetNamesByID.getTxCalculationTypeById(calculationTypes, data.costType),
              valueTotalOriginPurchase: dataTotalCostOrigin.length > 0 ? dataTotalCostOrigin[0].value?.buy : 0,
              valueTotalOriginSale: dataTotalCostOrigin.length > 0 ? dataTotalCostOrigin[0].value?.sale : 0,
              valueTotalFreight: totalFreight ? totalFreight.valueTotalSale : 0,
              valueTotalTariff: totalTariff ? totalTariff.valueTotalSale : 0
            }
          : { ...data, valuePurchaseCW: null, valueSaleCW: null, costType: GetNamesByID.getTxCalculationTypeById(calculationTypes, data.costType) }
      return await API.postTotalCalculation(totalCalculationData)
        .then((response): CostTableItem => {
          return {
            ...item,
            buyValueCalculated: response.valuePurchase,
            saleValueCalculated: response.valueSale
          }
        })
        .catch(() => {
          return {
            ...item
          }
        })
    })
    const newTableData = await Promise.all(allData)
    setData([...newTableData])
  }

  useEffect(() => {
    if (tableData.length > 0) {
      void waitLoadAllData()
    }
  }, [])

  useEffect(() => {
    if (tableData.length > 0 && modalTitle === I18n.t('pages.newProposal.step6.destinationCost')) {
      void waitLoadAllData()
    }
  }, [dataTotalCostOrigin])

  const calculateTotalCost = (buyCurrency, saleCurrency, buyValue, saleValue, buyMin, saleMin): void => {
    const buySum = Number(buyValue) > Number(buyMin) ? buyValue : buyMin
    const saleSum = Number(saleValue) > Number(saleMin) ? saleValue : saleMin

    if ((buyCurrency !== null && saleCurrency !== '') && buyCurrency === saleCurrency) {
      currencyList.has(String(buyCurrency))
        ? currencyList.set(String(buyCurrency), {
          buy: Number(currencyList.get(String(buyCurrency)).buy) + Number(buySum),
          sale: Number(currencyList.get(String(saleCurrency)).sale) + Number(saleSum)
        })
        : currencyList.set(String(buyCurrency), { buy: Number(buySum), sale: Number(saleSum) })
    } else {
      if (buyCurrency !== null && buyCurrency !== '') {
        currencyList.has(String(buyCurrency))
          ? currencyList.set(String(buyCurrency), {
            buy: Number(currencyList.get(String(buyCurrency)).buy) + Number(buySum),
            sale: Number(currencyList.get(String(buyCurrency)).sale)
          })
          : currencyList.set(String(buyCurrency), { buy: Number(buySum), sale: 0 })
      }
      if (saleCurrency !== null && saleCurrency !== '') {
        currencyList.has(String(saleCurrency))
          ? currencyList.set(String(saleCurrency), {
            buy: Number(currencyList.get(String(saleCurrency)).buy),
            sale: Number(currencyList.get(String(saleCurrency)).sale) + Number(saleSum)
          })
          : currencyList.set(String(saleCurrency), { buy: 0, sale: Number(saleSum) })
      }
    }
  }

  const type = (item): boolean => {
    return item.type !== 'FIXO' && item.type !== 'BL'
  }

  const getAgentName = (idBusinessPartnerAgent): string => {
    let name = ''
    agentList?.forEach((item): void => {
      if (Number(item.idBusinessPartnerAgent) === Number(idBusinessPartnerAgent)) {
        name = item.agent
      }
    })
    return name
  }

  const costValidation = (): boolean => {
    return costData === 0 || agentList.length < 1 || agentList[0].agent === '' || proposal?.cargo[0].cargoVolumes.length < 1
  }

  const groupByAgent = (): CostTableItem[][] => {
    const result = data.reduce(function (r, a) {
      r[a.agent.idBusinessPartnerAgent] = r[a.agent.idBusinessPartnerAgent] || []
      r[a.agent.idBusinessPartnerAgent].push(a)
      return r
    }, {})
    return Object.values(result)
  }

  return (
    <MainDiv>
      <CostModal
        agentList={agentList}
        dataProp={chargeData}
        handleAdd={handleAdd}
        open={open}
        setClose={handleClose}
        title={modalTitle}
        modal={modal}
        specifications={specifications}
        containerItems={containerItems}
        serviceList={serviceList}
        calculationData={calculationData}
        dataTotalCostOrigin={dataTotalCostOrigin}
        totalCostArray={totalCostArray}
      />
      <Header>
        <Title>
          {title}
          {modal === ModalTypes.Land || <RedColorSpan> *</RedColorSpan> }
        </Title>
      </Header>
      {data.length > 0 && groupByAgent().map((dataByAgent: CostTableItem[], index: number) => {
        return (
          <div key={index}>
            {title !== I18n.t('pages.newProposal.step6.destiny') &&
              <Grid container spacing={0}>
                <Grid item xs={1}>
                  <FormLabel component='legend'>
                    {I18n.t('pages.newProposal.step5.agent')}:
                  </FormLabel>
                </Grid>
                <Grid item xs={11}>
                  <FormLabel component='legend'>
                    <strong id={TARIFF_COST_TABLE_SPAN_AGENT}>
                      {getAgentName(dataByAgent[0].agent.idBusinessPartnerAgent) }
                    </strong>
                  </FormLabel>
                </Grid>
              </Grid>
            }
            <StyledTable>
              <TableHead>
                <TableHeadRow>
                  <StyledTableCell width="14%">
                    {I18n.t('components.costTable.description')}
                  </StyledTableCell>
                  <StyledTableCell width="11%" align="left">
                    {I18n.t('components.costTable.type')}
                  </StyledTableCell>
                  <StyledTableCell width="12%" align="left">
                    {I18n.t('components.costTable.minBuy')}
                  </StyledTableCell>
                  <StyledTableCell width="11%" align="left">
                    {I18n.t('components.costTable.buy')}
                  </StyledTableCell>
                  <StyledTableCell width="11%" align="left">
                    {I18n.t('components.costTable.minSale')}
                  </StyledTableCell>
                  <StyledTableCell width="11%" align="left">
                    {I18n.t('components.costTable.sale')}
                  </StyledTableCell>
                </TableHeadRow>
              </TableHead>
              <TableBody>
              {dataByAgent.map((dataMap: CostTableItem) => {
                calculateTotalCost(dataMap.buyCurrency, dataMap.saleCurrency, dataMap.buyValueCalculated, dataMap.saleValueCalculated, dataMap.buyMin, dataMap.saleMin)
                return (
                <TableRow key={dataMap.id}>
                  <StyledTableCell width="14%" component="th" scope="row">
                    <Description>{dataMap.description}</Description>
                  </StyledTableCell>
                  <StyledTableCell width="11%" align="left">
                    <Type>{GetNamesByID.getTxCalculationTypeById(calculationTypes, dataMap.idCalculationType)}</Type>
                  </StyledTableCell>
                  <StyledTableCell width="13%" align="left">
                    {dataMap.buyMin !== null && dataMap.buyMin !== ''
                      ? <Default>
                        {dataMap.buyCurrency} {Number(dataMap.buyMin).toFixed(2).replace('.', ',')}
                      </Default>
                      : <Default>-</Default>
                    }
                  </StyledTableCell>
                  <StyledTableCell width="13%" align="left">
                    {dataMap.buyValueCalculated !== null && dataMap.buyValueCalculated !== '' && Number(dataMap.buyValueCalculated) !== 0.00
                      ? <Default>
                        {dataMap.buyCurrency} {Number(dataMap.buyValueCalculated).toFixed(2).replace('.', ',')}
                      </Default>
                      : <Default>-</Default>
                    }
                    {
                      type(dataMap) && dataMap.buyValue !== null && dataMap.buyValue !== ''
                        ? <SecondaryValue>
                          ({dataMap.buyCurrency} {Number(dataMap.buyValue).toFixed(2).replace('.', ',')})
                        </SecondaryValue>
                        : null
                    }
                  </StyledTableCell>
                  <StyledTableCell width="13%" align="left">
                    {dataMap.saleMin !== null && dataMap.saleMin !== ''
                      ? <Default>
                        {dataMap.saleCurrency} {Number(dataMap.saleMin).toFixed(2).replace('.', ',')}
                      </Default>
                      : <Default>-</Default>
                    }
                  </StyledTableCell>
                  <StyledTableCell width="13%" align="left">
                    {dataMap.saleValueCalculated !== null && dataMap.saleValueCalculated !== '' && Number(dataMap.saleValueCalculated) !== 0.00
                      ? <Default>
                        {dataMap.saleCurrency} {Number(dataMap.saleValueCalculated).toFixed(2).replace('.', ',')}
                      </Default>
                      : <Default>-</Default>
                    }
                    {
                      type(dataMap) && dataMap.saleValue !== null && dataMap.saleValue !== ''
                        ? <SecondaryValue>
                          ({dataMap.saleCurrency} {Number(dataMap.saleValue).toFixed(2).replace('.', ',')})
                        </SecondaryValue>
                        : null
                    }
                  </StyledTableCell>
                  <StyledTableCell width="11%">
                    <RowReverseDiv>
                      <DeleteIconDiv>
                        <RemoveIcon onClick={() => { removeClickHandler(dataMap.id) }} />
                      </DeleteIconDiv>
                      <EditIconDiv>
                        <EditIcon onClick={() => { editClickHandler(dataMap) }} />
                      </EditIconDiv>
                    </RowReverseDiv>
                  </StyledTableCell>
                </TableRow>)
              })}
              </TableBody>
            </StyledTable>
          </div>
        )
      })}
      <Footer style={data?.length > 0 ? { borderTop: '1px solid #999DAC' } : { border: 'none' }}>
        {data?.length === 0
          ? <ButtonContainer>
            <Button
              text={I18n.t('components.costTable.addCost')}
              backgroundGreen={false}
              icon={'add'}
              onAction={addClickHandler}
              disabled={costValidation()}
              tooltip={
                costValidation()
                  ? I18n.t('components.costTable.addCostTooltip')
                  : I18n.t('components.costTable.addCost')
              }
            />
            <ErrorText>{errorMessage}</ErrorText>
          </ButtonContainer>
          : <StyledTable>
            <TableBody>
              {Array.from(currencyList, ([name, value]) => ({ name, value })).map((currency, index) => {
                return (
                  <TableRow key={index}>
                    <StyledTableCell width="25%" align="left" className="noBorder noPadding">
                      {
                        index === 0
                          ? <Button
                            text={I18n.t('components.costTable.addCost')}
                            backgroundGreen={false}
                            icon={'add'}
                            onAction={addClickHandler}
                            disabled={agentList.length < 1 || agentList[0].agent === '' || proposal?.cargo[0].cargoVolumes.length < 1 }
                            tooltip={
                              costValidation()
                                ? I18n.t('components.costTable.addCostTooltip')
                                : I18n.t('components.costTable.addCost')
                            }
                          />
                          : null
                      }
                    </StyledTableCell>
                    <StyledTableCell width="12%" align="left" className="noBorder" />
                    <StyledTableCell width="13%" align="right" className="noBorder">
                      <TotalCostLabel>Total {currency.name}:</TotalCostLabel>
                    </StyledTableCell>
                    <StyledTableCell width="13%" align="left" className="noBorder">
                      {
                        currency.value.buy !== null && currency.value.buy !== '' && currency.value.buy !== 0
                          ? <TotalCostLabel>
                            {Number(currency.value.buy).toFixed(2).replace('.', ',')}
                          </TotalCostLabel>
                          : <TotalCostLabel>-</TotalCostLabel>
                      }
                    </StyledTableCell>
                    <StyledTableCell width="13%" align="left" className="noBorder" />
                    <StyledTableCell width="13%" align="left" className="noBorder">
                      {
                        currency.value.sale !== null && currency.value.sale !== '' && currency.value.sale !== 0
                          ? <TotalCostLabel>
                            {Number(currency.value.sale).toFixed(2).replace('.', ',')}
                          </TotalCostLabel>
                          : <TotalCostLabel>-</TotalCostLabel>
                      }
                    </StyledTableCell>
                    <StyledTableCell width="11%" className="noBorder" />
                  </TableRow>
                )
              })}
            </TableBody>
          </StyledTable>
        }
      </Footer>
      {(((title === I18n.t('pages.newProposal.step6.origin')) && undoMessage.step6origin) ||
        ((title === I18n.t('pages.newProposal.step6.destiny')) && undoMessage.step6destiny)) &&
        <MessageContainer>
          <Messages
            closable={true}
            severity='success'
            buttonText={I18n.t('pages.newProposal.step3.messageUndoDelete')}
            closeAlert={() => { setUndoMessage({ step3: false, step6origin: false, step6destiny: false, step5: false }) }}
            closeMessage=''
            goBack={() => { setData(copyTable); setUndoMessage({ step3: false, step6origin: false, step6destiny: false, step5: false }) }}
            message={I18n.t('pages.newProposal.step3.messageDeleteItem')}
          />
        </MessageContainer>}
    </MainDiv>
  )
}

export default CostTable
