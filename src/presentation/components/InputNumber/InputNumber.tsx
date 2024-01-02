import React, { ChangeEvent, ReactNode } from 'react'
import ControlledInput from '../ControlledInput'

import { NumberInput } from './InputNumberStyles'

interface InputNumberProps {
  id: string
  toolTipTitle: string
  variant?: 'standard' | 'outlined' | 'filled'
  inputProps?: object
  invalid?: boolean
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  value: string | number
  children?: ReactNode
}

const InputNumber: React.FC<InputNumberProps> = ({
  id,
  toolTipTitle,
  variant = 'outlined',
  inputProps,
  invalid = false,
  onChange,
  value,
  children
}) => {
  return (

    <NumberInput
      id={id}
      toolTipTitle={toolTipTitle}
      variant={variant}
      decimalSeparator={','}
      decimalScale={2}
      customInput={ControlledInput}
      inputProps={inputProps}
      invalid={invalid}
      onChange={onChange}
      value={value}
      size="small"
    >
      {children}
    </NumberInput>
  )
}

export default InputNumber
