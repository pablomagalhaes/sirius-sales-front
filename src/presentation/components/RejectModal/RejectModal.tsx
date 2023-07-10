import { Box, Modal, Grid, FormLabel, RadioGroup, Typography, FormControlLabel } from '@material-ui/core'
import React, { useState } from 'react'
import CloseIcon from '../../../application/icons/CloseIcon'
import { withTheme } from 'styled-components'
import {
  StyledRadio,
  ModalDiv,
  MainDiv
} from './RejectModalStyles'
import { I18n } from 'react-redux-i18n'
import {
  HeaderDiv,
  RedColorSpan,
  RowReverseDiv,
  Title,
  CloseIconContainer
} from '../StyledComponents/modalStyles'
import { StatusProposalStringEnum } from '../../../application/enum/statusProposalEnum'
import { Button } from 'fiorde-fe-components'
import ControlledInput from '../ControlledInput'
import {
  TARIFF_REJECT_MODAL_BUTTON_CONFIRM,
  TARIFF_REJECT_MODAL_BUTTON_CANCEL,
  TARIFF_REJECT_MODAL_INPUT_DETAIL,
  TARIFF_REJECT_MODAL_RADIO_SERVICE,
  TARIFF_REJECT_MODAL_RADIO_PRICE
} from '../../../ids'

interface RejectModalProps {
  theme?: any
  open: boolean
  setClose: () => void
  setStatus: (id: any, status: string, reason?: string, detail?: string) => void
  title: string
  reference: string
  proposalId: string
  detailed?: boolean
}

const RejectModal = ({
  theme,
  open,
  setClose,
  setStatus,
  title,
  reference,
  proposalId,
  detailed
}: RejectModalProps): JSX.Element => {
  const [value, setValue] = useState('')
  const [detail, setDetail] = useState('')
  const [invalidInput, setInvalidInput] = useState(false)

  const handleOnClose = (): void => {
    setClose()
    setValue('')
    setInvalidInput(false)
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setValue((event.target as HTMLInputElement).value)
  }

  const handleStatusChange = (): void => {
    if (value === '') {
      setInvalidInput(true)
    } else if (detail === '') {
      setStatus(proposalId, StatusProposalStringEnum.REJEITADA, value)
      handleOnClose()
    } else {
      setStatus(proposalId, StatusProposalStringEnum.REJEITADA, value, detail)
      handleOnClose()
    }
  }

  const getColor = (): any => {
    if (value === '' && invalidInput) {
      return theme?.commercial?.components?.itemModal?.redAsterisk
    }
  }

  return (
    <Modal open={open} onClose={handleOnClose}>
      <ModalDiv>
        <HeaderDiv>
          <Title>{title}</Title>
          <RowReverseDiv>
            <CloseIconContainer>
              <CloseIcon onClick={handleOnClose} />
            </CloseIconContainer>
          </RowReverseDiv>
        </HeaderDiv>
        <MainDiv>
          <Grid container spacing={2} style={{ width: '100%' }}>
            <Grid item xs={12}>
              <FormLabel component="legend">{I18n.t('components.rejectModal.reason')}<RedColorSpan> *</RedColorSpan></FormLabel>
              <RadioGroup
                row aria-label="reason"
                name="row-radio-buttons-group"
                value={value}
                onChange={handleChange}
                style={{ justifyContent: 'left', marginLeft: '10px' }}
              >
                <FormControlLabel
                  value="Price"
                  control={<StyledRadio color={getColor()} />}
                  label={I18n.t('components.rejectModal.price')}
                  id={TARIFF_REJECT_MODAL_RADIO_PRICE}
                />
                <FormControlLabel
                  style={{ marginLeft: '20px' }}
                  value="Service"
                  control={<StyledRadio color={getColor()} />}
                  label={I18n.t('components.rejectModal.service')}
                  id={TARIFF_REJECT_MODAL_RADIO_SERVICE}
                />
              </RadioGroup>
            </Grid>
            {detailed &&
              <Grid item xs={12}>
                <FormLabel component="legend">
                  {I18n.t('components.rejectModal.details')}:
                </FormLabel>
                <ControlledInput
                  id={TARIFF_REJECT_MODAL_INPUT_DETAIL}
                  toolTipTitle={I18n.t('components.rejectModal.details')}
                  invalid={false}
                  variant="outlined"
                  size="small"
                  fullWidth
                  placeholder=''
                  onChange={(e) => setDetail(e.target.value)}
                  value={detail}
                  $space
                />
              </Grid>
            }
            <Grid item xs={12}
                  container
                  direction="column"
                  justify="center"
                  style={{ marginTop: '30px' }}>
              <Typography variant="body1" gutterBottom>
                {I18n.t('components.rejectModal.definition')} Ref. {reference} {I18n.t('components.rejectModal.rejection')}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                {I18n.t('components.rejectModal.display')}
              </Typography>
            </Grid>
            <Grid container spacing={2} style={{ marginRight: '50px' }}>
              <Grid item xs={8}>
                <Box display="flex" justifyContent="flex-end">
                <Button
                  id={TARIFF_REJECT_MODAL_BUTTON_CANCEL}
                  disabled={false}
                  text={I18n.t('components.rejectModal.cancel')}
                  tooltip={I18n.t('components.rejectModal.cancel')}
                  backgroundGreen={false}
                  icon=""
                  onAction={handleOnClose}
                />
                </Box>
              </Grid>
              <Grid item xs={4} >
                <Button
                  id={TARIFF_REJECT_MODAL_BUTTON_CONFIRM}
                  disabled={false}
                  text={I18n.t('components.rejectModal.confirm')}
                  tooltip={I18n.t('components.rejectModal.confirm')}
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

export default withTheme(RejectModal)
