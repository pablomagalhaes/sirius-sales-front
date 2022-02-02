import React, { useState } from 'react'
import {
  FormControl,
  FormLabel,
  Grid,
  InputAdornment,
  MenuItem
} from '@material-ui/core/'
import { I18n } from 'react-redux-i18n'
import { Title, Subtitle, Separator, SelectSpan } from '../style'
import IconComponent from '../../../../application/icons/IconComponent'
import { withTheme } from 'styled-components'
import ControlledSelect from '../../../components/ControlledSelect'
import ControlledInput from '../../../components/ControlledInput'

const Step2 = ({ theme }): JSX.Element => {
  // mock
  const incotermList = [
    {
      name: 'teste',
      value: 1
    }
  ]

  const [data, setData] = useState({
    origin: '',
    destiny: '',
    agents: '',
    incoterm: ''
  })

  return (
    <Separator>
      <Title>
        2. {I18n.t('pages.newProposal.step2.title')}
        <Subtitle>{I18n.t('pages.newProposal.step2.subtitle')}</Subtitle>
      </Title>
      <FormControl variant="outlined" size="small">
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <FormLabel component="legend">{I18n.t('pages.newProposal.step2.origin')}</FormLabel>
            <ControlledInput
              id="search-origin"
              toolTipTitle={I18n.t('components.itemModal.requiredField')}
              invalid={false}
              onChange={e => setData({ ...data, origin: e.target.value })}
              value={data.origin}
              variant="outlined"
              size="small"
              placeholder={I18n.t('pages.newProposal.step2.searchPlaceholder')}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconComponent name="search" defaultColor={theme?.commercial?.pages?.newProposal?.subtitle} />
                  </InputAdornment>
                )
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <FormLabel component="legend">{I18n.t('pages.newProposal.step2.destiny')}</FormLabel>
            <ControlledInput
              id="search-destiny"
              toolTipTitle={I18n.t('components.itemModal.requiredField')}
              invalid={false}
              onChange={e => setData({ ...data, destiny: e.target.value })}
              value={data.destiny}
              variant="outlined"
              size="small"
              placeholder={I18n.t('pages.newProposal.step2.searchPlaceholder')}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconComponent name="search" defaultColor={theme?.commercial?.pages?.newProposal?.subtitle} />
                  </InputAdornment>
                )
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <FormLabel component="legend">{I18n.t('pages.newProposal.step2.agents')}</FormLabel>
            <ControlledInput
              id="search-name"
              toolTipTitle={I18n.t('components.itemModal.requiredField')}
              invalid={false}
              onChange={e => setData({ ...data, agents: e.target.value })}
              value={data.agents}
              variant="outlined"
              size="small"
              placeholder={I18n.t('pages.newProposal.step2.searchAgents')}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconComponent name="search" defaultColor={theme?.commercial?.pages?.newProposal?.subtitle} />
                  </InputAdornment>
                )
              }}
            />
          </Grid>
          <Grid item xs={3}>
            <FormLabel component="legend">{I18n.t('pages.newProposal.step2.incoterm')}</FormLabel>
            <ControlledSelect
              labelId="select-label-incoterm"
              id="incoterm"
              value={data.incoterm}
              onChange={e => { console.log(e.target.value); setData({ ...data, incoterm: e.target.value }) }}
              displayEmpty
              disableUnderline
              invalid={false}
              toolTipTitle={I18n.t('components.itemModal.requiredField')}
            >
              <MenuItem disabled value={data.incoterm}>
                <SelectSpan placeholder>{I18n.t('pages.newProposal.step2.choose')}</SelectSpan>
              </MenuItem>
              {incotermList.map((item) => (
                <MenuItem key={item.value} value={item.value}>
                  <SelectSpan>{item.name}</SelectSpan>
                </MenuItem>
              ))}
            </ControlledSelect>
          </Grid>
        </Grid>
      </FormControl>
    </Separator>
  )
}

export default withTheme(Step2)
