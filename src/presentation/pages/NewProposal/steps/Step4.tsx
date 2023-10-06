import React, { useEffect, useState, useContext } from 'react'
import moment from 'moment'
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  MenuItem,
  RadioGroup
} from '@material-ui/core/'
import { I18n } from 'react-redux-i18n'
import {
  InputContainer,
  SelectSpan,
  Separator,
  StyledRadio,
  Subtitle,
  Title,
  WeekDay,
  WeekContainer
} from '../style'
import ControlledSelect from '../../../components/ControlledSelect'
import ControlledInput from '../../../components/ControlledInput'
import ControlledToolTip from '../../../components/ControlledToolTip/ControlledToolTip'
import { RedColorSpan } from '../../../components/StyledComponents/modalStyles'
import API from '../../../../infrastructure/api'
import { NumberInput } from './StepsStyles'
import { withTheme } from 'styled-components'
import { ProposalContext, ProposalProps } from '../context/ProposalContext'
import FormatNumber from '../../../../application/utils/formatNumber'

interface Step4Props {
  invalidInput: boolean
  setCompleted: (completed: any) => void
  setFilled: (filled: any) => void
  theme?: any
  modal: string
  specifications: string
  duplicateMode: boolean
}

interface Frequency {
  id: number
  description: string
}

const Step4 = ({
  invalidInput,
  setCompleted,
  setFilled,
  theme,
  modal,
  specifications,
  duplicateMode
}: Step4Props): JSX.Element => {
  // mock para os selects
  const validityList = [
    {
      name: '15 dias',
      value: 15
    },
    {
      name: '30 dias',
      value: 30
    },
    {
      name: '60 dias',
      value: 60
    },
    {
      name: '90 dias',
      value: 90
    },
    {
      name: 'Customizado',
      value: 0
    }
  ]

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

  const [data, setData] = useState(initialState)

  const [frequencyList, setFrequencyList] = useState<Frequency[]>([])
  const [disabledValidateDate, setDisabledValidateDate] = useState(true)
  const { proposal, setProposal }: ProposalProps = useContext(ProposalContext)

  const validateFloatInput = (value: string): RegExpMatchArray | null => {
    return value.match(/^[0-9]*,?[0-9]*$/)
  }

  useEffect(() => {
    if (proposal.idProposal !== undefined && proposal.idProposal !== null) {
      const validityType = !duplicateMode ? '0' : ''
      const validityDateSplit = !duplicateMode
        ? proposal.validityDate.split('T')[0].split('-')
        : ''
      const validityDateFormat = !duplicateMode
        ? `${validityDateSplit[2]}/${validityDateSplit[1]}/${validityDateSplit[0]}`
        : ''
      void new Promise<void>((resolve) => {
        setTimeout(() => resolve(), 1000)
      }).then(() => {
        setData({
          validity: validityType,
          validityDate: validityDateFormat,
          transitTime: String(proposal.transitTime),
          frequency: String(proposal.idFrequency),
          route: proposal.route,
          client: proposal.referenceClientProposal,
          freeTime: proposal.freeTime ? 'hired' : 'notHired',
          deadline: String(proposal.nrFreeTimeDaysDeadline),
          value: String(proposal.vlFreeTime),
          generalObs: proposal.generalObservations,
          internalObs: proposal.internalObservations,
          recurrency: String(proposal.recurrency),
          weeklyRecurrency: proposal.weeklyRecurrency
        })
        filledWeekValue(proposal.weeklyRecurrency)
      })
    }
  }, [])

  useEffect(() => {
    const splitedValidityDate = data.validityDate.trim().split('/')
    setProposal({
      ...proposal,
      validityDate: `${splitedValidityDate[2]}-${splitedValidityDate[1]}-${splitedValidityDate[0]}T00:00-03:00`,
      transitTime: Number(data.transitTime),
      route: data.route,
      freeTime: data.freeTime === 'hired',
      nrFreeTimeDaysDeadline: Number(data.deadline),
      vlFreeTime: Number(data.value.replace(',', '.')),
      idFrequency: Number(data.frequency),
      recurrency: Number(data.recurrency),
      weeklyRecurrency: data.weeklyRecurrency,
      generalObservations: data.generalObs,
      internalObservations: data.internalObs,
      referenceClientProposal: data.client
    })
  }, [data])

  const validateDate = (): boolean => {
    const validityDate = moment(data.validityDate, 'DD/MM/YYYY', true)
    const today = moment().startOf('day')
    return validityDate.isValid() && validityDate.isSameOrAfter(today)
  }

  const validateFreeTime = (): boolean => {
    data.value = data.value !== '0' ? data.value : ''
    return (
      modal !== 'SEA' ||
      (modal === 'SEA' && data.freeTime === 'notHired') ||
      (modal === 'SEA' &&
        specifications === 'fcl' &&
        data.freeTime === 'hired' &&
        data.deadline.length !== 0) ||
      (modal === 'SEA' &&
        specifications !== 'fcl' &&
        data.freeTime === 'hired' &&
        data.deadline.length !== 0 &&
        data.value.length !== 0)
    )
  }

  const validateCompleteInputs = (): boolean => {
    return (
      data.validity.length !== 0 &&
      data.validityDate.length !== 0 &&
      data.transitTime.length !== 0 &&
      data.frequency.length !== 0 &&
      data.recurrency.length !== 0
    )
  }

  const validateFilledInputs = (): boolean => {
    return (
      data.validity.length > 0 ||
      data.validityDate.length > 0 ||
      data.transitTime.length > 0 ||
      data.frequency !== '' ||
      data.route.length > 0 ||
      data.client.length > 0 ||
      data.freeTime.length > 0 ||
      data.deadline.length > 0 ||
      data.value.length > 0 ||
      data.generalObs.length > 0 ||
      data.internalObs.length > 0
    )
  }

  const validateFormComplete = (): void => {
    const step6 = modal === 'LAND'
    if (validateFreeTime() && validateCompleteInputs() && validateDate()) {
      setCompleted((currentState) => {
        return { ...currentState, step4: true, step6 }
      })
    } else {
      setCompleted((currentState) => {
        return { ...currentState, step4: false, step6 }
      })
    }
  }

  const validateFilled = (): void => {
    if (validateFilledInputs()) {
      setFilled((currentState) => {
        return { ...currentState, step4: true }
      })
    } else {
      setFilled((currentState) => {
        return { ...currentState, step4: false }
      })
    }
  }

  useEffect(() => {
    validateFormComplete()
    validateFilled()
  }, [data])

  useEffect(() => {
    setData(initialState)
    setDisabledValidateDate(true)
  }, [modal])

  useEffect(() => {
    void (async function () {
      await API.getFrequency()
        .then((response) => setFrequencyList(response))
        .catch((err) => console.log(err))
    })()
  }, [])

  useEffect(() => {
    if (data.freeTime === 'notHired') {
      setData({ ...data, deadline: '', value: '' })
    }
  }, [data.freeTime])

  const calculateValidityDate = (value): void => {
    if (value !== 0) {
      const myDate = new Date(
        new Date().getTime() + value * 24 * 60 * 60 * 1000
      )
      const dateFormated = myDate.toLocaleDateString('pt-BR', {
        timeZone: 'UTC'
      })
      setData({ ...data, validity: value, validityDate: dateFormated })
      setDisabledValidateDate(true)
    } else {
      setData({ ...data, validity: value, validityDate: '' })
      setDisabledValidateDate(false)
    }
  }

  const getColor = (value): any => {
    if (value === '' && invalidInput) {
      return theme?.commercial?.components?.itemModal?.redAsterisk
    }
  }

  const validateIntInput = (value: string): RegExpMatchArray | null => {
    return value.match(/^[0-9]*$/)
  }

  const weekDaysFrequency = (id: string): any => {
    const element = document.getElementById(id) as HTMLInputElement
    let weeklyValue: string

    if (element.classList.contains('disabledDay') ?? false) {
      element.classList.remove('disabledDay')
      element.classList.add('activeDay')
      element.value = '1'
      weeklyValue = weekValue()
      setData({ ...data, weeklyRecurrency: weeklyValue })
    } else {
      element.classList.remove('activeDay')
      element.classList.add('disabledDay')
      element.value = '0'
      weeklyValue = weekValue()
      setData({ ...data, weeklyRecurrency: weeklyValue })
    }
  }

  const weekValue = (): string => {
    const sunday = (document.getElementById('sunday') as HTMLInputElement).value
    const monday = (document.getElementById('monday') as HTMLInputElement).value
    const tuesday = (document.getElementById('tuesday') as HTMLInputElement)
      .value
    const wednesday = (document.getElementById('wednesday') as HTMLInputElement)
      .value
    const thursday = (document.getElementById('thursday') as HTMLInputElement)
      .value
    const friday = (document.getElementById('friday') as HTMLInputElement).value
    const saturday = (document.getElementById('saturday') as HTMLInputElement)
      .value
    let weeklyRecurrency = '0000000'

    weeklyRecurrency = `${sunday}${monday}${tuesday}${wednesday}${thursday}${friday}${saturday}`
    return weeklyRecurrency
  }

  const filledWeekValue = (weeklyRecurrency: string): void => {
    const sunday = document.getElementById('sunday') as HTMLInputElement
    const monday = document.getElementById('monday') as HTMLInputElement
    const tuesday = document.getElementById('tuesday') as HTMLInputElement
    const wednesday = document.getElementById('wednesday') as HTMLInputElement
    const thursday = document.getElementById('thursday') as HTMLInputElement
    const friday = document.getElementById('friday') as HTMLInputElement
    const saturday = document.getElementById('saturday') as HTMLInputElement

    if (weeklyRecurrency.length > 0) {
      sunday.value = weeklyRecurrency.charAt(0)
      if (sunday.value === '1') {
        sunday.classList.remove('disabledDay')
        sunday.classList.add('activeDay')
      }

      monday.value = weeklyRecurrency.charAt(1)
      if (monday.value === '1') {
        monday.classList.remove('disabledDay')
        monday.classList.add('activeDay')
      }

      tuesday.value = weeklyRecurrency.charAt(2)
      if (tuesday.value === '1') {
        tuesday.classList.remove('disabledDay')
        tuesday.classList.add('activeDay')
      }

      wednesday.value = weeklyRecurrency.charAt(3)
      if (wednesday.value === '1') {
        wednesday.classList.remove('disabledDay')
        wednesday.classList.add('activeDay')
      }

      thursday.value = weeklyRecurrency.charAt(4)
      if (thursday.value === '1') {
        thursday.classList.remove('disabledDay')
        thursday.classList.add('activeDay')
      }

      friday.value = weeklyRecurrency.charAt(5)
      if (friday.value === '1') {
        friday.classList.remove('disabledDay')
        friday.classList.add('activeDay')
      }

      saturday.value = weeklyRecurrency.charAt(6)
      if (saturday.value === '1') {
        saturday.classList.remove('disabledDay')
        saturday.classList.add('activeDay')
      }
    }
  }

  const valuesRecurrency = (e): any => {
    let value = parseInt(e.target.value, 10)
    if (value > 99) value = 99
    if (value < 1) value = 1
    setData({ ...data, recurrency: String(value) })
  }

  return (
    <Separator>
      <Title>
        4. {I18n.t('pages.newProposal.step4.title')}
        <Subtitle>{I18n.t('pages.newProposal.step4.subtitle')}</Subtitle>
      </Title>
      <FormControl variant="outlined" size="small">
        <Grid container spacing={2}>
          <Grid item xs={2}>
            <FormLabel component="legend" error={invalidInput && data.validity.length === 0}>
              {I18n.t('pages.newProposal.step4.validity')}
              <RedColorSpan> *</RedColorSpan>
            </FormLabel>
            <ControlledSelect
              labelId="validity-label"
              id="validity"
              value={data.validity}
              onChange={(e) => calculateValidityDate(e.target.value)}
              displayEmpty
              disableUnderline
              invalid={invalidInput && data.validity.length === 0}
              toolTipTitle={I18n.t('components.itemModal.requiredField')}
            >
              <MenuItem disabled value={data.validity}>
                <SelectSpan placeholder={1}>
                  {I18n.t('pages.newProposal.step4.choose')}
                </SelectSpan>
              </MenuItem>
              {validityList.map((item) => (
                <MenuItem key={item.value} value={item.value}>
                  <SelectSpan>{item.name}</SelectSpan>
                </MenuItem>
              ))}
            </ControlledSelect>
          </Grid>
          <Grid item xs={2}>
            <FormLabel component="legend">&nbsp;</FormLabel>
            <NumberInput
              id="no-label-field"
              disabled={disabledValidateDate}
              format={'##/##/####'}
              mask={['D', 'D', 'M', 'M', 'Y', 'Y', 'Y', 'Y']}
              placeholder="DD/MM/YYYY"
              customInput={ControlledInput}
              toolTipTitle={I18n.t('pages.newProposal.step4.errorMessage')}
              invalid={invalidInput && !validateDate()}
              value={data.validityDate}
              onChange={(e) =>
                setData({ ...data, validityDate: e.target.value })
              }
              variant="outlined"
              size="small"
            />
          </Grid>
          <Grid item xs={2}>
            <FormLabel component="legend">
              {I18n.t('pages.newProposal.step4.client')}
            </FormLabel>
            <ControlledInput
              id="client"
              toolTipTitle={I18n.t('components.itemModal.requiredField')}
              invalid={false}
              variant="outlined"
              onChange={(e) => setData({ ...data, client: e.target.value })}
              value={data.client}
              size="small"
            />
          </Grid>
          <Grid item xs={6} />
          <Grid item xs={2}>
            <FormLabel component="legend" error={invalidInput && data.transitTime.length === 0}>
              {I18n.t('pages.newProposal.step4.time')}
              <RedColorSpan> *</RedColorSpan>
            </FormLabel>
            <ControlledInput
              id="time"
              toolTipTitle={I18n.t('components.itemModal.requiredField')}
              invalid={invalidInput && data.transitTime.length === 0}
              variant="outlined"
              onChange={(e) =>
                validateIntInput(e.target.value) !== null &&
                setData({ ...data, transitTime: e.target.value })
              }
              value={data.transitTime}
              size="small"
            />
          </Grid>
          <Grid item xs={2}>
            <FormLabel component="legend">
              {I18n.t('pages.newProposal.step4.route')}
            </FormLabel>
            <ControlledInput
              id="route"
              toolTipTitle={I18n.t('components.itemModal.requiredField')}
              invalid={false}
              variant="outlined"
              onChange={(e) => setData({ ...data, route: e.target.value })}
              value={data.route}
              size="small"
            />
          </Grid>
          {modal === 'SEA' && (
            <Grid item xs={8} container spacing={2}>
              <Grid item xs style={{ maxWidth: '330px' }}>
                {specifications === 'fcl'
                  ? (
                    <FormLabel component="legend">
                      {I18n.t('pages.newProposal.step4.freeTimeDemurrage')}
                      <RedColorSpan> *</RedColorSpan>
                    </FormLabel>
                    )
                  : (
                    <FormLabel component="legend">
                      {I18n.t('pages.newProposal.step4.freeTimeStorage')}
                      <RedColorSpan> *</RedColorSpan>
                    </FormLabel>
                    )}
                <RadioGroup
                  row
                  aria-label="proposal type"
                  name="row-radio-buttons-group"
                  value={data.freeTime}
                  onChange={(e) =>
                    setData({ ...data, freeTime: e.target.value })
                  }
                >
                  <ControlledToolTip
                    open={invalidInput && data.freeTime.length === 0}
                    title={I18n.t('components.itemModal.requiredField')}
                  >
                    <FormControlLabel
                      value="notHired"
                      control={<StyledRadio color={getColor(data.freeTime)} />}
                      label={I18n.t('pages.newProposal.step4.notHired')}
                      style={{ marginRight: '30px' }}
                    />
                  </ControlledToolTip>
                  <ControlledToolTip
                    open={invalidInput && data.freeTime.length === 0}
                    title={I18n.t('components.itemModal.requiredField')}
                  >
                    <FormControlLabel
                      value="hired"
                      control={<StyledRadio color={getColor(data.freeTime)} />}
                      label={I18n.t('pages.newProposal.step4.hired')}
                    />
                  </ControlledToolTip>
                </RadioGroup>
              </Grid>
              {data.freeTime === 'hired' && (
                <>
                  <Grid item xs={2}>
                    <FormLabel component="legend">
                      {I18n.t('pages.newProposal.step4.deadline')}
                      <RedColorSpan> *</RedColorSpan>
                    </FormLabel>
                    <ControlledInput
                      id="deadline"
                      toolTipTitle={I18n.t(
                        'components.itemModal.requiredField'
                      )}
                      invalid={invalidInput && data.deadline.length === 0}
                      variant="outlined"
                      onChange={(e) =>
                        validateIntInput(e.target.value) !== null &&
                        setData({ ...data, deadline: e.target.value })
                      }
                      value={data.deadline}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={2}>
                    {specifications !== 'fcl' && (
                      <>
                        <FormLabel component="legend">
                          {I18n.t('pages.newProposal.step4.value')}
                          <RedColorSpan> *</RedColorSpan>
                        </FormLabel>
                        <NumberInput
                          decimalSeparator={','}
                          thousandSeparator={'.'}
                          decimalScale={2}
                          format={(value: string) =>
                            FormatNumber.rightToLeftFormatter(value, 2)
                          }
                          customInput={ControlledInput}
                          toolTipTitle={I18n.t(
                            'components.itemModal.requiredField'
                          )}
                          invalid={invalidInput && data.value === ''}
                          value={data.value}
                          onChange={(e) => {
                            validateFloatInput(e.target.value) !== null &&
                              setData({ ...data, value: e.target.value })
                          }}
                          variant="outlined"
                          size="small"
                        />
                      </>
                    )}
                  </Grid>
                </>
              )}
            </Grid>
          )}
          {modal !== 'SEA' && <Grid item xs={8} />}
          <Grid item xs={2}>
            <FormLabel component="legend">
              {I18n.t('pages.newProposal.step4.frequency')}
              <RedColorSpan> *</RedColorSpan>
            </FormLabel>
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
              <FormLabel component="span" style={{ margin: '0 0 0 10px' }}>
                {I18n.t('pages.newProposal.step4.times')}
              </FormLabel>
            </InputContainer>
          </Grid>
          <Grid item xs={2}>
            <FormLabel component="legend">&nbsp;</FormLabel>
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
          {Number(data.frequency) === 2 || Number(data.frequency) === 3
            ? (
              <Grid item xs={8}>
                <FormLabel component="legend">
                  {I18n.t('pages.newProposal.step4.customDays')}
                </FormLabel>
                <WeekContainer>
                  <WeekDay
                    id="sunday"
                    className="disabledDay"
                    value="0"
                    onClick={() => weekDaysFrequency('sunday')}
                  >
                    {I18n.t('pages.newProposal.step4.sunday')}
                  </WeekDay>
                  <WeekDay
                    id="monday"
                    className="disabledDay"
                    value="0"
                    onClick={() => weekDaysFrequency('monday')}
                  >
                    {I18n.t('pages.newProposal.step4.monday')}
                  </WeekDay>
                  <WeekDay
                    id="tuesday"
                    className="disabledDay"
                    value="0"
                    onClick={() => weekDaysFrequency('tuesday')}
                  >
                    {I18n.t('pages.newProposal.step4.tuesday')}
                  </WeekDay>
                  <WeekDay
                    id="wednesday"
                    className="disabledDay"
                    value="0"
                    onClick={() => weekDaysFrequency('wednesday')}
                  >
                    {I18n.t('pages.newProposal.step4.wednesday')}
                  </WeekDay>
                  <WeekDay
                    id="thursday"
                    className="disabledDay"
                    value="0"
                    onClick={() => weekDaysFrequency('thursday')}
                  >
                    {I18n.t('pages.newProposal.step4.thursday')}
                  </WeekDay>
                  <WeekDay
                    id="friday"
                    className="disabledDay"
                    value="0"
                    onClick={() => weekDaysFrequency('friday')}
                  >
                    {I18n.t('pages.newProposal.step4.friday')}
                  </WeekDay>
                  <WeekDay
                    id="saturday"
                    className="disabledDay"
                    value="0"
                    onClick={() => weekDaysFrequency('saturday')}
                  >
                    {I18n.t('pages.newProposal.step4.saturday')}
                  </WeekDay>
                </WeekContainer>
              </Grid>
              )
            : (
              <Grid item xs={8} />
              )}
          <Grid item xs={6}>
            <FormLabel component="legend">
              {I18n.t('pages.newProposal.step4.general')}
            </FormLabel>
            <ControlledInput
              id="general"
              toolTipTitle={I18n.t('components.itemModal.requiredField')}
              invalid={false}
              variant="outlined"
              onChange={(e) => setData({ ...data, generalObs: e.target.value })}
              value={data.generalObs}
              size="small"
              multiline
              rows={4}
            />
          </Grid>
          <Grid item xs={6}>
            <FormLabel component="legend">
              {I18n.t('pages.newProposal.step4.internal')}
            </FormLabel>
            <ControlledInput
              id="internal"
              toolTipTitle={I18n.t('components.itemModal.requiredField')}
              invalid={false}
              variant="outlined"
              onChange={(e) =>
                setData({ ...data, internalObs: e.target.value })
              }
              value={data.internalObs}
              size="small"
              multiline
              rows={4}
            />
          </Grid>
        </Grid>
      </FormControl>
    </Separator>
  )
}

export default withTheme(Step4)
