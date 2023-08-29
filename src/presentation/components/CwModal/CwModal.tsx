import { Grid, Modal } from '@material-ui/core'
import React, { useState, useEffect } from 'react'
import CloseIcon from '../../../application/icons/CloseIcon'
import FormatNumber from '../../../application/utils/formatNumber'
import { NumberInput } from '../../pages/NewProposal/steps/StepsStyles'
import ControlledInput from '../ControlledInput'
import {
  CloseIconContainer,
  Form,
  HeaderDiv,
  ModalContainer,
  RedColorSpan,
  RowReverseDiv,
  ReverseDiv,
  Title
} from '../StyledComponents/modalStyles'
import {
  ButtonDiv,
  CwSaleLabel,
  CwValue,
  Label,
  ValueLabel,
  WarningBoldMessage,
  WarningDiv,
  WarningMessage
} from './CwModalStyles'
import { I18n } from 'react-redux-i18n'
import { Button } from 'fiorde-fe-components'
import InfoIcon from '../../../application/icons/InfoIcon'
import { CalculationDataProps } from '../ChargeTable'

interface CwProps {
  dataProp: CalculationDataProps
  action: (item) => void
  open: boolean
  setClose: () => void
  editValue: number | null
}

const CwModal = ({
  dataProp,
  action,
  open,
  setClose,
  editValue
}: CwProps): JSX.Element => {
  const [data, setData] = useState('')

  useEffect(() => {
    const value = editValue?.toFixed(2)
    setData(String(value))
  }, [open])

  const handleOnClose = (): void => {
    setClose()
  }

  const handleOnAction = (): void => {
    if (data !== undefined && data.length > 0) {
      action(data)
      setClose()
    }
  }

  return (
    <Modal open={open} onClose={handleOnClose}>
      <ModalContainer>
        <HeaderDiv>
          <Title>{I18n.t('components.cwModal.title')}</Title>
          <RowReverseDiv>
            <CloseIconContainer>
              <CloseIcon onClick={handleOnClose} />
            </CloseIconContainer>
          </RowReverseDiv>
        </HeaderDiv>
        <Form>
          <Grid container xs={12}>
            <Grid item xs={4}>
              <Label>{I18n.t('components.cwModal.grossWeight')}</Label>
            </Grid>
            <Grid item xs={8}>
              <ValueLabel>{dataProp?.weight?.toFixed(2).replace('.', ',')}</ValueLabel>
            </Grid>
            <Grid item xs={4}>
              <Label>{I18n.t('components.cwModal.cubage')}</Label>
            </Grid>
            <Grid item xs={8}>
              <ValueLabel>{dataProp?.cubage?.toFixed(2).replace('.', ',')}</ValueLabel>
            </Grid>
            <Grid item xs={4}>
              <Label>{I18n.t('components.cwModal.cubageWeight')}</Label>
            </Grid>
            <Grid item xs={8}>
              <ValueLabel>{dataProp?.cubageWeight?.toFixed(2).replace('.', ',')}</ValueLabel>
            </Grid>
            <Grid item xs={4}>
              <CwSaleLabel>
                {I18n.t('components.cwModal.cwSales')}
                <RedColorSpan> *</RedColorSpan>
              </CwSaleLabel>
            </Grid>
            <Grid item xs={8}>
              <CwValue>
                <NumberInput
                  decimalSeparator={','}
                  thousandSeparator={'.'}
                  decimalScale={2}
                  format={(value: string) =>
                    FormatNumber.rightToLeftFormatter(value, 2)
                  }
                  customInput={ControlledInput}
                  onChange={(e) => setData(e.target.value)}
                  toolTipTitle={I18n.t('components.itemModal.requiredField')}
                  invalid={data.length === 0}
                  value={data}
                  variant="outlined"
                  size="small"
                  modal
                />
              </CwValue>
            </Grid>
            <Grid item xs={12}>
              <ReverseDiv>
                <ButtonDiv>
                    <Button
                      backgroundGreen={true}
                      text={I18n.t('components.cwModal.save')}
                      disabled={false}
                      icon=""
                      onAction={handleOnAction}
                      tooltip=""
                    />
                  </ButtonDiv>
                  <ButtonDiv green={true}>
                    <Button
                      backgroundGreen={false}
                      text={I18n.t('components.cwModal.cancel')}
                      disabled={false}
                      icon=""
                      onAction={handleOnClose}
                      tooltip=""
                    />
                  </ButtonDiv>
              </ReverseDiv>
            </Grid>
          </Grid>
        </Form>
        <WarningDiv>
          <InfoIcon />
          <WarningMessage>
            <WarningBoldMessage>
              {I18n.t('components.cwModal.attention')}
            </WarningBoldMessage>
            {I18n.t('components.cwModal.infoText')}
          </WarningMessage>
        </WarningDiv>
      </ModalContainer>
    </Modal>
  )
}

export default CwModal
