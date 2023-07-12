import React, { useState, useCallback, useEffect, useContext, useRef } from 'react'
import { Button, ExitDialog, FloatingMenu, Steps, Messages } from 'fiorde-fe-components'
import { Breadcrumbs, Link, Grid } from '@material-ui/core/'
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
  Status,
  ButtonWrapper,
  ButtonDiv,
  ImportButtonDiv,
  AddButtonDiv
} from './style'
import { withTheme } from 'styled-components'
import { I18n } from 'react-redux-i18n'
import IconComponent from '../../../application/icons/IconComponent'
import Step1 from './steps/Step1'
import Step2 from './steps/Step2'

import { useHistory, useLocation } from 'react-router-dom'
import { UpdateStaggeredProposal } from '../../../domain/usecase'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { StaggeredProposalContext, StaggeredProposalProps } from '../StaggeredProposal/context/StaggeredProposalContext'

import TariffImportModal from '../StaggeredProposal/components/TariffImportModal/TariffImportModal'

type StaggeredProps = {
  theme: any
  updateStaggeredProposal: UpdateStaggeredProposal
}

const NewStaggeredProposal = ({ theme, updateStaggeredProposal }: StaggeredProps): JSX.Element => {
  const { staggeredproposal, setStaggeredProposal }: StaggeredProposalProps = useContext(StaggeredProposalContext)

  const [action, setAction] = useState('')
  const [agentList, setAgentList] = useState<[]>([])
  const [clicked, setClicked] = useState({ id: '', clicked: false })
  const [containerTypeList, setContainerTypeList] = useState<any[]>([])
  const [costData, setCostData] = useState(0)
  const [cw, setCw] = useState(0)
  const [cwSale, setCwSale] = useState(0)
  const [duplicateMode, setduplicateMode] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [hover, setHover] = useState({ id: '', hover: false })
  const [invalidInput, setInvalidInput] = useState(false)
  const [leavingPage, setLeavingPage] = useState(false)
  const [loadExistingProposal, setLoadExistingProposal] = useState(true)
  const [modal, setModal] = useState('')
  const [totalCosts, setTotalCosts] = useState()
  const [proposalType, setProposalType] = useState('')
  const [serviceList, setServiceList] = useState<any[]>([])
  const [showSaveMessage, setShowSaveMessage] = useState(false)
  const [specifications, setSpecifications] = useState('')

  const [openImport, setOpenImport] = useState(false)


  const [open, setOpen] = useState(false)
  const [uploadType, setUploadType] = useState('')

  const queryClient = useQueryClient()

  const history = useHistory()
  const location = useLocation()

  const [completed, setCompleted] = useState({
    step1: false,
    step2: false
  })

  const [filled, setFilled] = useState({
    step1: false,
    step2: false
  })

  const [stepLoaded, setStepLoaded] = useState({
    step1: false,
    step2: false
  })

  const steps = [
    {
      id: 'step1',
      label: I18n.t('pages.staggeredProposal.newStaggeredProposal.step1.title'),
      completed: completed.step1
    },
    {
      id: 'step2',
      label: I18n.t('pages.staggeredProposal.newStaggeredProposal.step2.title'),
      completed: completed.step2
    }
  ]

  const handleClick = (clickState): void => {
    setClicked(clickState)
  }

  const handleHover = (hoverState): void => {
    setHover(hoverState)
  }

  const mutation = useMutation({
    mutationFn: async (newData: any) => {
      return await updateStaggeredProposal.updateStaggered(newData)
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['updateStaggedProposal'])
    }
  })

  const handleSave = (): void => {
    console.log('completed', completed)

    const params = staggeredproposal

    console.log('params', params)

    mutation.mutate(params)

    // if (
    //   completed.step1 &&
    //   completed.step2
    // ) {
    //   const params = {
    //     idBusinessPartnerCustomer: 1
    //   }
    //   mutation.mutate(params)
    // } else {
    //   console.log('error')
    // }
  }

  const floatingButtonMenuItems = [
    {
      iconType: 'save',
      label: I18n.t('pages.newProposal.save'),
      onClick: () => handleSave()
    }, {
      iconType: 'send',
      label: I18n.t('pages.newProposal.send'),
      onClick: () => { }
    }
  ]

  // Menu suspenso após proposta ter sido salva
  // const floatingButtonMenuItemsAfterSaved = [
  //   {
  //     iconType: 'save',
  //     label: I18n.t('pages.newProposal.save'),
  //     // onClick: () => handleSave()
  //   }, {
  //     iconType: 'file',
  //     label: I18n.t('pages.newProposal.viewDownload'),
  //     // onClick: () => handleOpen()
  //   },
  //   {
  //     iconType: 'send',
  //     label: I18n.t('pages.newProposal.send'),
  //     onClick: () => { }
  //   }
  // ]

  const MessageExitDialog = (): JSX.Element => {
    useEffect(() => {
      if (filled.step1 ||
        filled.step2) {
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
        onPressCancel={() => setLeavingPage(false)}
        onPressConfirm={() => executeAction()}
        title={I18n.t('pages.newProposal.unsavedChanges.title')}
      />
    )
  }

  const validateAction = (element): boolean => {
    if (element.tagName !== 'HTML') {
      if (element.id === 'button_home' || element.querySelector('#button_home') || element.id === 'mini-logo' || element.querySelector('#mini-logo')) {
        setAction('home')
        return true
      }
      if ((element.id === 'logo_sirius' || element.querySelector('#logo_sirius')) && element.tagName !== 'DIV') {
        setAction('home')
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
            className="breadcrumbInitial"
            color="inherit"
            onClick={() => history.push('/')}
            style={{ cursor: 'pointer' }}
          >
            Home
          </Link>
          <span className="breadcrumbEnd">{I18n.t('pages.staggeredProposal.title')}</span>
        </Breadcrumbs>
        {/* <UserContainer>
          {editMode
            ? <>
              {I18n.t('pages.newProposal.reference')}
              <ReferenceCode>
                {proposal?.referenceProposal}
              </ReferenceCode>
            </>
            : null
          }
          {I18n.t('pages.newProposal.encharged')}
          <IconComponent name="user" defaultColor={theme?.commercial?.pages?.newProposal?.subtitle} />
          <Username>
            {getEnchargedFullname()}
          </Username>
          {editMode && proposal.idProposalStatus === 1
            ? <Status className="open">{I18n.t('pages.proposal.table.openLabel')}</Status>
            : null
          }
          {editMode && proposal.idProposalStatus === 3
            ? <Status className="inReview">{I18n.t('pages.proposal.table.inRevisionLabel')}</Status>
            : null
          }
        </UserContainer> */}
      </Header>
      <TopContainer>
        <Steps
          clicked={clicked}
          handleClick={handleClick}
          handleHover={handleHover}
          hover={hover}
          offset={-270}
          steps={steps}
        />
        <ButtonContainer>
          <Button
            backgroundGreen
            disabled={false}
            icon="arrow"
            onAction={() => { }}
            popover
            position="right"
            text={I18n.t('pages.newProposal.buttonFinish')}
            tooltip={I18n.t('pages.newProposal.buttonFinish')}
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
              invalidInput={invalidInput}
              setCompleted={setCompleted}
              setFilled={setFilled}
              setStepLoaded={setStepLoaded}
            />
          </div>
          {stepLoaded.step1 && <>
            <div id="step2">
              <Step2
                invalidInput={invalidInput}
                setCompleted={setCompleted}
                setFilled={setFilled}
              />
            </div>
          </>
          }

          <Grid item xs={12} container direction="row" justify="flex-start">
            <Grid item xs={2}>
              <ImportButtonDiv>
                <Button
                  onAction={() => {
                    setOpenImport(true)
                  }}
                  text={I18n.t('pages.staggeredProposal.newStaggeredProposal.ImportTariff')}
                  icon="tariff"
                  backgroundGreen={true}
                  tooltip={I18n.t('pages.staggeredProposal.newStaggeredProposal.ImportTariff')}
                />
              </ImportButtonDiv>
            </Grid>
            <Grid item xs={2}>
              <AddButtonDiv>
                <Button
                  onAction={() => {}}
                  text={I18n.t('pages.staggeredProposal.newStaggeredProposal.AddManual')}
                  icon="add"
                  backgroundGreen={false}
                  tooltip={I18n.t('pages.staggeredProposal.newStaggeredProposal.AddManual')}
                  style={{ height: '50px' }}
                />
              </AddButtonDiv>
            </Grid>
          </Grid>
          <TariffImportModal 
            setClose={() => setOpenImport(false)} 
            open={openImport} 
            />
        </MainContainer>
      }
      {showSaveMessage &&
        <MessageContainer>
          <Messages
            buttonText={I18n.t('pages.newProposal.saveMessage.buttonText')}
            closable={true}
            closeAlert={() => { setShowSaveMessage(false) } }
            closeMessage={I18n.t('pages.newProposal.saveMessage.closeMessage')}
            goBack={() => { history.push('/proposta') } }
            message={I18n.t('pages.newProposal.saveMessage.message')}
            // message={`${String(I18n.t('pages.newProposal.saveMessage.message'))} ${String(proposal?.referenceProposal)}.`}
            severity={'success'}
          />
        </MessageContainer>}
    </RootContainer>
  )
}

export default withTheme(NewStaggeredProposal)
