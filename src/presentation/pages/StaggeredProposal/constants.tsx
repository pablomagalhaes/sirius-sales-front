
import { SelectorsValuesTypes } from '../../../application/enum/staggeredProposalEnum'
import { I18n } from 'react-redux-i18n'
import { OrderButtonMenuItems } from '../../components/OrderComponent/OrderBy'

const orderButtonMenuItems = (): OrderButtonMenuItems[] => {
  return [
    {
      value: SelectorsValuesTypes.Reference,
      description: I18n.t('pages.staggeredProposal.filter.reference')
    },
    {
      value: SelectorsValuesTypes.Client,
      description: I18n.t('pages.staggeredProposal.filter.client')
    },
    {
      value: SelectorsValuesTypes.Responsible,
      description: I18n.t('pages.staggeredProposal.filter.responsible')
    },
    {
      value: SelectorsValuesTypes.Origin,
      description: I18n.t('pages.staggeredProposal.filter.origin')
    },
    {
      value: SelectorsValuesTypes.Destination,
      description: I18n.t('pages.staggeredProposal.filter.destination')
    },
    {
      value: SelectorsValuesTypes.Validity,
      description: I18n.t('pages.staggeredProposal.filter.startDate')
    },
    {
      value: SelectorsValuesTypes.EndValidity,
      description: I18n.t('pages.staggeredProposal.filter.endDate')
    },
    {
      value: SelectorsValuesTypes.DateCreated,
      description: I18n.t('pages.staggeredProposal.filter.dateCreated')
    }
  ]
}

export { orderButtonMenuItems }
