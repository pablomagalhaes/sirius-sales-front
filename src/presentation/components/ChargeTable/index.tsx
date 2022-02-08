import React from 'react'
import { Table, TableBody, TableCell, TableContainer, TableHead } from '@material-ui/core/'
import EditIcon from '../../../application/icons/EditIcon'
import RemoveIcon from '../../../application/icons/RemoveIcon'
import { IconsContainer, IndividualIconContainer, TableHeader, StyledTableRow, BottomRow, StyledTableCell } from './style'
import { ItemModalData } from '../ItemModal/ItemModal'
import { I18n } from 'react-redux-i18n'

interface ChargeTableProps {
  charges: ItemModalData[]
  onEdit: (row: ItemModalData) => void
  onDelete: (index: number) => void
}

const ChargeTable = ({ charges, onEdit, onDelete }: ChargeTableProps): JSX.Element => {
  const tableHeaders = ['Item #', `${String(I18n.t('components.itemModal.qnt'))}.`, String(I18n.t('components.itemModal.type')), String(I18n.t('components.itemModal.rawWeight')), String(I18n.t('components.itemModal.cubage')), String(I18n.t('components.itemModal.hwl')), String(I18n.t('components.itemModal.diameter')), String(I18n.t('components.itemModal.imo'))]
  let weight = 0
  let cubage = 0

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <StyledTableRow noBorder>
            {tableHeaders.map((item) => (
              <TableCell key={`table-header-${item}`}>
                <TableHeader>{item}</TableHeader>
              </TableCell>
            ))}
          </StyledTableRow>
        </TableHead>
        <TableBody>
          {charges.map((row: ItemModalData, i) => {
            cubage += Number(row.cubage.replace(',', '.'))
            weight += Number(row.rawWeight.replace(',', '.'))
            return (
              <StyledTableRow key={i} noBorder={i + 1 === charges.length}>
                <TableCell component="th" scope="row">
                  {i + 1}
                </TableCell>
                <TableCell>{row.amount}</TableCell>
                <TableCell>{row.type.toUpperCase()}</TableCell>
                <TableCell>{Number(row.rawWeight.replace(',', '.')).toFixed(2).replace('.', ',')}</TableCell>
                <TableCell>{Number(row.cubage.replace(',', '.')).toFixed(3).replace('.', ',')}</TableCell>
                <TableCell>{Number(row.length.replace(',', '.')).toFixed(2).replace('.', ',')} x {Number(row.width.replace(',', '.')).toFixed(2).replace('.', ',')} x {Number(row.height.replace(',', '.')).toFixed(2).replace('.', ',')} </TableCell>
                <TableCell>{row.diameter !== null ? row.diameter : '-'}</TableCell>
                <TableCell>{row.imo !== null ? row.imo : '-'}</TableCell>
                <TableCell align="right">
                  <IconsContainer>
                    <IndividualIconContainer>
                      <EditIcon onClick={() => onEdit(row)} />
                    </IndividualIconContainer>
                    <IndividualIconContainer>
                      <RemoveIcon onClick={() => onDelete(i)} />
                    </IndividualIconContainer>
                  </IconsContainer>
                </TableCell>
              </StyledTableRow>
            )
          })}
          <BottomRow>
            <TableCell><b>Total:</b></TableCell>
            <TableCell>{charges.length} volume(s)</TableCell>
            <TableCell />
            <TableCell><b>{I18n.t('components.itemModal.rawWeight')}</b>{Number(weight).toFixed(2).replace('.', ',')} kg</TableCell>
            <TableCell><b>{I18n.t('components.itemModal.cubage')}</b>{Number(cubage).toFixed(2).replace('.', ',')}</TableCell>
            <TableCell><b>{I18n.t('components.itemModal.cubageWeight')}</b>400,86</TableCell>
            <TableCell />
            <TableCell />
            <StyledTableCell align="center"><b>CW: 5.76</b></StyledTableCell>
          </BottomRow>
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default ChargeTable
