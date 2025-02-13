import React from 'react'
import { Table, TableCell, TableRow } from '@material-ui/core'
import {
  TableHeader,
  TableBod
} from './TariffProcessingTableStyle'

import moment from 'moment'
import { I18n } from 'react-redux-i18n'

import { chooseStatusColor, capitalizeFirstLetter } from './helpers'
export interface TariffProcessingTableProps {
  rows: any[]
  handleSelectedItem: (id: any) => void
}

const TariffProcessingTable = ({
  rows,
  handleSelectedItem
}: TariffProcessingTableProps): JSX.Element => {
  const handleClick = (event: any, key: any, id: any): void => {
    handleSelectedItem(id)
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell>Nome do arquivo</TableCell>
            <TableCell>Data/hora do processamento</TableCell>
            <TableCell>Usuário</TableCell>
            <TableCell>Tipo</TableCell>
            <TableCell>Modal</TableCell>
            <TableCell>Agente</TableCell>
            <TableCell>Status do processamento</TableCell>
          </TableRow>
        </TableHeader>
        <TableBod>
          {rows.map((row, index) => (
            <TableRow key={index}>
              <TableCell>{row.txFileName}</TableCell>
              <TableCell>
                {moment(row.dtProcess).format('DD/MM/YYYY HH:MM')}
              </TableCell>
              <TableCell>{row.userCreation}</TableCell>
              <TableCell>{capitalizeFirstLetter(row.tariffType)}</TableCell>
              <TableCell>{capitalizeFirstLetter(row.tariffModalType)}</TableCell>
              {/* eslint-disable-next-line @typescript-eslint/strict-boolean-expressions */}
              <TableCell>{row.nmAgent && capitalizeFirstLetter(row.nmAgent)}</TableCell>
              <TableCell>
                <div
                  style={{
                    borderRadius: '50%',
                    height: '15px',
                    width: '15px',
                    float: 'left',
                    marginRight: '5px',
                    backgroundColor: `${chooseStatusColor(row.txStatus)}`
                  }}>
                </div>
                <div
                  style={{
                    lineHeight: '16px',
                    marginLeft: '10px',
                    cursor: 'pointer'
                  }}
                  onClick={
                    row.txStatus ===
                    I18n.t('pages.tariff.tariffTableProcessing.sucessLabel')
                      ? () => {}
                      : (e) => handleClick(e, index, row.idUploadFile)
                  }
                >
                  {capitalizeFirstLetter(row.txStatus)}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBod>
      </Table>
    </>
  )
}

export default TariffProcessingTable
