import { NewProposalService } from './new-proposal'
import { NewProposalMock } from './new-proposal-mock'

describe('NewProposalService', () => {
  const service = new NewProposalService()

  it('should set proposal', () => {
    const proposal = NewProposalMock

    service.setProposal(proposal)

    expect(service.proposal).toEqual(proposal)
  })
})
