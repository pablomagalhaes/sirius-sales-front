import React, {
  useEffect,
  useState,
  useContext,
  useImperativeHandle,
  Fragment
} from 'react'
import {
  FormControl,
  FormLabel,
  Grid,
  InputAdornment,
  MenuItem
} from '@material-ui/core/'
import Autocomplete, {
  createFilterOptions
} from '@material-ui/lab/Autocomplete'
import { I18n } from 'react-redux-i18n'
import {
  Title,
  Subtitle,
  Separator,
  SelectSpan,
  AddAgentButtonWrapper
} from '../style'
import IconComponent from '../../../../application/icons/IconComponent'
import { withTheme } from 'styled-components'
import ControlledSelect from '../../../components/ControlledSelect'
import ControlledInput from '../../../components/ControlledInput'
import { RedColorSpan } from '../../../components/StyledComponents/modalStyles'
import API from '../../../../infrastructure/api'
import {
  ErrorText,
  LineSeparator,
  OriginDestLabel,
  StyledPaper
} from './StepsStyles'
import { ProposalContext, ProposalProps } from '../../NewProposal/context/ProposalContext'
import { Button } from 'fiorde-fe-components'
import AgentDeleteModal from '../../../components/AgentDeleteModal'
import { ModalTypes, ProfitsPercentsTypes, IncotermTypes, ProposalTypes } from '../../../../application/enum/enum'

interface Step2Props {
  invalidInput: boolean
  modal: string
  proposalType: string
  setAgentList: (agent: Agents[]) => void
  setCompleted: (completed: any) => void
  setFilled: (filled: any) => void
  theme: any
  updateAgentsIdsRef: any
}

interface DataProps {
  collection: string
  collectionDap: string
  destCity: string
  destCountry: string
  destState: string
  destiny: string
  incoterm: string
  oriCity: string
  oriCountry: string
  oriState: string
  origin: string
  originCityName: string
  originCityId: string
  destinationCityName: string
  destinationCityId: string
  idOrigin: string
  idDestination: string
  postalCodeDap: string
  postalCode: string
}

export interface Agents {
  id?: number | null
  idProposalAgent?: number | null
  agent: string
  idBusinessPartnerAgent?: number | null
  shippingCompany: string
  idBusinessPartnerTransportCompany?: number | null
  profitPercentageAgent?: number | null
}

const initialProfitValues = [
  ProfitsPercentsTypes.Zero,
  ProfitsPercentsTypes.Ten,
  ProfitsPercentsTypes.Twenty,
  ProfitsPercentsTypes.Thirty,
  ProfitsPercentsTypes.Forty,
  ProfitsPercentsTypes.Fifty
]

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
  const [businessPartnerList, setBusinessPartnerList] = useState<any[]>([])
  const [countriesList, setCountriesList] = useState<any[]>([])
  const [destCitiesList, setDestCitiesList] = useState<any[]>([])
  const [destStatesList, setDestStatesList] = useState<any[]>([])
  const [data, setData] = useState<DataProps>({
    origin: '',
    destiny: '',
    incoterm: '',
    collection: '',
    collectionDap: '',
    oriCountry: '',
    oriState: '',
    oriCity: '',
    destCountry: '',
    destState: '',
    destCity: '',
    originCityName: '',
    originCityId: '',
    destinationCityName: '',
    destinationCityId: '',
    idOrigin: '',
    idDestination: '',
    postalCodeDap: '',
    postalCode: ''
  })
  const [incotermFilteredList, setIncotermFilteredList] = useState<any[]>([])
  const [incotermList, setIncotermList] = useState<any[]>([])
  const [invalidOriDest, setInvalidOriDest] = useState('')
  const [loadedAgentsData, setLoadedAgentsData] = useState(false)
  const [invalidAgent, setInvalidAgent] = useState(false)
  const [oriCitiesList, setOriCitiesList] = useState<any[]>([])
  const [oriStatesList, setOriStatesList] = useState<any[]>([])
  const [originDestinationList, setOriginDestinationList] = useState<any[]>([])
  const [pageDidLoad, setPageDidLoad] = useState(0)
  const [selectedAgents, setSelectedAgents] = useState<Agents[]>([
    {
      id: null,
      idProposalAgent: null,
      agent: '',
      idBusinessPartnerAgent: null,
      shippingCompany: '',
      idBusinessPartnerTransportCompany: null,
      profitPercentageAgent: null
    }
  ])

  const [profitsList] = useState(initialProfitValues)
  const { proposal, setProposal }: ProposalProps = useContext(ProposalContext)

  useImperativeHandle(updateAgentsIdsRef, () => ({
    updateAgentsIdsRef () {
      setSelectedAgents(
        selectedAgents.map((agent, index) => {
          return { ...agent, idProposalAgent: proposal.agents[index].idProposalAgent }
        })
      )
    }
  }))

  const removeAgent = (indexRemove: number): void => {
    setSelectedAgents(
      selectedAgents.filter((_value, index) => index !== indexRemove)
    )
  }

  const getidBusinessPartnerAgent = (agentName: string): number | undefined => {
    let id
    if (agentName !== '') {
      agentsList?.forEach((item): void => {
        if (String(item.businessPartner.simpleName) === String(agentName)) {
          id = item.businessPartner.id
        }
      })
    }
    return id
  }

  const getShippingCompanyId = (
    shippingCompanyName: string
  ): number | undefined => {
    let id
    if (shippingCompanyName !== '') {
      businessPartnerList?.forEach((item): void => {
        if (
          String(item.businessPartner.simpleName) ===
          String(shippingCompanyName)
        ) {
          id = item.businessPartner.id
        }
      })
    }
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
      origin: '',
      incoterm: '',
      collection: '',
      collectionDap: '',
      postalCodeDap: '',
      postalCode: ''
    })
    setSelectedAgents([
      {
        id: null,
        idProposalAgent: null,
        agent: '',
        idBusinessPartnerAgent: null,
        shippingCompany: '',
        idBusinessPartnerTransportCompany: null,
        profitPercentageAgent: null
      }
    ])
    if (modal !== '') {
      if (modal === 'SEA') {
        void getBusinessPartnerSea()
      } else {
        void getBusinessPartner(getBusinessPartnerType())
      }
    }
  }, [modal])

  const getBusinessPartner = async (type: string): Promise<any> => {
    const response = await API.getBusinessPartnerByType(type)
    if (response !== undefined) {
      setBusinessPartnerList([...response])
    }
  }

  const getBusinessPartnerSea = async (): Promise<any> => {
    const responseShipOwner = await API.getBusinessPartnerByType('ARMADOR')
    const responseColoader = await API.getBusinessPartnerByType('COLOADER')
    if (responseShipOwner !== undefined && responseColoader !== undefined) {
      setBusinessPartnerList([...responseColoader, ...responseShipOwner])
    }
  }

  const getBusinessPartnerType = (): string => {
    switch (modal) {
      case 'AIR':
        return 'CIA. AEREA'
      case 'LAND':
        return 'TRANS. INTERNACIONAL'
    }
    return ''
  }

  useEffect(() => {
    if (loadedAgentsData) {
      setAgentList(selectedAgents)
    }
  }, [selectedAgents, agentsList, loadedAgentsData])

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
          API.getCityById(proposal.originDestiny[0].originCityId)
            .then((response) => resolve(response))
            .catch((err) => console.log(err))
        } else {
          API.getOriginDestinationById(proposal.originDestiny[0].idOrigin)
            .then((response) =>
              resolve(`${String(response?.id)} - ${String(response?.name)}`)
            )
            .catch((err) => console.log(err))
        }
      })

      const getDestiny = new Promise((resolve) => {
        if (modal === 'LAND') {
          API.getCityById(proposal.originDestiny[0].destinationCityId)
            .then((response) => resolve(response))
            .catch((err) => console.log(err))
        } else {
          API.getOriginDestinationById(proposal.originDestiny[0].idDestination)
            .then((response) =>
              resolve(`${String(response?.id)} - ${String(response?.name)}`)
            )
            .catch((err) => console.log(err))
        }
      })

      void Promise.all([getOrigin, getDestiny]).then((values: any[]) => {
        setData({
          collection: proposal.cargoCollectionAddress,
          collectionDap: proposal.cargoDeliveryAddress,
          destCity: modal === ModalTypes.Land ? String(values[1]?.name) : '',
          destCountry:
            modal === ModalTypes.Land ? String(values[1]?.state?.country?.name) : '',
          destState: modal === ModalTypes.Land ? String(values[1]?.state?.name) : '',
          destiny: modal !== ModalTypes.Land ? String(values[1]) : '',
          incoterm: proposal.idIncoterm,
          oriCity: modal === ModalTypes.Land ? String(values[0]?.name) : '',
          oriCountry:
            modal === ModalTypes.Land ? String(values[0]?.state?.country?.name) : '',
          oriState: modal === ModalTypes.Land ? String(values[0]?.state?.name) : '',
          origin: modal !== ModalTypes.Land ? String(values[0]) : '',
          originCityName: modal === ModalTypes.Land ? String(values[0]?.name) : '',
          originCityId: modal === ModalTypes.Land ? values[0]?.state?.id : null,
          destinationCityName: modal === ModalTypes.Land ? String(values[1]?.name) : '',
          destinationCityId: modal === ModalTypes.Land ? values[1]?.state?.id : null,
          idOrigin: modal !== ModalTypes.Land ? String(values[1]?.state?.id) : '',
          idDestination: modal !== ModalTypes.Land ? String(values[1]?.state?.id) : '',
          postalCodeDap: proposal.cepCargoDeliveryAddress,
          postalCode: proposal.cepCargoCollectionAddress
        })
        loadStatesList('origin', String(values[0]?.state?.country?.id))
        loadStatesList('destiny', String(values[1]?.state?.country?.id))
        loadCitiesList('origin', String(values[0]?.state?.id))
        loadCitiesList('destiny', String(values[1]?.state?.id))
        setLoadedAgentsData(true)
      })
    } else {
      setLoadedAgentsData(true)
    }
  }, [])

  const getAgentById = (idProposalAgent: number | null | undefined): string => {
    if (idProposalAgent !== null && idProposalAgent !== undefined) {
      const agent = agentsList.find((agent) => agent.businessPartner.id === idProposalAgent)
      if (agent !== undefined) {
        return agent.businessPartner.simpleName
      }
    }
    return ''
  }

  const getBusinessPartnerById = (id: number | null | undefined): string => {
    if (id !== null && id !== undefined) {
      const businessPartner = businessPartnerList.find(
        (businessPartner) => businessPartner.businessPartner.id === id
      )
      if (businessPartner !== undefined) {
        return businessPartner.businessPartner.simpleName
      }
    }
    return ''
  }

  useEffect(() => {
    if (proposal.agents.length > 0) {
      setSelectedAgents(
        proposal.agents.map((agent, index) => {
          return {
            idProposalAgent: agent.idProposalAgent,
            idBusinessPartnerAgent: agent.idBusinessPartnerAgent,
            shippingCompany: getBusinessPartnerById(agent.idBusinessPartnerTransportCompany),
            agent: getAgentById(agent.idBusinessPartnerAgent),
            idBusinessPartnerTransportCompany: agent.idBusinessPartnerTransportCompany,
            profitPercentageAgent: agent.profitPercentageAgent
          }
        })
      )
    }
  }, [agentsList, businessPartnerList])

  useEffect(() => {
    if (modal === 'LAND') {
      setProposal({
        ...proposal,
        originDestiny:
          [
            {
              originCityId: oriCitiesList.filter((city) => city.name === data.oriCity)[0]?.id,
              destinationCityId: destCitiesList.filter((city) => city.name === data.destCity)[0]?.id
            }
          ],
        idIncoterm: data.incoterm,
        cargoCollectionAddress: data.collection,
        cargoDeliveryAddress: data.collectionDap,
        cepCargoCollectionAddress: data.postalCode,
        cepCargoDeliveryAddress: data.postalCodeDap
      })
    } else {
      setProposal({
        ...proposal,
        originDestiny:
        [
          {
            idOrigin: data.origin.split(' - ')[0],
            idDestination: data.destiny.split(' - ')[0]
          }
        ],
        idIncoterm: data.incoterm,
        cargoCollectionAddress: data.collection,
        cargoDeliveryAddress: data.collectionDap,
        cepCargoCollectionAddress: data.postalCode,
        cepCargoDeliveryAddress: data.postalCodeDap
      })
    }
  }, [data, oriCitiesList, destCitiesList])

  useEffect(() => {
    setProposal({
      ...proposal,
      agents: selectedAgents.map(
        ({ shippingCompany, agent, ...otherProperties }) => otherProperties
      )
    })
  }, [selectedAgents])

  const validateIncoterm = (): boolean => {
    return (
      (data.incoterm.length !== 0 &&
        data.incoterm !== '' &&
        data.incoterm !== 'EXW' &&
        data.incoterm !== 'DAP') ||
      (data.incoterm.length !== 0 &&
        data.incoterm !== '' &&
        data.incoterm === 'EXW' &&
        data.collection !== '' &&
        data.postalCode !== '') ||
      (data.incoterm.length !== 0 &&
        data.incoterm !== '' &&
        data.incoterm === 'DAP' &&
        data.collectionDap !== '' &&
        data.postalCodeDap !== '') ||
      (data.incoterm.length !== 0 &&
        data.incoterm !== '' &&
        data.incoterm === 'DDP' &&
        data.collectionDap !== '' &&
        data.postalCodeDap !== '')

    )
  }

  const validateClient = (): boolean => {
    return (
      (proposalType === ProposalTypes.Client && selectedAgents[0].agent.length !== 0) ||
      proposalType !== ProposalTypes.Client
    )
  }

  const validateProfitPercent = (): boolean => {
    return (
      (proposalType === ProposalTypes.Client && selectedAgents[0].profitPercentageAgent !== null)
    )
  }

  const validateOriginDestination = (): boolean => {
    return (
      modal === 'LAND' ||
      ((modal === 'SEA' || modal === 'AIR') && data.origin !== data.destiny)
    )
  }

  const validateShippingCompany = (value: string, index: number): boolean => {
    for (
      let currentIndex = 0;
      currentIndex < selectedAgents.length;
      currentIndex++
    ) {
      if (
        selectedAgents[currentIndex].shippingCompany === value &&
        currentIndex !== index &&
        value.length !== 0
      ) {
        return true
      }
    }
    return false
  }

  const validateAgent = (value: string, index: number): boolean => {
    for (
      let currentIndex = 0;
      currentIndex < selectedAgents.length;
      currentIndex++
    ) {
      if (
        selectedAgents[currentIndex].agent === value &&
        currentIndex !== index &&
        value.length > 0
      ) {
        return true
      }
    }
    return false
  }

  const validateCompleteShippingCompany = (): boolean => {
    return selectedAgents.every(
      (selectedAgent) => selectedAgent.shippingCompany.length !== 0
    )
  }

  const validateFormComplete = (): void => {
    const step6 = modal === ModalTypes.Land
    if (proposalType !== 'CLIENT') {
      if (
        !invalidAgent &&
        validateCompleteShippingCompany() &&
        validateClient() &&
        validateOriginDestination() &&
        originDestinyFullfilled() &&
        validateIncoterm() &&
        validateProfitPercent()
      ) {
        setCompleted((currentState) => {
          return { ...currentState, step2: true, step6 }
        })
      } else {
        setCompleted((currentState) => {
          return { ...currentState, step2: false, step6 }
        })
      }
    } else {
      setCompleted((currentState) => {
        return { ...currentState, step2: true, step6 }
      })
    }
  }

  const validateFilled = (): void => {
    if (proposalType !== 'CLIENT') {
      if (
        data.origin !== '' ||
        data.destiny !== '' ||
        data.oriCity !== '' ||
        data.oriState !== '' ||
        data.oriCountry !== '' ||
        data.destCity !== '' ||
        data.destState !== '' ||
        data.destCountry !== '' ||
        data.incoterm !== '' ||
        validateClient() ||
        validateProfitPercent()
      ) {
        setFilled((currentState) => {
          return { ...currentState, step2: true }
        })
      } else {
        setFilled((currentState) => {
          return { ...currentState, step2: false }
        })
      }
    } else {
      setFilled((currentState) => {
        return { ...currentState, step2: true }
      })
    }
  }

  useEffect(() => {
    validateFormComplete()
    validateFilled()
  }, [data, proposalType, invalidOriDest, selectedAgents, invalidAgent])

  const originDestinyFullfilled = (): boolean => {
    return (
      (modal === 'LAND' &&
        data.oriCity !== '' &&
        data.oriState !== '' &&
        data.oriCountry !== '' &&
        data.destCity !== '' &&
        data.destState !== '' &&
        data.destCountry !== '' &&
        invalidOriDest === '') ||
      (modal !== 'LAND' && data.origin !== '' && data.destiny !== '')
    )
  }

  const getOriginDestinationListByModal = async (
    modal: string
  ): Promise<void> => {
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
    const seaList = [
      'EXW',
      'FCA',
      'FAS',
      'FOB',
      'CFR',
      'CIF',
      'DAP',
      'DPU',
      'DDP'
    ]
    const landList = ['EXW', 'DAP', 'DPU', 'DDP', 'FCA']
    if (incotermList.length > 0) {
      let airObject: any[] = []
      let seaObject: any[] = []
      let landObject: any[] = []

      switch (modal) {
        case 'AIR':
          airObject = incotermList.filter((incotermList) =>
            airList.includes(incotermList.id)
          )
          setIncotermFilteredList(airObject)
          break
        case 'SEA':
          seaObject = incotermList.filter((incotermList) =>
            seaList.includes(incotermList.id)
          )
          setIncotermFilteredList(seaObject)
          break
        case 'LAND':
          landObject = incotermList.filter((incotermList) =>
            landList.includes(incotermList.id)
          )
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
    } else if (
      proposal.idProposal !== undefined &&
      proposal.idProposal !== null
    ) {
      setPageDidLoad((prev) => prev + 1)
    } else {
      setPageDidLoad((prev) => prev + 2)
    }
    if (data.destState !== '' && data.destState !== null) {
      loadCitiesList('destiny')
    } else {
      setDestCitiesList([])
    }
  }, [data.destState])

  useEffect(() => {
    if (
      data.oriCity === data.destCity &&
      data.oriCity.length > 0 &&
      data.destCity.length > 0
    ) {
      setInvalidOriDest('oriCity')
    } else if (
      data.origin === data.destiny &&
      data.origin.length > 0 &&
      data.destiny.length > 0
    ) {
      setInvalidOriDest('origin')
    } else {
      setInvalidOriDest('')
    }
  }, [data.oriCity, data.origin])

  useEffect(() => {
    const uniqueAgents = new Set(
      selectedAgents.map((selectedAgent) => selectedAgent.agent)
    )
    const uniqueshippingCompanies = new Set(
      selectedAgents.map((selectedAgent) => selectedAgent.shippingCompany)
    )
    if (
      uniqueAgents.size !== selectedAgents.length ||
      uniqueshippingCompanies.size !== selectedAgents.length
    ) {
      setInvalidAgent(true)
    } else {
      setInvalidAgent(false)
    }
  }, [selectedAgents])

  useEffect(() => {
    if (
      data.oriCity === data.destCity &&
      data.oriCity.length > 0 &&
      data.destCity.length > 0
    ) {
      setInvalidOriDest('destCity')
    } else if (
      data.origin === data.destiny &&
      data.origin.length > 0 &&
      data.destiny.length > 0
    ) {
      setInvalidOriDest('destiny')
    } else {
      setInvalidOriDest('')
    }
  }, [data.destCity, data.destiny])

  useEffect(() => {
    if (
      data.incoterm === 'CIP' ||
      data.incoterm === 'CPT' ||
      data.incoterm === 'DPU'
    ) {
      setData({ ...data, collection: '' })
    }
  }, [data.incoterm])

  useEffect(() => {
    setSelectedAgents([
      {
        id: null,
        idProposalAgent: null,
        agent: '',
        idBusinessPartnerAgent: null,
        shippingCompany: '',
        idBusinessPartnerTransportCompany: null,
        profitPercentageAgent: null
      }
    ])
  }, [proposalType])

  const loadStatesList = (
    departure: string,
    countryLoadedId?: string
  ): void => {
    const selectedCountry =
      departure === 'origin' ? data.oriCountry : data.destCountry
    const setStateList =
      departure === 'origin' ? setOriStatesList : setDestStatesList
    const countryId =
      countryLoadedId === undefined
        ? countriesList?.filter(
          (country) => country.name === selectedCountry
        )[0]?.id
        : countryLoadedId
    if (countryId !== undefined && modal === 'LAND') {
      void (async function () {
        await API.getStates(countryId)
          .then((response) => {
            response !== 'error' ? setStateList(response) : setStateList([])
          })
          .catch((err) => {
            console.log(err)
          })
      })()
    }
  }

  const loadCitiesList = (departure: string, stateLoadedId?: string): void => {
    const selectedState =
      departure === 'origin' ? data.oriState : data.destState
    const statesList = departure === 'origin' ? oriStatesList : destStatesList
    const setStateList =
      departure === 'origin' ? setOriCitiesList : setDestCitiesList
    const stateId =
      stateLoadedId === undefined
        ? statesList?.filter((state) => state.name === selectedState)[0]?.id
        : stateLoadedId
    if (stateId !== undefined && modal === 'LAND') {
      void (async function () {
        await API.getCities(stateId)
          .then((response) => {
            response !== 'error' ? setStateList(response) : setStateList([])
          })
          .catch((err) => {
            console.log(err)
          })
      })()
    }
  }

  const setshippingCompanyLabel = (): string => {
    switch (modal) {
      case 'AIR':
        return String(I18n.t('pages.newProposal.step2.shippingCompany'))
      case 'SEA':
        return String(I18n.t('pages.newProposal.step2.coloader'))
      case 'LAND':
        return String(I18n.t('pages.newProposal.step2.transporter'))
    }
    return String(I18n.t('pages.newProposal.step2.shippingCompany'))
  }

  const setshippingCompanyErrorLabel = (): string => {
    switch (modal) {
      case 'AIR':
        return String(
          I18n.t('pages.newProposal.step2.differentShippingCompany')
        )
      case 'SEA':
        return String(I18n.t('pages.newProposal.step2.differentColoader'))
      case 'LAND':
        return String(I18n.t('pages.newProposal.step2.differentTransporter'))
    }
    return String(I18n.t('pages.newProposal.step2.differentShippingCompany'))
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

  const getAgentCounter = (index: number): String => {
    if (selectedAgents.length > 1) {
      return ` ${index + 1} :`
    }
    return ' :'
  }

  const filterOptions = createFilterOptions({
    matchFrom: 'any',
    limit: 500
  })

  return (
    <Separator>
      <Title>
        2. {I18n.t('pages.newProposal.step2.title')}
        <Subtitle>{I18n.t('pages.newProposal.step2.subtitle')}</Subtitle>
      </Title>
      <FormControl variant="outlined" size="small" className="form-size">
        <Grid container spacing={5}>
        <Grid item xs={modal === 'LAND' ? 12 : 6}>
            <FormLabel component="legend">
              <OriginDestLabel isLand={modal === 'LAND'}>
                {setOriginDestinyLabel('origin')}
              </OriginDestLabel>
              {modal !== 'LAND' && <RedColorSpan> *</RedColorSpan>}
            </FormLabel>
            {modal === 'LAND'
              ? (
              <Grid container spacing={2}>
                <Grid item xs={2}>
                  <FormLabel component="legend">
                    {I18n.t('pages.newProposal.step2.country')}
                    <RedColorSpan> *</RedColorSpan>
                  </FormLabel>
                  <Autocomplete
                    onChange={(e, newValue) =>
                      setData({ ...data, oriCountry: String(newValue ?? '') })
                    }
                    options={[
                      '',
                      ...countriesList.map((country) => country.name)
                    ]}
                    value={data.oriCountry}
                    filterOptions={filterOptions}
                    filterSelectedOptions
                    renderInput={(params) => (
                      <div ref={params.InputProps.ref}>
                        <ControlledInput
                          {...params}
                          id="search-country"
                          toolTipTitle={I18n.t(
                            'components.itemModal.requiredField'
                          )}
                          invalid={invalidInput && data.oriCountry.length === 0}
                          variant="outlined"
                          size="small"
                          placeholder={I18n.t('pages.newProposal.step2.choose')}
                        />
                      </div>
                    )}
                    PaperComponent={(params: any) => (
                      <StyledPaper {...params} />
                    )}
                  />
                  <LineSeparator />
                </Grid>
                <Grid item xs={4}>
                  <FormLabel component="legend">
                    {I18n.t('pages.newProposal.step2.state')}
                    <RedColorSpan> *</RedColorSpan>
                  </FormLabel>
                  <Autocomplete
                    onChange={(e, newValue) =>
                      setData({ ...data, oriState: String(newValue ?? '') })
                    }
                    options={['', ...oriStatesList?.map((state) => state.name)]}
                    value={data.oriState}
                    filterOptions={filterOptions}
                    filterSelectedOptions
                    disabled={
                      data.oriCountry === '' || data.oriCountry === null
                    }
                    closeIcon={null}
                    renderInput={(params) => (
                      <div ref={params.InputProps.ref}>
                        <ControlledInput
                          {...params}
                          id="search-state"
                          toolTipTitle={I18n.t(
                            'components.itemModal.requiredField'
                          )}
                          invalid={invalidInput && data.oriState.length === 0}
                          variant="outlined"
                          size="small"
                          placeholder={I18n.t('pages.newProposal.step2.choose')}
                        />
                      </div>
                    )}
                    PaperComponent={(params: any) => (
                      <StyledPaper {...params} />
                    )}
                  />
                </Grid>
                <Grid item xs={4}>
                  <FormLabel component="legend">
                    {I18n.t('pages.newProposal.step2.city')}
                    <RedColorSpan> *</RedColorSpan>
                  </FormLabel>
                  <Autocomplete
                    onChange={(e, newValue) =>
                      setData({ ...data, oriCity: String(newValue ?? '') })
                    }
                    options={['', ...oriCitiesList?.map((city) => city.name)]}
                    value={data.oriCity}
                    filterOptions={filterOptions}
                    filterSelectedOptions
                    disabled={data.oriState === '' || data.oriState === null}
                    renderInput={(params) => (
                      <div ref={params.InputProps.ref}>
                        <ControlledInput
                          {...params}
                          id="search-city"
                          toolTipTitle={
                            invalidInput
                              ? I18n.t('components.itemModal.requiredField')
                              : ''
                          }
                          invalid={
                            (invalidInput && data.destCity.length === 0) ||
                            invalidOriDest === 'oriCity'
                          }
                          variant="outlined"
                          size="small"
                          placeholder={I18n.t('pages.newProposal.step2.choose')}
                        />
                      </div>
                    )}
                    PaperComponent={(params: any) => (
                      <StyledPaper {...params} />
                    )}
                  />
                  {invalidOriDest === 'oriCity' && (
                    <ErrorText>
                      {I18n.t(
                        'pages.newProposal.step2.differentLocationsOrigin'
                      )}
                    </ErrorText>
                  )}
                </Grid>
              </Grid>
                )
              : (
              <Grid item xs={12}>
                <Autocomplete
                  onChange={(e, newValue) =>
                    setData({ ...data, origin: String(newValue ?? '') })
                  }
                  options={getOriginDestinyList()}
                  filterOptions={filterOptions}
                  value={data.origin}
                  disabled={modal === '' || modal === null}
                  renderInput={(params) => (
                    <div ref={params.InputProps.ref}>
                      <ControlledInput
                        {...params}
                        id="search-origin"
                        toolTipTitle={
                          invalidInput
                            ? I18n.t('components.itemModal.requiredField')
                            : ''
                        }
                        invalid={
                          (invalidInput && data.origin.length === 0) ||
                          invalidOriDest === 'origin'
                        }
                        variant="outlined"
                        size="small"
                        placeholder={modal === ModalTypes.Air
                          ? I18n.t('pages.newProposal.step2.searchPlaceholderAir')
                          : I18n.t('pages.newProposal.step2.searchPlaceholderSea')}
                        $space
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconComponent
                                name="search"
                                defaultColor={
                                  theme?.commercial?.pages?.newProposal
                                    ?.subtitle
                                }
                              />
                            </InputAdornment>
                          )
                        }}
                      />
                    </div>
                  )}
                  PaperComponent={(params: any) => <StyledPaper {...params} />}
                />
                {invalidOriDest === 'origin'
                  ? (
                  <ErrorText>
                    {I18n.t('pages.newProposal.step2.differentLocationsOrigin')}
                  </ErrorText>
                    )
                  : (
                  <LineSeparator />
                    )}
              </Grid>
                )}
          </Grid>
          <Grid item xs={modal === 'LAND' ? 12 : 6}>
            <FormLabel component="legend">
              <OriginDestLabel isLand={modal === 'LAND'}>
                {setOriginDestinyLabel('destiny')}
              </OriginDestLabel>
              {modal !== 'LAND' && <RedColorSpan> *</RedColorSpan>}
            </FormLabel>
            {modal === 'LAND'
              ? (
              <Grid container spacing={2}>
                <Grid item xs={2}>
                  <FormLabel component="legend">
                    {I18n.t('pages.newProposal.step2.country')}
                    <RedColorSpan> *</RedColorSpan>
                  </FormLabel>
                  <Autocomplete
                    onChange={(e, newValue) =>
                      setData({ ...data, destCountry: String(newValue ?? '') })
                    }
                    options={[
                      '',
                      ...countriesList.map((country) => country.name)
                    ]}
                    value={data.destCountry}
                    filterOptions={filterOptions}
                    filterSelectedOptions
                    renderInput={(params) => (
                      <div ref={params.InputProps.ref}>
                        <ControlledInput
                          {...params}
                          id="search-country"
                          toolTipTitle={I18n.t(
                            'components.itemModal.requiredField'
                          )}
                          invalid={
                            invalidInput && data.destCountry.length === 0
                          }
                          variant="outlined"
                          size="small"
                          placeholder={I18n.t('pages.newProposal.step2.choose')}
                        />
                      </div>
                    )}
                    PaperComponent={(params: any) => (
                      <StyledPaper {...params} />
                    )}
                  />
                </Grid>
                <Grid item xs={4}>
                  <FormLabel component="legend">
                    {I18n.t('pages.newProposal.step2.state')}
                    <RedColorSpan> *</RedColorSpan>
                  </FormLabel>
                  <Autocomplete
                    onChange={(e, newValue) =>
                      setData({ ...data, destState: String(newValue ?? '') })
                    }
                    options={[
                      '',
                      ...destStatesList?.map((state) => state.name)
                    ]}
                    value={data.destState}
                    filterOptions={filterOptions}
                    filterSelectedOptions
                    disabled={
                      data.destCountry === '' || data.destCountry === null
                    }
                    closeIcon={null}
                    renderInput={(params) => (
                      <div ref={params.InputProps.ref}>
                        <ControlledInput
                          {...params}
                          id="search-state"
                          toolTipTitle={I18n.t(
                            'components.itemModal.requiredField'
                          )}
                          invalid={invalidInput && data.destState.length === 0}
                          variant="outlined"
                          size="small"
                          placeholder={I18n.t('pages.newProposal.step2.choose')}
                        />
                      </div>
                    )}
                    PaperComponent={(params: any) => (
                      <StyledPaper {...params} />
                    )}
                  />
                </Grid>
                <Grid item xs={4}>
                  <FormLabel component="legend">
                    {I18n.t('pages.newProposal.step2.city')}
                    <RedColorSpan> *</RedColorSpan>
                  </FormLabel>
                  <Autocomplete
                    onChange={(e, newValue) =>
                      setData({ ...data, destCity: String(newValue ?? '') })
                    }
                    value={data.destCity}
                    options={['', ...destCitiesList?.map((city) => city.name)]}
                    filterOptions={filterOptions}
                    filterSelectedOptions
                    disabled={data.destState === '' || data.destState === null}
                    renderInput={(params) => (
                      <div ref={params.InputProps.ref}>
                        <ControlledInput
                          {...params}
                          id="search-city"
                          toolTipTitle={
                            invalidInput
                              ? I18n.t('components.itemModal.requiredField')
                              : ''
                          }
                          invalid={
                            (invalidInput && data.destCity.length === 0) ||
                            invalidOriDest === 'destCity'
                          }
                          variant="outlined"
                          size="small"
                          placeholder={I18n.t('pages.newProposal.step2.choose')}
                        />
                      </div>
                    )}
                    PaperComponent={(params: any) => (
                      <StyledPaper {...params} />
                    )}
                  />
                  {invalidOriDest === 'destCity' && (
                    <ErrorText>
                      {I18n.t(
                        'pages.newProposal.step2.differentLocationsDestiny'
                      )}
                    </ErrorText>
                  )}
                </Grid>
              </Grid>
                )
              : (
              <Grid item xs={12}>
                <Autocomplete
                  onChange={(e, newValue) =>
                    setData({ ...data, destiny: String(newValue ?? '') })
                  }
                  options={getOriginDestinyList()}
                  filterOptions={filterOptions}
                  value={data.destiny}
                  disabled={modal === '' || modal === null}
                  renderInput={(params) => (
                    <div ref={params.InputProps.ref}>
                      <ControlledInput
                        {...params}
                        id="search-destiny"
                        toolTipTitle={
                          invalidInput
                            ? I18n.t('components.itemModal.requiredField')
                            : ''
                        }
                        invalid={
                          (invalidInput && data.destiny.length === 0) ||
                          invalidOriDest === 'destiny'
                        }
                        variant="outlined"
                        size="small"
                        placeholder={modal === ModalTypes.Air
                          ? I18n.t('pages.newProposal.step2.searchPlaceholderAir')
                          : I18n.t('pages.newProposal.step2.searchPlaceholderSea')}
                        $space
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconComponent
                                name="search"
                                defaultColor={
                                  theme?.commercial?.pages?.newProposal
                                    ?.subtitle
                                }
                              />
                            </InputAdornment>
                          )
                        }}
                      />
                    </div>
                  )}
                  PaperComponent={(params: any) => <StyledPaper {...params} />}
                />
                {invalidOriDest === 'destiny'
                  ? (
                  <ErrorText>
                    {I18n.t(
                      'pages.newProposal.step2.differentLocationsDestiny'
                    )}
                  </ErrorText>
                    )
                  : (
                  <LineSeparator />
                    )}
              </Grid>
                )}
          </Grid>
          {selectedAgents.map((selectedAgent, index) => {
            return (
              <Fragment key={index}>
                {proposalType === 'CLIENT' && loadedAgentsData && (
                  <>
                    <Grid item xs={4}>
                      <FormLabel component="legend">
                        {I18n.t('pages.newProposal.step2.agents')}
                        {getAgentCounter(index)}
                      </FormLabel>
                      <Autocomplete
                        disabled={modal === ''}
                        size="small"
                        closeIcon={null}
                        options={agentsList.map(
                          (item) => item.businessPartner.simpleName
                        )}
                        onChange={(e, newValue) => {
                          setSelectedAgents(
                            selectedAgents.map((value, currentIndex) =>
                              currentIndex === index
                                ? {
                                    ...value,
                                    agent: newValue ?? '',
                                    idBusinessPartnerAgent: getidBusinessPartnerAgent(newValue)
                                  }
                                : value
                            )
                          )
                        }}
                        value={selectedAgent.agent}
                        renderInput={(params: any) => (
                          <div ref={params.InputProps.ref}>
                            <ControlledInput
                              {...params}
                              id="search-name"
                              toolTipTitle={I18n.t(
                                'components.itemModal.requiredField'
                              )}
                              value={selectedAgent.agent}
                              variant="outlined"
                              placeholder={
                                selectedAgent.agent.length === 0 &&
                                I18n.t('pages.newProposal.step2.searchAgents')
                              }
                              $space
                              InputProps={{
                                endAdornment: (
                                  <InputAdornment position="end">
                                    <IconComponent
                                      name="search"
                                      defaultColor={
                                        theme?.commercial?.pages?.newProposal
                                          ?.subtitle
                                      }
                                    />
                                  </InputAdornment>
                                )
                              }}
                            />
                          </div>
                        )}
                        PaperComponent={(params: any) => (
                          <StyledPaper {...params} />
                        )}
                      />
                      {invalidAgent &&
                        validateAgent(selectedAgent.agent, index) && (
                          <ErrorText>
                            {I18n.t('pages.newProposal.step2.differentAgent')}
                          </ErrorText>
                      )}
                    </Grid>

                    <Grid item xs={2}>
                      <FormLabel component="legend" error={ invalidInput && selectedAgent.shippingCompany.length === 0}>
                        {I18n.t('pages.newProposal.step2.profitPercentageAgent')}
                        {<RedColorSpan> *</RedColorSpan>}
                      </FormLabel>

                      <ControlledSelect
                        labelId="select-label-profitPercentageAgent"
                        id="profitPercentageAgent"
                        value={selectedAgent.profitPercentageAgent}
                        renderValue={value => {
                          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                          return value !== null ? `${value}%` : I18n.t('pages.newProposal.step2.choose')
                        }}
                        onChange={(e, newValue) => {
                          setSelectedAgents(
                            selectedAgents.map((value, currentIndex) =>
                              currentIndex === index
                                ? {
                                    ...value,
                                    profitPercentageAgent: e.target.value
                                  }
                                : value
                            )
                          )
                        }}
                        displayEmpty
                        disableUnderline
                        invalid={
                          proposalType === ProposalTypes.Client &&
                          invalidInput &&
                          selectedAgent.profitPercentageAgent === null
                        }
                        toolTipTitle={I18n.t('components.itemModal.requiredField')}
                        disabled={modal === '' || modal === null}
                        style={{ paddingLeft: '5px' }}
                      >
                        <MenuItem disabled value={selectedAgent.profitPercentageAgent}>
                          <SelectSpan placeholder={1}>
                            {I18n.t('pages.newProposal.step2.choose')}
                          </SelectSpan>
                        </MenuItem>
                        {profitsList.map((item, index) => (
                          <MenuItem key={index} value={item}>
                            <SelectSpan>{item}</SelectSpan>
                          </MenuItem>
                        ))}
                      </ControlledSelect>
                    </Grid>
                  </>
                )}
                <Grid item xs={6}>
                  <FormLabel component="legend">
                    {setshippingCompanyLabel()}
                    {getAgentCounter(index)}
                    {<RedColorSpan> *</RedColorSpan>}
                  </FormLabel>
                  <div style={{ display: 'flex' }}>
                    <div style={ index !== 0 ? { width: '95%' } : { width: '100%' }}>
                      <Autocomplete
                        disabled={modal === ''}
                        size="small"
                        closeIcon={null}
                        options={businessPartnerList.map(
                          (item) => item.businessPartner.simpleName
                        )}
                        onChange={(e, newValue) => {
                          setSelectedAgents(
                            selectedAgents.map((value, currentIndex) =>
                              currentIndex === index
                                ? {
                                    ...value,
                                    shippingCompany: newValue ?? '',
                                    idBusinessPartnerTransportCompany:
                                      getShippingCompanyId(newValue)
                                  }
                                : value
                            )
                          )
                        }}
                        value={selectedAgent.shippingCompany}
                        renderInput={(params: any) => (
                          <div ref={params.InputProps.ref}>
                            <ControlledInput
                              {...params}
                              id="search-name"
                              toolTipTitle={I18n.t(
                                'components.itemModal.requiredField'
                              )}
                              value={selectedAgent.shippingCompany}
                              invalid={
                                proposalType === 'CLIENT' &&
                                invalidInput &&
                                selectedAgent.shippingCompany.length === 0
                              }
                              variant="outlined"
                              placeholder={
                                selectedAgent.shippingCompany.length === 0 &&
                                I18n.t('pages.newProposal.step2.searchAgents')
                              }
                              $space
                              InputProps={{
                                endAdornment: (
                                  <InputAdornment position="end">
                                    <IconComponent
                                      name="search"
                                      defaultColor={
                                        theme?.commercial?.pages?.newProposal
                                          ?.subtitle
                                      }
                                    />
                                  </InputAdornment>
                                )
                              }}
                            />
                          </div>
                        )}
                        PaperComponent={(params: any) => (
                          <StyledPaper {...params} />
                        )}
                      />
                    </div>
                    {index !== 0 && (
                      <AgentDeleteModal handleConfirm={() => removeAgent(index)} />
                    )}
                    {/* {index !== 0 && (
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          marginLeft: '5px'
                        }}
                      >
                        <RemoveIcon
                          onClick={() => {
                            removeAgent(index)
                          }}
                        />
                      </div>
                    )} */}
                  </div>
                  {invalidAgent &&
                    validateShippingCompany(
                      selectedAgent.shippingCompany,
                      index
                    ) && (
                      <ErrorText>{setshippingCompanyErrorLabel()}</ErrorText>
                  )}
                </Grid>
                <LineSeparator />
              </Fragment>
            )
          })}

          {modal === 'AIR' && proposalType === 'CLIENT' && (
            <>
              <AddAgentButtonWrapper>
                <Button
                  onAction={() => {
                    setSelectedAgents([
                      ...selectedAgents,
                      {
                        id: null,
                        idProposalAgent: null,
                        agent: '',
                        idBusinessPartnerAgent: null,
                        shippingCompany: '',
                        idBusinessPartnerTransportCompany: null,
                        profitPercentageAgent: null
                      }
                    ])
                  }}
                  text={I18n.t('pages.newProposal.step2.addAgent')}
                  icon="add"
                  backgroundGreen={false}
                  tooltip={I18n.t('pages.newProposal.step2.addAgent')}
                  disabled={false}
                />
              </AddAgentButtonWrapper>
              <LineSeparator />
            </>
          )}
          <Grid item xs={2}>
            <FormLabel component="legend">
              {I18n.t('pages.newProposal.step2.incoterm')}
              <RedColorSpan> *</RedColorSpan>
            </FormLabel>
            <ControlledSelect
              labelId="select-label-incoterm"
              id="incoterm"
              value={data.incoterm}
              onChange={(e) => setData({ ...data, incoterm: e.target.value })}
              displayEmpty
              disableUnderline
              invalid={invalidInput && data.incoterm.length === 0}
              toolTipTitle={I18n.t('components.itemModal.requiredField')}
              disabled={modal === '' || modal === null}
            >
              <MenuItem disabled value={data.incoterm}>
                <SelectSpan placeholder={1}>
                  {I18n.t('pages.newProposal.step2.choose')}
                </SelectSpan>
              </MenuItem>
              {incotermFilteredList.map((item) => (
                <MenuItem key={item.id} value={item.id}>
                  <SelectSpan>{item.id}</SelectSpan>
                </MenuItem>
              ))}
            </ControlledSelect>
          </Grid>
          <Grid item xs={4} />
          {(data.incoterm === IncotermTypes.Exw ||
              data.incoterm === IncotermTypes.Fca) && (
            <>
            <Grid item xs={2}>
              <FormLabel component="legend" error={
                  invalidInput &&
                  data.postalCode.length === 0
                }>
                {I18n.t('pages.newProposal.step2.postalCode')}
                {data.incoterm !== IncotermTypes.Fca && <RedColorSpan> *</RedColorSpan>}
              </FormLabel>
              <ControlledInput
                id="description"
                toolTipTitle={I18n.t('components.itemModal.requiredField')}
                onChange={(e) =>
                  setData({ ...data, postalCode: e.target.value })
                }
                invalid={
                  invalidInput &&
                  data.postalCode.length === 0
                }
                value={data.postalCode.length !== 0 ? data.postalCode : ''}
                variant="outlined"
                size="small"
              />
            </Grid>
            <Grid item xs={4}>
              <FormLabel component="legend" error={
                  invalidInput &&
                  data.incoterm !== IncotermTypes.Fca &&
                  data.collection.length === 0
                }>
                {I18n.t('pages.newProposal.step2.collectionAddress')}
                {data.incoterm !== IncotermTypes.Fca && <RedColorSpan> *</RedColorSpan>}
              </FormLabel>
              <ControlledInput
                id="description"
                toolTipTitle={I18n.t('components.itemModal.requiredField')}
                onChange={(e) =>
                  setData({ ...data, collection: e.target.value })
                }
                invalid={
                  invalidInput &&
                  data.incoterm !== IncotermTypes.Fca &&
                  data.collection.length === 0
                }
                value={data.collection.length !== 0 ? data.collection : ''}
                variant="outlined"
                size="small"
              />
            </Grid>
            </>
          )}
          {(data.incoterm === IncotermTypes.Dap && (
            <>
            <Grid item xs={2}>
              <FormLabel component="legend" error={
                  invalidInput &&
                  data.postalCodeDap.length === 0
                }>
                {I18n.t('pages.newProposal.step2.postalCodeDap')}
                {<RedColorSpan> *</RedColorSpan>}
              </FormLabel>
              <ControlledInput
                id="description"
                toolTipTitle={I18n.t('components.itemModal.requiredField')}
                onChange={(e) =>
                  setData({ ...data, postalCodeDap: e.target.value })
                }
                invalid={
                  invalidInput &&
                  data.postalCodeDap.length === 0
                }
                value={data.postalCodeDap.length !== 0 ? data.postalCodeDap : ''}
                variant="outlined"
                size="small"
              />
            </Grid>
            <Grid item xs={4}>
              <FormLabel component="legend" error={
                  invalidInput &&
                  data.collectionDap.length === 0
                }>
                {I18n.t('pages.newProposal.step2.collectionAddressDap')}
                {<RedColorSpan> *</RedColorSpan>}
              </FormLabel>
              <ControlledInput
                id="description"
                toolTipTitle={I18n.t('components.itemModal.requiredField')}
                onChange={(e) =>
                  setData({ ...data, collectionDap: e.target.value })
                }
                invalid={
                  invalidInput &&
                  data.collectionDap.length === 0
                }
                value={data.collectionDap.length !== 0 ? data.collectionDap : ''}
                variant="outlined"
                size="small"
              />
            </Grid>
            </>
          ))}
          {(data.incoterm === IncotermTypes.Ddp && (
            <>
              <Grid item xs={2}>
                <FormLabel component="legend" error={
                    invalidInput &&
                    data.postalCodeDap.length === 0
                  }>
                  {I18n.t('pages.newProposal.step2.postalCodeDap')}
                  {<RedColorSpan> *</RedColorSpan>}
                </FormLabel>
                <ControlledInput
                  id="description"
                  toolTipTitle={I18n.t('components.itemModal.requiredField')}
                  onChange={(e) =>
                    setData({ ...data, postalCodeDap: e.target.value })
                  }
                  invalid={
                    invalidInput &&
                    data.postalCodeDap.length === 0
                  }
                  value={data.postalCodeDap.length !== 0 ? data.postalCodeDap : ''}
                  variant="outlined"
                  size="small"
                />
              </Grid>
              <Grid item xs={4}>
                <FormLabel component="legend" error={
                    invalidInput &&
                    data.collectionDap.length === 0
                  }>
                  {I18n.t('pages.newProposal.step2.collectionAddressDap')}
                  {<RedColorSpan> *</RedColorSpan>}
                </FormLabel>
                <ControlledInput
                  id="description"
                  toolTipTitle={I18n.t('components.itemModal.requiredField')}
                  onChange={(e) =>
                    setData({ ...data, collectionDap: e.target.value })
                  }
                  invalid={
                    invalidInput &&
                    data.collectionDap.length === 0
                  }
                  value={data.collectionDap.length !== 0 ? data.collectionDap : ''}
                  variant="outlined"
                  size="small"
                />
              </Grid>
            </>
          ))}
          </Grid>
      </FormControl>
    </Separator>
  )
}

export default withTheme(Step2)
