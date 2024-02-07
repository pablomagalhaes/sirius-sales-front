
import moment from 'moment'
import { DataProps } from '../../domain/models/DataProps'
import { IncotermTypes, ProposalTypes, ModalTypes,IdProposalTypes,ID_CARGO_CONTRACTING_TYPE } from '../../application/enum/enum'

interface Step3Data {
  description: string
  specifications: string
  temperature: string
  dangerous: boolean
  imo: string
  codUn: string
}

interface Step4Data {
  validity: string
  validityDate: string
  transitTime: string
  frequency: string
  route: string
  client: string
  generalObs: string
  internalObs: string
  recurrency: '1'
  weeklyRecurrency: string
}

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

const validateOriginDestination = (modal: string, data: DataProps): boolean => {
  return modal === ModalTypes.Land || (modal !== ModalTypes.Land && data.origin !== data.destiny)
}

const validateShippingCompany = (value: string, index: number, selectedAgents: any[]): boolean => {
  return selectedAgents.some((agent, currentIndex) =>
    agent.shippingCompany === value &&
    currentIndex !== index &&
    value.length !== 0
  )
}

const validateAgent = (value: string, index: number, selectedAgents: any[]): boolean => {
  return selectedAgents.some((agent, currentIndex) =>
    agent.agent === value &&
    currentIndex !== index &&
    value.length > 0
  )
}

const validateCompleteShippingCompany = (selectedAgents: any[]): boolean => {
  return selectedAgents.every(selectedAgent => selectedAgent.shippingCompany.length > 0)
}

const validateFilledStep2Import = (modal: string, data: DataProps, setFilled: Function, proposalType: number, selectedAgents: any[]): void => {
  const step6 = modal === ModalTypes.Land
  if (
    data.origin !== '' ||
    data.destiny !== '' ||
    data.oriCity !== '' ||
    data.oriState !== '' ||
    data.oriCountry !== '' ||
    data.destCity !== '' ||
    data.destState !== '' ||
    data.destCountry !== '' ||
    data.incoterm !== '' ||
    (proposalType === ProposalTypes.Client && selectedAgents[0].agent.length !== 0) ||
    proposalType !== ProposalTypes.Client ||
    (proposalType === ProposalTypes.Client && selectedAgents[0].profitPercentageAgent !== null) ||
    proposalType !== ProposalTypes.Client
  ) {
    setFilled((currentState) => {
      return { ...currentState, step2: true, step6 }
    })
  } else {
    setFilled((currentState) => {
      return { ...currentState, step2: false, step6 }
    })
  }
}

const validateFilledStep1ImportExport = (data: any, setFilled: Function): void => {
  if (
    data.proposal !== 0 ||
    data.modal !== ''
  ) {
    setFilled((currentState) => {
      return { ...currentState, step1: true }
    })
  } else {
    setFilled((currentState) => {
      return { ...currentState, step1: false }
    })
  }
}

const validateFilledStep2Export = (data: DataProps, setFilled: Function, proposalType: number, selectedAgents: any[]): void => {
  if (proposalType !== ProposalTypes.Client) {
    if (
      data.origin !== '' ||
      data.destiny !== '' ||
      data.oriCity !== '' ||
      data.oriState !== '' ||
      data.oriCountry !== '' ||
      data.destCity !== '' ||
      data.destState !== '' ||
      data.destCountry !== '' ||
      data.incoterm !== '' ||
      (proposalType === ProposalTypes.Client && selectedAgents[0].agent.length !== 0) ||
      proposalType !== ProposalTypes.Client ||
      (proposalType === ProposalTypes.Client && selectedAgents[0].profitPercentageAgent !== null) ||
      proposalType !== ProposalTypes.Client
    ) {
      setFilled((currentState) => {
        return { ...currentState, step2: true }
      })
    } else {
      setFilled((currentState) => {
        return { ...currentState, step2: false }
      })
    }
  } else {
    setFilled((currentState) => {
      return { ...currentState, step2: true }
    })
  }
}

const validateFilledStep3ImportExport = (tableRows: any[], data: any, setFilled: Function): void => {
  if (tableRows.length > 0 ||
    data.description.length > 0 ||
    data.specifications.length > 0 ||
    data.temperature !== '' ||
    data.imo.length > 0 ||
    data.codUn?.length > 0 ||
    data.dangerous) {
    setFilled((currentState) => {
      return { ...currentState, step3: true }
    })
  } else {
    setFilled((currentState) => {
      return { ...currentState, step3: false }
    })
  }
}

const validateFilledStep4ImportExport = (data: any, setFilled: Function): void => {
  if (
    data.validity.length > 0 ||
    data.validityDate.length > 0 ||
    data.transitTime.length > 0 ||
    data.frequency !== '' ||
    data.route.length > 0 ||
    data.client.length > 0 ||
    data.generalObs.length > 0 ||
    data.internalObs.length > 0
  ) {
    setFilled((currentState) => {
      return { ...currentState, step4: true }
    })
  } else {
    setFilled((currentState) => {
      return { ...currentState, step4: false }
    })
  }
}

const validadeFilledStep5ImportExport = (proposal: any, data: any[], dataSales: any, dataContainer: any, setFilled: Function): void => {
  const FclCargoContractingType = ID_CARGO_CONTRACTING_TYPE.FCL
  const ContractingTypeWithoutFcl = [
    ID_CARGO_CONTRACTING_TYPE.LCL,
    ID_CARGO_CONTRACTING_TYPE.BREAK_BULK,
    ID_CARGO_CONTRACTING_TYPE.RO_RO
  ]
  if (proposal.idTransportMode === IdProposalTypes.Air || proposal.idTransportMode === IdProposalTypes.Land || (proposal.idTransportMode === IdProposalTypes.Sea && proposal.cargo[0].idCargoContractingType !== null && ContractingTypeWithoutFcl.includes(proposal.cargo[0].idCargoContractingType))) {
    if (data.every(d => d.currencyPurchase !== '') &&
    data.every(d => d.valuePurchase !== '') &&
    dataSales.valueSale?.length !== 0 &&
    (dataSales.valueSale.every(value => value !== '' && value !== '0')) &&
    (dataSales.currencySale !== '' && dataSales.currencySale !== '0' && dataSales.currencySale !== null)) {
      setFilled((currentState) => {
        return { ...currentState, step5: true }
      })
    } else {
      setFilled((currentState) => {
        return { ...currentState, step5: false }
      })
    }
  }

  if (proposal.idTransportMode === IdProposalTypes.Sea && proposal.cargo[0].idCargoContractingType === FclCargoContractingType) {
    if (dataContainer.every(d => d.currencyPurchase !== '') && dataContainer.every(d => d.valuePurchase !== '')) {
      setFilled((currentState) => {
        return { ...currentState, step5: true }
      })
    } else {
      setFilled((currentState) => {
        return { ...currentState, step5: false }
      })
    }
  }
}

const validadeFilledStep6ImportExport = (dataOrigin: string, dataDestiny: string, setFilled: Function): void => {
  if (dataOrigin.length > 0 && dataDestiny.length > 0) {
    setFilled((currentState) => {
      return { ...currentState, step6: true }
    })
  } else {
    setFilled((currentState) => {
      return { ...currentState, step6: false }
    })
  }
}

const validateDate = (data: Step4Data): boolean => {
  const validityDate = moment(data.validityDate, 'DD/MM/YYYY', true)
  const today = moment().startOf('day')
  return validityDate.isValid() && validityDate.isSameOrAfter(today)
}

const validateFormCompleteStep2ImportExport = (invalidAgent: boolean, validateCompleteShippingCompany: Function, originDestinyFullfilled: Function, validateClient: Function, validateIncoterm: Function, validateOriginDestination: Function, validateProfitPercent: Function, setCompleted: Function): void => {
  const isFormValid = !invalidAgent &&
                      validateCompleteShippingCompany() &&
                      originDestinyFullfilled() &&
                      validateClient() &&
                      validateIncoterm() &&
                      validateOriginDestination() &&
                      validateProfitPercent()
  setCompleted(currentState => ({ ...currentState, step2: isFormValid }))
}

const validateFormCompleteStep3ImportExport = (modal: string, validateDangerous: Function,validateEspecification: Function, data: Step3Data, setCompleted: Function): void => {
  const isFormValid = validateDangerous() &&
                      validateEspecification() &&
                      data.description.length !== 0 &&
                      data.temperature.length !== 0

  const step6 = modal === ModalTypes.Land
  setCompleted(currentState => ({ ...currentState, step3: isFormValid, step6 }))
}

const validateFormCompleteStep4ImportExport = (modal: string, validateCompleteInputs: Function, validateDate: Function, setCompleted: Function): void => {
  const isFormValid = validateCompleteInputs() && validateDate()
  const step6 = modal === ModalTypes.Land

  setCompleted(currentState => ({
    ...currentState,
    step4: isFormValid,
    step6
  }))
}

const Validations = {
  validateIncoterm,
  validateClient,
  validateOriginDestination,
  validateShippingCompany,
  validateAgent,
  validateCompleteShippingCompany,
  validateFilledStep1ImportExport,
  validateFilledStep2Import,
  validateFilledStep2Export,
  validateFilledStep3ImportExport,
  validateFilledStep4ImportExport,
  validadeFilledStep5ImportExport,
  validadeFilledStep6ImportExport,
  validateDate,
  validateFormCompleteStep2ImportExport,
  validateFormCompleteStep3ImportExport,
  validateFormCompleteStep4ImportExport
}

export default Validations
