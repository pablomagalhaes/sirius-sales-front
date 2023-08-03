import {
  Modal,
  Grid,
  FormLabel,
  InputAdornment
} from '@material-ui/core'
import React, { useState, useContext } from 'react'
import CloseIcon from '../../../../../application/icons/CloseIcon'
import Autocomplete, {
  createFilterOptions
} from '@material-ui/lab/Autocomplete'
import ControlledInput from '../../../../components/ControlledInput'
import IconComponent from '../../../../../application/icons/IconComponent'
import {
  StyledPaper,
  CloseButtonDiv,
  ModalDiv,
  MainDiv
} from './TariffImportModalStyles'
import { I18n } from 'react-redux-i18n'
import {
  HeaderDiv,
  RowReverseDiv,
  Title,
  CloseIconContainer
} from '../../../../components/StyledComponents/modalStyles'
import { Button } from 'fiorde-fe-components'
import { usePartnerList, useOriginDestination, useBusinessPartnerByType, useCurrencies } from '../../../../hooks'
import { OriginDestinyTypes } from '../../../../../application/enum/enum'
import { NumberInput } from '../../../NewProposal/steps/StepsStyles'
import FormatNumber from '../../../../../application/utils/formatNumber'
import {
  TARIFF_IMPORT_HANDSON_MODAL_INPUT_ORIGIN,
  TARIFF_IMPORT_HANDSON_MODAL_INPUT_DESTINATION,
  TARIFF_IMPORT_HANDSON_MODAL_INPUT_AGENT,
  TARIFF_IMPORT_HANDSON_MODAL_INPUT_AIR,
  TARIFF_IMPORT_HANDSON_MODAL_INPUT_CURRENCY,
  TARIFF_IMPORT_HANDSON_MODAL_INPUT_MINIMUN,
  TARIFF_IMPORT_HANDSON_MODAL_INPUT_UNTIL45KG,
  TARIFF_IMPORT_HANDSON_MODAL_INPUT_UNTIL100KG,
  TARIFF_IMPORT_HANDSON_MODAL_INPUT_UNTIL300KG,
  TARIFF_IMPORT_HANDSON_MODAL_INPUT_UNTIL500KG,
  TARIFF_IMPORT_HANDSON_MODAL_INPUT_UNTIL1000KG
} from '../../../../../ids'

import { StaggeredProposalContext, StaggeredProposalProps } from '../../context/StaggeredProposalContext'

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
  destiny: string
  airCompany: AgentType
  until45kg: TariffValues | null
  until100kg: TariffValues | null
  until300kg: TariffValues | null
  until500kg: TariffValues | null
  until1000kg: TariffValues | null
  vlMinimum: TariffValues | null
  currency: string | null
}

interface TariffUploadProps {
  theme?: any
  open: boolean
  setClose: () => void
  setShowList: () => void
}

export const initialState = {
  agent: { name: '', id: null },
  origin: '',
  destiny: '',
  airCompany: { name: '', id: null },
  until45kg: null,
  until100kg: null,
  until300kg: null,
  until500kg: null,
  until1000kg: null,
  currency: null,
  vlMinimum: null
}

const TariffImportHandsOnModal = ({
  theme,
  open,
  setClose,
  setShowList
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

  const { staggeredproposal, setStaggeredProposal }: StaggeredProposalProps = useContext(StaggeredProposalContext)

  const handleOnClose = (): void => {
    setData(initialState)
    setInvalidInput(false)
    setClose()
  }

  const validateData = (): boolean => {
    return !(
      (data.origin?.length === 0) ||
      (data.destiny?.length === 0) ||
      (data.currency === null) ||
      (data.agent.id === null) ||
      (data.airCompany.id === null) ||
      (data.until45kg === null || String(data.until45kg) === 'NaN') ||
      (data.until100kg === null || String(data.until100kg) === 'NaN') ||
      (data.until300kg === null || String(data.until300kg) === 'NaN') ||
      (data.until500kg === null || String(data.until500kg) === 'NaN') ||
      (data.until1000kg === null || String(data.until1000kg) === 'NaN') ||
      (data.vlMinimum === null || String(data.vlMinimum) === 'NaN')
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
    if (!validateData()) setInvalidInput(true)
    else {
      const arrTariff = []
      const newObject = {
        origin: data.origin,
        destination: data.destiny,
        idAgent: data.agent.id,
        idBusinessPartnerTransporter: data.airCompany.id,
        currency: data.currency,
        frequency: null,
        vlFrequency: null,
        freightValues: [
          {
            vlMinimum: String(data.vlMinimum),
            until45kg: String(data.until45kg),
            until100kg: String(data.until100kg),
            until300kg: String(data.until300kg),
            until500kg: String(data.until500kg),
            until1000kg: String(data.until1000kg),
            buyOrSell: 'BUY'
          }
        ]
      }

      arrTariff.push(newObject)

      const odd = staggeredproposal.proposalTariff
      const combined = [...odd, newObject]

      setStaggeredProposal({
        ...staggeredproposal,
        proposalTariff: combined
      })

      setShowList()
      handleOnClose()
    }
  }
  const rgxFloat = /^[0-9]*,?[0-9]*$/

  const validateFloatInput = (value: string): RegExpMatchArray | null => {
    return value.match(rgxFloat)
  }

  const handleValues = (e, key): void => {
    setData(
      {
        ...data,
        [key]: parseInt(e.target.value)
      }
    )
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
              id={TARIFF_IMPORT_HANDSON_MODAL_INPUT_ORIGIN}
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
              id={TARIFF_IMPORT_HANDSON_MODAL_INPUT_DESTINATION}
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
            <Grid item xs={6} style={{ marginTop: '-45px' }}>
            <FormLabel component="legend" error={
              (invalidInput && data.agent.id === null)
            }>
                {I18n.t('pages.tariff.tariffImport.agent')}
            </FormLabel>
            <Autocomplete
              id={TARIFF_IMPORT_HANDSON_MODAL_INPUT_AGENT}
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
            <Grid item xs={6} style={{ marginTop: '-45px' }}>
            <FormLabel component="legend" error={
              (invalidInput && data.airCompany.id === null)
            }>
                {I18n.t('pages.tariff.tariffImport.table.airCompany')}
            </FormLabel>
            <Autocomplete
              id={TARIFF_IMPORT_HANDSON_MODAL_INPUT_AIR}
              disabled={false}
              size="small"
              closeIcon={null}
              options={airPartners.map(
                (item) => item.businessPartner.simpleName
              )}
              onChange={(_e, newValue) => {
                const getPartner = airPartners.find((item: any) => item.businessPartner.simpleName === newValue)
                const name = newValue
                const id = getPartner.businessPartner.id
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
              <FormLabel component="legend" error={invalidInput && data.currency === null}>
                {I18n.t('components.tariffModal.currency')}
              </FormLabel>
                  <Autocomplete
                    id={TARIFF_IMPORT_HANDSON_MODAL_INPUT_CURRENCY}
                    value={data.currency}
                    options={currencyList.map((option) => option.id)}
                    disabled={false}
                    onChange={(_e, value) =>
                      setData({ ...data, currency: value })
                    }
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
                        invalid={invalidInput && data.currency === null}
                        variant="outlined"
                        size="small"
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

            <Grid item xs={12} md>
              <FormLabel component="legend" error={invalidInput && (data.vlMinimum === null || String(data.vlMinimum) === 'NaN')}>
                {I18n.t('components.tariffModal.minValue')}
              </FormLabel>
              <NumberInput
                id={TARIFF_IMPORT_HANDSON_MODAL_INPUT_MINIMUN}
                decimalSeparator={','}
                thousandSeparator={'.'}
                decimalScale={2}
                format={(value: string) => FormatNumber.rightToLeftFormatter(value, 2)}
                customInput={ControlledInput}
                toolTipTitle={I18n.t('components.tariffModal.requiredField')}
                invalid={invalidInput && (data.vlMinimum === null || String(data.vlMinimum) === 'NaN')}
                value={data.vlMinimum != null ? data.vlMinimum.value : ''}
                onChange={e => { validateFloatInput(e.target.value) !== null && handleValues(e, 'vlMinimum') }}
                variant="outlined"
                size="small"
                modal
                style={{ marginRight: '3px' }}
              />
            </Grid>
            <Grid item xs={12} md>
              <FormLabel component="legend" error={invalidInput && (data.until45kg === null || String(data.until45kg) === 'NaN')} >
                {I18n.t('components.tariffModal.weight1')}
              </FormLabel>
              <NumberInput
                id={TARIFF_IMPORT_HANDSON_MODAL_INPUT_UNTIL45KG}
                decimalSeparator={','}
                thousandSeparator={'.'}
                decimalScale={2}
                format={(value: string) => FormatNumber.rightToLeftFormatter(value, 2)}
                customInput={ControlledInput}
                toolTipTitle={I18n.t('components.tariffModal.requiredField')}
                invalid={invalidInput && (data.until45kg === null || String(data.until45kg) === 'NaN')}
                value={data.until45kg != null ? data.until45kg.value : ''}
                onChange={e => { validateFloatInput(e.target.value) !== null && handleValues(e, 'until45kg') }}
                variant="outlined"
                size="small"
                modal
              />
              </Grid>
              <Grid item xs={12} md>
              <FormLabel component="legend" error={invalidInput && (data.until100kg === null || String(data.until100kg) === 'NaN')} >
                {I18n.t('components.tariffModal.weight2')}
              </FormLabel>
              <NumberInput
                id={TARIFF_IMPORT_HANDSON_MODAL_INPUT_UNTIL100KG}
                decimalSeparator={','}
                thousandSeparator={'.'}
                decimalScale={2}
                format={(value: string) => FormatNumber.rightToLeftFormatter(value, 2)}
                customInput={ControlledInput}
                toolTipTitle={I18n.t('components.tariffModal.requiredField')}
                invalid={invalidInput && (data.until100kg === null || String(data.until100kg) === 'NaN')}
                value={data.until100kg != null ? data.until100kg.value : ''}
                onChange={e => { validateFloatInput(e.target.value) !== null && handleValues(e, 'until100kg') }}
                variant="outlined"
                size="small"
                modal
              />
              </Grid>
              <Grid item xs={12} md>
              <FormLabel component="legend" error={invalidInput && (data.until300kg === null || String(data.until300kg) === 'NaN')} >
                {I18n.t('components.tariffModal.weight3')}
              </FormLabel>
              <NumberInput
                id={TARIFF_IMPORT_HANDSON_MODAL_INPUT_UNTIL300KG}
                decimalSeparator={','}
                thousandSeparator={'.'}
                decimalScale={2}
                format={(value: string) => FormatNumber.rightToLeftFormatter(value, 2)}
                customInput={ControlledInput}
                toolTipTitle={I18n.t('components.tariffModal.requiredField')}
                invalid={invalidInput && (data.until300kg === null || String(data.until300kg) === 'NaN')}
                value={data.until300kg != null ? data.until300kg.value : ''}
                onChange={e => { validateFloatInput(e.target.value) !== null && handleValues(e, 'until300kg') }}
                variant="outlined"
                size="small"
                modal
              />
              </Grid>
              <Grid item xs={12} md>
              <FormLabel component="legend" error={invalidInput && (data.until500kg === null || String(data.until500kg) === 'NaN')} >
                {I18n.t('components.tariffModal.weight4')}
              </FormLabel>
              <NumberInput
                id={TARIFF_IMPORT_HANDSON_MODAL_INPUT_UNTIL500KG}
                decimalSeparator={','}
                thousandSeparator={'.'}
                decimalScale={2}
                format={(value: string) => FormatNumber.rightToLeftFormatter(value, 2)}
                customInput={ControlledInput}
                toolTipTitle={I18n.t('components.tariffModal.requiredField')}
                invalid={invalidInput && (data.until500kg === null || String(data.until500kg) === 'NaN')}
                value={data.until500kg != null ? data.until500kg.value : ''}
                onChange={e => { validateFloatInput(e.target.value) !== null && handleValues(e, 'until500kg') }}
                variant="outlined"
                size="small"
                modal
              />
              </Grid>
              <Grid item xs={12} md>
              <FormLabel component="legend" error={invalidInput && (data.until1000kg === null || String(data.until1000kg) === 'NaN')} >
                {I18n.t('components.tariffModal.weight5')}
              </FormLabel>
              <NumberInput
                id={TARIFF_IMPORT_HANDSON_MODAL_INPUT_UNTIL1000KG}
                decimalSeparator={','}
                thousandSeparator={'.'}
                decimalScale={2}
                format={(value: string) => FormatNumber.rightToLeftFormatter(value, 2)}
                customInput={ControlledInput}
                toolTipTitle={I18n.t('components.tariffModal.requiredField')}
                invalid={invalidInput && (data.until1000kg === null || String(data.until1000kg) === 'NaN')}
                value={data.until1000kg != null ? data.until1000kg.value : ''}
                onChange={e => { validateFloatInput(e.target.value) !== null && handleValues(e, 'until1000kg') }}
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
                disabled={false}
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
