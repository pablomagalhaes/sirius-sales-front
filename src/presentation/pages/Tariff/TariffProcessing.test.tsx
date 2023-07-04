import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import TariffProcessing from './TariffProcessing'

describe('TariffProcessing component', () => {
  it('should render without errors', () => {
    const { getByText } = render(<TariffProcessing />)
    expect(getByText('Tarifário')).toBeInTheDocument()
  })

  it('should handle back button click', () => {
    const { getByTestId } = render(<TariffProcessing />)
    fireEvent.click(getByTestId('back-button'))
    expect(getByTestId('back-button')).toBeTruthy()
  })

  it('should handle filter clean button click', () => {
    const { getByTestId } = render(<TariffProcessing />)
    fireEvent.click(getByTestId('clean-filter-button'))
    expect(getByTestId('clean-filter-button')).toBeTruthy()
  })
})
