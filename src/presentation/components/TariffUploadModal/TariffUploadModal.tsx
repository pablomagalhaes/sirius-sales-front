import { Modal, Grid, FormLabel, MenuItem, TableHead, TableBody, Box, RadioGroup,FormControlLabel } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import CloseIcon from '../../../application/icons/CloseIcon'
import moment from 'moment'
import {
  StyledRadio,
  ButtonDiv,
  CloseButtonDiv,
  ColumnDiv,
  ModalDiv,
  MainDiv,
  SelectSpan,
  StyledTable,
  StyledTableCell,
  SubDiv,
  TableBodyRow,
  TableHeadRow,
  Input
} from './TariffUploadModalStyles'
import { I18n } from 'react-redux-i18n'
import ControlledInput from '../ControlledInput'
import {
  HeaderDiv,
  RedColorSpan,
  RowReverseDiv,
  Title,
  CloseIconContainer,
  RowDiv
} from '../StyledComponents/modalStyles'
import { Button } from 'fiorde-fe-components'
import { Autocomplete } from '@material-ui/lab'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown'
import { NumberInput, StyledPaper } from '../../pages/NewProposal/steps/StepsStyles'
import FormatNumber from '../../../application/utils/formatNumber'
import ControlledSelect from '../../components/ControlledSelect'
import API from '../../../infrastructure/api'

export interface TariffUploadData {
  modal: string | null
}

interface TariffUploadProps {
  theme?: any
  type: string
  open: boolean
  setClose: () => void
}

export const initialState = {
  modal: null,
}

const TariffUploadModal = ({
  theme,
  type,
  open,
  setClose
}: TariffUploadProps): JSX.Element => {
  const [data, setData] = useState<TariffUploadData>(initialState)
  const [invalidInput, setInvalidInput] = useState(false)

  const rgxFloat = /^[0-9]*,?[0-9]*$/
  const rgxInt = /^[0-9]*$/


  const handleOnClose = (): void => {
    setData(initialState)
    setInvalidInput(false)
    setClose()
  }

  const validateFloatInput = (value: string): RegExpMatchArray | null => {
    return value.match(rgxFloat)
  }

  const validateIntInput = (value: string): RegExpMatchArray | null => {
    return value.match(rgxInt)
  }

  const validateData = (): boolean => {
    return !(
        (data.modal === null || data.modal?.length === 0)
    )
  }

  const getColor = (value): any => {
    if (value === '' && invalidInput) {
      return theme?.commercial?.components?.itemModal?.redAsterisk
    }
  }


  return (
    <Modal open={open} onClose={handleOnClose}>
      <ModalDiv>
        <HeaderDiv>
          <Title>Fazer upload de tarifas - {type}</Title>
          <RowReverseDiv>
            <CloseIconContainer>
              <CloseIcon onClick={handleOnClose} />
            </CloseIconContainer>
          </RowReverseDiv>
        </HeaderDiv>
        <MainDiv>
            <FormLabel component="legend" error={data.modal === '' && invalidInput}>
              Modal
              <RedColorSpan> *</RedColorSpan>
            </FormLabel>
            <RadioGroup
              row
              aria-label="proposal type"
              name="row-radio-buttons-group"
              value={data.modal}
              onChange={(e) => setData({ ...data, modal: e.target.value })}
            >
              <FormControlLabel
                checked={data.modal === 'AIR'}
                value="AIR"
                control={<StyledRadio color={getColor(data.modal)} />}
                label='Aéreo'
              />
              <FormControlLabel
                checked={data.modal === 'FCL'}
                value="FCL"
                control={<StyledRadio color={getColor(data.modal)} />}
                label='Marítimo/FCL'
              />
              <FormControlLabel
                checked={data.modal === 'LCL'}
                value="LCL"
                control={<StyledRadio color={getColor(data.modal)} />}
                label='Marítimo/LCL'
              />
              <FormControlLabel
                checked={data.modal === 'LAND'}
                value="LAND"
                control={<StyledRadio color={getColor(data.modal)} />}
                label='Rodoviário'
              />
            </RadioGroup>
            <Grid item xs={12} container={true} direction="row" justify="flex-end">
              <Grid item xs={6}>
                <CloseButtonDiv>
                  <Button
                    disabled={false}
                    text='Fechar'
                    tooltip='Fechar'
                    backgroundGreen={false}
                    icon=""
                    onAction={handleOnClose}
                  />
                </CloseButtonDiv>
              </Grid>
              <Grid item xs={6}>
                <ButtonDiv>
                  <Button
                    disabled={false}
                    text='Iniciar processamento'
                    tooltip='Iniciar processamento'
                    backgroundGreen={true}
                    icon=""
                    onAction={() => console.log('clicou')}
                  />
                </ButtonDiv>
              </Grid>
            </Grid>
        </MainDiv>
      </ModalDiv>
    </Modal >
  )
}

export default TariffUploadModal
