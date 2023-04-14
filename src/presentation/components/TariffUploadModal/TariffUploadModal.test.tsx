import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import TariffUploadModal from './TariffUploadModal'
import '@testing-library/jest-dom'

test('should open Import Upload Modal when passing Importação', () => {
  render(<TariffUploadModal setClose={() => console.log()} open={true} type={'Importação'}/>)
  expect(screen.getByText(/Fazer upload de tarifas - Importação/).textContent).toBe('Fazer upload de tarifas - Importação')
})

test('should open Export Upload Modal when passing Exportação', () => {
  render(<TariffUploadModal setClose={() => console.log()} open={true} type={'Exportação'}/>)
  expect(screen.getByText(/Fazer upload de tarifas - Exportação/).textContent).toBe('Fazer upload de tarifas - Exportação')
})

test('should show file name when uploading', async () => {
  const file = new File(['fiorde'], 'fiorde.csv', { type: 'text/csv' })
  render(<TariffUploadModal setClose={() => console.log()} open={true} type={'Importação'}/>)
  const input: any = screen.getByTestId('input-file-upload')
  fireEvent.change(input, { target: { files: [file] } })
  expect(screen.getByText(/fiorde.csv/).textContent).toContain('fiorde.csv')
})

test('should not be able to initiate process without a file', async () => {
  render(<TariffUploadModal setClose={() => console.log()} open={true} type={'Importação'}/>)
  const iniateButton = screen.getByText(/Iniciar processamento/)
  expect(iniateButton.closest('button')).toBeDisabled()
})

test('should enable process button when uploading a file', async () => {
  render(<TariffUploadModal setClose={() => console.log()} open={true} type={'Importação'}/>)
  const file = new File(['fiorde'], 'fiorde.csv', { type: 'text/csv' })
  const input: any = screen.getByTestId('input-file-upload')
  fireEvent.change(input, { target: { files: [file] } })

  const iniateButton = screen.getByText(/Iniciar processamento/)
  expect(iniateButton.closest('button')).not.toBeDisabled()
})

test('should show air modal option', async () => {
  render(<TariffUploadModal setClose={() => console.log()} open={true} type={'Exportação'}/>)
  const air = screen.getByText(/Aéreo/)
  expect(air.textContent).toBe('Aéreo')
})

test('should show sea fcl modal option', async () => {
  render(<TariffUploadModal setClose={() => console.log()} open={true} type={'Exportação'}/>)
  const air = screen.getByText('Marítimo/FCL')
  expect(air.textContent).toBe('Marítimo/FCL')
})

test('should show sea lcl modal option', async () => {
  render(<TariffUploadModal setClose={() => console.log()} open={true} type={'Exportação'}/>)
  const air = screen.getByText('Marítimo/LCL')
  expect(air.textContent).toBe('Marítimo/LCL')
})

test('should show land modal option', async () => {
  render(<TariffUploadModal setClose={() => console.log()} open={true} type={'Exportação'}/>)
  const air = screen.getByText('Rodoviário')
  expect(air.textContent).toBe('Rodoviário')
})
