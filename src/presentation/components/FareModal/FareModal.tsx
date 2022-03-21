import React, { useState, useEffect } from 'react'
import { MenuItem, Modal, Box } from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown'
import CloseIcon from '../../../application/icons/CloseIcon'
import { I18n } from 'react-redux-i18n'
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
import ControlledSelect from '../ControlledSelect'
import { Input } from '../CostModal/CostModalStyles'
import { Button } from 'fiorde-fe-components'
import ControlledToolTip from '../ControlledToolTip/ControlledToolTip'
import { Container, MenuItemContent } from './FareModalStyles'
import newProposal from '../../../infrastructure/api/newProposalService'
import { ItemModalData } from '../ItemModal/ItemModal'

export interface FareModalData {
  id: number | null
  saleCurrency: string
  saleValue: string
  expense: string | null
  selectedContainer: string | null
  type: string
}

interface FareModalProps {
  dataProp: FareModalData
  action: (item) => void
  open: boolean
  setClose: () => void
  title: string
  modal: string
  specifications: string
  containerItems: ItemModalData[]
}

export const initialState = {
  type: '',
  expense: null,
  saleValue: '',
  saleCurrency: 'BRL',
  selectedContainer: null,
  id: null
}

const FareModal = ({
  dataProp,
  action,
  open,
  setClose,
  title,
  modal,
  specifications,
  containerItems
}: FareModalProps): JSX.Element => {
  const [data, setData] = useState<FareModalData>(initialState)
  const [invalidInput, setInvalidInput] = useState(false)
  const [typeList, setTypeList] = useState<object[]>([])
  const [serviceList, setServiceList] = useState<any[]>([])
  const [currencyList, setCurrencyList] = useState<any[]>([])

  useEffect(() => {
    if (containerItems.length === 1) {
      setData({ ...data, selectedContainer: containerItems[0].type })
    } else {
      setData({ ...data, selectedContainer: '' })
    }
  })

  const rgxFloat = /^[0-9]*,?[0-9]*$/

  const validateFloatInput = (value: string): RegExpMatchArray | null => {
    return value.match(rgxFloat)
  }

  const isValid = (): boolean => {
    return !(
      data.type.length === 0 ||
      data.saleValue.length === 0 ||
      data.saleCurrency.length === 0 ||
      (data.expense === null || data.expense?.length === 0)
    )
  }

  const saleValueHandler = (e): void => {
    const validatedInput = validateFloatInput(e.target.value)
    if (validatedInput !== null) {
      setData({ ...data, saleValue: validatedInput[0] })
    }
  }

  const handleOnClose = (): void => {
    setData(initialState)
    setInvalidInput(false)
    setClose()
  }

  const handleAction = (): void => {
    if (isValid()) {
      action(data)
      handleOnClose()
    } else {
      setInvalidInput(true)
    }
  }

  useEffect(() => {
    if (dataProp !== initialState) {
      setData(dataProp)
    }
  }, [open])

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
            <Label width="25%">
              {I18n.t('components.fareModal.type')}
              <RedColorSpan> *</RedColorSpan>
            </Label>
            <Label width="75%">
              {I18n.t('components.fareModal.expense')}
              <RedColorSpan> *</RedColorSpan>
            </Label>
          </RowDiv>
          <RowDiv margin={true}>
            <Container width="113px" height="32px" margin="12px 0 5px 0">
              <ControlledSelect
                onChange={(e) => setData({ ...data, type: e.target.value })}
                displayEmpty
                value={data.type}
                disableUnderline
                placeholder={data.type}
                toolTipTitle={I18n.t('components.itemModal.requiredField')}
                invalid={invalidInput && (data.type === null || data.type.length === 0)}
              >
                <MenuItem disabled value="">
                  <MenuItemContent>
                    {I18n.t('components.fareModal.choose')}
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
            </Container>
            <Container width="350px" height="32px" margin="0 0 5px 23px">
              <Autocomplete
                onChange={(e, newValue) => setData({ ...data, expense: newValue })}
                options={serviceList.map((option) => option.service)}
                value={data.expense}
                renderInput={(params) => (
                  <div ref={params.InputProps.ref}>
                    <Input
                      {...params.inputProps}
                      toolTipTitle={I18n.t('components.itemModal.requiredField')}
                      invalid={invalidInput && (data.expense === null || data.expense?.length === 0)}
                      filled={data.expense}
                      placeholder={I18n.t('components.fareModal.choose')}
                      style={{ width: '350px' }}
                    />
                    <Box {...params.inputProps} className="dropdownCustom">
                      <ArrowDropDownIcon />
                    </Box>
                  </div>
                )}
              />
            </Container>
          </RowDiv>
          {specifications === 'fcl' && (
            <><RowDiv>
              <Label width="100%">
                {I18n.t('components.costModal.container')}
                <RedColorSpan> *</RedColorSpan>
              </Label>
            </RowDiv>
              <RowDiv style={{ position: 'relative' }} margin={true}>
                <Autocomplete
                  options={containerItems.map((item) => item.type)}
                  value={data.selectedContainer}
                  onChange={(e, newValue) => setData({ ...data, selectedContainer: newValue })}
                  renderInput={(params) => (
                    <div ref={params.InputProps.ref}>
                      <Input
                        {...params.inputProps}
                        filled={data.selectedContainer}
                        placeholder={I18n.t('components.costModal.choose')}
                        toolTipTitle={I18n.t('components.itemModal.requiredField')}
                        invalid={invalidInput && data.selectedContainer === null}
                        style={{ width: '513px' }}
                      />
                      <Box {...params.inputProps} className="dropdownContainer">
                        <ArrowDropDownIcon />
                      </Box>
                    </div>
                  )}
                />
              </RowDiv></>
          )}
          <RowDiv>
            <Label width="100%">
              {I18n.t('components.fareModal.saleValue')}
            </Label>
          </RowDiv>
          <RowDiv>
            <Container style={{ position: 'relative', marginRight: '14px' }}>
              <Autocomplete
                value={data.saleCurrency}
                onChange={(e, newValue) => setData({ ...data, saleCurrency: newValue })}
                options={currencyList.map((option) => option.id)}
                renderInput={(params) => (
                  <div ref={params.InputProps.ref}>
                    <Input
                      {...params.inputProps}
                      width="84px"
                      placeholder={data.saleCurrency}
                      toolTipTitle={I18n.t('components.itemModal.requiredField')}
                      invalid={invalidInput && data.saleCurrency.length === 0}
                    />
                    <Box {...params.inputProps} className="dropdown">
                      <ArrowDropDownIcon />
                    </Box>
                  </div>
                )}
              />
            </Container>
            <ControlledToolTip
              title={I18n.t('components.itemModal.requiredField')}
              open={invalidInput && data.saleValue.length === 0}
            >
              <PlaceholderDiv>
                <label>
                  {data.saleValue.length === 0 && (
                    <PlaceholderSpan>
                      {I18n.t('components.fareModal.value')}
                      <RedColorSpan> *</RedColorSpan>
                    </PlaceholderSpan>
                  )}
                  <Input
                    value={data.saleValue}
                    onChange={saleValueHandler}
                    invalid={invalidInput && data.saleValue.length === 0}
                    filled={data.saleValue}
                    aria-label="value"
                  />
                </label>
              </PlaceholderDiv>
            </ControlledToolTip>
          </RowDiv>
          <RowDiv>
            <ButtonDiv>
              <Button
                disabled={false}
                text={I18n.t('components.itemModal.save')}
                backgroundGreen={true}
                icon=""
                onAction={handleAction}
                tooltip={I18n.t('components.itemModal.save')}
              />
            </ButtonDiv>
          </RowDiv>
        </Form>
      </ModalContainer>
    </Modal>
  )
}
export default FareModal
