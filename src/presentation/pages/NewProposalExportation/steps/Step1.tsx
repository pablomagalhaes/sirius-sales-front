import React, { useEffect, useState, useContext, Fragment } from 'react'
import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
  InputAdornment,
  RadioGroup
} from '@material-ui/core/'
import { I18n } from 'react-redux-i18n'
import {
  Title,
  Subtitle,
  IconContainer,
  Separator,
  StyledRadio
} from '../style'
import IconComponent from '../../../../application/icons/IconComponent'
import { withTheme } from 'styled-components'
import ControlledInput from '../../../components/ControlledInput'
import { RedColorSpan } from '../../../components/StyledComponents/modalStyles'
import API from '../../../../infrastructure/api'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { Transport, TransportList } from '../../../../domain/Transport'
import { StyledPaper } from './StepsStyles'
import { ExitDialog } from 'fiorde-fe-components'
import { ProposalContext, ProposalProps } from '../../NewProposal/context/ProposalContext'

export interface Agents {
  id?: number | null
  agent: string
  idBusinessPartnerAgent?: number | null
  shippingCompany: string
  idBusinessPartnerTransportCompany?: number | null
}

export interface Filled {
  step2: boolean
  step3: boolean
  step4: boolean
  step6: boolean
  step5: boolean
}
export interface Step1Props {
  theme?: any
  invalidInput: boolean
  setCompleted: (completed: any) => void
  setFilled: (filled: any) => void
  setProposalType: (proposal: string) => void
  setModal: (modal: string) => void
  filled: Filled
  setStepLoaded: (steps: any) => void
  setAgentList: (agent: Agents[]) => void
  // setAgentList: (agent: string[]) => void
}

const Step1 = ({
  theme,
  invalidInput,
  setCompleted,
  setFilled,
  setProposalType,
  setModal,
  filled,
  setStepLoaded,
  setAgentList
}: Step1Props): JSX.Element => {
  const [transportList] = useState<Transport[]>(TransportList)
  const [agentsList, setAgentsList] = useState<any[]>([])
  const [businessPartnerList, setBusinessPartnerList] = useState<any[]>([])
  const [partnerList, setPartnerList] = useState<any[]>([])
  const [data, setData] = useState({
    proposal: '',
    serviceDesemb: false,
    serviceTransport: false,
    proposalValue: '',
    modal: '',
    requester: ''
  })

  const [showPopUp, setShowPopUp] = useState(false)
  const [modalCopy, setModalCopy] = useState('')

  const [selectedAgents, setSelectedAgents] = useState<Agents[]>([
    {
      id: null,
      agent: '',
      idBusinessPartnerAgent: null,
      shippingCompany: '',
      idBusinessPartnerTransportCompany: null
    }
  ])
  const { proposal, setProposal }: ProposalProps = useContext(ProposalContext)

  useEffect(() => {
    if (data.proposal === 'ROUTING ORDER') {
      setAgentList(selectedAgents)
    }
  }, [data.proposalValue, selectedAgents, agentsList])
  useEffect(() => {
    if (proposal.idTransport !== '') {
      if (proposal.idTransport === 'SEA') {
        void getBusinessPartner('ARMADOR')
        void getBusinessPartner('COLOADER')
      } else {
        void getBusinessPartner(getBusinessPartnerType())
      }
    }
  }, [proposal.idTransport])

  const getBusinessPartner = async (type: string): Promise<any> => {
    const response = await API.getBusinessPartnerByType(type)
    if (response !== undefined) {
      setBusinessPartnerList([...response])
    }
  }
  const getBusinessPartnerType = (): string => {
    switch (proposal.idTransport) {
      case 'AIR':
        return 'CIA. AEREA'
      case 'LAND':
        return 'TRANS. INTERNACIONAL'
    }
    return ''
  }

  useEffect(() => {
    const getAgents = new Promise<void>((resolve) => {
      API.getAgents()
        .then((response) => {
          setAgentsList(response)
          resolve()
        })
        .catch((err) => console.log(err))
    })

    const getPartners = new Promise<void>((resolve) => {
      API.getPartner()
        .then((response) => {
          setPartnerList(response)
          resolve()
        })
        .catch((err) => console.log(err))
    })

    if (proposal.proposalType === 'ROUTING ORDER') {
      void Promise.all([getAgents, getPartners]).then(
        () => {
          setData({
            proposal: proposal.proposalType,
            serviceDesemb: proposal.clearenceIncluded,
            serviceTransport: proposal.transportIncluded,
            modal: proposal.idTransport,
            proposalValue: '',
            requester: proposal.requester
          })
          setStepLoaded((currentState) => ({ ...currentState, step1: true }))
        }
      )
    } else if (proposal.idProposal !== undefined && proposal.idProposal !== null) {
      const getPartnerCostumer = new Promise<void>((resolve) => {
        API.getBusinessPartnerCostumer(proposal.idBusinessPartnerCustomer)
          .then((response) => {
            resolve(response?.simpleName)
          })
          .catch((err) => console.log(err))
      })

      void Promise.all([getAgents, getPartners, getPartnerCostumer]).then(
        (response) => {
          setData({
            proposal: proposal.proposalType,
            serviceDesemb: proposal.clearenceIncluded,
            serviceTransport: proposal.transportIncluded,
            modal: proposal.idTransport,
            proposalValue: String(response[2]),
            requester: proposal.requester
          })
          setStepLoaded((currentState) => ({ ...currentState, step1: true }))
        }
      )
    } else {
      setStepLoaded((currentState) => ({ ...currentState, step1: true }))
    }
  }, [])
  const getAgentById = (idProposalAgent: number | null | undefined): string => {
    if (idProposalAgent !== null && idProposalAgent !== undefined) {
      const agent = agentsList.find((agent) => agent.businessPartner.id === idProposalAgent)
      if (agent !== undefined) {
        return agent.businessPartner.simpleName
      }
    }
    return ''
  }
  const getBusinessPartnerById = (id: number | null | undefined): string => {
    if (id !== null && id !== undefined) {
      const businessPartner = businessPartnerList.find(
        (businessPartner) => businessPartner.businessPartner.id === id
      )
      if (businessPartner !== undefined) {
        return businessPartner.businessPartner.simpleName
      }
    }
    return ''
  }
  useEffect(() => {
    if (proposal.agents.length > 0) {
      setSelectedAgents(
        proposal?.agents.map((agent, index) => {
          return {
            idProposalAgent: agent.idProposalAgent,
            idBusinessPartnerAgent: agent.idBusinessPartnerAgent,
            shippingCompany: getBusinessPartnerById(agent.idBusinessPartnerTransportCompany),
            agent: getAgentById(agent.idBusinessPartnerAgent),
            idBusinessPartnerTransportCompany: agent.idBusinessPartnerTransportCompany
          }
        })
      )
    }
  }, [agentsList])
  useEffect(() => {
    setProposal({
      ...proposal,
      agents: selectedAgents.map(
        ({ shippingCompany, agent, ...otherProperties }) => otherProperties
      )
    })
  }, [selectedAgents])

  useEffect(() => {
    let firstAgent!: any[]
    let listCostsWithoutAgents!: any[]

    if (data.modal === 'LAND' || data.modal === 'SEA') {
      if (proposal.idTransport !== '') {
        if (proposal.idTransport === 'AIR') {
          if (proposal.agents.length > 0 && proposal.agents[0].idBusinessPartnerAgent !== null) {
            firstAgent = proposal.agents
            proposal.agents = []
            proposal.agents[0] = firstAgent[0]
            proposal.agents[0].idBusinessPartnerTransportCompany = null
            listCostsWithoutAgents = proposal.costs.filter(cost => cost.agent === null)
            proposal.costs = []
            proposal.costs = listCostsWithoutAgents
          }
        }
      }
    }

    setProposal({
      ...proposal,
      proposalType: data.proposal,
      idTransport: data.modal,
      idBusinessPartnerCustomer:
        data.proposal === 'ROUTING ORDER'
          ? agentsList.filter(
            (agt) => agt.businessPartner.simpleName === data.proposalValue
          )[0]?.businessPartner.id
          : partnerList.filter(
            (ptn) => ptn.businessPartner.simpleName === data.proposalValue
          )[0]?.businessPartner.id,
      requester: data.requester,
      transportIncluded: data.serviceTransport,
      clearenceIncluded: data.serviceDesemb
    })
  }, [data])

  useEffect(() => {
    setProposalType(data.proposal)
  }, [data.proposal])

  useEffect(() => {
    setModal(data.modal)
  }, [data.modal])

  useEffect(() => {
    const step6 = data.modal === 'LAND'
    if (
      data.proposal !== '' &&
      data.modal !== '' &&
      data.requester !== ''
    ) {
      setCompleted((currentState) => ({ ...currentState, step1: true, step6 }))
    } else {
      setCompleted((currentState) => ({ ...currentState, step1: false, step6 }))
    }
    if (
      data.proposal !== '' ||
      data.modal !== ''
    ) {
      setFilled((currentState) => {
        return { ...currentState, step1: true }
      })
    } else {
      setFilled((currentState) => {
        return { ...currentState, step1: false }
      })
    }
  }, [data])

  const getColor = (value): any => {
    if (value === '' && invalidInput) {
      return theme?.commercial?.components?.itemModal?.redAsterisk
    }
  }

  const handleModalChange = (modal): void => {
    if (
      filled.step2 ||
      filled.step3 ||
      filled.step4 ||
      filled.step6 ||
      filled.step5
    ) {
      setModalCopy(modal)
      if (proposal.idProposal !== undefined && proposal.idProposal !== null) {
        setShowPopUp(true)
      } else {
        setData({ ...data, modal: modal })
        setShowPopUp(false)
      }
    } else {
      setData({ ...data, modal: modal })
    }
  }

  const getidBusinessPartnerAgent = (agentName: string): number | undefined => {
    let id
    if (agentName !== '') {
      agentsList?.forEach((item): void => {
        if (String(item.businessPartner.simpleName) === String(agentName)) {
          id = item.businessPartner.id
        }
      })
    }
    return id
  }

  useEffect(() => {
    setAgentList(selectedAgents)
  }, [data.proposalValue, selectedAgents, agentsList])

  return (
    <Separator>
      <Title>
        1. {I18n.t('pages.newProposal.step1.title')}
        <Subtitle>{I18n.t('pages.newProposal.step1.subtitle')}</Subtitle>
      </Title>
      <Grid container spacing={5}>
        <Grid item xs={6}>
          <FormLabel component="legend">
            {I18n.t('pages.newProposal.step1.proposalType')}
            <RedColorSpan> *</RedColorSpan>
          </FormLabel>
          <RadioGroup
            row
            aria-label="proposal type"
            name="row-radio-buttons-group"
            value={data.proposal}
            onChange={(e) => setData({ ...data, proposal: e.target.value })}
          >
            <FormControlLabel
              checked={data.proposal === 'CLIENT'}
              value="CLIENT"
              control={<StyledRadio color={getColor(data.proposal)} />}
              label={I18n.t('pages.newProposal.step1.client')}
              style={{ marginRight: '30px' }}
            />
            <FormControlLabel
              checked={data.proposal === 'ROUTING ORDER'}
              value="ROUTING ORDER"
              control={<StyledRadio color={getColor(data.proposal)} />}
              label={I18n.t('pages.newProposal.step1.routingOrder')}
            />
          </RadioGroup>
        </Grid>
        {
          <Grid item xs={6}>
            <FormLabel component="legend">
              {I18n.t('pages.newProposal.step1.services')}
            </FormLabel>
            <FormGroup row aria-label="services">
              <FormControlLabel
                value="transport"
                control={
                  <Checkbox
                    checked={data.serviceTransport}
                    onChange={(e) =>
                      setData({ ...data, serviceTransport: e.target.checked })
                    }
                  />
                }
                label={I18n.t('pages.newProposal.step1.transport')}
              />
              <FormControlLabel
                value="desemb"
                control={
                  <Checkbox
                    checked={data.serviceDesemb}
                    onChange={(e) =>
                      setData({ ...data, serviceDesemb: e.target.checked })
                    }
                  />
                }
                label={I18n.t('pages.newProposal.step1.readiness')}
              />
            </FormGroup>
          </Grid>
        }
        <Grid item xs={6}>
          {data.proposal === 'ROUTING ORDER'
            ? (
              <FormLabel component="legend">
                {I18n.t('pages.newProposal.step1.agents')}
                <RedColorSpan> *</RedColorSpan>
              </FormLabel>
              )
            : (
              <FormLabel component="legend">
                {I18n.t('pages.newProposal.step1.client')}:
                <RedColorSpan> *</RedColorSpan>
              </FormLabel>
              )}

           {data.proposal === 'ROUTING ORDER'
             ? selectedAgents.map((selectedAgent, index) => {
               return (
                      <Fragment key={index}>
                        <Autocomplete
                          freeSolo
                          options={
                            data.proposal === 'ROUTING ORDER'
                              ? agentsList.map((item) => item.businessPartner.simpleName)
                              : partnerList.map((item) => item.businessPartner.simpleName)
                          }
                          onChange={(e, newValue) => {
                            setSelectedAgents(
                              selectedAgents.map((value, currentIndex) =>
                                currentIndex === index
                                  ? {
                                      ...value,
                                      agent: newValue ?? '',
                                      idBusinessPartnerAgent: getidBusinessPartnerAgent(newValue)
                                    }
                                  : value
                              )
                            )
                          }}
                          value={selectedAgent.agent}
                          renderInput={(params) => (
                            <div ref={params.InputProps.ref}>
                              <ControlledInput
                                {...params}
                                id="search-client"
                                toolTipTitle={I18n.t('components.itemModal.requiredField')}
                                invalid={selectedAgent.agent === '' && invalidInput}
                                variant="outlined"
                                size="small"
                                placeholder={I18n.t('pages.newProposal.step1.searchClient')}
                                $space
                                InputProps={{
                                  endAdornment: (
                                    <InputAdornment position="end">
                                      <IconComponent
                                        name="search"
                                        defaultColor={
                                          theme?.commercial?.pages?.newProposal?.subtitle
                                        }
                                      />
                                    </InputAdornment>
                                  )
                                }}
                              />
                            </div>
                          )}
                          PaperComponent={(params: any) => <StyledPaper {...params} />}
                        />
                      </Fragment>
               )
             })
             : <Autocomplete
                    freeSolo
                    onChange={(e, newValue) =>
                      setData({ ...data, proposalValue: String(newValue) })
                    }
                    options={
                      data.proposal === 'ROUTING ORDER'
                        ? agentsList.map((item) => item.businessPartner.simpleName)
                        : partnerList.map((item) => item.businessPartner.simpleName)
                    }
                    value={data.proposalValue}
                    renderInput={(params) => (
                      <div ref={params.InputProps.ref}>
                        <ControlledInput
                          {...params}
                          id="search-client"
                          toolTipTitle={I18n.t('components.itemModal.requiredField')}
                          invalid={data.proposalValue === '' && invalidInput}
                          variant="outlined"
                          size="small"
                          placeholder={I18n.t('pages.newProposal.step1.searchClient')}
                          $space
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconComponent
                                  name="search"
                                  defaultColor={
                                    theme?.commercial?.pages?.newProposal?.subtitle
                                  }
                                />
                              </InputAdornment>
                            )
                          }}
                        />
                      </div>
                    )}
                    PaperComponent={(params: any) => <StyledPaper {...params} />}
                  />
              }
        </Grid>
        <Grid item xs={6}>
          <FormLabel component="legend">
            {I18n.t('pages.newProposal.step1.searchRequester')}:
            <RedColorSpan> *</RedColorSpan>
          </FormLabel>
          <ControlledInput
            id="search-requester"
            toolTipTitle={I18n.t('components.itemModal.requiredField')}
            invalid={data.requester === '' && invalidInput}
            variant="outlined"
            size="small"
            placeholder={I18n.t(
              'pages.newProposal.step1.searchRequesterPlaceholder'
            )}
            onChange={(e) => setData({ ...data, requester: e.target.value })}
            value={data.requester}
            $space
          />
        </Grid>
      </Grid>
      <FormLabel component="legend">
        {I18n.t('pages.newProposal.step1.modal')}
        <RedColorSpan> *</RedColorSpan>
      </FormLabel>
      <RadioGroup
        row
        aria-label="modal"
        name="row-radio-buttons-group"
        value={data.modal}
        onChange={(e) => handleModalChange(e.target.value)}
      >
        {transportList.map((transport, i) => (
          <div key={`div-${i}`} style={{ display: 'flex' }}>
            <FormControlLabel
              value={transport.id}
              control={
                <StyledRadio color={getColor(data?.modal)} key={`radio-${i}`} />
              }
              label={transport.description}
              key={`label-${i}`}
            />
            <IconContainer key={`container-${i}`}>
              <IconComponent
                name={transport.id}
                defaultColor={theme?.commercial?.pages?.newProposal?.subtitle}
                key={`icon-${i}`}
              />
            </IconContainer>
          </div>
        ))}
      </RadioGroup>
      {showPopUp && (
        <ExitDialog
          cancelButtonText={I18n.t(
            'pages.newProposal.step1.popUpConfirmationButton1'
          )}
          confirmButtonText={I18n.t(
            'pages.newProposal.step1.popUpConfirmationButton2'
          )}
          message={I18n.t('pages.newProposal.step1.popUpConfirmationBody')}
          title={I18n.t('pages.newProposal.step1.popUpConfirmationTitle')}
          onPressCancel={() => setShowPopUp(false)}
          onPressConfirm={() => {
            setData({ ...data, modal: modalCopy })
            setShowPopUp(false)
          }}
        />
      )}
    </Separator>
  )
}

export default withTheme(Step1)
