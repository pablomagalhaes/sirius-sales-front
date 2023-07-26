import { Box, Modal, Grid, FormLabel, Typography } from '@material-ui/core'
import React, { useState } from 'react'
import CloseIcon from '../../../application/icons/CloseIcon'
import { withTheme } from 'styled-components'
import {
  ModalDiv,
  MainDiv,
  ReferenceType
} from './CancelModalStyles'
import { I18n } from 'react-redux-i18n'
import {
  HeaderDiv,
  RowReverseDiv,
  Title,
  CloseIconContainer
} from '../StyledComponents/modalStyles'
import { StatusStaggeredProposalStringEnum } from '../../../application/enum/statusProposalEnum'
import { Button } from 'fiorde-fe-components'
import ControlledInput from '../ControlledInput'
import {
  TARIFF_CANCEL_MODAL_BUTTON_CONFIRM,
  TARIFF_CANCEL_MODAL_BUTTON_CANCEL,
  TARIFF_CANCEL_MODAL_INPUT_DETAIL
} from '../../../ids'

interface CancelModalProps {
  open: boolean
  setClose: () => void
  setStatus: (id: any, status: string, reason?: string, detail?: string) => void
  reference: string
  proposalId: string
}

const CancelModal = ({
  open,
  setClose,
  setStatus,
  reference,
  proposalId
}: CancelModalProps): JSX.Element => {
  const [detail, setDetail] = useState('')

  const handleOnClose = (): void => {
    setClose()
  }

  const handleStatusChange = (): void => {
    setStatus(proposalId, StatusStaggeredProposalStringEnum.CANCELADA, undefined, detail)
    handleOnClose()
  }

  return (
    <Modal open={open} onClose={handleOnClose}>
      <ModalDiv>
        <HeaderDiv>
          <Title>{I18n.t('components.cancelModal.title')}</Title>
          <RowReverseDiv>
            <CloseIconContainer>
              <CloseIcon onClick={handleOnClose} />
            </CloseIconContainer>
          </RowReverseDiv>
        </HeaderDiv>
        <MainDiv>
          <Grid container spacing={2} style={{ width: '100%' }}>
            <Grid item xs={12}
                  container
                  direction="column"
                  justify="center">
              <Typography variant="body1" gutterBottom>
                {I18n.t('components.cancelModal.definition')}
                <br/>
                <ReferenceType gutterBottom>
                  Ref. {reference}
                </ReferenceType>
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <FormLabel component="legend">
                {I18n.t('components.cancelModal.details')}:
              </FormLabel>
              <ControlledInput
                id={TARIFF_CANCEL_MODAL_INPUT_DETAIL}
                toolTipTitle={I18n.t('components.cancelModal.details')}
                invalid={false}
                variant="outlined"
                size="small"
                fullWidth
                placeholder=''
                onChange={(e) => setDetail(e.target.value)}
                value={detail}
                inputProps={{ maxLength: 150 }}
                $space
              />
              <Typography variant="subtitle1" gutterBottom>
                {I18n.t('components.cancelModal.display')}
              </Typography>
            </Grid>
            <Grid container spacing={2} style={{ marginRight: '100px', marginTop: '40px' }}>
              <Grid item xs={8}>
                <Box display="flex" justifyContent="flex-end">
                <Button
                  id={TARIFF_CANCEL_MODAL_BUTTON_CANCEL}
                  disabled={false}
                  text={I18n.t('components.cancelModal.cancel')}
                  tooltip={I18n.t('components.cancelModal.cancel')}
                  backgroundGreen={false}
                  icon=""
                  onAction={handleOnClose}
                />
                </Box>
              </Grid>
              <Grid item xs={4} >
                <Button
                  id={TARIFF_CANCEL_MODAL_BUTTON_CONFIRM}
                  disabled={false}
                  text={I18n.t('components.cancelModal.confirm')}
                  tooltip={I18n.t('components.cancelModal.confirm')}
                  backgroundGreen={true}
                  icon=""
                  onAction={handleStatusChange}
                />
              </Grid>
            </Grid>
          </Grid>
        </MainDiv>
      </ModalDiv>
    </Modal >
  )
}

export default withTheme(CancelModal)
