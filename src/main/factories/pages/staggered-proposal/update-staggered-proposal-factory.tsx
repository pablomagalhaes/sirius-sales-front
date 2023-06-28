import React from 'react'
import { makeRemoteUpdateStaggeredProposal } from '@/main/factories/usecases'
import { StaggeredProposal } from '@/presentation/pages'

export const makeAdminDetail: React.FC = (props) => {
  return (
    <StaggeredProposal
      {...props}
      updateStaggeredProposal={makeRemoteUpdateStaggeredProposal()}
    />
  )
}
