import React from 'react'
import { makeRemoteUpdateStaggeredProposal } from '../../usecases/remote-update-staggered-proposal-factory'
import { StaggeredProposal } from '../../../../presentation/pages'

export const makeAdminDetail: React.FC = (props) => {
  return (
    <StaggeredProposal
      {...props}
      updateStaggeredProposal={makeRemoteUpdateStaggeredProposal()}
    />
  )
};
