/* eslint-disable */
import React from 'react'
import { StyledInput, MainContainer, InnerConteiner, SpaceIconContainer, SpaceContainer, ErrorText } from './style'
import LampIcon from '../../../application/icons/LampIcon'

const ControlledInput = ({ toolTipTitle, invalid, ...props }): JSX.Element => {
  return (
    <>
      <MainContainer>
        <InnerConteiner>
            <StyledInput
              invalid={invalid}
              {...props}
            />
        </InnerConteiner>

        {props.space === true && <SpaceContainer />}
        {props.icon === true && <SpaceIconContainer><LampIcon /></SpaceIconContainer>}
      </MainContainer >
      {invalid && !props.hwl && <ErrorText>{toolTipTitle}</ErrorText> }
    </>
  )
}

export default ControlledInput
