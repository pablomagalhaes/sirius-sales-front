import React, { useReducer, useState, useEffect, useContext } from 'react'
import { MenuItem, Modal, Box, Container } from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown'
import CloseIcon from '../../../application/icons/CloseIcon'
import { Button } from 'fiorde-fe-components'
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
import ControlledSelect from '../ControlledSelect'
import { MenuItemContent } from '../FareModal/FareModalStyles'
import { CalculationDataProps } from '../ChargeTable'
import FormatNumber from '../../../application/utils/formatNumber'
import { ProposalContext, ProposalProps } from '../../pages/NewProposal/context/ProposalContext'
export interface CostTableItem {
  idCost?: number | null
  idProposal?: number | null
  agent: string
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
  agentList: string[]
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

export const initialState = {
  type: '',
  description: null,
  agent: '',
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
  const reducer = (state, action): CostTableItem => {
    switch (action.type) {
      case 'type':
        return { ...state, type: action.value }
      case 'description':
        return { ...state, description: action.value }
      case 'agent':
        return { ...state, agent: action.value }
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
  const [typeList, setTypeList] = useState<object[]>([])

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
      case modal === 'SEA' && specifications === 'fcl':
        setTypeList([{ name: 'Container', value: 'CONTAINER' }, { name: 'BL', value: 'BL' }])
        break
      case (modal === 'SEA' && specifications === 'lcl') || (modal === 'SEA' && specifications === 'break bulk') || (modal === 'SEA' && specifications === 'ro-ro'):
        setTypeList([{ name: 'Ton³', value: 'TON' }, { name: 'BL', value: 'BL' }])
        break
      case modal === 'AIR':
        setTypeList([{ name: 'KG', value: 'KG' }, { name: 'Fixo', value: 'FIXO' }, { name: 'CW', value: 'CW' }])
        break
      case modal === 'LAND':
        setTypeList([{ name: 'Fixo', value: 'FIXO' }])
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
                valuePurchaseCW: proposal.cargo.vlCwPurchase,
                valueSaleCW: proposal.cargo.vlCwSale
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

  const isOriginCost = title === I18n.t('pages.newProposal.step5.originCost')

  state.agent === '' && agentList.length === 1 && dispatch({ type: 'agent', value: agentList[0] })

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
            <RowDiv margin={true}>
              <ControlledSelect
                onChange={(e) => dispatch({ type: 'type', value: e.target.value })}
                displayEmpty
                style={{ width: '122px', marginTop: '12px' }}
                value={state.type}
                disableUnderline
                placeholder={state.type}
                toolTipTitle={I18n.t('components.itemModal.requiredField')}
                invalid={invalidInput && (state.type === null || state.type.length === 0)}
              >
                <MenuItem disabled value="">
                  <MenuItemContent>
                    {I18n.t('components.costModal.choose')}
                  </MenuItemContent>
                </MenuItem>
                {typeList.map((item: any) => {
                  return (
                    <MenuItem key={item.value} value={item.value}>
                      <MenuItemContent>{item.name}</MenuItemContent>
                    </MenuItem>
                  )
                })}
              </ControlledSelect>
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
                  <RedColorSpan> *</RedColorSpan>
                </Label>
              </RowDiv>
            }
            {isOriginCost &&
              <RowDiv margin={specifications === 'fcl' && true} style={{ position: 'relative' }}>
                <ControlledToolTip
                  title={I18n.t('components.itemModal.requiredField')}
                  open={invalidInput && (state.agent === null || state.agent.length === 0)}
                >
                  <Autocomplete
                    options={agentList.map((agent) => agent)}
                    value={state.agent}
                    onChange={(event: any, newValue: string | null) => {
                      dispatch({ type: 'agent', value: newValue })
                    }}
                    renderInput={(params) => (
                      <div ref={params.InputProps.ref}>
                        <Input
                          {...params.inputProps}
                          filled={state.agent}
                          placeholder={I18n.t('components.costModal.choose')}
                          toolTipTitle={I18n.t('components.itemModal.requiredField')}
                          invalid={invalidInput && (state.agent === null || state.agent.length === 0)}
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
                        {I18n.t('components.costModal.value')}
                        {buyCheckbox && <RedColorSpan> *</RedColorSpan>}
                      </PlaceholderSpan>
                    )}
                    <NumberInput
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
                          {I18n.t('components.costModal.value')}
                          {saleCheckbox && <RedColorSpan> *</RedColorSpan>}
                        </PlaceholderSpan>
                    )}
                    <NumberInput
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
