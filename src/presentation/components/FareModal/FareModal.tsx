import { MenuItem, Modal } from '@material-ui/core'
import React, { useState } from 'react'
import CloseIcon from '../../../application/icons/CloseIcon'
import { I18n } from 'react-redux-i18n'
import { ButtonDiv, Form, HeaderDiv, Label, ModalContainer, PlaceholderDiv, PlaceholderSpan, RedColorSpan, RowDiv, RowReverseDiv, Title } from '../StyledComponents/modalStyles'
import ControlledSelect from '../ControlledSelect'
import { Input } from '../CostModal/CostModalStyles'
import { Button } from 'fiorde-fe-components'

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
  const handleOnClose = (): void => {
    setClose()
  }

  const initialState = {
    type: '',
    expense: '',
    saleValue: '',
    saleCurrency: '',
    id: null
  }
  const [data, setData] = useState(dataProp != null ? dataProp : initialState)
  const [invalidInput] = useState(false)

  return (
    <Modal open={open} onClose={handleOnClose}>
    <ModalContainer>
      <HeaderDiv>
        <Title>{title}</Title>
        <RowReverseDiv>
          <CloseIcon onClick={handleOnClose} />
        </RowReverseDiv>
      </HeaderDiv>
      <Form fontSize='12px' marginRight='0px' >
          <RowDiv>
            <Label width="25%">
              {I18n.t('components.costModal.type')}
              <RedColorSpan> *</RedColorSpan>
            </Label>
            <Label width="75%">
              {I18n.t('components.costModal.description')}
              <RedColorSpan> *</RedColorSpan>
            </Label>
          </RowDiv>
          <RowDiv margin={true}>
            <div style={{ width: '113px', height: '32px', margin: '12px 0 5px 0' }}>
              <ControlledSelect
                onChange={e => (setData({ ...data, type: e.target.value }))}
                displayEmpty
                value={data.type}
                disableUnderline
                placeholder={data.type}
                toolTipTitle={I18n.t('components.itemModal.requiredField')}
                invalid={ invalidInput && data.type.length === 0}
              >
                <MenuItem disabled value="">
                  <span style={{ marginLeft: '10px' }}>{I18n.t('components.itemModal.choose')}</span>
                </MenuItem>
              </ControlledSelect>
            </div>
            <div style={{ width: '350px', height: '32px', margin: '12px 0 5px 23px' }}>
              <ControlledSelect
                onChange={e => (setData({ ...data, expense: e.target.value }))}
                displayEmpty
                value={data.expense}
                disableUnderline
                placeholder={data.expense}
                toolTipTitle={I18n.t('components.itemModal.requiredField')}
                invalid={invalidInput && data.expense.length === 0}
              >
                <MenuItem disabled value="">
                  <span style={{ marginLeft: '10px' }}>{I18n.t('components.itemModal.choose')}</span>
                </MenuItem>
              </ControlledSelect>
            </div>
            </RowDiv>
            <RowDiv>
            <Label width="100%">
              {I18n.t('components.costModal.type')}
              <RedColorSpan> *</RedColorSpan>
            </Label>
          </RowDiv>
          <RowDiv margin={false}>
            <div style={{ width: '84px', height: '32px', margin: '12px 14px 5px 0' }}>
              <ControlledSelect
                onChange={e => e}
                displayEmpty
                value={'1'}
                disableUnderline
                placeholder={'1'}
                toolTipTitle={I18n.t('components.itemModal.requiredField')}
                invalid={1}
              >
                <MenuItem disabled value="">
                  <span style={{ marginLeft: '10px' }}>{I18n.t('components.itemModal.choose')}</span>
                </MenuItem>
              </ControlledSelect>
            </div>
              <PlaceholderDiv>
                <label>
                  {true && (
                    <PlaceholderSpan>
                      {I18n.t('components.costModal.value')}
                      <RedColorSpan> *</RedColorSpan>
                    </PlaceholderSpan>
                  )}
                  <Input
                    value={''}
                    onChange={e => e}
                    disabled={false}
                    invalid={
                        true
                    }
                    filled={true}
                  />
                </label>
              </PlaceholderDiv>
            </RowDiv>
            <RowDiv>
            <ButtonDiv>
              <Button
                text={I18n.t('components.itemModal.save')}
                backgroundGreen={true}
                icon=""
                onAction={() => 1}
              />
            </ButtonDiv>
          </RowDiv>
        </Form>
    </ModalContainer>
    </Modal>
  )
}
export default FareModal
