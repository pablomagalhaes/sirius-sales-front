/* eslint-disable */
import React from 'react';
import { render, screen } from '@testing-library/react';
import InputControlledComponent from './InputControlledComponent';
import '@testing-library/jest-dom';

const mockData = [
  { label: 'Option 1', value: 1 },
  { label: 'Option 2', value: 2 },
];

const baseProps = {
  theme: {},
  data: mockData,
  toolTipTitle: 'Test Tooltip',
  invalid: false,
  name: 'autocomplete',
  id: 'controlled-input'
};

test('renders Autocomplete component', () => {
  render(<InputControlledComponent {...baseProps} />);
  const autocompleteComponent = screen.getByTestId('autocomplete');
  expect(autocompleteComponent).toBeInTheDocument();
});

test('displays error text when invalid', () => {
  render(<InputControlledComponent {...baseProps} invalid={true} />);
  const errorText = screen.getByText(baseProps.toolTipTitle);
  expect(errorText).toBeInTheDocument();
});

test('does not display error text when valid', () => {
  render(<InputControlledComponent {...baseProps} invalid={false} />);
  const errorText = screen.queryByText(baseProps.toolTipTitle);
  expect(errorText).not.toBeInTheDocument();
});
