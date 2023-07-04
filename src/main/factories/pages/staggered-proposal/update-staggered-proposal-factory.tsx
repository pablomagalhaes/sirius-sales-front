import React from 'react'
import { makeRemoteUpdateStaggeredProposal } from '../../usecases/remote-update-staggered-proposal-factory'
import NewStaggeredProposal from '../../../../presentation/pages/StaggeredProposal/newStaggeredProposal';

export const makeAdminDetail: React.FC = (props) => {
  return (
    <NewStaggeredProposal
      {...props}
      updateStaggeredProposal={makeRemoteUpdateStaggeredProposal()}
    />
  )
};
