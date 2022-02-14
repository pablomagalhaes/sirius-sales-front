import React, { useEffect, useState } from 'react'
import {
  FormControl,
  FormLabel,
  Grid,
  MenuItem
} from '@material-ui/core/'
import { I18n } from 'react-redux-i18n'
import { Title, Subtitle, Separator, SelectSpan } from '../style'
import ControlledSelect from '../../../components/ControlledSelect'
import ControlledInput from '../../../components/ControlledInput'
import { RedColorSpan } from '../../../components/StyledComponents/modalStyles'

interface Step4Props {
  invalidInput: boolean
  setCompleted: (completed: any) => void
}

const Step4 = ({ invalidInput, setCompleted }: Step4Props): JSX.Element => {
  // mock para os selects
  const validityList = [
    {
      name: 'Personalizado',
      value: 1
    }, {
      name: '1 semana',
      value: 2
    }, {
      name: '15 dias',
      value: 3
    }, {
      name: '30 dias',
      value: 4
    }, {
      name: '45 dias',
      value: 5
    }
  ]
  const frequencyList = [
    {
      name: 'Diariamente',
      value: 6
    }, {
      name: 'A cada dois dias',
      value: 7
    }, {
      name: 'Semanal',
      value: 8
    }, {
      name: 'Quinzenal',
      value: 9
    }
  ]
  const currencyList = [
    {
      name: '220 - DOLAR DOS EUA (USD)',
      value: 10
    }, {
      name: '706 - PESO ARGENTINO',
      value: 11
    }, {
      name: '790 - REAL/BRASIL (BRL)',
      value: 12
    }
  ]

  const [data, setData] = useState({
    validity: '',
    validityDate: '',
    transitTime: '',
    frequency: '',
    route: '',
    client: '',
    currency: '',
    generalObs: '',
    internalObs: ''
  })

  useEffect(() => {
    if (data.validity.length !== 0 && data.validityDate.length !== 0 && data.transitTime.length !== 0 && data.frequency.length !== 0) {
      setCompleted((currentState) => {
        return { ...currentState, step4: true }
      })
    } else {
      setCompleted((currentState) => {
        return { ...currentState, step4: false }
      })
    }
  }, [data])

  return (
    <Separator>
      <Title>
        4. {I18n.t('pages.newProposal.step4.title')}
        <Subtitle>{I18n.t('pages.newProposal.step4.subtitle')}</Subtitle>
      </Title>
      <FormControl variant="outlined" size="small">
        <Grid container spacing={2}>
          <Grid item xs={2}>
            <FormLabel component="legend">
              {I18n.t('pages.newProposal.step4.validity')}
              <RedColorSpan> *</RedColorSpan>
            </FormLabel>
            <ControlledSelect
              labelId="validity-label"
              id="validity"
              value={data.validity}
              onChange={e => setData({ ...data, validity: e.target.value })}
              displayEmpty
              disableUnderline
              invalid={invalidInput && data.validity.length === 0}
              toolTipTitle={I18n.t('components.itemModal.requiredField')}
            >
              <MenuItem disabled value={data.validity}>
                <SelectSpan placeholder={1}>{I18n.t('pages.newProposal.step4.choose')}</SelectSpan>
              </MenuItem>
              {validityList.map((item) => (
                <MenuItem key={item.value} value={item.value}>
                  <SelectSpan>{item.name}</SelectSpan>
                </MenuItem>
              ))}
            </ControlledSelect>
          </Grid>
          <Grid item xs={2}>
            <FormLabel component="legend">&nbsp;</FormLabel>
            <ControlledInput
              id="no-label-field"
              toolTipTitle={I18n.t('components.itemModal.requiredField')}
              invalid={invalidInput && data.validityDate.length === 0}
              variant="outlined"
              onChange={e => setData({ ...data, validityDate: e.target.value })}
              value={data.validityDate}
              size="small"
            />
          </Grid>
          <Grid item xs={2}>
            <FormLabel component="legend">
              {I18n.t('pages.newProposal.step4.time')}
              <RedColorSpan> *</RedColorSpan>
            </FormLabel>
            <ControlledInput
              id="time"
              toolTipTitle={I18n.t('components.itemModal.requiredField')}
              invalid={invalidInput && data.transitTime.length === 0}
              variant="outlined"
              onChange={e => setData({ ...data, transitTime: e.target.value })}
              value={data.transitTime}
              size="small"
            />
          </Grid>
          <Grid item xs={2}>
            <FormLabel component="legend">
              {I18n.t('pages.newProposal.step4.frequency')}
              <RedColorSpan> *</RedColorSpan>
            </FormLabel>
            <ControlledSelect
              labelId="frequency-label"
              id="frequency"
              value={data.frequency}
              onChange={e => setData({ ...data, frequency: e.target.value })}
              displayEmpty
              disableUnderline
              invalid={invalidInput && data.frequency.length === 0}
              toolTipTitle={I18n.t('components.itemModal.requiredField')}
            >
              <MenuItem disabled value={data.frequency}>
                <SelectSpan placeholder={1}>{I18n.t('pages.newProposal.step4.choose')}</SelectSpan>
              </MenuItem>
              {frequencyList.map((item) => (
                <MenuItem key={item.value} value={item.value}>
                  <SelectSpan>{item.name}</SelectSpan>
                </MenuItem>
              ))}
            </ControlledSelect>
          </Grid>
          <Grid item xs={3}>
            <FormLabel component="legend">{I18n.t('pages.newProposal.step4.route')}</FormLabel>
            <ControlledInput
              id="route"
              toolTipTitle={I18n.t('components.itemModal.requiredField')}
              invalid={false}
              variant="outlined"
              onChange={e => setData({ ...data, route: e.target.value })}
              value={data.route}
              size="small"
            />
          </Grid>
          <Grid item xs={3}>
            <FormLabel component="legend">{I18n.t('pages.newProposal.step4.client')}</FormLabel>
            <ControlledInput
              id="client"
              toolTipTitle={I18n.t('components.itemModal.requiredField')}
              invalid={false}
              variant="outlined"
              onChange={e => setData({ ...data, client: e.target.value })}
              value={data.client}
              size="small"
            />
          </Grid>
          <Grid item xs={4}>
            <FormLabel component="legend">{I18n.t('pages.newProposal.step4.currency')}</FormLabel>
            <ControlledSelect
              labelId="currency-label"
              id="currency"
              value={data.currency}
              onChange={e => setData({ ...data, currency: e.target.value })}
              displayEmpty
              disableUnderline
              invalid={false}
              toolTipTitle={I18n.t('components.itemModal.requiredField')}
            >
              <MenuItem disabled value={data.currency}>
                <SelectSpan placeholder={1}>{I18n.t('pages.newProposal.step4.choose')}</SelectSpan>
              </MenuItem>
              {currencyList.map((item) => (
                <MenuItem key={item.value} value={item.value}>
                  <SelectSpan>{item.name}</SelectSpan>
                </MenuItem>
              ))}
            </ControlledSelect>
          </Grid>
          <Grid item xs={6}>
            <FormLabel component="legend">{I18n.t('pages.newProposal.step4.general')}</FormLabel>
            <ControlledInput
              id="general"
              toolTipTitle={I18n.t('components.itemModal.requiredField')}
              invalid={false}
              variant="outlined"
              onChange={e => setData({ ...data, generalObs: e.target.value })}
              value={data.generalObs}
              size="small"
              multiline
              rows={4}
            />
          </Grid>
          <Grid item xs={6}>
            <FormLabel component="legend">{I18n.t('pages.newProposal.step4.internal')}</FormLabel>
            <ControlledInput
              id="internal"
              toolTipTitle={I18n.t('components.itemModal.requiredField')}
              invalid={false}
              variant="outlined"
              onChange={e => setData({ ...data, internalObs: e.target.value })}
              value={data.internalObs}
              size="small"
              multiline
              rows={4}
            />
          </Grid>
        </Grid>
      </FormControl>
    </Separator>
  )
}

export default Step4
