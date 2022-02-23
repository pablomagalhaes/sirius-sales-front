import React, { useEffect, useState } from 'react'
import {
  FormControl,
  FormLabel,
  Grid,
  InputAdornment,
  MenuItem
} from '@material-ui/core/'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { I18n } from 'react-redux-i18n'
import { Title, Subtitle, Separator, SelectSpan } from '../style'
import IconComponent from '../../../../application/icons/IconComponent'
import { withTheme } from 'styled-components'
import ControlledSelect from '../../../components/ControlledSelect'
import ControlledInput from '../../../components/ControlledInput'
import { RedColorSpan } from '../../../components/StyledComponents/modalStyles'
import newProposal from '../../../../infrastructure/api/newProposalService'

interface Step2Props {
  theme: any
  proposalType: string
  invalidInput: boolean
  setCompleted: (completed: any) => void
}

const Step2 = ({ theme, proposalType, invalidInput, setCompleted }: Step2Props): JSX.Element => {
  const [incotermList, setIncotermList] = useState<any[]>([])
  const [originDestinationList, setOriginDestinationList] = useState<any[]>([])
  const [data, setData] = useState({
    origin: '',
    destiny: '',
    agents: '',
    incoterm: ''
  })

  useEffect(() => {
    void (async function () {
      await newProposal.getIncoterm()
        .then((response) => setIncotermList(response))
        .catch((err) => console.log(err))
    })()
  }, [])

  useEffect(() => {
    void (async function () {
      await newProposal.getOriginDestination()
        .then((response) => setOriginDestinationList(response))
        .catch((err) => console.log(err))
    })()
  }, [])

  useEffect(() => {
    if (
      data.origin.length !== 0 &&
      data.destiny.length !== 0 &&
      ((proposalType === 'client' && data.agents.length !== 0) ||
        proposalType !== 'client') &&
      data.incoterm.length !== 0
    ) {
      setCompleted((currentState) => {
        return { ...currentState, step2: true }
      })
    } else {
      setCompleted((currentState) => {
        return { ...currentState, step2: false }
      })
    }
  }, [data, proposalType])

  return (
    <Separator>
      <Title>
        2. {I18n.t('pages.newProposal.step2.title')}
        <Subtitle>{I18n.t('pages.newProposal.step2.subtitle')}</Subtitle>
      </Title>
      <FormControl variant="outlined" size="small">
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <FormLabel component="legend">
              {I18n.t('pages.newProposal.step2.origin')}
              <RedColorSpan> *</RedColorSpan>
            </FormLabel>
            <Autocomplete
              freeSolo
              onChange={(e, newValue) => setData({ ...data, origin: newValue })}
              options={originDestinationList.map((option) => option.name)}
              renderInput={(params) => (
                <div ref={params.InputProps.ref}>
                  <ControlledInput
                    {...params}
                    id="search-origin"
                    value={data.origin}
                    toolTipTitle={I18n.t('components.itemModal.requiredField')}
                    invalid={invalidInput && data.origin.length === 0}
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
                </div>
              )}
            />
          </Grid>
          <Grid item xs={6}>
            <FormLabel component="legend">
              {I18n.t('pages.newProposal.step2.destiny')}
              <RedColorSpan> *</RedColorSpan>
            </FormLabel>
            <Autocomplete
              freeSolo
              onChange={(e, newValue) => setData({ ...data, destiny: newValue })}
              options={originDestinationList.map((option) => option.name)}
              renderInput={(params) => (
                <div ref={params.InputProps.ref}>
                  <ControlledInput
                    {...params}
                    id="search-destiny"
                    value={data.destiny}
                    toolTipTitle={I18n.t('components.itemModal.requiredField')}
                    invalid={invalidInput && data.destiny.length === 0}
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
                </div>
              )}
            />
          </Grid>
          <Grid item xs={6}>
            <FormLabel component="legend">
              {I18n.t('pages.newProposal.step2.agents')}
              {proposalType === 'client' && <RedColorSpan> *</RedColorSpan>}
            </FormLabel>
            <ControlledInput
              id="search-name"
              toolTipTitle={I18n.t('components.itemModal.requiredField')}
              invalid={proposalType === 'client' && invalidInput && data.agents.length === 0}
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
            <FormLabel component="legend">
              {I18n.t('pages.newProposal.step2.incoterm')}
              <RedColorSpan> *</RedColorSpan>
            </FormLabel>
            <ControlledSelect
              labelId="select-label-incoterm"
              id="incoterm"
              value={data.incoterm}
              onChange={e => setData({ ...data, incoterm: e.target.value }) }
              displayEmpty
              disableUnderline
              invalid={invalidInput && data.incoterm.length === 0}
              toolTipTitle={I18n.t('components.itemModal.requiredField')}
            >
              <MenuItem disabled value={data.incoterm}>
                <SelectSpan placeholder={1}>{I18n.t('pages.newProposal.step2.choose')}</SelectSpan>
              </MenuItem>
              {incotermList.map((item) => (
                <MenuItem key={item.id} value={item.id}>
                  <SelectSpan>{item.id}</SelectSpan>
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
