import styled from 'styled-components'
import { Radio } from '@material-ui/core/'

interface StyledRadioProps {
  color?: string
}

export const StyledRadio = styled(Radio)`
  color: ${({ color }: StyledRadioProps) => color} !important;
`

export const IconContainer = styled.div`
  align-self: center;
  margin-right: 30px;
`
