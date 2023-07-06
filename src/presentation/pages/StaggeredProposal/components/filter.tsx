import React, { useState, useContext } from 'react'
import { RowFilter } from 'fiorde-fe-components'

import { I18n } from 'react-redux-i18n'
import { OriginDestinyTypes } from '../../../../application/enum/enum'
import {
  useOriginDestination,
  usePartnerList
} from '../../../hooks'
import { StaggeredProposalContext } from '../context/StaggeredProposalContext'
import { StatusProposalEnum } from '../../../../application/enum/statusProposalEnum'
import { menuItems } from '../../Proposal/constants'

interface FilterProps {
  cleanFilter: () => void
}

const Filter = ({
  cleanFilter
}: FilterProps): JSX.Element => {
  const { data: originDestinationList = [] } = useOriginDestination()
  const { partnerList, partnerSimpleNameList } = usePartnerList()
  const { setFilter }: any = useContext(StaggeredProposalContext)
  const [radioValue, setRadioValue] = useState('')

  const getOriginDestinyList = (): string[] => {
    const actualList: string[] = []
    originDestinationList?.forEach((item): void => {
      if (item.type === OriginDestinyTypes.Airport) {
        actualList.push(`${String(item.id)} - ${String(item.name)}`)
      }
    })
    return actualList
  }

  const handleSelectedRowFilter = (selectedFiltersRowFilter: any): void => {
    cleanFilter()

    const selectedProposal = findKeyFilter(
      selectedFiltersRowFilter,
      I18n.t('pages.staggeredProposal.filter.reference')
    )
    if (selectedProposal !== undefined) {
      setFilter((filter: any) => ({
        ...filter,
        referenceTariffProposal: selectedProposal
      }))
    }

    const selectedResponsible = findKeyFilter(
      selectedFiltersRowFilter,
      I18n.t('pages.staggeredProposal.filter.responsible')
    )
    if (selectedResponsible !== undefined) {
      setFilter((filter: any) => ({
        ...filter,
        userCreationName: selectedResponsible
      }))
    }

    const selectedAgents = findKeyFilter(
      selectedFiltersRowFilter,
      I18n.t('pages.staggeredProposal.filter.client')
    )
    if (selectedAgents !== undefined) {
      const agentIds: any = []
      selectedAgents.forEach(name => {
        const agent = partnerList.find(item => item.simpleName === name)
        agentIds.push(agent.id)
      })
      setFilter((filter: any) => ({
        ...filter,
        idBusinessPartnerCustomer: [agentIds]
      }))
    }

    const selectedProcessTypes = findKeyFilter(
      selectedFiltersRowFilter,
      I18n.t('pages.staggeredProposal.filter.processType')
    )

    if (selectedProcessTypes !== undefined) {
      const processTypes = selectedProcessTypes.map((type: string) => type === I18n.t('pages.staggeredProposal.filter.import') ? 'IMPORT' : 'EXPORT')
      setFilter((filter: any) => ({
        ...filter,
        txTariffType: [processTypes]
      }))
    }

    const selectedStatus = findKeyFilter(
      selectedFiltersRowFilter,
      I18n.t('pages.staggeredProposal.filter.status')
    )
    if (selectedStatus !== undefined) {
      const statusList: string[] = selectedStatus.map((status: string): number => {
        switch (status) {
          case 'Aberta':
            return StatusProposalEnum.ABERTA
          case 'Ag. Retorno Cliente':
            return StatusProposalEnum.AGUARDANDO_RETORNO_CLIENTE
          case 'Em Revisão':
            return StatusProposalEnum.EM_REVISAO
          case 'Aprovada':
            return StatusProposalEnum.APROVADA
          case 'Rejeitada':
            return StatusProposalEnum.REJEITADA
          case 'Cancelada':
            return StatusProposalEnum.CANCELADA
          case 'Cancelamento Automatico':
            return StatusProposalEnum.CANCELAMENTO_AUTOMATICO
          default:
            return 0
        }
      })
      setFilter((filter: any) => ({
        ...filter,
        idTariffProposalStatus: [statusList]
      }))
    }

    const selectedOriginsDestinations = findKeyFilter(
      selectedFiltersRowFilter,
      `${String(I18n.t('pages.tariff.orderSelectors.origin'))}/${String(I18n.t('pages.tariff.orderSelectors.destination'))}`
    )
    if (selectedOriginsDestinations !== undefined) {
      const idOrigin = selectedOriginsDestinations.pickerSelecteds1
        .map((name: string) => name.split(' - ')[0])
      const idDestination = selectedOriginsDestinations.pickerSelecteds2
        .map((name: string) => name.split(' - ')[0])

      if (idOrigin.length > 0 && idOrigin[0] !== undefined) {
        setFilter((filter: any) => ({
          ...filter,
          idOrigin
        }))
      }
      if (idDestination.length > 0 && idDestination[0] !== undefined) {
        setFilter((filter: any) => ({
          ...filter,
          idDestination
        }))
      }
    }

    const selectedDates = findKeyFilter(selectedFiltersRowFilter, I18n.t('pages.staggeredProposal.filter.period'))
    if (selectedDates !== undefined) {
      const type = selectedFiltersRowFilter[4].checkBoxSelecteds
      const size = selectedDates.length
      if (type[0] === I18n.t('pages.staggeredProposal.filter.startDate')) {
        const openedDates = selectedDates[size === 2 ? size - 2 : size - 1].split(' - ')

        const [openedDayBegin, openedMonthBegin, openedYearBegin] =
          openedDates[0].split('/')
        const [openedDayEnd, openedMonthEnd, openedYearEnd] =
          openedDates[1].split('/')

        const openedDtBeginFormated = `${String(openedYearBegin)}/${String(
          openedMonthBegin
        )}/${String(openedDayBegin)}`
        const openedDtEndFormated = `${String(openedYearEnd)}/${String(
          openedMonthEnd
        )}/${String(openedDayEnd)}`

        setFilter((filter: any) => ({
          ...filter,
          'validityDateStart.dtBegin': openedDtBeginFormated,
          'validityDateStart.dtEnd': openedDtEndFormated
        }))
      }

      if (type[0] === I18n.t('pages.staggeredProposal.filter.endDate') || type[1] === I18n.t('pages.staggeredProposal.filter.endDate')) {
        const validateDates = selectedDates[size - 1].split(' - ')

        const [validateDayBegin, validateMonthBegin, validateYearBegin] =
          validateDates[0].split('/')
        const [validateDayEnd, validateMonthEnd, validateYearEnd] =
          validateDates[1].split('/')

        const validateDtBeginFormated = `${String(validateYearBegin)}/${String(
          validateMonthBegin
        )}/${String(validateDayBegin)}`
        const validateDtEndFormated = `${String(validateYearEnd)}/${String(
          validateMonthEnd
        )}/${String(validateDayEnd)}`

        setFilter((filter: any) => ({
          ...filter,
          'validityDateEnd.dtBegin': validateDtBeginFormated,
          'validityDateEnd.dtEnd': validateDtEndFormated
        }))
      }
    }
  }

  const findKeyFilter = (filterSelected: any, key: string): any => {
    for (const item of filterSelected) {
      if (item.filterName === key) {
        if (key === `${String(I18n.t('pages.tariff.orderSelectors.origin'))}/${String(I18n.t('pages.tariff.orderSelectors.destination'))}`) {
          return {
            pickerSelecteds1: item.pickerSelecteds1,
            pickerSelecteds2: item.pickerSelecteds2,
            pickerSelecteds3: item.pickerSelecteds3,
            pickerSelecteds4: item.pickerSelecteds4,
            pickerSelecteds5: item.pickerSelecteds5,
            pickerSelecteds6: item.pickerSelecteds6,
            radioButtonSelected: item.radioButtonSelected
          }
        }
        if (item.textFieldValueSelected !== '') {
          return item.textFieldValueSelected
        }
        if (
          item.pickerSelecteds1.length > 0 &&
          item.pickerSelecteds2.length === 0
        ) {
          return item.pickerSelecteds1
        }
        if (
          item.pickerSelecteds1.length === 0 &&
          item.pickerSelecteds2.length > 0
        ) {
          return item.pickerSelecteds2
        }
        if (
          item.pickerSelecteds1.length > 0 &&
          item.pickerSelecteds2.length > 0
        ) {
          return `${String(item.pickerSelecteds1)} / ${String(
            item.pickerSelecteds2
          )}`
        }
        if (item.checkBoxSelecteds1.length > 0) {
          return item.checkBoxSelecteds1
        }
        if (item.selectedDates.length > 0) {
          return item.selectedDates
        }
      }
    }
  }

  const menuItemsSelector = [
    {
      label: I18n.t('pages.staggeredProposal.filter.reference'),
      textField: I18n.t('pages.staggeredProposal.filter.reference')
    },
    {
      label: I18n.t('pages.staggeredProposal.filter.client'),
      pickerListOptions1: partnerSimpleNameList,
      pickerLabel1: I18n.t('pages.staggeredProposal.filter.client'),
      pickerLandLabels: []
    },
    {
      label: I18n.t('pages.staggeredProposal.filter.processType'),
      checkboxList1: [I18n.t('pages.staggeredProposal.filter.import'), I18n.t('pages.staggeredProposal.filter.export')]
    },
    {
      label: `${String(I18n.t('pages.tariff.orderSelectors.origin'))}/${String(I18n.t('pages.tariff.orderSelectors.destination'))}`,
      pickerListOptions1: getOriginDestinyList(),
      pickerListOptions2: getOriginDestinyList(),
      pickerLabel1: I18n.t('pages.tariff.orderSelectors.origin'),
      pickerLabel2: I18n.t('pages.tariff.orderSelectors.destination'),
      pickerLandLabels: []
    },
    {
      label: I18n.t('pages.staggeredProposal.filter.period'),
      checkboxList: [I18n.t('pages.staggeredProposal.filter.startDate'), I18n.t('pages.staggeredProposal.filter.endDate')],
      hasDatePicker: true,
      dateRanges: menuItems.dateRanges
    },
    {
      label: I18n.t('pages.staggeredProposal.filter.status'),
      checkboxList1: menuItems.statusTypes,
      pickerLabel1: I18n.t('pages.staggeredProposal.filter.status')
    },
    {
      label: I18n.t('pages.staggeredProposal.filter.responsible'),
      textField: I18n.t('pages.staggeredProposal.filter.responsible')
    }
  ]

  const handleChangeModal = (
    handleCleanAll: () => void,
    handleCleanButton: () => void,
    handlePickerChange1: (e: any, newValue: string[]) => void,
    handlePickerChange2: (e: any, newValue: string[]) => void,
    handlePickerChange3: (e: any, newValue: string[]) => void,
    handlePickerChange4: (e: any, newValue: string[]) => void,
    handlePickerChange5: (e: any, newValue: string[]) => void,
    handlePickerChange6: (e: any, newValue: string[]) => void
  ): void => {
    if (radioValue !== '') {
      handleCleanAll()
      handleCleanButton()
      handlePickerChange1(null, [])
      handlePickerChange2(null, [])
      handlePickerChange3(null, [])
      handlePickerChange4(null, [])
      handlePickerChange5(null, [])
      handlePickerChange6(null, [])
    }
  }

  const handleCleanModal = (handleCleanAll: () => void): void => {
    setRadioValue('')
    handleCleanAll()
  }

  return (
    <RowFilter
      addFilterLabel={I18n.t('pages.filter.addFilterLabel')}
      applyLabel={I18n.t('pages.filter.applyLabel')}
      approveLabel={I18n.t('pages.filter.approveLabel')}
      cleanLabel={I18n.t('pages.filter.cleanLabel')}
      handleClean={handleChangeModal}
      handleCleanRow={handleCleanModal}
      handleSelectedFilters={handleSelectedRowFilter}
      menuItemsSelector={menuItemsSelector}
      myFilterLabel={I18n.t('pages.filter.myFilterLabel')}
      setRadioValue={setRadioValue}
    />
  )
}

export default Filter
