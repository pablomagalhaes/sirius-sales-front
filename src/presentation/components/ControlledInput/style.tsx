import styled from 'styled-components'
import { TextField } from '@material-ui/core/'
import { primary } from '../../../application/themes'

export const StyledInput = styled(TextField)`
  background: ${(props: any) =>
    props.theme?.commercial?.components?.itemModal?.backgroundColor};
  & .MuiOutlinedInput-root {
    & fieldset {
      border-color: ${(props: { invalid: boolean, value: string | null, theme: any }) => props.invalid
    ? '#FF4D4D'
    : props.value != null && props.value.length > 0
      ? primary
      : props.theme?.commercial?.components?.itemModal?.border};
    }
    &:hover fieldset {
      border-color: ${primary};
    }
    &.Mui-focused fieldset {
      border: 1px solid ${primary};
    }
    input {
      height: ${(props: { modal: boolean }) => (props.modal && '12px')};
    }
  }
  & .MuiInputBase-input {
    height: ${(props: { modal: boolean }) => (props.modal && '0')};
  }
`
