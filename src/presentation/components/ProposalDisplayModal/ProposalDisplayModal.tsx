import { Box, Modal, Grid, Typography } from '@material-ui/core'
import React, { useState } from 'react'
import CloseIcon from '../../../application/icons/CloseIcon'
import { withTheme } from 'styled-components'
import {
  ModalDiv,
  MainDiv,
  HeaderDiv
} from './ProposalDisplayStyles'
import { I18n } from 'react-redux-i18n'
import {
  RowReverseDiv,
  Title,
  CloseIconContainer
} from '../StyledComponents/modalStyles'
import { Button } from 'fiorde-fe-components'

interface ProposalDisplayProps {
  open: boolean
  setClose: () => void
}

const ProposalDisplayModal = ({
  open,
  setClose,
}: ProposalDisplayProps): JSX.Element => {

  const handleOnClose = (): void => setClose()



  return (
    <Modal open={open} onClose={handleOnClose}>
      <ModalDiv>
        <HeaderDiv>
          <Title>{I18n.t('components.ProposalDisplayModal.title')}</Title>
          <Button
              backgroundGreen
              disabled={false}
              icon=""
              onAction={() => { }}
              position="right"
              text={I18n.t('components.ProposalDisplayModal.buttonText')}
              tooltip={I18n.t('components.ProposalDisplayModal.buttonText')}
            />
          <RowReverseDiv>
            <CloseIconContainer>
              <CloseIcon onClick={handleOnClose} />
            </CloseIconContainer>
          </RowReverseDiv>
        </HeaderDiv>
        <MainDiv>
        </MainDiv>
      </ModalDiv>
    </Modal >
  )
}

export default withTheme(ProposalDisplayModal)
