import React from 'react'
import styled from 'styled-components'
import { Select } from '@material-ui/core/'
import { primary } from '../../../application/themes'

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
  & .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline, 
  .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline {
    border: 1px solid ${primary};
  }
  & .MuiStepper-root {
    padding-left: 0;
  }
  & .MuiOutlinedInput-notchedOutline {
    border-color: ${(props: any) => props.theme?.commercial?.pages?.newProposal?.border};
  }
  & .MuiFormLabel-root.Mui-focused, .MuiSelect-icon {
    color: ${(props: any) => props.theme?.commercial?.pages?.newProposal?.font};
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
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.05);
  // border: 1px solid black;
  position: sticky;
  top: 76px;
  z-index: 1;
`

const MainContainer = styled.div`
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
  margin-right: 40px;
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

const Username = styled.span`
  color: ${(props: any) => props.theme?.commercial?.pages?.newProposal?.font};
  font-weight: 500;
  margin-left: 6px;
`

const Header = styled.div`
  margin: 25px 20px;
  display: flex;
  justify-content: space-between;
`

const Separator = styled.div`
  margin-bottom: 100px;
`

const SelectPlaceholder = styled.span`
  color: ${(props: any) => props.theme?.commercial?.pages?.newProposal?.placeholder};
`

const ButtonContainer = styled.div`
  height: 36px;
`

const StyledSelect = styled(({ className, ...props }) => (
  <Select {...props} MenuProps={{ classes: { paper: className } }} />
))`
  && {
    background-color: ${(props: any) => props.theme?.commercial?.pages?.newProposal?.background};
    color: ${(props: any) => props.theme?.commercial?.pages?.newProposal?.subtitle};
  }
`

export {
  ButtonContainer,
  IconContainer,
  Header,
  MainContainer,
  RootContainer,
  SelectPlaceholder,
  Separator,
  StyledSelect,
  Subtitle,
  Title,
  TopContainer,
  UserContainer,
  Username
}
