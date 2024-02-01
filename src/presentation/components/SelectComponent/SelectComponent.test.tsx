import React from 'react'
import { render, screen,fireEvent } from '@testing-library/react'
import SelectComponent from './SelectComponent'
import '@testing-library/jest-dom'

const baseProps = {
  selectList: ['test', 'test2'],
  handleChange: () => {},
  value: 'initialValue',
  id: 'test',
  initialLabel: 'initialLabel',
  toolTipTitle: 'tooltip',
  renderValue: (value) => {return value}
}

test('renders Select Component with initial value', () => {
  render(<SelectComponent {...baseProps} />)
  const select = screen.getByText('initialValue')
  expect(select).toBeInTheDocument()
})

test('when clicked open the select menu and show the items', () => {
    render(<SelectComponent {...baseProps}/>)
    fireEvent.mouseDown(screen.getByText('initialValue'))
    const test = screen.getByText('test')
    const test2 = screen.getByText('test2')
    expect(test).toBeInTheDocument()
    expect(test2).toBeInTheDocument()
})

test('should trigger the handle change function when select an item', () => {
  const handleChange = jest.fn()
  render(<SelectComponent {...baseProps} handleChange={handleChange}/>)
  fireEvent.mouseDown(screen.getByText('initialValue'))
  const test = screen.getByText('test')
  fireEvent.click(test)
  expect(handleChange).toBeCalledTimes(1)
})

