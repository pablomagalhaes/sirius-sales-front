import { Modal, Grid, FormLabel, MenuItem, TableHead, TableBody, Box } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import CloseIcon from '../../../application/icons/CloseIcon'
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

export interface LandTariffModalData {
  validity: string | null
  frequency: string
  route: string | null
  transitTime: string | null
  generalCargoDed: number | null
  generalCargoCons: number | null
  ImoCargoDed: number | null
  ImoCargoCons: number | null
  landCompany: string | null
  currency: string | null
  agent: string | null
  originDestination: string | null
}

interface LandTariffModalProps {
  dataProp: LandTariffModalData
  handleAdd: (item) => void
  open: boolean
  setClose: () => void
  title: string
}

interface Frequency {
  id: number
  description: string
}

export const initialState = {
  validity: null,
  frequency: '',
  route: null,
  transitTime: null,
  generalCargoDed: null,
  generalCargoCons: null,
  ImoCargoDed: null,
  ImoCargoCons: null,
  landCompany: null,
  currency: null,
  agent: null,
  originDestination: null
}

const LandTariffModal = ({
  dataProp,
  handleAdd,
  open,
  setClose,
  title
}: LandTariffModalProps): JSX.Element => {
  const [data, setData] = useState<LandTariffModalData>(initialState)
  const [frequencyList, setFrequencyList] = useState<Frequency[]>([])
  const [currencyList, setCurrencyList] = useState<any[]>([])
  const [invalidInput, setInvalidInput] = useState(false)

  const rgxFloat = /^[0-9]*,?[0-9]*$/
  const rgxInt = /^[0-9]*$/

  useEffect(() => {
    if (dataProp !== initialState) {
      setData(dataProp)
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
      (data.validity === null || data.validity?.length === 0) ||
        (data.frequency === null || data.frequency?.length === 0) ||
        (data.route === null || data.route?.length === 0) ||
        (data.transitTime === null || data.transitTime?.length === 0) ||
        (data.agent === null || data.agent?.length === 0) ||
        (data.originDestination === null || data.originDestination?.length === 0) ||
        (data.currency === null || data.currency?.length === 0))
  }

  const handleOnAdd = (): void => {
    if (validateData()) {
      handleAdd(data)
      handleOnClose()
    } else {
      setInvalidInput(true)
    }
  }

  return (
    <Modal open={open} onClose={handleOnClose}>
      <ModalDiv>
        <HeaderDiv>
          <Title>{title}</Title>
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
                        {I18n.t('components.tariffModal.agentAircompany')}
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
                          <span>{data.landCompany}</span>
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
                              disabled={true}
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
            <Grid item xs={3}>
              <FormLabel component="legend" error={invalidInput}>
                  {I18n.t('components.tariffModal.generalCargoDed')}<RedColorSpan> *</RedColorSpan>
                </FormLabel>
                <NumberInput
                  decimalSeparator={','}
                  thousandSeparator={'.'}
                  decimalScale={2}
                  format={(value: string) => FormatNumber.rightToLeftFormatter(value, 2)}
                  customInput={ControlledInput}
                  toolTipTitle={I18n.t('components.tariffModal.requiredField')}
                  invalid={invalidInput && data.generalCargoDed === null}
                  value={data.generalCargoDed != null ? data.generalCargoDed : ''}
                  onChange={e => { validateFloatInput(e.target.value) !== null && (setData({ ...data, generalCargoDed: e.target.value })) }}
                  variant="outlined"
                  size="small"
                  modal
                  style={{ marginRight: '3px' }}
                />
            </Grid>
            <Grid item xs={3}>
              <FormLabel component="legend" error={invalidInput}>
                  {I18n.t('components.tariffModal.generalCargoCons')}<RedColorSpan> *</RedColorSpan>
                </FormLabel>
                <NumberInput
                  decimalSeparator={','}
                  thousandSeparator={'.'}
                  decimalScale={2}
                  format={(value: string) => FormatNumber.rightToLeftFormatter(value, 2)}
                  customInput={ControlledInput}
                  toolTipTitle={I18n.t('components.tariffModal.requiredField')}
                  invalid={invalidInput && data.generalCargoCons === null}
                  value={data.generalCargoCons != null ? data.generalCargoCons : ''}
                  onChange={e => { validateFloatInput(e.target.value) !== null && (setData({ ...data, generalCargoCons: e.target.value })) }}
                  variant="outlined"
                  size="small"
                  modal
                  style={{ marginRight: '3px' }}
                />
            </Grid>
            <Grid item xs={3}>
              <FormLabel component="legend" error={invalidInput}>
                  {I18n.t('components.tariffModal.ImoCargoDed')}<RedColorSpan> *</RedColorSpan>
                </FormLabel>
                <NumberInput
                  decimalSeparator={','}
                  thousandSeparator={'.'}
                  decimalScale={2}
                  format={(value: string) => FormatNumber.rightToLeftFormatter(value, 2)}
                  customInput={ControlledInput}
                  toolTipTitle={I18n.t('components.tariffModal.requiredField')}
                  invalid={invalidInput && data.ImoCargoDed === null}
                  value={data.ImoCargoDed != null ? data.ImoCargoDed : ''}
                  onChange={e => { validateFloatInput(e.target.value) !== null && (setData({ ...data, ImoCargoDed: e.target.value })) }}
                  variant="outlined"
                  size="small"
                  modal
                  style={{ marginRight: '3px' }}
                />
            </Grid>
            <Grid item xs={3}>
              <FormLabel component="legend" error={invalidInput}>
                  {I18n.t('components.tariffModal.ImoCargoCons')}<RedColorSpan> *</RedColorSpan>
                </FormLabel>
                <NumberInput
                  decimalSeparator={','}
                  thousandSeparator={'.'}
                  decimalScale={2}
                  format={(value: string) => FormatNumber.rightToLeftFormatter(value, 2)}
                  customInput={ControlledInput}
                  toolTipTitle={I18n.t('components.tariffModal.requiredField')}
                  invalid={invalidInput && data.ImoCargoCons === null}
                  value={data.ImoCargoCons != null ? data.ImoCargoCons : ''}
                  onChange={e => { validateFloatInput(e.target.value) !== null && (setData({ ...data, ImoCargoCons: e.target.value })) }}
                  variant="outlined"
                  size="small"
                  modal
                  style={{ marginRight: '3px' }}
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
                  (data.route === null || data.route.length === 0)
                }>
                  {I18n.t('components.tariffModal.route')}
                  <RedColorSpan> *</RedColorSpan>
              </FormLabel>
              <ControlledInput
                toolTipTitle={I18n.t('components.tariffModal.requiredField')}
                invalid={
                  invalidInput &&
                  (data.route === null || data.route.length === 0)
                }
                value={data.route}
                onChange={e => setData({ ...data, route: e.target.value })}
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
              <FormLabel component="legend" error={invalidInput}>
                {I18n.t('components.tariffModal.validity')}<RedColorSpan> *</RedColorSpan>
              </FormLabel>
              <NumberInput
                id="no-label-field"
                format={'##/##/####'}
                mask={['D', 'D', 'M', 'M', 'Y', 'Y', 'Y', 'Y']}
                placeholder="DD/MM/YYYY"
                customInput={ControlledInput}
                toolTipTitle={I18n.t('components.tariffModal.requiredField')}
                invalid={invalidInput && data.validity?.length === 0}
                value={data.validity}
                onChange={(e) =>
                  setData({ ...data, validity: e.target.value })
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

export default LandTariffModal
