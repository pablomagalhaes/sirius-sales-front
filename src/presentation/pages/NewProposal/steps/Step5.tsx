import React, { useEffect, useState } from 'react'
import CostTable from '../../../components/CostTable/CostTable'
import { I18n } from 'react-redux-i18n'
import { Title, Subtitle, Separator } from '../style'
import { ItemModalData } from '../../../components/ItemModal/ItemModal'

interface Step5Props {
  costData: any
  modal: string
  setCompleted: (completed: any) => void
  setFilled: (filled: any) => void
  specifications: string
  containerItems: ItemModalData[]
  setUndoMessage: React.Dispatch<React.SetStateAction<{
    step3: boolean
    step5origin: boolean
    step5destiny: boolean
    step6: boolean
  }>>
  undoMessage: { step3: boolean, step5origin: boolean, step5destiny: boolean, step6: boolean }
}

const Step5 = ({ setFilled, costData, modal, specifications, setCompleted, containerItems, setUndoMessage, undoMessage }: Step5Props): JSX.Element => {
  const [dataOrigin, setDataOrigin] = useState(0)
  const [dataDestiny, setDataDestiny] = useState(0)

  useEffect(() => {
    if (dataOrigin > 0 && dataDestiny > 0) {
      setCompleted((currentState) => {
        return { ...currentState, step5: true }
      })
      setFilled((currentState) => {
        return { ...currentState, step5: true }
      })
    } else {
      setCompleted((currentState) => {
        return { ...currentState, step5: false }
      })
      setFilled((currentState) => {
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
        undoMessage={undoMessage}
        setUndoMessage={setUndoMessage}
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
        undoMessage={undoMessage}
        setUndoMessage={setUndoMessage}
      />
    </Separator>
  )
}

export default Step5
