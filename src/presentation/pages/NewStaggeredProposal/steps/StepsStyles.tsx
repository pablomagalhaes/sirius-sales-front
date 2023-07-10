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
const Title = styled.div`
  color: ${(props: any) => props.theme?.commercial?.pages?.newProposal?.title};
  font-size: 16px;
  font-weight: bold;
  line-height: 150%;
  letter-spacing: 0.02em;
  border-bottom: 1px solid ${(props: any) => props.theme?.commercial?.pages?.newProposal?.border};
  padding-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`
const Subtitle = styled.div`
  color: ${(props: any) => props.theme?.commercial?.pages?.newProposal?.subtitle};
  font-size: 12px;
  line-height: 150%;
  letter-spacing: 0.02em;
  font-weight: normal;
`

const Separator = styled.div`
  margin-bottom: 100px;
  .form-size {
    width: 100%;
  }
  .form-size-half {
    width: 50%;
  }
  .radio-spacement {
    margin-left: 30px;
  }
  .checkbox-div-spacement {
    margin-top: 54px;
  }

  .MuiChip-root {
        background-color: ${(props: any) =>
    props.theme?.commercial?.pages?.newProposal?.steps?.chips?.background};
        color: ${(props: any) =>
    props.theme?.commercial?.pages?.newProposal?.steps?.chips?.color};
        svg path {
            fill: ${(props: any) =>
    props.theme?.commercial?.pages?.newProposal?.steps?.chips?.deleteBackground};
        }
    }

  .disabledDay {
    background: ${(props: any) => props.theme?.commercial?.pages?.newProposal?.weekComponent};
    color: ${(props: any) => props.theme?.commercial?.pages?.newProposal?.subtitle};
  }

  .activeDay {
    background: #50E5D9;
    color: #545454;
  }

  input[type=number]::-webkit-inner-spin-button, 
  input[type=number]::-webkit-outer-spin-button {
    opacity: 1;
  }

  .dropdown {
    margin-top: 12px;
    position: absolute;
    top: 4px;
    z-index: 10;
    left: 78px;
    background: green;
  }

  .MuiInputBase-root.Mui-disabled {
    background: ${(props: any) => props.theme?.commercial?.pages?.newProposal?.disabledBackground};
    color: #999DAC;
  }

  .MuiTextField-root {
    border-radius: 4px;
  }
`

const SelectSpan = styled.span`
  color: ${(props: { placeholder: boolean, theme: any }) => props?.placeholder && props.theme?.commercial?.pages?.newProposal?.placeholder};
  margin: 0 10px;
  overflow: hidden;
  text-overflow: ellipsis !important;
`

const TextCellHead = styled.p`
font-family: DM Sans;
font-size: 14px;
font-style: normal;
font-weight: 400;
line-height: 150%;
letter-spacing: 0.28px;
`

const TextCell = styled.p`
  font-family: DM Sans;
  font-size: 16px;
  font-style: normal;
  font-weight: bold;
`

const TextInnerGreyCell = styled.p`
  font-family: DM Sans;
  font-size: 16px;
  font-style: normal;
  font-weight: bold;
  margin: 0px;
  padding: 7px
`

const TextInnerCell = styled.p`
  font-family: DM Sans;
  font-size: 16px;
  font-style: normal;
  font-weight: bold;
  text-align: right
  margin: 0px;
  padding-right: 35px;
`

const InputContainer = styled.div`
  display: flex;
  align-items: center;
`

export {
  OriginDestLabel,
  ButtonWrapper,
  NumberInput,
  HeightDiv,
  StyledPaper,
  ErrorText,
  LineSeparator,
  Title,
  Subtitle,
  Separator,
  SelectSpan,
  TextCellHead,
  TextCell,
  InputContainer,
  TextInnerCell,
  TextInnerGreyCell
}
