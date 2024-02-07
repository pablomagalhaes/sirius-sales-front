import React from 'react'
import { StyledSelect, SelectSpan } from './SelectComponentStyle'
import { MenuItem } from '@material-ui/core'

interface SelectProps {
  selectList: string[]
  invalid?: boolean
  handleChange: Function
  value: string
  id: string
  disabled?: boolean
  initialLabel: string
  toolTipTitle: string
  renderValue: Function
}

const SelectComponent: React.FC<SelectProps> = ({
  selectList,
  invalid,
  initialLabel,
  handleChange,
  value,
  id,
  disabled,
  toolTipTitle,
  renderValue
}) => {
  return (
      <StyledSelect
        id={id}
        value={value}
        renderValue={renderValue}
        onChange={handleChange}
        displayEmpty
        disableUnderline
        invalid={invalid}
        toolTipTitle={toolTipTitle}
        disabled={disabled}
      >
        <MenuItem disabled value={value}>
          <SelectSpan placeholder={1}>
            {initialLabel}
          </SelectSpan>
        </MenuItem>
        {selectList.map((item, index) => (
          <MenuItem key={index} value={item}>
            <SelectSpan>{item}</SelectSpan>
          </MenuItem>
        ))}
      </StyledSelect>
  )
}

export default SelectComponent
