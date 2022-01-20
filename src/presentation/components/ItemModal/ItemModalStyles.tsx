import styled from 'styled-components'

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

export const FieldsContainer = styled.div`
  width: ${(props: any) => props.widtht}
  height: ${(props: any) => props.heigtht}
  margin: ${(props: any) => props.margint}
`
