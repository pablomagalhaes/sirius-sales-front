import React from 'react'
import Autocomplete from '@material-ui/lab/Autocomplete'
import TextField from '@material-ui/core/TextField'

import { MainContainer, InnerConteiner, ErrorText } from './style'

interface InputControlledComponentProps {
  theme?: any
  data: any[]
  toolTipTitle?: string
  invalid?: boolean
  [key: string]: any
  InputProps?: Partial<React.ComponentProps<typeof TextField>>['InputProps']
  name?: string
}

const InputControlledComponent = ({
  theme,
  data,
  toolTipTitle,
  invalid,
  InputProps,
  name,
  ...props
}: InputControlledComponentProps): JSX.Element => {
  return (
    <>
      <MainContainer>
        <InnerConteiner invalid={invalid}>
          <Autocomplete
            disablePortal
            data-testid={name}
            options={data}
            renderInput={(params) => (
              <TextField
                {...params}
                error={invalid}
              />
            )}
            {...props}
          />
        </InnerConteiner>
      </MainContainer>
      {invalid && <ErrorText>{toolTipTitle}</ErrorText> }
    </>
  )
}

export default InputControlledComponent
