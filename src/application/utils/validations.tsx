
import { DataProps } from '../../domain/models/DataProps'

const validateIncoterm = (data: DataProps | null): boolean => {
  return (
    (data.incoterm.length !== 0 &&
      data.incoterm !== '' &&
      data.incoterm !== 'EXW' &&
      data.incoterm !== 'DAP') ||
    (data.incoterm.length !== 0 &&
      data.incoterm !== '' &&
      data.incoterm === 'EXW' &&
      data.collection !== '' &&
      data.postalCode !== '') ||
    (data.incoterm.length !== 0 &&
      data.incoterm !== '' &&
      data.incoterm === 'DAP' &&
      data.collectionDap !== '' &&
      data.postalCodeDap !== '')
  )
}

const Validations = {
  validateIncoterm
}

export default Validations
