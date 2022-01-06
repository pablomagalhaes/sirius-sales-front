import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import ControlledToolTip from './ControlledToolTip'

const props = {
  title: 'toolTip',
  open: true,
  children: <div>child</div>
}

test('should show tooltip', () => {
  render(<ControlledToolTip {...props} />)
  fireEvent.mouseEnter(screen.getByLabelText('toolTip'))
  expect(screen.getByText(/toolTip/).textContent).toBe('toolTip')
})

test('should not show tooltip', () => {
  render(<ControlledToolTip {...props} open={false} />)
  fireEvent.mouseEnter(screen.getByLabelText('toolTip'))
  expect(screen.queryByText(/toolTip/)).not.toBeInTheDocument()
})
