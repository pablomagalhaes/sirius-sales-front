// import { render, fireEvent } from '@testing-library/react'
import { screen, fireEvent, cleanup } from '@testing-library/react'

describe('NewStaggeredProposal', () => {
  beforeEach(() => {
    afterEach(cleanup)

    it('should update action state when handleClick is called', () => {
      const button = screen.getByText('Save')
      fireEvent.click(button)
      const actionState = screen.getByTestId('action-state')
      expect(actionState.textContent).toBe('save')
    })

    it('should update hover state when handleHover is called', () => {
      const button = screen.getByText('Save')

      fireEvent.mouseEnter(button)
      const hoverState = screen.getByTestId('hover-state')
      expect(hoverState.textContent).toBe('true')
    })

    it('should execute handleSave when button is clicked and completed step1 is true', () => {
      const button = screen.getByText('Save')
      fireEvent.click(button)
    })
  })
})
