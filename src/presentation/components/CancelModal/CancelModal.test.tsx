import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import CancelModal from './CancelModal'
import '@testing-library/jest-dom'
const props = {
  open: true,
  setClose: () => { },
  setStatus: () => { },
  reference: 'BP220000098',
  proposalId: '98'
}

test('should show text Cancelar Proposta', () => {
  render(<CancelModal {...props} />)
  expect(screen.getByText(/Cancelar Proposta/).textContent).toBe('Cancelar Proposta')
})

test('should show proposal reference', () => {
  render(<CancelModal {...props} />)
  expect(screen.getByText(/BP220000098/).textContent).toBe('Ref. BP220000098')
})

test('should click on the Close Icon and should trigger setClose', () => {
  const handleClose = jest.fn()
  render(<CancelModal {...props} setClose={handleClose} />)
  fireEvent.click(screen.getByTitle(/Close Icon/))
  expect(handleClose).toBeCalledTimes(1)
})

test('should click on the save button and should trigger setStatus', () => {
  const setStatus = jest.fn()
  render(<CancelModal {...props} setStatus={setStatus} />)
  fireEvent.click(screen.getByText(/confirm/))
  expect(setStatus).toBeCalledTimes(1)
})
