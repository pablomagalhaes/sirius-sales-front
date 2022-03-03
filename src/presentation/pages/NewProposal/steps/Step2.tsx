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
import { StyledPaper } from './StepsStyles'

// mock
const agentsList = ['agent 1', 'agent 2', 'agent 3']
interface Step2Props {
  theme: any
  proposalType: string
  invalidInput: boolean
  setCompleted: (completed: any) => void
  modal: string
}

interface DataProps {
  origin: string
  destiny: string
  agents: string[]
  incoterm: string
}

const Step2 = ({ theme, proposalType, invalidInput, setCompleted, modal }: Step2Props): JSX.Element => {
  const [incotermList, setIncotermList] = useState<any[]>([])
  const [originDestinationList, setOriginDestinationList] = useState<any[]>([])
  const [data, setData] = useState<DataProps>({
    origin: '',
    destiny: '',
    agents: [],
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

  useEffect(() => {
    setData({ ...data, destiny: '', origin: '' })
    console.log(data)
  }, [modal])

  const setOriginDestinyLabel = (type: string): string => {
    switch (modal) {
      case 'AIR':
        if (type === 'origin') {
          return String(I18n.t('pages.newProposal.step2.originAirport'))
        } else {
          return String(I18n.t('pages.newProposal.step2.destinyAirport'))
        }
      case 'SEA':
        if (type === 'origin') {
          return String(I18n.t('pages.newProposal.step2.originSeaport'))
        } else {
          return String(I18n.t('pages.newProposal.step2.destinySeaport'))
        }
      default:
        if (type === 'origin') {
          return String(I18n.t('pages.newProposal.step2.origin'))
        } else {
          return String(I18n.t('pages.newProposal.step2.destiny'))
        }
    }
  }

  const getOriginDestinyList = (): string[] => {
    const actualList: string[] = []
    let type = ''

    switch (modal) {
      case 'AIR':
        type = 'AEROPORTO'
        break
      case 'SEA':
        type = 'PORTO'
        break
      default:
        break
    }

    originDestinationList?.forEach((option): void => {
      if (option.type === type) {
        actualList.push(option.name)
      }
    })

    return actualList
  }

  return (
    <Separator>
      <Title>
        2. {I18n.t('pages.newProposal.step2.title')}
        <Subtitle>{I18n.t('pages.newProposal.step2.subtitle')}</Subtitle>
      </Title>
      <FormControl variant="outlined" size="small" className='form-size'>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <FormLabel component="legend">
              {setOriginDestinyLabel('origin')}
              <RedColorSpan> *</RedColorSpan>
            </FormLabel>
            <Autocomplete
              freeSolo
              onChange={(e, newValue) => setData({ ...data, origin: String(newValue) })}
              options={getOriginDestinyList()}
              value={data.origin}
              renderInput={(params) => (
                <div ref={params.InputProps.ref}>
                  <ControlledInput
                    {...params}
                    id="search-origin"
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
              {setOriginDestinyLabel('destiny')}
              <RedColorSpan> *</RedColorSpan>
            </FormLabel>
            <Autocomplete
              freeSolo
              onChange={(e, newValue) => setData({ ...data, destiny: String(newValue) })}
              options={getOriginDestinyList()}
              value={data.destiny}
              renderInput={(params) => (
                <div ref={params.InputProps.ref}>
                  <ControlledInput
                    {...params}
                    id="search-destiny"
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
          {proposalType === 'client' &&
            (<Grid item xs={6}>
              <FormLabel component="legend">
                {I18n.t('pages.newProposal.step2.agents')}
                {proposalType === 'client' && <RedColorSpan> *</RedColorSpan>}
              </FormLabel>
              <Autocomplete
                multiple
                size="small"
                options={agentsList}
                onChange={(e, newValue) => setData({ ...data, agents: newValue })}
                value={data.agents}
                renderInput={(params: any) => (
                  <div ref={params.InputProps.ref}>
                    <ControlledInput
                      {...params}
                      id="search-name"
                      toolTipTitle={I18n.t('components.itemModal.requiredField')}
                      value={data.agents}
                      invalid={proposalType === 'client' && invalidInput && data.agents.length === 0}
                      variant="outlined"
                      placeholder={data.agents.length === 0 && I18n.t('pages.newProposal.step2.searchAgents')}
                    />
                  </div>
                )}
                PaperComponent={(params: any) => <StyledPaper {...params} />} />
            </Grid>)}
          <Grid item xs={3}>
            <FormLabel component="legend">
              {I18n.t('pages.newProposal.step2.incoterm')}
              <RedColorSpan> *</RedColorSpan>
            </FormLabel>
            <ControlledSelect
              labelId="select-label-incoterm"
              id="incoterm"
              value={data.incoterm}
              onChange={e => setData({ ...data, incoterm: e.target.value })}
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
