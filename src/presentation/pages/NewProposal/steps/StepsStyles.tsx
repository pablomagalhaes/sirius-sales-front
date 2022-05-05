import { TableRow, Table, Paper } from '@material-ui/core'
import { MainDiv } from '../../../components/CostTable/CostTableStyles'
import styled from 'styled-components'
import NumberFormat from 'react-number-format'

const TotalContainer = styled(MainDiv)`
  display: flex;
  width: 100%;
  flex-direction: row;
  padding-top: 31px;
  padding-bottom: 31px;
  justify-content: flex-end;
  align-items: flex-start;
`

const StyledTable = styled(Table)`
  width: 100%;
  margin-bottom: 24px;
`

const StyledRow = styled(TableRow)`
  justify-content: space-between !important;
  margin: 0 20px !important;
`

const ButtonWrapper = styled.div`
  margin-top: 15px;
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

const Input = styled.input`
  text-indent: 10px;
  border: 1px solid ${(props: { invalid: boolean, filled: string | null, theme: any }) =>
          props.invalid
                  ? '#FF4D4D'
                  : props.filled != null && props.filled.length > 0
                          ? '#43BFB5'
                          : props.theme?.commercial?.components?.itemModal?.border};
                          
  box-sizing: border-box;
  border-radius: 4px;
  width: 110px;
  height: 32px;
  margin-right: 14px;
  font-family: DM Sans;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 150%;
  letter-spacing: 0.02em;
  color: ${(props: { disabled: boolean, theme: any }) =>
          props.disabled ? props.theme?.commercial?.pages?.newProposal?.placeholder : props.theme?.commercial?.components?.itemModal?.inputFontColor};
  background: ${(props: { disabled: boolean, theme: any }) =>
          props.disabled ? props.theme?.commercial?.components?.itemModal?.disabledBackground : props.theme?.commercial?.components?.itemModal?.backgroundColor};

  :focus {
    outline: none;
    border-color: #43bfb5;
  }

  ::placeholder {
    color: #999dac;
    opacity: 1;
  }
`

export {
  TotalContainer,
  StyledTable,
  StyledRow,
  ButtonWrapper,
  NumberInput,
  HeightDiv,
  StyledPaper,
  Input
}
