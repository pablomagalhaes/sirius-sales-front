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

interface TariffUploadProps {
  handleExport: () => void
  open: boolean
  setClose: () => void
  createExportPath: () => string
}

const TariffUploadModal = ({
  handleExport,
  open,
  setClose,
  createExportPath
}: TariffUploadProps): JSX.Element => {
  const handleOnClose = (): void => {
    setClose()
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
