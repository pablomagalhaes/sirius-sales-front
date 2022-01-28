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
  width: 100%;
  margin-right: 35px;
`
export const RedColorSpan = styled.span`
  color: ${(props: any) =>
    props.theme?.commercial?.components?.itemModal?.redAsterisk};
  font-size: 12px;
`
export const Label = styled.span`
  width: ${(props) => props.width};
`

export const Title = styled.span`
  margin-left: 24px;
  width: 70%;
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
  svg {
    fill: ${(props: any) =>
      props.theme?.commercial?.components?.itemModal?.iconColor};
  }
`
export const RowDiv = styled.div`
  display: flex;
  margin-bottom: ${(props: { margin: boolean }) =>
    props.margin ? '24px' : '0px'};
`
export const Form = styled.div`
  margin-top: 26px;
  margin-left: 24px;
  margin-right: ${(props: {marginRight: string }) => props.marginRight};
  font-family: DM Sans;
  font-style: normal;
  font-weight: normal;
  font-size: ${(props: {fontSize: string }) => props.fontSize};
  line-height: 150%;
  letter-spacing: 0.02em;
  color: ${(props: any) =>
    props.theme?.commercial?.components?.itemModal?.fontColor};
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
  top: 3px;
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
  margin-top: 50px;
  margin-bottom: 25px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;
`
