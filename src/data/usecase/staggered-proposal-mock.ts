import { StatusStaggeredProposalStringEnum } from '../../application/enum/statusProposalEnum'
import { OrderTypes } from '../../application/enum/enum'
import { SelectorsValuesTypes } from '../../application/enum/tariffEnum'

export const updateStatusMock = {
  id: 1,
  status: StatusStaggeredProposalStringEnum.AGUARDANDO_RETORNO_CLIENTE
}

export const loadProposalMock = {
  page: 0,
  size: 10,
  sort: `${SelectorsValuesTypes.Reference},${OrderTypes.Descendent}`
}
