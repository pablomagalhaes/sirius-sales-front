import styled from 'styled-components'
import { TextField } from '@material-ui/core/'
import { primary } from '../../../application/themes'

export const StyledInput = styled(TextField)`
  background: ${(props: { disabled: boolean, theme: any }) =>
    props.disabled ? props.theme?.commercial?.components?.itemModal?.disabledBackground : props.theme?.commercial?.components?.itemModal?.backgroundColor};
  & .MuiOutlinedInput-root {
    & fieldset {
      border-color: ${(props: { invalid: boolean, value: string | null, theme: any }) => props.invalid
    ? '#FF4D4D'
    : props.value != null && props.value.length > 0
      ? primary
      : props.theme?.commercial?.components?.itemModal?.border} !important;
    }
    &:hover fieldset {
      border-color: ${primary};
    }
    &.Mui-focused fieldset {
      border: 1px solid ${primary};
    }
    input {
      height: ${(props: { modal: boolean }) => (props.modal && '12px')};
      color: ${(props: { disabled: boolean, theme: any }) =>
    props.disabled ? props.theme?.commercial?.pages?.newProposal?.placeholder : props.theme?.commercial?.components?.itemModal?.inputFontColor};
    }
  }
  & .MuiInputBase-input {
    height: ${(props: { modal: boolean }) => (props.modal && '0')};
  }

  svg path {
    fill: ${(props: any) => props.theme?.commercial?.pages?.newProposal?.subtitle}
  }
`

export const MainContainer = styled.div`
  display: flex;
  width: 100%; 
  align-items: center;
`
export const InnerConteiner = styled.div`
  width: 100%;
`
export const SpaceContainer = styled.div`
  width: 16px; 
  height: 16px; 
  margin: 0 16px; 
`

export const SpaceIconContainer = styled.div`
  margin: 0 16px; 
`

export const ErrorText = styled.span`
  color: ${(props: any) => props.theme?.commercial?.components?.costTable?.errorText};
  font-weight: normal;
  font-size: 12px;
  letter-spacing: 0.02em;
  line-height: 150%;
`
