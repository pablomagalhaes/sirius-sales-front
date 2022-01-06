import React from 'react'
import CostTable from '../../components/CostTable/CostTable'
import { I18n } from 'react-redux-i18n'
import { Title, Subtitle, Separator } from './style'

const Step5 = (): JSX.Element => {
  return (
    <Separator>
      <Title>
        5. {I18n.t('pages.newProposal.step5.title')}
        <Subtitle>{I18n.t('pages.newProposal.step5.subtitle')}</Subtitle>
      </Title>
      <CostTable modalTitle={I18n.t('pages.newProposal.step5.originCost')} title={I18n.t('pages.newProposal.step5.origin')} totalCostLabel={I18n.t('pages.newProposal.step5.totalOrigin')} />
      <CostTable modalTitle={I18n.t('pages.newProposal.step5.destinationCost')} title={I18n.t('pages.newProposal.step5.destiny')} totalCostLabel={I18n.t('pages.newProposal.step5.totalDestiny')} />
    </Separator>
  )
}

export default Step5
