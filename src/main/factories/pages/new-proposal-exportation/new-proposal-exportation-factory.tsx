import React from 'react'
import { NewProposalExportation } from '../../../../presentation/pages'
import { makeProposalExportationService } from './new-proposal-exportation-service'

export const MakeNewProposalExportationFactory: React.FC = (props) => {
  return (
      <NewProposalExportation
        {...props}
        proposalService={makeProposalExportationService()}
      />
  )
}
