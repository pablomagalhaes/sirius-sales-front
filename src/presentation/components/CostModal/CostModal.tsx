import React, { useReducer, useState, useEffect, useContext } from 'react'
import { Modal, Box, Container } from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown'
import CloseIcon from '../../../application/icons/CloseIcon'
import { Button, Select } from 'fiorde-fe-components'
import {
  CheckBox,
  CheckBoxLabel,
  Input,
  ReplyDiv,
  ReplyIconDiv,
  WarningPopUp,
  WarningPopUpMessage,
  WarningPopUpButtonDiv,
  MainDiv
} from './CostModalStyles'
import { I18n } from 'react-redux-i18n'
import CheckIcon from '../../../application/icons/CheckItem'
import ReplyIcon from '../../../application/icons/ReplyIcon'
import ControlledToolTip from '../ControlledToolTip/ControlledToolTip'
import {
  ButtonDiv,
  CloseIconContainer,
  Form,
  HeaderDiv,
  Label,
  ModalContainer,
  PlaceholderDiv,
  PlaceholderSpan,
  RedColorSpan,
  RowDiv,
  RowReverseDiv,
  Title
} from '../StyledComponents/modalStyles'
import API from '../../../infrastructure/api'
import { CheckBoxArea } from '../ItemModal/ItemModalStyles'
import { ItemModalData } from '../ItemModal/ItemModal'
import { StyledPaper, NumberInput } from '../../pages/NewProposal/steps/StepsStyles'
import { CalculationDataProps } from '../ChargeTable'
import FormatNumber from '../../../application/utils/formatNumber'
import { ProposalContext, ProposalProps } from '../../pages/NewProposal/context/ProposalContext'
import { CostAgent } from '../../../domain/Cost'
import { Agents } from '../../pages/NewProposal/steps/Step2'
import { TARIFF_COST_MODAL_SELECT_TYPE } from '../../../ids'
import { CostNameTypes, TooltipTypes, FareItemsTypes, SpecificationsType,FreightTypes } from '../../../application/enum/costEnum'
import { ModalTypes } from '../../../application/enum/enum'
export interface CostTableItem {
  idCost?: number | null
  idProposal?: number | null
  agent: CostAgent
  buyCurrency: string | null
  buyMin: string | null
  buyValue: string | null
  description: string | null
  id: number | null
  saleCurrency: string | null
  saleMin: string | null
  saleValue: string | null
  selectedContainer: string | null
  type: string
  buyValueCalculated: string | null
  saleValueCalculated: string | null
}

interface CostModalProps {
  agentList: Agents[]
  dataProp?: CostTableItem
  handleAdd: (item) => void
  open: boolean
  setClose: () => void
  title: string
  modal: string
  specifications: string
  containerItems: ItemModalData[]
  serviceList: any[]
  calculationData?: CalculationDataProps
}

interface Item {
  name: string
  value: string
  tooltip?: string
}

export const initialState = {
  type: '',
  description: null,
  agent: {
    idBusinessPartnerAgent: undefined,
    idBusinessPartnerTransportCompany: undefined
  },
  buyCurrency: 'BRL',
  buyValue: null,
  buyMin: null,
  saleCurrency: 'BRL',
  saleValue: null,
  selectedContainer: null,
  saleMin: null,
  id: null,
  buyValueCalculated: null,
  saleValueCalculated: null
}

const CostModal = ({
  agentList,
  dataProp,
  handleAdd,
  open,
  setClose,
  title,
  modal,
  specifications,
  containerItems,
  serviceList,
  calculationData
}: CostModalProps): JSX.Element => {
  const getAgentByName = (name: string): CostAgent => {
    const agent = agentList.find(agent => agent.agent === name)
    return { idBusinessPartnerAgent: agent?.idBusinessPartnerAgent, idBusinessPartnerTransportCompany: agent?.idBusinessPartnerTransportCompany }
  }
  const reducer = (state, action): CostTableItem => {
    switch (action.type) {
      case 'type':
        return { ...state, type: action.value }
      case 'description':
        return { ...state, description: action.value }
      case 'agent':
        return { ...state, agent: getAgentByName(action.value) }
      case 'buyValue':
        return { ...state, buyValue: action.value }
      case 'buyCurrency':
        return { ...state, buyCurrency: action.value }
      case 'buyMin':
        return { ...state, buyMin: action.value }
      case 'saleValue':
        return { ...state, saleValue: action.value }
      case 'selectedContainer':
        return { ...state, selectedContainer: action.value }
      case 'saleCurrency':
        return { ...state, saleCurrency: action.value }
      case 'saleMin':
        return { ...state, saleMin: action.value }
      case 'buyValueCalculated':
        return { ...state, buyValueCalculated: action.value }
      case 'saleValueCalculated':
        return { ...state, saleValueCalculated: action.value }
      case 'replyForSale':
        return {
          ...state,
          saleMin: state.buyMin,
          saleValue: state.buyValue,
          saleCurrency: state.buyCurrency
        }
      case 'reset':
        return initialState
      case 'dataProp':
        return dataProp !== null && dataProp !== undefined ? dataProp : initialState
      default:
        return state
    }
  }

  const rgxFloat = /^[0-9]*,?[0-9]*$/
  const [state, dispatch] = useReducer(
    reducer,
    dataProp !== null && dataProp !== undefined ? dataProp : initialState
  )
  const [typeList, setTypeList] = useState<Item[]>([])

  const [buyCheckbox, setBuyCheckBox] = useState(state.buyValue != null)
  const [saleCheckbox, setSaleCheckBox] = useState(state.saleValue != null)
  const [invalidInput, setInvalidInput] = useState(false)
  const [invalidValueInput, setInvalidValueInput] = useState(false)
  const [noValueInput, setNoValueInput] = useState(false)
  const [currencyList, setCurrencyList] = useState<any[]>([])
  const [flag, setFlag] = useState(false)
  const { proposal }: ProposalProps = useContext(ProposalContext)

  const verifyContainerItems = (): void => {
    if (containerItems.length === 1) {
      dispatch({ type: 'selectedContainer', value: containerItems[0].type })
    }
  }

  useEffect(() => {
    dispatch({ type: 'dataProp' })
    verifyContainerItems()
    setBuyCheckBox(dataProp?.buyValue !== null && dataProp?.buyValue.length !== 0)
    setSaleCheckBox(dataProp?.saleValue !== null && dataProp?.saleValue.length !== 0)
  }, [open])

  useEffect(() => {
    switch (true) {
      case modal === ModalTypes.Sea && specifications === SpecificationsType.Fcl && proposal?.operationType === FreightTypes.Import:
        setTypeList([
          { name: CostNameTypes.Container, value: FareItemsTypes.Container },
          { name: CostNameTypes.Bl, value: FareItemsTypes.Bl },
          { name: CostNameTypes.Fdesp, value: FareItemsTypes.Fdesp, tooltip: TooltipTypes.Fdesp }
        ])
        break
      case ((modal === ModalTypes.Sea && specifications === SpecificationsType.Lcl) || (modal === ModalTypes.Sea && specifications === SpecificationsType.BreakBulk) || (modal === ModalTypes.Sea && specifications === SpecificationsType.Roro)) && proposal?.operationType === FreightTypes.Import:
        setTypeList([
          { name: CostNameTypes.Ton, value: FareItemsTypes.Ton },
          { name: CostNameTypes.Bl, value: FareItemsTypes.Bl },
          { name: CostNameTypes.Fdesp, value: FareItemsTypes.Fdesp, tooltip: TooltipTypes.Fdesp }
        ])
        break
      case modal === ModalTypes.Air && proposal?.operationType === FreightTypes.Import:
        setTypeList([
          { name: CostNameTypes.Kilo, value: FareItemsTypes.Kilo },
          { name: CostNameTypes.Fixed, value: FareItemsTypes.Fixed },
          { name: CostNameTypes.Cw, value: FareItemsTypes.Cw },
          { name: CostNameTypes.Fdesp, value: FareItemsTypes.Fdesp, tooltip: TooltipTypes.Fdesp }
        ])
        break
      case modal === ModalTypes.Land && proposal?.operationType === FreightTypes.Import:
        setTypeList([
          { name: CostNameTypes.Fixed, value: FareItemsTypes.Fixed },
          { name: CostNameTypes.Fdesp, value: FareItemsTypes.Fdesp, tooltip: TooltipTypes.Fdesp }
        ])
        break
      case modal === ModalTypes.Sea && specifications === SpecificationsType.Fcl:
        setTypeList([
          { name: CostNameTypes.Container, value: FareItemsTypes.Container },
          { name: CostNameTypes.Bl, value: FareItemsTypes.Bl }
        ])
        break
      case (modal === ModalTypes.Sea && specifications === SpecificationsType.Lcl) || (modal === ModalTypes.Sea && specifications === SpecificationsType.BreakBulk) || (modal === ModalTypes.Sea && specifications === SpecificationsType.Roro):
        setTypeList([
          { name: CostNameTypes.Ton, value: FareItemsTypes.Ton },
          { name: CostNameTypes.Bl, value: FareItemsTypes.Bl }
        ])
        break
      case modal === ModalTypes.Air:
        setTypeList([
          { name: CostNameTypes.Kilo, value: FareItemsTypes.Kilo },
          { name: CostNameTypes.Fixed, value: FareItemsTypes.Fixed },
          { name: CostNameTypes.Cw, value: FareItemsTypes.Cw }
        ])
        break
      case modal === ModalTypes.Land:
        setTypeList([
          { name: CostNameTypes.Fixed, value: FareItemsTypes.Fixed }
        ])
        break
      default:
        setTypeList([])
    }
  }, [modal, specifications])

  useEffect(() => {
    void (async function () {
      await API.getCurrencies()
        .then((response) => setCurrencyList(response))
        .catch((err) => console.log(err))
    })()
  }, [])

  const handleOnClose = (): void => {
    setFlag(false)
    dispatch({ type: 'reset' })
    setInvalidInput(false)
    setInvalidValueInput(false)
    setBuyCheckBox(false)
    setSaleCheckBox(false)
    setClose()
  }

  const handleClickWarningButton = (): void => {
    if (invalidValueInput) setInvalidValueInput(false)
    if (noValueInput) setNoValueInput(false)
  }

  const validateFloatInput = (value: string): RegExpMatchArray | null => {
    return value.match(rgxFloat)
  }

  const buyCheckboxHandler = (): void => {
    setBuyCheckBox((buyCheckbox) => !buyCheckbox)
  }

  const saleCheckboxHandler = (): void => {
    setSaleCheckBox((saleCheckbox) => !saleCheckbox)
  }

  const replyForSaleHandler = (): void => {
    if (buyCheckbox) {
      setSaleCheckBox(true)
      dispatch({ type: 'replyForSale' })
    }
  }

  const buyValueHandler = (e): void => {
    const validatedInput = validateFloatInput(e.target.value)
    if (validatedInput !== null) {
      dispatch({ type: 'buyValue', value: validatedInput[0] })
    }
  }

  const buyMinHandler = (e): void => {
    const validatedInput = validateFloatInput(e.target.value)
    if (validatedInput !== null) {
      dispatch({ type: 'buyMin', value: validatedInput[0] })
    }
  }

  const saleValueHandler = (e): void => {
    const validatedInput = validateFloatInput(e.target.value)
    if (validatedInput !== null) {
      dispatch({ type: 'saleValue', value: validatedInput[0] })
    }
  }

  const buyValueHandlerPercentage = (e): void => {
    const valuePercentage = e.target.value
    const value = valuePercentage.replace('%', '')
    const validatedInput = validateFloatInput(value)
    if (validatedInput !== null) {
      dispatch({ type: 'buyValue', value: validatedInput[0] })
    }
  }

  const saleValueHandlerPercentage = (e): void => {
    const valuePercentage = e.target.value
    const value = valuePercentage.replace('%', '')
    const validatedInput = validateFloatInput(value)
    if (validatedInput !== null) {
      dispatch({ type: 'saleValue', value: validatedInput[0] })
    }
  }

  const saleMinHandler = (e): void => {
    const validatedInput = validateFloatInput(e.target.value)
    if (validatedInput !== null) {
      dispatch({ type: 'saleMin', value: validatedInput[0] })
    }
  }

  const addHandler = (): void => {
    let invalid = false
    let item = state

    if (buyCheckbox) {
      if (item.buyValue === null || item.buyValue.length === 0) {
        invalid = true
        setInvalidValueInput(true)
      }
    } else {
      item = { ...item, buyMin: '', buyCurrency: '', buyValue: '' }
      dispatch({ type: 'buyValue', value: '' })
      dispatch({ type: 'buyMin', value: '' })
      dispatch({ type: 'buyCurrency', value: '' })
    }
    if (saleCheckbox) {
      if (item.saleValue === null || item.saleValue.length === 0) {
        invalid = true
        setInvalidValueInput(true)
      }
    } else {
      item = { ...item, saleMin: '', saleCurrency: '', saleValue: '' }
      dispatch({ type: 'saleValue', value: '' })
      dispatch({ type: 'saleMin', value: '' })
      dispatch({ type: 'saleCurrency', value: '' })
    }
    if (
      item.type.length === 0 ||
      (item.description === null || item.description?.length === 0)
    ) {
      invalid = true
    }
    if (item.saleMin !== null) {
      dispatch({ type: 'saleMin', value: item.saleMin.replace(',', '.') })
      item.saleMin = item.saleMin.replace(',', '.')
    }

    if (item.saleValue !== null) {
      dispatch({ type: 'saleValue', value: item.saleValue.replace(',', '.') })
      item.saleValue = item.saleValue.replace(',', '.')
    }

    if (item.buyMin !== null) {
      dispatch({ type: 'buyMin', value: item.buyMin.replace(',', '.') })
      item.buyMin = item.buyMin.replace(',', '.')
    }

    if (item.buyValue !== null) {
      dispatch({ type: 'buyValue', value: item.buyValue.replace(',', '.') })
      item.buyValue = item.buyValue.replace(',', '.')
    }

    if (!buyCheckbox && !saleCheckbox) {
      setNoValueInput(true)
      invalid = true
      item = { ...item, buyCurrency: 'BRL', saleCurrency: 'BRL' }
      dispatch({ type: 'buyCurrency', value: 'BRL' })
      dispatch({ type: 'saleCurrency', value: 'BRL' })
    }

    if (!invalid) {
      const indexContainer = containerItems.findIndex(container => state.selectedContainer === container.type)

      const data = {
        costType: item.type,
        quantityContainer: specifications === 'fcl' ? Number(containerItems[indexContainer]?.amount) : 0,
        valueGrossWeight: isNaN(Number(calculationData?.weight)) ? 0 : calculationData?.weight,
        valueCubage: isNaN(Number(calculationData?.cubage)) ? 0 : calculationData?.cubage,
        valueWeightCubed: isNaN(Number(calculationData?.cubageWeight)) ? 0 : calculationData?.cubageWeight,
        valuePurchase: Number(item.buyValue),
        valueSale: Number(item.saleValue),
        idCurrencyPurchase: item.buyCurrency,
        idCurrencySale: item.saleCurrency
      }

      void (async function () {
        const totalCalculationData =
          data.costType === 'CW'
            ? {
                ...data,
                valuePurchaseCW: proposal.cargo[0].vlCwPurchase,
                valueSaleCW: proposal.cargo[0].vlCwSale
              }
            : { ...data, valuePurchaseCW: null, valueSaleCW: null }
        await API.postTotalCalculation(totalCalculationData)
          .then((response) => {
            dispatch({ type: 'buyValueCalculated', value: response.valuePurchase })
            dispatch({ type: 'saleValueCalculated', value: response.valueSale })
          })
          .catch((err) => console.log(err))
      })()
    } else {
      setInvalidInput(true)
    }
  }

  useEffect(() => {
    if (state.buyValueCalculated !== null && state.saleValueCalculated !== null) {
      setFlag(true)
    }
  }, [state.buyValueCalculated, state.saleValueCalculated])

  useEffect(() => {
    if (flag) {
      handleAdd(state)
      handleOnClose()
    }
  }, [flag])

  const isOriginCost = title === I18n.t('pages.newProposal.step6.originCost')
  useEffect(() => {
    if (open) {
      state.agent.idBusinessPartnerAgent === undefined && agentList.length === 1 && dispatch({ type: 'agent', value: agentList[0].agent })
    }
  }, [open])

  const getAgentName = (id: number): string => {
    const agent = agentList.find(agents => agents.idBusinessPartnerAgent === id)
    return String(agent?.agent ?? '')
  }

  return (
    <Modal open={open} onClose={handleOnClose}>
      <ModalContainer>
        <HeaderDiv>
          <Title>{title}</Title>
          <RowReverseDiv>
            <CloseIconContainer>
              <CloseIcon onClick={handleOnClose} />
            </CloseIconContainer>
          </RowReverseDiv>
        </HeaderDiv>
        <MainDiv>
          <Form>
            <RowDiv>
              <Label width="27%">
                {I18n.t('components.costModal.type')}
                <RedColorSpan> *</RedColorSpan>
              </Label>
              <Label width="73%">
                {I18n.t('components.costModal.description')}
                <RedColorSpan> *</RedColorSpan>
              </Label>
            </RowDiv>
            <RowDiv
              margin={true}
              invalid={invalidInput && (state.type === null || state.type.length === 0)}
              value={{ type: typeList.find((type) => type.value === state.type)?.name ?? '' }}
            >
              <Select
                list={typeList}
                id={TARIFF_COST_MODAL_SELECT_TYPE}
                dispatch={dispatch}
                state={{ type: typeList.find((type) => type.value === state.type)?.name ?? '' }}
                toolTipTitle={I18n.t('components.itemModal.requiredField')}
                invalidInput={invalidInput && (state.type === null || state.type.length === 0)}
                placeholder={state.type === '' ? I18n.t('components.costModal.choose') : typeList.find((type) => type.value === state.type)?.name }
              />
              <Container style={{ position: 'relative', marginRight: '368px' }}>
                <ControlledToolTip
                  title={I18n.t('components.itemModal.requiredField')}
                  open={
                    invalidInput &&
                    (state.description === null ||
                      state.description.length === 0)
                  }
                >
                  <Autocomplete
                    style={{ width: '368px' }}
                    value={state.description}
                    onChange={(event: any, newValue: string | null) => {
                      dispatch({ type: 'description', value: newValue })
                    }}
                    options={serviceList.map((option) => option.service)}
                    renderInput={(params) => (
                      <div ref={params.InputProps.ref}>
                        <Input
                          {...params.inputProps}
                          style={{ width: '368px' }}
                          placeholder={I18n.t('components.costModal.choose')}
                          toolTipTitle={I18n.t(
                            'components.itemModal.requiredField'
                          )}
                          invalid={
                            invalidInput &&
                            (state.description === null ||
                              state.description.length === 0)
                          }
                          filled={state.description}
                        />
                        <Box
                          style={{ left: '360px' }}
                          {...params.inputProps}
                          className='dropdownIconAutoComplete'
                        >
                          <ArrowDropDownIcon />
                        </Box>
                      </div>
                    )}
                    PaperComponent={(params: any) => (
                      <StyledPaper {...params} />
                    )}
                  />
                </ControlledToolTip>
              </Container>
            </RowDiv>
            {isOriginCost &&
              <RowDiv>
                <Label width="100%">
                  {I18n.t('components.costModal.agent')}
                </Label>
              </RowDiv>
            }
            {isOriginCost &&
              <RowDiv margin={specifications === 'fcl' && true} style={{ position: 'relative' }}>
                <ControlledToolTip
                  title={I18n.t('components.itemModal.requiredField')}
                  open={invalidInput && (state.agent === null || state.agent.idBusinessPartnerAgent !== null)}
                >
                  <Autocomplete
                    disabled={agentList.length === 0}
                    options={agentList.map((agent) => agent.agent)}
                    value={getAgentName(Number(state.agent.idBusinessPartnerAgent))}
                    onChange={(event: any, newValue: string | null) => {
                      dispatch({ type: 'agent', value: newValue })
                    }}
                    renderInput={(params) => (
                      <div ref={params.InputProps.ref}>
                        <Input
                          {...params.inputProps}
                          filled={state.agent.idBusinessPartnerAgent}
                          placeholder={I18n.t('components.costModal.choose')}
                          toolTipTitle={I18n.t('components.itemModal.requiredField')}
                          // invalid={invalidInput && (state.agent === null || state.agent.idBusinessPartnerAgent !== null)}
                          style={{ width: '513px' }}
                        />
                        <Box {...params.inputProps} className="dropdownContainer">
                          <ArrowDropDownIcon />
                        </Box>
                      </div>
                    )}
                    PaperComponent={(params: any) => <StyledPaper {...params} />}
                  />
                </ControlledToolTip>
              </RowDiv>
            }
            {specifications === 'fcl' && (
              <><RowDiv>
                <Label width="100%">
                  {I18n.t('components.costModal.container')}
                  <RedColorSpan> *</RedColorSpan>
                </Label>
              </RowDiv>
                <RowDiv style={{ position: 'relative' }}>
                  <Autocomplete
                    options={containerItems.map((item) => item.type)}
                    value={state.selectedContainer}
                    onChange={(event: any, newValue: string | null) => {
                      dispatch({ type: 'selectedContainer', value: newValue })
                    }}
                    renderInput={(params) => (
                      <div ref={params.InputProps.ref}>
                        <Input
                          {...params.inputProps}
                          filled={state.selectedContainer}
                          placeholder={I18n.t('components.costModal.choose')}
                          toolTipTitle={I18n.t('components.itemModal.requiredField')}
                          invalid={invalidInput && state.selectedContainer === null}
                          style={{ width: '513px' }}
                        />
                        <Box {...params.inputProps} className="dropdownContainer">
                          <ArrowDropDownIcon />
                        </Box>
                      </div>
                    )}
                    PaperComponent={(params: any) => <StyledPaper {...params} />}
                  />
                </RowDiv></>
            )}
            <RowDiv>
              <CheckBoxArea onClick={buyCheckboxHandler}>
                <CheckBox
                  aria-label="checkbox"
                  checked={buyCheckbox}
                >
                  {buyCheckbox && <CheckIcon />}
                </CheckBox>
                <CheckBoxLabel
                  invalid={
                    buyCheckbox &&
                    invalidInput &&
                    (state.buyValue === null || state.buyValue.length === 0)
                  }
                >
                  {I18n.t('components.costModal.buyValue')}:
                </CheckBoxLabel>
              </CheckBoxArea>
            </RowDiv>
            <RowDiv style={{ position: 'relative' }}>
              <Autocomplete
                options={currencyList.map((option) => option.id)}
                value={state.buyCurrency}
                onChange={(event: any, newValue: string | null) => {
                  dispatch({ type: 'buyCurrency', value: newValue })
                }}
                renderInput={(params) => (
                  <div ref={params.InputProps.ref}>
                    <Input
                      {...params.inputProps}
                      width="84px"
                      disabled={!buyCheckbox}
                      filled={buyCheckbox ? state.buyCurrency : null}
                      toolTipTitle={I18n.t('components.itemModal.requiredField')}
                      invalid={
                        buyCheckbox &&
                        invalidInput &&
                        (state.buyCurrency === null || state.buyCurrency.length === 0)
                      }
                    />
                    <Box {...params.inputProps} className="dropdown">
                      <ArrowDropDownIcon />
                    </Box>
                  </div>
                )}
                PaperComponent={(params: any) => <StyledPaper {...params} />}
              />
              <ControlledToolTip
                title={I18n.t('components.itemModal.requiredField')}
                open={
                  buyCheckbox &&
                  invalidInput &&
                  (state.buyValue === null || state.buyValue.length === 0)
                }
              >
                <PlaceholderDiv>
                  <label>
                    {(state.buyValue === null || state.buyValue.length === 0) && (
                      <PlaceholderSpan>
                        {state.type === FareItemsTypes.Fdesp ? I18n.t('components.costModal.percentage') : I18n.t('components.costModal.value')}
                        {buyCheckbox && <RedColorSpan> *</RedColorSpan>}
                      </PlaceholderSpan>
                    )}
                    {state.type === FareItemsTypes.Fdesp
                      ? <NumberInput
                        decimalSeparator={','}
                        thousandSeparator={'.'}
                        decimalScale={2}
                        customInput={Input}
                        format={(value: string) => FormatNumber.rightToLeftFormatterPercentage(value, 2)}
                        onChange={buyValueHandlerPercentage}
                        value={state.buyValue != null ? state.buyValue : ''}
                        disabled={!buyCheckbox}
                        filled={buyCheckbox ? state.buyValue : null}
                        invalid={
                          buyCheckbox &&
                          invalidInput &&
                          (state.buyValue === null || state.buyValue.length === 0)
                        }
                      />
                      : <NumberInput
                        decimalSeparator={','}
                        thousandSeparator={'.'}
                        decimalScale={2}
                        customInput={Input}
                        format={(value: string) => FormatNumber.rightToLeftFormatter(value, 2)}
                        onChange={buyValueHandler}
                        value={state.buyValue != null ? state.buyValue : ''}
                        disabled={!buyCheckbox}
                        filled={buyCheckbox ? state.buyValue : null}
                        invalid={
                          buyCheckbox &&
                          invalidInput &&
                          (state.buyValue === null || state.buyValue.length === 0)
                        }
                      />
                    }
                  </label>
                </PlaceholderDiv>
              </ControlledToolTip>
              <NumberInput
                placeholder={I18n.t('components.costModal.minimum')}
                decimalSeparator={','}
                thousandSeparator={'.'}
                decimalScale={2}
                customInput={Input}
                format={(value: string) => FormatNumber.rightToLeftFormatter(value, 2)}
                onChange={buyMinHandler}
                value={state.buyMin != null ? state.buyMin : ''}
                disabled={!buyCheckbox}
                filled={buyCheckbox ? state.buyMin : null}
              />
              <ReplyDiv disabled={!buyCheckbox} onClick={replyForSaleHandler}>
                <ReplyIconDiv>
                  <ReplyIcon />
                </ReplyIconDiv>
                {I18n.t('components.costModal.replyForSale')}
              </ReplyDiv>
            </RowDiv>
            <RowDiv>
              <CheckBoxArea onClick={saleCheckboxHandler}>
                <CheckBox checked={saleCheckbox}>
                  {saleCheckbox && <CheckIcon />}
                </CheckBox>
                <CheckBoxLabel
                  checked={true}
                  invalid={
                    saleCheckbox &&
                    invalidInput &&
                    (state.saleValue === null || state.saleValue.length === 0)
                  }
                >
                  {I18n.t('components.costModal.saleValue')}:
                </CheckBoxLabel>
              </CheckBoxArea>
            </RowDiv>
            <RowDiv style={{ position: 'relative' }}>
              <Autocomplete
                options={currencyList.map((option) => option.id)}
                value={state.saleCurrency}
                onChange={(event: any, newValue: string | null) => {
                  dispatch({ type: 'saleCurrency', value: newValue })
                }}
                renderInput={(params) => (
                  <div ref={params.InputProps.ref}>
                    <Input
                      {...params.inputProps}
                      width="84px"
                      disabled={!saleCheckbox}
                      filled={saleCheckbox ? state.saleCurrency : null}
                      toolTipTitle={I18n.t('components.itemModal.requiredField')}
                      invalid={
                        saleCheckbox &&
                        invalidInput &&
                        (state.saleCurrency === null || state.saleCurrency.length === 0)
                      }
                    />
                    <Box {...params.inputProps} className="dropdown">
                      <ArrowDropDownIcon />
                    </Box>
                  </div>
                )}
                PaperComponent={(params: any) => <StyledPaper {...params} />}
              />
              <ControlledToolTip
                title={I18n.t('components.itemModal.requiredField')}
                open={
                  saleCheckbox &&
                  invalidInput &&
                  (state.saleValue === null || state.saleValue.length === 0)
                }
              >
                <PlaceholderDiv>
                  <label>
                    {(state.saleValue === null ||
                      state.saleValue.length === 0) && (
                        <PlaceholderSpan>
                          {state.type === FareItemsTypes.Fdesp ? I18n.t('components.costModal.percentage') : I18n.t('components.costModal.value')}
                          {saleCheckbox && <RedColorSpan> *</RedColorSpan>}
                        </PlaceholderSpan>
                    )}
                    {state.type === FareItemsTypes.Fdesp
                      ? <NumberInput
                        decimalSeparator={','}
                        thousandSeparator={'.'}
                        decimalScale={2}
                        customInput={Input}
                        format={(value: string) => FormatNumber.rightToLeftFormatterPercentage(value, 2)}
                        onChange={saleValueHandlerPercentage}
                        value={state.saleValue != null ? state.saleValue : ''}
                        disabled={!saleCheckbox}
                        filled={saleCheckbox ? state.saleValue : null}
                        invalid={
                          saleCheckbox &&
                          invalidInput &&
                          (state.saleValue === null || state.saleValue.length === 0)
                        }
                      />
                      : <NumberInput
                        decimalSeparator={','}
                        thousandSeparator={'.'}
                        decimalScale={2}
                        customInput={Input}
                        format={(value: string) => FormatNumber.rightToLeftFormatter(value, 2)}
                        onChange={saleValueHandler}
                        value={state.saleValue != null ? state.saleValue : ''}
                        disabled={!saleCheckbox}
                        filled={saleCheckbox ? state.saleValue : null}
                        invalid={
                          saleCheckbox &&
                          invalidInput &&
                          (state.saleValue === null || state.saleValue.length === 0)
                        }
                      />
                    }
                  </label>
                </PlaceholderDiv>
              </ControlledToolTip>
              <NumberInput
                placeholder={I18n.t('components.costModal.minimum')}
                decimalSeparator={','}
                thousandSeparator={'.'}
                decimalScale={2}
                customInput={Input}
                format={(value: string) => FormatNumber.rightToLeftFormatter(value, 2)}
                onChange={saleMinHandler}
                value={state.saleMin != null ? state.saleMin : ''}
                disabled={!saleCheckbox}
                filled={saleCheckbox ? state.saleMin : null}
              />
            </RowDiv>
            {(!invalidValueInput && !noValueInput) && (
              <ButtonDiv>
                <Button
                  disabled={false}
                  backgroundGreen={true}
                  icon={''}
                  onAction={addHandler}
                  text={I18n.t('components.costModal.save')}
                  tooltip={I18n.t('components.costModal.save')}
                />
              </ButtonDiv>
            )}
          </Form>
        </MainDiv>
        {invalidValueInput && (
          <WarningPopUp>
            <WarningPopUpMessage>
              {I18n.t('components.costModal.popUpMessageStart')}“
              {buyCheckbox &&
                (state.buyValue?.length === 0 || state.buyValue === null)
                ? I18n.t('components.costModal.buyValue')
                : I18n.t('components.costModal.saleValue')}
              ”{I18n.t('components.costModal.popUpMessageEnd')}
            </WarningPopUpMessage>
            <WarningPopUpButtonDiv>
              <Button
                disabled={false}
                backgroundGreen={false}
                icon={''}
                onAction={handleClickWarningButton}
                text={I18n.t('components.costModal.gotIt')}
                tooltip={I18n.t('components.costModal.gotIt')}
              />
            </WarningPopUpButtonDiv>
          </WarningPopUp>
        )}
        {noValueInput && (
          <WarningPopUp>
            <WarningPopUpMessage>
              {I18n.t('components.costModal.noValueError')}
            </WarningPopUpMessage>
            <WarningPopUpButtonDiv>
              <Button
                disabled={false}
                backgroundGreen={false}
                icon={''}
                onAction={handleClickWarningButton}
                text={I18n.t('components.costModal.gotIt')}
                tooltip={I18n.t('components.costModal.gotIt')}
              />
            </WarningPopUpButtonDiv>
          </WarningPopUp>
        )}
      </ModalContainer>
    </Modal>
  )
}

export default CostModal
