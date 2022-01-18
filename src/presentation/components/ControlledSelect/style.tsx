import React from 'react'
import styled from 'styled-components'
import { Select } from '@material-ui/core'
import { primary } from '../../../application/themes'

const StyledField = styled(Select)`
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
      ? props.theme?.commercial?.pages?.newProposal?.subtitle
      : props.theme?.commercial?.components?.itemModal?.inputFontColor};
    }

    & .MuiSvgIcon-root {
      margin-right: 5px;
    }
  `

export const StyledSelect = styled(({ className, ...props }) => (<StyledField {...props} MenuProps={{ classes: { paper: className } }} />))`
  && {
    background-color: ${(props: any) => props.theme?.commercial?.pages?.newProposal?.background};
    color: ${(props: any) => props.theme?.commercial?.pages?.newProposal?.subtitle};
  }
`
