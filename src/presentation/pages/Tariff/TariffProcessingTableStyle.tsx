import styled from 'styled-components'
import { withStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableBody from '@material-ui/core/TableBody'

const RootContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
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
  z-index: 1;
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
  background-color: '#FFFFFF';
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
  > div {
    justify-content: start !important;
  }
  #container_card {
    padding-right: 35px !important;
  }
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

const GridButton = styled.div`

`

const RowButton = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  align-items: flex-end;
  align-content: flex-start;
  flex-direction: row;
`

const ColButton = styled.div`
  margin: 10px;
`

const TableCell = withStyles({
  root: {
    // borderBottom: 'none'
    backgroundColor: '#FFFFFF',
    color: '#545454'
  }
})(Table)

const TableHeader = withStyles({
  root: {
    // borderBottom: 'none'
    backgroundColor: '#FFFFFF',
    fontWeight: 'bold',
    color: '#000000'
  }
})(TableHead)

const TableBod = withStyles({
  root: {
    // borderBottom: 'none'
    backgroundColor: '#FFFFFF',
    color: '#545454'
  }
})(TableBody)

export {
  RootContainer,
  ListHeaderContainer,
  LeftSideListHeaderContainer,
  RightSideListHeaderContainer,
  TableContainer,
  TableCell,
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
  MidleTypography,
  GridButton,
  RowButton,
  ColButton,
  TableHeader,
  TableBod
}
