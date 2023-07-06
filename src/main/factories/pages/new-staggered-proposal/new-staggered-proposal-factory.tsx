import React from 'react'
import { makeRemoteUpdateStaggeredProposal } from '../../usecases/remote-update-staggered-proposal-factory'
import NewStaggeredProposal from '../../../../presentation/pages/NewStaggeredProposal'

export const MakeNewStaggeredProposal: React.FC = (props) => {
  return (
    <NewStaggeredProposal
      {...props}
      updateStaggeredProposal={makeRemoteUpdateStaggeredProposal()}
    />
  )
}
