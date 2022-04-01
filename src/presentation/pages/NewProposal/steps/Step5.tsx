import React, { useEffect, useState } from 'react'
import CostTable from '../../../components/CostTable/CostTable'
import { I18n } from 'react-redux-i18n'
import { Title, Subtitle, Separator } from '../style'
import { ItemModalData } from '../../../components/ItemModal/ItemModal'

interface Step5Props {
  costData: any
  modal: string
  setCompleted: (completed: any) => void
  specifications: string
  containerItems: ItemModalData[]
}

const Step5 = ({ costData, modal, specifications, setCompleted, containerItems }: Step5Props): JSX.Element => {
  const [dataOrigin, setDataOrigin] = useState(0)
  const [dataDestiny, setDataDestiny] = useState(0)

  useEffect(() => {
    if (dataOrigin > 0 && dataDestiny > 0) {
      setCompleted((currentState) => {
        return { ...currentState, step5: true }
      })
    } else {
      setCompleted((currentState) => {
        return { ...currentState, step5: false }
      })
    }
  }, [dataDestiny, dataOrigin])

  return (
    <Separator>
      <Title>
        5. {I18n.t('pages.newProposal.step5.title')}
        <Subtitle>{I18n.t('pages.newProposal.step5.subtitle')}</Subtitle>
      </Title>
      <CostTable
        modalTitle={I18n.t('pages.newProposal.step5.originCost')}
        title={I18n.t('pages.newProposal.step5.origin')}
        totalCostLabel={I18n.t('pages.newProposal.step5.totalOrigin')}
        costData={costData}
        modal={modal}
        specifications={specifications}
        changeTableFill={setDataOrigin}
        containerItems={containerItems}
      />
      <CostTable
        modalTitle={I18n.t('pages.newProposal.step5.destinationCost')}
        title={I18n.t('pages.newProposal.step5.destiny')}
        totalCostLabel={I18n.t('pages.newProposal.step5.totalDestiny')}
        costData={costData}
        modal={modal}
        specifications={specifications}
        changeTableFill={setDataDestiny}
        containerItems={containerItems}
      />
    </Separator>
  )
}

export default Step5
