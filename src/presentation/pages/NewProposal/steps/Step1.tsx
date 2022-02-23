import React, { useEffect, useState } from 'react'
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
import newProposal from '../../../../infrastructure/api/newProposalService'

export interface Step1Props {
  theme?: any
  invalidInput: boolean
  setCompleted: (completed: any) => void
  setProposalType: (proposal: string) => void
  setModal: (modal: string) => void
}

const Step1 = ({ theme, invalidInput, setCompleted, setProposalType, setModal }: Step1Props): JSX.Element => {
  const [transportList, setTransportList] = useState<any[]>([])
  const [data, setData] = useState({
    proposal: '',
    services: '',
    proposalValue: '',
    modal: ''
  })

  useEffect(() => {
    void (async function () {
      await newProposal.getTransport()
        .then((response) => setTransportList(response))
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
  }, [data])

  const getColor = (value): any => {
    if (value === '' && invalidInput) {
      return theme?.commercial?.components?.itemModal?.redAsterisk
    }
  }

  return (
    <Separator>
      <Title>
        1. {I18n.t('pages.newProposal.step1.title')}
        <Subtitle>{I18n.t('pages.newProposal.step1.subtitle')}</Subtitle>
      </Title>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <FormLabel component="legend">{I18n.t('pages.newProposal.step1.proposalType')}<RedColorSpan> *</RedColorSpan></FormLabel>
          <RadioGroup
            row aria-label="proposal type"
            name="row-radio-buttons-group"
            value={data.proposal}
            onChange={e => setData({ ...data, proposal: e.target.value })}
          >
            <FormControlLabel value="client" control={<StyledRadio color={getColor(data.proposal)} />} label={I18n.t('pages.newProposal.step1.client')} />
            <FormControlLabel value="routing" control={<StyledRadio color={getColor(data.proposal)} />} label={I18n.t('pages.newProposal.step1.routingOrder')} />
          </RadioGroup>
        </Grid>
        {
          data?.proposal === 'routing'
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
            data?.proposal === 'routing'
              ? <FormLabel component="legend">{I18n.t('pages.newProposal.step1.agents')}<RedColorSpan> *</RedColorSpan></FormLabel>
              : <FormLabel component="legend">{I18n.t('pages.newProposal.step1.client')}:<RedColorSpan> *</RedColorSpan></FormLabel>
          }
          <ControlledInput
            id="search-client"
            toolTipTitle={I18n.t('components.itemModal.requiredField')}
            invalid={data.proposalValue === '' && invalidInput}
            variant="outlined"
            size="small"
            onChange={e => setData({ ...data, proposalValue: e.target.value })}
            value={data.proposalValue}
            placeholder={I18n.t('pages.newProposal.step1.searchClient')}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconComponent name="search" defaultColor={theme?.commercial?.pages?.newProposal?.subtitle} />
                </InputAdornment>
              )
            }}
          />
        </Grid>
      </Grid>
      <FormLabel component="legend">{I18n.t('pages.newProposal.step1.modal')}<RedColorSpan> *</RedColorSpan></FormLabel>
      <RadioGroup row aria-label="modal" name="row-radio-buttons-group" onChange={e => setData({ ...data, modal: e.target.value })}>
        {transportList?.map((item) => (
          <>
            <FormControlLabel
              value={item.id}
              control={<StyledRadio color={getColor(data.modal)} />}
              label={item.description}
            />
            <IconContainer>
              <IconComponent name={item.id} defaultColor={theme?.commercial?.pages?.newProposal?.subtitle} />
            </IconContainer>
          </>
        ))}
      </RadioGroup>
    </Separator>
  )
}

export default withTheme(Step1)
