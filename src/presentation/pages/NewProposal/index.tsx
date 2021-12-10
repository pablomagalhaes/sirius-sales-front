import React from 'react'
import CostTable from '../../components/CostTable/CostTable'

const NewProposal = (): JSX.Element => {
  return (
    <div style={{ background: 'white' }}>
      <CostTable title={'Origem'} totalCostLabel={'Total custos origem:'} />
    </div>
  )
}

export default NewProposal
