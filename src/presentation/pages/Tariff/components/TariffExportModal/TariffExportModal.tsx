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

import {
  TARIFF_EXPORT_MODAL_BUTTON
} from '../../../../../ids'
import { CSVLink } from 'react-csv'

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

  const handleExport = (): void => {
    Object.keys(exportData).map((agent) => {
      document.getElementById(agent).click()
      return ''
    })
    handleOnClose()
  }

  const generateFileName = (agent): string => {
    const today = new Date()
    const date = today.toISOString().split('T')[0].split('-')
    const orderedDate = date[2] + date[1] + date[0].substring(2, 4)
    const path = createExportPath()
    const type = String(path).split(' > ')[0].substring(0,3)
    const modal = String(path).split(' > ')[1].toLowerCase().replace('á', 'a').replace('é', 'e').replace('í', 'i')
    const agentName = agent.replace(/\s/g, '').toLowerCase().replace('.', '').replace(',', '')
    const finalName = `${String(orderedDate)}_${String(type)}_${String(modal)}_${String(agentName)}`
    return finalName.substring(0, 256)
  }

  return (
    <Modal open={open} onClose={handleOnClose}>
      <ModalDiv>
        <HeaderDiv>
          <Title>{I18n.t('pages.tariff.export.title')}</Title>
          <RowReverseDiv>
            <CloseIconContainer>
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
        {Object.entries(exportData).length > 0 &&
          Object.entries(exportData).map((data) =>
            <CSVLink
            data={data[1]}
            filename={generateFileName(data[0])}
            className="btn btn-primary"
            target="_blank"
            key={data[0]}
          >
            <div id={data[0]} style={{ display: 'none' }}>-</div>
          </CSVLink>
          )
        }
        <MainDiv>
          <Grid item xs={12}>
            <ButtonDiv>
              <Button
                id={TARIFF_EXPORT_MODAL_BUTTON}
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
