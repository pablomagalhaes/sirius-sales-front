import { MenuItem, Modal, Grid, FormLabel, RadioGroup, Checkbox, FormControlLabel, Box } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import CloseIcon from '../../../application/icons/CloseIcon'
import {
  ModalDiv,
  MainDiv
} from './ItemModalStyles'
import { I18n } from 'react-redux-i18n'
import ControlledSelect from '../ControlledSelect'
import ControlledInput from '../ControlledInput'
import {
  HeaderDiv,
  RedColorSpan,
  RowReverseDiv,
  Title,
  CloseIconContainer,
  ButtonDiv
} from '../StyledComponents/modalStyles'
import NumberFormat from 'react-number-format'
import newProposal from '../../../infrastructure/api/newProposalService'
import { SelectSpan } from '../../pages/NewProposal/style'
import { Button } from 'fiorde-fe-components'

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
  stack: boolean
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
  id: null,
  stack: false
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
        data.type?.length === 0 ||
        data.amount.length === 0)
    } else {
      return !(
        (data.type === null || data.type?.length === 0) ||
        data.amount.length === 0 ||
        (data.rawWeight === null || data.rawWeight?.length === 0) ||
        (data.height === null || data.height?.length === 0) ||
        (data.width === null || data.width?.length === 0) ||
        (data.length === null || data.length?.length === 0) ||
        (data.cubage === null || data.cubage?.length === 0))
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

  const updateCubage = (): void => {
    const newCubage = Number(data.length === null ? 0 : Number(data.length.replace(',', '.'))) *
      Number(data.width === null ? 0 : Number(data.width.replace(',', '.'))) *
      Number(data.height === null ? 0 : Number(data.height.replace(',', '.'))) *
      Number(data.amount === null ? 0 : Number(data.amount))
    setData({ ...data, cubage: newCubage.toFixed(3).replace('.', ',') })
  }

  useEffect(() => {
    updateCubage()
  }, [data.length, data.width, data.height, data.amount])

  const returnListItems = (id: number, label: string): JSX.Element => {
    return (
      <MenuItem key={id} value={label}>
        <SelectSpan>{label}</SelectSpan>
      </MenuItem>)
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
        <MainDiv>
          <Grid container spacing={2} style={{ width: '100%' }}>
            <Grid item xs={4}>
              <FormLabel component="legend">{marineFCL() ? I18n.t('components.itemModal.container') : I18n.t('components.itemModal.packaging')}<RedColorSpan> *</RedColorSpan></FormLabel>
              <ControlledSelect
                id="container-type-select"
                value={data.type}
                onChange={(e) => setData({ ...data, type: e.target.value })}
                displayEmpty
                disableUnderline
                invalid={invalidInput && (data.type?.length === 0 || data.type === null)}
                toolTipTitle={I18n.t('components.itemModal.requiredField')}
              >
                <MenuItem disabled value={String(data.type)}>
                  <SelectSpan placeholder={1}>{I18n.t('components.itemModal.choose')}</SelectSpan>
                </MenuItem>
                {marineFCL()
                  ? containerTypeList.map((item) => (returnListItems(item.id, item.type)))
                  : packagingList.map((item) => (returnListItems(item.id, item.packaging)))}
              </ControlledSelect>
            </Grid>
            <Grid item xs={2}>
              <FormLabel component="legend">{I18n.t('components.itemModal.amount')}<RedColorSpan> *</RedColorSpan></FormLabel>
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
            </Grid>
            {!marineFCL() && <Grid item xs={4}>
              <FormLabel component="legend">{I18n.t('components.itemModal.rawWeight')}
                {(modal === 'AIR' ||
                  (modal === 'SEA' && specifications !== 'fcl') ||
                  modal === 'LAND') && <RedColorSpan> *</RedColorSpan>}</FormLabel>
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
                modal
              />
            </Grid>}
            <Grid item xs={2}>
              <FormLabel component="legend">{I18n.t('components.itemModal.stack')}</FormLabel>
              <RadioGroup style={{ marginLeft: '15px' }} row aria-label="services" name="row-radio-buttons-group" onChange={e => setData({ ...data, stack: !data.stack })}>
                <FormControlLabel value="stack" control={<Checkbox />} label={I18n.t('components.itemModal.yes')} />
              </RadioGroup>
            </Grid>
            {marineFCL() && <Box width="100%" />}
            {!marineFCL() && <Grid item xs={5}>
              <FormLabel component="legend">{I18n.t('components.itemModal.hwl')}
                {(modal === 'AIR' ||
                  (modal === 'SEA' && specifications !== 'fcl') ||
                  modal === 'LAND') && <RedColorSpan> *</RedColorSpan>}</FormLabel>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
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
                  modal
                  style={{ marginRight: '8px' }}
                />
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
                  modal
                  style={{ marginRight: '8px' }}
                />
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
                  modal
                />
              </div>
            </Grid>}
            {hasDiameter() && <Grid item xs={4}>
              <FormLabel component="legend">{I18n.t('components.itemModal.diameter')}</FormLabel>
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
                modal
              />
            </Grid>}
            {!(marineFCL()) && <Grid item xs={3}>
              <FormLabel component="legend">
                {I18n.t('components.itemModal.cubage')}
                {(modal === 'AIR' ||
                  (modal === 'SEA' && specifications !== 'fcl') ||
                  modal === 'LAND') && <RedColorSpan> *</RedColorSpan>}
              </FormLabel>
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
                modal
              />
            </Grid>}
            <Grid item xs={12}>
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
            </Grid>
          </Grid>
        </MainDiv>
      </ModalDiv>
    </Modal >
  )
}
export default ItemModal
