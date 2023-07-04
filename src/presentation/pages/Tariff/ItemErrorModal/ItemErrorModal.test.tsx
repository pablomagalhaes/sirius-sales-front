import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import ItemErrorModal from './ItemErrorModal'

describe('ItemErrorModal component', () => {
  const mockFiles = [
    {
      idUploadFile: '12345',
      txFileName: 'file1',
      dtProcess: '2021-08-25T10:05:50.192Z',
      userCreation: 'user1',
      tariffType: 'basic',
      tariffModalType: 'zip',
      nmAgent: 'John',
      txStatus: 'failure',
      errors: [
        { line: 1, keyLog: 'error1' },
        { line: 2, keyLog: 'error2' }
      ]
    },
    {
      idUploadFile: '12346',
      txFileName: 'file2',
      dtProcess: '2021-08-25T12:05:50.192Z',
      userCreation: 'user2',
      tariffType: 'advanced',
      tariffModalType: 'rar',
      nmAgent: 'Maria',
      txStatus: 'success',
      errors: [
        { line: 1, keyLog: 'error3' },
        { line: 2, keyLog: 'error4' }
      ]
    }
  ]

  const props = {
    open: true,
    setClose: jest.fn(),
    title: 'Item Error Modal',
    itemId: '12345',
    mockFiles: mockFiles
  }

  it('should display modal based on props passed', () => {
    const { getByText } = render(<ItemErrorModal {...props} />)
    expect(getByText('txFileName')).toBeInTheDocument()
    expect(getByText('file1')).toBeInTheDocument()
  })

  it('should trigger setClose function on close icon click', () => {
    const { getByRole } = render(<ItemErrorModal {...props} />)
    fireEvent.click(getByRole('button'))
    expect(props.setClose).toHaveBeenCalled()
  })
})
