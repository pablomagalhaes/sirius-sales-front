import React from 'react'
import { makeRemoteNewStaggeredProposal } from '../../usecases/remote-new-staggered-proposal-factory'
import NewStaggeredProposal from '../../../../presentation/pages/NewStaggeredProposal'

export const MakeNewStaggeredProposal: React.FC = (props) => {
  return (
    <NewStaggeredProposal
      {...props}
      newStaggeredProposal={makeRemoteNewStaggeredProposal()}
    />
  )
}
