import React, { useContext, useEffect } from 'react'
// import PositiveProfitIcon from '../../../application/icons/PositiveProfitIcon'
// import NegativeProfitIcon from '../../../application/icons/NegativeProfitIcon'
import { ProposalContext, ProposalProps } from '../../pages/NewProposal/context/ProposalContext'
import { CwLabel, ProfitContainer, TotalCargoContainer, TotalContainer, UpperContainer, LowerContainer } from './style'
import { I18n } from 'react-redux-i18n'
import FormatNumber from '../../../application/utils/formatNumber'
import { CostTypes } from '../../../application/enum/costEnum'
// valores comentados nesse arquivo se referem ao calculo de percentual de profit que será implementado posteriormente
interface TotalSurchargeProps {
  value: string
  currency: string
  totalOtherFare: string
  cw: number
  cwSale: number
  modal: string
  data: any
  totalCosts: any
  setTotalCostArray?: React.Dispatch<
  React.SetStateAction<any[]>
  >
}

const TotalSurcharge = ({ value, currency, totalOtherFare, cw, cwSale, modal, data, totalCosts, setTotalCostArray }: TotalSurchargeProps): JSX.Element => {
  const { proposal, setProposal }: ProposalProps = useContext(ProposalContext)
  // const [profit, setProfit] = useState('')
  // const [profitPercentage, setProfitPercentage] = useState<number[][]>([])

  // const removeDuplicates = (arr): any => {
  //   return arr.filter((item: string,
  //     index: number) => arr.indexOf(item) === index)
  // }

  const isAir = (): boolean => {
    return modal === 'AIR'
  }

  const totalValue = (): number => {
    return FormatNumber.convertNumberToDecimal(FormatNumber.convertStringToNumber(value) * cwSale)
  }

  // const totalPurchase = (): number[][] => {
  //   let currencyList = []
  //   if (data.length > 0 && data[0].currencyPurchase !== '') {
  //     currencyList = removeDuplicates([...totalCosts.map((total) => total.name), ...data.map(each => each.currencyPurchase)])
  //   } else {
  //     currencyList = removeDuplicates([...totalCosts.map((total) => total.name)])
  //   }

  //   const result = currencyList.map((each) => {
  //     const currencySelect = totalCosts.filter(total => total.name === each)
  //     let total: number = 0
  //     if (currencySelect.length > 0) {
  //       total += Number(currencySelect.map(cost => cost.value.buy).reduce((acc, curr) => Number(acc) + Number(curr)))
  //     }
  //     if (data.length > 0 && data[0].currencyPurchase !== '') {
  //       const purchaseCurrency = data.filter(purchase => purchase.currencyPurchase === each)
  //       purchaseCurrency.forEach(currency => {
  //         if (currency.valuePurchase !== '') total += FormatNumber.convertStringToNumber(currency.valuePurchase)
  //       })
  //     }

  //     return [each, total]
  //   })

  //   return result
  // }

  // const totalSale = (): number[][] => {
  //   const currencyList = removeDuplicates([...totalCosts.map((total) => total.name), currency])

  //   const result = currencyList.map((each) => {
  //     const currencySelect = totalCosts.filter(total => total.name === each)
  //     let total: number = 0
  //     if (currencySelect.length > 0) {
  //       total += Number(currencySelect.map(cost => cost.value.sale).reduce((acc, curr) => Number(acc) + Number(curr)))
  //     }
  //     if (currency === each && value !== '0,00' && value !== '') {
  //       if (isAir()) total += totalValue()
  //       else total += FormatNumber.convertStringToNumber(value)
  //     }
  //     if (currency === each && totalOtherFare !== '0,00' && totalOtherFare !== '') {
  //       total += FormatNumber.convertStringToNumber(totalOtherFare)
  //     }
  //     return [each, total]
  //   })

  //   return result
  // }

  // const calculateProfit = (): number[][] => {
  //   const finalResult: number[][] = []

  //   totalSale().forEach(sale => {
  //     const purchaseTotal = totalPurchase().find(purchase => sale[0] === purchase[0])
  //     if (purchaseTotal != null) finalResult.push([sale[0], sale[1] - purchaseTotal[1]])
  //     else finalResult.push(sale)
  //   })
  //   totalPurchase().forEach(purchase => {
  //     if (!finalResult.some(result => result[0] === purchase[0])) finalResult.push([purchase[0], -purchase[1]])
  //   })
  //   return finalResult
  // }

  // const calculateProfitPercentage = (): number[][] => {
  //   const finalResult: number[][] = []

  //   totalSale().forEach(sale => {
  //     const purchaseTotal = totalPurchase().find(purchase => sale[0] === purchase[0])
  //     if (purchaseTotal != null) finalResult.push([sale[0], ((sale[1] * 100) / purchaseTotal[1]) - 100])
  //     // else finalResult.push(sale)
  //   })
  //   // totalPurchase().forEach(purchase => {
  //   //   if(!finalResult.some(result => result[0] === purchase[0])) finalResult.push([purchase[0], -purchase[1]])
  //   // })
  //   return finalResult
  // }

  const changeTotalCosts = (): void => {
    if (data !== undefined) {
      // let finalProfit: string = ''
      // const profits: ProfitsProps[] = []
      // calculateProfit().forEach(profitValue => {
      //   finalProfit += `${profitValue[0]} ${profitValue[1].toFixed(2)} + `
      //   profits.push({ idCurrency: profitValue[0], valueTotalProfit: Number(profitValue[1].toFixed(2)), percentageProfit: null })
      // })
      //  setProfit(finalProfit.slice(0, -3))
      const totalCostArray = [...proposal?.totalCosts.filter(e => e.costType === CostTypes.Origin || e.costType === CostTypes.Destiny)]

      if (totalOtherFare !== '0,00' && totalOtherFare !== '') {
        totalCostArray.push({
          idTotalCost: null,
          costType: CostTypes.Tariff,
          idCurrency: currency,
          valueTotalSale: FormatNumber.convertStringToNumber(totalOtherFare),
          valueTotalPurchase: FormatNumber.convertStringToNumber(totalOtherFare)
        })
      }
      if (isAir() && (value !== '0,00' && value !== '')) {
        totalCostArray.push({
          idTotalCost: null,
          costType: CostTypes.Freight,
          idCurrency: currency,
          valueTotalSale: totalValue(),
          valueTotalPurchase: totalValue()
        })
      } else if ((value !== '0,00' && value !== '')) {
        totalCostArray.push({
          idTotalCost: null,
          costType: CostTypes.Freight,
          idCurrency: currency,
          valueTotalSale: FormatNumber.convertStringToNumber(value),
          valueTotalPurchase: FormatNumber.convertStringToNumber(value)
        })
      }
      // calculateProfitPercentage().forEach(percentageValue => {
      //   profits.forEach((each, index) => {
      //     if (each.idCurrency === percentageValue[0]) profits[index] = { ...profits[index], percentageProfit: Number(percentageValue[1].toFixed(2)) }
      //   })
      // })
      // setProfitPercentage(calculateProfitPercentage())
      if (setTotalCostArray) setTotalCostArray(totalCostArray)
      setProposal({ ...proposal, totalCosts: totalCostArray })
    }
  }

  useEffect(() => {
    changeTotalCosts()
  }, [data, totalCosts, currency, modal, totalOtherFare, value])

  return (
    <TotalContainer>
      <UpperContainer>
        {isAir()
          ? <>
            <CwLabel>{I18n.t('pages.newProposal.step5.cwBuySell')}</CwLabel>
            <div>{cw?.toFixed(2).replace('.', ',')} / {cwSale?.toFixed(2).replace('.', ',')}</div>
          </>
          : null
        }
        <TotalCargoContainer>
            <div>{I18n.t('pages.newProposal.step5.totalLoad')}</div>
            {isAir()
              ? <div>{(value !== '0,00' && value !== '') ? `${currency} ${totalValue().toFixed(2).replace('.', ',')}` : '-'}</div>
              : <div>{(value !== '0,00' && value !== '') ? `${currency} ${value}` : '-'}</div>
            }
        </TotalCargoContainer>
      </UpperContainer>
      <LowerContainer>
        <ProfitContainer>

          {/* Profit comentado que sera implementado posteriormente no header
          <ProfitLabel>
            {I18n.t('pages.newProposal.step5.profit')}
            <ProfitValue>{profit.replace('.', ',')}</ProfitValue>
          </ProfitLabel> */}
          {/* <ProfitLabel>
            {I18n.t('pages.newProposal.step5.percentageProfit')}
            {profitPercentage.map((profitArray) => (
              <PercentageCard color={profitArray[1] <= 0 ? 'red' : 'normal'}>
                {profitArray[1] <= 0 ? <NegativeProfitIcon /> : <PositiveProfitIcon />}
                <PercentageLabel>{String(profitArray[0])} {String(profitArray[1].toFixed(2).replace('.', ','))}%</PercentageLabel>
              </PercentageCard>
            ))}

          </ProfitLabel> */}
        </ProfitContainer>
        <TotalCargoContainer>
          <div>{I18n.t('pages.newProposal.step5.totalOtherFees')}</div>
          <div>{(totalOtherFare !== '0,00' && totalOtherFare !== '') ? `${currency} ${totalOtherFare}` : '-'}</div>
        </TotalCargoContainer>
      </LowerContainer>
    </TotalContainer>
  )
}

export default TotalSurcharge
