import React, { useState } from 'react'
import {
  FormControl,
  FormLabel,
  Grid,
  MenuItem,
  TextField
} from '@material-ui/core/'
import { I18n } from 'react-redux-i18n'
import { Title, Subtitle, Separator, SelectPlaceholder, StyledSelect } from './style'

const Step4 = (): JSX.Element => {
  const [validity, setValidity] = useState('')
  const [frequency, setFrequency] = useState('')
  const [currency, setCurrency] = useState('')
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

  const handleChangeValidity = (event): void => {
    setValidity(event.target.value)
  }

  const handleChangeFrequency = (event): void => {
    setFrequency(event.target.value)
  }

  const handleChangeCurrency = (event): void => {
    setCurrency(event.target.value)
  }

  return (
    <Separator>
      <Title>
        4. {I18n.t('pages.newProposal.step4.title')}
        <Subtitle>{I18n.t('pages.newProposal.step4.subtitle')}</Subtitle>
      </Title>
      <FormControl variant="outlined" size="small">
        <Grid container spacing={2}>
          <Grid item xs={2}>
            <FormLabel component="legend">{I18n.t('pages.newProposal.step4.validity')}</FormLabel>
            <StyledSelect
              labelId="validity-label"
              id="validity"
              value={validity}
              onChange={handleChangeValidity}
              displayEmpty
            >
              <MenuItem disabled value="">
                <SelectPlaceholder>{I18n.t('pages.newProposal.step4.choose')}</SelectPlaceholder>
              </MenuItem>
              {validityList.map((item) => (
                <MenuItem key={item.value} value={item.value}>
                  {item.name}
                </MenuItem>
              ))}
            </StyledSelect>
          </Grid>
          <Grid item xs={2}>
            <FormLabel component="legend">&nbsp;</FormLabel>
            <TextField
              id="no-label-field"
              variant="outlined"
              size="small"
            />
          </Grid>
          <Grid item xs={2}>
            <FormLabel component="legend">{I18n.t('pages.newProposal.step4.time')}</FormLabel>
            <TextField
              id="time"
              variant="outlined"
              size="small"
            />
          </Grid>
          <Grid item xs={2}>
            <FormLabel component="legend">{I18n.t('pages.newProposal.step4.frequency')}</FormLabel>
            <StyledSelect
              labelId="frequency-label"
              id="frequency"
              value={frequency}
              onChange={handleChangeFrequency}
              displayEmpty
            >
              <MenuItem disabled value="">
                <SelectPlaceholder>{I18n.t('pages.newProposal.step4.choose')}</SelectPlaceholder>
              </MenuItem>
              {frequencyList.map((item) => (
                <MenuItem key={item.value} value={item.value}>
                  {item.name}
                </MenuItem>
              ))}
            </StyledSelect>
          </Grid>
          <Grid item xs={3}>
            <FormLabel component="legend">{I18n.t('pages.newProposal.step4.route')}</FormLabel>
            <TextField
              id="route"
              variant="outlined"
              size="small"
            />
          </Grid>
          <Grid item xs={3}>
            <FormLabel component="legend">{I18n.t('pages.newProposal.step4.client')}</FormLabel>
            <TextField
              id="client"
              variant="outlined"
              size="small"
            />
          </Grid>
          <Grid item xs={4}>
            <FormLabel component="legend">{I18n.t('pages.newProposal.step4.currency')}</FormLabel>
            <StyledSelect
              labelId="currency-label"
              id="currency"
              value={currency}
              onChange={handleChangeCurrency}
              displayEmpty
            >
              <MenuItem disabled value="">
                <SelectPlaceholder>{I18n.t('pages.newProposal.step4.choose')}</SelectPlaceholder>
              </MenuItem>
              {currencyList.map((item) => (
                <MenuItem key={item.value} value={item.value}>
                  {item.name}
                </MenuItem>
              ))}
            </StyledSelect>
          </Grid>
          <Grid item xs={6}>
            <FormLabel component="legend">{I18n.t('pages.newProposal.step4.general')}</FormLabel>
            <TextField
              id="general"
              variant="outlined"
              size="small"
              multiline
              rows={4}
            />
          </Grid>
          <Grid item xs={6}>
            <FormLabel component="legend">{I18n.t('pages.newProposal.step4.internal')}</FormLabel>
            <TextField
              id="internal"
              variant="outlined"
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
