import React, { useContext, useEffect, useState} from 'react'
import PositiveProfitIcon from '../../../application/icons/PositiveProfitIcon'
import NegativeProfitIcon from '../../../application/icons/NegativeProfitIcon'
import { ProposalContext, ProposalProps } from '../../pages/NewProposal/context/ProposalContext'
import { ProfitsProps } from '../../../domain/ProfitsProps'
import { CwLabel, LowerContainer, PercentageLabel, PercentageCard, ProfitContainer, ProfitLabel, ProfitValue, TotalCargoContainer, TotalContainer, UpperContainer } from './style'
import { I18n } from 'react-redux-i18n'

interface TotalSurchargeProps {
  value: string
  currency: string
  totalOtherFare: string
  cw: number
  cwSale: number
  modal: string
  data: any
  totalCosts: any
}

const TotalSurcharge = ({ value, currency, totalOtherFare, cw, cwSale, modal, data, totalCosts }: TotalSurchargeProps): JSX.Element => {
  const { proposal, setProposal }: ProposalProps = useContext(ProposalContext)
  const [profit, setProfit] = useState('')
  const [profitPercentage, setProfitPercentage] = useState<number[][]>([])

  console.log(totalCosts)

  const removeDuplicates = (arr) => {
    return arr.filter((item: string, 
        index: number) => arr.indexOf(item) === index);
  }

  const isAir = (): boolean => {
    return modal === 'AIR'
  }

  const totalValue = (): number => {
    return Number(value.replace(',', '.')) * cwSale
  }

  const totalPurchase = (): number[][] => {
      let currencyList = []
      if (data.length > 0 && data[0].currencyPurchase !== '') {
        currencyList = removeDuplicates([...totalCosts.map((total) => total.name), ...data.map(each => each.currencyPurchase)])
      } else {
        currencyList = removeDuplicates([...totalCosts.map((total) => total.name)])
      }

      const result = currencyList.map((each) => {
        const currencySelect = totalCosts.filter(total => total.name === each)
        let total: number = 0
        if (currencySelect.length > 0) {
          total += currencySelect.map(cost => cost.value.buy).reduce((acc, curr) => acc + curr) 
        }
        if (data.length > 0 && data[0].currencyPurchase !== '') {
          const purchaseCurrency = data.filter(purchase => purchase.currencyPurchase === each)
          purchaseCurrency.forEach(currency => {
            if(currency.valuePurchase !== '') total += Number(currency.valuePurchase.replace(',', '.'))
          })
        }

        return [each, total]
      })

      return result
  }
  
  const totalSale = (): number[][] => {
      const currencyList = removeDuplicates([...totalCosts.map((total) => total.name), currency])

      const result = currencyList.map((each) => {
        const currencySelect = totalCosts.filter(total => total.name === each)
        let total: number = 0
        if (currencySelect.length > 0) {
          total += currencySelect.map(cost => cost.value.sale).reduce((acc, curr) => acc + curr) 
        }
        if (currency === each && value !== '0,00' && value !== '') {
          if(isAir()) total += totalValue()
          else total += Number(value.replace(',', '.'))
        }
        if (currency === each && totalOtherFare !== '0,00' && totalOtherFare !== '') {
          total += Number(totalOtherFare.replace(',', '.'))
        }
        return [each, total]
      })

      return result
  }

  const calculateProfit = (): number[][] => {
    const finalResult: number[][] = []

    totalSale().forEach(sale => {
      const purchaseTotal = totalPurchase().find(purchase => sale[0] === purchase[0])
      if(purchaseTotal) finalResult.push([sale[0], sale[1] - purchaseTotal[1]])
      else finalResult.push(sale)
    })
    totalPurchase().forEach(purchase => {
      if(!finalResult.some(result => result[0] === purchase[0])) finalResult.push([purchase[0], -purchase[1]])
    })
    return finalResult
  }

  const calculateProfitPercentage = (): number[][] => {
    const finalResult: number[][] = []

    totalSale().forEach(sale => {
      const purchaseTotal = totalPurchase().find(purchase => sale[0] === purchase[0])
      console.log(purchaseTotal)
      if(purchaseTotal) finalResult.push([sale[0], ((sale[1] * 100) / purchaseTotal[1]) - 100])
      // else finalResult.push(sale)
    })
    // totalPurchase().forEach(purchase => {
    //   if(!finalResult.some(result => result[0] === purchase[0])) finalResult.push([purchase[0], -purchase[1]])
    // })
    return finalResult
  }

  useEffect(() => {
    if(data && totalCosts.length > 0) {
      let finalProfit: string = ''
      let profits: ProfitsProps[] = []
      calculateProfit().forEach(profitValue => {
        finalProfit += `${profitValue[0]} ${profitValue[1].toFixed(2)} + `
        profits.push({  idCurrency: profitValue[0], valueTotalProfit: Number(profitValue[1].toFixed(2)), percentageProfit: null})
      })
      setProfit(finalProfit.slice(0, -3))


      calculateProfitPercentage().forEach(percentageValue => {
        profits.forEach((each, index) => {
          if(each.idCurrency === percentageValue[0]) profits[index] = {...profits[index], percentageProfit: Number(percentageValue[1].toFixed(2))}
        })
      })
      setProfitPercentage(calculateProfitPercentage())
      setProposal({...proposal, profits})
    }
  }, [data, totalCosts, currency, totalOtherFare, value, modal])


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
        <ProfitContainer>
          <ProfitLabel>
            {I18n.t('pages.newProposal.step6.profit')} 
            <ProfitValue>{profit.replace('.', ',')}</ProfitValue>
          </ProfitLabel>
          <ProfitLabel>
            {I18n.t('pages.newProposal.step6.percentageProfit')}
            {profitPercentage.map((profitArray) => (
              <PercentageCard color={profitArray[1] <= 0 ? 'red' : 'normal'}>
                {profitArray[1] <= 0 ?  <NegativeProfitIcon /> : <PositiveProfitIcon />}
                <PercentageLabel>{String(profitArray[0])} {String(profitArray[1].toFixed(2).replace('.', ','))}%</PercentageLabel>
              </PercentageCard>
            ))}

          </ProfitLabel>
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
