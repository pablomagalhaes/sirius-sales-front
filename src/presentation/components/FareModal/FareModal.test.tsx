import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import FareModal from './FareModal'
import '@testing-library/jest-dom'
const props = {
  dataProp: {
    type: 'CW',
    expense: 'Fuel - Security1',
    saleValue: '50,0',
    minimumValue: '',
    saleCurrency: 'EUR',
    id: null
  },
  title: 'Editar item',
  action: () => {},
  setOpen: () => {},
  open: true,
  setClose: () => {},
  modal: '',
  specifications: ''
}

test('should show text Editar item', () => {
  render(<FareModal {...props} />)
  expect(screen.getByText(/Editar item/).textContent).toBe('Editar item')
})

test('should click on the Close Icon and should trigger setClose', () => {
  const handleClose = jest.fn()
  render(<FareModal {...props} setClose={handleClose} />)
  fireEvent.click(screen.getByTitle(/Close Icon/))
  expect(handleClose).toBeCalledTimes(1)
})

test('should click on the save button and should trigger action', () => {
  const action = jest.fn()
  render(<FareModal {...props} action={action} />)
  fireEvent.click(screen.getByText(/save/))
  expect(action).toBeCalledTimes(1)
})

test('should click on the save button and should not trigger action due invalid input', () => {
  const action = jest.fn()
  render(<FareModal {...props} action={action} />)
  const input = screen.getByLabelText('value')
  fireEvent.change(input, { target: { value: '' } })
  fireEvent.click(screen.getByText(/save/))
  expect(action).toBeCalledTimes(0)
})

test('should type a few symbols in the value input and should only accept numbers or single comma', () => {
  render(<FareModal {...props} />)
  const input: HTMLInputElement = screen.getByLabelText('value')
  fireEvent.change(input, { target: { value: input.value + '5' } })
  fireEvent.change(input, { target: { value: input.value + '1' } })
  fireEvent.change(input, { target: { value: input.value + ',' } })
  fireEvent.change(input, { target: { value: input.value + 'ads' } })
  expect(input).toHaveValue('50,051')
})
