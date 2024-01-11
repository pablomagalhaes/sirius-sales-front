import React from 'react'
import {
  FormControlLabel,
  Checkbox
} from '@material-ui/core/'

interface CheckBoxProps {
  theme?: any
  checked: boolean
  label: string
  handleChange: Function
  value: string
  id: string
}

const CheckBox: React.FC<CheckBoxProps> = ({
  theme,
  checked,
  label,
  handleChange,
  value,
  id
}) => {
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const handleOnChange = (item): void => {
    handleChange(item)
  }
  return (
    <FormControlLabel
      value={value}
      control={
        <Checkbox
          checked={checked}
          onChange={handleOnChange}
          data-testid="checkbox-test"
        />
      }
      label={label}
      id={id}
      data-testid="checkbox-label-test"
    />
  )
}

export default CheckBox
