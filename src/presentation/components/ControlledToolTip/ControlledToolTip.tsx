import React, { useState } from 'react'
import { StyledTooltip } from './ControlledToolTipStyles'

const ControlledToolTip = (props: {title: string, open: boolean, children: React.ReactNode }): JSX.Element => {
  const [mouseOn, setMouseOn] = useState(false)

  const mouseEnterHandler = (): void => {
    setMouseOn(true)
  }

  const mouseLeaveHandler = (): void => {
    setMouseOn(false)
  }

  return (
    <div onClick={mouseLeaveHandler} onMouseEnter={mouseEnterHandler} onMouseLeave={mouseLeaveHandler}>
      <StyledTooltip aria-label="toolTip" title={props.title} open={mouseOn && props.open}>
        {props.children}
      </StyledTooltip>
    </div>
  )
}
export default ControlledToolTip
