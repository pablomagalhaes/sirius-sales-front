import React, { useEffect, useState, useContext, Fragment } from 'react'
import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
  InputAdornment,
  RadioGroup
} from '@material-ui/core/'
import { I18n } from 'react-redux-i18n'
import {
  Title,
  Subtitle,
  IconContainer,
  Separator,
  StyledRadio
} from '../style'
import IconComponent from '../../../../application/icons/IconComponent'
import { withTheme } from 'styled-components'
import ControlledInput from '../../../components/ControlledInput'
import { RedColorSpan } from '../../../components/StyledComponents/modalStyles'
import API from '../../../../infrastructure/api'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { Transport, TransportList } from '../../../../domain/Transport'
import { StyledPaper } from './StepsStyles'
import { ExitDialog } from 'fiorde-fe-components'


export interface Agents {
  id?: number | null
  agent: string
  idBusinessPartnerAgent?: number | null
  shippingCompany: string
  idBusinessPartnerTransportCompany?: number | null
}

export interface Filled {
  step2: boolean
}
export interface Step1Props {
  theme?: any
  invalidInput: boolean
  setCompleted: (completed: any) => void
  setFilled: (filled: any) => void
  setProposalType: (proposal: string) => void
  setModal: (modal: string) => void
  filled: Filled
  setStepLoaded: (steps: any) => void
  setAgentList: (agent: Agents[]) => void
  // setAgentList: (agent: string[]) => void
}

const Step1 = ({
  theme,
  invalidInput,
  setCompleted,
  setFilled,
  setProposalType,
  setModal,
  filled,
  setStepLoaded,
  setAgentList
}: Step1Props): JSX.Element => {
  const [transportList] = useState<Transport[]>(TransportList)
  const [agentsList, setAgentsList] = useState<any[]>([])
  const [businessPartnerList, setBusinessPartnerList] = useState<any[]>([])
  const [partnerList, setPartnerList] = useState<any[]>([])
  const [data, setData] = useState({
    proposal: '',
    serviceDesemb: false,
    serviceTransport: false,
    proposalValue: '',
    modal: '',
    requester: ''
  })

  const [showPopUp, setShowPopUp] = useState(false)
  const [modalCopy, setModalCopy] = useState('')

  const [selectedAgents, setSelectedAgents] = useState<Agents[]>([
    {
      id: null,
      agent: '',
      idBusinessPartnerAgent: null,
      shippingCompany: '',
      idBusinessPartnerTransportCompany: null
    }
  ])


  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const getPartners = new Promise<void>((resolve) => {
      API.getPartner()
        .then((response) => {
          setPartnerList(response)
          resolve()
        })
        .catch((err) => console.log(err))
    })
  }, [])

  // useEffect(() => {
  //   if (
  //     data.proposal !== '' &&
  //     data.modal !== '' &&
  //     data.requester !== ''
  //   ) {
  //     setCompleted((currentState) => ({ ...currentState, step1: true }))
  //   } else {
  //     setCompleted((currentState) => ({ ...currentState, step1: false }))
  //   }
  //   if (
  //     data.proposal !== '' ||
  //     data.modal !== ''
  //   ) {
  //     setFilled((currentState) => {
  //       return { ...currentState, step1: true }
  //     })
  //   } else {
  //     setFilled((currentState) => {
  //       return { ...currentState, step1: false }
  //     })
  //   }
  // }, [data])

  return (
    <Separator>
      <Title>
        1. {I18n.t('pages.newProposal.step1.title')}
        <Subtitle>{I18n.t('pages.newProposal.step1.subtitle')}</Subtitle>
      </Title>
      <Grid container spacing={5}>
        <Grid item xs={6}> 
          <FormLabel component="legend" error={data.proposalValue === '' && invalidInput}>
            {I18n.t('pages.newProposal.step1.client')}:
            <RedColorSpan> *</RedColorSpan>
          </FormLabel>
              <Autocomplete
                freeSolo
                onChange={(e, newValue) =>
                  setData({ ...data, proposalValue: String(newValue) })
                }
                options={ partnerList.map((item) => item.businessPartner.simpleName)}
                value={data.proposalValue}
                renderInput={(params) => (
                  <div ref={params.InputProps.ref}>
                    <ControlledInput
                      {...params}
                      id="search-client"
                      toolTipTitle={I18n.t('components.itemModal.requiredField')}
                      invalid={data.proposalValue === '' && invalidInput}
                      variant="outlined"
                      size="small"
                      placeholder={I18n.t('pages.newProposal.step1.searchClient')}
                      $space
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconComponent
                              name="search"
                              defaultColor={
                                theme?.commercial?.pages?.newProposal?.subtitle
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
          </Grid>
      </Grid>
    </Separator>
  )
}

export default withTheme(Step1)
