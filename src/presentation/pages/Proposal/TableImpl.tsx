import React, { useState } from 'react'

import { Button, Popover } from '@material-ui/core'
import { I18n } from 'react-redux-i18n'
import {
  AirplaneCell,
  ClientCell,
  LabelCell,
  OriginCell,
  ResponsibleCell,
  MenuIconCell,
  StatusCell,
  HighwayCell,
  MaritimeCell,
  Table, FloatingMenu, AlertIconCircle, ControlledToolTip
} from 'fiorde-fe-components'
import API from '../../../infrastructure/api'

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
      render: ({ reference, client, type }: any) => (
                <ClientCell title={reference} subtitle={client} type={type} />
      ),
      size: 6
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
      size: 2
    },
    {
      label: 'Modal',
      key: 'modal',
      render: ({ modal }: any) => {
        switch (modal) {
          case 'aereo':
            return <AirplaneCell />
          case 'rodoviario':
            return <HighwayCell />
          case 'maritimo':
            return <MaritimeCell />
          default:
            return <AirplaneCell />
        }
      },
      size: 1
    },
    {
      label: 'Origem',
      key: 'origin',
      render: ({ origin, modal }: any) => (
        <OriginCell>
          <ControlledToolTip
            placement="top"
            title={origin}
            open={true}
            disabled={true}
            getTitle={modal !== 'rodoviario' && API.getOriginDestinationById}
          >
            <div>
              {origin}
            </div>
          </ControlledToolTip>
        </OriginCell>
      ),
      size: 3
    },
    {
      label: 'Destino',
      key: 'destination',
      render: ({ destination, modal }: any) => (
        <LabelCell>
          <ControlledToolTip
            placement="top"
            title={destination}
            open={true}
            disabled={true}
            getTitle={modal !== 'rodoviario' && API.getOriginDestinationById}
          >
            <div>
              {destination}
            </div>
          </ControlledToolTip>
        </LabelCell>
      ),
      size: 2
    },
    {
      label: 'Incoterm',
      key: 'inconterm',
      render: ({ iconterm }: any) => <LabelCell>{iconterm}</LabelCell>,
      size: 1
    },
    {
      label: 'Abertura',
      key: 'opening',
      render: ({ opening }: any) => <LabelCell>{opening}</LabelCell>,
      size: 3
    },
    {
      label: 'Validade',
      key: 'shelfLife',
      render: ({ shelfLife, isLate }: any) =>
        isLate === true
          ? (
                    <LabelCell
                        style={{
                          borderRadius: '50px',
                          padding: '1px 8px',
                          border: '2px solid #F2D16D'
                        }}
                    >
                        {shelfLife}
                    </LabelCell>
            )
          : (
                    <LabelCell>{shelfLife}</LabelCell>
            ),
      size: 3
    },
    {
      label: 'Núm.IO',
      key: 'numio',
      render: ({ numio }: any) => <LabelCell>{numio}</LabelCell>,
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
      size: 2
    }
  ]

  return <Table rows={rows} columns={columns} />
}

export default TableImpl
