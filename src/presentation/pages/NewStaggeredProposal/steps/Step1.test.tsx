import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

import Step1 from './Step1'

import { StaggeredProposalContextProvider } from '../../StaggeredProposal/context/StaggeredProposalContext'

describe('Step1 Component', () => {
  // Sample data to use in the tests
  const mockProps = {
    theme: {}, // provide any theme if needed
    invalidInput: false,
    setCompleted: jest.fn(),
    setFilled: jest.fn(),
    filled: { step2: true }, // set this based on your requirements
    setStepLoaded: jest.fn(),
    NewStaggeredProposal: jest.fn()
  }

  it('should render the searchClient input components', () => {
    const { getByTestId } = render(
      <StaggeredProposalContextProvider>
        <Step1 {...mockProps}/>
      </StaggeredProposalContextProvider>)

    const searchClient = getByTestId('search-client')
    expect(searchClient).toBeTruthy()
  })

  it('should render the tariffType input components', () => {
    const { getByTestId } = render(
      <StaggeredProposalContextProvider>
        <Step1 {...mockProps}/>
      </StaggeredProposalContextProvider>)

    const tariffType = getByTestId('tariffType')
    expect(tariffType).toBeTruthy()
  })

  it('should call handleClient when client Autocomplete value changes', () => {
    const { getByTestId } = render(
    <StaggeredProposalContextProvider>
      <Step1 {...mockProps}/>
    </StaggeredProposalContextProvider>)

    const field = getByTestId('search-client').querySelector('input')
    // now fire your event
    fireEvent.change(field, { target: { value: 'WMB SUPERMERCADOS DO BRASIL LTDA' } })
  })

  it('should call handleTariffType when ControlledSelect value changes', () => {
    const { getByTestId } = render(
      <StaggeredProposalContextProvider>
        <Step1 {...mockProps}/>
      </StaggeredProposalContextProvider>)

    const operationValue = 1
    const field = getByTestId('tariffType').querySelector('input')
    fireEvent.change(field, { target: { value: operationValue } })
    // expect(mockProps.setCompleted).toHaveBeenCalledWith({ step1: true })
  })
})
