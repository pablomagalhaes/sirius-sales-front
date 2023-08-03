import React, { useContext, useState, useEffect } from 'react'
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
  theme,
  ShowList
}: Step2Props): JSX.Element => {
  const { staggeredproposal }: StaggeredProposalProps = useContext(StaggeredProposalContext)
  const [TariffLine, setTariffLine] = useState([])

  useEffect(() => {
    const duplicated = staggeredproposal?.proposalTariff.map((current, i, array) => {
      // Number of duplicates
      const duplicatesCount = array
        .slice(0, i)
        .filter(el => el.origin.startsWith(current.origin) && el.destination.startsWith(current.destination))
        .length
      return {
        ...current,
        duplicate: duplicatesCount > 0
      }
    })
    setTariffLine(duplicated)
  }, [staggeredproposal?.proposalTariff])

  return (
    <>
    <Separator>
      <Title>
        2. {I18n.t('pages.staggeredProposal.newStaggeredProposal.step2.title')}
        <Subtitle>{I18n.t('pages.staggeredProposal.newStaggeredProposal.step2.subtitle')}</Subtitle>
      </Title>
      {ShowList && (
        <>
          {TariffLine?.map((item, index) => {
            return (
              <InputRow key={index} chave={index} item={item}/>
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
