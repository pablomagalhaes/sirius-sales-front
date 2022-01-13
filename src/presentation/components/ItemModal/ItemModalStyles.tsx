import styled from 'styled-components'
import React from 'react'
import { Select } from '@material-ui/core'
import ControlledToolTip from '../ControlledToolTip/ControlledToolTip'

export const ModalDiv = styled.div`
  background-color: ${(props: any) =>
    props.theme?.commercial?.components?.itemModal?.backgroundColor};
  border-radius: 4px;
  width: 547px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  outline: none;
  svg {
    fill: ${(props: any) =>
      props.theme?.commercial?.components?.itemModal?.iconColor};
  }
`
export const RowReverseDiv = styled.div`
  display: flex;
  flex-direction: row-reverse;
  justify-self: flex-end;
  width: 100%;
  margin-right: 35px;
`

export const Form = styled.div`
  margin-top: 26px;
  margin-left: 24px;
  margin-right: 24px;
  font-family: DM Sans;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 150%;
  letter-spacing: 0.02em;
  color: ${(props: any) =>
    props.theme?.commercial?.components?.itemModal?.fontColor};
`
export const RowDiv = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: ${(props: { margin: boolean }) =>
    props.margin ? '24px' : '0px'};
`

export const Label = styled.span`
  width: ${(props) => props.width};
`

export const HeaderDiv = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  letter-spacing: 0.02em;
  color: ${(props: any) =>
    props.theme?.commercial?.components?.itemModal?.titleColor};
  width: 100%;
  font-family: DM Sans;
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 150%;
  margin-top: 23px;
  padding-bottom: 22px;
  border-bottom: 1px solid;
  border-color: ${(props: any) =>
    props.theme?.commercial?.components?.itemModal?.border};
`
export const Title = styled.span`
  margin-left: 24px;
  width: 70%;
`

export const StyledMenuSelect = styled(({ className, toolTipTitle, invalid, ...props }) => {
  return (
    <ControlledToolTip title={toolTipTitle} open={invalid}>
      <StyledSelect
        {...props}
        invalid={invalid === true ? 1 : 0}
        MenuProps={{ classes: { paper: className } }}
      />
    </ControlledToolTip>
  )
})`
  && {
    background-color: ${(props: any) =>
      props.theme?.commercial?.components?.itemModal?.backgroundColor};
    font-family: DM Sans;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 150%;
    max-height:300px;
    color: ${(props: any) =>
      props.theme?.commercial?.components?.itemModal?.fontColor};
  }
`

const StyledSelect = styled(Select)`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 6px 8px 5px 16px;
  background: ${(props: any) =>
    props.theme?.commercial?.components?.itemModal?.backgroundColor};
  border: 1px solid;
  border-color: ${(props: {invalid: boolean, filled: string | null, theme: any}) =>
    props.invalid
      ? '#FF4D4D'
      : props.filled != null && props.filled.length > 0
      ? '#43BFB5'
      : props.theme?.commercial?.components?.itemModal?.border};
  box-sizing: border-box;
  border-radius: 4px;
  width: 198px;
  height: 32px;
  margin-top: 12px;

  &:hover {
    border: 1px solid;
    border-color: #43bfb5;
  }

  & .MuiSelect-root {
    font-family: DM Sans;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 150%;
    letter-spacing: 0.02em;
    color: ${(props) =>
      props.placeholder === ''
        ? '#999DAC'
        : props.theme?.commercial?.components?.itemModal?.inputFontColor};
  }

  & .MuiSvgIcon-root {
    margin-right: 5px;
  }
`

export const Input = styled.input`
  text-indent: 10px;
  border: 1px solid;
  border-color: ${(props: {invalid: boolean, filled: string | null, theme: any}) =>
    props.invalid
      ? '#FF4D4D'
      : props.filled != null && props.filled.length > 0
      ? '#43BFB5'
      : props.theme?.commercial?.components?.itemModal?.border};
  background: ${(props: any) =>
    props.theme?.commercial?.components?.itemModal?.backgroundColor};
  margin-top: 12px;
  box-sizing: border-box;
  border-radius: 4px;
  width: 126px;
  height: 32px;
  margin-left: 21px;
  font-family: DM Sans;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 150%;
  letter-spacing: 0.02em;
  color: ${(props: any) =>
    props.theme?.commercial?.components?.itemModal?.inputFontColor};
  :focus {
    outline: none;
    border-color: #43bfb5;
  }
`
export const MeasureInput = styled.input`
  text-indent: 8px;
  border: 1px solid;
  border-color: ${(props: {invalid: boolean, filled: string | null, theme: any}) =>
    props.invalid
      ? '#FF4D4D'
      : props.filled != null && props.filled.length > 0
      ? '#43BFB5'
      : props.theme?.commercial?.components?.itemModal?.border};
  margin-top: 12px;
  box-sizing: border-box;
  border-radius: 4px;
  width: 60px;
  height: 32px;
  background: ${(props: any) =>
    props.theme?.commercial?.components?.itemModal?.backgroundColor};
  margin-right: ${(props: { margin: boolean }) =>
    props.margin ? '8px' : '0px'};
  font-family: DM Sans;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 150%;
  letter-spacing: 0.02em;
  color: ${(props: any) =>
    props.theme?.commercial?.components?.itemModal?.inputFontColor};
  :focus {
    outline: none;
    border-color: #43bfb5;
  }
`
export const CheckBox = styled.div`
  border: ${(props: { checked: boolean }) =>
    props.checked ? '0px' : '2px solid #B5B8C2'};
  box-sizing: border-box;
  border-radius: 2px;
  margin-right: 11px;
  margin-top: 19px;
  width: 18px;
  height: 18px;
  background: blue;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: 1px;
  background-color: ${(props: any) =>
    props.checked === true
      ? '#43BFB5'
      : props.theme?.commercial?.components?.itemModal?.backgroundColor};
`
export const CheckBoxLabel = styled.span`
  color: ${(props: any) =>
    props.theme?.commercial?.components?.itemModal?.iconColor};
  margin-right: 11px;
  margin-top: 18px;
`
export const AlertIconDiv = styled.span`
  margin-right: 64px;
  margin-top: 20px;
`
export const ButtonDiv = styled.div`
  margin-top: 50px;
  margin-bottom: 25px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;
`
export const RedColorSpan = styled.span`
  color:${(props: any) =>
    props.theme?.commercial?.components?.itemModal?.redAsterisk};
  font-size: 12px;
`
