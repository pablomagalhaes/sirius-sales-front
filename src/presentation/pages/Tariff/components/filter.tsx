import React, { useState, useContext } from 'react'
import { RowFilter } from 'fiorde-fe-components'

import { I18n } from 'react-redux-i18n'
import { ModalTypes, OriginDestinyTypes, AcitivityTypes } from '../../../../application/enum/enum'
import {
  useCurrencies,
  useOriginDestination,
  usePartnerList,
  useMercosulCountries,
  useMercosulCities,
  useMercosulStates,
  useBusinessPartnerByType
} from '../../../hooks'
import { TariffContext } from '../context/TariffContext'

interface FilterProps {
  cleanFilter: () => void
}

const Filter = ({
  cleanFilter
}: FilterProps): JSX.Element => {
  const { data: currencyList = [] } = useCurrencies()
  const { data: originDestinationList = [] } = useOriginDestination()
  const { partnerList, partnerSimpleNameList } = usePartnerList()
  const { data: originDestinationCountries = [] } = useMercosulCountries()
  const { data: originDestinationStates = [] } = useMercosulStates()
  const { data: originDestinationCities = [] } = useMercosulCities()
  const { seaPartners, airPartners, landPartners } = useBusinessPartnerByType()
  const { filter, setFilter }: any = useContext(TariffContext)
  const [radioValue, setRadioValue] = useState('')

  const getBusinessPartner = (): any[] => {
    switch (filter.tariffModalType) {
      case ModalTypes.Air:
        return airPartners
      case ModalTypes.Land:
        return landPartners
      case ModalTypes.Sea:
        return seaPartners
    }
    return []
  }

  const getOriginDestinyList = (land: string): string[] => {
    const actualList: string[] = []
    let type = ''

    switch (filter.tariffModalType) {
      case ModalTypes.Air:
        type = OriginDestinyTypes.Airport
        break
      case ModalTypes.Sea:
        type = OriginDestinyTypes.Seaport
        break
      case ModalTypes.Land:
        type = OriginDestinyTypes.Landport
        break
      default:
        break
    }
    if (type !== OriginDestinyTypes.Landport) {
      originDestinationList?.forEach((item): void => {
        if (item.type === type) {
          actualList.push(`${String(item.id)} - ${String(item.name)}`)
        }
      })
    } else {
      if (land === OriginDestinyTypes.Country) {
        originDestinationCountries?.forEach((item): void => {
          actualList.push(`${String(item.name)}`)
        })
      }
      if (land === OriginDestinyTypes.State) {
        originDestinationStates?.forEach((item): void => {
          actualList.push(`${String(item.txState)} (${String(item.txCountry)})`)
        })
      }
      if (land === OriginDestinyTypes.City) {
        originDestinationCities?.forEach((item): void => {
          actualList.push(`${String(item.txCity)} (${String(item.txCountry)})`)
        })
      }
    }
    return actualList
  }

  const getLandLabels = (): string[] => {
    let landLabels: string[] = []
    if (filter.tariffModalType === ModalTypes.Land) {
      landLabels = [OriginDestinyTypes.Country, OriginDestinyTypes.State, OriginDestinyTypes.City]
    }
    return landLabels
  }

  const handleSelectedRowFilter = (selectedFiltersRowFilter: any): void => {
    cleanFilter()

    const selectedAgents = findKeyFilter(
      selectedFiltersRowFilter,
      I18n.t('pages.tariff.menuItemsSelector.agent')
    )
    if (selectedAgents !== undefined) {
      const agentIds: any = []
      selectedAgents.forEach(name => {
        const agent = partnerList.find(item => item.simpleName === name)
        agentIds.push(agent.id)
      })
      setFilter((filter: any) => ({
        ...filter,
        idBusinessPartnerAgent: [agentIds]
      }))
    }

    const selectedShippingCompany =
      findKeyFilter(selectedFiltersRowFilter, I18n.t(`pages.tariff.companyLabels.${String(filter.tariffModalType)}`))
    if (selectedShippingCompany !== undefined) {
      const shippingCompanyId: any = []
      selectedShippingCompany.forEach(name => {
        const client = getBusinessPartner().find(item => item.businessPartner.simpleName === name)
        shippingCompanyId.push(client.id)
      })

      setFilter((filter: any) => ({
        ...filter,
        idBusinessPartnerTransporter: [shippingCompanyId]
      }))
    }

    const selectedCurrencies = findKeyFilter(
      selectedFiltersRowFilter,
      I18n.t('pages.tariff.menuItemsSelector.currency')
    )
    if (selectedCurrencies !== undefined) {
      setFilter((filter: any) => ({
        ...filter,
        idCurrency: [selectedCurrencies]
      }))
    }

    const selectedOriginsDestinations = findKeyFilter(
      selectedFiltersRowFilter,
      `${String(I18n.t('pages.tariff.orderSelectors.origin'))}/${String(I18n.t('pages.tariff.orderSelectors.destination'))}`
    )
    if (selectedOriginsDestinations !== undefined) {
      const modal: string = filter.tariffModalType
      if (modal.length > 0 && modal !== ModalTypes.Land) {
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

      if (modal.length > 0 && modal === ModalTypes.Land) {
        const originCountry = selectedOriginsDestinations.pickerSelecteds1
          .map((locationFiltered: string) => originDestinationCountries
            .find((country) => country.name === locationFiltered)?.id)
          .map((id: string) => Number(id))

        const destinationCountry = selectedOriginsDestinations.pickerSelecteds2
          .map((locationFiltered: string) => originDestinationCountries
            .find((country) => country.name === locationFiltered)?.id)
          .map((id: string) => Number(id))

        const originState = selectedOriginsDestinations.pickerSelecteds3
          .map((locationFiltered: string) => originDestinationStates
            .find((state) => state.txState === locationFiltered.split(' (')[0] && state.txCountry === locationFiltered.split(' (')[1].slice(0, -1))?.idState)

        const destinationState = selectedOriginsDestinations.pickerSelecteds4
          .map((locationFiltered: string) => originDestinationStates
            .find((state) => state.txState === locationFiltered.split(' (')[0] && state.txCountry === locationFiltered.split(' (')[1].slice(0, -1))?.idState)

        const originCity = selectedOriginsDestinations.pickerSelecteds5
          .map((locationFiltered: string) => originDestinationCities
            .find((city) => city.txCity === locationFiltered.split(' (')[0] && city.txCountry === locationFiltered.split(' (')[1].slice(0, -1))?.idCity)

        const destinationCity = selectedOriginsDestinations.pickerSelecteds6
          .map((locationFiltered: string) => originDestinationCities
            .find((city) => city.txCity === locationFiltered.split(' (')[0] && city.txCountry === locationFiltered.split(' (')[1].slice(0, -1))?.idCity)

        if (originCountry.length > 0 && originCountry[0] !== undefined) {
          setFilter((filter: any) => ({
            ...filter,
            originCountry
          }))
        }
        if (destinationCountry.length > 0 && destinationCountry[0] !== undefined) {
          setFilter((filter: any) => ({
            ...filter,
            destinationCountry
          }))
        }
        if (originState.length > 0 && originState[0] !== undefined) {
          setFilter((filter: any) => ({
            ...filter,
            originState
          }))
        }
        if (destinationState.length > 0 && destinationState[0] !== undefined) {
          setFilter((filter: any) => ({
            ...filter,
            destinationState
          }))
        }
        if (originCity.length > 0 && originCity[0] !== undefined) {
          setFilter((filter: any) => ({
            ...filter,
            originCity
          }))
        }
        if (destinationCity.length > 0 && destinationCity[0] !== undefined) {
          setFilter((filter: any) => ({
            ...filter,
            destinationCity
          }))
        }
      }
    }

    const selectedTransitTime = findKeyFilter(
      selectedFiltersRowFilter,
      I18n.t('pages.tariff.menuItemsSelector.transitTime')
    )
    if (selectedTransitTime !== undefined) {
      setFilter((filter: any) => ({
        ...filter,
        transitTime: selectedTransitTime
      }))
    }

    const selectedFrequencies = findKeyFilter(
      selectedFiltersRowFilter,
      I18n.t('pages.tariff.menuItemsSelector.frequency')
    )

    if (selectedFrequencies !== undefined) {
      const frequencyIds: number[] = []
      selectedFrequencies.forEach((selectedFrequency) => {
        switch (selectedFrequency) {
          case I18n.t('pages.tariff.constants.frequency.daily'):
            frequencyIds.push(1)
            break
          case I18n.t('pages.tariff.constants.frequency.weekly'):
            frequencyIds.push(2)
            break
          case I18n.t('pages.tariff.constants.frequency.biweekly'):
            frequencyIds.push(3)
            break
          case I18n.t('pages.tariff.constants.frequency.monthly'):
            frequencyIds.push(4)
            break
          default:
            break
        }
      })
      setFilter((filter: any) => ({
        ...filter,
        idFrequency: [frequencyIds]
      }))
    }

    // const selectedDates = findKeyFilter(selectedFiltersRowFilter, 'Validade')
    // if (selectedDates !== undefined) {
    //   const type = selectedFiltersRowFilter[6].checkBoxSelecteds
    //   const size = selectedDates.length

    //   if (type[0] === 'Dt. Abertura') {
    //     const openedDates = selectedDates[size - 1].split(' - ')

    //     const [openedDayBegin, openedMonthBegin, openedYearBegin] =
    //       openedDates[0].split('/')
    //     const [openedDayEnd, openedMonthEnd, openedYearEnd] =
    //       openedDates[1].split('/')

    //     const openedDtBeginFormated = `${String(openedYearBegin)}/${String(
    //       openedMonthBegin
    //     )}/${String(openedDayBegin)}`
    //     const openedDtEndFormated = `${String(openedYearEnd)}/${String(
    //       openedMonthEnd
    //     )}/${String(openedDayEnd)}`

    //     setFilter((filter: any) => ({
    //       ...filter,
    //       'openingDate.dtBegin': openedDtBeginFormated,
    //       'openingDate.dtEnd': openedDtEndFormated
    //     }))
    //   }

    //   if (type[0] === 'Dt. Validade' || type[1] === 'Dt. Validade') {
    //     const validateDates = selectedDates[size - 1].split(' - ')

    //     const [validateDayBegin, validateMonthBegin, validateYearBegin] =
    //       validateDates[0].split('/')
    //     const [validateDayEnd, validateMonthEnd, validateYearEnd] =
    //       validateDates[1].split('/')

    //     const validateDtBeginFormated = `${String(validateYearBegin)}/${String(
    //       validateMonthBegin
    //     )}/${String(validateDayBegin)}`
    //     const validateDtEndFormated = `${String(validateYearEnd)}/${String(
    //       validateMonthEnd
    //     )}/${String(validateDayEnd)}`

    //     setFilter((filter: any) => ({
    //       ...filter,
    //       'validityDate.dtBegin': validateDtBeginFormated,
    //       'validityDate.dtEnd': validateDtEndFormated
    //     }))
    //   }
    // }
    const selectedEspecifications = findKeyFilter(
      selectedFiltersRowFilter,
      I18n.t('pages.tariff.menuItemsSelector.specification')
    )
    if (selectedEspecifications !== undefined) {
      setFilter((filter: any) => ({
        ...filter,
        txChargeType: [selectedEspecifications]
      }))
    }
  }

  const findKeyFilter = (filterSelected: any, key: string): any => {
    for (const item of filterSelected) {
      if (item.filterName === key) {
        if (key === 'Origem/Destino') {
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
      label: I18n.t(`pages.tariff.companyLabels.${String(filter.tariffModalType)}`),
      pickerListOptions1: getBusinessPartner().map(
        (item) => item.businessPartner.simpleName
      ),
      pickerLabel1: I18n.t(`pages.tariff.companyLabels.${String(filter.tariffModalType)}`),
      pickerLandLabels: []
    },
    {
      label: `${String(I18n.t('pages.tariff.orderSelectors.origin'))}/${String(I18n.t('pages.tariff.orderSelectors.destination'))}`,
      pickerListOptions1: getOriginDestinyList(OriginDestinyTypes.Country),
      pickerListOptions2: getOriginDestinyList(OriginDestinyTypes.State),
      pickerListOptions3: getOriginDestinyList(OriginDestinyTypes.City),
      pickerLabel1: I18n.t('pages.tariff.orderSelectors.origin'),
      pickerLabel2: I18n.t('pages.tariff.orderSelectors.destination'),
      pickerLandLabels: getLandLabels()

    },
    {
      label: I18n.t('pages.tariff.menuItemsSelector.currency'),
      pickerListOptions1: currencyList.map((option) => option.id),
      pickerLabel1: I18n.t('pages.tariff.menuItemsSelector.currency'),
      pickerLandLabels: []
    },
    {
      label: I18n.t('pages.tariff.menuItemsSelector.transitTime'),
      textField: I18n.t('pages.tariff.menuItemsSelector.transitTime')
    },
    {
      label: I18n.t('pages.tariff.menuItemsSelector.frequency'),
      pickerListOptions1: [
        I18n.t('pages.tariff.constants.frequency.daily'),
        I18n.t('pages.tariff.constants.frequency.weekly'),
        I18n.t('pages.tariff.constants.frequency.biweekly'),
        I18n.t('pages.tariff.constants.frequency.monthly')
      ],
      pickerLabel1: I18n.t('pages.tariff.menuItemsSelector.frequency'),
      pickerLandLabels: []
    }
    // {
    //   label: 'Validade',
    //   checkboxList: ['Dt. Validade'],
    //   hasDatePicker: true,
    //   dateRanges: menuItems.dateRanges
    // }
  ]

  const specification = {
    label: I18n.t('pages.tariff.menuItemsSelector.specification'),
    pickerListOptions1: ['FCL', 'LCL', 'Break Bulk', 'Ro-Ro'],
    pickerLabel1: I18n.t('pages.tariff.menuItemsSelector.specification'),
    pickerLandLabels: []
  }

  const agent = {
    label: I18n.t('pages.tariff.menuItemsSelector.agent'),
    pickerListOptions1: partnerSimpleNameList,
    pickerLabel1: I18n.t('pages.tariff.menuItemsSelector.agent'),
    pickerLandLabels: []
  }

  const createMenuItems = (): any => {
    if (filter.tariffModalType === ModalTypes.Sea && filter.tariffType === AcitivityTypes.Import) return [agent, ...menuItemsSelector, specification]
    else if (filter.tariffType === AcitivityTypes.Import) return [agent, ...menuItemsSelector]
    else if (filter.tariffModalType === ModalTypes.Sea && filter.tariffType === AcitivityTypes.Export) return [...menuItemsSelector, specification]
    else return [...menuItemsSelector]
  }

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
      menuItemsSelector={createMenuItems()}
      myFilterLabel={I18n.t('pages.filter.myFilterLabel')}
      setRadioValue={setRadioValue}
    />
  )
}

export default Filter
