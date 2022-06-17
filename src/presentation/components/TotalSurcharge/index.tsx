import React from 'react'
import PositiveProfitIcon from '../../../application/icons/PositiveProfitIcon'
import { CwLabel, LowerContainer, PercentageLabel, ProfitContainer, ProfitLabel, TotalCargoContainer, TotalContainer, UpperContainer } from './style'
import { I18n } from 'react-redux-i18n'

interface TotalSurchargeProps {
  value: string
  currency: string
  totalOtherFare: string
  cw: number
  cwSale: number
  modal: string
}

const TotalSurcharge = ({ value, currency, totalOtherFare, cw, cwSale, modal }: TotalSurchargeProps): JSX.Element => {
  const isAir = (): boolean => {
    return modal === 'AIR'
  }

  const totalValue = (): number => {
    return Number(value.replace(',', '.')) * cwSale
  }

  return (
    <TotalContainer>
      <UpperContainer>
        {isAir()
          ? <>
            <CwLabel>{I18n.t('pages.newProposal.step6.cwBuySell')}</CwLabel>
            <div>{cw?.toFixed(2).replace('.', ',')} / {cwSale?.toFixed(2).replace('.', ',')}</div>
          </>
          : null
        }
        <TotalCargoContainer>
            <div>{I18n.t('pages.newProposal.step6.totalLoad')}</div>
            {isAir()
              ? <div>{(value !== '0,00' && value !== '') ? `${currency} ${totalValue().toFixed(2).replace('.', ',')}` : '-'}</div>
              : <div>{(value !== '0,00' && value !== '') ? `${currency} ${value}` : '-'}</div>
            }
        </TotalCargoContainer>
      </UpperContainer>
      <LowerContainer>
        <ProfitLabel>{I18n.t('pages.newProposal.step6.profit')}</ProfitLabel>
        {false && <ProfitContainer>
          <PositiveProfitIcon />
          <PercentageLabel>5,74%</PercentageLabel>
        </ProfitContainer>}
        <TotalCargoContainer>
          <div>{I18n.t('pages.newProposal.step6.totalOtherFees')}</div>
          <div>{(totalOtherFare !== '0,00' && totalOtherFare !== '') ? `${currency} ${totalOtherFare}` : '-'}</div>
        </TotalCargoContainer>
      </LowerContainer>
    </TotalContainer>
  )
}

export default TotalSurcharge
