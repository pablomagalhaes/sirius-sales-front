import React, { useEffect, useState, useContext, useImperativeHandle } from 'react'
import {
  FormControl,
  FormLabel,
  Grid,
  InputAdornment,
  MenuItem
} from '@material-ui/core/'
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete'
import { I18n } from 'react-redux-i18n'
import { Title, Subtitle, Separator, SelectSpan } from '../style'
import IconComponent from '../../../../application/icons/IconComponent'
import { withTheme } from 'styled-components'
import ControlledSelect from '../../../components/ControlledSelect'
import ControlledInput from '../../../components/ControlledInput'
import { RedColorSpan } from '../../../components/StyledComponents/modalStyles'
import API from '../../../../infrastructure/api'
import { ErrorText, LineSeparator, OriginDestLabel, StyledPaper } from './StepsStyles'
import { ProposalContext, ProposalProps } from '../context/ProposalContext'
import { Agent } from '../../../../domain/Agent'

interface Step2Props {
  invalidInput: boolean
  modal: string
  proposalType: string
  setAgentList: (agent: string[]) => void
  setCompleted: (completed: any) => void
  setFilled: (filled: any) => void
  theme: any
  updateAgentsIdsRef: any
}

interface AgentsProps {
  id?: number | null
  name: string
}

interface DataProps {
  agents: AgentsProps[]
  collection: string
  destCity: string
  destCountry: string
  destState: string
  destiny: string
  incoterm: string
  oriCity: string
  oriCountry: string
  oriState: string
  origin: string
}

const Step2 = ({
  invalidInput,
  modal,
  proposalType,
  setAgentList,
  setCompleted,
  setFilled,
  theme,
  updateAgentsIdsRef
}: Step2Props): JSX.Element => {
  const [agentsList, setAgentsList] = useState<any[]>([])
  const [countriesList, setCountriesList] = useState<any[]>([])
  const [destCitiesList, setDestCitiesList] = useState<any[]>([])
  const [destStatesList, setDestStatesList] = useState<any[]>([])
  const [data, setData] = useState<DataProps>({
    origin: '',
    destiny: '',
    agents: [],
    incoterm: '',
    collection: '',
    oriCountry: '',
    oriState: '',
    oriCity: '',
    destCountry: '',
    destState: '',
    destCity: ''
  })
  const [incotermFilteredList, setIncotermFilteredList] = useState<any[]>([])
  const [incotermList, setIncotermList] = useState<any[]>([])
  const [invalidOriDest, setInvalidOriDest] = useState('')
  const [loadedAgentsData, setLoadedAgentsData] = useState(false)
  const [oriCitiesList, setOriCitiesList] = useState<any[]>([])
  const [oriStatesList, setOriStatesList] = useState<any[]>([])
  const [originDestinationList, setOriginDestinationList] = useState<any[]>([])
  const [pageDidLoad, setPageDidLoad] = useState(0)

  const { proposal, setProposal }: ProposalProps = useContext(ProposalContext)

  useImperativeHandle(updateAgentsIdsRef, () => ({
    updateAgentsIdsRef () {
      let dataId = 0
      if (proposal?.idProposalImportFreight !== undefined && proposal?.idProposalImportFreight !== null) {
        const newAgentData = [...data.agents]
        for (const agents of proposal.agents) {
          newAgentData[dataId++].id = agents?.id
        }
        setData({ ...data, agents: newAgentData })
      }
    }
  }))

  const getAgentId = (agentName: string): number => {
    let id = 0
    agentsList?.forEach((item): void => {
      if (String(item.businessPartner.simpleName) === String(agentName)) {
        id = item.businessPartner.id
      }
    })
    return id
  }

  useEffect(() => {
    void getOriginDestinationListByModal(modal)
    setData({
      ...data,
      destCity: '',
      destCountry: '',
      destState: '',
      destiny: '',
      oriCity: '',
      oriCountry: '',
      oriState: '',
      origin: ''
    })
  }, [modal])

  const getAgent = async (id: number): Promise<void> => {
    return await new Promise(resolve => {
      API.getBusinessPartnerCostumer(id)
        .then((response) => { resolve(response.simpleName) })
        .catch((err) => { console.log(err); resolve() })
    })
  }

  const loadAllAgents = async (agentList: Agent[]): Promise<AgentsProps[]> => {
    const newAgentsList: AgentsProps[] = []
    for (const agent of agentList) {
      await getAgent(Number(agent.idBusinessPartnerAgent)).then((response) => {
        newAgentsList.push({ name: String(response), id: agent.id })
      })
    }
    return newAgentsList
  }

  useEffect(() => {
    if (proposalType === 'client' && loadedAgentsData) {
      setAgentList(data.agents.map((item) => item.name))
    }
  }, [data.agents, agentsList])

  useEffect(() => {
    void (async function () {
      await API.getIncoterms()
        .then((response) => setIncotermList(response))
        .catch((err) => console.log(err))
    })()

    void (async function () {
      await API.getAgents()
        .then((agent) => setAgentsList(agent))
        .catch((err) => console.log(err))
    })()

    void (async function () {
      await API.getCountries()
        .then((response) => setCountriesList(response))
        .catch((err) => console.log(err))
    })()

    if (proposal.idProposal !== undefined && proposal.idProposal !== null) {
      const getOrigin = new Promise((resolve) => {
        if (modal === 'LAND') {
          API.getCityById(proposal.idOrigin)
            .then((response) => resolve(response))
            .catch((err) => console.log(err))
        } else {
          API.getOriginDestinationById(proposal.idOrigin)
            .then((response) => resolve(`${String(response?.id)} - ${String(response?.name)}`))
            .catch((err) => console.log(err))
        }
      })

      const getDestiny = new Promise((resolve) => {
        if (modal === 'LAND') {
          API.getCityById(proposal.idDestination)
            .then((response) => resolve(response))
            .catch((err) => console.log(err))
        } else {
          API.getOriginDestinationById(proposal.idDestination)
            .then((response) => resolve(`${String(response?.id)} - ${String(response?.name)}`))
            .catch((err) => console.log(err))
        }
      })

      void loadAllAgents(proposal.agents).then((agentsList) => {
        void Promise.all([getOrigin, getDestiny]).then((values: any[]) => {
          setData({
            agents: agentsList,
            collection: proposal.cargoCollectionAddress,
            destCity: modal === 'LAND' ? String(values[1]?.name) : '',
            destCountry: modal === 'LAND' ? String(values[1]?.state?.country?.name) : '',
            destState: modal === 'LAND' ? String(values[1]?.state?.initials) : '',
            destiny: modal !== 'LAND' ? String(values[1]) : '',
            incoterm: proposal.idIncoterm,
            oriCity: modal === 'LAND' ? String(values[0]?.name) : '',
            oriCountry: modal === 'LAND' ? String(values[0]?.state?.country?.name) : '',
            oriState: modal === 'LAND' ? String(values[0]?.state?.initials) : '',
            origin: modal !== 'LAND' ? String(values[0]) : ''
          })
          loadStatesList('origin', String(values[0]?.state?.country?.id))
          loadStatesList('destiny', String(values[1]?.state?.country?.id))
          loadCitiesList('origin', String(values[0]?.state?.id))
          loadCitiesList('destiny', String(values[1]?.state?.id))
          setLoadedAgentsData(true)
        })
      })
    } else {
      setLoadedAgentsData(true)
    }
  }, [])

  useEffect(() => {
    const newAgent: Agent[] = []
    if (loadedAgentsData) {
      data.agents.forEach((row) => {
        newAgent.push({
          id: (row.id === undefined || row.id === null) ? undefined : row.id,
          idBusinessPartnerAgent: getAgentId(row.name),
          proposalImportFreightId: (row.id === undefined || row.id === null) ? undefined : proposal?.idProposalImportFreight
        })
      })
    }
    setProposal({
      ...proposal,
      idOrigin: modal === 'LAND'
        ? String(oriCitiesList.filter((city) => city.name === data.oriCity)[0]?.id)
        : data.origin.split(' - ')[0],
      idDestination: modal === 'LAND'
        ? String(destCitiesList.filter((city) => city.name === data.destCity)[0]?.id)
        : data.destiny.split(' - ')[0],
      idIncoterm: data.incoterm,
      cargoCollectionAddress: data.collection,
      agents: newAgent.length > 0 ? newAgent : proposal.agents
    })
  }, [data])

  useEffect(() => {
    if (originDestinyFullfilled() && ((proposalType === 'client' && data.agents.length !== 0) || proposalType !== 'client') && data.incoterm.length !== 0) {
      setCompleted((currentState) => {
        return { ...currentState, step2: true }
      })
    } else {
      setCompleted((currentState) => {
        return { ...currentState, step2: false }
      })
    }
    if (originDestinyFullfilled() && (data.agents.length !== 0 || data.incoterm !== '' || data.collection !== '')) {
      setFilled((currentState) => {
        return { ...currentState, step2: true }
      })
    } else {
      setFilled((currentState) => {
        return { ...currentState, step2: false }
      })
    }
  }, [data, proposalType, invalidOriDest])

  const originDestinyFullfilled = (): boolean => {
    return ((modal === 'LAND' &&
      data.oriCity !== '' &&
      data.oriState !== '' &&
      data.oriCountry !== '' &&
      data.destCity !== '' &&
      data.destState !== '' &&
      data.destCountry !== '' &&
      invalidOriDest === '') ||
      (modal !== 'LAND' &&
        data.origin !== '' &&
        data.destiny !== ''))
  }

  const getOriginDestinationListByModal = async (modal: string): Promise<void> => {
    if (modal?.length > 0) {
      if (modal === 'LAND') {
        setOriginDestinationList([])
      } else {
        await API.getOriginDestinationByModal(modal)
          .then((response) => setOriginDestinationList(response))
          .catch((err) => console.log(err))
      }
    }
  }

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

  useEffect(() => {
    if (pageDidLoad > 1) {
      setData({ ...data, oriState: '', oriCity: '' })
    }
    if (data.oriCountry !== '' && data.oriCountry !== null) {
      loadStatesList('origin')
    } else {
      setOriStatesList([])
      setOriCitiesList([])
    }
  }, [data.oriCountry])

  useEffect(() => {
    if (pageDidLoad > 1) {
      setData({ ...data, oriCity: '' })
    }
    if (data.oriState !== '' && data.oriState !== null) {
      loadCitiesList('origin')
    } else {
      setOriCitiesList([])
    }
  }, [data.oriState])

  useEffect(() => {
    if (pageDidLoad > 1) {
      setData({ ...data, destState: '', destCity: '' })
    }
    if (data.destCountry !== '' && data.destCountry !== null) {
      loadStatesList('destiny')
    } else {
      setDestStatesList([])
      setDestCitiesList([])
    }
  }, [data.destCountry])

  useEffect(() => {
    if (pageDidLoad > 1) {
      setData({ ...data, destCity: '' })
    } else if (proposal.idProposal !== undefined && proposal.idProposal !== null) {
      setPageDidLoad(prev => prev + 1)
    } else {
      setPageDidLoad(prev => prev + 2)
    }
    if (data.destState !== '' && data.destState !== null) {
      loadCitiesList('destiny')
    } else {
      setDestCitiesList([])
    }
  }, [data.destState])

  useEffect(() => {
    if (data.oriCity === data.destCity && data.oriCity.length > 0 && data.destCity.length > 0) {
      setInvalidOriDest('oriCity')
    } else if (data.origin === data.destiny && data.origin.length > 0 && data.destiny.length > 0) {
      setInvalidOriDest('origin')
    } else {
      setInvalidOriDest('')
    }
  }, [data.oriCity, data.origin])

  useEffect(() => {
    if (data.oriCity === data.destCity && data.oriCity.length > 0 && data.destCity.length > 0) {
      setInvalidOriDest('destCity')
    } else if (data.origin === data.destiny && data.origin.length > 0 && data.destiny.length > 0) {
      setInvalidOriDest('destiny')
    } else {
      setInvalidOriDest('')
    }
  }, [data.destCity, data.destiny])

  const loadStatesList = (departure: string, countryLoadedId?: string): void => {
    const selectedCountry = departure === 'origin' ? data.oriCountry : data.destCountry
    const setStateList = departure === 'origin' ? setOriStatesList : setDestStatesList
    const countryId = countryLoadedId === undefined
      ? (countriesList?.filter((country) => country.name === selectedCountry)[0]?.id)
      : countryLoadedId
    if (countryId !== undefined && modal === 'LAND') {
      void (async function () {
        await API.getStates(countryId)
          .then((response) => { response !== 'error' ? setStateList(response) : setStateList([]) })
          .catch((err) => {
            console.log(err)
          })
      })()
    }
  }

  const loadCitiesList = (departure: string, stateLoadedId?: string): void => {
    const selectedState = departure === 'origin' ? data.oriState : data.destState
    const statesList = departure === 'origin' ? oriStatesList : destStatesList
    const setStateList = departure === 'origin' ? setOriCitiesList : setDestCitiesList
    const stateId = stateLoadedId === undefined
      ? (statesList?.filter((state) => state.initials === selectedState)[0]?.id)
      : stateLoadedId
    if (stateId !== undefined && modal === 'LAND') {
      void (async function () {
        await API.getCities(stateId)
          .then((response) => { response !== 'error' ? setStateList(response) : setStateList([]) })
          .catch((err) => {
            console.log(err)
          })
      })()
    }
  }

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

  const filterOptions = createFilterOptions({
    matchFrom: 'any',
    limit: 500
  })

  const fillAgentsList = (list: string[]): void => {
    if (list.length > data.agents.length) {
      const addedAgent = list.filter((item) => !data.agents.map((agent) => agent.name).includes(item))
      setData({ ...data, agents: [...data.agents].concat(addedAgent.map((item) => ({ name: item, id: null }))) })
    } else {
      const newAgentsList = data.agents.filter((item) => list.includes(item.name))
      setData({ ...data, agents: newAgentsList })
    }
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
              <OriginDestLabel isLand={modal === 'LAND'}>
                {setOriginDestinyLabel('origin')}
              </OriginDestLabel>
              {modal !== 'LAND' && <RedColorSpan> *</RedColorSpan>}
            </FormLabel>
            {modal === 'LAND'
              ? <Grid container spacing={2}>
                <Grid item xs={5}>
                  <FormLabel component='legend'>
                    {I18n.t('pages.newProposal.step2.country')}
                    <RedColorSpan> *</RedColorSpan>
                  </FormLabel>
                  <Autocomplete
                    onChange={(e, newValue) => setData({ ...data, oriCountry: String(newValue ?? '') })}
                    options={['', ...countriesList.map((country) => (country.name))]}
                    value={data.oriCountry}
                    filterOptions={filterOptions}
                    filterSelectedOptions
                    renderInput={(params) => (
                      <div ref={params.InputProps.ref}>
                        <ControlledInput
                          {...params}
                          id="search-country"
                          toolTipTitle={I18n.t('components.itemModal.requiredField')}
                          invalid={invalidInput && data.oriCountry.length === 0}
                          variant="outlined"
                          size="small"
                          placeholder={I18n.t('pages.newProposal.step2.choose')}
                        />
                      </div>
                    )}
                    PaperComponent={(params: any) => <StyledPaper {...params} />}
                  />
                  <LineSeparator />
                </Grid>
                <Grid item xs={2}>
                  <FormLabel component='legend'>
                    {I18n.t('pages.newProposal.step2.state')}
                    <RedColorSpan> *</RedColorSpan>
                  </FormLabel>
                  <Autocomplete
                    onChange={(e, newValue) => setData({ ...data, oriState: String(newValue ?? '') })}
                    options={['', ...oriStatesList?.map((state) => state.initials)]}
                    value={data.oriState}
                    filterOptions={filterOptions}
                    filterSelectedOptions
                    disabled={data.oriCountry === '' ||
                      data.oriCountry === null}
                    closeIcon={null}
                    renderInput={(params) => (
                      <div ref={params.InputProps.ref}>
                        <ControlledInput
                          {...params}
                          id="search-state"
                          toolTipTitle={I18n.t('components.itemModal.requiredField')}
                          invalid={invalidInput && data.oriState.length === 0}
                          variant="outlined"
                          size="small"
                          placeholder={I18n.t('pages.newProposal.step2.choose')}
                        />
                      </div>
                    )}
                    PaperComponent={(params: any) => <StyledPaper {...params} />}
                  />
                </Grid>
                <Grid item xs={5}>
                  <FormLabel component='legend'>
                    {I18n.t('pages.newProposal.step2.city')}
                    <RedColorSpan> *</RedColorSpan>
                  </FormLabel>
                  <Autocomplete
                    onChange={(e, newValue) => setData({ ...data, oriCity: String(newValue ?? '') })}
                    options={['', ...oriCitiesList?.map((city) => (city.name))]}
                    value={data.oriCity}
                    filterOptions={filterOptions}
                    filterSelectedOptions
                    disabled={data.oriState === '' ||
                      data.oriState === null}
                    renderInput={(params) => (
                      <div ref={params.InputProps.ref}>
                        <ControlledInput
                          {...params}
                          id="search-city"
                          toolTipTitle={invalidInput ? I18n.t('components.itemModal.requiredField') : ''}
                          invalid={(invalidInput && data.destCity.length === 0) || (invalidOriDest === 'oriCity')}
                          variant="outlined"
                          size="small"
                          placeholder={I18n.t('pages.newProposal.step2.choose')}
                        />
                      </div>
                    )}
                    PaperComponent={(params: any) => <StyledPaper {...params} />}
                  />
                  {(invalidOriDest === 'oriCity') &&
                    <ErrorText>{I18n.t('pages.newProposal.step2.differentLocationsOrigin')}</ErrorText>}
                </Grid>
              </Grid>
              : (
                <>
                  <Autocomplete
                    freeSolo
                    onChange={(e, newValue) => setData({ ...data, origin: String(newValue ?? '') })}
                    options={getOriginDestinyList()}
                    filterOptions={filterOptions}
                    value={data.origin}
                    disabled={modal === '' || modal === null}
                    renderInput={(params) => (
                      <div ref={params.InputProps.ref}>
                        <ControlledInput
                          {...params}
                          id="search-origin"
                          toolTipTitle={invalidInput ? I18n.t('components.itemModal.requiredField') : ''}
                          invalid={(invalidInput && data.origin.length === 0) || invalidOriDest === 'origin'}
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
                  {(invalidOriDest === 'origin')
                    ? <ErrorText>{I18n.t('pages.newProposal.step2.differentLocationsOrigin')}</ErrorText>
                    : <LineSeparator />}
                </>
                )
            }
          </Grid>
          <Grid item xs={6}>
            <FormLabel component="legend">
              <OriginDestLabel isLand={modal === 'LAND'}>
                {setOriginDestinyLabel('destiny')}
              </OriginDestLabel>
              {modal !== 'LAND' && <RedColorSpan> *</RedColorSpan>}
            </FormLabel>
            {modal === 'LAND'
              ? <Grid container spacing={2}>
                <Grid item xs={5}>
                  <FormLabel component='legend'>
                    {I18n.t('pages.newProposal.step2.country')}
                    <RedColorSpan> *</RedColorSpan>
                  </FormLabel>
                  <Autocomplete
                    onChange={(e, newValue) => setData({ ...data, destCountry: String(newValue ?? '') })}
                    options={['', ...countriesList.map((country) => (country.name))]}
                    value={data.destCountry}
                    filterOptions={filterOptions}
                    filterSelectedOptions
                    renderInput={(params) => (
                      <div ref={params.InputProps.ref}>
                        <ControlledInput
                          {...params}
                          id="search-country"
                          toolTipTitle={I18n.t('components.itemModal.requiredField')}
                          invalid={invalidInput && data.destCountry.length === 0}
                          variant="outlined"
                          size="small"
                          placeholder={I18n.t('pages.newProposal.step2.choose')}
                        />
                      </div>
                    )}
                    PaperComponent={(params: any) => <StyledPaper {...params} />}
                  />
                </Grid>
                <Grid item xs={2}>
                  <FormLabel component='legend'>
                    {I18n.t('pages.newProposal.step2.state')}
                    <RedColorSpan> *</RedColorSpan>
                  </FormLabel>
                  <Autocomplete
                    onChange={(e, newValue) => setData({ ...data, destState: String(newValue ?? '') })}
                    options={['', ...destStatesList?.map((state) => state.initials)]}
                    value={data.destState}
                    filterOptions={filterOptions}
                    filterSelectedOptions
                    disabled={data.destCountry === '' ||
                      data.destCountry === null}
                    closeIcon={null}
                    renderInput={(params) => (
                      <div ref={params.InputProps.ref}>
                        <ControlledInput
                          {...params}
                          id="search-state"
                          toolTipTitle={I18n.t('components.itemModal.requiredField')}
                          invalid={invalidInput && data.destState.length === 0}
                          variant="outlined"
                          size="small"
                          placeholder={I18n.t('pages.newProposal.step2.choose')}
                        />
                      </div>
                    )}
                    PaperComponent={(params: any) => <StyledPaper {...params} />}
                  />
                </Grid>
                <Grid item xs={5}>
                  <FormLabel component='legend'>
                    {I18n.t('pages.newProposal.step2.city')}
                    <RedColorSpan> *</RedColorSpan>
                  </FormLabel>
                  <Autocomplete
                    onChange={(e, newValue) => setData({ ...data, destCity: String(newValue ?? '') })}
                    value={data.destCity}
                    options={['', ...destCitiesList?.map((city) => (city.name))]}
                    filterOptions={filterOptions}
                    filterSelectedOptions
                    disabled={data.destState === '' ||
                      data.destState === null}
                    renderInput={(params) => (
                      <div ref={params.InputProps.ref}>
                        <ControlledInput
                          {...params}
                          id="search-city"
                          toolTipTitle={invalidInput ? I18n.t('components.itemModal.requiredField') : ''}
                          invalid={(invalidInput && data.destCity.length === 0) || (invalidOriDest === 'destCity')}
                          variant="outlined"
                          size="small"
                          placeholder={I18n.t('pages.newProposal.step2.choose')}
                        />
                      </div>
                    )}
                    PaperComponent={(params: any) => <StyledPaper {...params} />}
                  />
                  {(invalidOriDest === 'destCity') &&
                    <ErrorText>{I18n.t('pages.newProposal.step2.differentLocationsDestiny')}</ErrorText>}
                </Grid>
              </Grid>
              : (<><Autocomplete
                freeSolo
                onChange={(e, newValue) => setData({ ...data, destiny: String(newValue ?? '') })}
                options={getOriginDestinyList()}
                filterOptions={filterOptions}
                value={data.destiny}
                disabled={modal === '' || modal === null}
                renderInput={(params) => (
                  <div ref={params.InputProps.ref}>
                    <ControlledInput
                      {...params}
                      id="search-destiny"
                      toolTipTitle={invalidInput ? I18n.t('components.itemModal.requiredField') : ''}
                      invalid={(invalidInput && data.destiny.length === 0) || (invalidOriDest === 'destiny')}
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
                {(invalidOriDest === 'destiny')
                  ? <ErrorText>{I18n.t('pages.newProposal.step2.differentLocationsDestiny')}</ErrorText>
                  : <LineSeparator />}
              </>
                )
            }
          </Grid>
          {(proposalType === 'client' && loadedAgentsData) &&
            (<Grid item xs={6}>
              <FormLabel component="legend">
                {I18n.t('pages.newProposal.step2.agents')}
                {proposalType === 'client' && <RedColorSpan> *</RedColorSpan>}
              </FormLabel>
              <Autocomplete
                multiple
                size="small"
                options={agentsList.map((item) => item.businessPartner.simpleName)}
                onChange={(e, newValue) => fillAgentsList(newValue)}
                value={data.agents.map((item) => item.name)}
                renderInput={(params: any) => (
                  <div ref={params.InputProps.ref}>
                    <ControlledInput
                      {...params}
                      id="search-name"
                      toolTipTitle={I18n.t('components.itemModal.requiredField')}
                      value={data.agents.map((item) => item.name)}
                      invalid={proposalType === 'client' && invalidInput && data.agents.length === 0}
                      variant="outlined"
                      placeholder={data.agents.length === 0 && I18n.t('pages.newProposal.step2.searchAgents')}
                      $space
                    />
                  </div>
                )}
                PaperComponent={(params: any) => <StyledPaper {...params} />}
              />
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
              disabled={modal === '' || modal === null}
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
