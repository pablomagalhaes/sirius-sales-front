import { Paper } from '@material-ui/core'
import styled from 'styled-components'
import NumberFormat from 'react-number-format'

const OriginDestLabel = styled.span`
  font-weight: ${(props: { isLand: boolean }) => props.isLand ? 'bold' : 400};
`

const ButtonWrapper = styled.div`
  margin-top: 25px;
`

const HeightDiv = styled.div`
  min-height: 650px; // Para que o stepper marque o Step 6 corretamente
`
const NumberInput = styled(NumberFormat)`
  & .MuiOutlinedInput-marginDense input {
    height: ${(props: { handsOn: boolean }) => props.handsOn ? '19px' : '12px'};
  }
`
const StyledPaper = styled(Paper)`
    border: 1px solid ${(props: any) => props.theme?.commercial?.pages?.proposal?.dropdownBorderColor} !important;
    background-color: ${(props: any) => props.theme?.commercial?.pages?.proposal?.dropdownBackgroundColor} !important;
    color: ${(props: any) => props.theme?.commercial?.pages?.proposal?.dropdownFontColor} !important;
    box-sizing: border-box;
`

const ErrorText = styled.span`
  color: ${(props: any) => props.theme?.commercial?.components?.costTable?.errorText};
  font-weight: normal;
  font-size: 12px;
  letter-spacing: 0.02em;
  line-height: 150%;
`
const LineSeparator = styled.div`
  height: 20px;
`

const UpperContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin: 5px 1%;
  width: 98%;
  border-bottom: 1px solid;
  border-color: ${(props: any) => props.theme?.commercial?.components?.totalSurchage?.borderColor};
  padding-bottom: 25px;
`
const LowerContainer = styled.div`
  margin-bottom: 20px;
  margin-left: 1%;
  margin-right: 1%;
  width: 98%;
`

const TotalContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: auto;
  border-radius: 8px;
  background: ${(props: any) => props.theme?.commercial?.components?.totalSurchage?.backgroundColor};
  margin-top: 15px;
  padding: 0 6px;
  font-family: 'DM Sans';
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 150%;
  color: ${(props: any) => props.theme?.commercial?.components?.totalSurchage?.fontColor};
  letter-spacing: 0.02em;
  .line-bottom {
    border-top: 1px solid;
    border-color: ${(props: any) => props.theme?.commercial?.components?.totalSurchage?.borderColor};
  }
`

const FreightContainer = styled.div`
  margin: 35px 0px;
  font-weight: 400 !important;
  width: 100%;
  text-align: center !important;
`

const CargoContainer = styled.div`
  margin: 5px 1%;
  width: 98%;
  padding-bottom: 25px;
`

export {
  OriginDestLabel,
  ButtonWrapper,
  NumberInput,
  HeightDiv,
  StyledPaper,
  ErrorText,
  LineSeparator,
  UpperContainer,
  LowerContainer,
  TotalContainer,
  FreightContainer,
  CargoContainer
}
