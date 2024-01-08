import React, { useState, useCallback, useEffect, useContext, useRef } from 'react'
import { Button, ExitDialog, FloatingMenu, Steps, Messages } from 'fiorde-fe-components'
import ProposalDisplayModal from '../../components/ProposalDisplayModal/ProposalDisplayModal'
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
  Status,
  TotalContainer,
  UpperContainer,
  LowerContainer,
  ProfitValue,
  PercentageCard
} from './style'
import { withTheme } from 'styled-components'
import { I18n } from 'react-redux-i18n'
import IconComponent from '../../../application/icons/IconComponent'
import Step1 from './steps/Step1'
import Step2, { Agents } from './steps/Step2'
import Step3 from './steps/Step3'
import Step4 from './steps/Step4'
import Step5 from './steps/Step5'
import Step6 from './steps/Step6'
import { useHistory, useLocation } from 'react-router-dom'
import { ItemModalData } from '../../components/ItemModal/ItemModal'
import { ProposalContext, ProposalProps, emptyProposalValue } from './context/ProposalContext'
import API from '../../../infrastructure/api'
import { CalculationDataProps } from '../../components/ChargeTable'
import PositiveProfitIcon from '../../../application/icons/PositiveProfitIcon'
import { convertToDecimal } from '../Tariff/helpers'

export interface NewProposalProps {
  theme: any
}

const NewProposal = ({ theme }: NewProposalProps): JSX.Element => {
  const [action, setAction] = useState('')
  const [agentList, setAgentList] = useState<Agents[]>([])
  const [calculationData, setCalculationData] = useState<CalculationDataProps>({ weight: 0, cubage: 0, cubageWeight: 0 })
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
  const [loadExistingProposal, setLoadExistingProposal] = useState(false)
  const [modal, setModal] = useState('')
  const [totalCosts, setTotalCosts] = useState()
  const [proposalType, setProposalType] = useState(0)
  const [serviceList, setServiceList] = useState<any[]>([])
  const [showSaveMessage, setShowSaveMessage] = useState(false)
  const [specifications, setSpecifications] = useState('')
  const [step3TableItems, setStep3TableItems] = useState<ItemModalData[]>([])
  const [open, setOpen] = useState(false)
  const [totalCostArray, setTotalCostArray] = useState([])

  const handleOpen = (): void => setOpen(true)
  const handleClose = (): void => setOpen(false)

  const { proposal, setProposal }: ProposalProps = useContext(ProposalContext)

  const history = useHistory()
  const location = useLocation()
  const updateTable3IdsRef = useRef()
  const updateTable5IdsRef = useRef()
  const updateTable6IdsRef = useRef()
  const updateAgentsIdsRef = useRef()

  useEffect(() => {
    void (async function () {
      await API.getContainer()
        .then((response) => { setContainerTypeList(response) })
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
          .then((response) => {
            setProposal(response)
            duplicateProposal(response)
            setLoadExistingProposal(true)
          })
          .catch((err) => console.log(err))
      })()
    } else {
      setLoadExistingProposal(true)
      setProposal({ ...emptyProposalValue })
    }
  }, [])

  const duplicateProposal = (proposal): void => {
    if (location.state?.eventType === 'duplicate') {
      setEditMode(false)
      setduplicateMode(true)
      const proposalObject = {
        ...proposal,
        validityDate: '',
        idProposalStatus: 1,
        cargo: proposal.cargo.map((cargo) => {
          cargo.id = null
          cargo.cargoVolumes = cargo.cargoVolumes.map(cargoVolume => {
            cargoVolume.id = null; cargoVolume.idCargo = null; return cargoVolume
          })
          return cargo
        }),
        totalCosts: proposal.totalCosts.map(totalCost => {
          totalCost.id = null; totalCost.idProposal = null; return totalCost
        }),
        costs: proposal.costs.map(cost => {
          cost.id = null; cost.idProposal = null; return cost
        }),
        agents: proposal.agents.map(agt => {
          agt.id = null; agt.proposalImportFreightId = null; return agt
        })
      }
      setProposal(proposalObject)
    }
  }

  const [undoMessage, setUndoMessage] = useState({
    step3: false,
    step6origin: false,
    step6destiny: false,
    step5: false
  })

  const [completed, setCompleted] = useState({
    step1: false,
    step2: false,
    step3: false,
    step4: false,
    step6: false,
    step5: false
  })

  const [filled, setFilled] = useState({
    step1: false,
    step2: false,
    step3: false,
    step4: false,
    step6: false,
    step5: false
  })

  const [stepLoaded, setStepLoaded] = useState({
    step1: false,
    step2: false,
    step3: false,
    step4: false,
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

  const removeNullProperties = (): any => {
    const newProposal = { ...proposal };
    ['id', 'idProposal', 'idCargo', 'proposalId', 'idProposalImportFreight'].forEach(e => {
      // eslint-disable-next-line
      newProposal[e] !== undefined && newProposal[e] === null && delete newProposal[e]
      // eslint-disable-next-line
      newProposal.costs.forEach(cost => cost[e] !== undefined && cost[e] === null && delete cost[e])
      // eslint-disable-next-line
      newProposal.totalCosts.forEach(total => total[e] !== undefined && total[e] === null && delete total[e])
      // eslint-disable-next-line
      newProposal.agents.forEach(agent => agent[e] !== undefined && agent[e] === null && delete agent[e])
      // eslint-disable-next-line
      newProposal.cargo[0].cargoVolumes.forEach(volume => volume[e] !== undefined && volume[e] === null && delete volume[e])
      // eslint-disable-next-line
      newProposal.costs.forEach(cost => cost.agent !== null && cost.agent[e] !== undefined && cost.agent[e] === null && delete cost.agent[e])
    });
    // eslint-disable-next-line
    ['originCityName', 'originCityId', 'destinationCityName', 'destinationCityId'].forEach(e => newProposal[e] !== undefined && delete newProposal[e])
    return newProposal
  }

  const handleSave = (): void => {
    if (
      completed.step1 &&
      completed.step2 &&
      completed.step3 &&
      completed.step4 &&
      completed.step6 &&
      completed.step5
    ) {
      if (proposal.idProposal === undefined || proposal.idProposal === null || location.state?.eventType === 'duplicate') {
        proposal.idProposal = null
        const newProposal = removeNullProperties()
        API.postProposal(JSON.stringify(newProposal)).then((response) => {
          setProposal(response)
          // @ts-expect-error
          updateAgentsIdsRef?.current?.updateAgentsIdsRef()
          // @ts-expect-error
          updateTable3IdsRef?.current?.updateStep3Ids()
          // @ts-expect-error
          updateTable6IdsRef?.current?.updateStep6Ids()
          // @ts-expect-error
          updateTable5IdsRef?.current?.updateStep5Ids()
          setShowSaveMessage(true)
          setInvalidInput(false)
        }).catch((error) => {
          setShowSaveMessage(false)
          setInvalidInput(true)
          console.trace(error)
        })
      } else {
        const newProposal = removeNullProperties()
        API.putProposal(proposal.idProposal, JSON.stringify(newProposal)).then((response) => {
          setProposal(response)
          // @ts-expect-error
          updateAgentsIdsRef?.current?.updateAgentsIdsRef()
          // @ts-expect-error
          updateTable3IdsRef?.current?.updateStep3Ids()
          // @ts-expect-error
          updateTable6IdsRef?.current?.updateStep6Ids()
          // @ts-expect-error
          updateTable5IdsRef?.current?.updateStep5Ids()
          setShowSaveMessage(true)
          setInvalidInput(false)
        }).catch((error) => {
          setShowSaveMessage(false)
          setInvalidInput(true)
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
      iconType: 'send',
      label: I18n.t('pages.newProposal.send'),
      onClick: () => { }
    }
  ]

  // Menu suspenso após proposta ter sido salva
  const floatingButtonMenuItemsAfterSaved = [
    {
      iconType: 'save',
      label: I18n.t('pages.newProposal.save'),
      onClick: () => handleSave()
    }, {
      iconType: 'file',
      label: I18n.t('pages.newProposal.viewDownload'),
      onClick: () => handleOpen()
    },
    {
      iconType: 'send',
      label: I18n.t('pages.newProposal.send'),
      onClick: () => { }
    }
  ]

  const getEnchargedFullname = (): string => {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    return `${String(user.firstname)}  ${String(user.lastname)}`
  }

  const MessageExitDialog = (): JSX.Element => {
    useEffect(() => {
      if (filled.step1 ||
        filled.step2 ||
        filled.step3 ||
        filled.step4 ||
        filled.step6 ||
        filled.step5) {
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
      if ((element.id === 'tariff' || element.querySelector('#tariff')) && element.tagName !== 'DIV' && element.tagName !== 'BUTTON') {
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

  const proposalTotal = (): string => {
    const total = proposal?.totalCosts as any[]
    const output = total.reduce((acc, { idCurrency, valueTotalSale }) => {
      const index = acc.findIndex(item => item.idCurrency === idCurrency)
      index === -1 ? acc.push({ idCurrency, valueTotalSale: valueTotalSale }) : acc[index].valueTotalSale = Number(acc[index].valueTotalSale) + Number(valueTotalSale)
      return acc
    }, [])
    let result = ''
    if (total) {
      output.forEach((value, index) => {
        result += ` ${String(value.idCurrency)} ${convertToDecimal(value.valueTotalSale)} ${output.length - 1 === index ? '' : '|'}`
      })
    }
    return result
  }

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
          <Link
            className="breadcrumbInitial"
            color="inherit"
            onClick={() => history.push('/proposta')}
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
        </UserContainer>
      </Header>
      <TopContainer>
        <div style={{ display: 'flex' }}>
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
              <FloatingMenu menuItems={proposal?.idProposal != null ? floatingButtonMenuItemsAfterSaved : floatingButtonMenuItems} />
            </Button>
          </ButtonContainer>
        </div>
        <TotalContainer>
          <UpperContainer>
            <div>
              {I18n.t('pages.newProposal.profit')}
              <ProfitValue>R$ 50,00 + $ 500,00</ProfitValue>
            </div>
            <div>
              {I18n.t('pages.newProposal.totalProposal')}
              <span style={{ marginLeft: '20px' }}>{proposalTotal()}</span>
            </div>
          </UpperContainer>
          <LowerContainer>
            {I18n.t('pages.newProposal.percentageProfit')}
            <PercentageCard>
              <PositiveProfitIcon /> 5,74%
            </PercentageCard> +
            <PercentageCard>
              <PositiveProfitIcon /> 12,91%
            </PercentageCard>
          </LowerContainer>
        </TotalContainer>
      </TopContainer>
      <ProposalDisplayModal
          open={open}
          setClose={handleClose}
          idProposal={proposal?.idProposal}
          downloadProposal={API.downloadProposal}
        />
       {leavingPage && <MessageExitDialog />}
      {loadExistingProposal &&
        <MainContainer ref={divRef}>
          <div id="step1">
            <Step1
              filled={filled}
              invalidInput={invalidInput}
              setAgentList={setAgentList}
              setCompleted={setCompleted}
              setFilled={setFilled}
              setModal={setModal}
              setProposalType={setProposalType}
              setStepLoaded={setStepLoaded}
            />
          </div>
          {stepLoaded.step1 && <>
            <div id="step2">
              <Step2
                invalidInput={invalidInput}
                modal={modal}
                proposalType={proposalType}
                setAgentList={setAgentList}
                setCompleted={setCompleted}
                setFilled={setFilled}
                updateAgentsIdsRef={updateAgentsIdsRef}
              />
            </div>
            <div id="step3">
              <Step3
                containerTypeList={containerTypeList}
                invalidInput={invalidInput}
                modal={modal}
                setCalculationData={setCalculationData}
                setCompleted={setCompleted}
                setCostData={setCostData}
                setCw={setCw}
                setCwSale={setCwSale}
                setFilled={setFilled}
                setSpecifications={setSpecifications}
                setStepLoaded={setStepLoaded}
                setTableItems={setStep3TableItems}
                setUndoMessage={setUndoMessage}
                undoMessage={undoMessage}
                updateTableIdsRef={updateTable3IdsRef}
              />
            </div>
            <div id="step4">
              <Step4
                duplicateMode={duplicateMode}
                invalidInput={invalidInput}
                modal={modal}
                setCompleted={setCompleted}
                setFilled={setFilled}
                specifications={specifications}
              />
            </div>
            {stepLoaded.step3 && <>
              <div id="step5">
                <Step5
                  calculationData={calculationData}
                  containerItems={step3TableItems}
                  containerTypeList={containerTypeList}
                  costData={costData}
                  cw={cw}
                  cwSale={cwSale}
                  invalidInput={invalidInput}
                  modal={modal}
                  serviceList={serviceList}
                  setCompleted={setCompleted}
                  setFilled={setFilled}
                  setUndoMessage={setUndoMessage}
                  specifications={specifications}
                  totalCosts={totalCosts}
                  undoMessage={undoMessage}
                  updateTableIdsRef={updateTable6IdsRef}
                  setTotalCostArray={setTotalCostArray}
                />
              </div>
              <div id="step6">
                <Step6
                  agentList={agentList}
                  calculationData={calculationData}
                  containerItems={step3TableItems}
                  containerTypeList={containerTypeList}
                  costData={costData}
                  invalidInput={invalidInput}
                  modal={modal}
                  serviceList={serviceList}
                  setCompleted={setCompleted}
                  setFilled={setFilled}
                  setTotalCosts={setTotalCosts}
                  setUndoMessage={setUndoMessage}
                  specifications={specifications}
                  undoMessage={undoMessage}
                  updateTableIdsRef={updateTable5IdsRef}
                  totalCostArray={totalCostArray}
                />
              </div>
            </>}
          </>
          }
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
            message={`${String(I18n.t('pages.newProposal.saveMessage.message'))} ${String(proposal?.referenceProposal)}.`}
            severity={'success'}
          />
        </MessageContainer>}
    </RootContainer>
  )
}

export default withTheme(NewProposal)
