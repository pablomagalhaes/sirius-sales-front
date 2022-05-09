/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import React, { useState, useCallback, useEffect, useContext, useRef } from 'react'
import { Button, ExitDialog, FloatingMenu, Steps, Messages } from 'fiorde-fe-components'
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
  MessageContainer,
  Status
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
import { useHistory, useLocation } from 'react-router-dom'
import { ItemModalData } from '../../components/ItemModal/ItemModal'
import { ProposalContext, ProposalProps, emptyProposalValue } from './context/ProposalContext'
import API from '../../../infrastructure/api'
import { CalculationDataProps } from '../../components/ChargeTable'

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
  const { proposal, setProposal }: ProposalProps = useContext(ProposalContext)
  const [serviceList, setServiceList] = useState<any[]>([])
  const [containerTypeList, setContainerTypeList] = useState<any[]>([])
  const [leavingPage, setLeavingPage] = useState(false)
  const [action, setAction] = useState('')
  const [calculationData, setCalculationData] = useState<CalculationDataProps>({ weight: 0, cubage: 0, cubageWeight: 0 })
  const [loadExistingProposal, setLoadExistingProposal] = useState(false)
  const [editMode, setEditMode] = useState(false)

  const history = useHistory()
  const location = useLocation()

  useEffect(() => {
    void (async function () {
      await API.getContainerType()
        .then((response) => setContainerTypeList(response))
        .catch((err) => console.log(err))
    })()
  }, [])

  useEffect(() => {
    void (async function () {
      await API.getService()
        .then((response) => setServiceList(response))
        .catch((err) => console.log(err))
    })()
  }, [])

  useEffect(() => {
    const proposalId = location.state?.proposalId
    if (proposalId !== undefined && proposalId !== null) {
      setEditMode(true)
      void (async function () {
        await API.getProposal(proposalId)
          .then((response) => { setProposal(response); setLoadExistingProposal(true) })
          .catch((err) => console.log(err))
      })()
    } else {
      setLoadExistingProposal(true)
      const today = new Date()
      const timeNow = `${today.getFullYear()}-${('0' + String(today.getMonth() + 1).slice(-2))}-${('0' + String(today.getDate())).slice(-2)}T${('0' + String(today.getHours())).slice(-2)}:${('0' + String(today.getMinutes())).slice(-2)}:${('0' + String(today.getSeconds())).slice(-2)}.000Z`
      setProposal({ ...emptyProposalValue, operationType: 'FRETE - IMPORTAÇÃO', openingDate: timeNow })
    }
  }, [])

  const [undoMessage, setUndoMessage] = useState({
    step3: false,
    step5origin: false,
    step5destiny: false,
    step6: false
  })

  const [completed, setCompleted] = useState({
    step1: false,
    step2: false,
    step3: false,
    step4: false,
    step5: false,
    step6: false
  })

  const [filled, setFilled] = useState({
    step1: false,
    step2: false,
    step3: false,
    step4: false,
    step5: false,
    step6: false
  })

  const [stepLoaded, setStepLoaded] = useState({
    step1: false,
    step2: false,
    step3: false,
    step4: false,
    step5: false
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
      if (proposal.id === undefined || proposal.id === null) {
        API.postProposal(JSON.stringify(proposal)).then((response) => {
          setProposal(response)
          setShowSaveMessage(true)
          setInvalidInput(false)
        }).catch((error) => {
          console.trace(error)
        })
      } else {
        API.putProposal(proposal.id, JSON.stringify(proposal)).then(() => {
          setShowSaveMessage(true)
          setInvalidInput(false)
        }).catch((error) => {
          console.trace(error)
        })
      }
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

  const getEnchargedFullname = (): string => {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    return `${String(user.firstname)}  ${String(user.lastname)}`
  }

  const fullname = getEnchargedFullname()

  const saveMessageInfo = {
    closable: true,
    severity: 'success',
    buttonText: I18n.t('pages.newProposal.saveMessage.buttonText'),
    closeAlert: () => { setShowSaveMessage(false) },
    closeMessage: I18n.t('pages.newProposal.saveMessage.closeMessage'),
    goBack: () => { history.push('/proposta') },
    message: `${String(I18n.t('pages.newProposal.saveMessage.message'))} ${String(referenceCode[0].reference)}.`
  }

  const MessageExitDialog = (): JSX.Element => {
    useEffect(() => {
      if (filled.step1 ||
        filled.step2 ||
        filled.step3 ||
        filled.step4 ||
        filled.step5 ||
        filled.step6) {
        setLeavingPage(true)
      } else {
        setLeavingPage(false)
      }
    }, [])

    return (
      <ExitDialog
        cancelButtonText={I18n.t('pages.newProposal.unsavedChanges.cancelMessage')}
        confirmButtonText={I18n.t('pages.newProposal.unsavedChanges.confirmMessage')}
        message={I18n.t('pages.newProposal.unsavedChanges.message')}
        title={I18n.t('pages.newProposal.unsavedChanges.title')}
        onPressCancel={() => setLeavingPage(false)}
        onPressConfirm={() => executeAction()}
      />
    )
  }

  const validateAction = (element): boolean => {
    if (element.tagName !== 'HTML') {
      if (element.id === 'button_home' || element.querySelector('#button_home')) {
        setAction('home')
        return true
      }
      if ((element.id === 'exportation' || element.querySelector('#exportation')) && element.tagName !== 'UL') {
        setAction('home')
        return true
      }
      if ((element.id === 'importation' || element.querySelector('#importation')) && element.tagName !== 'UL') {
        setAction('home')
        return true
      }
      if ((element.id === 'freight-forwarder' || element.querySelector('#freight-forwarder')) && element.tagName !== 'UL') {
        setAction('home')
        return true
      }
      if ((element.id === 'billing' || element.querySelector('#billing')) && element.tagName !== 'UL') {
        setAction('home')
        return true
      }
      if ((element.id === 'national-logistic' || element.querySelector('#national-logistic')) && element.tagName !== 'UL') {
        setAction('home')
        return true
      }
      if ((element.id === 'logo_sirius' || element.querySelector('#logo_sirius')) && element.tagName !== 'DIV') {
        setAction('home')
        return true
      }
      if (element.tagName === 'A' && !element.id.includes('step')) {
        setAction('proposals')
        return true
      }
      if ((element.id === 'home' || element.querySelector('#home')) && element.tagName !== 'DIV') {
        setAction('commercial-home')
        return true
      }
      if ((element.id === 'proposal' || element.querySelector('#proposal')) && element.tagName !== 'DIV') {
        setAction('proposals')
        return true
      }
      if ((element.id === 'tariff' || element.querySelector('#tariff')) && element.tagName !== 'DIV') {
        setAction('commercial-home')
        return true
      }
      if ((element.id === 'chart' || element.querySelector('#chart')) && element.tagName !== 'DIV') {
        setAction('commercial-home')
        return true
      }
      if (element.id === 'exit_button') {
        setAction('logout')
        return true
      }
    }
    return false
  }

  const executeAction = (): void => {
    switch (action) {
      case 'home':
        history.go(-4)
        break
      case 'commercial-home':
        history.push('/')
        break
      case 'proposals':
        history.push('/proposta')
        break
      case 'logout':
        console.log('keycloak logout')
        break
    }
  }

  useEffect(() => {
    window.addEventListener('beforeunload', (event) => {
      event.returnValue = setLeavingPage(true)
    })
  }, [])

  const useOnClickOutside = (handler): void => {
    useEffect(() => {
      const listener = (event: any): void => {
        if (!validateAction(event.target)) {
          return
        }
        handler(event)
      }
      document.addEventListener('mousedown', listener)
      document.addEventListener('touchstart', listener)
      return () => {
        document.removeEventListener('mousedown', listener)
        document.removeEventListener('touchstart', listener)
      }
    }, [handler])
  }
  const divRef = useRef()

  const handler = useCallback(() => { setLeavingPage(true) }, [])
  useOnClickOutside(handler)

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
          {editMode
            ? <>
              {I18n.t('pages.newProposal.reference')}
              <ReferenceCode>
                {proposal.referenceProposal}
              </ReferenceCode>
            </>
            : null
          }
          {I18n.t('pages.newProposal.encharged')}
          <IconComponent name="user" defaultColor={theme?.commercial?.pages?.newProposal?.subtitle} />
          <Username>
            {fullname}
          </Username>
          {editMode && proposal.idStatus === 1
            ? <Status className="open">{I18n.t('pages.proposal.table.openLabel')}</Status>
            : null
          }
          {editMode && proposal.idStatus === 3
            ? <Status className="inReview">{I18n.t('pages.proposal.table.inRevisionLabel')}</Status>
            : null
          }
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
      {leavingPage && <MessageExitDialog />}
      {loadExistingProposal &&
        <MainContainer ref={divRef}>
          <div id="step1">
            <Step1
              filled={filled}
              setModal={setModal}
              setCompleted={setCompleted}
              setFilled={setFilled}
              invalidInput={invalidInput}
              setProposalType={setProposalType}
              setStepLoaded={setStepLoaded}
            />
          </div>
          {stepLoaded.step1 && <>
            <div id="step2">
              <Step2
                proposalType={proposalType}
                setCompleted={setCompleted}
                setFilled={setFilled}
                invalidInput={invalidInput}
                modal={modal}
              />
            </div>
            <div id="step3">
              <Step3
                setCalculationData={setCalculationData}
                containerTypeList={containerTypeList}
                undoMessage={undoMessage}
                setUndoMessage={setUndoMessage}
                setFilled={setFilled}
                setTableItems={setStep3TableItems}
                setCompleted={setCompleted}
                invalidInput={invalidInput}
                modal={modal}
                setCostData={setCostData}
                setSpecifications={setSpecifications}
                setStepLoaded={setStepLoaded}
              />
            </div>
            <div id="step4">
              <Step4
                modal={modal}
                setFilled={setFilled}
                setCompleted={setCompleted}
                invalidInput={invalidInput}
                specifications={specifications}
              />
            </div>
            {stepLoaded.step3 && <> <div id="step5">
              <Step5
                calculationData={calculationData}
                containerTypeList={containerTypeList}
                serviceList={serviceList}
                undoMessage={undoMessage}
                setUndoMessage={setUndoMessage}
                setFilled={setFilled}
                containerItems={step3TableItems}
                setCompleted={setCompleted}
                costData={costData}
                modal={modal}
                specifications={specifications}
                invalidInput={invalidInput}
              />
            </div>
              <div id="step6">
                <Step6
                  calculationData={calculationData}
                  containerTypeList={containerTypeList}
                  serviceList={serviceList}
                  undoMessage={undoMessage}
                  setUndoMessage={setUndoMessage}
                  setFilled={setFilled}
                  containerItems={step3TableItems}
                  setCompleted={setCompleted}
                  costData={costData}
                  modal={modal}
                  specifications={specifications}
                  invalidInput={invalidInput}
                />
              </div>
            </>}
          </>
          }
        </MainContainer>
      }
      {showSaveMessage &&
        <MessageContainer>
          <Messages {...saveMessageInfo} />
        </MessageContainer>}
    </RootContainer>
  )
}

export default withTheme(NewProposal)
