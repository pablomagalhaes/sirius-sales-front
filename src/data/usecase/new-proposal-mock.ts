import { CargoVolume } from '../../domain/CargoVolume'

export const NewProposalMock = {
  idProposal: null,
  idProposalImportFreight: null,
  referenceProposal: 'Ref-000000',
  idBusinessPartnerCustomer: 0,
  operationType: 'IMPORT FREIGHT',
  idProposalStatus: 1,
  codeUserCreation: 0,
  validityDate: '2022-05-12T13:03:46.340Z',
  referenceClientProposal: '',
  generalObservations: '',
  internalObservations: '',
  requester: '',
  cargoCollectionAddress: '',
  cargoDeliveryAddress: '',
  costs: [],
  totalCosts: [],
  idProposalType: 1,
  idTransport: 0,
  originDestiny: [],
  idOrigin: '',
  idDestination: '',
  originCityName: '',
  originCityId: '',
  destinationCityName: '',
  destinationCityId: '',
  idIncoterm: '',
  cargo: [{
    id: 0,
    txCargo: '',
    isDangerous: true,
    idImoType: 0,
    idTemperature: 0,
    idCargoContractingType: 0,
    codeUnDangerous: 0,
    cargoVolumes: [] as CargoVolume[],
    vlCwPurchase: 0,
    vlCwSale: 0
  }],
  transitTime: 0,
  idFrequency: 0,
  route: '',
  freeTimeDemurrages: [],
  recurrency: 1,
  weeklyRecurrency: '',
  transportIncluded: false,
  clearenceIncluded: false,
  agents: [],
  profits: []
}
