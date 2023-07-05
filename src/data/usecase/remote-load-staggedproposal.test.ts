import { RemoteLoadStaggeredProposal } from './remote-load-staggedproposal'
import { OrderTypes } from '../../application/enum/enum'
import { SelectorsValuesTypes } from '../../application/enum/tariffEnum'

export const filterDefault = {
  page: 0,
  size: 10,
  orderByList: `${SelectorsValuesTypes.Reference},${OrderTypes.Descendent}`
}

describe('StaggeredProposalService', () => {
  const service = new RemoteLoadStaggeredProposal

  it('should set proposal', () => {

    service.loadStaggered(filterDefault)

    expect(service.loadStaggered).toEqual(filterDefault)
  })
})
