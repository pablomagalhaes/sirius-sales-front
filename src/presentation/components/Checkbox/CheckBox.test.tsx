import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import CheckBox from './CheckBox'
import '@testing-library/jest-dom'
const props = {
  checked: true,
  label: 'Testando',
  handleChange: () => {},
  value: 'Teste',
  id: 'teste-id'
}

test('should show text label', () => {
  render(<CheckBox {...props} />)
  expect(screen.getByTestId('checkbox-label-test').textContent).toBe(props.label)
})

test('should click on the checkbox and should trigger handlechange', () => {
  const handleChange = jest.fn()
  render(<CheckBox {...props} handleChange={handleChange}/>)
  fireEvent.click(screen.getByTestId('checkbox-test'))
  expect(handleChange).toBeCalledTimes(1)
})

test('should be checked when props checked is true', () => {
  render(<CheckBox {...props} />)
  const checkbox = screen.getByTestId('checkbox-test')
  expect(Object.values(checkbox.classList).includes('Mui-checked')).toEqual(true)
})
