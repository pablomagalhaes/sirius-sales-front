import { MenuItem, Modal } from '@material-ui/core'
import { Button } from 'fiorde-fe-components'
import React, { useEffect, useState } from 'react'
import AlertIcon from '../../../application/icons/AlertIcon'
import CloseIcon from '../../../application/icons/CloseIcon'
import {
  AlertIconDiv,
  CheckBox,
  CheckBoxLabel,
  ModalDiv
} from './ItemModalStyles'
import { I18n } from 'react-redux-i18n'
import CheckIcon from '../../../application/icons/CheckIcon'
import ControlledSelect from '../ControlledSelect'
import ControlledInput from '../ControlledInput'
import {
  ButtonDiv,
  ItemModalForm,
  HeaderDiv,
  Label,
  RedColorSpan,
  RowDiv,
  RowReverseDiv,
  Title
} from '../StyledComponents/modalStyles'

export interface ItemModalData {
  amount: string
  codUn: string
  cubage: string | null
  dangerous: boolean
  diameter: string | null
  height: string | null
  imo: string | null
  length: string | null
  rawWeight: string | null
  type: string
  width: string | null
  id: number | null
}
interface ItemModalProps {
  dataProp: ItemModalData
  handleAdd: (item) => void
  open: boolean
  setClose: () => void
  title: string
  modal: string
  specifications: string
}

export const initialState = {
  amount: '',
  codUn: '',
  cubage: null,
  dangerous: false,
  diameter: null,
  height: null,
  imo: null,
  length: null,
  rawWeight: null,
  type: '',
  width: null,
  id: null
}

const ItemModal = ({
  dataProp,
  handleAdd,
  open,
  setClose,
  title,
  modal,
  specifications
}: ItemModalProps): JSX.Element => {
  // Mock de tipos, valores serão especificados posteriormente
  const typeList = ['Caixas', 'Bacias']
  // Mock de imo, valores serão especificados posteriormente
  const imoList = ['1', '2', '3']
  const rgxFloat = /^[0-9]*,?[0-9]*$/
  const rgxInt = /^[0-9]*$/
  const [data, setData] = useState<ItemModalData>(initialState)
  const [invalidInput, setInvalidInput] = useState(false)

  useEffect(() => {
    if (dataProp !== initialState) {
      setData(dataProp)
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
    if (modal === '2' && specifications === 'flc') {
      return !(
        data.type.length === 0 ||
        data.amount.length === 0 ||
        (data.codUn === null || data.codUn?.length === 0) ||
        (data.dangerous && (data.imo === null || data.imo?.length === 0))
      )
    } else {
      return !(
        data.type.length === 0 ||
        data.amount.length === 0 ||
        (data.rawWeight === null || data.rawWeight?.length === 0) ||
        (data.height === null || data.height?.length === 0) ||
        (data.width === null || data.width?.length === 0) ||
        (data.length === null || data.length?.length === 0) ||
        (data.cubage === null || data.cubage?.length === 0) ||
        data.codUn.length === 0 ||
        (data.dangerous && (data.imo === null || data.imo?.length === 0))
      )
    }
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
            <CloseIcon onClick={handleOnClose} />
          </RowReverseDiv>
        </HeaderDiv>
        <ItemModalForm>
          <RowDiv>
            <Label width="43.6%">
              {I18n.t('components.itemModal.type')}
              <RedColorSpan> *</RedColorSpan>
            </Label>
            <Label width="29%">
              {I18n.t('components.itemModal.amount')}
              <RedColorSpan> *</RedColorSpan>
            </Label>
            <Label width="27.4%">
              {I18n.t('components.itemModal.rawWeight')}
              {(modal === '1' ||
                (modal === '2' && specifications === 'lcl') ||
                modal === '3') && <RedColorSpan> *</RedColorSpan>}
            </Label>
          </RowDiv>
          <RowDiv margin={true}>
            <div style={{ width: '198px', height: '32px', margin: '12px 0 5px 0' }}>
              <ControlledSelect
                onChange={e => (setData({ ...data, type: e.target.value }))}
                displayEmpty
                value={data.type}
                disableUnderline
                placeholder={data.type}
                toolTipTitle={I18n.t('components.itemModal.requiredField')}
                invalid={
                  invalidInput && (data.type === null || data.type.length === 0)
                }
              >
                <MenuItem disabled value="">
                  <span style={{ marginLeft: '10px' }}>{I18n.t('components.itemModal.choose')}</span>
                </MenuItem>
                {typeList.map((type) => {
                  return (
                    <MenuItem key={`${type}_key`} value={type}>
                      <span style={{ marginLeft: '10px' }}>{type}</span>
                    </MenuItem>
                  )
                })}
              </ControlledSelect>
            </div>
            <div style={{ width: '126px', height: '30px', marginLeft: '18px', marginTop: '12px' }}>
              <ControlledInput
                toolTipTitle={I18n.t('components.itemModal.requiredField')}
                invalid={
                  invalidInput &&
                  (data.amount === null || data.amount.length === 0)
                }
                value={data.amount}
                onChange={e => { validateIntInput(e.target.value) !== null && (setData({ ...data, amount: e.target.value })) }}
                variant="outlined"
                size="small"
                modal
              />
            </div>
            <div style={{ width: '126px', height: '30px', marginLeft: '18px', marginTop: '12px' }}>
              <ControlledInput
                toolTipTitle={I18n.t('components.itemModal.requiredField')}
                invalid={
                  invalidInput && !(specifications === 'flc' && modal === '2') &&
                  (data.rawWeight === null || data.rawWeight.length === 0)
                }
                value={data.rawWeight != null ? data.rawWeight : ''}
                onChange={e => { validateFloatInput(e.target.value) !== null && (setData({ ...data, rawWeight: e.target.value })) }}
                variant="outlined"
                size="small"
                modal
              />
            </div>
          </RowDiv>
          <RowDiv>
          <Label width="44%">
              {I18n.t('components.itemModal.hwl')}
              {(modal === '1' ||
                (modal === '2' && specifications === 'lcl') ||
                modal === '3') && <RedColorSpan> *</RedColorSpan>}
            </Label>
            <Label width="29%">{I18n.t('components.itemModal.diameter')}</Label>
            <Label width="27%">
              {I18n.t('components.itemModal.cubage')}
              {(modal === '1' ||
                (modal === '2' && specifications === 'lcl') ||
                modal === '3') && <RedColorSpan> *</RedColorSpan>}
            </Label>
          </RowDiv>
          <RowDiv margin={true}>
            <div style={{ width: '60px', height: '30px', marginRight: '8px', marginTop: '12px' }}>
              <ControlledInput
                toolTipTitle={I18n.t('components.itemModal.requiredField')}
                invalid={
                  invalidInput && !(specifications === 'flc' && modal === '2') &&
                  (data.length === null || data.length.length === 0)
                }
                value={data.length != null ? data.length : ''}
                onChange={e => { validateFloatInput(e.target.value) !== null && (setData({ ...data, length: e.target.value })) }}
                variant="outlined"
                size="small"
                modal
              />
            </div>
            <div style={{ width: '60px', height: '30px', marginRight: '8px', marginTop: '12px' }}>
              <ControlledInput
                toolTipTitle={I18n.t('components.itemModal.requiredField')}
                value={data.width != null ? data.width : ''}
                onChange={e => { validateFloatInput(e.target.value) !== null && (setData({ ...data, width: e.target.value })) }}
                invalid={
                  invalidInput && !(specifications === 'flc' && modal === '2') &&
                  (data.width === null || data.width.length === 0)
                }
                variant="outlined"
                size="small"
                modal
              />
            </div>
            <div style={{ width: '60px', height: '30px', marginRight: '8px', marginTop: '12px' }}>
              <ControlledInput
                toolTipTitle={I18n.t('components.itemModal.requiredField')}
                inputProps={{ 'data-testid': 'height' }}
                value={data.height != null ? data.height : ''}
                onChange={e => { validateFloatInput(e.target.value) !== null && (setData({ ...data, height: e.target.value })) }}
                invalid={
                  invalidInput && !(specifications === 'flc' && modal === '2') &&
                  (data.height === null || data.height.length === 0)
                }
                variant="outlined"
                size="small"
                modal
              />
            </div>

            <div style={{ width: '126px', height: '30px', marginLeft: '15px', marginTop: '12px' }}>
              <ControlledInput
                toolTipTitle={I18n.t('components.itemModal.requiredField')}
                invalid={false}
                value={data.diameter != null ? data.diameter : ''}
                onChange={e => { validateFloatInput(e.target.value) !== null && (setData({ ...data, diameter: e.target.value })) }}
                variant="outlined"
                size="small"
                modal
              />
            </div>
            <div style={{ width: '126px', height: '30px', marginLeft: '18px', marginTop: '12px' }}>
              <ControlledInput
                toolTipTitle={I18n.t('components.itemModal.requiredField')}
                invalid={
                  invalidInput && !(specifications === 'flc' && modal === '2') &&
                  (data.cubage === null || data.cubage.length === 0)
                }
                value={data.cubage != null ? data.cubage : ''}
                onChange={e => { validateFloatInput(e.target.value) !== null && (setData({ ...data, cubage: e.target.value })) }}
                variant="outlined"
                size="small"
                modal
              />
            </div>
          </RowDiv>
          <RowDiv>
            <Label width="29%">
              {I18n.t('components.itemModal.hazardous')}
            </Label>
            <Label width="44%">
              {I18n.t('components.itemModal.imo')}
              {data.dangerous && <RedColorSpan> *</RedColorSpan>}
            </Label>
            <Label width="27%">
              {I18n.t('components.itemModal.codUn')}
              <RedColorSpan> *</RedColorSpan>
            </Label>
          </RowDiv>
          <RowDiv>
            <CheckBox checked={data.dangerous} onClick={() => (setData({ ...data, dangerous: !data.dangerous }))}>
              {data.dangerous && <CheckIcon />}
            </CheckBox>
            <CheckBoxLabel>{I18n.t('components.itemModal.yes')}</CheckBoxLabel>
            <AlertIconDiv>
              <AlertIcon />
            </AlertIconDiv>
            <div style={{ width: '198px', height: '32px', margin: '12px 0 5px 0' }}>
              <ControlledSelect
                value={data.imo != null ? data.imo : ''}
                onChange={e => (setData({ ...data, imo: e.target.value }))}
                disableUnderline
                displayEmpty
                placeholder={data.imo != null ? data.imo : ''}
                invalid={
                  invalidInput && data.dangerous &&
                  (data.imo === null || data.imo.length === 0)
                }
                toolTipTitle={I18n.t('components.itemModal.requiredField')}
              >
                <MenuItem disabled value="">
                  <span style={{ marginLeft: '10px' }}>{I18n.t('components.itemModal.choose')}</span>
                </MenuItem>
                {imoList.map((imo) => {
                  return (
                    <MenuItem key={`${imo}_key`} value={imo}>
                      <span style={{ marginLeft: '10px' }}>{imo}</span>
                    </MenuItem>
                  )
                })}
              </ControlledSelect>
            </div>
            <div style={{ width: '126px', height: '30px', marginLeft: '18px', marginTop: '12px' }}>
              <ControlledInput
                toolTipTitle={I18n.t('components.itemModal.requiredField')}
                invalid={
                  invalidInput &&
                  (data.codUn === null || data.codUn.length === 0)
                }
                value={data.codUn}
                onChange={e => (setData({ ...data, codUn: e.target.value }))}
                variant="outlined"
                size="small"
                modal
              />
            </div>
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
        </ItemModalForm>
      </ModalDiv>
    </Modal>
  )
}
export default ItemModal
