import styled from 'styled-components'

export const Container = styled.div`
  width: ${(props: {width: string}) => props.width};
  height: ${(props: {height: string}) => props.height};
  margin: ${(props: {margin: string}) => props.margin};
  svg {
    fill: ${(props: any) =>
    props.theme?.commercial?.components?.itemModal?.iconColor};
  }
`
export const MenuItemContent = styled.span`
margin-left: 10px;
`
