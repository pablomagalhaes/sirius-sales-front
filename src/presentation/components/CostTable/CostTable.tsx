import React, { useState } from 'react'

import { TableBody, TableHead, TableRow, MenuItem } from '@material-ui/core'

import {
  CostLabel,
  Default,
  Description,
  Empty,
  EndValueLabel,
  Footer,
  Header,
  MainDiv,
  RemoveIconDiv,
  RowReverseDiv,
  StyledTable,
  StyledTableCell,
  TableHeadRow,
  Title,
  TotalCostLabel,
  Type,
  ValueLabel,
  CurrencyLabel,
  StyledSelect
} from './CostTableStyles'
import EditIcon from '../../../application/icons/EditIcon'
import RemoveIcon from '../../../application/icons/RemoveIcon'
import { I18n } from 'react-redux-i18n'
import { Button } from 'fiorde-fe-components'

interface CostTableItem {
  agent?: string
  buy?: string
  desc: string
  id: number
  minBuy?: string
  minSale?: string
  sale?: string
  type?: string
}

interface CostTableProps {
  title: string
  totalCostLabel: string
  currencyLabel: string
}

const CostTable = ({ title, totalCostLabel, currencyLabel }: CostTableProps): JSX.Element => {
  const mock: CostTableItem[] = [
    {
      agent: '-',
      buy: '3%',
      desc: 'DRY 40',
      id: 0,
      minBuy: 'R$ 200,00',
      minSale: 'R$ 25',
      sale: '3%',
      type: 'container'
    },
    {
      buy: '3%',
      desc: 'DRY 40',
      id: 1,
      minBuy: 'R$ 20,00',
      minSale: 'R$ 25',
      sale: '3%',
      type: 'container'
    }
  ]

  const currencyList = ['BRL', 'USD']
  const [data, setData] = useState(mock)
  const [currency, setCurrency] = useState('BRL')
  const [buyValue] = useState(0)
  const [saleValue] = useState(0)
  const formatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2
  })

  const editClickHandler = (tableData: CostTableItem): void => {
    console.log(tableData)
  }

  const removeClickHandler = (id: number): void => {
    setData((tableData) => {
      return tableData.filter((data) => data.id !== id)
    })
  }

  const addClickHandler = (): void => {
    console.log('adicionado')
  }

  const handleCurrencyChange = (e): void => {
    setCurrency(e.target.value)
  }

  return (
    <MainDiv>
      <Header>
        <Title>{title}</Title>
        <RowReverseDiv>
          <StyledSelect onChange={handleCurrencyChange} value={currency} disableUnderline>
            {currencyList.map((currency) => {
              return (
                <MenuItem key={`${currency}_currency`} value={currency}>
                  {currency}
                </MenuItem>
              )
            })}
          </StyledSelect>
          <CurrencyLabel>{currencyLabel}</CurrencyLabel>
        </RowReverseDiv>
      </Header>
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
          {data.map((dataMap) => {
            return (
              <TableRow key={`${dataMap.id}_row`}>
                <StyledTableCell width="14%" component="th" scope="row">
                  <Description>{dataMap.desc}</Description>
                </StyledTableCell>
                <StyledTableCell width="11%" align="left">
                  <Type>{dataMap.type}</Type>
                </StyledTableCell>
                <StyledTableCell width="11%" align="left">
                  {dataMap.buy != null ? (<Default>{dataMap.buy}</Default>) : (<Empty>{I18n.t('components.costTable.inform')}</Empty>)}
                </StyledTableCell>
                <StyledTableCell width="12%" align="left">
                  {dataMap.minBuy != null ? (<Default>{dataMap.minBuy}</Default>) : (<Empty>{I18n.t('components.costTable.inform')}</Empty>)}
                </StyledTableCell>
                <StyledTableCell width="11%" align="left">
                  {dataMap.sale != null ? (<Default>{dataMap.sale}</Default>) : (<Empty>{I18n.t('components.costTable.inform')}</Empty>)}
                </StyledTableCell>
                <StyledTableCell width="11%" align="left">
                  {dataMap.minSale != null ? (<Default>{dataMap.minSale}</Default>) : (<Empty>{I18n.t('components.costTable.inform')}</Empty>)}
                </StyledTableCell>
                <StyledTableCell width="11%" align="left">
                  {dataMap.agent != null ? (<Default>{dataMap.agent}</Default>) : (<Empty>{I18n.t('components.costTable.inform')}</Empty>)}
                </StyledTableCell>
                <StyledTableCell width="19%">
                  <RowReverseDiv>
                    <RemoveIcon
                      onClick={() => {
                        removeClickHandler(dataMap.id)
                      }}
                    />
                    <RemoveIconDiv>
                      <EditIcon
                        onClick={() => {
                          editClickHandler(dataMap)
                        }}
                      />
                    </RemoveIconDiv>
                  </RowReverseDiv>
                </StyledTableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </StyledTable>
      <Footer>
        <Button
          text={I18n.t('components.costTable.addCost')}
          backgroundGreen={false}
          icon={'add'}
          onAction={addClickHandler}
        />
        <RowReverseDiv>
          <EndValueLabel>{formatter.format(saleValue)}</EndValueLabel>
          <CostLabel>{I18n.t('components.costTable.sale')}</CostLabel>
          <ValueLabel>{formatter.format(buyValue)}</ValueLabel>
          <CostLabel>{I18n.t('components.costTable.buy')}</CostLabel>
          <TotalCostLabel>{totalCostLabel}</TotalCostLabel>
        </RowReverseDiv>
      </Footer>
    </MainDiv>
  );
}

export default CostTable
