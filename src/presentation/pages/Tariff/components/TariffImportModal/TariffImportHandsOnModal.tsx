import {
  Modal,
  Grid,
  FormLabel,
  InputAdornment,
  Box
} from '@material-ui/core'
import React, { useState } from 'react'
import CloseIcon from '../../../../../application/icons/CloseIcon'
import Autocomplete, {
  createFilterOptions
} from '@material-ui/lab/Autocomplete'
import ControlledInput from '../../../../components/ControlledInput'
import IconComponent from '../../../../../application/icons/IconComponent'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown'
import {
  StyledPaper,
  CloseButtonDiv,
  ModalDiv,
  MainDiv,
  Input
} from './TariffImportModalStyles'
import { I18n } from 'react-redux-i18n'
import {
  HeaderDiv,
  RedColorSpan,
  RowReverseDiv,
  Title,
  CloseIconContainer
} from '../../../../components/StyledComponents/modalStyles'
import { Button } from 'fiorde-fe-components'
import { usePartnerList, useOriginDestination,useBusinessPartnerByType, useCurrencies } from '../../../../hooks'
import { OriginDestinyTypes } from '../../../../../application/enum/enum'
import { NumberInput } from '../../../NewProposal/steps/StepsStyles'
import FormatNumber from '../../../../../application/utils/formatNumber'

interface AgentType {
  name: string
  id: number | null | undefined
}

interface TariffValues {
  idTariffTypeValues: number
  value: string
}

export interface TariffUploadData {
  agent: AgentType
  origin: string
  destiny: string,
  airCompany: AgentType
  weight1: TariffValues | null
  weight2: TariffValues | null
  weight3: TariffValues | null
  weight4: TariffValues | null
  weight5: TariffValues | null
  minValue: TariffValues | null
  currency: string | null
}

interface TariffUploadProps {
  theme?: any
  open: boolean
  setClose: () => void
}

export const initialState = {
  agent: { name: '', id: null },
  origin: '',
  destiny: '',
  airCompany: { name: '', id: null },
  weight1: null,
  weight2: null,
  weight3: null,
  weight4: null,
  weight5: null,
  currency: null,
  minValue: null
}

const TariffImportHandsOnModal = ({
  theme,
  open,
  setClose
}: TariffUploadProps): JSX.Element => {
  const { partnerList: agentsList } = usePartnerList()
  const { data: originDestinationList = [] } = useOriginDestination()
  const { airPartners } = useBusinessPartnerByType()
  const { data: currencyList = [] } = useCurrencies()

  const [data, setData] = useState<TariffUploadData>(initialState)
  const [invalidInput, setInvalidInput] = useState(false)

  const filterOptions = createFilterOptions({
    matchFrom: 'any',
    limit: 500
  })

  const handleOnClose = (): void => {
    setData(initialState)
    setInvalidInput(false)
    setClose()
  }

  const validateData = (): boolean => {
    return !(
      (data.origin?.length === 0) ||
      (data.destiny?.length === 0) ||
      (data.agent.id === null) ||
      (data.airCompany.id === null) ||
      (data.weight1 === null || data.weight1.value?.length === 0) ||
      (data.weight2 === null || data.weight2.value?.length === 0) ||
      (data.weight3 === null || data.weight3.value?.length === 0) ||
      (data.weight4 === null || data.weight4.value?.length === 0) ||
      (data.weight5 === null || data.weight5.value?.length === 0) ||
      (data.minValue === null || data.minValue.value?.length === 0)
    )
  }

  const getOriginDestinyList = (): string[] => {
    const actualList: string[] = []
    originDestinationList?.forEach((item: any): void => {
      if (item.type === OriginDestinyTypes.Airport) {
        actualList.push(`${String(item.id)} - ${String(item.name)}`)
      }
    })
    return actualList
  }

  const addOn = (): void => {
    if(validateData() === false) setInvalidInput(true)
    else {
        console.log(data)
        handleOnClose()
    }
  }
  const rgxFloat = /^[0-9]*,?[0-9]*$/

  const validateFloatInput = (value: string): RegExpMatchArray | null => {
    return value.match(rgxFloat)
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
          <Title>{I18n.t('pages.tariff.tariffImport.title')}/{I18n.t('pages.tariff.tariffImport.subtitle')}</Title>
          <RowReverseDiv>
            <CloseIconContainer>
              <CloseIcon onClick={handleOnClose} />
            </CloseIconContainer>
          </RowReverseDiv>
        </HeaderDiv>
        <MainDiv>
          <Grid container spacing={5}>
            <Grid item xs={6}>
            <FormLabel component="legend" error={
              (invalidInput && data.origin.length === 0)
            }>
                {I18n.t('pages.tariff.tariffImport.origin')}
            </FormLabel>
            <Autocomplete
              freeSolo
              onChange={(e, newValue) =>
                setData({ ...data, origin: String(newValue ?? '') })
              }
              options={getOriginDestinyList()}
              filterOptions={filterOptions}
              value={data.origin}
              disabled={false}
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
                    invalid={invalidInput && data.origin.length === 0}
                    variant="outlined"
                    size="small"
                    placeholder=''
                    $space
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconComponent
                            name="arrow"
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
            </Grid>
            <Grid item xs={6}>
            <FormLabel component="legend" error={
              (invalidInput && data.destiny.length === 0)
            }>
                {I18n.t('pages.tariff.tariffImport.destiny')}
            </FormLabel>
            <Autocomplete
              freeSolo
              onChange={(e, newValue) =>
                setData({ ...data, destiny: String(newValue ?? '') })
              }
              options={getOriginDestinyList()}
              filterOptions={filterOptions}
              value={data.destiny}
              disabled={false}
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
                    invalid={invalidInput && data.destiny.length === 0}
                    variant="outlined"
                    size="small"
                    placeholder=''
                    $space
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconComponent
                            name="arrow"
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
            </Grid>
            <Grid item xs={6} style={{marginTop: '-45px'}}>
            <FormLabel component="legend" error={
              (invalidInput && data.agent.id === null)
            }>
                {I18n.t('pages.tariff.tariffImport.agent')}
            </FormLabel>
            <Autocomplete
              freeSolo
              options={agentsList.map((item: any) => item.simpleName)}
              onChange={(_e, newValue): void => {
                const { simpleName: name, id } = agentsList.find((item: any) => item.simpleName === newValue)
                setData((data) => ({
                  ...data,
                  agent: { name, id }
                }))
              }}
              value={data.agent.name}
              renderInput={(params) => (
                <div ref={params.InputProps.ref}>
                  <ControlledInput
                    {...params}
                    id="search-client"
                    toolTipTitle={
                        invalidInput
                          ? I18n.t('components.itemModal.requiredField')
                          : ''
                      }
                    invalid={invalidInput && data.agent.id === null}
                    variant="outlined"
                    size="small"
                    placeholder=""
                    $space
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconComponent
                            name="arrow"
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
            <Grid item xs={6} style={{marginTop: '-45px'}}>
            <FormLabel component="legend" error={
              (invalidInput && data.airCompany.id === null)
            }>
                {I18n.t('pages.tariff.tariffImport.table.airCompany')}
            </FormLabel>
            <Autocomplete
              disabled={false}
              size="small"
              closeIcon={null}
              options={airPartners.map(
                (item) => item.businessPartner.simpleName
              )}
              onChange={(_e, newValue) => {
                const { simpleName: name, id } = airPartners.find((item: any) => item.simpleName === newValue)
                setData((data) => ({
                  ...data,
                  airCompany: { name, id }
                }))
              }}
              value={data.airCompany.name}
              renderInput={(params: any) => (
                <div ref={params.InputProps.ref}>
                  <ControlledInput
                    {...params}
                    id="search-name"
                    toolTipTitle={I18n.t(
                      'components.itemModal.requiredField'
                    )}
                    value={data.airCompany.name}
                    invalid={
                      invalidInput &&
                      data.airCompany.id === null
                    }
                    variant="outlined"
                    placeholder=""
                    $space
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconComponent name="arrow" defaultColor={theme?.commercial?.pages?.newProposal?.subtitle} />
                        </InputAdornment>
                      )
                    }}
                  />
                </div>
              )} />
            </Grid>
          </Grid>
          <Grid item xs={12} container={true} spacing={1} direction="row" justify="center">
          <Grid item xs={12} md>
              <FormLabel component="legend" error={invalidInput && data.minValue?.value.length === 0}>
                {I18n.t('components.tariffModal.currency')}
              </FormLabel>
              <Autocomplete
                style={{marginTop: '-12px'}}
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
            </Grid>
            <Grid item xs={12} md>
              <FormLabel component="legend" error={invalidInput && data.minValue?.value.length === 0}>
                {I18n.t('components.tariffModal.minValue')}
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
            <Grid item xs={12} md>
              <FormLabel component="legend" error={invalidInput && data.weight1?.value.length === 0} >
                {I18n.t('components.tariffModal.weight1')}
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
                {I18n.t('components.tariffModal.weight2')}
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
                {I18n.t('components.tariffModal.weight3')}
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
                {I18n.t('components.tariffModal.weight4')}
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
                {I18n.t('components.tariffModal.weight5')}
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
        <Grid item xs={12} container={true} direction="row" justify="flex-end" alignItems="center">
          <Grid item>
            <CloseButtonDiv>
              <Button
                disabled={false}
                text={I18n.t('pages.tariff.tariffImport.closeButtonLabel')}
                tooltip={I18n.t('pages.tariff.tariffImport.closeButtonLabel')}
                backgroundGreen={false}
                icon=""
                onAction={handleOnClose}
              />
            </CloseButtonDiv>
          </Grid>
          <Grid item>
            <div>
              <Button
                disabled={!validateData()}
                text={I18n.t('pages.tariff.tariffImport.addButtonLabel')}
                tooltip={I18n.t('pages.tariff.tariffImport.addButtonLabel')}
                backgroundGreen={true}
                icon=""
                onAction={addOn}
              />
            </div>
          </Grid>
        </Grid>
        </MainDiv>
      </ModalDiv>
    </Modal >
  )
}

export default TariffImportHandsOnModal
