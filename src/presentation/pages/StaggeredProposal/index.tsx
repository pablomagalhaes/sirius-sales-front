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
import ArrowDown from '../../../application/icons/ArrowDown'
import { orderButtonMenuItems } from './constants'
import { I18n } from 'react-redux-i18n'
import {
  StatusProposalEnum,
  StatusStaggeredProposalStringEnum
} from '../../../application/enum/statusProposalEnum'
import RejectModal from '../../components/RejectModal/RejectModal'
import Filter from './components/filter'
import { SelectorsValuesTypes } from '../../../application/enum/staggeredProposalEnum'
import { StaggeredProposalContext, filterDefault } from './context/StaggeredProposalContext'
import useTariffProposal from '../../hooks/tariff/useTariffProposal'
import { OrderTypes } from '../../../application/enum/enum'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { UpdateStatusStaggeredProposal , LoadStaggeredProposal } from '../../../domain/usecase'
import CancelModal from '../../components/CancelModal/CancelModal'
import API from '../../../infrastructure/api'

interface StaggeredProposalProps {
  loadStaggeredProposal: LoadStaggeredProposal
  updateStatusStaggeredProposal: {
    updateStatusStaggered: Function
  }
}

const StaggeredProposal = ({ loadStaggeredProposal, updateStatusStaggeredProposal }: StaggeredProposalProps): JSX.Element => {
  const { filter, setFilter }: any = useContext(StaggeredProposalContext)

  const { content: proposalList, totalElements: totalProposalList, setParams, refetch } = useTariffProposal(loadStaggeredProposal)
  const [openReject, setOpenReject] = useState(false)
  const [openCancel, setOpenCancel] = useState(false)
  const [openDisplay, setOpenDisplay] = useState(false)
  const [reference, setReference] = useState('')
  const [proposalId, setProposalId] = useState('')
  const [orderAsc, setOrderAsc] = useState(true)
  const [orderBy, setOrderBy] = useState<string>(SelectorsValuesTypes.Validity)

  const history = useHistory()
  const queryClient = useQueryClient()

  useEffect(() => {
    setParams(filter)
  }, [filter])

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

  const verifyType = (type: String): string => {
    if (type === 'IMPORT') {
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
        menuItems: menuItemsList(status, proposal.idTariffCustomer, proposal.referenceTariffProposal),
        responsible: proposal.userCreationName,
        status,
        type,
        isClientReturnLate: false
      }
      array.push(item)
    }
    return array
  }

  const mutation = useMutation({
    mutationFn: async (params: UpdateStatusStaggeredProposal.Params) => {
      return await updateStatusStaggeredProposal.updateStatusStaggered(params)
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['updateStatusStaggeredProposal'])
      refetch()
    }
  })

  const setStatus = async (id: number, status: string, value?: string, detail?: string): Promise<void> => {
    const params = { id, status, value, detail }
    mutation.mutate(params)
  }

  const menuItemsList = (status: any, id: any, ref: any): void => {
    const array: any = []
    switch (status) {
      case StatusProposalEnum.ABERTA:
        array.push(
          {
            iconType: 'edit',
            label: I18n.t('pages.proposal.table.editLabel'),
            onClick: () => {
              history.push({
                pathname: '/novaPropostaEscalonada',
                state: { proposalId: id }
              })
            }
          },
          {
            iconType: 'forward',
            label: I18n.t('pages.proposal.table.confirmLabel'),
            onClick: () => {
              setStatus(id, StatusStaggeredProposalStringEnum.AGUARDANDO_RETORNO_CLIENTE)
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
            iconType: 'fileReview',
            label: I18n.t('pages.proposal.table.reviewLabel'),
            onClick: () => {
              setStatus(id, StatusStaggeredProposalStringEnum.EM_REVISAO)
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
              setStatus(id, StatusStaggeredProposalStringEnum.APROVADA)
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
              history.push({
                pathname: '/novaPropostaEscalonada',
                state: { proposalId: id }
              })
            }
          },
          {
            iconType: 'forward',
            label: I18n.t('pages.proposal.table.confirmLabel'),
            onClick: () => {
              setStatus(id, StatusStaggeredProposalStringEnum.AGUARDANDO_RETORNO_CLIENTE)
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
          })
        return array
      case StatusProposalEnum.REJEITADA:
      case StatusProposalEnum.CANCELADA:
      default:
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
      ...filterDefault
    }))
  }

  const showMsgTotalResult = (): string => {
    const keys = Object.keys(filter)

    /* eslint-disable no-prototype-builtins */
    const orderByList = filter.hasOwnProperty('orderByList')
    const page = filter.hasOwnProperty('page')
    const size = filter.hasOwnProperty('size')

    if (
      keys.length === 3 &&
      Boolean(page) &&
      Boolean(size) &&
      Boolean(orderByList)
    ) {
      return `${String(I18n.t('pages.tariff.titles.StaggeredProposal'))} (${String(totalProposalList)}) - ${String(I18n.t('pages.tariff.mainPage.last30days'))}`
    }
    return `Resultado do filtro (${String(totalProposalList)})`
  }
  const handleCloseReject = (): void => {
    setOpenReject(false)
    setReference('')
    setProposalId('')
  }

  const handleCloseCancel = (): void => {
    setOpenCancel(false)
    setReference('')
    setProposalId('')
  }

  const handleCloseDisplay = (): void => {
    setOpenDisplay(false)
    setProposalId('')
  }

  const handleOrderDirection = (): string => {
    if (orderAsc) {
      return OrderTypes.Ascendent
    }
    return OrderTypes.Descendent
  }

  useEffect(() => {
    setFilter((filter: any) => ({ ...filter, orderByList: `${orderBy},${handleOrderDirection()}` }))
  }, [orderAsc, orderBy])

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
              onAction={() =>
                history.push({
                  pathname: '/novaPropostaEscalonada',
                  state: { proposalId: null }
                })
              }
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
                {orderButtonMenuItems().map((item) => (
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
              downloadProposal={API.downloadStaggeredProposal}
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

export default StaggeredProposal
