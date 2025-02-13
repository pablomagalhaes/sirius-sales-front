import styled from 'styled-components'

import { Table, TableCell, TableRow } from '@material-ui/core'

export const MainDiv = styled.div`
  width: auto;
  border-radius: 8px;
  background: ${(props: any) => props.theme?.commercial?.components?.costTable?.backgroundColor};
  margin-top: 30px;
  padding: 0 16px;

  .MuiTableCell-root {
    padding-left: 0 !important;
  }

  .MuiTableCell-body {
    border-bottom: 1px solid ${(props: any) => props.theme?.commercial?.components?.costTable?.border} !important;
  }

  .noBorder {
    border-bottom: none !important;
    padding: 8px 16px 8px 0 !important;
  }

  .noPadding {
    padding: 0 16px 0 0 !important;
  }
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
  margin-top: 30px;
`

export const StyledTable = styled(Table)`
  margin-top: 20px;
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

interface StyledTableCellProps {
  color: boolean
  width: string
  theme: any
}

export const StyledTableCell = styled(TableCell)`
  width: ${(props: StyledTableCellProps) => props.width};
  color: ${(props: StyledTableCellProps) => props.color
    ? `${String(props.theme?.commercial?.pages?.newProposal?.steps?.stepFare)}`
    : `${String(props.theme?.commercial?.pages?.newProposal?.font)}`};
`

export const Description = styled.span`
  font-family: DM Sans;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 150%;
  letter-spacing: 0.02em;
  color: ${(props: any) => props.theme?.commercial?.components?.costTable?.title} !important;
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

export const RowReverseContainer = styled.div`
  display: flex;
  flex-direction: column;
`

export const Footer = styled.div`
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
  width: 50px;
`

export const ValueLabel = styled.span`
  margin-top:7px;
  font-weight: normal;
  font-size: 16px;
  color: ${(props: any) => props.theme?.commercial?.components?.costTable?.title};
  margin-right: 30px;
  width: 110px;
`

export const EndValueLabel = styled.span`
  margin-top:7px;
  font-weight: normal;
  font-size: 16px;
  color: ${(props: any) => props.theme?.commercial?.components?.costTable?.title};
  width: 110px;
`

export const TotalCostLabel = styled.span`
  margin-top:7px;
  color: ${(props: any) => props.theme?.commercial?.components?.costTable?.title};
  font-weight: bold;
  font-size: 16px;
`
export const DeleteIconDiv = styled.div`
  cursor: pointer;
  height: 36px;
  align-items: center;
  display: flex;
`

export const EditIconDiv = styled.div`
  margin-right: 20px;
  cursor: pointer;
  height: 36px;
  border-left: 1px solid ${(props: any) => props.theme?.commercial?.components?.costTable?.border};
  padding-left: 16px;
  align-items: center;
  display: flex;
`
export const EmptyTableCost = styled.span`
  margin-left: 40px;
`

export const SecondaryValue = styled.span`
  display: flex;
  font-size: 12px;
  line-height: 150%;
  letter-spacing: 0.02em;
  color: ${(props: any) => props.theme?.commercial?.components?.costTable?.subtitle};
`

export const ButtonContainer = styled.div`
  margin-top: 24px;
`

export const RedColorSpan = styled.span`
  color: ${(props: any) =>
    props.theme?.commercial?.components?.costTable?.errorText};
  font-size: 16px;
  font-weight: bold;
`

export const ErrorText = styled.span`
  color: ${(props: any) => props.theme?.commercial?.components?.costTable?.errorText};
  font-weight: normal;
  font-size: 12px;
  letter-spacing: 0.02em;
  line-height: 150%;
`
