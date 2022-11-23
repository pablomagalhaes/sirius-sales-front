/* eslint-disable */
import React from 'react'
import styled from 'styled-components'
import { Select } from '@material-ui/core'
import { primary } from '../../../application/themes'

export const StyledField = styled(Select)`
    border: 1px solid ${(props: { invalid: boolean, value: string | null, theme: any }) =>
    props.invalid
      ? '#FF4D4D'
      : props.value != null && props.value.toString().length > 0
        ? `${primary}`
        : props.theme?.commercial?.components?.itemModal?.border};
    border-radius: 4px;
    width: 100%;

    & .MuiSelect-root {
      font-size: 14px;
      color: ${(props) =>
    props.placeholder === ''
      ? props.theme?.commercial?.pages?.newProposal?.placeholder
      : props.theme?.commercial?.components?.itemModal?.inputFontColor};
    }

    & .MuiSvgIcon-root {
      margin-right: 5px;
    }

    & .MuiInputBase-input.Mui-disabled {
      background: ${(props: any) => props.theme?.commercial?.pages?.newProposal?.disabledBackground};
    }
  `
export const ErrorText = styled.span`
  color: ${(props: any) => props.theme?.commercial?.components?.costTable?.errorText};
  font-weight: normal;
  font-size: 12px;
  letter-spacing: 0.02em;
  line-height: 150%;
`

export const StyledSelect = styled(
  ({ className, toolTipTitle, title, invalid, ...props }) => {
    return (
      <>
        <StyledField
          {...props}
          invalid={invalid}
          MenuProps={{
            classes: { paper: className },
            anchorOrigin: {
              vertical: 'bottom',
              horizontal: 'left'
            },
            transformOrigin: {
              vertical: 'top',
              horizontal: 'left'
            },
            getContentAnchorEl: null
          } }
        />
        {invalid && !props.costModal && <ErrorText>{toolTipTitle}</ErrorText> }
      </>
    )
  }
)`
  && {
    background-color: ${(props: any) =>
    props.theme?.commercial?.pages?.newProposal?.background};
    color: ${(props: any) =>
    props.theme?.commercial?.pages?.newProposal?.subtitle};
  }
`
