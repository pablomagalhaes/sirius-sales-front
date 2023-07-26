import React, { useEffect, useState, useContext } from 'react'
import {
  MenuItem,
  FormLabel,
  Grid,
  InputAdornment,
  Divider,
  Button
} from '@material-ui/core/'
import { I18n } from 'react-redux-i18n'
import {
  StyledPaper,
  Title,
  Subtitle,
  SelectSpan,
  Separator,
  TextCellHead,
  TextCell,
  InputContainer,
  TextInnerGreyCell,
  TextInnerCell
} from './StepsStyles'

import IconComponent from '../../../../application/icons/IconComponent'
import { withTheme } from 'styled-components'

import ControlledSelect from '../../../components/ControlledSelect'
import ControlledInput from '../../../components/ControlledInput'
import { RedColorSpan } from '../../../components/StyledComponents/modalStyles'
import API from '../../../../infrastructure/api'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { MenuIconCell } from 'fiorde-fe-components'
import InputRow from '../components/InputRow'

import { StaggeredProposalContext, StaggeredProposalProps } from '../../StaggeredProposal/context/StaggeredProposalContext'

interface Step2Props {
  invalidInput: boolean
  setCompleted: (completed: any) => void
  setFilled: (filled: any) => void
  theme: any
  ShowList: boolean
}

interface Frequency {
  id: number
  description: string
}

const Step2 = ({
  invalidInput,
  setCompleted,
  setFilled,
  theme,
  ShowList
}: Step2Props): JSX.Element => {
  const { staggeredproposal, setStaggeredProposal }: StaggeredProposalProps = useContext(StaggeredProposalContext)

  const initialState = {
    validity: '',
    validityDate: '',
    transitTime: '',
    frequency: '',
    route: '',
    client: '',
    freeTime: '',
    deadline: '',
    value: '',
    generalObs: '',
    internalObs: '',
    recurrency: '1',
    weeklyRecurrency: ''
  }

  const [data, setData] = useState({
    operation: '',
    requester: '',
    recurrency: '1',
    frequency: ''
  })

  return (
    <>
    <Separator>
      <Title>
        2. {I18n.t('pages.staggeredProposal.newStaggeredProposal.step2.title')}
        <Subtitle>{I18n.t('pages.staggeredProposal.newStaggeredProposal.step2.subtitle')}</Subtitle>
      </Title>
      {ShowList && (
        <>
          {staggeredproposal?.proposalTariff?.map((item, index) => {
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
