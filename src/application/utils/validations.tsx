
import { DataProps } from '../../domain/models/DataProps'
import { IncotermTypes, ProposalTypes } from '../../application/enum/enum'

const validateIncoterm = (data: DataProps | null): boolean => {
  if (!data.incoterm || data.incoterm.length === 0) {
    return false
  }
  if (data.incoterm === IncotermTypes.Exw) {
    return data.collection !== '' && data.postalCode !== ''
  }
  if (data.incoterm === IncotermTypes.Dap) {
    return data.collectionDap !== '' && data.postalCodeDap !== ''
  }
  return data.incoterm !== IncotermTypes.Exw && data.incoterm !== IncotermTypes.Dap
}

const validateClient = (proposalType: number, selectedAgents: any[]): boolean => {
  return proposalType !== ProposalTypes.Client || selectedAgents[0].agent.length !== 0
}

const Validations = {
  validateIncoterm,
  validateClient
}

export default Validations
