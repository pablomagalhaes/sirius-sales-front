import styled from 'styled-components'
import { primary } from '../../../application/themes'

export const MainContainer = styled.div`
  display: flex;
  width: 100%; 
  align-items: center;
`

export const InnerConteiner = styled.div`
  width: 100%;
  background: ${(props: { disabled: boolean, theme: any }) =>
    props.disabled ? props.theme?.commercial?.components?.itemModal?.disabledBackground : props.theme?.commercial?.components?.itemModal?.backgroundColor};

  .MuiAutocomplete-root {
    width: 100%;

    .MuiInput-underline {
      &:before {
        border-bottom: 2px solid ${(props: { invalid: boolean, theme: any }) => props.invalid ? '#FF4D4D' : props.theme?.commercial?.components?.itemModal?.border};
      }

      &:hover:before {
        border-bottom: 2px solid ${primary};
      }

      &.Mui-focused:before {
        border-bottom: 2px solid ${primary};
      }
    }

    .MuiAutocomplete-inputRoot[class*="MuiInput-root"] .MuiAutocomplete-input {
      color: ${(props: { disabled: boolean, theme: any }) =>
        props.disabled ? props.theme?.commercial?.pages?.newProposal?.placeholder : props.theme?.commercial?.components?.itemModal?.inputFontColor};
    }
  }
`

export const ErrorText = styled.span`
  color: ${(props: any) => props.theme?.commercial?.components?.costTable?.errorText};
  font-weight: normal;
  font-size: 12px;
  letter-spacing: 0.02em;
  line-height: 150%;
  margin-top: 8px;
`
export const SpaceContainer = styled.div`
  width: 16px; 
  height: 16px; 
  margin: 0 16px; 
`

export const SpaceIconContainer = styled.div`
  margin: 0 16px; 
`
