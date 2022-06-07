import styled from 'styled-components'

import { Table, TableCell, TableRow } from '@material-ui/core'

const FormatValue = styled.p`
    width: 200px;
`

interface StyledTableCellProps {
  color: boolean
  width: string
  theme: any
}

const StyledTable = styled(Table)`
  margin-top: 20px;
`

const StyledTableCell = styled(TableCell)`
    width: ${(props: StyledTableCellProps) => props.width};
    color: ${(props: StyledTableCellProps) => props.color
      ? `${String(props.theme?.commercial?.pages?.newProposal?.steps?.stepFare)}`
      : `${String(props.theme?.commercial?.pages?.newProposal?.font)}`};
`

const DeleteIconDiv = styled.div`
  cursor: pointer;
  height: 36px;
  align-items: center;
  display: flex;
`

const EditIconDiv = styled.div`
  margin-right: 20px;
  cursor: pointer;
  height: 36px;
  padding-left: 16px;
  align-items: center;
  display: flex;
`

const StyledTableRow = styled(TableRow)`
    .MuiTableCell-root {
        border-bottom: ${(props: { noBorder: boolean }) => props.noBorder ? 0 : '1px solid'};
        border-color: ${(props: any) => props.theme?.commercial?.components?.itemModal?.border};
        color: ${(props: any) => props.theme?.commercial?.components?.itemModal?.inputFontColor};
    }
`

const TableHeader = styled.span`
    color: ${(props: any) => props.theme?.commercial?.components?.itemModal?.fontColor};
    font-size: 12px;
`

const StyledRow = styled(TableRow)`
  justify-content: space-between !important;
  margin: 0 20px !important;
`

const RowReverseDiv = styled.div`
  display: flex;
  flex-direction: row-reverse;
  justify-self: flex-end;
  width: 100%;
  margin-right: 35px;
`

export { FormatValue, StyledRow, TableHeader, StyledTableRow, EditIconDiv, DeleteIconDiv, StyledTableCell, StyledTable, RowReverseDiv }
