import styled from 'styled-components'
import { Box } from '@material-ui/core'

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
  path  {
    fill: ${(props: any) =>
    props.theme?.commercial?.components?.itemModal?.backgroundColor};
    stroke: ${(props: any) =>
    props.theme?.commercial?.components?.itemModal?.backgroundColor};
  }
`

export const CheckBoxArea = styled.div`
  display: flex;
  cursor: pointer;
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

export const FieldsContainer = styled.div`
  width: ${(props: any) => props.widtht}
  height: ${(props: any) => props.heigtht}
  margin: ${(props: any) => props.margint}
`
