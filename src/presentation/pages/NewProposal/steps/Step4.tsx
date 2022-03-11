import React, { useEffect, useState } from 'react'
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  MenuItem,
  RadioGroup
} from '@material-ui/core/'
import { I18n } from 'react-redux-i18n'
import { Title, Subtitle, Separator, SelectSpan, StyledRadio } from '../style'
import ControlledSelect from '../../../components/ControlledSelect'
import ControlledInput from '../../../components/ControlledInput'
import ControlledToolTip from '../../../components/ControlledToolTip/ControlledToolTip'
import { RedColorSpan } from '../../../components/StyledComponents/modalStyles'
import newProposal from '../../../../infrastructure/api/newProposalService'
import NumberFormat from 'react-number-format'
import { withTheme } from 'styled-components'

interface Step4Props {
  invalidInput: boolean
  setCompleted: (completed: any) => void
  theme?: any
}

interface Frequency {
  id: number
  description: string
}

const Step4 = ({
  invalidInput,
  setCompleted,
  theme
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

  const [data, setData] = useState({
    validity: '',
    validityDate: '',
    transitTime: '',
    frequency: '',
    route: '',
    client: '',
    currency: '',
    freeTime: '',
    deadline: '',
    generalObs: '',
    internalObs: ''
  })

  const [frequencyList, setFrequencyList] = useState<Frequency[]>([])
  const [disabledValidateDate, setDisabledValidateDate] = useState(true)

  useEffect(() => {
    if (
      data.validity.length !== 0 &&
      data.validityDate.length !== 0 &&
      data.transitTime.length !== 0 &&
      data.frequency.length !== 0
    ) {
      setCompleted((currentState) => {
        return { ...currentState, step4: true }
      })
    } else {
      setCompleted((currentState) => {
        return { ...currentState, step4: false }
      })
    }
  }, [data])

  useEffect(() => {
    void (async function () {
      await newProposal
        .getFrequency()
        .then((response) => setFrequencyList(response))
        .catch((err) => console.log(err))
    })()
  }, [])

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
      console.log(theme?.commercial?.components?.itemModal?.redAsterisk)
      return theme?.commercial?.components?.itemModal?.redAsterisk
    }
  }

  const validateIntInput = (value: string): RegExpMatchArray | null => {
    return value.match(/^[0-9]*$/)
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
            <FormLabel component="legend">
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
            <NumberFormat
              id="no-label-field"
              disabled={disabledValidateDate}
              format={'##/##/####'}
              mask={['D', 'D', 'M', 'M', 'Y', 'Y', 'Y', 'Y']}
              placeholder="DD/MM/YYYY"
              customInput={ControlledInput}
              toolTipTitle={I18n.t('components.itemModal.requiredField')}
              invalid={invalidInput && data.validityDate.length === 0}
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
            <FormLabel component="legend">
              {I18n.t('pages.newProposal.step4.time')}
              <RedColorSpan> *</RedColorSpan>
            </FormLabel>
            <ControlledInput
              id="time"
              toolTipTitle={I18n.t('components.itemModal.requiredField')}
              invalid={invalidInput && data.transitTime.length === 0}
              variant="outlined"
              onChange={(e) => validateIntInput(e.target.value) !== null && (setData({ ...data, transitTime: e.target.value }))}
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

          <Grid item xs={4}>
            <FormLabel component="legend">
              {I18n.t('pages.newProposal.step4.freeTime')}
              <RedColorSpan> *</RedColorSpan>
            </FormLabel>
            <RadioGroup
              row
              aria-label="proposal type"
              name="row-radio-buttons-group"
              value={data.freeTime}
              onChange={(e) => setData({ ...data, freeTime: e.target.value })}
            >
              <ControlledToolTip
                open={invalidInput && data.freeTime.length === 0}
                title={I18n.t('components.itemModal.requiredField')}
              >
                <FormControlLabel
                  value="hired"
                  control={<StyledRadio color={getColor(data.freeTime)} />}
                  label={I18n.t('pages.newProposal.step4.hired')}
                  style={{ marginRight: '30px' }}
                />
              </ControlledToolTip>
              <ControlledToolTip
                open={invalidInput && data.freeTime.length === 0}
                title={I18n.t('components.itemModal.requiredField')}
              >
                <FormControlLabel
                  value="notHired"
                  control={<StyledRadio color={getColor(data.freeTime)} />}
                  label={I18n.t('pages.newProposal.step4.notHired')}
                />
              </ControlledToolTip>
            </RadioGroup>
          </Grid>
          <Grid item xs={2}>
            { data.freeTime === 'hired' && (
              <><FormLabel component="legend">{I18n.t('pages.newProposal.step4.deadline')}<RedColorSpan> *</RedColorSpan></FormLabel>
                <ControlledInput
                id="deadline"
                toolTipTitle={I18n.t('components.itemModal.requiredField')}
                invalid={invalidInput && data.deadline.length === 0}
                variant="outlined"
                onChange={(e) => validateIntInput(e.target.value) !== null && (setData({ ...data, deadline: e.target.value }))}
                value={data.deadline}
                size="small" />
              </>
            )}
          </Grid>

          <Grid item xs={2} />
          <Grid item xs={2}>
            <FormLabel component="legend">
              {I18n.t('pages.newProposal.step4.frequency')}
              <RedColorSpan> *</RedColorSpan>
            </FormLabel>
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
          <Grid item xs={8} />
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
