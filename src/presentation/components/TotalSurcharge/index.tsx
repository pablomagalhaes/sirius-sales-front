import React from 'react'
import PositiveProfitIcon from '../../../application/icons/PositiveProfitIcon'
import { CwLabel, LowerContainer, PercentageLabel, ProfitContainer, ProfitLabel, TotalCargoContainer, TotalContainer, UpperContainer } from './sytle'
import { I18n } from 'react-redux-i18n'

interface TotalSurchargeProps {
  value: string
  currency: string
  totalOtherFare: string
}

const TotalSurcharge = ({ value, currency, totalOtherFare }: TotalSurchargeProps): JSX.Element => {
  return (
    <TotalContainer>
      <UpperContainer>
        <CwLabel>{I18n.t('pages.newProposal.step6.cwBuySell')}</CwLabel>
        <div>926,27 / 1.000</div>
        <TotalCargoContainer>
          <div>{I18n.t('pages.newProposal.step6.totalLoad')}</div>
          <div>{(value !== '0,00' && value !== '') ? `${currency} ${value}` : '-'}</div>
        </TotalCargoContainer>
      </UpperContainer>
      <LowerContainer>
        <ProfitLabel>{I18n.t('pages.newProposal.step6.profit')}</ProfitLabel>
        <ProfitContainer>
          <PositiveProfitIcon />
          <PercentageLabel>5,74%</PercentageLabel>
        </ProfitContainer>
        <TotalCargoContainer>
          <div>{I18n.t('pages.newProposal.step6.totalOtherFees')}</div>
          <div>{(totalOtherFare !== '0,00' && totalOtherFare !== '') ? `${currency} ${totalOtherFare}` : '-'}</div>
        </TotalCargoContainer>
      </LowerContainer>
    </TotalContainer>
  )
}

export default TotalSurcharge
