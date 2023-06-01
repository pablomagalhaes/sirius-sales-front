import React from 'react'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TariffProcessingTable, { TariffProcessingTableProps } from './TariffProcessingTable'

describe('TariffProcessingTable', () => {
  const rows = [
    {
      idUploadFile: 'abcde12345',
      txFileName: 'testFile.csv',
      dtProcess: new Date('2021-10-01T12:00:00Z'),
      userCreation: 'Test User',
      tariffType: 'high',
      tariffModalType: 'rail',
      nmAgent: null,
      txStatus: 'success'
    }
  ]
  const handleSelectedItem = jest.fn()
  const defaultProps: TariffProcessingTableProps = { rows, handleSelectedItem }

  it('should render the table row data correctly', () => {
    const { getByText } = render(<TariffProcessingTable {...defaultProps} />)
    expect(getByText('testFile.csv')).toBeInTheDocument()
    expect(getByText('01/10/2021 12:00')).toBeInTheDocument()
    expect(getByText('Test User')).toBeInTheDocument()
    expect(getByText('High')).toBeInTheDocument()
    expect(getByText('Rail')).toBeInTheDocument()
    expect(getByText('Sucess')).toBeInTheDocument()
  })

  it('should call handleSelectedItem when a row is clicked', () => {
    const { getByText } = render(<TariffProcessingTable {...defaultProps} />)
    userEvent.click(getByText('Sucess'))
    expect(handleSelectedItem).toHaveBeenCalled()
  })

})