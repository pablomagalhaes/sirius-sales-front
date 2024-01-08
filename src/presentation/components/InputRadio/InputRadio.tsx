import React from 'react'
import {
  FormControlLabel,
  RadioGroup
} from '@material-ui/core/'
import IconComponent from '../../../application/icons/IconComponent'
import { StyledRadio, IconContainer } from './InputRadioStyles'

interface RadioGroupProps {
  theme?: any
  value: any
  handleChange: (item) => void
  items: any[]
  invalidInput?: any
  row?: boolean
  ariaLabel?: string
  name?: string
  hasIcon?: boolean
}

const InputRadio: React.FC<RadioGroupProps> = ({
  theme,
  value,
  handleChange,
  items,
  invalidInput,
  row,
  ariaLabel,
  name,
  hasIcon
}) => {
  const getColor = (value): any => {
    if ((value === '' || value === 0) && invalidInput) {
      return theme?.commercial?.components?.itemModal?.redAsterisk
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const handleOnChange = (item): void => {
    handleChange(item) // Chame a função handleChange passada como propriedade
  }
  return (
    <RadioGroup
      row={row}
      aria-label={ariaLabel}
      data-testid={name}
      value={value}
      onChange={(e) => handleOnChange(e.target.value)}
    >
      {items?.map((item, index) => (
        <div key={`div-${index}`} style={{ display: 'flex' }}>
          <FormControlLabel
            value={item.id}
            control={
              <StyledRadio color={getColor(value)} key={`radio-${index}`} />
            }
            label={item.description}
            key={`label-${index}`}
          />
          {hasIcon && (
            <IconContainer key={`container-${index}`}>
              <IconComponent
                name={item.id}
                defaultColor={theme?.commercial?.pages?.newProposal?.subtitle}
                key={`icon-${index}`}
              />
            </IconContainer>
          )}

        </div>
      ))}
    </RadioGroup>
  )
}

export default InputRadio
