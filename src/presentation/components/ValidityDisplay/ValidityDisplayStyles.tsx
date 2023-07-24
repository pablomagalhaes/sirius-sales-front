import styled from 'styled-components'

const IconDisplay = styled.div`
  display: flex;

  .icon {
    margin-right: 5px;
  }
`
const RedColorSpan = styled.span`
  color: ${(props: any) =>
    props.theme?.commercial?.components?.itemModal?.redAsterisk};
`

export {
  IconDisplay,
  RedColorSpan
}
