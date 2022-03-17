import styled from 'styled-components'
import { Box } from '@material-ui/core'
import { primary } from '../../../application/themes'

export const AmountDiv = styled.div`
  width: 126px;
  height: 30px;
  margin-left: 6px;
  margin-top: 12px; 
`

export const StyledBox = styled(Box)`
  position: absolute;
  top: 13px;
  left: 171px;
  background: white;
`

export const ModalDiv = styled.div`
  background-color: ${(props: any) =>
    props.theme?.commercial?.components?.itemModal?.backgroundColor};
  border-radius: 4px;
  width: 537px;
  height: 360px;
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
  
`

export const CheckBoxArea = styled.div`
  display: flex;
  cursor: pointer;
`

export const FieldsContainer = styled.div`
  width: ${(props: any) => props.widtht};
  height: ${(props: any) => props.heigtht};
  margin: ${(props: any) => props.margint};
`
