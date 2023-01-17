import styled from 'styled-components'
import { Box } from '@material-ui/core'
import { primary } from '../../../application/themes'

styled(Box)`
  position: absolute;
  top: 13px;
  left: 171px;
  background: white;
`

export const ModalDiv = styled.div`
  background-color: ${(props: any) =>
    props.theme?.commercial?.components?.proposalModal?.backgroundColor};
  width: 100%;
  height: 85%;
  position: absolute;
  top: 65px;
  outline: none;
`

export const HeaderDiv = styled.div`
  background-color: ${(props: any) =>
    props.theme?.commercial?.components?.proposalModal?.headerColor};
  display: flex;
  flex-direction: row;
  align-items: center;
  letter-spacing: 0.02em;
  color: ${(props: any) =>
    props.theme?.commercial?.components?.proposalModal?.titleColor};
  width: 100%;
  font-family: DM Sans;
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 150%;
  padding-top: 23px;
  padding-bottom: 22px;
  border-bottom: 1px solid;
  border-color: ${(props: any) =>
    props.theme?.commercial?.components?.proposalModal?.border};
  svg {
    fill: ${(props: any) =>
    props.theme?.commercial?.components?.proposalModal?.iconColor};
  }
  box-shadow: 0px 2px 3px rgba(0, 0, 0, 0.05) !important;
`

export const SubHeaderDiv = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`

export const LanguageDiv = styled.div`
  margin-right: 20px;
`

export const RowReverseDiv = styled.div`
  display: flex;
  flex-direction: row-reverse;
  justify-self: flex-end;
  margin-left: 35px;
  margin-right: 35px;
`

export const MainDiv = styled.div`
  padding: 0 20px;
  
  .MuiGrid-spacing-xs-2 {
    margin: 0;
  }

  .MuiFormLabel-root {
    color: ${(props: any) => props.theme?.commercial?.pages?.newProposal?.subtitle};
    font-size: 14px;
    margin-top: 20px;
    margin-bottom: 10px;
  }

  .MuiFormGroup-root {
    justify-content: center;
  }

  .MuiIconButton-root {
    padding: 0;
  }

  .MuiTypography-root {
    color: ${(props: any) => props.theme?.commercial?.pages?.newProposal?.subtitle};
    margin-left: 5px;
  }

  & .MuiRadio-root, .MuiCheckbox-root {
    color: #B5B8C2;
  }
  & .MuiRadio-colorSecondary.Mui-checked, .MuiCheckbox-colorSecondary.Mui-checked {
    color: ${primary};
  }

  .MuiSelect-icon {
    color: ${(props: any) => props.theme?.commercial?.pages?.newProposal?.font};
  }

  .MuiOutlinedInput-adornedEnd {
    padding-right: 6px !important;
  }  

  .MuiTypography-root{
  line-height: 21px !important;
  font-size: 14px !important;
  font-weight: 600 !important;
  letter-spacing: 2% !important;
  text-align: center !important;
  }

  .MuiTypography-subtitle1 {
    font-size: 14px !important;
    font-weight: 100 !important;
    margin-top: 10px !important;
  }
`
