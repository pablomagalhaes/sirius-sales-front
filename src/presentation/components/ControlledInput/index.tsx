import React from 'react'
import { StyledInput } from './style'
import ControlledToolTip from '../ControlledToolTip/ControlledToolTip'

const ControlledInput = ({ toolTipTitle, invalid, ...props }): JSX.Element => {
  return (
    <ControlledToolTip
      title={toolTipTitle}
      open={invalid}
    >
      <StyledInput
        $invalid={invalid}
        {...props}
      />
    </ControlledToolTip>
  )
}

export default ControlledInput
