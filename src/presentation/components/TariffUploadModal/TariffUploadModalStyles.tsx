import styled from 'styled-components'
import { Box, Table, TableRow, TableCell, Radio } from '@material-ui/core'
import { primary } from '../../../application/themes'

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
  width: 512px;
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
export const SubDiv = styled.div`
  width: auto;
  border-radius: 8px;
  background: ${(props: any) => props.theme?.commercial?.components?.tariffTable?.backgroundColor};
  margin-top: 10px;
  padding: 5px 25px 25px 25px;

  .MuiTableCell-root {
    padding-left: 0 !important;
  }

  .MuiTableCell-body {
    border-bottom: 1px solid ${(props: any) => props.theme?.commercial?.components?.tariffTable?.border} !important;
  }

  .noBorder {
    border-bottom: none !important;
    padding: 8px 16px 8px 0 !important;
  }

  .noPadding {
    padding: 0 16px 0 0 !important;
  }
`

export const CheckBoxArea = styled.div`
  display: flex;
  cursor: pointer;
`

export const SelectSpan = styled.span`
  color: ${(props: { placeholder: boolean, theme: any }) => props?.placeholder && props.theme?.commercial?.pages?.newProposal?.placeholder};
  margin: 0 10px;
  overflow: hidden;
  text-overflow: ellipsis !important;
`

export const StyledTable = styled(Table)`
  margin-top: 20px;
`
export const TableHeadRow = styled(TableRow)`
  .MuiTableCell-root {
    border-bottom: none;
    font-family: DM Sans;
    color: ${(props: any) => props.theme?.commercial?.components?.tariffTable?.subtitle};
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 150%;
    letter-spacing: 0.02em;
    font-weight: normal;
  }
`
export const TableBodyRow = styled(TableRow)`
  .MuiTableCell-root {
    border: none !important;
    font-family: DM Sans;
    color: ${(props: any) => props.theme?.commercial?.components?.tariffTable?.subtitle};
    font-style: normal;
    font-weight: bold;
    font-size: 14px;
    line-height: 150%;
    letter-spacing: 0.02em;
  }
`

interface StyledTableCellProps {
  width: string
}

export const StyledTableCell = styled(TableCell)`
  width: ${(props: StyledTableCellProps) => props.width};
  vertical-align: top ! important;
`

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

export const ColumnDiv = styled.div`
  display: flex;
  flex-direction: column;
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
