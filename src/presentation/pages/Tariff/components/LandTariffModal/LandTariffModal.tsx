import { Modal, Grid, FormLabel, MenuItem, TableHead, TableBody, Box } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import CloseIcon from '../../../../../application/icons/CloseIcon'
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
} from './LandTariffModalStyles'
import { I18n } from 'react-redux-i18n'
import ControlledInput from '../../../../components/ControlledInput'
import {
  HeaderDiv,
  RedColorSpan,
  RowReverseDiv,
  Title,
  CloseIconContainer,
  RowDiv
} from '../../../../components/StyledComponents/modalStyles'
import { Button } from 'fiorde-fe-components'
import { Autocomplete } from '@material-ui/lab'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown'
import { NumberInput, StyledPaper } from '../../../NewProposal/steps/StepsStyles'
import FormatNumber from '../../../../../application/utils/formatNumber'
import ControlledSelect from '../../../../components/ControlledSelect'
import API from '../../../../../infrastructure/api'
import { useCurrencies, useFrequency } from '../../../../hooks'
import { TariffItemsTypes } from '../../../../../application/enum/tariffEnum'

import {
  TARIFF_LAND_TARIFF_MODAL_SPAN_AGENT,
  TARIFF_LAND_TARIFF_MODAL_SPAN_COMPANY,
  TARIFF_LAND_TARIFF_MODAL_SELECT_CURRENCY,
  TARIFF_LAND_TARIFF_MODAL_INPUT_GENERALCARGODED,
  TARIFF_LAND_TARIFF_MODAL_INPUT_GENERALCARGOCONS,
  TARIFF_LAND_TARIFF_MODAL_INPUT_IMOCARGODED,
  TARIFF_LAND_TARIFF_MODAL_INPUT_IMOCARGOCONS,
  TARIFF_LAND_TARIFF_MODAL_SELECT_FREQUENCY,
  TARIFF_LAND_TARIFF_MODAL_INPUT_TXROUTE,
  TARIFF_LAND_TARIFF_MODAL_INPUT_TRANSITTIME,
  TARIFF_LAND_TARIFF_MODAL_INPUT_DTVALIDITY,
  TARIFF_LAND_TARIFF_MODAL_BUTTON_CANCEL,
  TARIFF_LAND_TARIFF_MODAL_BUTTON_SAVE
} from '../../../../../ids'
interface TariffValues {
  idTariffTypeValues: number
  value: string
}
export interface LandTariffModalData {
  dtValidity: string | null
  frequency: string
  txRoute: string | null
  transitTime: string | null
  generalCargoDed: TariffValues | null
  generalCargoCons: TariffValues | null
  imoCargoDed: TariffValues | null
  imoCargoCons: TariffValues | null
  landCompany: string | null
  currency: string | null
  agent: string | null
  originDestination: string | null
}

interface LandTariffModalProps {
  dataProp: any
  open: boolean
  setClose: () => void
}

export const initialState = {
  dtValidity: null,
  frequency: '',
  txRoute: null,
  transitTime: null,
  generalCargoDed: null,
  generalCargoCons: null,
  imoCargoDed: null,
  imoCargoCons: null,
  landCompany: null,
  currency: null,
  agent: null,
  originDestination: null
}

const LandTariffModal = ({
  dataProp,
  open,
  setClose
}: LandTariffModalProps): JSX.Element => {
  const [data, setData] = useState<LandTariffModalData>(initialState)
  const { data: frequencyList = [] } = useFrequency()
  const { data: currencyList = [] } = useCurrencies()
  const [invalidInput, setInvalidInput] = useState(false)

  const rgxFloat = /^[0-9]*,?[0-9]*$/
  const rgxInt = /^[0-9]*$/

  const MaxLength = {
    maxLength: 13
  }

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
        landCompany: dataProp.dsBusinessPartnerTransporter,
        transitTime: dataProp.transitTime,
        currency: dataProp.currency,
        dtValidity: new Date(dataProp.validityDate).toLocaleDateString('pt-BR'),
        generalCargoDed: getTariffValue(TariffItemsTypes.Vlgeneralded),
        generalCargoCons: getTariffValue(TariffItemsTypes.Vlgeneralcons),
        imoCargoDed: getTariffValue(TariffItemsTypes.Vlimoded),
        imoCargoCons: getTariffValue(TariffItemsTypes.Vlimocons),
        txRoute: dataProp.route,
        frequency: dataProp.frequency,
        originDestination: `${String(dataProp.originCity)} > ${String(dataProp.destinationCity)}`
      }
      setData(tariff)
    }
  }, [open])

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
      (data.generalCargoDed === null || data.generalCargoDed.value?.length === 0) ||
      (data.generalCargoCons === null || data.generalCargoCons.value?.length === 0) ||
      (data.imoCargoDed === null || data.imoCargoDed.value?.length === 0) ||
      (data.imoCargoCons === null || data.imoCargoCons.value?.length === 0) ||
      (data.dtValidity === null || data.dtValidity?.length === 0) ||
      (data.frequency === null || data.frequency?.length === 0) ||
      (data.txRoute === null || data.txRoute?.length === 0) ||
      (data.transitTime === null || data.transitTime?.length === 0) ||
      (data.currency === null || data.currency?.length === 0))
  }

  const handleEdit = (): void => {
    const { currency, dtValidity, frequency, txRoute, transitTime, generalCargoDed, generalCargoCons, imoCargoDed, imoCargoCons } = data
    const splitedValidityDate = dtValidity !== null ? dtValidity.trim().split('/') : [0, 0, 0]
    const stringToNumber = (item: TariffValues): any => {
      let { idTariffTypeValues, value } = item
      if (typeof value === 'string') value = value.replace(',', '.')
      return { idTariffTypeValues, value: Number(value) }
    }
    const values = [generalCargoDed, generalCargoCons, imoCargoDed, imoCargoCons].map((value) => value !== null && stringToNumber(value))
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
          <Title>{I18n.t('pages.tariff.titles.land')}</Title>
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
                        {I18n.t('components.tariffModal.agentLandCompany')}
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
                          <span id={TARIFF_LAND_TARIFF_MODAL_SPAN_AGENT}>{data.agent}</span>
                          <span id={TARIFF_LAND_TARIFF_MODAL_SPAN_COMPANY}>{data.landCompany}</span>
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
                                    id={TARIFF_LAND_TARIFF_MODAL_SELECT_CURRENCY}
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
            <Grid item xs={3}>
              <FormLabel component="legend" error={invalidInput && data.generalCargoDed?.value.length === 0}>
                  {I18n.t('components.tariffModal.generalCargoDed')}<RedColorSpan> *</RedColorSpan>
                </FormLabel>
                <NumberInput
                  id={TARIFF_LAND_TARIFF_MODAL_INPUT_GENERALCARGODED}
                  decimalSeparator={','}
                  thousandSeparator={'.'}
                  decimalScale={2}
                  format={(value: string) => FormatNumber.rightToLeftFormatter(value, 2)}
                  customInput={ControlledInput}
                  toolTipTitle={I18n.t('components.tariffModal.requiredField')}
                  invalid={invalidInput && data.generalCargoDed?.value.length === 0}
                  value={data.generalCargoDed != null ? data.generalCargoDed.value : ''}
                  onChange={e => { validateFloatInput(e.target.value) !== null && handleValues(e, 'generalCargoDed') }}
                  variant="outlined"
                  size="small"
                  modal
                  inputProps={MaxLength}
                  style={{ marginRight: '3px' }}
                />
            </Grid>
            <Grid item xs={3}>
              <FormLabel component="legend" error={invalidInput && data.generalCargoCons?.value.length === 0}>
                  {I18n.t('components.tariffModal.generalCargoCons')}<RedColorSpan> *</RedColorSpan>
                </FormLabel>
                <NumberInput
                  id={TARIFF_LAND_TARIFF_MODAL_INPUT_GENERALCARGOCONS}
                  decimalSeparator={','}
                  thousandSeparator={'.'}
                  decimalScale={2}
                  format={(value: string) => FormatNumber.rightToLeftFormatter(value, 2)}
                  customInput={ControlledInput}
                  toolTipTitle={I18n.t('components.tariffModal.requiredField')}
                  invalid={invalidInput && data.generalCargoCons?.value.length === 0}
                  value={data.generalCargoCons != null ? data.generalCargoCons.value : ''}
                  onChange={e => { validateFloatInput(e.target.value) !== null && handleValues(e, 'generalCargoCons') }}
                  variant="outlined"
                  size="small"
                  modal
                  inputProps={MaxLength}
                  style={{ marginRight: '3px' }}
                />
            </Grid>
            <Grid item xs={3}>
              <FormLabel component="legend" error={invalidInput && data.imoCargoDed?.value.length === 0}>
                  {I18n.t('components.tariffModal.ImoCargoDed')}<RedColorSpan> *</RedColorSpan>
                </FormLabel>
                <NumberInput
                  id={TARIFF_LAND_TARIFF_MODAL_INPUT_IMOCARGODED}
                  decimalSeparator={','}
                  thousandSeparator={'.'}
                  decimalScale={2}
                  format={(value: string) => FormatNumber.rightToLeftFormatter(value, 2)}
                  customInput={ControlledInput}
                  toolTipTitle={I18n.t('components.tariffModal.requiredField')}
                  invalid={invalidInput && data.imoCargoDed?.value.length === 0}
                  value={data.imoCargoDed != null ? data.imoCargoDed.value : ''}
                  onChange={e => { validateFloatInput(e.target.value) !== null && handleValues(e, 'imoCargoDed') }}
                  variant="outlined"
                  size="small"
                  modal
                  inputProps={MaxLength}
                  style={{ marginRight: '3px' }}
                />
            </Grid>
            <Grid item xs={3}>
              <FormLabel component="legend" error={invalidInput && data.imoCargoCons?.value.length === 0}>
                  {I18n.t('components.tariffModal.ImoCargoCons')}<RedColorSpan> *</RedColorSpan>
                </FormLabel>
                <NumberInput
                  id={TARIFF_LAND_TARIFF_MODAL_INPUT_IMOCARGOCONS}
                  decimalSeparator={','}
                  thousandSeparator={'.'}
                  decimalScale={2}
                  format={(value: string) => FormatNumber.rightToLeftFormatter(value, 2)}
                  customInput={ControlledInput}
                  toolTipTitle={I18n.t('components.tariffModal.requiredField')}
                  invalid={invalidInput && data.imoCargoCons?.value.length === 0}
                  value={data.imoCargoCons != null ? data.imoCargoCons.value : ''}
                  onChange={e => { validateFloatInput(e.target.value) !== null && handleValues(e, 'imoCargoCons') }}
                  variant="outlined"
                  size="small"
                  modal
                  inputProps={MaxLength}
                  style={{ marginRight: '3px' }}
                />
            </Grid>
            <Grid item xs={2}>
              <FormLabel component="legend" error={invalidInput && (data.frequency === null || data.frequency?.length === 0)}>
                {I18n.t('components.tariffModal.frequency')}
                <RedColorSpan> *</RedColorSpan>
              </FormLabel>
              <ControlledSelect
                id={TARIFF_LAND_TARIFF_MODAL_SELECT_FREQUENCY}
                labelId="frequency-label"
                value={data.frequency}
                onChange={(e) => setData({ ...data, frequency: e.target.value })}
                displayEmpty
                disableUnderline
                invalid={invalidInput && (data.frequency === null || data.frequency?.length === 0)}
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
                id={TARIFF_LAND_TARIFF_MODAL_INPUT_TXROUTE}
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
                  (data.transitTime === null || data.transitTime.length === 0)
                }>
                  {I18n.t('components.tariffModal.transitTime')}
                  <RedColorSpan> *</RedColorSpan>
              </FormLabel>
              <ControlledInput
                id={TARIFF_LAND_TARIFF_MODAL_INPUT_TRANSITTIME}
                toolTipTitle={I18n.t('components.tariffModal.requiredField')}
                invalid={
                  invalidInput &&
                  (data.transitTime === null || data.transitTime.length === 0)
                }
                value={data.transitTime}
                onChange={e => { validateIntInput(e.target.value) !== null && (setData({ ...data, transitTime: e.target.value })) }}
                variant="outlined"
                size="small"
                modal
              />
            </Grid>
            <Grid item xs={3}>
              <FormLabel component="legend" error={invalidInput && (data.dtValidity?.length === 0 || !validateDate())}>
                {I18n.t('components.tariffModal.validity')}<RedColorSpan> *</RedColorSpan>
              </FormLabel>
              <NumberInput
                id={TARIFF_LAND_TARIFF_MODAL_INPUT_DTVALIDITY}
                format={'##/##/####'}
                mask={['D', 'D', 'M', 'M', 'Y', 'Y', 'Y', 'Y']}
                placeholder="DD/MM/YYYY"
                customInput={ControlledInput}
                toolTipTitle={I18n.t('components.tariffModal.dateInvalid')}
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
            </Grid>
            <Grid item xs={12} container={true} direction="row" justify="flex-end">
              <Grid item xs={10}>
                <ButtonDiv>
                  <Button
                    id={TARIFF_LAND_TARIFF_MODAL_BUTTON_CANCEL}
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
                    id={TARIFF_LAND_TARIFF_MODAL_BUTTON_SAVE}
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

export default LandTariffModal
