import React, { useContext, useState, useEffect } from 'react'
import {
  Grid,
  Divider
} from '@material-ui/core/'
import { I18n } from 'react-redux-i18n'
import {
  Title,
  Subtitle,
  Separator,
  FormLabelHeader,
  StepMainDiv
} from './StepsStyles'

import { withTheme } from 'styled-components'

import InputRow from '../components/InputRow'
import { StaggeredProposalContext, StaggeredProposalProps } from '../../StaggeredProposal/context/StaggeredProposalContext'
import { RedColorSpan } from '../../../components/StyledComponents/modalStyles'

import {
  STAGGEREDPROPOSAL_NEWSTAGGEREDPROPOSAL_STEP2_LABEL_AGENT,
  STAGGEREDPROPOSAL_NEWSTAGGEREDPROPOSAL_STEP2_LABEL_CIAAREA,
  STAGGEREDPROPOSAL_NEWSTAGGEREDPROPOSAL_STEP2_LABEL_COIN,
  STAGGEREDPROPOSAL_NEWSTAGGEREDPROPOSAL_STEP2_LABEL_VMINIMUM,
  STAGGEREDPROPOSAL_NEWSTAGGEREDPROPOSAL_STEP2_LABEL_UNTIL45KG,
  STAGGEREDPROPOSAL_NEWSTAGGEREDPROPOSAL_STEP2_LABEL_UNTIL100KG,
  STAGGEREDPROPOSAL_NEWSTAGGEREDPROPOSAL_STEP2_LABEL_UNTIL300KG,
  STAGGEREDPROPOSAL_NEWSTAGGEREDPROPOSAL_STEP2_LABEL_UNTIL500KG,
  STAGGEREDPROPOSAL_NEWSTAGGEREDPROPOSAL_STEP2_LABEL_UNTIL1000KG
} from '../../../../ids'
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
  const [TariffLine, setTariffLine] = useState([])

  useEffect(() => {
    const newArr = staggeredproposal?.proposalTariff.map((current, i, array) => {
      // Number of duplicates
      const duplicatesCount = array
        .slice(0, i)
        .filter(el => el.origin.startsWith(current.origin) &&
          el.destination.startsWith(current.destination) &&
          el.idAgent === current.idAgent &&
          el.idBusinessPartnerTransporter === current.idBusinessPartnerTransporter
        ).length
      return {
        ...current,
        duplicate: duplicatesCount > 0
      }
    })
    const newTariffLine = []
    newArr.forEach((curr) => {
      if (newTariffLine.some((tariff) => tariff[0].origin === curr.origin && tariff[0].destination === curr.destination)) {
        const index = newTariffLine.findIndex((tariff: any) => tariff[0].origin === curr.origin && tariff[0].destination === curr.destination)
        newTariffLine[index] = [...newTariffLine[index], curr]
      } else {
        newTariffLine.push([curr])
      }
    })
    setTariffLine(newTariffLine)
  }, [staggeredproposal?.proposalTariff])

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
          {TariffLine?.map((item, index) => {
            return (
              <StepMainDiv key={index}>
                <Title>2.{(Number(index) + 1)} De {item[0]?.origin} - {item[0]?.destination}</Title>
                <Grid
                  container
                  spacing={1}
                  alignItems="center"
                >
                  <Grid item xs={2}>
                    <FormLabelHeader component="legend" id={STAGGEREDPROPOSAL_NEWSTAGGEREDPROPOSAL_STEP2_LABEL_AGENT}>
                      {I18n.t('pages.staggeredProposal.newStaggeredProposal.step2.agent')}:
                    </FormLabelHeader>
                  </Grid>
                  <Grid item xs={2}>
                    <FormLabelHeader component="legend" id={STAGGEREDPROPOSAL_NEWSTAGGEREDPROPOSAL_STEP2_LABEL_CIAAREA}>
                      {I18n.t('pages.staggeredProposal.newStaggeredProposal.step2.ciaArea')}
                    </FormLabelHeader>
                  </Grid>
                  <Grid item xs={1}>
                    <FormLabelHeader component="legend" id={STAGGEREDPROPOSAL_NEWSTAGGEREDPROPOSAL_STEP2_LABEL_COIN}>
                      {I18n.t('pages.staggeredProposal.newStaggeredProposal.step2.coin')}
                    </FormLabelHeader>
                  </Grid>
                  <Grid item xs={1}>
                    <FormLabelHeader component="legend" id={STAGGEREDPROPOSAL_NEWSTAGGEREDPROPOSAL_STEP2_LABEL_VMINIMUM}>
                      {I18n.t('pages.staggeredProposal.newStaggeredProposal.step2.minValue')}
                    </FormLabelHeader>
                  </Grid>
                  <Grid item xs={1}>
                    <FormLabelHeader component="legend" center id={STAGGEREDPROPOSAL_NEWSTAGGEREDPROPOSAL_STEP2_LABEL_UNTIL45KG}>
                      {I18n.t('pages.staggeredProposal.newStaggeredProposal.step2.45')}
                    </FormLabelHeader>
                  </Grid>
                  <Grid item xs={1}>
                    <FormLabelHeader component="legend" center id={STAGGEREDPROPOSAL_NEWSTAGGEREDPROPOSAL_STEP2_LABEL_UNTIL100KG}>
                      {I18n.t('pages.staggeredProposal.newStaggeredProposal.step2.100')}
                    </FormLabelHeader>
                  </Grid>
                  <Grid item xs={1}>
                    <FormLabelHeader component="legend" center id={STAGGEREDPROPOSAL_NEWSTAGGEREDPROPOSAL_STEP2_LABEL_UNTIL300KG}>
                      {I18n.t('pages.staggeredProposal.newStaggeredProposal.step2.300')}
                    </FormLabelHeader>
                  </Grid>
                  <Grid item xs={1}>
                    <FormLabelHeader component="legend" center id={STAGGEREDPROPOSAL_NEWSTAGGEREDPROPOSAL_STEP2_LABEL_UNTIL500KG}>
                      {I18n.t('pages.staggeredProposal.newStaggeredProposal.step2.500')}
                    </FormLabelHeader>
                  </Grid>
                  <Grid item xs={1}>
                    <FormLabelHeader component="legend" center id={STAGGEREDPROPOSAL_NEWSTAGGEREDPROPOSAL_STEP2_LABEL_UNTIL1000KG}>
                      {I18n.t('pages.staggeredProposal.newStaggeredProposal.step2.1ton')}
                    </FormLabelHeader>
                  </Grid>
                  <Grid item xs={1}></Grid>
                </Grid>
                <Divider />
                {item?.map((tariff: any, i: number) => <InputRow key={index + i} chave={index + i} item={tariff} setCompleted={setCompleted} setFilled={setFilled} invalidInput={invalidInput}/>)}
              </StepMainDiv>
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
