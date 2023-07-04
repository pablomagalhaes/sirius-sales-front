import { NewProposalService } from '../../../../data/usecase/new-proposal'
import { NewProposal } from '../../../../domain/usecase'

export const makeProposalService = (): NewProposal => new NewProposalService()
