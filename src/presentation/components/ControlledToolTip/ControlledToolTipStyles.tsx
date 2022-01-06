import styled from 'styled-components'
import React from 'react'
import { Tooltip } from '@material-ui/core'

export const StyledTooltip = styled(({ className, ...props }) => (
    <Tooltip title={props.title} arrow {...props} classes={{ popper: className }} >{props.children}</Tooltip>
))`
    z-index: 1300 !important;
    & .MuiTooltip-tooltip {
      background: #000000CC;
      font-family: DM Sans;
      font-style: normal;
      font-weight: normal;
      font-size: 10px;
      line-height: 150%;
      letter-spacing: 0.02em;
      color: #F2F3F7;
      bottom:7px;
    }
  
    & .MuiTooltip-arrow {
      color: #000000CC;
    }
  `
