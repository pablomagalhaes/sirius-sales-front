import { Modal } from '@material-ui/core'
import React, { useState, useEffect } from 'react'
import CloseIcon from '../../../application/icons/CloseIcon'
import { withTheme } from 'styled-components'
import API from '../../../infrastructure/api'
import {
  LanguageDiv,
  ModalDiv,
  MainDiv,
  HeaderDiv,
  RowReverseDiv,
  SubHeaderDiv
} from './ProposalDisplayStyles'
import { setLocale, I18n } from 'react-redux-i18n'
import {
  Title,
  CloseIconContainer
} from '../StyledComponents/modalStyles'
import { Button, LanguageSelect } from 'fiorde-fe-components'
import { useDispatch } from 'react-redux'

interface ProposalDisplayProps {
  open: boolean
  setClose: () => void
  idProposal: string
}

const ProposalDisplayModal = ({
  open,
  setClose,
  idProposal
}: ProposalDisplayProps): JSX.Element => {
  const locale = localStorage.getItem('locale') ?? 'pt'
  const dispatch = useDispatch()
  const handleOnClose = (): void => {
    dispatch(setLocale(locale))
    setClose()
  }
  const [language, setLanguage] = useState(locale)
  const [proposal, setProposal] = useState<string>('')

  const handleLanguage = (language: string): void => {
    setLanguage(language)
    dispatch(setLocale(language))
  }

  useEffect(() => {
    if(open) {
      void (async function () {
        await API.downloadProposal(language === 'pt' ? language + '_BR' : language + '_US', idProposal)
          .then((response) => setProposal(response))
          .catch((err) => console.log(err))
      })()
    }
  }, [open, language])

  return (
    <Modal open={open} onClose={handleOnClose}>
      <ModalDiv>
        <HeaderDiv>
          <SubHeaderDiv>
            <Title>{I18n.t('components.ProposalDisplayModal.title')}</Title>
            <LanguageDiv>
              <LanguageSelect
                language={language}
                onLanguageChange={(language: string) => handleLanguage(language)}
                languageLabelMain='PT'
                languageLabelSecondary='EN'
                showLabelLanguage
              />
            </LanguageDiv>
            <Button
                backgroundGreen
                disabled={false}
                icon=""
                onAction={async () => await API.downloadProposal(language === 'pt' ? language + '_BR' : language + '_US', idProposal)}
                position="right"
                text={I18n.t('components.ProposalDisplayModal.buttonText')}
                tooltip={I18n.t('components.ProposalDisplayModal.buttonText')}
              />
          </SubHeaderDiv>
          <RowReverseDiv>
            <CloseIconContainer>
              <CloseIcon onClick={handleOnClose} />
            </CloseIconContainer>
          </RowReverseDiv>
        </HeaderDiv>
        <MainDiv>
          <img src={`data:image/jpeg;base64,${proposal}`} />
        </MainDiv>
      </ModalDiv>
    </Modal >
  )
}

export default withTheme(ProposalDisplayModal)
