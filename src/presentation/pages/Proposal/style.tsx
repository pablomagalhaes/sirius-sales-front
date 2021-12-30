import styled from 'styled-components'

const RootContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: auto;
  margin: 0 24px;

  .breadcrumbInitial {
    color: ${(props: any) => props.theme?.proposal?.breadcrumbInitial};
  }

  .breadcrumbEnd {
    color: ${(props: any) => props.theme?.proposal?.breadcrumbEnd};
    font-weight: bold;
  }
`

const ListHeader = styled.div`
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #e3e5eb;
`

const LeftSideListHeader = styled.div`
  margin: 15px 0;
  display: flex;
  align-items: center;
  align-self: flex-start;

  .main-title {
    font-style: normal;
    font-weight: bold;
    font-size: 18px;
    line-height: 27px;
    letter-spacing: 0.02em;
    margin-right: 35px;
  }

  .export-list-class {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #1f6660;
    cursor: pointer;
    svg {
      margin-right: 7px;
      path {
        fill: #1f6660;
      }
    }
  }
`

const RightSideListHeader = styled.div`
  margin: 15px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  align-self: flex-end;

  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 150%;
  color: ${(props: any) => props.theme?.proposal?.tableHeader};

  .warning-content {
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
  }

  .order-content {
    display: flex;
    justify-content: center;
    align-items: center;

    .dropdown-menu-content {
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-left: 21px;
      color: ${(props: any) => props.theme?.proposal?.dropdownColor};
      span {
        margin-right: 18px;
      }
    }
  }
`

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
  margin: 30px 0;
  flex-direction: column;

  .floating-button-style {
    position: fixed;
    right: 40px;
    bottom: 40px;
  }
`

export {
  RootContainer,
  ListHeader,
  LeftSideListHeader,
  RightSideListHeader,
  TableContainer,
  BottomSideContainer
}
