import styled from 'styled-components'

export const ModalContainer = styled.div`
  background-color: ${(props: any) =>
    props.theme?.commercial?.components?.itemModal?.backgroundColor};
  border-radius: 4px;
  width: 562px;
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
  width: 10%;
  margin-right: 35px;
`
export const CloseIconContainer = styled.div`
  cursor: pointer;
`

export const RedColorSpan = styled.span`
  color: ${(props: any) =>
    props.theme?.commercial?.components?.itemModal?.redAsterisk};
  font-size: 12px;
`
export const Label = styled.span`
  width: ${(props) => props.width};
  padding-left: ${(props) => props.paddingLeft};
  color: ${(props) => props.color};
`

export const Title = styled.span`
  margin-left: 24px;
  width: 90%;
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
  font-weight: 600 !important;
  font-size: 16px;
  line-height: 150%;
  margin-top: 23px;
  padding-bottom: 22px;
  border-bottom: 1px solid;
  border-color: ${(props: any) =>
    props.theme?.commercial?.components?.itemModal?.border};
  svg {
    fill: ${(props: any) =>
    props.theme?.commercial?.components?.itemModal?.iconColor};
  }
`
export const RowDiv = styled.div`
  display: flex;
  margin-bottom: ${(props: { margin: boolean }) =>
    props.margin ? '24px' : '0px'};

  .dropdown {
    position: absolute;
    top: 17px;
    z-index: 10;
    left: 78px;
  }

  .dropdownIconAutoComplete {
    margin-top: 12px;
    position: absolute;
    top: 4px;
    z-index: 10;
    left: 78px;
  }

  .dropdownLargerInput {
    position: absolute;
    top: 137px;
    z-index: 10;
    right: 28px;
  }

  .dropdownCustom {
    position: absolute;
    top: 137px;
    z-index: 10;
    left: 345px;
  }

  .dropdownContainer {
    position: absolute;
    top: 16px;
    z-index: 10;
    right: 28px;
  }
`
export const Form = styled.div`
  margin-top: 26px;
  margin-left: 24px;
  margin-right: 0;
  font-family: DM Sans;
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 150%;
  letter-spacing: 0.02em;
  color: ${(props: any) =>
    props.theme?.commercial?.components?.itemModal?.fontColor};
`

styled(Form)`
margin-right: 24px;
font-size: 14px;
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
  top: 4px;
  margin-top: -4px;
  z-index: 1;
  color: #999dac;
  font-family: DM Sans;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  letter-spacing: 0.02em;
`
export const ButtonDiv = styled.div`
  margin-top: 30px;
  margin-bottom: 25px;
  display: flex;
  justify-content: center;
  width: 100%;
`
