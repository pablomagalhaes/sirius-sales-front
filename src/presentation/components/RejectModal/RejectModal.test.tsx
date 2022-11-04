import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import RejectModal from './RejectModal'
import '@testing-library/jest-dom'
const props = {
  open: true,
  setClose: () => { },
  setStatus: () => { },
  reference: 'BP220000098',
  proposalId: '98',
  title: 'Rejeitar Proposta'
}

test('should show text Rejeitar Proposta', () => {
  render(<RejectModal {...props} />)
  expect(screen.getByText(/Rejeitar Proposta/).textContent).toBe('Rejeitar Proposta')
})

test('should show proposal reference', () => {
  render(<RejectModal {...props} />)
  expect(screen.getByText(/BP220000098/).textContent).toBe('definition Ref. BP220000098 rejection')
})

test('should click on the Close Icon and should trigger setClose', () => {
  const handleClose = jest.fn()
  render(<RejectModal {...props} setClose={handleClose} />)
  fireEvent.click(screen.getByTitle(/Close Icon/))
  expect(handleClose).toBeCalledTimes(1)
})

test('should click on the save button and should not trigger setStatus if rejection reason is not choosen', () => {
  const setStatus = jest.fn()
  render(<RejectModal {...props} setStatus={setStatus} />)
  fireEvent.click(screen.getByText(/confirm/))
  expect(setStatus).toBeCalledTimes(0)
})

test('should click on the save button and should trigger setStatus if rejection reason is choosen', () => {
  const setStatus = jest.fn()
  render(<RejectModal {...props} setStatus={setStatus} />)
  fireEvent.click(screen.getByText(/service/))
  fireEvent.click(screen.getByText(/confirm/))
  expect(setStatus).toBeCalledTimes(1)
})
