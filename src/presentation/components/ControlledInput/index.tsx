import React from 'react'
import { StyledInput } from './style'
import ControlledToolTip from '../ControlledToolTip/ControlledToolTip'

const ControlledInput = ({ toolTipTitle, invalid, ...props }): JSX.Element => {
  return (
    <ControlledToolTip
      open={invalid}
      title={toolTipTitle}
    >
      <StyledInput
        $invalid={invalid}
        {...props}
      />
    </ControlledToolTip>
  )
}

export default ControlledInput
