import React from 'react'
import { makeRemoteLoadStaggeredProposal } from '../../usecases/remote-load-staggered-proposal-factory'
import { makeRemoteUpdateStatusStaggeredProposal } from '../../usecases/remote-update-status-staggered-proposal-factory'
import StaggeredProposal from '../../../../presentation/pages/StaggeredProposal'

export const MakeStaggeredProposal: React.FC = () => {
  return (
    <StaggeredProposal
      loadStaggeredProposal={makeRemoteLoadStaggeredProposal()}
      updateStatusStaggeredProposal ={makeRemoteUpdateStatusStaggeredProposal()}
    />
  )
}
