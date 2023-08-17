import { Modal } from '@material-ui/core'
import React, { useState, useEffect } from 'react'
import CloseIcon from '../../../application/icons/CloseIcon'
import { withTheme } from 'styled-components'
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
import { Pdf } from './Pdf'

interface ProposalDisplayProps {
  open: boolean
  setClose: () => void
  idProposal: string | null
  downloadProposal: Function
}

const ProposalDisplayModal = ({
  open,
  setClose,
  idProposal,
  downloadProposal
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

  const downloadPDF = (): void => {
    if (proposal !== '' && idProposal !== null && language !== undefined) {
      const linkSource = `data:application/pdf;base64,${proposal}`
      const downloadLink = document.createElement('a')
      const fileName = `${idProposal}-${language}.pdf`
      downloadLink.href = linkSource
      downloadLink.download = fileName
      downloadLink.click()
    }
  }

  useEffect(() => {
    if (open && idProposal !== null && language !== undefined) {
      void (async function () {
        await downloadProposal(language === 'pt' ? language + '_BR' : language + '_US', idProposal)
          .then((response) => setProposal(response.body))
          .catch((err) => console.log(err))
      })()
    }
  }, [open, language, idProposal])

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
                onAction={downloadPDF}
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
          {proposal !== '' && <Pdf url={`data:application/pdf;base64,${proposal}`} />}
        </MainDiv>
      </ModalDiv>
    </Modal >
  )
}

export default withTheme(ProposalDisplayModal)
