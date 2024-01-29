import styled from 'styled-components'

const OrderByContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`

const ListTextSpan = styled.span`
  margin-right: 21px;
  color: ${(props: any) => props.theme?.commercial?.pages?.proposal?.listTextSpan};
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

export {
    OrderByContainer,
    ListTextSpan,
    DropdownMenuContainer,
    ArrowIconContainer
  }