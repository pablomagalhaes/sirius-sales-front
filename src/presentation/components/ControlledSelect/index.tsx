import React from 'react'
import { StyledSelect } from './style'
import ControlledToolTip from '../ControlledToolTip/ControlledToolTip'

const ControlledSelect = ({ toolTipTitle, invalid, ...props }): JSX.Element => {
  return (
    <ControlledToolTip title={toolTipTitle} open={invalid}>
      <StyledSelect
        {...props}
        invalid={invalid}
      />
    </ControlledToolTip>
  )
}

export default ControlledSelect
