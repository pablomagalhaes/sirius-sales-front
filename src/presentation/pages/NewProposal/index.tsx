import React from 'react'
import CostTable from '../../components/CostTable/CostTable'
import { MainDiv } from './style'

const NewProposal = (): JSX.Element => {
  return (
    <MainDiv>
      <CostTable currencyLabel={'Definir essa moeda para custos de origem:'} title={'Origem'} totalCostLabel={'Total custos origem:'} />
      <CostTable currencyLabel={'Definir essa moeda para custos destino:'} title={'Destino'} totalCostLabel={'Total custos destino:'} />
    </MainDiv>
  )
}

export default NewProposal
