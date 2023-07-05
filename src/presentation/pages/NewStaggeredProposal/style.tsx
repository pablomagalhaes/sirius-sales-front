import styled from 'styled-components'
import { Radio } from '@material-ui/core/'
import { primary } from '../../../application/themes'

interface StyledRadioProps {
  color?: string
}

const RootContainer = styled.div`
  position: relative;
  .breadcrumbInitial {
    color: ${(props: any) => props.theme?.commercial?.pages?.proposal?.breadcrumbInitial};
  }
  .breadcrumbEnd {
    color: ${(props: any) => props.theme?.commercial?.pages?.proposal?.breadcrumbEnd};
    font-weight: bold;
  }
  & .MuiBreadcrumbs-separator {
    color: ${(props: any) => props.theme?.commercial?.pages?.proposal?.breadcrumbInitial};
  }
  & .MuiFormLabel-root {
    color: ${(props: any) => props.theme?.commercial?.pages?.newProposal?.subtitle};
    font-size: 14px;
    margin-top: 30px;
    margin-bottom: 10px;
    @media only screen and (max-width: 1200px) {
      overflow-wrap: break-word;
    }
  }
  & .MuiTextField-root, .MuiOutlinedInput-root {
    width: 100%;
  }
  & .MuiSelect-select {
    display: flex;
    align-items: center;
    height: 24px;
  }
  & .MuiFormControlLabel-root {
    margin-right: 10px;
  }
  & .MuiSvgIcon-root {
    align-self: center;
  }
  & .MuiTypography-body1 {
    font-size: 14px;
  }
  & .MuiTypography-root {
    @media only screen and (max-width: 1200px) {
      margin-left: -15px;
    }
  }
  & .MuiOutlinedInput-input {
    font-size: 14px;
    color: ${(props: any) => props.theme?.commercial?.pages?.newProposal?.font};
  }
  & .MuiRadio-root, .MuiCheckbox-root {
    color: #B5B8C2;
  }
  & .MuiRadio-colorSecondary.Mui-checked, .MuiCheckbox-colorSecondary.Mui-checked {
    color: ${primary};
  }
  & .MuiStepper-root {
    padding-left: 0;
  }
  & .MuiSelect-icon {
    color: ${(props: any) => props.theme?.commercial?.pages?.newProposal?.font};
  }
  & .MuiFormLabel-root.Mui-focused {
    color: ${(props: any) => props.theme?.commercial?.pages?.newProposal?.subtitle};
  }
  & .MuiSvgIcon-root {
    margin-right: 5px;
  }
`

const TopContainer = styled.div`
  background: ${(props: any) => props.theme?.commercial?.pages?.newProposal?.background};
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 3px 20px;
  padding: 24px;
  border-radius: 16px 16px 0 0;
  box-shadow: 0 4px 8px ${(props: any) => props.theme?.commercial?.pages?.newProposal?.steps?.stepsBoxShadow};
  position: sticky;
  top: 65px;
  z-index: 1;
  font-size: 0.900rem;
`

const MainContainer = styled.div`
  display: flex;
  justify-content: space-evenly;
  flex-direction: column;
  background: ${(props: any) => props.theme?.commercial?.pages?.newProposal?.background};
  margin: 0 20px;
  border-radius: 0 0 16px 16px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  padding: 44px 24px;
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
const IconContainer = styled.div`
  align-self: center;
  margin-right: 30px;
`

const UserContainer = styled.div`
  font-size: 14px;
  color: ${(props: any) => props.theme?.commercial?.pages?.newProposal?.subtitle};
  line-height: 150%;
  letter-spacing: 0.02em;
  display: flex;
  svg {
    margin-left: 18px;
  }

  .open {
    background: #50E5D9;
  }

  .inReview {
    background: #F2D16D;
  }
`

const ReferenceCode = styled.span`
  color: #2E9990;
  font-weight: bold;
  padding-left: 8px; 
  padding-right: 40px;  
`

const Username = styled.span`
  color: ${(props: any) => props.theme?.commercial?.pages?.newProposal?.font};
  font-weight: 500;
  margin-left: 6px;
`

const Header = styled.div`
  margin: 28px 24px;
  display: flex;
  justify-content: space-between;
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

const ButtonContainer = styled.div`
  height: 36px;
`

const StyledRadio = styled(Radio)`
  color: ${({ color }: StyledRadioProps) => color} !important;
`

const MessageContainer = styled.div`
  color: ${(props: any) => props.theme?.commercial?.pages?.newProposal?.steps?.messageColor};
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 99;
`

const InputContainer = styled.div`
  display: flex;
  align-items: center;
`

const WeekDay = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 50px;
  font-size: 12px;
  font-weight: 700;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 8px;
  border: none;
  cursor: pointer;
`

const WeekContainer = styled.div`
  display: flex;
`

const Status = styled.span`
  color: #222222;
  padding: 1px 8px;
  font-size: 12px;
  border-radius: 50px;
  margin-left: 40px;
`

const ChargeText = styled.span`
  color: #1470CC;
  font-weight: 700;
  font-size: 16px;
`

const BottomTitle = styled.span`
  color: ${(props: any) => props.theme?.commercial?.pages?.newProposal?.subtitle};
  font-weight: 400;
  font-size: 14px;
`

const BottomTextValue = styled.span`
  color: ${(props: any) => props.theme?.commercial?.pages?.newProposal?.font};
  font-weight: 700;
  font-size: 14px;
`

const BottomValueContainer = styled.div`
  display: flex;
  height: 45px;
  flex-direction: column;
  justify-content: space-between;
  margin-left: 50px;
`

const BottomContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

const ChargeContainer = styled.div`
  display: flex;
  flex-direction: row;
`

const EditIconContainer = styled.div`
  cursor: pointer;
  height: 16px;
  margin-top: 27px;
  margin-left: 10px;
`
const AddAgentButtonWrapper = styled.div`
  margin-left: 20px;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  margin-top: 20px;
`

export {
  AddAgentButtonWrapper,
  ButtonContainer,
  IconContainer,
  Header,
  MainContainer,
  ReferenceCode,
  RootContainer,
  SelectSpan,
  Separator,
  Subtitle,
  Title,
  TopContainer,
  UserContainer,
  Username,
  StyledRadio,
  MessageContainer,
  InputContainer,
  WeekDay,
  WeekContainer,
  Status,
  ChargeText,
  BottomTitle,
  BottomTextValue,
  BottomValueContainer,
  BottomContainer,
  ChargeContainer,
  EditIconContainer
}
