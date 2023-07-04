import { NewProposalExportationService } from '../../../../data/usecase/new-proposal-exportation'
import { NewProposalExportation } from '../../../../domain/usecase'

export const makeProposalExportationService = (): NewProposalExportation => new NewProposalExportationService()
