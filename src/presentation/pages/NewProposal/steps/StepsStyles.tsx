import { Paper } from '@material-ui/core'
import styled from 'styled-components'
import NumberFormat from 'react-number-format'

const OriginDestLabel = styled.span`
  font-weight: ${(props: { isLand: boolean }) => props.isLand ? 'bold' : 400};
`

const ButtonWrapper = styled.div`
  margin-top: 15px;
`

const HeightDiv = styled.div`
  min-height: 650px; // Para que o stepper marque o Step 6 corretamente
`
const NumberInput = styled(NumberFormat)`
  & .MuiOutlinedInput-marginDense input {
    height: 20px;
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

export {
  OriginDestLabel,
  ButtonWrapper,
  NumberInput,
  HeightDiv,
  StyledPaper,
  ErrorText,
  LineSeparator
}
