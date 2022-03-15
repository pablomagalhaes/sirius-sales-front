import { MenuItem, Modal } from '@material-ui/core'
import { Button } from 'fiorde-fe-components'
import React, { useEffect, useState } from 'react'
import AlertIcon from '../../../application/icons/AlertIcon'
import Autocomplete from '@material-ui/lab/Autocomplete'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown'
import CloseIcon from '../../../application/icons/CloseIcon'
import {
  AlertIconDiv,
  AmountDiv,
  CheckBox,
  CheckBoxArea,
  CheckBoxLabel,
  ModalDiv,
  StyledBox
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
  Title,
  CloseIconContainer
} from '../StyledComponents/modalStyles'
import NumberFormat from 'react-number-format'
import newProposal from '../../../infrastructure/api/newProposalService'
import { Input } from '../CostModal/CostModalStyles'

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
  type: string | null
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
  type: null,
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
  const [containerTypeList, setContainerTypeList] = useState<any[]>([])
  const [packagingList, setPackagingList] = useState<any[]>([])
  const [imoList, setImoList] = useState<any[]>([])
  const rgxFloat = /^[0-9]*,?[0-9]*$/
  const rgxInt = /^[0-9]*$/
  const [data, setData] = useState<ItemModalData>(initialState)
  const [invalidInput, setInvalidInput] = useState(false)

  useEffect(() => {
    void (async function () {
      await newProposal.getContainerType()
        .then((response) => setContainerTypeList(response))
        .catch((err) => console.log(err))
    })()
  }, [])

  useEffect(() => {
    void (async function () {
      await newProposal.getPackaging()
        .then((response) => setPackagingList(response))
        .catch((err) => console.log(err))
    })()
  }, [])

  useEffect(() => {
    if (dataProp !== initialState) {
      setData(dataProp)
    }
  }, [open])

  useEffect(() => {
    void (async function () {
      await newProposal.getImo()
        .then((response) => setImoList(response))
        .catch((err) => console.log(err))
    })()
  }, [])

  const handleOnClose = (): void => {
    setData(initialState)
    setInvalidInput(false)
    setClose()
  }
  const marineFCL = (): boolean => {
    return modal === 'SEA' && specifications === 'fcl'
  }

  const validateFloatInput = (value: string): RegExpMatchArray | null => {
    return value.match(rgxFloat)
  }

  const validateIntInput = (value: string): RegExpMatchArray | null => {
    return value.match(rgxInt)
  }

  const rightToLeftFormatter = (value: string, decimal: number): string => {
    if (Number(value) === 0) return ''

    let amount = ''
    if (amount.length > decimal) {
      amount = parseInt(value).toFixed(decimal)
    } else {
      amount = (parseInt(value) / 10 ** decimal).toFixed(decimal)
    }

    return String(amount).replace('.', ',')
  }

  const validateData = (): boolean => {
    if (marineFCL()) {
      return !(
        (data.type === null || data.type?.length === 0) ||
        data.amount.length === 0 ||
        (data.codUn === null || data.codUn?.length === 0) ||
        (data.dangerous && (data.imo === null || data.imo?.length === 0))
      )
    } else {
      return !(
        (data.type === null || data.type?.length === 0) ||
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

  const hasDiameter = (): boolean => {
    return modal !== 'LAND'
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
        <ItemModalForm>
          <RowDiv>
            <Label width="43.6%">
              {marineFCL() ? I18n.t('components.itemModal.container') : I18n.t('components.itemModal.packaging') }
              <RedColorSpan> *</RedColorSpan>
            </Label>
            <Label width="29%">
              {I18n.t('components.itemModal.amount')}
              <RedColorSpan> *</RedColorSpan>
            </Label>
            {!(marineFCL()) && (
              <Label width="27.4%">
                {I18n.t('components.itemModal.rawWeight')}
                {(modal === 'AIR' ||
                  (modal === 'SEA' && specifications === 'lcl') ||
                  modal === 'LAND') && <RedColorSpan> *</RedColorSpan>}
              </Label>
            )}
          </RowDiv>
          <RowDiv margin={true}>
            <Autocomplete
              style={{ position: 'relative' }}
              options={ marineFCL() ? containerTypeList.map((item) => item.type) : packagingList.map((item) => item.packaging)}
              value={data.type}
              onChange={(e, newValue) => setData({ ...data, type: newValue })}
              renderInput={(params) => (
                <div ref={params.InputProps.ref}>
                  <Input
                    {...params.inputProps}
                    variant="outlined"
                    style={{
                      width: '198px',
                      height: '33px'
                    }}
                    placeholder={I18n.t('components.itemModal.choose')}
                    toolTipTitle={I18n.t('components.itemModal.requiredField')}
                    invalid={ invalidInput && (data.type === null || data.type?.length === 0) }
                  />
                  <StyledBox {...params.inputProps}>
                    <ArrowDropDownIcon />
                  </StyledBox>
                </div>
              )}
            />
            <AmountDiv>
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
                $modal
              />
            </AmountDiv>
            {!(marineFCL()) && (
              <div style={{ width: '126px', height: '30px', marginLeft: '18px', marginTop: '12px' }}>
                <NumberFormat
                  decimalSeparator={','}
                  thousandSeparator={'.'}
                  decimalScale={2}
                  format={(value: string) => rightToLeftFormatter(value, 2)}
                  customInput={ControlledInput}
                  onChange={e => { validateFloatInput(e.target.value) !== null && (setData({ ...data, rawWeight: e.target.value })) }}
                  toolTipTitle={I18n.t('components.itemModal.requiredField')}
                  invalid={
                    invalidInput && (!marineFCL()) &&
                    (data.rawWeight === null || data.rawWeight.length === 0)
                  }
                  value={data.rawWeight != null ? data.rawWeight : ''}
                  variant="outlined"
                  size="small"
                  $modal
                />
              </div>
            )}
          </RowDiv>
          <RowDiv>
            {!(marineFCL()) && (
              <Label width="44%">
                {I18n.t('components.itemModal.hwl')}
                {(modal === 'AIR' ||
                  (modal === 'SEA' && specifications === 'lcl') ||
                  modal === 'LAND') && <RedColorSpan> *</RedColorSpan>}
              </Label>
            )}
            {hasDiameter() && (
              <Label width="29%">{I18n.t('components.itemModal.diameter')}</Label>
            )}
            {!(marineFCL()) && (
              <Label width="27%">
                {I18n.t('components.itemModal.cubage')}
                {(modal === 'AIR' ||
                  (modal === 'SEA' && specifications === 'lcl') ||
                  modal === 'LAND') && <RedColorSpan> *</RedColorSpan>}
              </Label>
            )}
          </RowDiv>
          <RowDiv margin={true}>
            {!(marineFCL()) && (
              <>
                <div style={{ width: '60px', height: '30px', marginRight: '8px', marginTop: '12px' }}>
                  <NumberFormat
                    decimalSeparator={','}
                    thousandSeparator={'.'}
                    decimalScale={2}
                    format={(value: string) => rightToLeftFormatter(value, 2)}
                    customInput={ControlledInput}
                    toolTipTitle={I18n.t('components.itemModal.requiredField')}
                    invalid={
                      invalidInput && !(marineFCL()) &&
                      (data.length === null || data.length.length === 0)
                    }
                    value={data.length != null ? data.length : ''}
                    onChange={e => { validateFloatInput(e.target.value) !== null && (setData({ ...data, length: e.target.value })) }}
                    variant="outlined"
                    size="small"
                    $modal
                  />
                </div>
                <div style={{ width: '60px', height: '30px', marginRight: '8px', marginTop: '12px' }}>
                  <NumberFormat
                    decimalSeparator={','}
                    thousandSeparator={'.'}
                    decimalScale={2}
                    format={(value: string) => rightToLeftFormatter(value, 2)}
                    customInput={ControlledInput}
                    toolTipTitle={I18n.t('components.itemModal.requiredField')}
                    value={data.width != null ? data.width : ''}
                    onChange={e => { validateFloatInput(e.target.value) !== null && (setData({ ...data, width: e.target.value })) }}
                    invalid={
                      invalidInput && !(marineFCL()) &&
                      (data.width === null || data.width.length === 0)
                    }
                    variant="outlined"
                    size="small"
                    $modal
                  />
                </div>
                <div style={{ width: '60px', height: '30px', marginRight: '8px', marginTop: '12px' }}>
                  <NumberFormat
                    decimalSeparator={','}
                    thousandSeparator={'.'}
                    decimalScale={2}
                    format={(value: string) => rightToLeftFormatter(value, 2)}
                    customInput={ControlledInput}
                    toolTipTitle={I18n.t('components.itemModal.requiredField')}
                    value={data.height != null ? data.height : ''}
                    onChange={e => { validateFloatInput(e.target.value) !== null && (setData({ ...data, height: e.target.value })) }}
                    invalid={
                      invalidInput && !(marineFCL()) &&
                      (data.height === null || data.height.length === 0)
                    }
                    variant="outlined"
                    size="small"
                    $modal
                  />
                </div>
              </>
            )}
            {hasDiameter() && !(marineFCL()) && (
              <div style={{ width: '126px', height: '30px', marginLeft: '15px', marginTop: '12px' }}>
                <NumberFormat
                  decimalSeparator={','}
                  thousandSeparator={'.'}
                  decimalScale={2}
                  format={(value: string) => rightToLeftFormatter(value, 2)}
                  customInput={ControlledInput}
                  toolTipTitle={I18n.t('components.itemModal.requiredField')}
                  invalid={false}
                  value={data.diameter != null ? data.diameter : ''}
                  onChange={e => { validateFloatInput(e.target.value) !== null && (setData({ ...data, diameter: e.target.value })) }}
                  variant="outlined"
                  size="small"
                  $modal
                />
              </div>

            )}
            {hasDiameter() && marineFCL() && (
              <div style={{ width: '197px', height: '30px', marginLeft: '1px', marginTop: '12px' }}>
                <NumberFormat
                  decimalSeparator={','}
                  thousandSeparator={'.'}
                  decimalScale={2}
                  format={(value: string) => rightToLeftFormatter(value, 2)}
                  customInput={ControlledInput}
                  toolTipTitle={I18n.t('components.itemModal.requiredField')}
                  invalid={false}
                  value={data.diameter != null ? data.diameter : ''}
                  onChange={e => { validateFloatInput(e.target.value) !== null && (setData({ ...data, diameter: e.target.value })) }}
                  variant="outlined"
                  size="small"
                  $modal
                />
              </div>
            )}
            {!(marineFCL()) && (
              <div style={{ width: '126px', height: '30px', marginLeft: '18px', marginTop: '12px' }}>
                <NumberFormat
                  decimalSeparator={','}
                  thousandSeparator={'.'}
                  decimalScale={3}
                  format={(value: string) => rightToLeftFormatter(value, 3)}
                  customInput={ControlledInput}
                  toolTipTitle={I18n.t('components.itemModal.requiredField')}
                  invalid={
                    invalidInput && !(marineFCL()) &&
                    (data.cubage === null || data.cubage.length === 0)
                  }
                  value={data.cubage != null ? data.cubage : ''}
                  onChange={e => { validateFloatInput(e.target.value) !== null && (setData({ ...data, cubage: e.target.value })) }}
                  variant="outlined"
                  size="small"
                  $modal
                />
              </div>
            )}
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
            <CheckBoxArea onClick={() => (setData({ ...data, dangerous: !data.dangerous }))}>
              <CheckBox checked={data.dangerous}>
                {data.dangerous && <CheckIcon />}
              </CheckBox>
              <CheckBoxLabel>{I18n.t('components.itemModal.yes')}</CheckBoxLabel>
            </CheckBoxArea>
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
                {imoList.map((item) => {
                  return (
                    <MenuItem key={item.id} value={item.id}>
                      <span style={{ marginLeft: '10px' }}>{item.type}</span>
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
                $modal
              />
            </div>
          </RowDiv>
          <RowDiv>
            <ButtonDiv>
              <Button
                disabled={false}
                text={I18n.t('components.itemModal.save')}
                tooltip={I18n.t('components.itemModal.save')}
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
