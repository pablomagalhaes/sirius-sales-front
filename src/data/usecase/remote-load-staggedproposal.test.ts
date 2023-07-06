import { RemoteLoadStaggeredProposal } from './remote-load-staggedproposal'
import { loadProposalMock } from './staggered-proposal-mock'

describe('StaggeredProposalService', () => {
  const service = new RemoteLoadStaggeredProposal()

  it('should set proposal', () => {
    service.loadStaggered(loadProposalMock)

    expect(service.loadStaggered).toEqual(loadProposalMock)
  })
})
