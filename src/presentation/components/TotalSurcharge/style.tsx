import styled from 'styled-components'

const TotalContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: auto;
  border-radius: 8px;
  background: ${(props: any) => props.theme?.commercial?.components?.totalSurchage?.backgroundColor};
  margin-top: 30px;
  padding: 0 16px;
  font-family: 'DM Sans';
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 150%;
  color: ${(props: any) => props.theme?.commercial?.components?.totalSurchage?.fontColor};
  letter-spacing: 0.02em;
`

const UpperContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin: 20px 1%;
  width: 98%;
  border-bottom: 1px solid;
  border-color: ${(props: any) => props.theme?.commercial?.components?.totalSurchage?.borderColor};
  padding-bottom: 15px;
`
const LowerContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 20px;
  margin-left: 1%;
  margin-right: 1%;
  width: 98%;
`

const ProfitContainer = styled.div`
  display: flex;
  flex-direction: column;
`

const PercentageCard = styled.div`
  background: ${(props: any) => props.color === 'red' ? 'red' : '#6CD99A' };
  border-radius: 4px;
  font-weight: 400;
  padding: 2px 9px;
  color: #222222;
  margin-left: 15px;
`

const CwLabel = styled.span`
  margin-right: 41px;
  width: 200px;
  min-width: 100px;
`

const ProfitLabel = styled.div`
  margin-right: 15px;
  width: 600px;
  display: flex;
  flex-direction: row;
`
const ProfitValue = styled.span`
  margin-left: 15px;
  font-weight: 400;
`

const PercentageLabel = styled.span`
  margin-left: 5px;
`

const TotalCargoContainer = styled.div`
  margin-left: auto;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 350px;
`

export {
  TotalContainer,
  UpperContainer,
  TotalCargoContainer,
  CwLabel,
  ProfitLabel,
  ProfitValue,
  LowerContainer,
  ProfitContainer,
  PercentageLabel,
  PercentageCard
}
