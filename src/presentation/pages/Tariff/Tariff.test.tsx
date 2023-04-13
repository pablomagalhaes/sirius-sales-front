import React from 'react'
import { render, screen } from '@testing-library/react'
import Tariff from '../Tariff'
import '@testing-library/jest-dom'

test('should show text Tarifário item', () => {
  render(<Tariff />)
  expect(screen.getByText(/Tarifário/).textContent).toBe('Tarifário')
})

test('should show text Importacao item', () => {
  render(<Tariff />)
  expect(screen.getByText(/Importação/).textContent).toBe('Importação')
})

test('should show text Exportação item', () => {
  render(<Tariff />)
  expect(screen.getByText(/Exportação/).textContent).toBe('Exportação')
})

test('should show text Rodoviário item', () => {
  render(<Tariff />)
  expect(screen.getByText(/Rodoviário/).textContent).toBe('Rodoviário')
})

test('should show text Aéreo item', () => {
  render(<Tariff />)
  expect(screen.getByText(/Aéreo/).textContent).toBe('Aéreo')
})

test('should show text Marítimo item', () => {
  render(<Tariff />)
  expect(screen.getByText(/Marítimo/).textContent).toBe('Marítimo')
})

test('should click on the Importacao Button and Rodoviário Button and should trigger api', () => {
  // rename data to start with 'mock' so that the factory can use it
  render(<Tariff />)
  const mockUrl = '/sirius-tariff-api/tariff/region/country/IMPORT/AIR/VALID'
  const mockRegions = [{ region: 'Americas', countries: ['Brazil', 'Argentina'] }]
  const getRegions = jest.fn(url => mockRegions)
  getRegions(mockUrl)
  expect(getRegions).toHaveBeenCalledWith(mockUrl)
})

test('should show upload button', () => {
  render(<Tariff />)
  expect(screen.getByText(/Fazer upload de tarifas/).textContent).toBe('Fazer upload de tarifas')
})
