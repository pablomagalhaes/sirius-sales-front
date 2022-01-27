import styled from 'styled-components'

import { Table, TableCell, TableRow } from '@material-ui/core'

export const MainDiv = styled.div`
  width: 95%;
  border-radius: 8px;
  background: ${(props: any) => props.theme?.commercial?.components?.costTable?.backgroundColor};
  margin-left: 20px;
  margin-top: 30px;
`

export const Header = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  align-items: center;
  letter-spacing: 0.02em;
  font-family: DM Sans;
  font-style: normal;
  line-height: 150%;
`

export const Title = styled.span`
  color: ${(props: any) => props.theme?.commercial?.components?.costTable?.title};
  width: 15%;
  font-weight: bold;
  font-size: 16px;
  margin-left: 45px;
  margin-top: 30px;
`

export const StyledTable = styled(Table)`
  max-width: 94%;
  margin-top: 20px;
  margin-left: 30px;
`

export const TableHeadRow = styled(TableRow)`
  .MuiTableCell-root {
    border-bottom: none;
    font-family: DM Sans;
    color: ${(props: any) => props.theme?.commercial?.components?.costTable?.subtitle};
    font-style: normal;
    font-weight: normal;
    font-size: 12px;
    line-height: 150%;
    letter-spacing: 0.02em;
    font-weight: normal;
  }
`

export const StyledTableCell = styled(TableCell)`
  width: ${(props) => props.width};
`

export const Description = styled.span`
  font-family: DM Sans;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 150%;
  letter-spacing: 0.02em;
  color: ${(props: any) => props.theme?.commercial?.components?.costTable?.title};
`

export const Type = styled.span`
  font-family: DM Sans;
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 150%;
  letter-spacing: 0.02em;
  color: ${(props: any) => props.theme?.commercial?.components?.costTable?.title};
`

export const Default = styled.span`
  font-family: DM Sans;
  font-style: normal;
  font-weight: bold;
  font-size: 14px;
  line-height: 150%;
  letter-spacing: 0.02em;
  color: ${(props: any) => props.theme?.commercial?.components?.costTable?.title};
`

export const Empty = styled.span`
  font-family: DM Sans;
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 150%;
  letter-spacing: 0.02em;
  color: ${(props: any) => props.theme?.commercial?.components?.costTable?.emptyLabel};
`

export const RowReverseDiv = styled.div`
  display: flex;
  flex-direction: row-reverse;
  justify-self: flex-end;
  width: 100%;
`

export const Footer = styled.div`
  max-width: 94%;
  margin-top: 30px;
  margin-left: 30px;
  padding-bottom: 30px;
  letter-spacing: 0.02em;
  font-family: DM Sans;
  font-style: normal;
  line-height: 150%;
  display: flex;
  flex-direction: row;
`

export const CostLabel = styled.span`
  margin-top:7px;
  font-weight: normal;
  font-size: 12px;
  color: ${(props: any) => props.theme?.commercial?.components?.costTable?.subtitle};
  margin-right: 30px;
`

export const ValueLabel = styled.span`
  margin-top:7px;
  font-weight: normal;
  font-size: 16px;
  color: ${(props: any) => props.theme?.commercial?.components?.costTable?.title};
  margin-right: 30px;
`

export const EndValueLabel = styled.span`
  margin-top:7px;
  font-weight: normal;
  font-size: 16px;
  color: ${(props: any) => props.theme?.commercial?.components?.costTable?.title};
`

export const TotalCostLabel = styled.span`
  margin-top:7px;
  color: ${(props: any) => props.theme?.commercial?.components?.costTable?.title};
  font-weight: bold;
  font-size: 16px;
  margin-right: 35px;
`
export const EditIconDiv = styled.div`
  margin-right: 20px; 
`
export const EmptyTableCost = styled.span`
margin-left: 40px;
`
