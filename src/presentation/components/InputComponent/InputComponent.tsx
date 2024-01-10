/* eslint-disable */
import React from 'react'

import TextField from '@material-ui/core/TextField';

import { MainContainer, InnerConteiner, SpaceIconContainer, SpaceContainer, ErrorText } from './InputComponentStyles'
import LampIcon from '../../../application/icons/LampIcon'

const InputComponent = ({ toolTipTitle, invalid, ...props }): JSX.Element => {
  return (
    <>
      <MainContainer>
        <InnerConteiner>
            <TextField
              onInvalid={invalid}
              {...props}
            />
        </InnerConteiner>
        {props.space === true && <SpaceContainer />}
        {props.icon === true && <SpaceIconContainer><LampIcon /></SpaceIconContainer>}
      </MainContainer>
      {invalid && !props.hwl && <ErrorText>{toolTipTitle}</ErrorText> }
    </>
  )
}

export default InputComponent
