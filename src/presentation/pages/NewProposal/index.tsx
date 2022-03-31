import React, { useState } from 'react'
import { Button, FloatingMenu, Steps, Messages } from 'fiorde-fe-components'
import { Breadcrumbs, Link } from '@material-ui/core/'
import {
  ButtonContainer,
  Header,
  MainContainer,
  ReferenceCode,
  RootContainer,
  TopContainer,
  UserContainer,
  Username,
  MessageContainer
} from './style'
import { withTheme } from 'styled-components'
import { I18n } from 'react-redux-i18n'
import IconComponent from '../../../application/icons/IconComponent'
import Step1 from './steps/Step1'
import Step2 from './steps/Step2'
import Step3 from './steps/Step3'
import Step4 from './steps/Step4'
import Step5 from './steps/Step5'
import Step6 from './steps/Step6'
import { TableRows } from '../Proposal/constants'
import { useHistory } from 'react-router-dom'
import { ItemModalData } from '../../components/ItemModal/ItemModal'

export interface NewProposalProps {
  theme: any
}

const NewProposal = ({ theme }: NewProposalProps): JSX.Element => {
  const [clicked, setClicked] = useState({ id: '', clicked: false })
  const [hover, setHover] = useState({ id: '', hover: false })
  const [invalidInput, setInvalidInput] = useState(false)
  const [costData, setCostData] = useState(0)
  const [proposalType, setProposalType] = useState('')
  const [modal, setModal] = useState('')
  const [showSaveMessage, setShowSaveMessage] = useState(false)
  const [specifications, setSpecifications] = useState('')
  const [step3TableItems, setStep3TableItems] = useState<ItemModalData[]>([])

  const history = useHistory()

  const [completed, setCompleted] = useState({
    step1: false,
    step2: false,
    step3: false,
    step4: false,
    step5: false,
    step6: false
  })

  const steps = [
    {
      id: 'step1',
      label: I18n.t('pages.newProposal.step1.title'),
      completed: completed.step1
    },
    {
      id: 'step2',
      label: I18n.t('pages.newProposal.step2.title'),
      completed: completed.step2
    },
    {
      id: 'step3',
      label: I18n.t('pages.newProposal.step3.title'),
      completed: completed.step3
    },
    {
      id: 'step4',
      label: I18n.t('pages.newProposal.step4.title'),
      completed: completed.step4
    },
    {
      id: 'step5',
      label: I18n.t('pages.newProposal.step5.title'),
      completed: completed.step5
    },
    {
      id: 'step6',
      label: I18n.t('pages.newProposal.step6.title'),
      completed: completed.step6
    }
  ]

  const handleClick = (clickState): void => {
    setClicked(clickState)
  }

  const handleHover = (hoverState): void => {
    setHover(hoverState)
  }

  const handleSave = (): void => {
    if (
      completed.step1 &&
      completed.step2 &&
      completed.step3 &&
      completed.step4 &&
      completed.step5 &&
      completed.step6
    ) {
      setShowSaveMessage(true)
      setInvalidInput(false)
    } else {
      setInvalidInput(true)
    }
  }

  const floatingButtonMenuItems = [
    {
      iconType: 'save',
      label: I18n.t('pages.newProposal.save'),
      onClick: () => handleSave()
    }, {
      iconType: 'file',
      label: I18n.t('pages.newProposal.view'),
      onClick: () => { }
    }, {
      iconType: 'download',
      label: I18n.t('pages.newProposal.download'),
      onClick: () => { }
    }, {
      iconType: 'send',
      label: I18n.t('pages.newProposal.send'),
      onClick: () => { }
    }
  ]

  const referenceCode = TableRows()

  const saveMessageInfo = {
    closable: true,
    severity: 'success',
    buttonText: I18n.t('pages.newProposal.saveMessage.buttonText'),
    closeAlert: () => { setShowSaveMessage(false) },
    closeMessage: I18n.t('pages.newProposal.saveMessage.closeMessage'),
    goBack: () => { history.push('/proposta') },
    message: `${String(I18n.t('pages.newProposal.saveMessage.message'))} ${String(referenceCode[0].reference)}.`
  }

  return (
    <RootContainer>
      <Header>
        <Breadcrumbs separator=">" aria-label="breadcrumb">
          <Link
            color="inherit"
            onClick={() => history.push('/')}
            className="breadcrumbInitial"
            style={{ cursor: 'pointer' }}
          >
            Home
          </Link>
          <Link
            color="inherit"
            onClick={() => history.push('/proposta')}
            className="breadcrumbInitial"
            style={{ cursor: 'pointer' }}
          >
            {I18n.t('pages.newProposal.proposal')}
          </Link>
          <span className="breadcrumbEnd">{I18n.t('pages.newProposal.newProposal')}</span>
        </Breadcrumbs>
        <UserContainer>
          {I18n.t('pages.newProposal.reference')}
          <ReferenceCode>
            {referenceCode[0].reference}
          </ReferenceCode>
          {I18n.t('pages.newProposal.encharged')}
          <IconComponent name="user" defaultColor={theme?.commercial?.pages?.newProposal?.subtitle} />
          <Username>
            Cristina Alves
          </Username>
        </UserContainer>
      </Header>
      <TopContainer>
        <Steps
          steps={steps}
          offset={-270}
          clicked={clicked}
          hover={hover}
          handleClick={handleClick}
          handleHover={handleHover}
        />
        <ButtonContainer>
          <Button
            disabled={false}
            onAction={() => { }}
            text={I18n.t('pages.newProposal.buttonFinish')}
            tooltip={I18n.t('pages.newProposal.buttonFinish')}
            icon="arrow"
            position="right"
            backgroundGreen
            popover
          >
            <FloatingMenu menuItems={floatingButtonMenuItems} />
          </Button>
        </ButtonContainer>
      </TopContainer>
      <MainContainer>
        <div id="step1"><Step1 setModal={setModal} setCompleted={setCompleted} invalidInput={invalidInput} setProposalType={setProposalType} /></div>
        <div id="step2"><Step2 proposalType={proposalType} setCompleted={setCompleted} invalidInput={invalidInput} modal={modal} /></div>
        <div id="step3"><Step3 setTableItems={setStep3TableItems} setCompleted={setCompleted} invalidInput={invalidInput} modal={modal} setCostData={setCostData} setSpecifications={setSpecifications} /></div>
        <div id="step4"><Step4 setCompleted={setCompleted} invalidInput={invalidInput} /></div>
        <div id="step5"><Step5 containerItems={step3TableItems} setCompleted={setCompleted} costData={costData} modal={modal} specifications={specifications} /></div>
        <div id="step6"><Step6 containerItems={step3TableItems} setCompleted={setCompleted} costData={costData} modal={modal} specifications={specifications} /></div>
      </MainContainer>

      {showSaveMessage &&
        <MessageContainer>
          <Messages {...saveMessageInfo} />
        </MessageContainer>}
    </RootContainer>
  )
}

export default withTheme(NewProposal)
