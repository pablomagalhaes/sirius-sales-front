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
  border-bottom: 1px solid ${(props: any) => props.theme?.commercial?.pages?.proposal?.lineDivisorColor};
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

const ListMainTitleSpan = styled.span`
  font-style: normal;
  font-weight: 400;
  font-size: 18px;
  line-height: 27px;
  letter-spacing: 0.02em;
  margin-right: 35px;
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

const CloseExpirationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 30px;
  svg {
    margin-right: 7px;
    path {
      fill: #f2d16d;
    }
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

  .floating-button-style {
    position: fixed;
    right: 40px;
    bottom: 73px;
    z-index: 99;
  }
`

const PaginationContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
`

const PaginationMainContainer = styled.div`
  width: 60%;
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
  padding: 10px;
  background-color: white;
  font-size: 12px;
`

const TopButtonContainer = styled.div`
  margin-left: auto;
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
  ListMainTitleSpan,
  ExportTariffContainer,
  CloseExpirationContainer,
  OrderByContainer,
  DropdownMenuContainer,
  RowFilterContainer,
  ArrowIconContainer,
  ButtonContainer,
  MidleContainer
}
