import React from 'react'
import CostTable from '../../components/CostTable/CostTable'
import { I18n } from 'react-redux-i18n'
import { Title, Subtitle, Separator } from './style'

import { TableBody, TableHead, TableRow, Table as Table2 } from '@material-ui/core'

import {
  CostLabel,
  Default,
  Description,
  EditIconDiv,
  Empty,
  EmptyTableCost,
  EndValueLabel,
  Footer,
  Header,
  MainDiv,
  RowReverseDiv,
  // StyledTable,
  StyledTableCell,
  TableHeadRow,
  Title as Title2,
  TotalCostLabel,
  Type,
  ValueLabel
} from '../../components/CostTable/CostTableStyles'
import EditIcon from '../../../application/icons/EditIcon'
import RemoveIcon from '../../../application/icons/RemoveIcon'
import { Button } from 'fiorde-fe-components'
import styled from 'styled-components'
// import CostModal from '../CostModal/CostModal'

const Container = styled(MainDiv)`
  width: 95%;
  margin: 56px auto;
  padding: 31px;
  display: flex;
  justify-content: flex-end;
  // text-align: center;
  align-items: center;
  // border: 1px solid green;
`

const StyledTable = styled(Table2)`
  width: 100%;
  // margin: 0 50px;
  // border: 1px solid black;
  // display: flex;
  // justify-content: space-between;
  // max-width: 94%;
  // margin-top: 20px;
  // margin-left: 30px;
`

const StyledRow = styled(TableRow)`
  display: flex !important;
  // border: 1px solid pink;
  justify-content: space-between !important;
  margin: 0 20px !important;
`

const Table = () => {
  return (
    <StyledTable>
          <TableBody>
            {[1, 2].map((dataMap) => {
              return (
                <StyledRow id="styled_row"
                // style={{
                //   // border: '1px solid pink',
                //   display: 'flex',
                //   // flexDirection: 'column',
                //   justifyContent: 'space-between',
                //   margin: '0 20px'
                // }}
                >
                  <StyledTableCell width="100%" component="th" scope="row">
                    Frete Express
                  </StyledTableCell>
                  <StyledTableCell width="100%" align="left">
                    Vlr. Fixo
                  </StyledTableCell>
                  <StyledTableCell width="100%" align="left">
                    USD 50,00
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
  return (
    <Separator>
      <Title>
        6. {I18n.t('pages.newProposal.step6.title')}
        <Subtitle>{I18n.t('pages.newProposal.step6.subtitle')}</Subtitle>
      </Title>
      <Table />
      <Container id="total_container">
        <TotalCostLabel>Total Tarifas:</TotalCostLabel>
        <ValueLabel>USD 151,00</ValueLabel>
      </Container>
    </Separator>
  )
}

export default Step6
