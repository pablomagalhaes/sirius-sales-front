import { CargoVolume } from '../../domain/CargoVolume'
import { Proposal } from '../../domain/models'
import { NewProposalExportation } from '../../domain/usecase'
import { HttpClient } from '../protocols/http'

// eslint-disable-next-line import/export
export class NewProposalExportationService implements NewProposalExportation {
  constructor (
    private readonly url?: string,
    private readonly httpClient?: HttpClient<NewProposalService.Model>
  ) {}

  proposal: any = {
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
    idProposalType: 0,
    idTransport: '',
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

  setProposal (value: any): void {
    this.proposal = value
  }

  // tratar criação de nova proposta em tarefa futura
  // async post (): Promise<NewProposal.Model> {
  //   const httpResponse = await this.httpClient.request({
  //     url: this.url,
  //     method: 'post',
  //     body: this.proposal
  //   })
  //   const postResponse = httpResponse.body as NewProposal.Model
  //   switch (httpResponse.statusCode) {
  //     case HttpStatusCode.ok: return postResponse
  //     default: throw new UnexpectedError()
  //   }
  // }
}

// eslint-disable-next-line @typescript-eslint/no-namespace, import/export
export namespace NewProposalService {
  export type Model = Proposal
}
