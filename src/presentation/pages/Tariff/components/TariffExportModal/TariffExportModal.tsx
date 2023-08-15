import { Modal, Grid } from '@material-ui/core'
import React from 'react'
import CloseIcon from '../../../../../application/icons/CloseIcon'
import {
  ButtonDiv,
  ModalDiv,
  MainDiv,
  Message,
  ExportDiv
} from './TariffExportModalStyles'
import { I18n } from 'react-redux-i18n'
import {
  HeaderDiv,
  RowReverseDiv,
  Title,
  CloseIconContainer
} from '../../../../components/StyledComponents/modalStyles'
import { Button } from 'fiorde-fe-components'
import JSZip from 'jszip'
import Papa from 'papaparse'
import { saveAs } from 'file-saver'
import moment from 'moment'

import {
  TARIFF_EXPORT_MODAL_BUTTON
} from '../../../../../ids'

interface TariffUploadProps {
  open: boolean
  setClose: () => void
  createExportPath: () => string
  exportData: any
}

const TariffUploadModal = ({
  open,
  setClose,
  createExportPath,
  exportData
}: TariffUploadProps): JSX.Element => {
  const handleOnClose = (): void => {
    setClose()
  }

  const handleExport = async (): Promise<void> => {
    const zip = new JSZip()
    const path = createExportPath()
    const continent = String(path).split(' > ')[2]
    const date = moment().format('DDMMYY')
    Object.entries(exportData).forEach(([agent, file]: [string, any[]]) => {
      const csvData = Papa.unparse(file, { delimiter: ';' })
      const blob = new Blob([csvData], { type: 'text/csv' })
      const fileName = generateFileName(agent)
      zip.file(`${fileName}.csv`, blob)
    })
    zip.generateAsync({ type: 'blob' }).then(content => {
      saveAs(content, `${String(date)}_Tarifario_Arquivos_Exportados_${String(continent)}`)
    })

    handleOnClose()
  }

  const generateFileName = (agent: string): string => {
    const date = moment().format('DDMMYY')
    const path = createExportPath()
    const type = String(path).split(' > ')[0].substring(0,3)
    const modal = String(path).split(' > ')[1].toLowerCase().replace('á', 'a').replace('é', 'e').replace('í', 'i')
    const agentName = agent.replace(/\s/g, '').toLowerCase().replace('.', '').replace('.', '').replace(',', '')
    const finalName = `${String(date)}_${String(type)}_${String(modal)}_${String(agentName)}`
    return finalName.replace(/[\n\r]/g, '').replace(/\s/g, '').substring(0, 256)
  }

  return (
    <Modal open={open} onClose={handleOnClose}>
      <ModalDiv>
        <HeaderDiv>
          <Title>{I18n.t('pages.tariff.export.title')}</Title>
          <RowReverseDiv>
            <CloseIconContainer data-testid="close-button">
              <CloseIcon onClick={handleOnClose} />
            </CloseIconContainer>
          </RowReverseDiv>
        </HeaderDiv>
        <ExportDiv>
          <Grid item xs={12}>
            {I18n.t('pages.tariff.export.subtitle')}:
          </Grid>
          <Grid item xs={12} style={{ margin: '10px' }}>
            {createExportPath()}
          </Grid>
        </ExportDiv>
        <MainDiv>
          <Grid item xs={12}>
            <ButtonDiv>
              <Button
                id={TARIFF_EXPORT_MODAL_BUTTON}
                data-testid="export-button"
                text={I18n.t('pages.tariff.export.button')}
                tooltip={I18n.t('pages.tariff.export.button')}
                backgroundGreen={true}
                icon=""
                onAction={handleExport}
                />
            </ButtonDiv>
            <Message>{I18n.t('pages.tariff.export.message')}</Message>
          </Grid>
        </MainDiv>
      </ModalDiv>
    </Modal >
  )
}

export default TariffUploadModal
