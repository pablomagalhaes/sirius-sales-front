import React from 'react'
import CostTable from '../../components/CostTable/CostTable'
import { MainDiv } from './style'

const NewProposal = (): JSX.Element => {
  return (
    <MainDiv>
      <CostTable title={'Origem'} totalCostLabel={'Total custos origem:'} />
      <CostTable title={'Destino'} totalCostLabel={'Total custos destino:'} />
    </MainDiv>
  )
}

export default NewProposal
