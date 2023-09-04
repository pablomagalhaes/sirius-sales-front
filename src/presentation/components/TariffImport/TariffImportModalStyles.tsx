import styled from 'styled-components'
import { Box, Radio, MenuItem, Select, FormControl } from '@material-ui/core'
import MuiTableCell from '@material-ui/core/TableCell'
import { primary } from '../../../application/themes'
import { withStyles } from '@material-ui/core/styles'

interface StyledRadioProps {
  color?: string
}

styled(Box)`
  position: absolute;
  top: 13px;
  left: 171px;
  background: white;
`

export const StyledRadio = styled(Radio)`
  color: ${({ color }: StyledRadioProps) => color} !important;
`

export const ModalDiv = styled.div`
  background-color: ${(props: any) =>
    props.theme?.commercial?.components?.itemModal?.backgroundColor};
  border-radius: 4px;
  width: 1112px;
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
    justify-content: space-between;
    margin-left: 5px;
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
  font-weight: 400 !important;
  letter-spacing: 2% !important;
  }
`

export const CheckBoxArea = styled.div`
  display: flex;
  cursor: pointer;
`

export const CloseButtonDiv = styled.div`
  margin-top: 30px;
  margin-bottom: 25px;
  display: flex;
  justify-content: right;
  width: 100%;
  button {
    border: 0px !important;
    color: #2E9990;
    &:hover {
      color: #087A7A;
      background-color: transparent !important;
    }
  }
`

export const ButtonDiv = styled.div`
  margin-top: 30px;
  margin-bottom: 25px;
  display: flex;
  justify-content: right;
  width: 100%;
  button {
    border: 0px !important;
  }
`

export const DragAndDropDiv = styled.div`
  margin: -47px;
  margin-top: -30px;
`

export const Form = styled(FormControl)`
  width: 100%;
`
interface StyledSelect {
  invalidData: boolean
}

export const SelectEmpty = styled(Select)`
  margin-top: 0;
  padding: 5px;
  padding-left: 5px;
  font-weight: 400 !important;
  font-size: 14px !important;
  &.MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline
  {
    border-color: ${(props: StyledSelect) => props.invalidData && '#f44336'};
  };
  &.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline
    {
      border-color: #D9DCE6;
    };
  &.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline
    {
      border-color: #43BFB5;
    };
`

export const Item = styled(MenuItem)`
  font-weight: 400;
  font-size: 14px;
`

export const TableBodyCell = withStyles({
  root: {
    borderBottom: 'none',
    paddingRight: 10,
    paddingLeft: 0
  }
})(MuiTableCell)

export const Input = styled.input`
  text-indent: 10px;
  border: 1px solid ${(props: { invalid: boolean, filled: string | null, theme: any }) =>
          props.invalid
                  ? '#FF4D4D'
                  : props.filled != null && props.filled.length > 0
                          ? '#43BFB5'
                          : props.theme?.commercial?.components?.itemModal?.border};
  margin-top: 12px;
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

  &:hover {
    border: 1px solid #43bfb5;
  }
`

export const NoTariffs = styled.div`
  text-align: center;
  width: auto;
  border-radius: 8px;
  background: ${(props: any) => props.theme?.commercial?.components?.totalSurchage?.backgroundColor};
  margin-top: 15px;
  padding: 20px 0px;
  font-family: 'DM Sans';
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 150%;
  color: ${(props: any) => props.theme?.commercial?.components?.totalSurchage?.fontColor};
  letter-spacing: 0.02em;
`
