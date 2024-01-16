/* eslint-disable */
import React from 'react'
import { render, screen } from '@testing-library/react'
import InputComponent from './InputComponent'
import '@testing-library/jest-dom'

const baseProps = {
  toolTipTitle: 'Test Tooltip',
  invalid: false,
  space: false,
  icon: false
}

test('renders TextField', () => {
  render(<InputComponent {...baseProps} />)
  const textField = screen.getByRole('textbox')
  expect(textField).toBeInTheDocument()
})

test('displays error text when invalid', () => {
  render(<InputComponent {...baseProps} invalid={true} />)
  const errorText = screen.getByText(baseProps.toolTipTitle)
  expect(errorText).toBeInTheDocument()
})

test('does not display error text when valid', () => {
  render(<InputComponent {...baseProps} invalid={false} />)
  const errorText = screen.queryByText(baseProps.toolTipTitle)
  expect(errorText).not.toBeInTheDocument()
})
