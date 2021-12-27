import styled from 'styled-components'
import { Select } from '@material-ui/core'

export const ModalContainer = styled.div`
  background-color: ${(props: any) =>
    props.theme?.commercial?.components?.itemModal?.backgroundColor};
  border-radius: 4px;
  width: 560px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  outline: none;
`
export const RowReverseDiv = styled.div`
  display: flex;
  flex-direction: row-reverse;
  justify-self: flex-end;
  width: 100%;
  margin-right: 35px;
`
export const HeaderDiv = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  letter-spacing: 0.02em;
  color: ${(props: any) =>
    props.theme?.commercial?.components?.itemModal?.fontColor};
  width: 100%;
  font-family: DM Sans;
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 150%;
  margin-top: 23px;
  padding-bottom: 22px;
  border-bottom: 1px solid #e5e5e5;
  svg {
    fill: ${(props: any) =>
      props.theme?.commercial?.components?.itemModal?.iconColor};
  }
`

export const Title = styled.span`
  margin-left: 24px;
  width: 70%;
`
export const Form = styled.div`
  margin-top: 26px;
  margin-left: 24px;
  margin-right: 30px;
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

export const StyledSelect = styled(Select)`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 6px 8px 5px 16px;
  background: ${(props: { disabled: boolean }) =>
    props.disabled ? '#E3E5EB' : '#ffffff'};
  border: 1px solid #d9dce6;
  box-sizing: border-box;
  border-radius: 4px;
  width: ${(props) => props.width};
  height: 32px;
  margin-top: 12px;
  margin-right: ${(props: { large: boolean }) =>
    props.large ? '21px' : '14px'};
  & .MuiSelect-root {
    font-family: DM Sans;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 150%;
    letter-spacing: 0.02em;
    color: ${(props: { disabled: boolean, placeholder: string }) =>
      props.placeholder === '' || props.disabled ? '#999DAC' : '#222222'};
  }
  & .MuiSvgIcon-root {
    color: #545454;
  }

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
  background: blue;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: 1px;
  background-color: ${(props: { checked: boolean }) =>
    props.checked ? '#43BFB5' : '#FFFFFF'};
`

export const CheckBoxLabel = styled.span`
  font-size: 12px;
  margin-top: 28px;
  color: ${(props: any) =>
    props.theme?.commercial?.components?.itemModal?.fontColor}; ;
`
export const Input = styled.input`
  border: 1px solid #e5e5e5;
  margin-top: 12px;
  box-sizing: border-box;
  border-radius: 4px;
  width: 110px;
  height: 32px;
  text-indent: 10px;
  margin-right: 14px;
  font-family: DM Sans;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 150%;
  letter-spacing: 0.02em;
  color: ${(props: { disabled: boolean }) =>
    props.disabled ? '#999DAC' : '#222222'};
  background: ${(props: { disabled: boolean }) =>
    props.disabled ? '#E3E5EB' : '#ffffff'};
`
export const PlaceholderDiv = styled.div`
  label {
    position: relative;
  }

  label input {
    position: relative;
  }
`
export const PlaceholderSpan = styled.span`
  color: gray;
  position: absolute;
  text-indent: 10px;
  top: 1px;
  margin-top: -2px;
  z-index: 1;
  color: #999dac;
`
export const RedColorSpan = styled.span`
  color: red;
  font-size: 12px;
`
export const ReplyDiv = styled.div`
  margin-top: 18px;
  font-size: 14px;
  color: ${(props: { disabled: boolean }) =>
    props.disabled ? '#999DAC' : '#1F6660'};
  white-space: nowrap;
  text-align: center;
  display: flex;
  flex-direction: row;

  svg {
    margin-right: 5px;
  }

  path {
    fill: ${(props: { disabled: boolean }) =>
      props.disabled ? '#999DAC' : '#1F6660'};
  }
`
export const ReplyIconDiv = styled.div`
  margin-top: 2px;
`
export const ButtonDiv = styled.div`
  margin-top: 40px;
  margin-bottom: 25px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;
`
