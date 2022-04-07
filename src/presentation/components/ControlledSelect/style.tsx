import React from 'react'
import styled from 'styled-components'
import { Select } from '@material-ui/core'
import { primary } from '../../../application/themes'
import ControlledToolTip from '../ControlledToolTip/ControlledToolTip'

export const StyledField = styled(Select)`
    border: 1px solid ${(props: { invalid: boolean, value: string | null, theme: any }) =>
    props.invalid
      ? '#FF4D4D'
      : props.value != null && props.value.toString().length > 0
        ? `${primary}`
        : props.theme?.commercial?.components?.itemModal?.border};
    border-radius: 4px;
    width: 100%;

    &:hover {
      border-color: ${primary};
    }

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

    & .MuiMenu-list {
    height: 300px;
    overflow-y: scroll;
}
  `

export const StyledSelect = styled(
  ({ className, toolTipTitle, title, invalid, ...props }) => {
    return (
      <ControlledToolTip title={toolTipTitle} open={invalid}>
        <StyledField
          {...props}
          invalid={invalid}
          MenuProps={{ classes: { paper: className }, 
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "left"
          },
          transformOrigin: {
            vertical: "top",
            horizontal: "left"
          },
          getContentAnchorEl: null} }
        />
      </ControlledToolTip>
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
