import React, { useContext } from 'react'
import {
  Divider
} from '@material-ui/core/'
import { I18n } from 'react-redux-i18n'
import {
  Title,
  Subtitle,
  Separator
} from './StepsStyles'

import { withTheme } from 'styled-components'

import InputRow from '../components/InputRow'
import { StaggeredProposalContext, StaggeredProposalProps } from '../../StaggeredProposal/context/StaggeredProposalContext'
import { RedColorSpan } from '../../../components/StyledComponents/modalStyles'
interface Step2Props {
  invalidInput: boolean
  setCompleted: (completed: any) => void
  setFilled: (filled: any) => void
  theme: any
  ShowList: boolean
}

const Step2 = ({
  invalidInput,
  setCompleted,
  setFilled,
  ShowList
}: Step2Props): JSX.Element => {
  const { staggeredproposal }: StaggeredProposalProps = useContext(StaggeredProposalContext)

  return (
    <>
    <Separator>
      <Title>
        2. {I18n.t('pages.staggeredProposal.newStaggeredProposal.step2.title')}
        <Subtitle>{I18n.t('pages.staggeredProposal.newStaggeredProposal.step2.subtitle')}</Subtitle>
      </Title>
      {(invalidInput && staggeredproposal?.proposalTariff.length === 0) && <RedColorSpan>É obrigatório informar alguma tarifa.</RedColorSpan>}
      {ShowList && (
        <>
          {staggeredproposal?.proposalTariff?.map((item, index) => {
            return (
              <InputRow key={index} chave={index} item={item} setCompleted={setCompleted} setFilled={setFilled} invalidInput={invalidInput}/>
            )
          })}
        <Divider />
        </>
      )}
    </Separator>
    </>
  )
}

export default withTheme(Step2)
