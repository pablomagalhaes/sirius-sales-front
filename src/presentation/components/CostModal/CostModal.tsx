import React, { useReducer, useState, useEffect } from 'react'
import { MenuItem, Modal, Box } from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown'
import CloseIcon from '../../../application/icons/CloseIcon'
import { Button } from 'fiorde-fe-components'
import {
  StyledMenuSelect,
  CheckBox,
  CheckBoxLabel,
  Input,
  ReplyDiv,
  ReplyIconDiv,
  WarningPopUp,
  WarningPopUpMessage,
  WarningPopUpButtonDiv
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
import newProposal from '../../../infrastructure/api/newProposalService'
import { CheckBoxArea } from '../ItemModal/ItemModalStyles'

interface ItemModalData {
  agent: string
  buyCurrency: string | null
  buyMin: string | null
  buyValue: string | null
  description: string
  id: number | null
  saleCurrency: string | null
  saleMin: string | null
  saleValue: string | null
  type: string
}

interface CostModalProps {
  dataProp?: ItemModalData
  handleAdd: (item) => void
  open: boolean
  setClose: () => void
  title: string
}

const CostModal = ({
  dataProp,
  handleAdd,
  open,
  setClose,
  title
}: CostModalProps): JSX.Element => {
  const initialState = {
    type: '',
    description: '',
    agent: '',
    buyCurrency: 'BRL',
    buyValue: null,
    buyMin: null,
    saleCurrency: 'BRL',
    saleValue: null,
    saleMin: null,
    id: null
  }

  const reducer = (state, action): ItemModalData => {
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
      case 'saleCurrency':
        return { ...state, saleCurrency: action.value }
      case 'saleMin':
        return { ...state, saleMin: action.value }
      case 'replyForSale':
        return {
          ...state,
          saleMin: state.buyMin,
          saleValue: state.buyValue,
          saleCurrency: state.buyCurrency
        }
      case 'reset':
        return initialState
      default:
        return state
    }
  }

  const rgxFloat = /^[0-9]*,?[0-9]*$/
  const [state, dispatch] = useReducer(
    reducer,
    dataProp != null ? dataProp : initialState
  )
  // Listas são mock, serão alteradas posteriormente
  const typeList = ['Tipo1', 'Tipo2', 'Tipo3']
  const agentList = ['Agente1', 'Agente2', 'Agente3']
  const [buyCheckbox, setBuyCheckBox] = useState(state.buyValue != null)
  const [saleCheckbox, setSaleCheckBox] = useState(state.saleValue != null)
  const [invalidInput, setInvalidInput] = useState(false)
  const [invalidValueInput, setInvalidValueInput] = useState(false)
  const [currencyList, setCurrencyList] = useState<any[]>([])
  const [serviceList, setServiceList] = useState<any[]>([])

  useEffect(() => {
    void (async function () {
      await newProposal.getCurrencies()
        .then((response) => setCurrencyList(response))
        .catch((err) => console.log(err))
    })()
  }, [])

  useEffect(() => {
    void (async function () {
      await newProposal.getService()
        .then((response) => setServiceList(response))
        .catch((err) => console.log(err))
    })()
  }, [])

  const handleOnClose = (): void => {
    dispatch({ type: 'reset' })
    setInvalidInput(false)
    setInvalidValueInput(false)
    setBuyCheckBox(false)
    setSaleCheckBox(false)
    setClose()
  }

  const handleClickWarningButton = (): void => {
    setInvalidValueInput(false)
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
    }
    if (saleCheckbox) {
      if (item.saleValue === null || item.saleValue.length === 0) {
        invalid = true
        setInvalidValueInput(true)
      }
    } else {
      item = { ...item, saleMin: '', saleCurrency: '', saleValue: '' }
    }
    if (
      item.agent.length === 0 ||
      item.type.length === 0 ||
      item.description.length === 0
    ) {
      invalid = true
    }
    if (!invalid) {
      handleAdd(item)
      handleOnClose()
    } else {
      setInvalidInput(true)
    }
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
            <StyledMenuSelect
              width="122px"
              onChange={(e) =>
                dispatch({ type: 'type', value: e.target.value })
              }
              displayEmpty
              value={state.type}
              disableUnderline
              placeholder={state.type}
              large={1}
              aria-label="type"
              filled={state.type}
              toolTipTitle={I18n.t('components.itemModal.requiredField')}
              invalid={
                invalidInput && (state.type === null || state.type.length === 0)
              }
            >
              <MenuItem disabled value="">
                {I18n.t('components.costModal.choose')}
              </MenuItem>
              {typeList.map((type) => {
                return (
                  <MenuItem key={`${type}_key`} value={type}>
                    {type}
                  </MenuItem>
                )
              })}
            </StyledMenuSelect>
            <Autocomplete
              options={serviceList.map((option) => option.service)}
              value={state.description}
              onChange={(event: any, newValue: string | null) => {
                dispatch({ type: 'description', value: newValue })
              }}
              renderInput={(params) => (
                <div ref={params.InputProps.ref}>
                  <Input
                    {...params.inputProps}
                    filled={state.description}
                    toolTipTitle={I18n.t('components.itemModal.requiredField')}
                    invalid={
                      invalidInput &&
                      (state.description === null || state.description.length === 0)
                    }
                    style={{ width: '368px' }}
                  />
                  <Box {...params.inputProps} className="dropdownLargerInput">
                    <ArrowDropDownIcon />
                  </Box>
                </div>
              )}
            />
          </RowDiv>
          <RowDiv>
            <Label width="100%">
              {I18n.t('components.costModal.agent')}
              <RedColorSpan> *</RedColorSpan>
            </Label>
          </RowDiv>
          <RowDiv>
            <StyledMenuSelect
              width="513px"
              onChange={(e) =>
                dispatch({ type: 'agent', value: e.target.value })
              }
              displayEmpty
              value={state.agent}
              disableUnderline
              placeholder={state.agent}
              filled={state.agent}
              toolTipTitle={I18n.t('components.itemModal.requiredField')}
              invalid={
                invalidInput &&
                (state.agent === null || state.agent.length === 0)
              }
            >
              <MenuItem disabled value="">
                {I18n.t('components.costModal.choose')}
              </MenuItem>
              {agentList.map((agent) => {
                return (
                  <MenuItem key={`${agent}_key`} value={agent}>
                    {agent}
                  </MenuItem>
                )
              })}
            </StyledMenuSelect>
          </RowDiv>
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
                  <Input
                    value={state.buyValue != null ? state.buyValue : ''}
                    onChange={buyValueHandler}
                    disabled={!buyCheckbox}
                    invalid={
                      buyCheckbox &&
                      invalidInput &&
                      (state.buyValue === null || state.buyValue.length === 0)
                    }
                    filled={buyCheckbox ? state.buyValue : null}
                  />
                </label>
              </PlaceholderDiv>
            </ControlledToolTip>
            <Input
              aria-label="minimum"
              value={state.buyMin != null ? state.buyMin : ''}
              onChange={buyMinHandler}
              placeholder={I18n.t('components.costModal.minimum')}
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
                  <Input
                    value={state.saleValue != null ? state.saleValue : ''}
                    onChange={saleValueHandler}
                    disabled={!saleCheckbox}
                    invalid={
                      saleCheckbox &&
                      invalidInput &&
                      (state.saleValue === null || state.saleValue.length === 0)
                    }
                    filled={saleCheckbox ? state.saleValue : null}
                  />
                </label>
              </PlaceholderDiv>
            </ControlledToolTip>
            <Input
              placeholder={I18n.t('components.costModal.minimum')}
              value={state.saleMin != null ? state.saleMin : ''}
              onChange={saleMinHandler}
              disabled={!saleCheckbox}
              filled={saleCheckbox ? state.saleMin : null}
            />
          </RowDiv>
          {!invalidValueInput && (
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
      </ModalContainer>
    </Modal>
  )
}

export default CostModal
