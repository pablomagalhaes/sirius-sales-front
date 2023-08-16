import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import TariffExportModal from './TariffExportModal'
import '@testing-library/jest-dom'

const mockedData = {
  'KCB - ARUJÁ': [
    {
      'Transp Rodoviária': 'BR HOMMED COMÉRCIO DE MATERIAIS MÉDICOS LTDA.',
      'Cidade Origem': 'Nieuw Nickerie',
      'Cidade Destino': 'Linden',
      'Transit Time': 3,
      Validade: '01/08/2023',
      Moeda: 'ARS',
      'Vl Geral Ded.': '2,00',
      'Vl IMO Ded.': '3,00',
      'Vl Geral Cons.': '4,00',
      'Vl IMO Cons.': '1,00',
      Rota: 'Direto',
      Frequência: 3
    }
  ]
}

test('should show the correct export path', () => {
  render(<TariffExportModal setClose={() => console.log()} open={true} createExportPath={() => 'Importação > Rodoviário > Americas'} exportData={mockedData}/>)
  expect(screen.getByText(/Importação > Rodoviário > Americas/).textContent).toBe('Importação > Rodoviário > Americas')
})

test('should export file when clicking export', async () => {
  const file = new File(['fiorde'], 'fiorde.csv', { type: 'text/csv' })
  render(<TariffExportModal setClose={() => console.log()} open={true} createExportPath={() => ''} exportData={mockedData}/>)
  const exportButton = screen.getByTestId('export-button')
  fireEvent.click(exportButton, { target: { files: [file] } })
  expect(screen.getByText(/fiorde.csv/).textContent).toContain('fiorde.csv')
})

test('should close the modal when clicking the close button', async () => {
  let open = true
  render(<TariffExportModal setClose={() => { open = false }} open={open} createExportPath={() => ''} exportData={mockedData}/>)
  const closeButton = screen.getByTestId('close-button')
  fireEvent.click(closeButton)
  expect(screen.getByTestId('close-button')).not.toBeInTheDocument()
})
