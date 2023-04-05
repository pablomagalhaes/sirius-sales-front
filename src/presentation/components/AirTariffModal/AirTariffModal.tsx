import { Modal, Grid, FormLabel, MenuItem, TableHead, TableBody, Box } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import CloseIcon from '../../../application/icons/CloseIcon'
import moment from 'moment'
import {
  ButtonDiv,
  ColumnDiv,
  ModalDiv,
  MainDiv,
  SelectSpan,
  StyledTable,
  StyledTableCell,
  SubDiv,
  TableBodyRow,
  TableHeadRow,
  Input
} from './AirTariffModalStyles'
import { I18n } from 'react-redux-i18n'
import ControlledInput from '../ControlledInput'
import {
  HeaderDiv,
  RedColorSpan,
  RowReverseDiv,
  Title,
  CloseIconContainer,
  RowDiv
} from '../StyledComponents/modalStyles'
import { Button } from 'fiorde-fe-components'
import { Autocomplete } from '@material-ui/lab'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown'
import { NumberInput, StyledPaper } from '../../pages/NewProposal/steps/StepsStyles'
import FormatNumber from '../../../application/utils/formatNumber'
import ControlledSelect from '../../components/ControlledSelect'
import API from '../../../infrastructure/api'

interface TariffValues {
  idTariffTypeValues: number
  value: string
}
export interface AirTariffModalData {
  minValue: TariffValues | null
  dtValidity: string | null
  frequency: string
  txRoute: string | null
  transitTime: string | null
  weight1: TariffValues | null
  weight2: TariffValues | null
  weight3: TariffValues | null
  weight4: TariffValues | null
  weight5: TariffValues | null
  currency: string | null
  agent: string | null
  originDestination: string | null
  airCompany: string | null
}

interface AirTariffModalProps {
  dataProp: any
  open: boolean
  setClose: () => void
}

interface Frequency {
  id: number
  description: string
}

export const initialState = {
  minValue: null,
  dtValidity: null,
  frequency: '',
  txRoute: null,
  transitTime: null,
  weight1: null,
  weight2: null,
  weight3: null,
  weight4: null,
  weight5: null,
  currency: null,
  agent: null,
  originDestination: null,
  airCompany: null
}

const AirTariffModal = ({
  dataProp,
  open,
  setClose
}: AirTariffModalProps): JSX.Element => {
  const [data, setData] = useState<AirTariffModalData>(initialState)
  const [frequencyList, setFrequencyList] = useState<Frequency[]>([])
  const [currencyList, setCurrencyList] = useState<any[]>([])
  const [invalidInput, setInvalidInput] = useState(false)

  const rgxFloat = /^[0-9]*,?[0-9]*$/
  const rgxInt = /^[0-9]*$/

  useEffect(() => {
    if (dataProp !== initialState) {
      const getTariffValue = (type: string): any => {
        const tariffValue = dataProp.tariffTypeValues.find(each => each.tariffType.description === type)
        if (tariffValue !== undefined) {
          const { idTariffTypeValues, value } = tariffValue
          return { idTariffTypeValues, value: value.toFixed(2) }
        }
        return { idTariffTypeValues: 0, value: 0 }
      }
      const tariff = {
        agent: dataProp.nmAgent,
        airCompany: dataProp.dsBusinessPartnerTransporter,
        transitTime: dataProp.transitTime,
        currency: dataProp.currency,
        dtValidity: new Date(dataProp.validityDate).toLocaleDateString('pt-BR'),
        minValue: getTariffValue('MINIMUN'),
        weight1: getTariffValue('UNTIL45KG'),
        weight2: getTariffValue('UNTIL100KG'),
        weight3: getTariffValue('UNTIL300KG'),
        weight4: getTariffValue('UNTIL500KG'),
        weight5: getTariffValue('UNTIL1000KG'),
        txRoute: dataProp.route,
        frequency: dataProp.frequency,
        originDestination: `${String(dataProp.origin)} > ${String(dataProp.destination)}`
      }
      setData(tariff)
    }
  }, [open])

  useEffect(() => {
    void (async function () {
      await API.getFrequency()
        .then((response) => setFrequencyList(response))
        .catch((err) => console.log(err))
    })()
    void (async function () {
      await API.getCurrencies()
        .then((response) => setCurrencyList(response))
        .catch((err) => console.log(err))
    })()
  }, [])

  const handleOnClose = (): void => {
    setData(initialState)
    setInvalidInput(false)
    setClose()
  }

  const validateFloatInput = (value: string): RegExpMatchArray | null => {
    return value.match(rgxFloat)
  }

  const validateIntInput = (value: string): RegExpMatchArray | null => {
    return value.match(rgxInt)
  }

  const validateData = (): boolean => {
    return !(
      !validateDate() ||
        (data.weight1 === null || data.weight1.value?.length === 0) ||
        (data.weight2 === null || data.weight2.value?.length === 0) ||
        (data.weight3 === null || data.weight3.value?.length === 0) ||
        (data.weight4 === null || data.weight4.value?.length === 0) ||
        (data.weight5 === null || data.weight5.value?.length === 0) ||
        (data.minValue === null || data.minValue.value?.length === 0) ||
        (data.dtValidity === null || data.dtValidity?.length === 0) ||
        (data.frequency === null || data.frequency?.length === 0) ||
        (data.txRoute === null || data.txRoute?.length === 0) ||
        (data.transitTime === null || data.transitTime?.length === 0) ||
        (data.currency === null || data.currency?.length === 0))
  }

  const handleEdit = (): void => {
    const { currency, dtValidity, frequency, txRoute, transitTime, minValue, weight1, weight2, weight3, weight4, weight5 } = data
    const splitedValidityDate = dtValidity !== null ? dtValidity.trim().split('/') : [0, 0, 0]
    const stringToNumber = (item: TariffValues): any => {
      let { idTariffTypeValues, value } = item
      if (typeof value === 'string') value = value.replace(',', '.')
      return { idTariffTypeValues, value: Number(value) }
    }
    const values = [minValue, weight1, weight2, weight3, weight4, weight5].map((value) => value !== null && stringToNumber(value))
    const params = {
      currency,
      dtValidity: `${splitedValidityDate[2]}-${splitedValidityDate[1]}-${splitedValidityDate[0]}T00:00-03:00`,
      frequency,
      txRoute,
      transitTime: Number(transitTime),
      values
    }
    void (async function () {
      await API.editTariff(dataProp.idTariff, params)
        .then((_response) => handleOnClose())
        .catch((err) => console.log(err))
    })()
  }

  const validateDate = (): boolean => {
    const validityDate = moment(data.dtValidity, 'DD/MM/YYYY', true)
    const today = moment().startOf('day')
    return validityDate.isValid() && validityDate.isSameOrAfter(today)
  }

  const handleOnAdd = (): void => {
    if (validateData()) {
      handleEdit()
    } else {
      setInvalidInput(true)
    }
  }

  const handleValues = (e, key): void => {
    if (data[key] !== null) {
      setData(
        {
          ...data,
          [key]: {
            idTariffTypeValues: data[key].idTariffTypeValues,
            value: e.target.value
          }
        }
      )
    }
  }

  return (
    <Modal open={open} onClose={handleOnClose}>
      <ModalDiv>
        <HeaderDiv>
          <Title>Detalhamento da tarifa - Aéreo</Title>
          <RowReverseDiv>
            <CloseIconContainer>
              <CloseIcon onClick={handleOnClose} />
            </CloseIconContainer>
          </RowReverseDiv>
        </HeaderDiv>
        <MainDiv>
          <Grid container spacing={2} style={{ width: '100%' }} >
            <Grid item xs={12}>
              <SubDiv>
                <StyledTable size="small">
                  <TableHead>
                    <TableHeadRow>
                      <StyledTableCell width="45%">
                        {I18n.t('components.tariffModal.agentAirCompany')}
                      </StyledTableCell>
                      <StyledTableCell width="40%" align="left">
                        {I18n.t('components.tariffModal.originDestination')}
                      </StyledTableCell>
                      <StyledTableCell width="15%" align="left">
                        {I18n.t('components.tariffModal.currency')}
                      </StyledTableCell>
                    </TableHeadRow>
                  </TableHead>
                  <TableBody>
                    <TableBodyRow>
                      <StyledTableCell width="45%" align="left">
                        <ColumnDiv>
                          <span>{data.agent}</span>
                          <span>{data.airCompany}</span>
                        </ColumnDiv>
                      </StyledTableCell>
                      <StyledTableCell width="40%" align="left">
                        {data.originDestination}
                      </StyledTableCell>
                      <StyledTableCell width="15%" align="left">
                        <RowDiv>
                          <div style={{ position: 'relative', marginRight: '14px', marginTop: '-15px' }}>
                            <Autocomplete
                              value={data.currency}
                              options={currencyList.map((option) => option.id)}
                              disabled={false}
                              onChange={(_e, value) =>
                                setData({ ...data, currency: value })
                              }
                              renderInput={(params) => (
                                <div ref={params.InputProps.ref}>
                                  <Input
                                    {...params.inputProps}
                                    width="84px"
                                    placeholder={data.currency}
                                    toolTipTitle={I18n.t('components.tariffModal.requiredField')}
                                    invalid={invalidInput && data.currency?.length === 0}
                                    disabled={false}
                                  />
                                  <Box className="dropdown">
                                    <ArrowDropDownIcon />
                                  </Box>
                                </div>
                              )}
                              PaperComponent={(params: any) => <StyledPaper {...params} />}
                            />
                          </div>
                        </RowDiv>
                      </StyledTableCell>
                        </TableBodyRow>
                  </TableBody>
                </StyledTable>
              </SubDiv>
            </Grid>
            <Grid item xs={2}>
              <FormLabel component="legend" error={invalidInput && data.minValue?.value.length === 0}>
                {I18n.t('components.tariffModal.minValue')}<RedColorSpan> *</RedColorSpan>
              </FormLabel>
              <NumberInput
                decimalSeparator={','}
                thousandSeparator={'.'}
                decimalScale={2}
                format={(value: string) => FormatNumber.rightToLeftFormatter(value, 2)}
                customInput={ControlledInput}
                toolTipTitle={I18n.t('components.tariffModal.requiredField')}
                invalid={invalidInput && data.minValue === null}
                value={data.minValue != null ? data.minValue.value : ''}
                onChange={e => { validateFloatInput(e.target.value) !== null && handleValues(e, 'minValue') }}
                variant="outlined"
                size="small"
                modal
                style={{ marginRight: '3px' }}
              />
            </Grid>
            <Grid item xs={7} container={true} spacing={1} direction="row" justify="center">
                <Grid item xs={12} md>
                <FormLabel component="legend" error={invalidInput && data.weight1?.value.length === 0} >
                  {I18n.t('components.tariffModal.weight1')}<RedColorSpan> *</RedColorSpan>
                </FormLabel>
                <NumberInput
                  decimalSeparator={','}
                  thousandSeparator={'.'}
                  decimalScale={2}
                  format={(value: string) => FormatNumber.rightToLeftFormatter(value, 2)}
                  customInput={ControlledInput}
                  toolTipTitle={I18n.t('components.tariffModal.requiredField')}
                  invalid={invalidInput && data.weight1?.value.length === 0}
                  value={data.weight1 != null ? data.weight1.value : ''}
                  onChange={e => { validateFloatInput(e.target.value) !== null && handleValues(e, 'weight1') }}
                  variant="outlined"
                  size="small"
                  modal
                />
                </Grid>
                <Grid item xs={12} md>
                <FormLabel component="legend" error={invalidInput && data.weight2?.value.length === 0} >
                  {I18n.t('components.tariffModal.weight2')}<RedColorSpan> *</RedColorSpan>
                </FormLabel>
                <NumberInput
                  decimalSeparator={','}
                  thousandSeparator={'.'}
                  decimalScale={2}
                  format={(value: string) => FormatNumber.rightToLeftFormatter(value, 2)}
                  customInput={ControlledInput}
                  toolTipTitle={I18n.t('components.tariffModal.requiredField')}
                  invalid={invalidInput && data.weight2?.value.length === 0}
                  value={data.weight2 != null ? data.weight2.value : ''}
                  onChange={e => { validateFloatInput(e.target.value) !== null && handleValues(e, 'weight2') }}
                  variant="outlined"
                  size="small"
                  modal
                />
                </Grid>
                <Grid item xs={12} md>
                <FormLabel component="legend" error={invalidInput && data.weight3?.value.length === 0} >
                  {I18n.t('components.tariffModal.weight3')}<RedColorSpan> *</RedColorSpan>
                </FormLabel>
                <NumberInput
                  decimalSeparator={','}
                  thousandSeparator={'.'}
                  decimalScale={2}
                  format={(value: string) => FormatNumber.rightToLeftFormatter(value, 2)}
                  customInput={ControlledInput}
                  toolTipTitle={I18n.t('components.tariffModal.requiredField')}
                  invalid={invalidInput && data.weight3?.value.length === 0}
                  value={data.weight3 != null ? data.weight3.value : ''}
                  onChange={e => { validateFloatInput(e.target.value) !== null && handleValues(e, 'weight3') }}
                  variant="outlined"
                  size="small"
                  modal
                />
                </Grid>
                <Grid item xs={12} md>
                <FormLabel component="legend" error={invalidInput && data.weight4?.value.length === 0} >
                  {I18n.t('components.tariffModal.weight4')}<RedColorSpan> *</RedColorSpan>
                </FormLabel>
                <NumberInput
                  decimalSeparator={','}
                  thousandSeparator={'.'}
                  decimalScale={2}
                  format={(value: string) => FormatNumber.rightToLeftFormatter(value, 2)}
                  customInput={ControlledInput}
                  toolTipTitle={I18n.t('components.tariffModal.requiredField')}
                  invalid={invalidInput && data.weight4?.value.length === 0}
                  value={data.weight4 != null ? data.weight4.value : ''}
                  onChange={e => { validateFloatInput(e.target.value) !== null && handleValues(e, 'weight4') }}
                  variant="outlined"
                  size="small"
                  modal
                />
                </Grid>
                <Grid item xs={12} md>
                <FormLabel component="legend" error={invalidInput && data.weight5?.value.length === 0} >
                  {I18n.t('components.tariffModal.weight5')}<RedColorSpan> *</RedColorSpan>
                </FormLabel>
                <NumberInput
                  decimalSeparator={','}
                  thousandSeparator={'.'}
                  decimalScale={2}
                  format={(value: string) => FormatNumber.rightToLeftFormatter(value, 2)}
                  customInput={ControlledInput}
                  toolTipTitle={I18n.t('components.tariffModal.requiredField')}
                  invalid={invalidInput && data.weight5?.value.length === 0}
                  value={data.weight5 != null ? data.weight5.value : ''}
                  onChange={e => { validateFloatInput(e.target.value) !== null && handleValues(e, 'weight5') }}
                  variant="outlined"
                  size="small"
                  modal
                  style={{ marginRight: '3px' }}
                />
                </Grid>
            </Grid>
            <Grid item xs={3}>
              <FormLabel component="legend" error={invalidInput && (data.dtValidity?.length === 0 || !validateDate())}>
                {I18n.t('components.tariffModal.validity')}<RedColorSpan> *</RedColorSpan>
              </FormLabel>
              <NumberInput
                id="no-label-field"
                format={'##/##/####'}
                mask={['D', 'D', 'M', 'M', 'Y', 'Y', 'Y', 'Y']}
                placeholder="DD/MM/YYYY"
                customInput={ControlledInput}
                toolTipTitle={I18n.t('components.tariffModal.requiredField')}
                invalid={invalidInput && (data.dtValidity?.length === 0 || !validateDate())}
                value={data.dtValidity}
                onChange={(e) =>
                  setData({ ...data, dtValidity: e.target.value })
                }
                variant="outlined"
                size="small"
                modal
              />
            </Grid>
            <Grid item xs={2}>
              <FormLabel component="legend">
                {I18n.t('components.tariffModal.frequency')}
                <RedColorSpan> *</RedColorSpan>
              </FormLabel>
              <ControlledSelect
                labelId="frequency-label"
                id="frequency"
                value={data.frequency}
                onChange={(e) => setData({ ...data, frequency: e.target.value })}
                displayEmpty
                disableUnderline
                invalid={invalidInput && data.frequency?.length === 0}
                toolTipTitle={I18n.t('components.tariffModal.requiredField')}
              >
                <MenuItem disabled value={data.frequency}>
                  <SelectSpan placeholder={1}>
                    {I18n.t('components.tariffModal.choose')}
                  </SelectSpan>
                </MenuItem>
                {frequencyList.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    <SelectSpan>{item.description}</SelectSpan>
                  </MenuItem>
                ))}
              </ControlledSelect>
            </Grid>
            <Grid item xs={2}>
              <FormLabel
                component="legend"
                error={
                  invalidInput &&
                  (data.txRoute === null || data.txRoute.length === 0)
                }>
                  {I18n.t('components.tariffModal.route')}
                  <RedColorSpan> *</RedColorSpan>
              </FormLabel>
              <ControlledInput
                toolTipTitle={I18n.t('components.tariffModal.requiredField')}
                invalid={
                  invalidInput &&
                  (data.txRoute === null || data.txRoute.length === 0)
                }
                value={data.txRoute}
                onChange={e => setData({ ...data, txRoute: e.target.value })}
                variant="outlined"
                size="small"
                modal
              />
            </Grid>
            <Grid item xs={3}>
              <FormLabel
                component="legend"
                error={
                  invalidInput &&
                  (data.transitTime === null || data.transitTime?.length === 0)
                }>
                  {I18n.t('components.tariffModal.transitTime')}
                  <RedColorSpan> *</RedColorSpan>
              </FormLabel>
              <ControlledInput
                toolTipTitle={I18n.t('components.tariffModal.requiredField')}
                invalid={
                  invalidInput &&
                  (data.transitTime === null || data.transitTime?.length === 0)
                }
                value={data.transitTime}
                onChange={e => { validateIntInput(e.target.value) !== null && (setData({ ...data, transitTime: e.target.value })) }}
                variant="outlined"
                size="small"
                modal
              />
            </Grid>
            </Grid>
            <Grid item xs={12} container={true} direction="row" justify="flex-end">
              <Grid item xs={10}>
                <ButtonDiv>
                  <Button
                    disabled={false}
                    text={I18n.t('components.tariffModal.cancel')}
                    tooltip={I18n.t('components.tariffModal.cancel')}
                    backgroundGreen={false}
                    icon=""
                    onAction={handleOnClose}
                  />
                </ButtonDiv>
              </Grid>
              <Grid item xs={2}>
                <ButtonDiv>
                  <Button
                    disabled={false}
                    text={I18n.t('components.tariffModal.save')}
                    tooltip={I18n.t('components.tariffModal.save')}
                    backgroundGreen={true}
                    icon=""
                    onAction={handleOnAdd}
                  />
                </ButtonDiv>
              </Grid>
            </Grid>
        </MainDiv>
      </ModalDiv>
    </Modal >
  )
}

export default AirTariffModal
