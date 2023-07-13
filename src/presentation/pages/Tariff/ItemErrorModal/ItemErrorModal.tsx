import { Box, Modal, Grid, Typography } from '@material-ui/core'
import React, { useState, useEffect } from 'react'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import moment from 'moment'

import CloseIcon from '../../../../application/icons/CloseIcon'
import AlertIcon from '../../../../application/icons/AlertIcon'

import { withTheme } from 'styled-components'
import {
  ModalDiv,
  MainDiv,
  UnorderedList,
  ListInner
} from './ItemErrorModalStyles'

import { I18n } from 'react-redux-i18n'
import {
  HeaderDiv,
  RowReverseDiv,
  Title,
  CloseIconContainer
} from '../../../components/StyledComponents/modalStyles'
import { Button } from 'fiorde-fe-components'
import { chooseStatusColor, chooseStatusLabel } from '../helpers'

import {
  TARIFF_TARIFF_PROCESSING_ITEM_ERROR_MODAL_SPAN_NOME,
  TARIFF_TARIFF_PROCESSING_ITEM_ERROR_MODAL_SPAN_DATAHORAPROCESSAMENTO,
  TARIFF_TARIFF_PROCESSING_ITEM_ERROR_MODAL_SPAN_USUARIO,
  TARIFF_TARIFF_PROCESSING_ITEM_ERROR_MODAL_SPAN_TIPO,
  TARIFF_TARIFF_PROCESSING_ITEM_ERROR_MODAL_SPAN_MODAL,
  TARIFF_TARIFF_PROCESSING_ITEM_ERROR_MODAL_SPAN_AGENTE,
  TARIFF_TARIFF_PROCESSING_ITEM_ERROR_MODAL_SPAN_STATUSPROCESSAMENTO,
  TARIFF_TARIFF_PROCESSING_ITEM_ERROR_MODAL_BUTTON_CLOSE
} from '../../../../ids'

interface ItemErrorModalProps {
  theme?: any
  open: boolean
  setClose: () => void
  title: string
  itemId?: string
  tariffList?: any
}

const ItemErrorModal = ({
  theme,
  open,
  setClose,
  title,
  tariffList,
  itemId
}: ItemErrorModalProps): JSX.Element => {
  const [item, setItem] = useState<any>()

  const handleOnClose = (): void => {
    setClose()
  }

  useEffect(() => {
    const Item = tariffList.filter((item) => item.idUploadFile === itemId)
    setItem(Item[0])
  }, [itemId])

  return (
    <Modal open={open} onClose={handleOnClose}>
      <ModalDiv>
        <HeaderDiv>
          <Title>{title} - {item?.tariffType} </Title>
          <RowReverseDiv>
            <CloseIconContainer>
              <CloseIcon onClick={handleOnClose} />
            </CloseIconContainer>
          </RowReverseDiv>
        </HeaderDiv>
        <MainDiv>
          <Grid container spacing={5} style={{ width: '100%' }}>
            <Grid item xs={12}>
              <UnorderedList>
                <li><span id={TARIFF_TARIFF_PROCESSING_ITEM_ERROR_MODAL_SPAN_NOME}>{I18n.t('pages.tariff.itemErrorModal.txFileName')}</span> {item?.txFileName}</li>
                <li><span id={TARIFF_TARIFF_PROCESSING_ITEM_ERROR_MODAL_SPAN_DATAHORAPROCESSAMENTO}>{I18n.t('pages.tariff.itemErrorModal.dtProcess')}</span> {moment(item?.dtProcess).format('DD/MM/YYYY')}</li>
                <li><span id={TARIFF_TARIFF_PROCESSING_ITEM_ERROR_MODAL_SPAN_USUARIO}>{I18n.t('pages.tariff.itemErrorModal.userCreation')}</span> {item?.userCreation}</li>
                <li><span id={TARIFF_TARIFF_PROCESSING_ITEM_ERROR_MODAL_SPAN_TIPO}>{I18n.t('pages.tariff.itemErrorModal.tariffType')}</span> {item?.tariffType}</li>
                <li><span id={TARIFF_TARIFF_PROCESSING_ITEM_ERROR_MODAL_SPAN_MODAL}>{I18n.t('pages.tariff.itemErrorModal.tariffModalType')}</span> {item?.tariffModalType}</li>
                <li><span id={TARIFF_TARIFF_PROCESSING_ITEM_ERROR_MODAL_SPAN_AGENTE}>{I18n.t('pages.tariff.itemErrorModal.nmAgent')}</span> {item?.nmAgent}</li>
                <li><span id={TARIFF_TARIFF_PROCESSING_ITEM_ERROR_MODAL_SPAN_STATUSPROCESSAMENTO} style={{ float: 'left' }}>{I18n.t('pages.tariff.itemErrorModal.txStatus')}</span>
                <div style={{ borderRadius: '50%', height: '15px', width: '15px', marginLeft: '10px', float: 'left', backgroundColor: `${chooseStatusColor(item?.txStatus)}` }}></div>
                  <div style={{ lineHeight: '16px', marginLeft: '5px', float: 'left' }}>
                    {chooseStatusLabel(item?.txStatus)}
                  </div>
                </li>
              </UnorderedList>
            </Grid>
            <Grid item xs={12} style={{ paddingTop: '0px' }}>
              <Typography variant="subtitle1" gutterBottom>
                {I18n.t('pages.tariff.itemErrorModal.subtitleLog')}
              </Typography>
              <ListInner>
                <List>
                {item?.errors.map((item: any, index) => {
                    return (
                      <>
                        <ListItem key={index}>
                          <ListItemIcon>
                            <AlertIcon />
                          </ListItemIcon>
                          <ListItemText>
                            {I18n.t('pages.tariff.itemErrorModal.line')} {item.line} : {I18n.t(`pages.tariff.itemErrorModal.keyErros.${item.keyLog}`)}
                          </ListItemText>
                        </ListItem>
                      </>)
                  })}
                </List>
              </ListInner>
            </Grid>
            <Grid container>
              <Grid item xs={12}>
                <Box display="flex" justifyContent="flex-end">
                 <Button
                  id={TARIFF_TARIFF_PROCESSING_ITEM_ERROR_MODAL_BUTTON_CLOSE}
                  disabled={false}
                  text={I18n.t('pages.tariff.itemErrorModal.close')}
                  tooltip={I18n.t('')}
                  backgroundGreen={true}
                  icon=""
                  onAction={() => { handleOnClose() }}
                />
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </MainDiv>
      </ModalDiv>
    </Modal >
  )
}

export default withTheme(ItemErrorModal)
