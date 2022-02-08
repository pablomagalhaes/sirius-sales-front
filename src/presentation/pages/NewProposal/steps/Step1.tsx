import React, { useEffect, useState } from 'react'
import {
  Checkbox,
  FormControlLabel,
  FormLabel,
  Grid,
  InputAdornment,
  Radio,
  RadioGroup
} from '@material-ui/core/'
import { I18n } from 'react-redux-i18n'
import { Title, Subtitle, IconContainer, Separator } from '../style'
import IconComponent from '../../../../application/icons/IconComponent'
import { withTheme } from 'styled-components'
import ControlledInput from '../../../components/ControlledInput'
export interface Step1Props {
  theme: any
  setProposalType: (proposal: string) => void
}

const Step1 = ({ theme, setProposalType }: Step1Props): JSX.Element => {
  const [data, setData] = useState({
    proposal: '',
    services: '',
    client: '',
    modal: ''
  })

  useEffect(() => {
    setProposalType(data.proposal)
  }, [data.proposal])

  return (
    <Separator>
      <Title>
        1. {I18n.t('pages.newProposal.step1.title')}
        <Subtitle>{I18n.t('pages.newProposal.step1.subtitle')}</Subtitle>
      </Title>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <FormLabel component="legend">{I18n.t('pages.newProposal.step1.proposalType')}</FormLabel>
          <RadioGroup
            row aria-label="proposal type"
            name="row-radio-buttons-group"
            value={data.proposal}
            onChange={e => setData({ ...data, proposal: e.target.value })}
          >
            <FormControlLabel value="client" control={<Radio />} label={I18n.t('pages.newProposal.step1.client')} />
            <FormControlLabel value="routing" control={<Radio />} label={I18n.t('pages.newProposal.step1.routingOrder')} />
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
              ? <FormLabel component="legend">{I18n.t('pages.newProposal.step1.agents')}</FormLabel>
              : <FormLabel component="legend">{I18n.t('pages.newProposal.step1.client')}:</FormLabel>
          }
          <ControlledInput
            id="search-client"
            toolTipTitle={I18n.t('components.itemModal.requiredField')}
            invalid={false}
            variant="outlined"
            size="small"
            onChange={e => setData({ ...data, client: e.target.value })}
            value={data.client}
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
      <FormLabel component="legend">{I18n.t('pages.newProposal.step1.modal')}</FormLabel>
      <RadioGroup row aria-label="modal" name="row-radio-buttons-group" onChange={e => setData({ ...data, modal: e.target.value })}>
        <FormControlLabel value="1" control={<Radio />} label={I18n.t('pages.newProposal.step1.air')} />
        <IconContainer>
          <IconComponent name="plane" defaultColor={theme?.commercial?.pages?.newProposal?.subtitle} />
        </IconContainer>
        <FormControlLabel value="2" control={<Radio />} label={I18n.t('pages.newProposal.step1.marine')} />
        <IconContainer>
          <IconComponent name="ship" defaultColor={theme?.commercial?.pages?.newProposal?.subtitle} />
        </IconContainer>
        <FormControlLabel value="3" control={<Radio />} label={I18n.t('pages.newProposal.step1.road')} />
        <IconContainer>
          <IconComponent name="truck" defaultColor={theme?.commercial?.pages?.newProposal?.subtitle} />
        </IconContainer>
      </RadioGroup>
    </Separator>
  )
}

export default withTheme(Step1)
