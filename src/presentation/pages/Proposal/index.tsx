import React, { useEffect, useState } from 'react'
import {
  Button,
  Pagination,
  RowFilter,
  FloatingMenu
} from 'fiorde-fe-components'
import TableImpl from './TableImpl'
import { Breadcrumbs, Link, Select, MenuItem } from '@material-ui/core/'
import {
  ArrowIconContainer,
  BottomSideContainer,
  CloseExpirationContainer,
  DropdownMenuContainer,
  ExportListContainer,
  ExportListSpan,
  LeftSideListHeaderContainer,
  ListHeaderContainer,
  ListMainTitleSpan,
  ListTextSpan,
  OrderByContainer,
  PaginationContainer,
  PaginationMainContainer,
  RightSideListHeaderContainer,
  RootContainer,
  RowFilterContainer,
  TableContainer,
  TopButtonContainer,
  TopContainer,
  ButtonContainer
} from './style'
import ProposalDisplayModal from '../../components/ProposalDisplayModal/ProposalDisplayModal'
import { ExitToApp } from '@material-ui/icons/'
import Warning from '../../../application/icons/WarningIcon'
import { useHistory } from 'react-router-dom'
import UpArrow from '../../../application/icons/UpArrow'
import API from '../../../infrastructure/api'
import ArrowDown from '../../../application/icons/ArrowDown'
import { orderButtonMenuItems, menuItems } from './constants'
import { I18n } from 'react-redux-i18n'
import {
  StatusProposalEnum,
  StatusProposalStringEnum
} from '../../../application/enum/statusProposalEnum'
import RejectModal from '../../components/RejectModal/RejectModal'
import CancelModal from '../../components/CancelModal/CancelModal'
import { useQuery } from '@tanstack/react-query'
import { QueryKeys } from '../../../application/enum/queryKeys'

const defaultFilter = {
  direction: 'DESC',
  orderByList: 'openingDate',
  page: 0,
  size: 10
}

const Proposal = (): JSX.Element => {
  const [filter, setFilter] = useState<any>(defaultFilter)
  const [openReject, setOpenReject] = useState(false)
  const [openDisplay, setOpenDisplay] = useState(false)
  const [openCancel, setOpenCancel] = useState(false)
  const [reference, setReference] = useState('')
  const [proposalId, setProposalId] = useState('')
  const [incotermList, setIncotermList] = useState<any[]>([])
  const [openedOrderSelect, setOpenedOrderSelect] = useState(false)
  const [orderAsc, setOrderAsc] = useState(false)
  const [orderBy, setOrderBy] = useState<string>('openingDate')
  const [originDestinationList, setOriginDestinationList] = useState<any[]>([])
  const [originDestinationCountries, setoriginDestinationCountries] = useState<any[]>([])
  const [originDestinationStates, setoriginDestinationStates] = useState<any[]>([])
  const [originDestinationCities, setoriginDestinationCities] = useState<any[]>([])
  const [partnerList, setPartnerList] = useState<any[]>([])
  const [partnerSimpleNameList, setPartnerSimpleNameList] = useState<any[]>([])
  const [radioValue, setRadioValue] = useState('')

  const { data: {content: proposalList, totalElements: totalProposalList} = {content: [], totalElements: 0}, refetch } = 
    useQuery([QueryKeys.proposalList, filter], () => API.getProposals(filter))
  
  const { data: totalWarnings = 0, refetch: refetchCount } = 
    useQuery([QueryKeys.countProposal, filter], () => API.getCountProposal(filter))

  const history = useHistory()

  const floatingButtonMenuItems = [
    {
      label: 'Frete Internacional',
      // onClick: () => handleSave()
      // onClick: () => { }
      subMenuItems: [
        {
          label: 'Importação',
          onClick: () => {
            history.push({
              pathname: '/novaProposta',
              state: { proposalId: null }
            })
          }

        },
        {
          label: 'Exportação',
          onClick: () => {
            history.push({
              pathname: '/novaPropostaExportacao',
              state: { proposalId: null }
            })
          }
        }
      ]
    }
  ]

  useEffect(() => {
    const newIncotermList: any[] = []
    void (async function () {
      await API.getIncoterms()
        .then((response) => {
          response.forEach((item: any) => {
            newIncotermList.push(item?.id)
          })
          return setIncotermList(newIncotermList)
        })
        .catch((err) => console.log(err))
    })()
  }, [])

  useEffect(() => {
    const simpleNameList: any[] = []
    const newPartnerList: any[] = []
    void (async function () {
      await API.getPartner()
        .then((response) => {
          response.forEach((item: any) => {
            simpleNameList.push(item?.businessPartner?.simpleName)
            newPartnerList.push(item?.businessPartner)
          })
          setPartnerSimpleNameList(simpleNameList)
          setPartnerList(newPartnerList)
        })
        .catch((err) => console.log(err))
    })()
  }, [])

  useEffect(() => {
    void (async function () {
      await API.getOriginDestination()
        .then((response) => { setOriginDestinationList(response) })
        .catch((err) => console.log(err))
    })()
    void (async function () {
      await API.getCountries()
        .then((response) => setoriginDestinationCountries(response))
        .catch((err) => console.log(err))
    })()
    void (async function () {
      await API.getMercosulStates()
        .then((response) => setoriginDestinationStates(response))
        .catch((err) => console.log(err))
    })()
    void (async function () {
      await API.getMercosulCities()
        .then((response) => setoriginDestinationCities(response))
        .catch((err) => console.log(err))
    })()
  }, [])

  const getOriginDestinyList = (land: string): string[] => {
    const actualList: string[] = []
    let type = ''

    switch (radioValue) {
      case 'Aéreo':
        type = 'AEROPORTO'
        break
      case 'Marítimo':
        type = 'PORTO'
        break
      case 'Rodoviário':
        type = 'RODOVIARIO'
        break
      default:
        break
    }
    if (type !== 'RODOVIARIO') {
      originDestinationList?.forEach((item): void => {
        if (item.type === type) {
          actualList.push(`${String(item.id)} - ${String(item.name)}`)
        }
      })
    } else {
      if (land === 'País') {
        originDestinationCountries?.forEach((item): void => {
          actualList.push(`${String(item.name)}`)
        })
      }
      if (land === 'Estado') {
        originDestinationStates?.forEach((item): void => {
          actualList.push(`${String(item.txState)} (${String(item.txCountry)})`)
        })
      }
      if (land === 'Cidade') {
        originDestinationCities?.forEach((item): void => {
          actualList.push(`${String(item.txCity)} (${String(item.txCountry)})`)
        })
      }
    }
    return actualList
  }

  const getLandLabels = (): string[] => {
    let type = ''
    let landLabels: string[] = []
    switch (radioValue) {
      case 'Aéreo':
        type = 'AEROPORTO'
        break
      case 'Marítimo':
        type = 'PORTO'
        break
      case 'Rodoviário':
        type = 'RODOVIARIO'
        break
      default:
        break
    }

    if (type === 'RODOVIARIO') {
      landLabels = ['País', 'Estado', 'Cidade']
    }
    return landLabels
  }

  const verifyStatus = (status): any => {
    switch (status) {
      case 'Open':
        return StatusProposalEnum.ABERTA
      case 'Awaiting Customer Return':
        return StatusProposalEnum.AGUARDANDO_RETORNO_CLIENTE
      case 'Revision':
        return StatusProposalEnum.EM_REVISAO
      case 'Approved':
        return StatusProposalEnum.APROVADA
      case 'Discard':
        return StatusProposalEnum.REJEITADA
      case 'Canceled':
        return StatusProposalEnum.CANCELADA
      case 'Automatically Canceled':
        return StatusProposalEnum.CANCELAMENTO_AUTOMATICO
    }
  }

  const checkBusinessDays = (date): any => {
    const dateWeekday = date.getDay()
    switch (dateWeekday) {
      case 4:
        date.setDate(Number(date.getDate()) + 5)
        break
      case 5:
        date.setDate(Number(date.getDate()) + 5)
        break
      case 6:
        date.setDate(Number(date.getDate()) + 4)
        break
      default:
        date.setDate(Number(date.getDate()) + 3)
        break
    }
    return date
  }

  const verifyWarning = (status: string, validityDate: Date): boolean => {
    const warningDate = checkBusinessDays(new Date())

    let showWarning = false
    if (
      status !== 'Aprovada' &&
      status !== 'Rejeitada' &&
      status !== 'Cancelada' &&
      status !== 'Cancelamento Automático'
    ) {
      showWarning = validityDate <= warningDate || validityDate === warningDate
    }
    return showWarning
  }

  const verifyModal = (modal: string): string => {
    if (modal === 'AIR') {
      return 'aereo'
    } else if (modal === 'SEA') {
      return 'maritimo'
    } else {
      return 'rodoviario'
    }
  }

  const verifyType = (type: String): string => {
    if (type === 'IMPORT FREIGHT') {
      return 'importation'
    } else {
      return 'exportation'
    }
  }

  const getProposalItems = (proposalList): any => {
    const array: any = []
    for (const proposal of proposalList) {
      const opening = new Date(proposal.openingDate).toLocaleDateString('pt-BR')
      const shelfLife = new Date(proposal.validityDate).toLocaleDateString(
        'pt-BR'
      )
      const validityDate = new Date(proposal.validityDate)
      const showWarning = verifyWarning(proposal.status, validityDate)
      const status = verifyStatus(proposal.status)
      const modal = verifyModal(proposal.modal)
      const type = verifyType(proposal.operation)
      const item = {
        client: proposal.clientName,
        destination: proposal.modal === 'LAND' ? proposal.destinationCityName : proposal.destinationId,
        iconterm: proposal.incotermId,
        isLate: showWarning,
        key: proposal.idProposal,
        menuItems: menuItemsList(status, proposal.idProposal, proposal.reference, proposal.operation),
        modal,
        numio: proposal.numIO,
        opening,
        origin: proposal.modal === 'LAND' ? proposal.originCityName : proposal.originId,
        reference: proposal.reference,
        responsible: proposal.responsible,
        shelfLife,
        status,
        type,
        isClientReturnLate: proposal.overdueClientResponse
      }

      array.push(item)
    }
    return array
  }

  const setStatus = (id: any, status: string, reason?: string, detail?: string): void => {
    void (async function () {
      await API.putStatus(id, status, reason, detail)
        .then(() => {
          refetch()
          refetchCount()
        })
        .catch((err) => console.log(err))
    })()
  }

  const editEventPage = (id: any, operationType: any): void => {
    if (operationType === 'IMPORT FREIGHT') {
      history.push({
        pathname: '/novaProposta',
        state: { proposalId: id }
      })
    } else {
      history.push({
        pathname: '/novaPropostaExportacao',
        state: { proposalId: id }
      })
    }
  }

  const duplicateEventPage = (id: any, operationType: any): void => {
    if (operationType === 'IMPORT FREIGHT') {
      history.push({
        pathname: '/novaProposta',
        state: { proposalId: id, eventType: 'duplicate' }
      })
    } else {
      history.push({
        pathname: '/novaPropostaExportacao',
        state: { proposalId: id, eventType: 'duplicate' }
      })
    }
  }

  const menuItemsList = (status: any, id: any, ref: any, operationType: any): void => {
    const array: any = []
    switch (status) {
      case StatusProposalEnum.ABERTA:
        array.push(
          {
            iconType: 'edit',
            label: I18n.t('pages.proposal.table.editLabel'),
            onClick: () => {
              editEventPage(id, operationType)
            }
          },
          {
            iconType: 'duplicate',
            label: I18n.t('pages.proposal.table.duplicateLabel'),
            onClick: () => {
              duplicateEventPage(id, operationType)
            }
          },
          {
            iconType: 'forward',
            label: I18n.t('pages.proposal.table.confirmLabel'),
            onClick: () => {
              setStatus(id, StatusProposalStringEnum.AGUARDANDO_RETORNO_CLIENTE)
            }
          },
          {
            iconType: 'cancel',
            label: I18n.t('pages.proposal.table.cancelLabel'),
            onClick: () => {
              setOpenCancel(true)
              setReference(ref)
              setProposalId(id)
            }
          }
        )
        return array
      case StatusProposalEnum.AGUARDANDO_RETORNO_CLIENTE:
        array.push(
          {
            iconType: 'file',
            label: I18n.t('pages.proposal.table.viewDownload'),
            onClick: () => {
              setOpenDisplay(true)
              setProposalId(id)
            }
          },
          {
            iconType: 'duplicate',
            label: I18n.t('pages.proposal.table.duplicateLabel'),
            onClick: () => {
              duplicateEventPage(id, operationType)
            }
          },
          {
            iconType: 'fileReview',
            label: I18n.t('pages.proposal.table.reviewLabel'),
            onClick: () => {
              setStatus(id, StatusProposalStringEnum.EM_REVISAO)
            }
          },
          {
            iconType: 'cancel',
            label: I18n.t('pages.proposal.table.cancelLabel'),
            onClick: () => {
              setOpenCancel(true)
              setReference(ref)
              setProposalId(id)
            }
          },
          {
            iconType: 'thumbsUp',
            label: I18n.t('pages.proposal.table.approveLabel'),
            onClick: () => {
              setStatus(id, StatusProposalStringEnum.APROVADA)
            }
          },
          {
            iconType: 'thumbsDown',
            label: I18n.t('pages.proposal.table.rejectLabel'),
            onClick: () => {
              setOpenReject(true)
              setReference(ref)
              setProposalId(id)
            }
          }
        )
        return array
      case StatusProposalEnum.EM_REVISAO:
        array.push(
          {
            iconType: 'edit',
            label: I18n.t('pages.proposal.table.editLabel'),
            onClick: () => {
              editEventPage(id, operationType)
            }
          },
          {
            iconType: 'duplicate',
            label: I18n.t('pages.proposal.table.duplicateLabel'),
            onClick: () => {
              duplicateEventPage(id, operationType)
            }
          },
          {
            iconType: 'forward',
            label: I18n.t('pages.proposal.table.confirmLabel'),
            onClick: () => {
              setStatus(id, StatusProposalStringEnum.AGUARDANDO_RETORNO_CLIENTE)
            }
          },
          {
            iconType: 'cancel',
            label: I18n.t('pages.proposal.table.cancelLabel'),
            onClick: () => {
              setOpenCancel(true)
              setReference(ref)
              setProposalId(id)
            }
          }
        )
        return array
      case StatusProposalEnum.APROVADA:
        array.push(
          {
            iconType: 'file',
            label: I18n.t('pages.proposal.table.viewDownload'),
            onClick: () => {
              setOpenDisplay(true)
              setProposalId(id)
            }
          },
          {
            iconType: 'duplicate',
            label: I18n.t('pages.proposal.table.duplicateLabel'),
            onClick: () => {
              duplicateEventPage(id, operationType)
            }
          })
        return array
      case StatusProposalEnum.REJEITADA:
      case StatusProposalEnum.CANCELADA:
        array.push({
          iconType: 'duplicate',
          label: I18n.t('pages.proposal.table.duplicateLabel'),
          onClick: () => {
            duplicateEventPage(id, operationType)
          }
        })
        return array
      default:
        array.push({
          iconType: 'duplicate',
          label: I18n.t('pages.proposal.table.duplicateLabel'),
          onClick: () => {
            duplicateEventPage(id, operationType)
          }
        })
        return array
    }
  }

  const handleExportList = (): void => {}

  const handleSelectedRowFilter = (selectedFiltersRowFilter: any): void => {
    cleanFilter()

    const selectedProposals = findKeyFilter(
      selectedFiltersRowFilter,
      'Ref. proposta'
    )
    if (selectedProposals !== undefined) {
      setFilter((filter: any) => ({
        ...filter,
        referenceProposal: [selectedProposals]
      }))
    }

    const selectedClients = findKeyFilter(selectedFiltersRowFilter, 'Cliente')
    if (selectedClients !== undefined) {
      const clientIds: any = []
      selectedClients.forEach(name => {
        const client = partnerList.find(item => item.simpleName === name)
        clientIds.push(client.id)
      })

      setFilter((filter: any) => ({
        ...filter,
        customer: [clientIds]
      }))
    }

    const selectedProcessTypes = findKeyFilter(
      selectedFiltersRowFilter,
      'Tipo de processo'
    )
    if (selectedProcessTypes !== undefined) {
      const processTypes = selectedProcessTypes.map((type: string) => type === 'Frete - Importação' ? 'IMPORT FREIGHT' : 'EXPORT FREIGHT')
      setFilter((filter: any) => ({
        ...filter,
        operationType: [processTypes]
      }))
    }

    const selectedOriginsDestinations = findKeyFilter(
      selectedFiltersRowFilter,
      'Modal/Origem/Destino'
    )
    if (selectedOriginsDestinations !== undefined) {
      const modal: string = selectedOriginsDestinations.radioButtonSelected
      const getModalName = (): string => {
        switch (modal) {
          case 'Aéreo':
            return 'AIR'
          case 'Marítimo':
            return 'SEA'
          case 'Rodoviário':
            return 'LAND'
          default:
            return ''
        }
      }

      if (modal.length > 0 && modal !== 'Rodoviário') {
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
        setFilter((filter: any) => ({
          ...filter,
          idTransport: getModalName()
        }))
      }

      if (modal.length > 0 && modal === 'Rodoviário') {
        const originCountry = selectedOriginsDestinations.pickerSelecteds1
          .map((locationFiltered: string) => originDestinationCountries
            .find((country) => country.name === locationFiltered)?.id)

        const destinationCountry = selectedOriginsDestinations.pickerSelecteds2
          .map((locationFiltered: string) => originDestinationCountries
            .find((country) => country.name === locationFiltered)?.id)

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
        setFilter((filter: any) => ({
          ...filter,
          idTransport: getModalName()
        }))
      }
    }

    const selectedIncoterms = findKeyFilter(
      selectedFiltersRowFilter,
      'Incoterm'
    )
    if (selectedIncoterms !== undefined) {
      setFilter((filter: any) => ({
        ...filter,
        idIncoterm: [selectedIncoterms]
      }))
    }

    const selectedStatus = findKeyFilter(
      selectedFiltersRowFilter,
      'Status'
    )
    if (selectedStatus !== undefined) {
      const statusList: string[] = selectedStatus.map((status: string): string => {
        switch (status) {
          case 'Aberta':
            return StatusProposalStringEnum.ABERTA
          case 'Ag. Retorno Cliente':
            return StatusProposalStringEnum.AGUARDANDO_RETORNO_CLIENTE
          case 'Em Revisão':
            return StatusProposalStringEnum.EM_REVISAO
          case 'Aprovada':
            return StatusProposalStringEnum.APROVADA
          case 'Rejeitada':
            return StatusProposalStringEnum.REJEITADA
          case 'Cancelada':
            return StatusProposalStringEnum.CANCELADA
          case 'Cancelamento Automatico':
            return StatusProposalStringEnum.CANCELAMENTO_AUTOMATICO
          default:
            return ''
        }
      })
      setFilter((filter: any) => ({
        ...filter,
        status: [statusList]
      }))
    }

    const selectedDates = findKeyFilter(selectedFiltersRowFilter, 'Período')
    if (selectedDates !== undefined) {
      const type = selectedFiltersRowFilter[5].checkBoxSelecteds
      const size = selectedDates.length

      if (type[0] === 'Dt. Abertura') {
        const openedDates = selectedDates[size - 1].split(' - ')

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
          'openingDate.dtBegin': openedDtBeginFormated,
          'openingDate.dtEnd': openedDtEndFormated
        }))
      }

      if (type[0] === 'Dt. Validade' || type[1] === 'Dt. Validade') {
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
          'validityDate.dtBegin': validateDtBeginFormated,
          'validityDate.dtEnd': validateDtEndFormated
        }))
      }
    }
  }

  const findKeyFilter = (filterSelected: any, key: string): any => {
    for (const item of filterSelected) {
      if (item.filterName === key) {
        if (key === 'Modal/Origem/Destino') {
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

  const cleanFilter = (): void => {
    delete filter.referenceProposal
    delete filter.idBusinessPartnerCustomer
    delete filter.operationType
    delete filter.idOrigin
    delete filter.idDestination
    delete filter.idIncoterm
    delete filter.idTransport
    delete filter.status
    delete filter['openingDate.dtBegin']
    delete filter['openingDate.dtEnd']
    delete filter['validityDate.dtBegin']
    delete filter['validityDate.dtEnd']

    setFilter(() => ({
      direction: 'DESC',
      orderByList: 'openingDate',
      page: 0,
      size: 10
    }))
  }

  const handleOrderSelect = (value: React.SetStateAction<string>): void => {
    setFilter((filter: any) => ({ ...filter, orderByList: value }))
    setOrderBy(value)
  }

  const handleOrderDirection = (): void => {
    if (orderAsc) {
      setFilter((filter: any) => ({ ...filter, direction: 'DESC' }))
      setOrderAsc(false)
    } else {
      setFilter((filter: any) => ({ ...filter, direction: 'ASC' }))
      setOrderAsc(true)
    }
  }

  const menuItemsSelector = [
    {
      label: 'Ref. proposta',
      textField: 'Ref. proposta'
    },
    {
      label: 'Cliente',
      pickerListOptions1: partnerSimpleNameList,
      pickerLabel1: 'Cliente',
      pickerLandLabels: []
    },
    {
      label: 'Tipo de processo',
      checkboxList1: menuItems.processTypes
    },
    {
      label: 'Modal/Origem/Destino',
      radioButtonList: menuItems.modal,
      pickerListOptions1: getOriginDestinyList('País'),
      pickerListOptions2: getOriginDestinyList('Estado'),
      pickerListOptions3: getOriginDestinyList('Cidade'),
      pickerLabel1: 'Origem',
      pickerLabel2: 'Destino',
      title1: 'Modal',
      pickerLandLabels: getLandLabels()

    },
    {
      label: 'Incoterm',
      pickerListOptions1: incotermList,
      pickerLabel1: 'Incoterm',
      pickerLandLabels: []
    },
    {
      label: 'Período',
      checkboxList: ['Dt. Abertura', 'Dt. Validade'],
      hasDatePicker: true,
      dateRanges: menuItems.dateRanges
    },
    {
      label: 'Status',
      checkboxList1: menuItems.statusTypes,
      pickerLabel1: 'Status'
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

  const showMsgTotalResult = (): string => {
    const keys = Object.keys(filter)

    /* eslint-disable no-prototype-builtins */
    const direction = filter.hasOwnProperty('direction')
    const orderByList = filter.hasOwnProperty('orderByList')
    const page = filter.hasOwnProperty('page')
    const size = filter.hasOwnProperty('size')

    if (
      keys.length === 4 &&
      Boolean(page) &&
      Boolean(size) &&
      Boolean(direction) &&
      Boolean(orderByList)
    ) {
      return `Propostas (${totalProposalList}) - Últimos 30 dias`
    }
    return `Resultado do filtro (${totalProposalList})`
  }
  const handleCloseReject = (): void => {
    setOpenReject(false)
    setReference('')
    setProposalId('')
  }

  const handleCloseDisplay = (): void => {
    setOpenDisplay(false)
    setProposalId('')
  }

  const handleCloseCancel = (): void => {
    setOpenCancel(false)
    setReference('')
    setProposalId('')
  }

  return (
    <RootContainer>
      <TopContainer>
        <Breadcrumbs separator=">" aria-label="breadcrumb">
          <Link
            color="inherit"
            onClick={() => history.push('/')}
            className="breadcrumbInitial"
            style={{ cursor: 'pointer' }}
          >
            Home
          </Link>
          <span className="breadcrumbEnd">Propostas</span>
        </Breadcrumbs>
        <TopButtonContainer>
          <ButtonContainer>
            <Button
              disabled={false}
              text={'Criar nova proposta...'}
              tooltip={'Criar nova proposta'}
              backgroundGreen={true}
              icon="arrow"
              onAction={() => { }}
              popover
              position="right"

              // icon="add"
              // onAction={() =>
              //   history.push({
              //     pathname: '/novaProposta',
              //     state: { proposalId: null }
              //   })
              // }
              >
              <FloatingMenu menuItems={floatingButtonMenuItems} />
            </Button>
          </ButtonContainer>
        </TopButtonContainer>
      </TopContainer>
      <RowFilterContainer>
        <RowFilter
          addFilterLabel="Filtros avançados"
          applyLabel="Aplicar"
          approveLabel="Salvar Filtro"
          cleanLabel="Limpar"
          handleClean={handleChangeModal}
          handleCleanRow={handleCleanModal}
          handleSelectedFilters={handleSelectedRowFilter}
          menuItemsSelector={menuItemsSelector}
          myFilterLabel="Meus Filtros"
          setRadioValue={setRadioValue}
        />
      </RowFilterContainer>
      <ListHeaderContainer>
        <LeftSideListHeaderContainer>
          <ListMainTitleSpan>{showMsgTotalResult()}</ListMainTitleSpan>
          <ExportListContainer onClick={handleExportList}>
            <ExitToApp />
            <ExportListSpan>Exportar lista</ExportListSpan>
          </ExportListContainer>
        </LeftSideListHeaderContainer>
        <RightSideListHeaderContainer>
          <CloseExpirationContainer>
            <Warning />
            <ListTextSpan>{totalWarnings} com vencimento proximo</ListTextSpan>
          </CloseExpirationContainer>
          <OrderByContainer>
            <ListTextSpan>Ordenar:</ListTextSpan>
            <DropdownMenuContainer showArrow={openedOrderSelect}>
              <Select
                className="select-style"
                disableUnderline
                onChange={(e) => handleOrderSelect(String(e.target.value))}
                onOpen={() => setOpenedOrderSelect(!openedOrderSelect)}
                placeholder={orderBy}
                value={orderBy}
              >
                {orderButtonMenuItems.map((item) => (
                  <MenuItem
                    key={`${String(item.value)}_key`}
                    value={item.value}
                  >
                    <span>{item.description}</span>
                  </MenuItem>
                ))}
              </Select>
            </DropdownMenuContainer>
            <ArrowIconContainer
              onClick={handleOrderDirection}
              $rotate={orderAsc}
            >
              {orderAsc ? <ArrowDown /> : <UpArrow />}
            </ArrowIconContainer>
          </OrderByContainer>
        </RightSideListHeaderContainer>
      </ListHeaderContainer>
      <BottomSideContainer>
        <TableContainer>
          <TableImpl
            rows={getProposalItems(proposalList)}
            />
            <RejectModal
              open={openReject}
              setClose={handleCloseReject}
              title={I18n.t('components.rejectModal.title')}
              reference={reference}
              proposalId={proposalId}
              setStatus={setStatus}
              detailed={true}
            />
            <CancelModal
              open={openCancel}
              setClose={handleCloseCancel}
              reference={reference}
              proposalId={proposalId}
              setStatus={setStatus}
            />
            <ProposalDisplayModal
              open={openDisplay}
              setClose={handleCloseDisplay}
              idProposal={proposalId}
              downloadProposal={API.downloadProposal}
            />
        </TableContainer>
        <PaginationContainer>
          <PaginationMainContainer>
            <Pagination
              count={totalProposalList}
              labelDisplay="exibindo"
              labelDisplayedRows="de"
              labelRowsPerPage="Propostas por página"
              onPageChange={(value) =>
                setFilter((filter: any) => ({ ...filter, page: value }))
              }
              onRowsPerPageChange={(value) =>
                setFilter((filter: any) => ({
                  ...filter,
                  size: value,
                  page: 0
                }))
              }
              tooltipBack="Anterior"
              tooltipFirst="Primeira"
              tooltipLast="Última"
              tooltipNext="Próxima"
            />
          </PaginationMainContainer>
        </PaginationContainer>
      </BottomSideContainer>
    </RootContainer>
  )
}

export default Proposal
