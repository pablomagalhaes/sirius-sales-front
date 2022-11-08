import React, { useEffect } from 'react'
import { Table, TableBody, TableCell, TableContainer, TableHead } from '@material-ui/core/'
import EditIcon from '../../../application/icons/EditIcon'
import RemoveIcon from '../../../application/icons/RemoveIcon'
import { IconsContainer, IndividualIconContainer, TableHeader, StyledTableRow, BottomRow } from './style'
import { ItemModalData } from '../ItemModal/ItemModal'
import { I18n } from 'react-redux-i18n'

export interface CalculationDataProps {
  weight: number | null
  cubage: number | null
  cubageWeight: number | null
}

interface ChargeTableProps {
  charges: ItemModalData[]
  onEdit: (row: ItemModalData) => void
  onDelete: (index: number) => void
  specification: string
  modal: string
  setCalculation: (items: CalculationDataProps) => void
}

const ChargeTable = ({ charges, onEdit, onDelete, specification, modal, setCalculation }: ChargeTableProps): JSX.Element => {
  let amount = 0
  let weight = 0
  let cubage = 0
  let cubageWeight = 0

  useEffect(() => {
    setCalculation({ weight, cubage, cubageWeight })
  }, [charges])

  const isLand = (): boolean => {
    return modal === 'LAND'
  }

  const isFCL = (): boolean => {
    return specification === 'fcl' && modal === 'SEA'
  }

  const isAir = (): boolean => {
    return modal === 'AIR'
  }

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <StyledTableRow noBorder>
            <TableCell>
              <TableHeader>Item #</TableHeader>
            </TableCell>
            <TableCell>
              <TableHeader>{String(I18n.t('components.itemModal.qnt'))}</TableHeader>
            </TableCell>
            <TableCell>
              <TableHeader>{String(I18n.t('components.itemModal.type'))}</TableHeader>
            </TableCell>
            {!isFCL() && <TableCell>
              <TableHeader>{String(I18n.t('components.itemModal.rawWeight'))}</TableHeader>
            </TableCell>}
            {!isFCL() && <TableCell>
              <TableHeader>{String(I18n.t('components.itemModal.cubage'))}</TableHeader>
            </TableCell>}
            {!isFCL() && <TableCell>
              <TableHeader>{String(I18n.t('components.itemModal.hwl'))}</TableHeader>
            </TableCell>}
            {(!isLand() && !isFCL()) && <TableCell>
              <TableHeader>{String(I18n.t('components.itemModal.diameter'))}</TableHeader>
            </TableCell>}
          </StyledTableRow>
        </TableHead>
        <TableBody>
          {charges.map((row: ItemModalData, i) => {
            amount += Number(row.amount?.replace(',', '.'))
            cubage += Number(row.cubage?.replace(',', '.'))
            weight += Number(row.rawWeight?.replace(',', '.'))
            cubageWeight = Number(cubage) / 0.006
            return (
              <StyledTableRow key={i} noBorder={i + 1 === charges.length}>
                <TableCell component="th" scope="row">
                  {i + 1}
                </TableCell>
                <TableCell>{row.amount}</TableCell>
                <TableCell>{String(row.type).toUpperCase()}</TableCell>
                {!isFCL() ? <TableCell>{row.rawWeight !== null ? Number(row.rawWeight.replace(',', '.')).toFixed(2).replace('.', ',') : '-'}</TableCell> : <TableCell />}
                {!isFCL() ? <TableCell>{row.cubage !== null ? Number(row.cubage.replace(',', '.')).toFixed(2).replace('.', ',') : '-'}</TableCell> : <TableCell />}
                {!isFCL() ? <TableCell>{row.length !== null && row.width !== null && row.height !== null ? `${Number(row.length.replace(',', '.')).toFixed(2).replace('.', ',')} x ${Number(row.width.replace(',', '.')).toFixed(2).replace('.', ',')} x ${Number(row.height.replace(',', '.')).toFixed(2).replace('.', ',')}` : '-'}</TableCell> : <TableCell />}
                {(!isLand() && !isFCL()) ? <TableCell>{row.diameter !== null ? row.diameter : '-'}</TableCell> : <TableCell />}
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
            <TableCell>{amount} volume(s)</TableCell>
            <TableCell />
            {!isFCL() ? <TableCell><b>{I18n.t('components.itemModal.rawWeight')}</b>{Number(weight).toFixed(2).replace('.', ',')} kg</TableCell> : <TableCell />}
            {!isFCL() ? <TableCell><b>{I18n.t('pages.newProposal.step3.cubage')}</b>{Number(cubage).toFixed(2).replace('.', ',')}</TableCell> : <TableCell />}
            {isAir() ? <TableCell><b>{I18n.t('components.itemModal.cubageWeight')}</b>{Number(cubageWeight).toFixed(2).replace('.', ',')}</TableCell> : <TableCell />}
            <TableCell />
            <TableCell />
          </BottomRow>
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default ChargeTable
