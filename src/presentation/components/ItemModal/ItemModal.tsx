import { MenuItem, Modal } from '@material-ui/core'
import { Button } from 'fiorde-fe-components'
import React, { useState } from 'react'
import AlertIcon from '../../../application/icons/AlertIcon'
import CloseIcon from '../../../application/icons/CloseIcon'
import {
  Form,
  HeaderDiv,
  ModalDiv,
  RowReverseDiv,
  Label,
  Title,
  RowDiv,
  StyledSelect,
  Input,
  MeasureInput,
  CheckBox,
  CheckBoxLabel,
  AlertIconDiv,
  ButtonDiv,
  NotNull
} from './ItemModalStyles'
import { I18n } from 'react-redux-i18n'
import CheckIcon from '../../../application/icons/CheckIcon'

interface ItemModalProps {
  title: string
  open: boolean
  setOpen: () => void
  setClose: () => void
  handleAdd: (item) => void
}

const ItemModal = ({ title, open, setOpen, setClose, handleAdd }: ItemModalProps): JSX.Element => {
  const typeList = ['Caixas', 'Bacias']
  const imoList = ['1', '2', '3']
  const initialState = {
    type: '',
    amount: '',
    rawWeight: '',
    height: '',
    width: '',
    length: '',
    diameter: '',
    cubage: '',
    dangerous: false,
    imo: '',
    codUn: ''
  }
  const [data, setData] = useState(initialState)

  const handleOnClose = (): void => {
    setData(initialState)
    setClose()
  }

  const validateData = (): boolean => {
    if (
      data.type.length === 0 ||
      data.amount.length === 0 ||
      data.rawWeight.length === 0 ||
      data.height.length === 0 ||
      data.width.length === 0 ||
      data.length.length === 0 ||
      data.cubage.length === 0
    ) {
      return false
    } else {
      return true
    }
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
    setData((currentState) => {
      return { ...currentState, amount: e.target.value }
    })
  }

  const handleRawWeightChange = (e): void => {
    setData((currentState) => {
      return { ...currentState, rawWeight: e.target.value }
    })
  }

  const handleWidthChange = (e): void => {
    setData((currentState) => {
      return { ...currentState, width: e.target.value }
    })
  }

  const handleHeightChange = (e): void => {
    setData((currentState) => {
      return { ...currentState, height: e.target.value }
    })
  }

  const handleLengthChange = (e): void => {
    setData((currentState) => {
      return { ...currentState, length: e.target.value }
    })
  }

  const handleDiameterChange = (e): void => {
    setData((currentState) => {
      return { ...currentState, diameter: e.target.value }
    })
  }

  const handleCubageChange = (e): void => {
    setData((currentState) => {
      return { ...currentState, cubage: e.target.value }
    })
  }

  const handleDangerousChange = (e): void => {
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
              {I18n.t('components.itemModal.type')} <NotNull> *</NotNull>
            </Label>
            <Label width="29%">
              {I18n.t('components.itemModal.amount')} <NotNull> *</NotNull>
            </Label>
            <Label width="27%">
              {I18n.t('components.itemModal.rawWeight')} <NotNull> *</NotNull>
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
              {I18n.t('components.itemModal.hwl')} <NotNull> *</NotNull>
            </Label>
            <Label width="29%">{I18n.t('components.itemModal.diameter')}</Label>
            <Label width="27%">
              {I18n.t('components.itemModal.cubage')} <NotNull> *</NotNull>
            </Label>
          </RowDiv>
          <RowDiv margin={true}>
            <MeasureInput
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
            <Input value={data.diameter} onChange={handleDiameterChange} />
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
              value={data.imo}
              onChange={handleImoChange}
              disableUnderline
              placeholder={data.imo}
              displayEmpty
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
            <Input value={data.codUn} onChange={handleCodUnChange} />
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
