import React from 'react'
import { NewProposal } from '../../../../presentation/pages'
import { makeProposalService } from './new-proposal-service-factory'

export const MakeNewProposalFactory: React.FC = (props) => {
  return (
      <NewProposal
        {...props}
        proposalService={makeProposalService()}
      />
  )
}
