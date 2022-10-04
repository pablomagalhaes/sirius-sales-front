import React from 'react'
import { I18n } from 'react-redux-i18n'

import EditIcon from '../../../application/icons/EditIcon'
import RemoveIcon from '../../../application/icons/RemoveIcon'

import { FareModalData } from '../FareModal/FareModal'
import { TableHead, TableBody, TableCell } from '@material-ui/core'
import {
  DeleteIconDiv,
  EditIconDiv,
  FormatValue,
  RowReverseDiv,
  StyledRow,
  StyledTable,
  StyledTableCell,
  StyledTableRow,
  TableHeader
} from './style'

interface TableData {
  costData: any
  data?: FareModalData[]
  dataFields: any
  edit?: (tableData: FareModalData) => void
  modal: string
  remove?: (id: number | null) => void
  specifications: string
}

const SurchargeTable = ({ data, dataFields, remove, edit }: TableData): JSX.Element => {
  const verifyType = (item): JSX.Element => {
    if (item.type === 'FIXO' || item.type === 'BL') {
      return (
        <FormatValue>
          {dataFields.currencySale} {item.saleValue}
        </FormatValue>
      )
    } else {
      return (
        <FormatValue>
          {dataFields.currencySale} {item.totalItem}
        </FormatValue>
      )
    }
  }

  if (data != null && data.length > 0) {
    return (
      <StyledTable>
        <TableHead>
          <StyledTableRow noBorder>
            <TableCell>
              <TableHeader>{I18n.t('pages.newProposal.step6.expense')}</TableHeader>
            </TableCell>
            <TableCell>
              <TableHeader>{I18n.t('pages.newProposal.step6.agent')}</TableHeader>
            </TableCell>
            <TableCell>
              <TableHeader>{I18n.t('pages.newProposal.step6.type')}</TableHeader>
            </TableCell>
            <TableCell>
              <TableHeader>{I18n.t('pages.newProposal.step6.minValue')}</TableHeader>
            </TableCell>
            <TableCell>
              <TableHeader>{I18n.t('pages.newProposal.step6.colValue')}</TableHeader>
            </TableCell>
            <TableCell>
              <TableHeader>{I18n.t('pages.newProposal.step6.totalItem')}</TableHeader>
            </TableCell>
            <TableCell>
              <TableHeader></TableHeader>
            </TableCell>
            <TableCell>
              <TableHeader></TableHeader>
            </TableCell>
          </StyledTableRow>
        </TableHead>
        <TableBody>
          {data?.map((item: FareModalData) => {
            return (
              <StyledRow id={item.id} key={item.id}>
                <StyledTableCell width="30%" color={1} component="th" scope="row">
                  {item.expense}
                </StyledTableCell>
                <StyledTableCell width="30%" align="left">
                  {item?.agent?.agent}
                </StyledTableCell>
                <StyledTableCell width="30%" align="left">
                  {item.type}
                </StyledTableCell>
                <StyledTableCell width="100%" align="left">
                  <FormatValue>
                    {item.minimumValue !== '' ? `${String(dataFields.currencySale)} ${item.minimumValue}` : '-'}
                  </FormatValue>
                </StyledTableCell>
                <StyledTableCell width="100%" align="left">
                  <FormatValue>
                    {dataFields.currencySale} {item.saleValue}
                  </FormatValue>
                </StyledTableCell>
                <StyledTableCell width="100%" align="left">
                  {verifyType(item)}
                </StyledTableCell>
                <StyledTableCell width="100%">
                  <RowReverseDiv>
                    <DeleteIconDiv>
                      <RemoveIcon
                        onClick={() => {
                          if (remove != null) remove(item.id)
                        }}
                      />
                    </DeleteIconDiv>
                    <EditIconDiv>
                      <EditIcon
                        onClick={() => {
                          if (edit != null) edit(item)
                        }}
                      />
                    </EditIconDiv>
                  </RowReverseDiv>
                </StyledTableCell>
              </StyledRow>
            )
          })}
        </TableBody>
      </StyledTable>
    )
  }
  return <div></div>
}

export default SurchargeTable
