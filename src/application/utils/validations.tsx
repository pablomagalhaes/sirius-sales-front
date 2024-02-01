
import { DataProps } from '../../domain/models/DataProps'
import { IncotermTypes } from '../../application/enum/enum'

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

const Validations = {
  validateIncoterm
}

export default Validations
