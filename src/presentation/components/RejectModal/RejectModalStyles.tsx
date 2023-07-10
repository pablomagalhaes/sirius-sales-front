import styled from 'styled-components'
import { Box, Radio } from '@material-ui/core'
import { primary } from '../../../application/themes'

styled(Box)`
  position: absolute;
  top: 13px;
  left: 171px;
  background: white;
`
interface StyledRadioProps {
  color?: string
}

export const StyledRadio = styled(Radio)`
  color: ${({ color }: StyledRadioProps) => color} !important;
`

export const ModalDiv = styled.div`
  background-color: ${(props: any) =>
    props.theme?.commercial?.components?.itemModal?.backgroundColor};
  border-radius: 4px;
  width: 537px;
  min-height: 350px;
  padding-bottom: 35px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  outline: none;
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

export const CheckBoxArea = styled.div`
  display: flex;
  cursor: pointer;
`
