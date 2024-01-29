import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import OrderBy from './OrderBy'
import '@testing-library/jest-dom'

const orderButtonMenuItems = [
  {
    value: 'referenceProposal',
    description: 'Ref. proposta'
  },
  {
    value: 'customerName',
    description: 'Nome do cliente'
  },
  {
    value: 'userCreationName',
    description: 'Responsável'
  },
  {
    value: 'idTransportMode',
    description: 'Modal'
  },
  {
    value: 'idOrigin',
    description: 'Origem'
  },
  {
    value: 'idDestination',
    description: 'Destino'
  },
  {
    value: 'openingDate',
    description: 'Dt. abertura'
  },
  {
    value: 'validityDate',
    description: 'Dt. validade'
  }
]

const props = {
  id: 'test-id',
  orderButtonMenuItems: orderButtonMenuItems,
  initialOrder: 'validityDate',
  isOrderAsc: false,
  handleChange: () => {}
}

test('should show initial order label', () => {
  render(<OrderBy {...props} />)
  expect(screen.getByTestId('order-by-test').textContent).toBe('Dt. validade')
})

test('should click on the select menu and should trigger handlechange', () => {
  const handleChange = jest.fn()
  render(<OrderBy {...props} handleChange={handleChange}/>)

  fireEvent.mouseDown(screen.getByText('Dt. validade'))
  const origin = screen.getByText('Origem')
  fireEvent.click(origin)
  expect(handleChange).toBeCalledTimes(2)
})

test('should be not ascendent sort in initial state', () => {
  render(<OrderBy {...props} />)
  const arrowUp = screen.queryByTestId('arrow-up')
  expect(arrowUp).toBeNull()
})
