import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect' // For additional assertions

import Step2 from './Step2'

import { StaggeredProposalContextProvider } from '../../StaggeredProposal/context/StaggeredProposalContext'

describe('Step2 Component', () => {
  const mockProps = {
    invalidInput: false,
    setCompleted: jest.fn(),
    setFilled: jest.fn(),
    theme: {}, // provide any theme if needed
    ShowList: true // set this based on your requirements
  }

  it('displays InputRow components when ShowList is true', () => {
    render(
      <StaggeredProposalContextProvider>
        <Step2 {...mockProps} />
      </StaggeredProposalContextProvider>
    )

    // Check if the InputRow components are rendered with the correct data
    expect(screen.getByText('Origin 1')).toBeInTheDocument()
    expect(screen.getByText('Destination 1')).toBeInTheDocument()
    expect(screen.getByText('Origin 2')).toBeInTheDocument()
    expect(screen.getByText('Destination 2')).toBeInTheDocument()
  })

  it('does not display InputRow components when ShowList is false', () => {
    render(
      <StaggeredProposalContextProvider>
        <Step2 {...mockProps} ShowList={false} />
      </StaggeredProposalContextProvider>
    )

    // Check if the InputRow components are not rendered when ShowList is false
    expect(screen.queryByText('Origin 1')).not.toBeInTheDocument()
    expect(screen.queryByText('Destination 1')).not.toBeInTheDocument()
  })
})
