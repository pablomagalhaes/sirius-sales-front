import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import ControlledToolTip from './ControlledToolTip'

const props = {
  title: 'toolTip',
  open: true,
  children: <span>child</span>
}

test('should show tooltip', () => {
  render(<ControlledToolTip {...props} />)
  expect(screen.getByText(/toolTip/).textContent).toBe('toolTip')
})

test('should not show tooltip', () => {
  render(<ControlledToolTip {...props} open={false} />)
  expect(screen.queryByText(/toolTip/)).not.toBeInTheDocument()
})
