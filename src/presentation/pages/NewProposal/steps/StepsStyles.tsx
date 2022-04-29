import { TableRow, Table, Paper } from '@material-ui/core'
import { MainDiv } from '../../../components/CostTable/CostTableStyles'
import styled from 'styled-components'
import NumberFormat from 'react-number-format'

const TotalContainer = styled(MainDiv)`
  width: 95%;
  margin: 56px auto;
  padding: 31px;
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
`

const StyledTable = styled(Table)`
  width: 100%;
  margin-bottom: 24px;
`

const StyledRow = styled(TableRow)`
  display: flex !important;
  justify-content: space-between !important;
  margin: 0 20px !important;
`

const ButtonWrapper = styled.div`
  margin-left: 20px;
`

const HeightDiv = styled.div`
  min-height: 650px; // Para que o stepper marque o Step 6 corretamente
`
const NumberInput = styled(NumberFormat)`
`
const StyledPaper = styled(Paper)`
    border: 1px solid ${(props: any) => props.theme?.commercial?.pages?.proposal?.dropdownBorderColor} !important;
    background-color: ${(props: any) => props.theme?.commercial?.pages?.proposal?.dropdownBackgroundColor} !important;
    color: ${(props: any) => props.theme?.commercial?.pages?.proposal?.dropdownFontColor} !important;
    box-sizing: border-box;
`

export {
  TotalContainer,
  StyledTable,
  StyledRow,
  ButtonWrapper,
  NumberInput,
  HeightDiv,
  StyledPaper
}
