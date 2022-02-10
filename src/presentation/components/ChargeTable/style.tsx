import styled from 'styled-components'
import { TableRow } from '@material-ui/core'

export const IconsContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
`

export const IndividualIconContainer = styled.div`
    margin: 0 12px;
    cursor: pointer;
`

export const TableHeader = styled.span`
    color: ${(props: any) => props.theme?.commercial?.components?.itemModal?.fontColor};
    font-size: 12px;
`

export const StyledTableRow = styled(TableRow)`
    .MuiTableCell-root {
        border-bottom: ${(props: { noBorder: boolean }) => props.noBorder ? 0 : '1px solid'};
        border-color: ${(props: any) => props.theme?.commercial?.components?.itemModal?.border};
        color: ${(props: any) => props.theme?.commercial?.components?.itemModal?.inputFontColor};
    }
`

export const BottomRow = styled(TableRow)`
    background-color: ${(props: any) => props.theme?.commercial?.components?.costTable?.backgroundColor};
    .MuiTableCell-root {
        color: ${(props: any) => props.theme?.commercial?.components?.itemModal?.inputFontColor};
        border-bottom: 0;
    }
`
