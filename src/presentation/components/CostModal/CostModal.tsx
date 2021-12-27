import { MenuItem, Modal } from '@material-ui/core'
import { Button } from 'fiorde-fe-components'
import React, { useEffect, useReducer, useState } from 'react'
import CloseIcon from '../../../application/icons/CloseIcon'
import {
  Form,
  HeaderDiv,
  Label,
  ModalContainer,
  RowDiv,
  RowReverseDiv,
  StyledSelect,
  Title,
  CheckBox,
  CheckBoxLabel,
  Input,
  PlaceholderDiv,
  PlaceholderSpan,
  RedColorSpan,
  ReplyDiv,
  ReplyIconDiv,
  ButtonDiv
} from './CostModalStyles'
import { I18n } from 'react-redux-i18n'
import CheckIcon from '../../../application/icons/CheckItem'
import ReplyIcon from '../../../application/icons/ReplyIcon'

interface ItemModalData {
  agent: string
  buyCurrency: string | null
  buyMin: string | null
  buyValue: string | null
  description: string
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
  setOpen: () => void
  title: string
}

const CostModal = ({
  dataProp,
  handleAdd,
  open,
  setClose,
  setOpen,
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
    saleMin: null
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
  const currencyList = ['BRL', 'USD']
  const descriptionList = ['Descrição1', 'Descrição2', 'Descrição3']
  const [buyCheckbox, setBuyCheckBox] = useState(state.buyValue != null)
  const [saleCheckbox, setSaleCheckBox] = useState(state.saleValue != null)
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
        alert('Preencher valor de Compra')
        invalid = true
      }
    } else {
      item = { ...item, buyMin: '', buyCurrency: '', buyValue: '' }
    }
    if (saleCheckbox) {
      if (item.saleValue === null || item.saleValue.length === 0) {
        alert('Preencher valor de venda')
        invalid = true
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
      alert('Preencher campos obrigatórios')
    }
    if (!invalid) {
      handleAdd(item)
      setClose()
    }
  }

  useEffect(() => {
    setSaleCheckBox(state.saleValue != null)
  }, [state.saleMin, state.saleValue])

  return (
    <Modal open={open} onClose={setClose}>
      <ModalContainer>
        <HeaderDiv>
          <Title>{title}</Title>
          <RowReverseDiv>
            <CloseIcon onClick={setClose} />
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
            <StyledSelect
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
            </StyledSelect>
            <StyledSelect
              width="342px"
              onChange={(e) =>
                dispatch({ type: 'description', value: e.target.value })
              }
              displayEmpty
              value={state.description}
              placeholder={state.description}
              disableUnderline
            >
              <MenuItem disabled value="">
                {I18n.t('components.costModal.choose')}
              </MenuItem>
              {descriptionList.map((description) => {
                return (
                  <MenuItem key={`${description}_key`} value={description}>
                    {description}
                  </MenuItem>
                )
              })}
            </StyledSelect>
          </RowDiv>
          <RowDiv>
            <Label width="100%">
              {I18n.t('components.costModal.agent')}
              <RedColorSpan> *</RedColorSpan>
            </Label>
          </RowDiv>
          <RowDiv>
            <StyledSelect
              width="485px"
              onChange={(e) =>
                dispatch({ type: 'agent', value: e.target.value })
              }
              displayEmpty
              value={state.agent}
              disableUnderline
              placeholder={state.agent}
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
            </StyledSelect>
          </RowDiv>
          <RowDiv>
            <CheckBox aria-label="checkbox" checked={buyCheckbox} onClick={buyCheckboxHandler}>
              {buyCheckbox && <CheckIcon />}
            </CheckBox>
            <CheckBoxLabel>
              {I18n.t('components.costModal.buyValue')}
            </CheckBoxLabel>
          </RowDiv>
          <RowDiv>
            <StyledSelect
              width="84px"
              onChange={(e) =>
                dispatch({ type: 'buyCurrency', value: e.target.value })
              }
              displayEmpty
              value={state.buyCurrency}
              disableUnderline
              disabled={!buyCheckbox}
            >
              {currencyList.map((currencyList) => {
                return (
                  <MenuItem key={`${currencyList}_key`} value={currencyList}>
                    {currencyList}
                  </MenuItem>
                )
              })}
            </StyledSelect>
            <PlaceholderDiv>
              <label>
                {(state.buyValue === null || state.buyValue.length === 0) && (
                  <PlaceholderSpan>
                    {I18n.t('components.costModal.value')}
                    <RedColorSpan> *</RedColorSpan>
                  </PlaceholderSpan>
                )}
                <Input
                  value={state.buyValue != null ? state.buyValue : ''}
                  onChange={buyValueHandler}
                  disabled={!buyCheckbox}
                />
              </label>
            </PlaceholderDiv>
            <Input
              aria-label="minimum"
              value={state.buyMin != null ? state.buyMin : ''}
              onChange={buyMinHandler}
              placeholder={I18n.t('components.costModal.minimum')}
              disabled={!buyCheckbox}
            />
            <ReplyDiv disabled={!buyCheckbox} onClick={replyForSaleHandler}>
              <ReplyIconDiv>
                <ReplyIcon />
              </ReplyIconDiv>
              {I18n.t('components.costModal.replyForSale')}
            </ReplyDiv>
          </RowDiv>
          <RowDiv>
            <CheckBox checked={saleCheckbox} onClick={saleCheckboxHandler}>
              {saleCheckbox && <CheckIcon />}
            </CheckBox>
            <CheckBoxLabel>
              {I18n.t('components.costModal.saleValue')}
            </CheckBoxLabel>
          </RowDiv>
          <RowDiv>
            <StyledSelect
              width="84px"
              onChange={(e) =>
                dispatch({ type: 'saleCurrency', value: e.target.value })
              }
              displayEmpty
              value={state.saleCurrency}
              disableUnderline
              disabled={!saleCheckbox}
            >
              {currencyList.map((currencyList) => {
                return (
                  <MenuItem key={`${currencyList}_key`} value={currencyList}>
                    {currencyList}
                  </MenuItem>
                )
              })}
            </StyledSelect>
            <PlaceholderDiv>
              <label>
                {(state.saleValue === null || state.saleValue.length === 0) && (
                  <PlaceholderSpan>
                    {I18n.t('components.costModal.value')}
                    <RedColorSpan> *</RedColorSpan>
                  </PlaceholderSpan>
                )}
                <Input
                  value={state.saleValue != null ? state.saleValue : ''}
                  onChange={saleValueHandler}
                  disabled={!saleCheckbox}
                />
              </label>
            </PlaceholderDiv>
            <Input
              placeholder={I18n.t('components.costModal.minimum')}
              value={state.saleMin != null ? state.saleMin : ''}
              onChange={saleMinHandler}
              disabled={!saleCheckbox}
            />
          </RowDiv>
          <ButtonDiv>
            <Button
              backgroundGreen={true}
              icon={''}
              onAction={addHandler}
              text={I18n.t('components.costModal.save')}
            />
          </ButtonDiv>
        </Form>
      </ModalContainer>
    </Modal>
  )
}

export default CostModal
