
import { DataProps } from '../../domain/models/DataProps'

const validateIncoterm = (data: DataProps | null): boolean => {
  if (!data.incoterm || data.incoterm.length === 0) {
    return false
  }
  if (data.incoterm === 'EXW') {
    return data.collection !== '' && data.postalCode !== ''
  }
  if (data.incoterm === 'DAP') {
    return data.collectionDap !== '' && data.postalCodeDap !== ''
  }
  return data.incoterm !== 'EXW' && data.incoterm !== 'DAP'
}

const Validations = {
  validateIncoterm
}

export default Validations
