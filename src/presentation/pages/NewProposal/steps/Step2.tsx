import React, { useEffect, useState, useContext } from 'react'
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
import API from '../../../../infrastructure/api'
import { StyledPaper } from './StepsStyles'
import { ProposalContext, ProposalProps } from '../context/ProposalContext'

interface Step2Props {
  theme: any
  proposalType: string
  invalidInput: boolean
  setCompleted: (completed: any) => void
  setFilled: (filled: any) => void
  modal: string
}

interface DataProps {
  origin: string
  destiny: string
  agents: string[]
  incoterm: string
  collection: string
}

const Step2 = ({ theme, proposalType, invalidInput, setCompleted, setFilled, modal }: Step2Props): JSX.Element => {
  const [incotermList, setIncotermList] = useState<any[]>([])
  const [incotermFilteredList, setIncotermFilteredList] = useState<any[]>([])
  const [originDestinationList, setOriginDestinationList] = useState<any[]>([])
  const [agentsList, setAgentsList] = useState<any[]>([])
  const [data, setData] = useState<DataProps>({
    origin: '',
    destiny: '',
    agents: [],
    incoterm: '',
    collection: ''
  })
  const { proposal, setProposal }: ProposalProps = useContext(ProposalContext)

  useEffect(() => {
    setProposal({
      ...proposal,
      idOrigin: data.origin.split(' - ')[0],
      idDestination: data.destiny.split(' - ')[0],
      idBusinessPartnerAgent: 0, // TODO vai sofrer alteracao no banco para receber array
      idIncoterm: data.incoterm,
      cargoCollectionAddress: data.collection
    })
  }, [data])

  useEffect(() => {
    void (async function () {
      await API.getIncoterm()
        .then((response) => setIncotermList(response))
        .catch((err) => console.log(err))
    })()
  }, [])

  useEffect(() => {
    void (async function () {
      await API.getOriginDestination()
        .then((response) => setOriginDestinationList(response))
        .catch((err) => console.log(err))
    })()
  }, [])

  useEffect(() => {
    const newAgentsList: any[] = []
    void (async function () {
      await API.getAgents()
        .then((response) => {
          response.forEach((agent: any) => {
            newAgentsList.push(agent?.businessPartner?.simpleName)
          })
          return (setAgentsList(newAgentsList))
        })
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
    if (
      data.origin !== '' ||
      data.destiny !== '' ||
      data.agents.length !== 0 ||
      data.incoterm !== '' ||
      data.collection !== ''
    ) {
      setFilled((currentState) => {
        return { ...currentState, step2: true }
      })
    } else {
      setFilled((currentState) => {
        return { ...currentState, step2: false }
      })
    }
  }, [data, proposalType])

  useEffect(() => {
    setData({ ...data, destiny: '', origin: '' })
  }, [modal])

  useEffect(() => {
    const airList = ['EXW', 'FCA', 'CPT', 'CIP', 'DAP', 'DPU', 'DDP']
    const seaList = ['EXW', 'FCA', 'FAS', 'FOB', 'CFR', 'CIF', 'DAP', 'DPU', 'DDP']
    const landList = ['EXW', 'DAP', 'DPU', 'DDP']
    if (incotermList.length > 0) {
      let airObject: any[] = []
      let seaObject: any[] = []
      let landObject: any[] = []

      switch (modal) {
        case 'AIR':
          airObject = incotermList.filter(incotermList => airList.includes(incotermList.id))
          setIncotermFilteredList(airObject)
          break
        case 'SEA':
          seaObject = incotermList.filter(incotermList => seaList.includes(incotermList.id))
          setIncotermFilteredList(seaObject)
          break
        case 'LAND':
          landObject = incotermList.filter(incotermList => landList.includes(incotermList.id))
          setIncotermFilteredList(landObject)
          break
      }
    }
  }, [modal, incotermList])

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

    originDestinationList?.forEach((item): void => {
      if (item.type === type) {
        actualList.push(`${String(item.id)} - ${String(item.name)}`)
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
        <Grid container spacing={5}>
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
                      $space
                    />
                  </div>
                )}
                PaperComponent={(params: any) => <StyledPaper {...params} />} />
            </Grid>)}
          <Grid item xs={2}>
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
              {incotermFilteredList.map((item) => (
                <MenuItem key={item.id} value={item.id}>
                  <SelectSpan>{item.id}</SelectSpan>
                </MenuItem>
              ))}
            </ControlledSelect>
          </Grid>
          <Grid item xs={4}>
            {(data.incoterm === 'EXW' || data.incoterm === 'FCA' || data.incoterm === 'DAP') && (
              <><FormLabel component="legend">
                {I18n.t('pages.newProposal.step2.collectionAddress')}
                {data.incoterm !== 'FCA' && <RedColorSpan> *</RedColorSpan>}
              </FormLabel><ControlledInput
                  id="description"
                  toolTipTitle={I18n.t('components.itemModal.requiredField')}
                  onChange={(e) => setData({ ...data, collection: e.target.value })}
                  invalid={
                    invalidInput && (data.incoterm !== 'FCA' && data.collection.length === 0)
                  }
                  value={data.collection.length !== 0 ? data.collection : ''}
                  variant="outlined"
                  size="small" /></>
            )}
          </Grid>
        </Grid>
      </FormControl>
    </Separator>
  )
}

export default withTheme(Step2)
