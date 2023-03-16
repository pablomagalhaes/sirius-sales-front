import styled from 'styled-components'
import { withStyles } from '@material-ui/core/styles'
import MuiTableCell from '@material-ui/core/TableCell'

const RootContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 90vh;
  margin: 0 24px;

  .breadcrumbInitial {
    color: ${(props: any) => props.theme?.commercial?.pages?.proposal?.breadcrumbInitial};
    font-size: 14px;
  }
  .breadcrumbEnd {
    color: ${(props: any) => props.theme?.commercial?.pages?.proposal?.breadcrumbEnd};
    font-weight: bold;
    font-size: 14px;
  }

  & .MuiBreadcrumbs-separator {
    color: ${(props: any) => props.theme?.commercial?.pages?.proposal?.breadcrumbInitial};
  }
`
const RowFilterContainer = styled.div`
  margin: 25px 0;
`

const ButtonContainer = styled.div`
  height: 36px;
`

// list header styles

const ListHeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
`

const LeftSideListHeaderContainer = styled.div`
  margin: 15px 0;
  display: flex;
  align-items: center;
  align-self: flex-start;
`

const ExportTariffContainer = styled.div`
  display: flex;
    align-items: center;
    justify-content: center;
    color: #1f6660;
    cursor: pointer;
    svg {
      margin-right: 7px;
      path {
        fill: ${(props: any) => props.theme?.commercial?.pages?.proposal?.exportListSpan};
      }
    }
`

const ListTextSpan = styled.span`
  margin-right: 21px;
  color: ${(props: any) => props.theme?.commercial?.pages?.proposal?.listTextSpan};
`

const ExportListSpan = styled.span`
  color: ${(props: any) => props.theme?.commercial?.pages?.proposal?.exportListSpan};
`

const RightSideListHeaderContainer = styled.div`
  margin: 15px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  align-self: flex-end;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 150%;
  color: ${(props: any) => props.theme?.commercial?.pages?.proposal?.tableHeader};
  position: relative;
  top: 50px;
`

const OrderByContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 30px;
`

const DropdownMenuContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${(props: any) => props.theme?.commercial?.pages?.proposal?.dropdownBackgroundColor};
  min-width: 150px;
  height: 32px;
  border: 1px solid ${(props: any) => props.theme?.commercial?.pages?.proposal?.dropdownBorderColor};
  box-sizing: border-box;
  border-radius: 4px;

  .select-style {
    .MuiSelect-select:focus {
      background-color: transparent;
    }

    .MuiSelect-icon {
      color: ${(props: any) => props.theme?.commercial?.pages?.proposal?.dropdownIconColor}
    }
    padding-left: 16px;
    width: 100%;
  }

  span {
    color: ${(props: any) => props.theme?.commercial?.pages?.proposal?.dropdownFontColor};
  }
`

const ArrowIconContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 8px;
  width: 20px;
  height: 20px;
  cursor: pointer;

  svg {
    transform: ${(props: { rotate: boolean }) => !props.rotate && 'rotate(180deg)'};
  }
`

// end of list header styles

const TableContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: auto;
  width: 100%;
  justify-content: flex-start;
  overflow-x: auto;
`

const BottomSideContainer = styled.div`
  display: flex;
  margin: 0;
  flex-direction: column;

  .makeStyles-root-1 {
    background: #f2f2f7;
  }

  .floating-button-style {
    position: fixed;
    right: 40px;
    bottom: 73px;
    z-index: 99;
  }

  .MuiTypography-root {
    text-transform: uppercase;
    font-size: 14px;
    font-weight: 700;
    line-height: 21px;
    letter-spacing: 0.02em;
  }

  .MuiTab-fullWidth {
    max-width: 100px !important;
  }

  .MuiBox-root {
    padding: 0 !important;
  }

  .MuiAppBar-root {
    border-bottom: 1px solid ${(props: any) => props.theme?.commercial?.pages?.proposal?.lineDivisorColor};
  }

  .MuiTab-wrapper > div {
    text-align: center !important;
    display: flex;
    justify-content: center !important;
    font-size: 16px;
    font-weight: 700;
    line-height: 24px;
    letter-spacing: 0.02em;

  }

  .MuiTabs-indicator {
    background: #2E9990 !important;
  }
`

const PaginationContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-top: 20px;
`

const PaginationMainContainer = styled.div`
  width: 100%;
  
  & .MuiSelect-select {
    padding-left: 10px !important;
  }
`

const TopContainer = styled.div`
  margin: 18px 0;
  display: flex;
  flex-direction: row;
  width: 100%;
  align-items: center;
`

const MidleContainer = styled.div`
  width: 100%;
  margin: 18px 0;
  background-color: white;
`

const MidleTypography = styled.div`
  font-weight: 400;
  font-size: 12px;
  line-height: 150%;
  margin: 8px 16px;
`

const TopButtonContainer = styled.div`
  margin-left: auto;
`
const MainTariffContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%; 
`

const TableCell = withStyles({
  root: {
    borderBottom: 'none'
  }
})(MuiTableCell)

export {
  RootContainer,
  ListHeaderContainer,
  LeftSideListHeaderContainer,
  RightSideListHeaderContainer,
  TableContainer,
  TableCell,
  BottomSideContainer,
  PaginationContainer,
  PaginationMainContainer,
  TopContainer,
  TopButtonContainer,
  ListTextSpan,
  ExportListSpan,
  ExportTariffContainer,
  OrderByContainer,
  DropdownMenuContainer,
  RowFilterContainer,
  ArrowIconContainer,
  ButtonContainer,
  MidleContainer,
  MainTariffContainer,
  MidleTypography
}
