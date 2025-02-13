import React, { useState } from 'react'

import { Button, Popover } from '@material-ui/core'
import { I18n } from 'react-redux-i18n'
import {
  ClientCell,
  LabelCell,
  ResponsibleCell,
  MenuIconCell,
  StatusCell,
  Table, FloatingMenu, AlertIconCircle, ControlledToolTip
} from 'fiorde-fe-components'
import ValidityDisplay from '../../components/ValidityDisplay/ValidityDisplay'

export interface TableImplProps {
  rows: any[]
}

const TableImpl = ({
  rows
}: TableImplProps): JSX.Element => {
  const [state, setState] = useState({ anchorEl: null, currentKey: null })
  const handleClick = (event: any, key: any): void => {
    setState({ anchorEl: event.currentTarget, currentKey: key })
  }

  const handleClose = (): void => {
    setState({ anchorEl: null, currentKey: null })
  }

  const { anchorEl, currentKey } = state
  const open = Boolean(anchorEl)
  const id = open ? 'simple-popover' : undefined
  let statusLabel = ''

  const chooseStatusColor = (status: any): string => {
    switch (status) {
      case 1:
        statusLabel = I18n.t('pages.proposal.table.openLabel')
        return '#50E5D9'
      case 2:
        statusLabel = I18n.t('pages.proposal.table.waitingForCustomerReturnLabel')
        return '#FF80B9'
      case 3:
        statusLabel = I18n.t('pages.proposal.table.inRevisionLabel')
        return '#F2D16D'
      case 4:
        statusLabel = I18n.t('pages.proposal.table.approvedLabel')
        return '#6CD99A'
      case 5:
        statusLabel = I18n.t('pages.proposal.table.rejectedLabel')
        return '#FF7373'
      case 6:
        statusLabel = I18n.t('pages.proposal.table.cancelledLabel')
        return '#666B7C'
      case 7:
        statusLabel = I18n.t('pages.proposal.table.cancelledLabel')
        return '#666B7C'
      default:
        return '#D9DCE6'
    }
  }

  const columns = [
    {
      label: 'Operação/Referência/Cliente',
      key: 'refClient',
      render: ({ referenceTariffProposal, nmBusinessPartnerCustomer, type }: any) => (
                <ClientCell title={referenceTariffProposal} subtitle={nmBusinessPartnerCustomer} type={type} />
      ),
      size: 8
    },
    {
      label: 'Status',
      key: 'status',
      render: ({ status, isClientReturnLate }: any) => (
                <StatusCell background={chooseStatusColor(status)}>
                    <ControlledToolTip
                        placement="top"
                        title={I18n.t('pages.proposal.table.overdueClientResponse')}
                        open={statusLabel === I18n.t('pages.proposal.table.waitingForCustomerReturnLabel') && isClientReturnLate}
                        disabled={statusLabel === I18n.t('pages.proposal.table.waitingForCustomerReturnLabel') && isClientReturnLate}
                        getTitle={false}
                    >
                        <div>
                            {statusLabel === I18n.t('pages.proposal.table.waitingForCustomerReturnLabel') && isClientReturnLate !== undefined
                              ? (
                                <AlertIconCircle />
                                )
                              : (
                                  ''
                                )}
                            {statusLabel}
                        </div>
                    </ControlledToolTip>
                </StatusCell>
      ),
      size: 3
    },
    {
      label: 'Inicio vigência',
      key: 'validityDateStart',
      render: ({ validityDateStart }: any) => <LabelCell>{validityDateStart}</LabelCell>,
      size: 3
    },
    {
      label: 'Fim vigência',
      key: 'validityDateEnd',
      render: ({ validityDateEnd }: any) => <LabelCell><ValidityDisplay validity={validityDateEnd} /></LabelCell>,
      size: 3
    },
    {
      label: 'Dt. Abertura',
      key: 'dtCreated',
      render: ({ dtCreated }: any) => <LabelCell>{dtCreated}</LabelCell>,
      size: 3
    },
    {
      label: 'Responsável',
      key: 'responsible',
      render: ({ responsible }: any) => <ResponsibleCell>{responsible}</ResponsibleCell>,
      size: 3
    },
    {
      label: '',
      key: 'menu',
      render: ({ key, menuItems }: any) => (
                <div>
                    <Button onClick={(e) => handleClick(e, key)}>
                        <MenuIconCell />
                    </Button>
                    <Popover
                        id={id}
                        open={open && key === currentKey}
                        anchorEl={anchorEl}
                        onClose={handleClose}
                        anchorOrigin={{
                          vertical: 'bottom',
                          horizontal: 'center'
                        }}
                        transformOrigin={{
                          vertical: 'top',
                          horizontal: 'center'
                        }}
                    >
                        <FloatingMenu menuItems={menuItems} />
                    </Popover>
                </div>
      ),
      size: 1
    }
  ]

  return <Table rows={rows} columns={columns} />
}

export default TableImpl
