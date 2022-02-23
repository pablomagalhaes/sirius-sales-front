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
  box-shadow: 0px 4px 8px ${(props: any) => props.theme?.commercial?.pages?.newProposal?.steps?.stepsBoxShadow};
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
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.05);
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
`

const SelectSpan = styled.span`
  color: ${(props: { placeholder: boolean, theme: any }) => props?.placeholder && props.theme?.commercial?.pages?.newProposal?.placeholder};
  margin: 0 10px;
`

const ButtonContainer = styled.div`
  height: 36px;
`
const BoldSpan = styled.span`
  font-weight: ${(props: { checked: boolean }) => props.checked ? '600' : 'normal'};
`

const StyledRadio = styled(Radio)`
  color: ${({ color }: StyledRadioProps) => color} !important;
`

export {
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
  BoldSpan,
  StyledRadio
}
