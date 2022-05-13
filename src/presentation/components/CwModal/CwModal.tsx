import { Grid, Modal } from '@material-ui/core'
import React, { useState } from 'react'
import CloseIcon from '../../../application/icons/CloseIcon'
import FormatNumber from '../../../application/utils/formatNumber'
import { NumberInput } from '../../pages/NewProposal/steps/StepsStyles'
import ControlledInput from '../ControlledInput'
import {
  CloseIconContainer,
  Form,
  HeaderDiv,
  ModalContainer,
  RowReverseDiv,
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

export interface CwData {
  grossWeight?: string
  cubageWeight?: string
  cwSale?: string
  cubage?: string
}
interface CwProps {
  dataProp: CwData
  action: (item) => void
  open: boolean
  setClose: () => void
}

export const initialCwState = {
  grossWeight: '50,00',
  cubageWeight: '10,00',
  cwSale: '32,00',
  cubage: '100,00'
}

const CwModal = ({
  dataProp,
  action,
  open,
  setClose
}: CwProps): JSX.Element => {
  const [data, setData] = useState<CwData>(dataProp)

  const handleOnClose = (): void => {
    setData(dataProp)
    setClose()
  }

  const HandleOnAction = (): void => {
    action(data)
    setClose()
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
              <ValueLabel>{data.grossWeight}</ValueLabel>
            </Grid>
            <Grid item xs={4}>
              <Label>{I18n.t('components.cwModal.cubage')}</Label>
            </Grid>
            <Grid item xs={8}>
              <ValueLabel>{data.cubage}</ValueLabel>
            </Grid>
            <Grid item xs={4}>
              <Label>{I18n.t('components.cwModal.cubageWeight')}</Label>
            </Grid>
            <Grid item xs={8}>
              <ValueLabel>{data.cubageWeight}</ValueLabel>
            </Grid>
            <Grid item xs={4}>
              <CwSaleLabel>{I18n.t('components.cwModal.cwSales')}</CwSaleLabel>
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
                  onChange={(e) => {
                    setData({ ...data, cwSale: e.target.value })
                  }}
                  toolTipTitle={I18n.t('components.itemModal.requiredField')}
                  invalid={data.cwSale?.length === 0}
                  value={data.cwSale}
                  variant="outlined"
                  size="small"
                  modal
                />
              </CwValue>
            </Grid>
          </Grid>
          <RowReverseDiv>
          <ButtonDiv>
              <Button
                backgroundGreen={true}
                text={I18n.t('components.cwModal.save')}
                disabled={false}
                icon=""
                onAction={HandleOnAction}
              />
            </ButtonDiv>
            <ButtonDiv green={true}>
              <Button
                backgroundGreen={false}
                text={I18n.t('components.cwModal.cancel')}
                disabled={false}
                icon=""
                onAction={handleOnClose}
              />
            </ButtonDiv>
          </RowReverseDiv>
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
