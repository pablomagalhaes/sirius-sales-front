import React, { useEffect, useState } from 'react'

import { TableBody, TableHead, TableRow } from '@material-ui/core'

import {
  CostLabel,
  Default,
  DeleteIconDiv,
  Description,
  EditIconDiv,
  Empty,
  EmptyTableCost,
  EndValueLabel,
  Footer,
  Header,
  MainDiv,
  RowReverseContainer,
  RowReverseDiv,
  StyledTable,
  StyledTableCell,
  TableHeadRow,
  Title,
  TotalCostLabel,
  Type,
  ValueLabel
} from './CostTableStyles'
import EditIcon from '../../../application/icons/EditIcon'
import RemoveIcon from '../../../application/icons/RemoveIcon'
import { I18n } from 'react-redux-i18n'
import { Button, MoneyValue } from 'fiorde-fe-components'
import CostModal, { CostTableItem, initialState } from '../CostModal/CostModal'
interface CostTableProps {
  title: string
  totalCostLabel: string
  modalTitle: string
  costData: any
  modal: string
  specifications: string
  changeTableFill: (arg: number) => void
}

const CostTable = ({
  modalTitle,
  title,
  totalCostLabel,
  costData,
  modal,
  specifications,
  changeTableFill
}: CostTableProps): JSX.Element => {
  const [open, setOpen] = useState(false)
  const [data, setData] = useState<CostTableItem[]>([])
  const [chargeData, setChargeData] = useState<CostTableItem>(initialState)
  const currencyList = new Map()
  const handleOpen = (): void => setOpen(true)
  const handleClose = (): void => setOpen(false)

  const editClickHandler = (tableData: CostTableItem): void => {
    setChargeData(tableData)
    handleOpen()
  }

  const removeClickHandler = (id: number | null): void => {
    setData((tableData) => {
      return tableData.filter((data) => data.id !== id)
    })
  }

  const addClickHandler = (): void => {
    setChargeData(initialState)
    handleOpen()
  }

  const handleAdd = (item: CostTableItem): void => {
    if (item.id !== null) {
      const editData = data
      const index = editData.findIndex((i) => i.id === item.id)
      editData[index] = item
      setData(editData)
    } else {
      const newItem = { ...item, id: data.length }
      setData([...data, newItem])
    }
  }

  useEffect(() => {
    changeTableFill(data.length)
  }, [data])

  const calculateTotalCost = (buyCurrency, saleCurrency, buyValue, saleValue): void => {
    if ((buyCurrency !== null && saleCurrency !== '') && buyCurrency === saleCurrency) {
      currencyList.has(String(buyCurrency))
        ? currencyList.set(String(buyCurrency), {
          buy: Number(currencyList.get(String(buyCurrency)).buy) + Number(buyValue),
          sale: Number(currencyList.get(String(saleCurrency)).sale) + Number(saleValue)
        })
        : currencyList.set(String(buyCurrency), { buy: Number(buyValue), sale: Number(saleValue) })
    } else {
      if (buyCurrency !== null && buyCurrency !== '') {
        currencyList.has(String(buyCurrency))
          ? currencyList.set(String(buyCurrency), {
            buy: Number(currencyList.get(String(buyCurrency)).buy) + Number(buyValue),
            sale: Number(currencyList.get(String(buyCurrency)).sale)
          })
          : currencyList.set(String(buyCurrency), { buy: Number(buyValue), sale: 0 })
      }
      if (saleCurrency !== null && saleCurrency !== '') {
        currencyList.has(String(saleCurrency))
          ? currencyList.set(String(saleCurrency), {
            buy: Number(currencyList.get(String(saleCurrency)).buy),
            sale: Number(currencyList.get(String(saleCurrency)).sale) + Number(saleValue)
          })
          : currencyList.set(String(saleCurrency), { buy: 0, sale: Number(saleValue) })
      }
    }
  }

  return (
    <MainDiv>
      <CostModal
        dataProp={chargeData}
        handleAdd={handleAdd}
        open={open}
        setClose={handleClose}
        title={modalTitle}
        modal={modal}
        specifications={specifications}
      />
      <Header>
        <Title>{title}</Title>
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
              <StyledTableCell width="11%" align="left">
                {I18n.t('components.costTable.buy')}
              </StyledTableCell>
              <StyledTableCell width="12%" align="left">
                {I18n.t('components.costTable.minBuy')}
              </StyledTableCell>
              <StyledTableCell width="11%" align="left">
                {I18n.t('components.costTable.sale')}
              </StyledTableCell>
              <StyledTableCell width="11%" align="left">
                {I18n.t('components.costTable.minSale')}
              </StyledTableCell>
              <StyledTableCell width="11%" align="left">
                {I18n.t('components.costTable.agent')}
              </StyledTableCell>
            </TableHeadRow>
          </TableHead>
          <TableBody>
            {data?.map((dataMap: CostTableItem) => {
              calculateTotalCost(dataMap.buyCurrency, dataMap.saleCurrency, dataMap.buyValue, dataMap.saleValue)
              return (
                <TableRow key={dataMap.id}>
                  <StyledTableCell width="14%" component="th" scope="row">
                    <Description>{dataMap.description}</Description>
                  </StyledTableCell>
                  <StyledTableCell width="11%" align="left">
                    <Type>{dataMap.type}</Type>
                  </StyledTableCell>
                  <StyledTableCell width="11%" align="left">
                    {dataMap.buyValue !== null && dataMap.buyValue !== ''
                      ? <Default>
                        <MoneyValue
                          currency={String(dataMap.buyCurrency)}
                          language="pt-br"
                          style={{ width: '55px' }}
                          value={Number(dataMap.buyValue)}
                        />
                      </Default>
                      : <Empty>{I18n.t('components.costTable.inform')}</Empty>
                    }
                  </StyledTableCell>
                  <StyledTableCell width="12%" align="left">
                    {dataMap.buyMin !== null && dataMap.buyMin !== ''
                      ? <Default>
                        <MoneyValue
                          currency={String(dataMap.buyCurrency)}
                          language="pt-br"
                          style={{ width: '55px' }}
                          value={Number(dataMap.buyMin)}
                        />
                      </Default>
                      : <Empty>{I18n.t('components.costTable.inform')}</Empty>
                    }
                  </StyledTableCell>
                  <StyledTableCell width="11%" align="left">
                    {dataMap.saleValue !== null && dataMap.saleValue !== ''
                      ? <Default>
                        <MoneyValue
                          currency={String(dataMap.saleCurrency)}
                          language="pt-br"
                          style={{ width: '55px' }}
                          value={Number(dataMap.saleValue)}
                        />
                      </Default>
                      : <Empty>{I18n.t('components.costTable.inform')}</Empty>
                    }
                  </StyledTableCell>
                  <StyledTableCell width="11%" align="left">
                    {dataMap.saleMin !== null && dataMap.saleMin !== ''
                      ? <Default>
                        <MoneyValue
                          currency={String(dataMap.saleCurrency)}
                          language="pt-br"
                          style={{ width: '55px' }}
                          value={Number(dataMap.saleMin)}
                        />
                      </Default>
                      : <Empty>{I18n.t('components.costTable.inform')}</Empty>
                    }
                  </StyledTableCell>
                  <StyledTableCell width="11%" align="left">
                    {dataMap.agent != null
                      ? <Default>{dataMap.agent}</Default>
                      : <Empty>{I18n.t('components.costTable.inform')}</Empty>
                    }
                  </StyledTableCell>
                  <StyledTableCell width="19%">
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
      <Footer>
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

        {data?.length === 0
          ? <RowReverseDiv>
            <EndValueLabel>
              <EmptyTableCost>-</EmptyTableCost>
            </EndValueLabel>
            <CostLabel>{I18n.t('components.costTable.sale')}:</CostLabel>
            <ValueLabel>
              <EmptyTableCost>-</EmptyTableCost>
            </ValueLabel>
            <CostLabel>{I18n.t('components.costTable.buy')}:</CostLabel>
            <TotalCostLabel>{totalCostLabel}</TotalCostLabel>
          </RowReverseDiv>
          : <RowReverseDiv>
            <RowReverseContainer>
              {Array.from(currencyList, ([name, value]) => ({ name, value })).map((currency, index) => {
                return (
                  <RowReverseDiv key={index}>
                    <EndValueLabel>
                      <MoneyValue
                        currency={currency.name}
                        language="pt-br"
                        style={{ width: '80px' }}
                        value={currency.value.sale}
                      />
                    </EndValueLabel>
                    <CostLabel>{I18n.t('components.costTable.sale')}:</CostLabel>
                    <ValueLabel>
                      <MoneyValue
                        currency={currency.name}
                        language="pt-br"
                        style={{ width: '80px' }}
                        value={currency.value.buy}
                      />
                    </ValueLabel>
                    <CostLabel>{I18n.t('components.costTable.buy')}:</CostLabel>
                    <CostLabel>{currency.name}</CostLabel>
                    {index === 0
                      ? <TotalCostLabel>{totalCostLabel}</TotalCostLabel>
                      : null
                    }
                  </RowReverseDiv>
                )
              })}
            </RowReverseContainer>
          </RowReverseDiv>
        }
      </Footer>
    </MainDiv>
  )
}

export default CostTable
