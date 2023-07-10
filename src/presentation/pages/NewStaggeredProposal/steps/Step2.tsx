import React, { useEffect, useState } from 'react'
import {
  MenuItem,
  FormLabel,
  Grid,
  InputAdornment,
  Divider,
  Button
} from '@material-ui/core/'
import { I18n } from 'react-redux-i18n'
import {
  StyledPaper,
  Title,
  Subtitle,
  SelectSpan,
  Separator,
  TextCellHead,
  TextCell,
  InputContainer,
  TextInnerGreyCell,
  TextInnerCell
} from './StepsStyles'

import IconComponent from '../../../../application/icons/IconComponent'
import { withTheme } from 'styled-components'

import ControlledSelect from '../../../components/ControlledSelect'
import ControlledInput from '../../../components/ControlledInput'
import { RedColorSpan } from '../../../components/StyledComponents/modalStyles'
import API from '../../../../infrastructure/api'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { MenuIconCell } from 'fiorde-fe-components'

interface Step2Props {
  invalidInput: boolean
  setCompleted: (completed: any) => void
  setFilled: (filled: any) => void
  theme: any
}

interface Frequency {
  id: number
  description: string
}

const Step2 = ({
  invalidInput,
  setCompleted,
  setFilled,
  theme
}: Step2Props): JSX.Element => {

  const initialState = {
    validity: '',
    validityDate: '',
    transitTime: '',
    frequency: '',
    route: '',
    client: '',
    freeTime: '',
    deadline: '',
    value: '',
    generalObs: '',
    internalObs: '',
    recurrency: '1',
    weeklyRecurrency: ''
  }

  const [data, setData] = useState({
    operation: '',
    proposalValue: '', 
    requester: '',
    recurrency: '1',
    frequency: ''
  })

  const [frequencyList, setFrequencyList] = useState<Frequency[]>([])


  useEffect(() => {
    void (async function () {
      await API.getFrequency()
        .then((response) => setFrequencyList(response))
        .catch((err) => console.log(err))
    })()
  }, [])

  const valuesRecurrency = (e): any => {
    let value = parseInt(e.target.value, 10)
    if (value > 99) value = 99
    if (value < 1) value = 1
    setData({ ...data, recurrency: String(value) })
  }

  // useEffect(() => {
  //   setData({ ...data, vigencyDate: vigencyDate })
  // }, [vigencyDate])

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
        2. {I18n.t('pages.staggeredProposal.newStaggeredProposal.step2.title')}
        <Subtitle>{I18n.t('pages.staggeredProposal.newStaggeredProposal.step2.subtitle')}</Subtitle>
      </Title>
      <Title>2.1 De MIA - Miami até GRU - Guarulhos</Title>
      <Grid
        container
        spacing={1}
      >
        <Grid item xs={2}>
          <FormLabel component="legend">
            {I18n.t('pages.staggeredProposal.newStaggeredProposal.step2.agent')}:
          </FormLabel>
        </Grid>
        <Grid item xs={2}>
          <FormLabel component="legend">
            {I18n.t('pages.staggeredProposal.newStaggeredProposal.step2.ciaArea')}
          </FormLabel>
        </Grid>
        <Grid item xs={1}>
          <FormLabel component="legend">
            {I18n.t('pages.staggeredProposal.newStaggeredProposal.step2.coin')}
          </FormLabel>
        </Grid>
        <Grid item>
          <FormLabel component="legend">
            {I18n.t('pages.staggeredProposal.newStaggeredProposal.step2.minValue')}
          </FormLabel>
        </Grid>
        <Grid item xs={1}>
          <FormLabel component="legend">
            {I18n.t('pages.staggeredProposal.newStaggeredProposal.step2.45')}
          </FormLabel>
        </Grid>
        <Grid item xs={1}>
          <FormLabel component="legend">
            {I18n.t('pages.staggeredProposal.newStaggeredProposal.step2.100')}
          </FormLabel>
        </Grid>
        <Grid item xs={1}>
          <FormLabel component="legend">
            {I18n.t('pages.staggeredProposal.newStaggeredProposal.step2.300')}
          </FormLabel>
        </Grid>
        <Grid item xs={1}>
          <FormLabel component="legend">
            {I18n.t('pages.staggeredProposal.newStaggeredProposal.step2.500')}
          </FormLabel>
        </Grid>
        <Grid item xs={1}>
          <FormLabel component="legend">
            {I18n.t('pages.staggeredProposal.newStaggeredProposal.step2.500')}
          </FormLabel>
        </Grid>
        <Grid item xs={1}>
          <FormLabel component="legend">
            {I18n.t('pages.staggeredProposal.newStaggeredProposal.step2.1ton')}
          </FormLabel>
        </Grid>
      </Grid>
      <Divider />
      <Grid
        container
        spacing={1}
      >
        <Grid item xs={2}>
          <FormLabel component="legend">
           <TextCell>MOLFINO HNS</TextCell> 
          </FormLabel>
        </Grid>
        <Grid item xs={2}>
          <FormLabel component="legend">TAM CARGO</FormLabel>
        </Grid>
        <Grid item xs={1}>
          <FormLabel component="legend">USD</FormLabel>
        </Grid>
        <Grid item xs={1}>
          <FormLabel component="legend">90,00</FormLabel>
        </Grid>
        <Grid item xs={1}>
          <FormLabel component="legend">4,67</FormLabel>
        </Grid>
        <Grid item xs={1}>
          <FormLabel component="legend">4,67</FormLabel>
        </Grid>
        <Grid item xs={1}>
          <FormLabel component="legend">4,67</FormLabel>
        </Grid>
        <Grid item xs={1}>
          <FormLabel component="legend">4,67</FormLabel>
        </Grid>
        <Grid item xs={1}>
          <FormLabel component="legend">4,02</FormLabel>
        </Grid>
        <Grid item xs={1} style={{ alignSelf: 'center' }}>
            <Button onClick={() => {} }>
                <MenuIconCell />
            </Button>
        </Grid>
      </Grid>

      <Grid
        container
        spacing={1}
        style={{
          padding: '10px 0px 0px 0px'
        }}
      >
        <Grid item xs={2}>
        </Grid>
        <Grid item xs={2}>
        </Grid>
        <Grid item xs={2}
        alignItems="center"
            style={{
              background: '#F0F1F5'
            }}
        >
         <TextInnerGreyCell>Tarifas para venda:</TextInnerGreyCell>
        </Grid>
        <Grid item xs={1} style={{
          background: '#F0F1F5'
        }}>
            <ControlledInput
              id="client"
              toolTipTitle={I18n.t('components.itemModal.requiredField')}
              invalid={false}
              variant="outlined"
              onChange={() => {}}
              value=''
              size="small"
            />
        </Grid>
        <Grid item xs={1} style={{
          background: '#F0F1F5'
        }}>
        <ControlledInput
              id="client"
              toolTipTitle={I18n.t('components.itemModal.requiredField')}
              invalid={false}
              variant="outlined"
              onChange={() => {}}
              value=''
              size="small"
            />
        </Grid>
        <Grid item xs={1} style={{
          background: '#F0F1F5'
        }}>
        <ControlledInput
              id="client"
              toolTipTitle={I18n.t('components.itemModal.requiredField')}
              invalid={false}
              variant="outlined"
              onChange={() => {}}
              value=''
              size="small"
            />
        </Grid>
        <Grid item xs={1} style={{
          background: '#F0F1F5'
        }} >
        <ControlledInput
              id="client"
              toolTipTitle={I18n.t('components.itemModal.requiredField')}
              invalid={false}
              variant="outlined"
              onChange={() => {}}
              value=''
              size="small"
            />
        </Grid>
        <Grid item xs={1} style={{
          background: '#F0F1F5'
        }} >
        <ControlledInput
              id="client"
              toolTipTitle={I18n.t('components.itemModal.requiredField')}
              invalid={false}
              variant="outlined"
              onChange={() => {}}
              value=''
              size="small"
            />
        </Grid>
        <Grid item xs={1}></Grid>
      </Grid>

      <Grid
        container
        spacing={1}
        style={{
          padding: '10px 0px 10px 0px'
        }}
      >
        <Grid item xs={2}>
        </Grid>
        <Grid item xs={2}>
        </Grid>
        <Grid item xs={2}
        alignItems="center">
          <TextInnerCell>Frequência:</TextInnerCell>
        </Grid>
        <Grid item xs={1}>
            <InputContainer>
              <ControlledInput
                id="recurrency"
                toolTipTitle={I18n.t('components.itemModal.requiredField')}
                invalid={invalidInput && data.recurrency.length === 0}
                variant="outlined"
                value={data.recurrency}
                size="small"
                InputProps={{
                  inputProps: {
                    max: 99,
                    min: 1
                  }
                }}
                type="number"
                onChange={(e) => {
                  valuesRecurrency(e)
                }}
              />
            </InputContainer>
        </Grid>
        <Grid item xs={1} style={{ alignSelf: 'center' }}>
          <FormLabel component="span" style={{ margin: '0 0 0 10px' }}>
            {I18n.t('pages.newProposal.step4.times')}
          </FormLabel>
        </Grid>
        <Grid item xs={3}>
            <ControlledSelect
              labelId="frequency-label"
              id="frequency"
              value={data.frequency}
              onChange={(e) => setData({ ...data, frequency: e.target.value })}
              displayEmpty
              disableUnderline
              invalid={invalidInput && data.frequency.length === 0}
              toolTipTitle={I18n.t('components.itemModal.requiredField')}
            >
              <MenuItem disabled value={data.frequency}>
                <SelectSpan placeholder={1}>
                  {I18n.t('pages.newProposal.step4.choose')}
                </SelectSpan>
              </MenuItem>
              {frequencyList.map((item) => (
                <MenuItem key={item.id} value={item.id}>
                  <SelectSpan>{item.description}</SelectSpan>
                </MenuItem>
              ))}
            </ControlledSelect>
        </Grid>
        <Grid item xs={1}></Grid>
      </Grid>

      <Divider />

    </Separator>
  )
}

export default withTheme(Step2)
