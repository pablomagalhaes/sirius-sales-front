import React from 'react'
import { render, fireEvent, screen } from '@testing-library/react'
import TariffProcessingTable, { TariffProcessingTableProps } from './TariffProcessingTable'
import '@testing-library/jest-dom'

test('should render the table row data correctly', () => {
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

  const { getByText } = render(<TariffProcessingTable {...defaultProps} />)
  expect(getByText('testFile.csv')).toBeInTheDocument()
  expect(getByText('01/10/2021 12:00')).toBeInTheDocument()
  expect(getByText('Test User')).toBeInTheDocument()
  expect(getByText('High')).toBeInTheDocument()
  expect(getByText('Rail')).toBeInTheDocument()
  expect(getByText('Sucess')).toBeInTheDocument()
})

test('should call handleSelectedItem when a row is clicked', () => {
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

  render(<TariffProcessingTable {...defaultProps} />)
  fireEvent.click(screen.getByText('Sucess'))
  expect(handleSelectedItem).toHaveBeenCalled()
})
