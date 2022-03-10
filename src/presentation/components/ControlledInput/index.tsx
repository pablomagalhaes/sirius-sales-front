import React from 'react'
import { StyledInput, MainContainer, InnerConteiner, SpaceIconContainer, SpaceContainer } from './style'
import ControlledToolTip from '../ControlledToolTip/ControlledToolTip'
import LampIcon from '../../../application/icons/LampIcon'

const ControlledInput = ({ toolTipTitle, invalid, ...props }): JSX.Element => {
  return (
    <MainContainer>
      <InnerConteiner>
        <ControlledToolTip
          open={invalid}
          title={toolTipTitle}
        >
          <StyledInput
            $invalid={invalid}
            {...props}
          />
        </ControlledToolTip>
      </InnerConteiner>
      {props.space === true && <SpaceContainer />}
      {props.icon === true && <SpaceIconContainer><LampIcon /></SpaceIconContainer>}
    </MainContainer >
  )
}

export default ControlledInput
