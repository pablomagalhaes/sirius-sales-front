import React, { useState } from 'react'
import {
  FormControl,
  FormLabel,
  Grid,
  InputAdornment,
  MenuItem,
  TextField
} from '@material-ui/core/'
import { I18n } from 'react-redux-i18n'
import { Title, Subtitle, Separator, SelectPlaceholder, StyledSelect } from './style'
import IconComponent from '../../../application/icons/IconComponent'
import { withTheme } from 'styled-components'

const Step2 = ({ theme }): JSX.Element => {
  const [incoterm, setIncoterm] = useState('')
  // mock
  const incotermList = [
    {
      name: 'teste',
      value: 1
    }
  ]

  const handleChange = (event): void => {
    setIncoterm(event.target.value)
  }

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
            <TextField
              id="search-origin"
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
            <TextField
              id="search-destiny"
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
            <TextField
              id="search-name"
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
            <StyledSelect
              labelId="select-label-incoterm"
              id="incoterm"
              value={incoterm}
              onChange={handleChange}
              displayEmpty
            >
              <MenuItem disabled value="">
                <SelectPlaceholder>{I18n.t('pages.newProposal.step2.choose')}</SelectPlaceholder>
              </MenuItem>
              {incotermList.map((item) => (
                <MenuItem key={item.value} value={item.value}>
                  {item.name}
                </MenuItem>
              ))}
            </StyledSelect>
          </Grid>
        </Grid>
      </FormControl>
    </Separator>
  )
}

export default withTheme(Step2)
