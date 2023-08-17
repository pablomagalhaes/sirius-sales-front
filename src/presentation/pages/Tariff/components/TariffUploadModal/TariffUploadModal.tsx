import { Modal, Grid, FormLabel, RadioGroup, FormControlLabel, InputAdornment } from '@material-ui/core'
import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import CloseIcon from '../../../../../application/icons/CloseIcon'
import {
  StyledRadio,
  ButtonDiv,
  CloseButtonDiv,
  ModalDiv,
  MainDiv,
  DragAndDropDiv,
  StyledPaper
} from './TariffUploadModalStyles'
import { I18n } from 'react-redux-i18n'
import {
  HeaderDiv,
  RedColorSpan,
  RowReverseDiv,
  Title,
  CloseIconContainer
} from '../../../../components/StyledComponents/modalStyles'
import { Button, DragAndDrop } from 'fiorde-fe-components'
import { usePartnerList } from '../../../../hooks'
import useUploadTariff from '../../../../hooks/tariff/useUploadTariff'
import { TariffTypes } from '../../../../../application/enum/enum'
import Autocomplete from '@material-ui/lab/Autocomplete'
import ControlledInput from '../../../../components/ControlledInput'
import IconComponent from '../../../../../application/icons/IconComponent'

import {
  TARIFF_UPLOAD_MODAL_RADIO_SEATYPES,
  TARIFF_UPLOAD_MODAL_SELECT_UPLOAD,
  TARIFF_UPLOAD_MODAL_BUTTON_CLOSE,
  TARIFF_UPLOAD_MODAL_BUTTON_INITIATEPROCESS,
  TARIFF_UPLOAD_MODAL_BUTTON_PROCESSING
} from '../../../../../ids'
interface AgentType {
  name: string
  idBusinessPartnerAgent: number | null | undefined
}
export interface TariffUploadData {
  modal: string | null
  agent: AgentType
}

interface TariffUploadProps {
  theme?: any
  type: string
  open: boolean
  setClose: () => void
}

export const initialState = {
  modal: null,
  agent: { name: '', idBusinessPartnerAgent: null }
}

const TariffUploadModal = ({
  theme,
  type,
  open,
  setClose
}: TariffUploadProps): JSX.Element => {
  const { partnerList: agentsList } = usePartnerList()
  const { mutate, reset, isSuccess } = useUploadTariff()

  const [data, setData] = useState<TariffUploadData>(initialState)
  const [invalidInput, setInvalidInput] = useState(false)
  const [file, setFile] = useState<File | undefined>()
  const [progress, setProgress] = useState<number>(0)

  const history = useHistory()

  const uploadTariff = async (): Promise<void> => {
    if (validateData() && data.modal !== null && file !== undefined) {
      const formData = new FormData()
      formData.append('file', file)

      const params = {
        type: type === I18n.t('pages.tariff.upload.import') ? TariffTypes.Import : TariffTypes.Export,
        modal: data.modal,
        setProgress,
        formData,
        agent: data.agent.idBusinessPartnerAgent !== null ? data.agent.idBusinessPartnerAgent : undefined
      }

      mutate(params)
    } else {
      setInvalidInput(true)
    }
  }

  const handleOnClose = (): void => {
    setData(initialState)
    setInvalidInput(false)
    setClose()
    setProgress(0)
    setFile(undefined)
    reset()
  }

  const validateData = (): boolean => {
    return !(
      (data.modal === null || data.modal?.length === 0) ||
        (type === I18n.t('pages.tariff.upload.import') && data.agent.idBusinessPartnerAgent === null) ||
        (file === undefined)
    )
  }

  const getColor = (value): any => {
    if ((value === '' || value === null) && invalidInput) {
      return '#f44336'
    }
  }

  const getidBusinessPartnerAgent = (agentName: string): number | undefined => {
    let id
    if (agentName !== '') {
      agentsList?.forEach((item): void => {
        if (String(item.simpleName) === String(agentName)) {
          id = item.id
        }
      })
    }
    return id
  }

  return (
    <Modal open={open} onClose={handleOnClose}>
      <ModalDiv>
        <HeaderDiv>
          <Title>{I18n.t('pages.tariff.upload.mainLabel')} - {type}</Title>
          <RowReverseDiv>
            <CloseIconContainer>
              <CloseIcon onClick={handleOnClose} />
            </CloseIconContainer>
          </RowReverseDiv>
        </HeaderDiv>
        <MainDiv>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <FormLabel component="legend" error={data.modal === null && invalidInput}>
                {I18n.t('pages.tariff.upload.modal')}
                <RedColorSpan> *</RedColorSpan>
              </FormLabel>
              <RadioGroup
                id={TARIFF_UPLOAD_MODAL_RADIO_SEATYPES}
                row
                aria-label="proposal type"
                name="row-radio-buttons-group"
                value={data.modal}
                onChange={(e) => setData({ ...data, modal: e.target.value })}
              >
                <FormControlLabel
                  checked={data.modal === 'air'}
                  value="air"
                  control={<StyledRadio color={getColor(data.modal)} />}
                  label={I18n.t('pages.tariff.modals.air')}
                />
                <FormControlLabel
                  checked={data.modal === 'sea/fcl'}
                  value="sea/fcl"
                  control={<StyledRadio color={getColor(data.modal)} />}
                  label={`${String(I18n.t('pages.tariff.modals.sea'))}/${String(I18n.t('pages.tariff.modals.seaTypes.fcl'))}`}
                />
                <FormControlLabel
                  checked={data.modal === 'sea/lcl'}
                  value="sea/lcl"
                  control={<StyledRadio color={getColor(data.modal)} />}
                  label={`${String(I18n.t('pages.tariff.modals.sea'))}/${String(I18n.t('pages.tariff.modals.seaTypes.lcl'))}`}
                />
                <FormControlLabel
                  checked={data.modal === 'land'}
                  value="land"
                  control={<StyledRadio color={getColor(data.modal)} />}
                  label={I18n.t('pages.tariff.modals.land')}
                />
              </RadioGroup>
            </Grid>
            <Grid item xs={12}>
              <FormLabel component="legend" error={type === I18n.t('pages.tariff.upload.import') && data.agent.name.length === 0 && invalidInput}>
                {I18n.t('pages.newProposal.step2.agents')}:
                {type === I18n.t('pages.tariff.upload.import') && (
                  <RedColorSpan> *</RedColorSpan>
                )}
              </FormLabel>
              <Autocomplete
                id={TARIFF_UPLOAD_MODAL_SELECT_UPLOAD}
                disabled={false}
                size="small"
                closeIcon={null}
                options={agentsList.map(
                  (item) => item.simpleName
                )}
                onChange={(e, newValue) => {
                  if (newValue !== null) {
                    setData({
                      ...data,
                      agent: {
                        name: String(newValue) ?? '',
                        idBusinessPartnerAgent: getidBusinessPartnerAgent(String(newValue))
                      }
                    })
                  } else {
                    setData({
                      ...data,
                      agent: { name: '', idBusinessPartnerAgent: null }
                    })
                  }
                }}
                value={data.agent.name}
                renderInput={(params: any) => (
                  <div ref={params.InputProps.ref}>
                    <ControlledInput
                      {...params}
                      id="search-name"
                      toolTipTitle={I18n.t(
                        'components.itemModal.requiredField'
                      )}
                      value={data.agent.name}
                      invalid={type === I18n.t('pages.tariff.upload.import') && data.agent.name.length === 0 && invalidInput}
                      variant="outlined"
                      placeholder={
                        data.agent.name.length === 0 &&
                        I18n.t('pages.newProposal.step2.searchAgents')
                      }
                      $space
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconComponent
                              name="search"
                              defaultColor={
                                theme?.commercial?.pages?.newProposal
                                  ?.subtitle
                              }
                            />
                          </InputAdornment>
                        )
                      }}
                    />
                  </div>
                )}
                PaperComponent={(params: any) => (
                  <StyledPaper {...params} />
                )}
              />
            </Grid>
            <DragAndDropDiv>
              <DragAndDrop
                onAction={setFile}
                label= {I18n.t('pages.tariff.upload.dragAndDrop.label')}
                uploadButtonLabel= {I18n.t('pages.tariff.upload.dragAndDrop.uploadButtonLabel')}
                status={progress === 100
                  ? I18n.t('pages.tariff.upload.dragAndDrop.completedStatus')
                  : I18n.t('pages.tariff.upload.dragAndDrop.uploadStatus')}
                progress={progress}
                errorMessage={I18n.t('pages.tariff.upload.dragAndDrop.errorMessage')}
                types={['text/csv']}
              />
            </DragAndDropDiv>
            { isSuccess === true && <Grid item xs={12}>
              <p>{I18n.t('pages.tariff.upload.completedMessage')}</p>
            </Grid>}
          </Grid>
            <Grid item xs={12} container={true} direction="row" justify="flex-end">
              <Grid item xs={6}>
                <CloseButtonDiv>
                  <Button
                    id={TARIFF_UPLOAD_MODAL_BUTTON_CLOSE}
                    disabled={false}
                    text={I18n.t('pages.tariff.upload.closeButtonLabel')}
                    tooltip={I18n.t('pages.tariff.upload.closeButtonLabel')}
                    backgroundGreen={false}
                    icon=""
                    onAction={handleOnClose}
                  />
                </CloseButtonDiv>
              </Grid>
              <Grid item xs={6}>
                <ButtonDiv>
                  {progress === 0
                    ? <Button
                      id={TARIFF_UPLOAD_MODAL_BUTTON_INITIATEPROCESS}
                      disabled={file == null}
                      text={I18n.t('pages.tariff.upload.startButtonLabel')}
                      tooltip={I18n.t('pages.tariff.upload.startButtonLabel')}
                      backgroundGreen={true}
                      icon=""
                      onAction={uploadTariff}
                    />
                    : <Button
                      id={TARIFF_UPLOAD_MODAL_BUTTON_PROCESSING}
                      disabled={isSuccess === false}
                      text={I18n.t('pages.tariff.upload.processingButtonLabel')}
                      tooltip={I18n.t('pages.tariff.upload.processingButtonLabel')}
                      backgroundGreen={true}
                      icon=""
                      onAction={() => history.push('/tarifario-processamentos')}
                    />
                  }
                </ButtonDiv>
              </Grid>
            </Grid>
        </MainDiv>
      </ModalDiv>
    </Modal >
  )
}

export default TariffUploadModal
