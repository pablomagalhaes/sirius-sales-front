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

import { Button } from 'fiorde-fe-components'
import AgentDeleteModal from '../../../components/AgentDeleteModal'

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
}

export interface Agents {
  id?: number | null
  idProposalAgent?: number | null
  agent: string
  idBusinessPartnerAgent?: number | null
  shippingCompany: string
  idBusinessPartnerTransportCompany?: number | null
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
    idDestination: ''
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
      idBusinessPartnerTransportCompany: null
    }
  ])

  // const validateFormComplete = (): void => {
  //   if (
  //     !invalidAgent &&
  //     validateCompleteShippingCompany() &&
  //     originDestinyFullfilled() &&
  //     validateClient() &&
  //     validateIncoterm() &&
  //     validateOriginDestination()
  //   ) {
  //     setCompleted((currentState) => {
  //       return { ...currentState, step2: true }
  //     })
  //   } else {
  //     setCompleted((currentState) => {
  //       return { ...currentState, step2: false }
  //     })
  //   }
  // }

  // const validateFilled = (): void => {
  //   if (
  //     data.origin !== '' ||
  //     data.destiny !== '' ||
  //     data.oriCity !== '' ||
  //     data.oriState !== '' ||
  //     data.oriCountry !== '' ||
  //     data.destCity !== '' ||
  //     data.destState !== '' ||
  //     data.destCountry !== '' ||
  //     data.incoterm !== '' ||
  //     validateClient()
  //   ) {
  //     setFilled((currentState) => {
  //       return { ...currentState, step2: true }
  //     })
  //   } else {
  //     setFilled((currentState) => {
  //       return { ...currentState, step2: false }
  //     })
  //   }
  // }

  // useEffect(() => {
  //   validateFormComplete()
  //   validateFilled()
  // }, [data, proposalType, invalidOriDest, selectedAgents, invalidAgent])

  return (
    <Separator>
      <Title>
        2. {I18n.t('pages.newProposal.step2.title')}
        <Subtitle>{I18n.t('pages.newProposal.step2.subtitle')}</Subtitle>
      </Title>
      <FormControl variant="outlined" size="small" className="form-size">
        <Grid container spacing={5}>

        </Grid>
      </FormControl>
    </Separator>
  )
}

export default withTheme(Step2)
