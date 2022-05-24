import React, { useEffect, useState } from 'react'

import { TableBody, TableHead, TableRow } from '@material-ui/core'

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
import { TotalCostTable } from '../../pages/NewProposal/steps/Step5'
import API from '../../../infrastructure/api'

interface CostTableProps {
  agentList: string[]
  title: string
  totalCostLabel: string
  modalTitle: string
  costData: any
  modal: string
  specifications: string
  containerItems: ItemModalData[]
  setUndoMessage: React.Dispatch<React.SetStateAction<{
    step3: boolean
    step5origin: boolean
    step5destiny: boolean
    step6: boolean
  }>>
  undoMessage: { step3: boolean, step5origin: boolean, step5destiny: boolean, step6: boolean }
  tableData: CostTableItem[]
  setTableData: React.Dispatch<React.SetStateAction<CostTableItem[]>>
  setTotalCostData: React.Dispatch<React.SetStateAction<TotalCostTable[]>>
  serviceList: any[]
  calculationData: CalculationDataProps
  errorMessage: string
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
  errorMessage
}: CostTableProps): JSX.Element => {
  const [open, setOpen] = useState(false)
  const [data, setData] = useState<CostTableItem[]>([])
  const [copyTable, setCopyTable] = useState<CostTableItem[]>([])
  const [chargeData, setChargeData] = useState<CostTableItem>(initialState)
  const currencyList = new Map()
  const handleOpen = (): void => setOpen(true)
  const handleClose = (): void => setOpen(false)

  const editClickHandler = (tableData: CostTableItem): void => {
    setChargeData({ ...tableData, buyValueCalculated: null, saleValueCalculated: null })
    handleOpen()
  }

  const removeClickHandler = (id: number | null): void => {
    setCopyTable(data)
    const newTableData = [...data]
    setData(newTableData.filter((data) => data.id !== id))
    if (title === I18n.t('pages.newProposal.step5.origin')) {
      setUndoMessage({ step3: false, step5origin: true, step5destiny: false, step6: false })
    } else {
      setUndoMessage({ step3: false, step5origin: false, step5destiny: true, step6: false })
    }
  }

  const addClickHandler = (): void => {
    setChargeData(initialState)
    setUndoMessage({ step3: false, step5origin: false, step5destiny: false, step6: false })
    handleOpen()
  }

  const handleAdd = (item: CostTableItem): void => {
    if (item.id !== null) {
      const editData = [...data]
      const index = editData.findIndex((i) => i.id === item.id)
      editData[index] = item
      setData(editData)
    } else {
      const newItem = { ...item, id: data.length }
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
          costType: item.type,
          quantityContainer: specifications === 'fcl' ? Number(containerItems[indexContainer].amount) : 0,
          valueGrossWeight: isNaN(Number(calculationData?.weight)) ? 0 : calculationData?.weight,
          valueCubage: isNaN(Number(calculationData?.cubage)) ? 0 : calculationData?.cubage,
          valueWeightCubed: isNaN(Number(calculationData?.cubageWeight)) ? 0 : calculationData?.cubageWeight,
          valuePurchase: Number(item.buyValue),
          valueSale: Number(item.saleValue),
          idCurrencyPurchase: item.buyCurrency,
          idCurrencySale: item.saleCurrency
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
  }, [calculationData, containerItems])

  useEffect(() => {
    setCopyTable([])
    setChargeData(initialState)
    setData([])
    setUndoMessage({ step3: false, step5origin: false, step5destiny: false, step6: false })
  }, [modal])

  useEffect(() => {
    if (tableData.length > 0) {
      const waitLoadAllData = async (): Promise<void> => {
        for (const item of tableData) {
          const indexContainer = containerItems.findIndex(container => item.selectedContainer === container.type)
          const data = {
            costType: item.type,
            quantityContainer: specifications === 'fcl' ? Number(containerItems[indexContainer]?.amount) : 0,
            valueGrossWeight: isNaN(Number(calculationData?.weight)) ? 0 : calculationData?.weight,
            valueCubage: isNaN(Number(calculationData?.cubage)) ? 0 : calculationData?.cubage,
            valueWeightCubed: isNaN(Number(calculationData?.cubageWeight)) ? 0 : calculationData?.cubageWeight,
            valuePurchase: Number(item.buyValue),
            valueSale: Number(item.saleValue),
            idCurrencyPurchase: item.buyCurrency,
            idCurrencySale: item.saleCurrency
          }
          void await new Promise<void>((resolve) => {
            API.postTotalCalculation(data)
              .then((response) => {
                item.buyValueCalculated = response.valuePurchase
                item.saleValueCalculated = response.valueSale
                resolve()
              })
              .catch((err) => console.log(err))
          })
        }
      }
      void waitLoadAllData()
      setData(tableData)
    }
  }, [])

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
      />
      <Header>
        <Title>
          {title}
          <RedColorSpan> *</RedColorSpan>
        </Title>
      </Header>
      {data?.length > 0 && (
        <StyledTable>
          <TableHead>
            <TableHeadRow>
              <StyledTableCell width="14%">
                {I18n.t('components.costTable.description')}
              </StyledTableCell>
              <StyledTableCell width="11%" align="left">
                {I18n.t('components.costTable.type')}
              </StyledTableCell>
              {
                title === I18n.t('pages.newProposal.step5.destiny')
                  ? null
                  : <StyledTableCell width="11%" align="left">
                    {I18n.t('components.costTable.agent')}
                  </StyledTableCell>
              }
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
            {data?.map((dataMap: CostTableItem) => {
              calculateTotalCost(dataMap.buyCurrency, dataMap.saleCurrency, dataMap.buyValueCalculated, dataMap.saleValueCalculated, dataMap.buyMin, dataMap.saleMin)
              return (
                <TableRow key={dataMap.id}>
                  <StyledTableCell width="14%" component="th" scope="row">
                    <Description>{dataMap.description}</Description>
                  </StyledTableCell>
                  <StyledTableCell width="11%" align="left">
                    <Type>{dataMap.type}</Type>
                  </StyledTableCell>
                  {
                    title === I18n.t('pages.newProposal.step5.destiny')
                      ? null
                      : <StyledTableCell width="12%" align="left">
                        {dataMap.agent != null
                          ? <Default>{dataMap.agent}</Default>
                          : <Default>-</Default>
                        }
                      </StyledTableCell>
                  }
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
                </TableRow>
              )
            })}
          </TableBody>
        </StyledTable>
      )}
      <Footer style={data?.length > 0 ? { borderTop: '1px solid #999DAC' } : { border: 'none' }}>
        {data?.length === 0
          ? <ButtonContainer>
            <Button
              text={I18n.t('components.costTable.addCost')}
              backgroundGreen={false}
              icon={'add'}
              onAction={addClickHandler}
              disabled={costData === 0}
              tooltip={
                costData === 0
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
                            disabled={costData === 0}
                            tooltip={
                              costData === 0
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
                            {currency.name} {Number(currency.value.buy).toFixed(2).replace('.', ',')}
                          </TotalCostLabel>
                          : <TotalCostLabel>-</TotalCostLabel>
                      }
                    </StyledTableCell>
                    <StyledTableCell width="13%" align="left" className="noBorder" />
                    <StyledTableCell width="13%" align="left" className="noBorder">
                      {
                        currency.value.sale !== null && currency.value.sale !== '' && currency.value.sale !== 0
                          ? <TotalCostLabel>
                            {currency.name} {Number(currency.value.sale).toFixed(2).replace('.', ',')}
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
      {(((title === I18n.t('pages.newProposal.step5.origin')) && undoMessage.step5origin) ||
        ((title === I18n.t('pages.newProposal.step5.destiny')) && undoMessage.step5destiny)) &&
        <MessageContainer>
          <Messages
            closable={true}
            severity='success'
            buttonText={I18n.t('pages.newProposal.step3.messageUndoDelete')}
            closeAlert={() => { setUndoMessage({ step3: false, step5origin: false, step5destiny: false, step6: false }) }}
            closeMessage=''
            goBack={() => { setData(copyTable); setUndoMessage({ step3: false, step5origin: false, step5destiny: false, step6: false }) }}
            message={I18n.t('pages.newProposal.step3.messageDeleteItem')}
          />
        </MessageContainer>}
    </MainDiv>
  )
}

export default CostTable
