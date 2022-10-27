import { Modal, Grid, FormLabel, Radio, RadioGroup, Typography, FormControlLabel } from '@material-ui/core'
import React, { useState } from 'react'
import CloseIcon from '../../../application/icons/CloseIcon'
import {
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

interface RejectModalProps {
  open: boolean
  setClose: () => void
  setStatus: (id: any, status: string, reason?: string) => void
  title: string
  reference: string
  proposalId: string
}

const RejectModal = ({
  open,
  setClose,
  setStatus,
  title,
  reference,
  proposalId
}: RejectModalProps): JSX.Element => {
  const [value, setValue] = useState('')

  const handleOnClose = (): void => {
    setClose()
    setValue('')
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setValue((event.target as HTMLInputElement).value)
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
          <Grid container spacing={5} style={{ width: '100%' }}>
            <Grid item xs={12}>
              <FormLabel component="legend">{I18n.t('components.rejectModal.reason')}<RedColorSpan> *</RedColorSpan></FormLabel>
              <RadioGroup
                row aria-label="reason"
                name="row-radio-buttons-group"
                value={value}
                onChange={handleChange}
                style={{ justifyContent: 'left', marginLeft: '10px' }}
              >
                <FormControlLabel value="price" control={<Radio size="small"/>} label={I18n.t('components.rejectModal.price')} />
                <FormControlLabel style={{ marginLeft: '20px' }} value="service" control={<Radio size="small"/>} label={I18n.t('components.rejectModal.service')} />
              </RadioGroup>
            </Grid>
            <Grid item xs={12}
                  container
                  direction="column"
                  justify="center">
              <Typography variant="body1" gutterBottom>
                {I18n.t('components.rejectModal.definition')} Ref. {reference} {I18n.t('components.rejectModal.rejection')}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                {I18n.t('components.rejectModal.display')}
              </Typography>
              <Button
                disabled={value === ''}
                text={I18n.t('components.rejectModal.confirm')}
                tooltip={I18n.t('components.rejectModal.confirm')}
                backgroundGreen={true}
                icon=""
                onAction={() => { setStatus(proposalId, StatusProposalStringEnum.REJEITADA, value); handleOnClose() } }
              />
            </Grid>
          </Grid>
        </MainDiv>
      </ModalDiv>
    </Modal >
  )
}

export default RejectModal
