import React from 'react'

import { render, screen, fireEvent } from '@testing-library/react'

import CostModal from './CostModal'

import '@testing-library/jest-dom'

const props = {

  dataProp: {
    type: 'Tipo1',
    description: 'Descrição1',
    agent: 'Agente1',
    buyCurrency: 'BRL',
    buyValue: null,
    buyMin: null,
    saleCurrency: 'BRL',
    saleValue: null,
    saleMin: null,
    id: 5,
    selectedContainer: null
  },

  title: 'Editar item',
  handleAdd: () => {},
  setOpen: () => {},
  open: true,
  setClose: () => {},
  modal: '',
  specifications: ''
}

test('should show text Editar item', () => {
  render(<CostModal {...props} />)
  expect(screen.getByText(/Editar item/).textContent).toBe('Editar item')
})

test('should click on the Close Icon and should trigger setClose', () => {
  const handleClose = jest.fn()
  render(<CostModal {...props} setClose={handleClose} />)
  fireEvent.click(screen.getByTitle(/Close Icon/))
  expect(handleClose).toBeCalledTimes(1)
})

test('should click on the save button and should trigger handleAdd', () => {
  const handleAdd = jest.fn()
  render(<CostModal {...props} handleAdd={handleAdd} />)
  fireEvent.click(screen.getByText(/save/))
  expect(handleAdd).toBeCalledTimes(1)
})

test('should click on the checkbox and show the check icon', () => {
  render(<CostModal {...props} />)
  fireEvent.click(screen.getByLabelText('checkbox'))
  expect(screen.getByTitle('Check Icon')).toBeInTheDocument()
})

test('should click on the checkbox and click on the save button and should not trigger handleAdd due invalid input', () => {
  const jsdomAlert = window.alert
  window.alert = () => {}
  const handleAdd = jest.fn()
  render(<CostModal {...props} handleAdd={handleAdd} />)
  fireEvent.click(screen.getByLabelText('checkbox'))
  fireEvent.click(screen.getByText(/save/))
  expect(handleAdd).toBeCalledTimes(0)
  window.alert = jsdomAlert
})
