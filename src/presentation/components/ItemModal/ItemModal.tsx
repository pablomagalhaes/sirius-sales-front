import { MenuItem, Modal } from '@material-ui/core'
import { Button } from 'fiorde-fe-components'
import React, { useState } from 'react'
import AlertIcon from '../../../application/icons/AlertIcon'
import CloseIcon from '../../../application/icons/CloseIcon'
import {
  AlertIconDiv,
  ButtonDiv,
  CheckBox,
  CheckBoxLabel,
  Form,
  HeaderDiv,
  Input,
  Label,
  MeasureInput,
  ModalDiv,
  RedColorSpan,
  RowDiv,
  RowReverseDiv,
  StyledSelect,
  Title
} from './ItemModalStyles'
import { I18n } from 'react-redux-i18n'
import CheckIcon from '../../../application/icons/CheckIcon'

interface ItemModalData {
  amount: string
  codUn: string | null
  cubage: string
  dangerous: boolean
  diameter: string | null
  height: string
  imo: string | null
  length: string
  rawWeight: string
  type: string
  width: string
}
interface ItemModalProps {
  dataProp?: ItemModalData
  handleAdd: (item) => void
  open: boolean
  setClose: () => void
  setOpen: () => void
  title: string
}

const ItemModal = ({ dataProp, handleAdd, open, setClose, setOpen, title }: ItemModalProps): JSX.Element => {
  // Mock de tipos, valores serão especificados posteriormente
  const typeList = ['Caixas', 'Bacias']
  // Mock de imo, valores serão especificados posteriormente
  const imoList = ['1', '2', '3']
  const rgxFloat = /^[0-9]*,?[0-9]*$/
  const rgxInt = /^[0-9]*$/
  const initialState = {
    amount: '',
    codUn: '',
    cubage: '',
    dangerous: false,
    diameter: '',
    height: '',
    imo: '',
    length: '',
    rawWeight: '',
    type: '',
    width: ''
  }
  const [data, setData] = useState((dataProp != null) ? dataProp : initialState)

  const handleOnClose = (): void => {
    setData(initialState)
    setClose()
  }

  const validateFloatInput = (value: string): RegExpMatchArray | null => {
    return value.match(rgxFloat)
  }

  const validateIntInput = (value: string): RegExpMatchArray | null => {
    return value.match(rgxInt)
  }

  const validateData = (): boolean => {
    return !(data.type.length === 0 ||
      data.amount.length === 0 ||
      data.rawWeight.length === 0 ||
      data.height.length === 0 ||
      data.width.length === 0 ||
      data.length.length === 0 ||
      data.cubage.length === 0)
  }

  const handleOnAdd = (): void => {
    if (validateData()) {
      handleAdd(data)
      handleOnClose()
    } else {
      alert('preencher campos obrigatórios')
    }
  }

  const handleTypeChange = (e): void => {
    setData((currentState) => {
      return { ...currentState, type: e.target.value }
    })
  }

  const handleAmountChange = (e): void => {
    const validatedInput = validateIntInput(e.target.value)
    if (validatedInput !== null) {
      setData((currentState) => {
        return { ...currentState, amount: validatedInput[0] }
      })
    }
  }

  const handleRawWeightChange = (e): void => {
    const validatedInput = validateFloatInput(e.target.value)
    if (validatedInput !== null) {
      setData((currentState) => {
        return { ...currentState, rawWeight: validatedInput[0] }
      })
    }
  }

  const handleWidthChange = (e): void => {
    const validatedInput = validateFloatInput(e.target.value)
    if (validatedInput !== null) {
      setData((currentState) => {
        return { ...currentState, width: validatedInput[0] }
      })
    }
  }

  const handleHeightChange = (e): void => {
    const validatedInput = validateFloatInput(e.target.value)
    if (validatedInput !== null) {
      setData((currentState) => {
        return { ...currentState, height: validatedInput[0] }
      })
    }
  }

  const handleLengthChange = (e): void => {
    const validatedInput = validateFloatInput(e.target.value)
    if (validatedInput !== null) {
      setData((currentState) => {
        return { ...currentState, length: validatedInput[0] }
      })
    }
  }

  const handleDiameterChange = (e): void => {
    const validatedInput = validateFloatInput(e.target.value)
    if (validatedInput !== null) {
      setData((currentState) => {
        return { ...currentState, diameter: validatedInput[0] }
      })
    }
  }

  const handleCubageChange = (e): void => {
    const validatedInput = validateFloatInput(e.target.value)
    if (validatedInput !== null) {
      setData((currentState) => {
        return { ...currentState, cubage: validatedInput[0] }
      })
    }
  }

  const handleDangerousChange = (): void => {
    setData((currentState) => {
      return { ...currentState, dangerous: !currentState.dangerous }
    })
  }

  const handleImoChange = (e): void => {
    setData((currentState) => {
      return { ...currentState, imo: e.target.value }
    })
  }

  const handleCodUnChange = (e): void => {
    setData((currentState) => {
      return { ...currentState, codUn: e.target.value }
    })
  }

  return (
    <Modal open={open} onClose={handleOnClose}>
      <ModalDiv>
        <HeaderDiv>
          <Title>{title}</Title>
          <RowReverseDiv>
            <CloseIcon onClick={handleOnClose} />
          </RowReverseDiv>
        </HeaderDiv>
        <Form>
          <RowDiv>
            <Label width="44%">
              {I18n.t('components.itemModal.type')} <RedColorSpan> *</RedColorSpan>
            </Label>
            <Label width="29%">
              {I18n.t('components.itemModal.amount')} <RedColorSpan> *</RedColorSpan>
            </Label>
            <Label width="27%">
              {I18n.t('components.itemModal.rawWeight')} <RedColorSpan> *</RedColorSpan>
            </Label>
          </RowDiv>
          <RowDiv margin={true}>
            <StyledSelect
              onChange={handleTypeChange}
              displayEmpty
              value={data.type}
              disableUnderline
              placeholder={data.type}
            >
              <MenuItem disabled value="">
                {I18n.t('components.itemModal.choose')}
              </MenuItem>
              {typeList.map((type) => {
                return (
                  <MenuItem key={`${type}_key`} value={type}>
                    {type}
                  </MenuItem>
                )
              })}
            </StyledSelect>
            <Input value={data.amount} onChange={handleAmountChange} />
            <Input value={data.rawWeight} onChange={handleRawWeightChange} />
          </RowDiv>
          <RowDiv>
            <Label width="44%">
              {I18n.t('components.itemModal.hwl')} <RedColorSpan> *</RedColorSpan>
            </Label>
            <Label width="29%">{I18n.t('components.itemModal.diameter')}</Label>
            <Label width="27%">
              {I18n.t('components.itemModal.cubage')} <RedColorSpan> *</RedColorSpan>
            </Label>
          </RowDiv>
          <RowDiv margin={true}>
            <MeasureInput
              aria-label="height"
              value={data.height}
              onChange={handleHeightChange}
              margin={true}
            />
            <MeasureInput
              value={data.width}
              onChange={handleWidthChange}
              margin={true}
            />
            <MeasureInput value={data.length} onChange={handleLengthChange} />
            <Input value={(data.diameter != null) ? data.diameter : ''} onChange={handleDiameterChange} />
            <Input value={data.cubage} onChange={handleCubageChange} />
          </RowDiv>
          <RowDiv>
            <Label width="30%">
              {I18n.t('components.itemModal.hazardous')}
            </Label>
            <Label width="43%">{I18n.t('components.itemModal.imo')}</Label>
            <Label width="27%">{I18n.t('components.itemModal.codUn')}</Label>
          </RowDiv>
          <RowDiv>
            <CheckBox checked={data.dangerous} onClick={handleDangerousChange}>
              {data.dangerous && <CheckIcon />}
            </CheckBox>
            <CheckBoxLabel>{I18n.t('components.itemModal.yes')}</CheckBoxLabel>
            <AlertIconDiv>
              <AlertIcon />
            </AlertIconDiv>
            <StyledSelect
              value={(data.imo != null) ? data.imo : ''}
              onChange={handleImoChange}
              disableUnderline
              displayEmpty
              placeholder={(data.imo != null) ? data.imo : ''}
            >
              <MenuItem disabled value="">
                {I18n.t('components.itemModal.choose')}
              </MenuItem>
              {imoList.map((imo) => {
                return (
                  <MenuItem key={`${imo}_key`} value={imo}>
                    {imo}
                  </MenuItem>
                )
              })}
            </StyledSelect>
            <Input value={(data.codUn != null) ? data.codUn : ''} onChange={handleCodUnChange} />
          </RowDiv>
          <RowDiv>
            <ButtonDiv>
              <Button
                text={I18n.t('components.itemModal.save')}
                backgroundGreen={true}
                icon=""
                onAction={handleOnAdd}
              />
            </ButtonDiv>
          </RowDiv>
        </Form>
      </ModalDiv>
    </Modal>
  )
}
export default ItemModal
