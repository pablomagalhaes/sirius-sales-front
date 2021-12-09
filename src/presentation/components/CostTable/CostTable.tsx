import React, { useState } from 'react'

import { TableBody, TableHead, TableRow } from '@material-ui/core'

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
  ValueLabel
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
}

const CostTable = ({ title, totalCostLabel }: CostTableProps): JSX.Element => {
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

  const [data, setData] = useState(mock)
  const [buyValue] = useState(0)
  const [saleValue] = useState(0)

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

  return (
    <MainDiv>
      <Header>
        <Title>{title}</Title>
      </Header>
      <StyledTable>
        <TableHead>
          <TableHeadRow>
            <StyledTableCell width="14%">{I18n.t('components.costTable.description')}</StyledTableCell>
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
                  {(dataMap.buy != null) ? <Default>{dataMap.buy}</Default> : <Empty>{I18n.t('components.costTable.inform')}</Empty>}
                </StyledTableCell>
                <StyledTableCell width="12%" align="left">
                  {(dataMap.minBuy != null) ? <Default>{dataMap.minBuy}</Default> : <Empty>{I18n.t('components.costTable.inform')}</Empty>}
                </StyledTableCell>
                <StyledTableCell width="11%" align="left">
                  {(dataMap.sale != null) ? <Default>{dataMap.sale}</Default> : <Empty>{I18n.t('components.costTable.inform')}</Empty>}
                </StyledTableCell>
                <StyledTableCell width="11%" align="left">
                  {(dataMap.minSale != null) ? <Default>{dataMap.minSale}</Default> : <Empty>{I18n.t('components.costTable.inform')}</Empty>}
                </StyledTableCell>
                <StyledTableCell width="11%" align="left">
                  {(dataMap.agent != null) ? <Default>{dataMap.agent}</Default> : <Empty>{I18n.t('components.costTable.inform')}</Empty>}
                </StyledTableCell>
                <StyledTableCell width="19%" >
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
            )
          })}
        </TableBody>
      </StyledTable>
      <Footer>
        <Button text={I18n.t('components.costTable.addCost')} backgroundGreen={false} icon={'add'} onAction={addClickHandler}/>
        <RowReverseDiv>
          <EndValueLabel>{`R$ ${saleValue.toFixed(2)}`}</EndValueLabel>
          <CostLabel>{I18n.t('components.costTable.sale')}</CostLabel>
          <ValueLabel>{`R$ ${buyValue.toFixed(2)}`}</ValueLabel>
          <CostLabel>{I18n.t('components.costTable.buy')}</CostLabel>
          <TotalCostLabel>{totalCostLabel}</TotalCostLabel>
        </RowReverseDiv>
      </Footer>
    </MainDiv>
  )
}

export default CostTable
