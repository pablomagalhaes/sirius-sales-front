import React, { useEffect, useState, useContext } from 'react'
import {
  Button,
  Pagination
} from 'fiorde-fe-components'
import TableImpl from './TableImpl'
import { Breadcrumbs, Link, Select, MenuItem } from '@material-ui/core/'
import {
  ArrowIconContainer,
  BottomSideContainer,
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
import { useHistory } from 'react-router-dom'
import UpArrow from '../../../application/icons/UpArrow'
import API from '../../../infrastructure/api'
import ArrowDown from '../../../application/icons/ArrowDown'
import { orderButtonMenuItems } from './constants'
import { I18n } from 'react-redux-i18n'
import {
  StatusProposalEnum,
  StatusProposalStringEnum
} from '../../../application/enum/statusProposalEnum'
import RejectModal from '../../components/RejectModal/RejectModal'
import Filter from './components/filter'
import { SelectorsValuesTypes } from '../../../application/enum/tariffEnum'
import { StaggeredProposalContext } from './context/StaggeredProposalContext'
import useTariffProposal from '../../hooks/tariff/useTariffProposal'

const Proposal = (): JSX.Element => {
  const { filter, setFilter }: any = useContext(StaggeredProposalContext)
  const { content: proposalList, totalElements: totalProposalList, setParams, refetch } = useTariffProposal()
  const [openReject, setOpenReject] = useState(false)
  const [openDisplay, setOpenDisplay] = useState(false)
  const [reference, setReference] = useState('')
  const [proposalId, setProposalId] = useState('')
  const [orderAsc, setOrderAsc] = useState(true)
  const [orderBy, setOrderBy] = useState<string>(SelectorsValuesTypes.Validity)

  const history = useHistory()

  useEffect(() => {
    setParams(filter)
  }, [])

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
      const validityDateEnd = new Date(proposal.validityDateEnd).toLocaleDateString('pt-BR')
      const validityDateStart = new Date(proposal.validityDateStart).toLocaleDateString('pt-BR')
      const status = verifyStatus(proposal.nmTariffProposalStatus)
      const type = verifyType(proposal.txTariffType)
      const item = {
        nmBusinessPartnerCustomer: proposal.nmBusinessPartnerCustomer,
        referenceTariffProposal: proposal.referenceTariffProposal,
        key: proposal.referenceTariffProposal,
        validityDateEnd,
        validityDateStart,
        menuItems: menuItemsList(status, proposal.idProposal, proposal.reference, proposal.operation),
        responsible: proposal.userCreationName,
        status,
        type,
        isClientReturnLate: false
      }
      array.push(item)
    }
    return array
  }

  const setStatus = (id: any, status: string, reason?: string): void => {
    void (async function () {
      await API.putStatus(id, status, reason)
        .then(() => {
          refetch()
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
              setStatus(id, StatusProposalStringEnum.CANCELADA)
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
              setStatus(id, StatusProposalStringEnum.CANCELADA)
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
              setStatus(id, StatusProposalStringEnum.CANCELADA)
            }
          }
        )
        return array
      case StatusProposalEnum.APROVADA:
        array.push(
          {
            iconType: 'file',
            label: I18n.t('pages.proposal.table.viewDownload'),
            onClick: () => { }
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
      direction: 'ASC',
      orderByList: 'openingDate',
      page: 0,
      size: 10
    }))
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
      return `${I18n.t('pages.tariff.titles.StaggeredProposal')} (${totalProposalList}) - ${I18n.t('pages.tariff.mainPage.last30days')}`
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
            {I18n.t('pages.tariff.mainPage.home')}
          </Link>
          <span>{I18n.t('pages.tariff.mainPage.tariff')}</span>
          <span className="breadcrumbEnd">{I18n.t('pages.tariff.titles.StaggeredProposal')}</span>
        </Breadcrumbs>
        <TopButtonContainer>
          <ButtonContainer>
            <Button
              disabled={false}
              text={I18n.t('pages.staggeredProposal.workStation.buttonLabel')}
              tooltip={I18n.t('pages.staggeredProposal.workStation.buttonLabel')}
              backgroundGreen={true}
              icon="add"
              onAction={() => { }}
              position="left"
              />
          </ButtonContainer>
        </TopButtonContainer>
      </TopContainer>
      <RowFilterContainer>
        <Filter
          cleanFilter={cleanFilter}
        />
      </RowFilterContainer>
      <ListHeaderContainer>
        <LeftSideListHeaderContainer>
          <ListMainTitleSpan>{showMsgTotalResult()}</ListMainTitleSpan>
          <ExportListContainer onClick={handleExportList}>
            <ExitToApp />
            <ExportListSpan>{I18n.t('pages.tariff.mainPage.exportList')}</ExportListSpan>
          </ExportListContainer>
        </LeftSideListHeaderContainer>
        <RightSideListHeaderContainer>
          <OrderByContainer>
            <ListTextSpan>{I18n.t('pages.tariff.mainPage.orderBy')}:</ListTextSpan>
            <DropdownMenuContainer>
              <Select
                className="select-style"
                disableUnderline
                onChange={(e) => setOrderBy(String(e.target.value))}
                placeholder={orderBy}
                value={orderBy}
              >
                {orderButtonMenuItems(filter.tariffModalType).map((item) => (
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
              onClick={() => setOrderAsc((order) => !order)}
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
            />
            <ProposalDisplayModal
              open={openDisplay}
              setClose={handleCloseDisplay}
              idProposal={proposalId}
            />
        </TableContainer>
        <PaginationContainer>
          <PaginationMainContainer>
            <Pagination
              count={totalProposalList}
              labelDisplay={I18n.t('components.Pagination.labelDisplay')}
              labelDisplayedRows={I18n.t('components.Pagination.labelDisplayedRows')}
              labelRowsPerPage={I18n.t('components.Pagination.labelRowsPerPage')}
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
              tooltipBack={I18n.t('components.Pagination.tooltipBack')}
              tooltipFirst={I18n.t('components.Pagination.tooltipFirst')}
              tooltipLast={I18n.t('components.Pagination.tooltipLast')}
              tooltipNext={I18n.t('components.Pagination.tooltipNext')}
            />
          </PaginationMainContainer>
        </PaginationContainer>
      </BottomSideContainer>
    </RootContainer>
  )
}

export default Proposal
