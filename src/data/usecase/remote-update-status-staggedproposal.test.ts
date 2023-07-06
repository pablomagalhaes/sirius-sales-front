import { RemoteUpdateStatusStaggeredProposal } from './remote-update-status-staggedproposal'
import { updateStatusMock } from './staggered-proposal-mock'

describe('StaggeredStatusService', () => {
  const service = new RemoteUpdateStatusStaggeredProposal()

  it('should change proposal status', () => {
    service.updateStatusStaggered(updateStatusMock)

    expect(service.updateStatusStaggered).toEqual(updateStatusMock)
  })
})
