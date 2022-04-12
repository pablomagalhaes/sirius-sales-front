import { Modal, Grid, FormLabel, RadioGroup, Checkbox, FormControlLabel, Box, InputAdornment } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import CloseIcon from '../../../application/icons/CloseIcon'
import {
  ModalDiv,
  MainDiv
} from './ItemModalStyles'
import { I18n } from 'react-redux-i18n'
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
import API from '../../../infrastructure/api'
import { Button } from 'fiorde-fe-components'
import { Autocomplete } from '@material-ui/lab'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown'
import { StyledPaper } from '../../pages/NewProposal/steps/StepsStyles'

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
  const [didMount, setDidMount] = useState(false)

  useEffect(() => {
    void (async function () {
      await API.getContainerType()
        .then((response) => setContainerTypeList(response))
        .catch((err) => console.log(err))
    })()
  }, [])

  useEffect(() => {
    void (async function () {
      await API.getPackaging()
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
    setDidMount(false)
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
  const getContainerTypeList = (): string[] => {
    const finalList: string[] = []

    containerTypeList?.forEach((item): void => {
      if (item.description !== null) {
        finalList.push(String(item.description))
      }
    })

    return finalList
  }

  const updateCubage = (): void => {
    const newCubage = Number(data.length === null ? 0 : Number(data.length.replace(',', '.'))) *
      Number(data.width === null ? 0 : Number(data.width.replace(',', '.'))) *
      Number(data.height === null ? 0 : Number(data.height.replace(',', '.'))) *
      Number(data.amount === null ? 0 : Number(data.amount))
    setData({ ...data, cubage: newCubage.toFixed(2).replace('.', ',') })
  }

  useEffect(() => {
    if (didMount) {
      updateCubage()
    } else if (!didMount && data !== initialState) {
      setDidMount(true)
    }
  }, [data.length, data.width, data.height, data.amount])

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
            <Grid item xs={10}>
              <FormLabel component="legend">{marineFCL() ? I18n.t('components.itemModal.container') : I18n.t('components.itemModal.packaging')}<RedColorSpan> *</RedColorSpan></FormLabel>
              <Autocomplete
                freeSolo
                value={data.type}
                onChange={(e, newValue) => setData({ ...data, type: newValue })}
                options={marineFCL() ? getContainerTypeList() : packagingList.map((item) => String(item.packaging))}
                renderInput={(params) => (
                  <div ref={params.InputProps.ref}>
                    <ControlledInput
                      {...params}
                      id="search-origin"
                      toolTipTitle={I18n.t('components.itemModal.requiredField')}
                      invalid={
                        invalidInput &&
                        (data.length === null || data.length.length === 0)
                      }
                      variant="outlined"
                      size="small"
                      modal
                      placeholder={I18n.t('components.itemModal.choose')}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <Box width={'max-content'} {...params.inputProps}>
                              <ArrowDropDownIcon />
                            </Box>
                          </InputAdornment>
                        )
                      }}
                    />
                  </div>
                )}
                PaperComponent={(params: any) => <StyledPaper {...params} />}
              />
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
            <Grid item xs={6}>
              <RadioGroup style={{ margin: '47px 10px 10px -15px' }} row aria-label="services" name="row-radio-buttons-group">
                <FormControlLabel value="stack" control={<Checkbox checked={data.stack} onChange={() => setData({ ...data, stack: !data.stack })} />} label={I18n.t('components.itemModal.stack')} />
              </RadioGroup>
            </Grid>
            {marineFCL() && <Box width="100%" />}
            {!marineFCL() && <Grid item xs={6}>
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
                decimalScale={2}
                format={(value: string) => rightToLeftFormatter(value, 2)}
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
            {hasDiameter() && <Grid item xs={3}>
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
