import React, { useEffect, useState, useContext } from 'react'
import {
  Checkbox,
  FormControlLabel,
  FormLabel,
  Grid,
  InputAdornment,
  RadioGroup
} from '@material-ui/core/'
import { I18n } from 'react-redux-i18n'
import { Title, Subtitle, IconContainer, Separator, StyledRadio } from '../style'
import IconComponent from '../../../../application/icons/IconComponent'
import { withTheme } from 'styled-components'
import ControlledInput from '../../../components/ControlledInput'
import { RedColorSpan } from '../../../components/StyledComponents/modalStyles'
import API from '../../../../infrastructure/api'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { Transport, TransportList } from '../../../../domain/Transport'
import { StyledPaper } from './StepsStyles'
import { ExitDialog } from 'fiorde-fe-components'
import { ProposalContext, ProposalProps } from '../context/ProposalContext'

export interface Filled {
  step3: boolean
  step4: boolean
  step5: boolean
  step6: boolean
}
export interface Step1Props {
  theme?: any
  invalidInput: boolean
  setCompleted: (completed: any) => void
  setFilled: (filled: any) => void
  setProposalType: (proposal: string) => void
  setModal: (modal: string) => void
  filled: Filled
}

const Step1 = ({ theme, invalidInput, setCompleted, setFilled, setProposalType, setModal, filled }: Step1Props): JSX.Element => {
  const [transportList] = useState<Transport[]>(TransportList)
  const [agentsList, setAgentsList] = useState<any[]>([])
  const [partnerList, setPartnerList] = useState<any[]>([])
  const [data, setData] = useState({
    proposal: '',
    services: '',
    proposalValue: '',
    modal: '',
    requester: ''
  })
  const [showPopUp, setShowPopUp] = useState(false)
  const [modalCopy, setModalCopy] = useState('')
  const { proposal, setProposal }: ProposalProps = useContext(ProposalContext)

  useEffect(() => {
    setProposal({
      ...proposal,
      proposalType: data.proposal,
      idTransport: data.modal,
      idBusinessPartnerCostumer: data.proposal === 'routing'
        ? agentsList.filter((agt) => agt.businessPartner.simpleName === data.proposalValue)[0]?.id
        : partnerList.filter((ptn) => ptn.businessPartner.simpleName === data.proposalValue)[0]?.id,
      requester: data.requester
    })
  }, [data])

  useEffect(() => {
    void (async function () {
      await API.getAgents()
        .then((response) => setAgentsList(response))
        .catch((err) => console.log(err))
    })()
  }, [])

  useEffect(() => {
    void (async function () {
      await API.getPartner()
        .then((response) => setPartnerList(response))
        .catch((err) => console.log(err))
    })()
  }, [])

  useEffect(() => {
    setProposalType(data.proposal)
  }, [data.proposal])

  useEffect(() => {
    setModal(data.modal)
  }, [data.modal])

  useEffect(() => {
    if (data.proposal !== '' && data.proposalValue !== '' && data.modal !== '') {
      setCompleted((currentState) => ({ ...currentState, step1: true }))
    } else {
      setCompleted((currentState) => ({ ...currentState, step1: false }))
    }
    if (data.proposal !== '' || data.proposalValue !== '' || data.modal !== '') {
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
    if (filled.step3 || filled.step4 || filled.step5 || filled.step6) {
      setModalCopy(modal)
      setShowPopUp(true)
    } else {
      setData({ ...data, modal: modal })
    }
  }

  return (
    <Separator>
      <Title>
        1. {I18n.t('pages.newProposal.step1.title')}
        <Subtitle>{I18n.t('pages.newProposal.step1.subtitle')}</Subtitle>
      </Title>
      <Grid container spacing={5}>
        <Grid item xs={6}>
          <FormLabel component="legend">{I18n.t('pages.newProposal.step1.proposalType')}<RedColorSpan> *</RedColorSpan></FormLabel>
          <RadioGroup
            row aria-label="proposal type"
            name="row-radio-buttons-group"
            value={data.proposal}
            onChange={e => setData({ ...data, proposal: e.target.value })}
          >
            <FormControlLabel value="client" control={<StyledRadio color={getColor(data.proposal)} />} label={I18n.t('pages.newProposal.step1.client')} style={{ marginRight: '30px' }} />
            <FormControlLabel value="routing" control={<StyledRadio color={getColor(data.proposal)} />} label={I18n.t('pages.newProposal.step1.routingOrder')} />
          </RadioGroup>
        </Grid>
        {
          data.proposal === 'routing'
            ? <Grid item xs={6}>
              <FormLabel component="legend">{I18n.t('pages.newProposal.step1.services')}</FormLabel>
              <RadioGroup row aria-label="services" name="row-radio-buttons-group" onChange={e => setData({ ...data, services: e.target.value })}>
                <FormControlLabel value="transport" control={<Checkbox />} label={I18n.t('pages.newProposal.step1.transport')} />
                <FormControlLabel value="desemb" control={<Checkbox />} label={I18n.t('pages.newProposal.step1.readiness')} />
              </RadioGroup>
            </Grid>
            : <Grid item xs={6}> </Grid>
        }
        <Grid item xs={6}>
          {
            data.proposal === 'routing'
              ? <FormLabel component="legend">{I18n.t('pages.newProposal.step1.agents')}<RedColorSpan> *</RedColorSpan></FormLabel>
              : <FormLabel component="legend">{I18n.t('pages.newProposal.step1.client')}:<RedColorSpan> *</RedColorSpan></FormLabel>
          }
          <Autocomplete
            freeSolo
            onChange={(e, newValue) => setData({ ...data, proposalValue: String(newValue) })}
            options={data.proposal === 'routing' ? agentsList.map((item) => item.businessPartner.simpleName) : partnerList.map((item) => item.businessPartner.simpleName)}
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
                        <IconComponent name="search" defaultColor={theme?.commercial?.pages?.newProposal?.subtitle} />
                      </InputAdornment>
                    )
                  }}
                />
              </div>
            )}
            PaperComponent={(params: any) => <StyledPaper {...params} />}
          />
        </Grid>
        <Grid item xs={6}>
          <FormLabel component="legend">{I18n.t('pages.newProposal.step1.searchRequester')}:<RedColorSpan> *</RedColorSpan></FormLabel>
          <ControlledInput
            id="search-requester"
            toolTipTitle={I18n.t('components.itemModal.requiredField')}
            invalid={data.requester === '' && invalidInput}
            variant="outlined"
            size="small"
            placeholder={I18n.t('pages.newProposal.step1.searchRequesterPlaceholder')}
            onChange={(e) => setData({ ...data, requester: e.target.value })}
            value={data.requester}
            $space
          />
        </Grid>
      </Grid>
      <FormLabel component="legend">{I18n.t('pages.newProposal.step1.modal')}<RedColorSpan> *</RedColorSpan></FormLabel>
      <RadioGroup row aria-label="modal" name="row-radio-buttons-group" value={data.modal} onChange={e => handleModalChange(e.target.value)}>
        {transportList.map((transport, i) => (
          <div key={`div-${i}`} style={{ display: 'flex' }}>
            <FormControlLabel
              value={transport.id}
              control={<StyledRadio color={getColor(data?.modal)} key={`radio-${i}`} />}
              label={transport.description}
              key={`label-${i}`}
            />
            <IconContainer key={`container-${i}`}>
              <IconComponent name={transport.id} defaultColor={theme?.commercial?.pages?.newProposal?.subtitle} key={`icon-${i}`} />
            </IconContainer>
          </div>
        ))}
      </RadioGroup>
      {showPopUp && <ExitDialog cancelButtonText={I18n.t('pages.newProposal.step1.popUpConfirmationButton1')} confirmButtonText={I18n.t('pages.newProposal.step1.popUpConfirmationButton2')} message={I18n.t('pages.newProposal.step1.popUpConfirmationBody')} title={I18n.t('pages.newProposal.step1.popUpConfirmationTitle')} onPressCancel={() => setShowPopUp(false)} onPressConfirm={() => { console.log(modalCopy); setData({ ...data, modal: modalCopy }); setShowPopUp(false) }} />}
    </Separator>
  )
}

export default withTheme(Step1)
