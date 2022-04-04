import styled from 'styled-components'
import { Select } from '@material-ui/core'
import ControlledToolTip from '../ControlledToolTip/ControlledToolTip'
import NumberFormat from 'react-number-format'
import React from 'react'

export const StyledMenuSelect = styled(({ className, invalid, toolTipTitle, ...props }) => {
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
  background: ${(props: { disabled: boolean, theme: any }) =>
          props.disabled ? props.theme?.commercial?.components?.itemModal?.disabledBackground : props.theme?.commercial?.components?.itemModal?.backgroundColor};
  border: 1px solid ${(props: { invalid: boolean, filled: string | null, theme: any }) =>
          props.invalid
                  ? '#FF4D4D'
                  : props.filled != null && props.filled.length > 0
                          ? '#43BFB5'
                          : props.theme?.commercial?.components?.itemModal?.border};
  box-sizing: border-box;
  border-radius: 4px;
  width: ${(props) => props.width};
  height: 32px;
  margin-top: 12px;
  margin-right: ${(props: { large: boolean }) =>
          props.large ? '23px' : '14px'};

  & .MuiSelect-root {
    font-family: DM Sans;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 150%;
    letter-spacing: 0.02em;
    color: ${(props: { placeholder: string, disabled: boolean, theme: any }) =>
            props.placeholder === '' || props.disabled ? props.theme?.commercial?.pages?.newProposal?.placeholder : props.theme?.commercial?.components?.itemModal?.inputFontColor};
  }

  & .MuiSvgIcon-root {
    color: ${(props: any) =>
            props.theme?.commercial?.components?.itemModal?.iconColor};
  }

  &:hover {
    border: 1px solid #43bfb5;
  }
`

export const CheckBox = styled.div`
  border: ${(props: { checked: boolean }) =>
          props.checked ? '0px' : '2px solid #B5B8C2'};
  box-sizing: border-box;
  border-radius: 2px;
  margin-right: 11px;
  margin-top: 28px;
  width: 18px;
  height: 18px;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: 1px;
  background: ${(props: { checked: boolean, theme: any }) =>
          props.checked ? '#43BFB5' : props.theme?.commercial?.components?.itemModal?.backgroundColor};

  path {
    fill: ${(props: any) =>
            props.theme?.commercial?.components?.itemModal?.backgroundColor};
    stroke: ${(props: any) =>
            props.theme?.commercial?.components?.itemModal?.backgroundColor};
  }
`

export const CheckBoxLabel = styled.span`
  font-size: 12px;
  margin-top: 28px;
  color: ${(props: { invalid: boolean, theme: any }) =>
    props.invalid
      ? '#FF4D4D'
      : props.theme?.commercial?.components?.itemModal?.fontColor};
    
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
`

export const NumberInput = styled(NumberFormat)`
`

export const ReplyDiv = styled.div`
  margin-top: 18px;
  font-size: 14px;
  color: ${(props: { disabled: boolean, theme: any }) =>
    props.disabled ? '#999DAC' : props.disabled ? props.theme?.commercial?.components?.itemModal?.disabledBackground : props.theme?.commercial?.components?.itemModal?.replyIconColor};
  white-space: nowrap;
  text-align: center;
  display: flex;
  flex-direction: row;

  svg {
    margin-right: 5px;
  }

  path {
    fill: ${(props: { disabled: boolean, theme: any }) =>
    props.disabled ? '#999DAC' : props.disabled ? props.theme?.commercial?.components?.itemModal?.disabledBackground : props.theme?.commercial?.components?.itemModal?.replyIconColor};
  }
`
export const ReplyIconDiv = styled.div`
  margin-top: 2px;
`

export const WarningPopUpMessage = styled.span`
  max-width:55%;
  font-family: DM Sans;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 150%;
  letter-spacing: 0.02em;
  margin-left:70px;
  margin-right: 20px;
`

export const WarningPopUpButtonDiv = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-top: 1px;
  button {
    padding: 6px 24px;
    color:#222222;
    border-color:#222222;
  }
`

export const WarningPopUp = styled.div`
  width: 100%;
  color: #222222;
  display: flex;
  flex-direction: row;
  background: #FF7373;
  padding-top:24px;
  padding-bottom:24px;
  margin-top: 32px;
`
