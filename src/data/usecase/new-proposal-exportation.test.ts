import { NewProposalExportationService } from './new-proposal-exportation'
import { NewProposalMock } from './new-proposal-mock'

describe('NewProposalExportationService', () => {
  const service = new NewProposalExportationService()

  it('should set proposal', () => {
    const proposal = NewProposalMock

    service.setProposal(proposal)

    expect(service.proposal).toEqual(proposal)
  })
})
