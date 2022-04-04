import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import ItemModal from './ItemModal'
import '@testing-library/jest-dom'
const props = {
  dataProp: {
    amount: '12',
    codUn: '12',
    cubage: '12',
    dangerous: false,
    diameter: '',
    height: '12',
    imo: '',
    length: '10',
    rawWeight: '125.6',
    type: 'Caixas',
    width: '36',
    id: 5,
    stack: false
  },
  title: 'Editar item',
  handleAdd: () => { },
  setOpen: () => { },
  open: true,
  setClose: () => { },
  modal: '1',
  specifications: 'lcl',
  packagingList: [],
  containerTypeList: []
}

test('should show text Editar item', () => {
  render(<ItemModal {...props} />)
  expect(screen.getByText(/Editar item/).textContent).toBe('Editar item')
})

test('should click on the Close Icon and should trigger setClose', () => {
  const handleClose = jest.fn()
  render(<ItemModal {...props} setClose={handleClose} />)
  fireEvent.click(screen.getByTitle(/Close Icon/))
  expect(handleClose).toBeCalledTimes(1)
})

test('should click on the save button and should trigger handleAdd', () => {
  const handleAdd = jest.fn()
  render(<ItemModal {...props} handleAdd={handleAdd} />)
  fireEvent.click(screen.getByText(/save/))
  expect(handleAdd).toBeCalledTimes(1)
})

test('should click on the save button and should not trigger handleAdd due invalid input', () => {
  const jsdomAlert = window.alert
  window.alert = () => { }
  const handleAdd = jest.fn()
  render(<ItemModal {...props} handleAdd={handleAdd} />)
  const input = screen.getByTestId('height')
  fireEvent.change(input, { target: { value: '' } })
  fireEvent.click(screen.getByText(/save/))
  expect(handleAdd).toBeCalledTimes(0)
  window.alert = jsdomAlert
})
