import { MenuItem, Modal } from '@material-ui/core'
import React, { useState } from 'react'
import CloseIcon from '../../../application/icons/CloseIcon'
import { I18n } from 'react-redux-i18n'
import {
  ButtonDiv,
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

interface FareModalData {
  id: number | null
  saleCurrency: string
  saleValue: string
  expense: string
  type: string
}

interface FareModalProps {
  dataProp?: FareModalData
  action: (item) => void
  open: boolean
  setClose: () => void
  title: string
}

const FareModal = ({
  dataProp,
  action,
  open,
  setClose,
  title
}: FareModalProps): JSX.Element => {
  const initialState = {
    type: '',
    expense: '',
    saleValue: '',
    saleCurrency: 'EUR',
    id: null
  }
  const [data, setData] = useState(dataProp != null ? dataProp : initialState)
  const [invalidInput, setInvalidInput] = useState(false)
  // Mock de tipos, valores serão especificados posteriormente
  const typeList = ['CW', 'CM']
  // Mock de despesas, valores serão especificados posteriormente
  const expensesList = ['Fuel - Security1', 'Fuel - Security2', 'Fuel - Security3']
  // Mock de moedas, valores serão especificados posteriormente
  const currencyList = ['EUR', 'USD']

  const rgxFloat = /^[0-9]*,?[0-9]*$/

  const validateFloatInput = (value: string): RegExpMatchArray | null => {
    return value.match(rgxFloat)
  }

  const isValid = (): boolean => {
    return !(
      data.type.length === 0 ||
      data.expense.length === 0 ||
      data.saleValue.length === 0 ||
      data.saleCurrency.length === 0
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

  return (
    <Modal open={open} onClose={handleOnClose}>
      <ModalContainer>
        <HeaderDiv>
          <Title>{title}</Title>
          <RowReverseDiv>
            <CloseIcon onClick={handleOnClose} />
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
                invalid={invalidInput && data.type.length === 0}
              >
                <MenuItem disabled value="">
                  <MenuItemContent>
                    {I18n.t('components.fareModal.choose')}
                  </MenuItemContent>
                </MenuItem>
                {typeList.map((type) => {
                  return (
                    <MenuItem key={`${type}_key`} value={type}>
                      <MenuItemContent>{type}</MenuItemContent>
                    </MenuItem>
                  )
                })}
              </ControlledSelect>
            </Container>
            <Container width="350px" height="32px" margin="12px 0 5px 23px">
              <ControlledSelect
                onChange={(e) => setData({ ...data, expense: e.target.value })}
                displayEmpty
                value={data.expense}
                disableUnderline
                placeholder={data.expense}
                toolTipTitle={I18n.t('components.itemModal.requiredField')}
                invalid={invalidInput && data.expense.length === 0}
              >
                <MenuItem disabled value="">
                  <MenuItemContent>
                    {I18n.t('components.fareModal.choose')}
                  </MenuItemContent>
                </MenuItem>
                {expensesList.map((expenses) => {
                  return (
                    <MenuItem key={`${expenses}_key`} value={expenses}>
                      <MenuItemContent>{expenses}</MenuItemContent>
                    </MenuItem>
                  )
                })}
              </ControlledSelect>
            </Container>
          </RowDiv>
          <RowDiv>
            <Label width="100%">
              {I18n.t('components.fareModal.saleValue')}
            </Label>
          </RowDiv>
          <RowDiv margin={false}>
            <Container width="84px" height="32px" margin="12px 14px 5px 0">
              <ControlledSelect
                onChange={(e) =>
                  setData({ ...data, saleCurrency: e.target.value })
                }
                displayEmpty
                value={data.saleCurrency}
                disableUnderline
                placeholder={data.saleCurrency}
                toolTipTitle={I18n.t('components.itemModal.requiredField')}
                invalid={invalidInput && data.saleCurrency.length === 0}
              >
                {currencyList.map((currency) => {
                  return (
                    <MenuItem key={`${currency}_key`} value={currency}>
                      <MenuItemContent>{currency}</MenuItemContent>
                    </MenuItem>
                  )
                })}
              </ControlledSelect>
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
                text={I18n.t('components.itemModal.save')}
                backgroundGreen={true}
                icon=""
                onAction={handleAction}
              />
            </ButtonDiv>
          </RowDiv>
        </Form>
      </ModalContainer>
    </Modal>
  )
}
export default FareModal
