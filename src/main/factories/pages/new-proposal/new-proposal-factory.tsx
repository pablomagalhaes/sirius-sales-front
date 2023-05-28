import React from 'react'
import { NewProposal } from '../../../../presentation/pages'
import { makeProposalService } from './new-proposal-service-factory'

export const makeNewProposalFactory: React.FC = (props) => {
  return (
      <NewProposal
        {...props}
        proposal={makeProposalService()}
      />
  )
}
