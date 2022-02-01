import React, { useState } from 'react'
import { I18n } from 'react-redux-i18n'
import { Title, Subtitle, Separator } from '../style'
import FareModal from '../../../components/FareModal/FareModal'
import { TableBody } from '@material-ui/core'

import {
  EditIconDiv,
  RowReverseDiv,
  StyledTableCell,
  TotalCostLabel,
  ValueLabel
} from '../../../components/CostTable/CostTableStyles'

import {
  TotalContainer,
  StyledTable,
  StyledRow,
  ButtonWrapper,
  HeightDiv
} from './StepsStyles'

import EditIcon from '../../../../application/icons/EditIcon'
import RemoveIcon from '../../../../application/icons/RemoveIcon'
import { Button } from 'fiorde-fe-components'

const mock = [
  {
    fare: 'Frete Express',
    type: 'Vlr. Fixo',
    value: 'USD 50,00'
  },
  {
    fare: 'Fuel - Security',
    type: 'CW',
    value: 'EUR 5,00'
  }
]

interface Cell {
  fare: string
  type: string
  value: string
}
interface TableData {
  data: Cell[]
}

const Table = ({ data }: TableData): JSX.Element => {
  return (
    <StyledTable>
      <TableBody>
        {data.map((item: any) => {
          return (
            <StyledRow id="styled_row">
              <StyledTableCell width="100%" component="th" scope="row" color>
                {item.fare}
              </StyledTableCell>
              <StyledTableCell width="100%" align="left">
                {item.type}
              </StyledTableCell>
              <StyledTableCell width="100%" align="left">
                {item.value}
              </StyledTableCell>
              <StyledTableCell width="100%">
                <RowReverseDiv>
                  <RemoveIcon
                    onClick={() => {
                      console.log('Remove')
                    }}
                  />
                  <EditIconDiv>
                    <EditIcon
                      onClick={() => {
                        console.log('Edit')
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

const Step6 = (): JSX.Element => {
  const [open, setOpen] = useState(false)
  const [data] = useState(mock)
  const handleOpen = (): void => setOpen(true)
  const handleClose = (): void => setOpen(false)
  const handleAdd = (item): void => console.log(item)
  return (
    <Separator>
      <HeightDiv>
        <Title>
          6. {I18n.t('pages.newProposal.step6.title')}
          <Subtitle>{I18n.t('pages.newProposal.step6.subtitle')}</Subtitle>
        </Title>
        <Table data={data} />
        <ButtonWrapper>
          <Button
            onAction={handleOpen}
            text={I18n.t('pages.newProposal.step6.addFare')}
            icon="add"
            backgroundGreen={false}
          />
        </ButtonWrapper>
        <FareModal
          action={handleAdd}
          open={open}
          setClose={handleClose}
          title={I18n.t('components.fareModal.newFare')}
        />
        <TotalContainer>
          <TotalCostLabel>{I18n.t('pages.newProposal.step6.totalFares')}</TotalCostLabel>
          <ValueLabel>USD 151,00</ValueLabel>
        </TotalContainer>
      </HeightDiv>
    </Separator>
  )
}

export default Step6
