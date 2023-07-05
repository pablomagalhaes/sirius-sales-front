import React, { useEffect, useState } from 'react'
import {
  MenuItem,
  FormLabel,
  Grid,
  InputAdornment,
  Divider
} from '@material-ui/core/'
import { I18n } from 'react-redux-i18n'
import {
  Title,
  Subtitle,
  SelectSpan,
  Separator
} from '../style'

import IconComponent from '../../../../application/icons/IconComponent'
import { withTheme } from 'styled-components'

import ControlledSelect from '../../../components/ControlledSelect'
import ControlledInput from '../../../components/ControlledInput'
import { RedColorSpan } from '../../../components/StyledComponents/modalStyles'
import API from '../../../../infrastructure/api'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { StyledPaper } from './StepsStyles'
import { PickerDateRange } from 'fiorde-fe-components'

interface Step2Props {
  invalidInput: boolean
  setCompleted: (completed: any) => void
  setFilled: (filled: any) => void
  theme: any
}

// interface DataProps {
//   collection: string
//   collectionDap: string
//   destCity: string
//   destCountry: string
//   destState: string
//   destiny: string
//   incoterm: string
//   oriCity: string
//   oriCountry: string
//   oriState: string
//   origin: string
//   originCityName: string
//   originCityId: string
//   destinationCityName: string
//   destinationCityId: string
//   idOrigin: string
//   idDestination: string
// }

const Step2 = ({
  invalidInput,
  setCompleted,
  setFilled,
  theme
}: Step2Props): JSX.Element => {
  const [vigencyDate, setVigencyDate] = React.useState([null, null]);
  const [partnerList, setPartnerList] = useState<any[]>([]);
  const [data, setData] = useState({
    operation: '',
    vigencyDate: vigencyDate,
    proposalValue: '',
    requester: ''
  })

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

  useEffect(() => {
    setData({ ...data, vigencyDate: vigencyDate });
  }, [vigencyDate])

  useEffect(() => {
    if (data.proposalValue !== '' && data.operation !== '') {
      setCompleted((currentState) => ({ ...currentState, step1: true }))
    } else {
      setCompleted((currentState) => ({ ...currentState, step1: false }))
    }
    if (data.proposalValue !== '' || data.operation !== '') {
      setFilled((currentState) => {
        return { ...currentState, step1: true }
      })
    } else {
      setFilled((currentState) => {
        return { ...currentState, step1: false }
      })
    }
  }, [data])

  console.log('data step2', data)

  return (
    <Separator>
      <Title>
        2. {I18n.t('pages.staggeredProposal.step2.title')}
        <Subtitle>{I18n.t('pages.staggeredProposal.step2.subtitle')}</Subtitle>
      </Title>
      <Title>
        2.1 {I18n.t('pages.staggeredProposal.step2.title')}
      </Title>
      <Grid item xs={12} container={true} spacing={1} direction="row" justify="center">
          <Grid item xs={12} md>
            <FormLabel
              component="legend"
            >
              {I18n.t('pages.staggeredProposal.step2.agent')}:
            </FormLabel>
          </Grid>
          <Grid item xs={12} md>
            <FormLabel
              component="legend"
            >
              {I18n.t('pages.staggeredProposal.step2.ciaArea')}:
            </FormLabel>
          </Grid>
          <Grid item xs={12} md>
            <FormLabel
              component="legend"
            >
              {I18n.t('pages.staggeredProposal.step2.coin')}:
            </FormLabel>
          </Grid>
          <Grid item xs={12} md>
            <FormLabel
              component="legend"
            >
              {I18n.t('pages.staggeredProposal.step2.minValue')}:
            </FormLabel>
          </Grid>
          <Grid item xs={12} md>
            <FormLabel
              component="legend"
            >
              {I18n.t('pages.staggeredProposal.step2.45')}:
            </FormLabel>
          </Grid>
          <Grid item xs={12} md>
            <FormLabel
              component="legend"
            >
              {I18n.t('pages.staggeredProposal.step2.100')}:
            </FormLabel>
          </Grid>
          <Grid item xs={12} md>
            <FormLabel
              component="legend"
            >
              {I18n.t('pages.staggeredProposal.step2.300')}:
            </FormLabel>
          </Grid>
           <Grid item xs={12} md>
            <FormLabel
              component="legend"
            >
              {I18n.t('pages.staggeredProposal.step2.500')}:
            </FormLabel>
          </Grid>
           <Grid item xs={12} md>
            <FormLabel
              component="legend"
            >
              {I18n.t('pages.staggeredProposal.step2.1ton')}:
            </FormLabel>
          </Grid>
          <Grid item xs={12} md>
          </Grid>
      </Grid>
      <Grid container spacing={5}>
        <Divider />
      </Grid>
      <Grid item xs={12} container={true} spacing={1} direction="row" justify="center">
          <Grid item xs={12} md>
            <FormLabel
              component="legend"
            >
              MOLFINO HNS
            </FormLabel>
          </Grid>
          <Grid item xs={12} md>
            <FormLabel
              component="legend"
            >
              TAM CARGO
            </FormLabel>
          </Grid>
          <Grid item xs={12} md>
            <FormLabel
              component="legend"
            >
              USD
            </FormLabel>
          </Grid>
          <Grid item xs={12} md>
            <FormLabel
              component="legend"
            >
            90,00
            </FormLabel>
          </Grid>
          <Grid item xs={12} md>
            <FormLabel
              component="legend"
            >
             4,67
            </FormLabel>
          </Grid>
          <Grid item xs={12} md>
            <FormLabel
              component="legend"
            >
             4,67
            </FormLabel>
          </Grid>
          <Grid item xs={12} md>
            <FormLabel
              component="legend"
            >
             4,67
            </FormLabel>
          </Grid>
           <Grid item xs={12} md>
            <FormLabel
              component="legend"
            >
              4,67
            </FormLabel>
          </Grid>
          <Grid item xs={12} md>
            <FormLabel
              component="legend"
            >
             4,02
            </FormLabel>
          </Grid>
          <Grid item xs={12} md>
            <FormLabel
              component="legend"
            >
             ...
            </FormLabel>
          </Grid>
      </Grid>
      <Grid container spacing={5}>

      </Grid>
    </Separator>
  )
}

export default withTheme(Step2)
