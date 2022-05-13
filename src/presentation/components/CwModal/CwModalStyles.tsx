import styled from 'styled-components'

export const Label = styled.div`
  margin-left: 15px;
  margin-bottom: 20px;
  font-size: 14px;
`
export const CwSaleLabel = styled.div`
  margin-top: 18px;
  margin-left: 15px;
  font-size: 14px;
`

export const CwValue = styled.div`
  margin-left: 20px;
  margin-top: 10px;
  width: 100px;
`

export const ButtonDiv = styled.div`
  margin-top: 40px;
  margin-right: 30px;
  button {
    border: none;
    color: ${(props: {green: boolean}) => props.green ? '#43BFB5' : '#222222'};
  }
`
export const WarningDiv = styled.div`
  width: 100%;
  background-color: #f2d16d;
  margin-top: 32px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 90px;
`

export const WarningMessage = styled.span`
  margin-left: 15px;
  width: 70%;
  font-family: DM Sans;
  font-size: 14px;
  font-weight: 400;
  line-height: 21px;
  letter-spacing: 0.02em;
`
export const WarningBoldMessage = styled.span`
  font-weight: 700;
  margin-right: 5px;
`

export const ValueLabel = styled.div`
  margin-left: 20px;
  font-size: 16px;
  color: ${(props: any) => props.theme?.commercial?.fontColor};
  font-family: DM Sans;
  line-height: 24px;
  letter-spacing: 0.02em;
`
