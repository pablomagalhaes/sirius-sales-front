import { Modal, Grid, FormLabel, RadioGroup, FormControlLabel } from '@material-ui/core'
import React, { useState } from 'react'
import CloseIcon from '../../../../../application/icons/CloseIcon'
import {
  StyledRadio,
  ButtonDiv,
  CloseButtonDiv,
  ModalDiv,
  MainDiv,
  DragAndDropDiv,
  Form,
  SelectEmpty,
  Item
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
                id="siriuscomercial_tariff-upload_radio_seaTypes"
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
              <Form variant="outlined">
                <SelectEmpty
                  labelId="demo-simple-select-outlined-label"
                  id="siriuscomercial_tariff-upload_select_upload"
                  value={data.agent.name}
                  displayEmpty
                  inputProps={{ 'aria-label': 'Without label' }}
                  onChange={(e) => {
                    setData({
                      ...data,
                      agent: {
                        name: String(e.target.value) ?? '',
                        idBusinessPartnerAgent: getidBusinessPartnerAgent(String(e.target.value))
                      }
                    })
                  }}
                  invalidData={type === I18n.t('pages.tariff.upload.import') && data.agent.name.length === 0 && invalidInput}
                  disableUnderline={true}
                >
                  <Item value="">
                    <em> </em>
                  </Item>
                  {agentsList.map((item) =>
                    <Item
                      value={item.simpleName}
                      key={item.id}
                    >
                      {item.simpleName}
                    </Item>
                  )}
                </SelectEmpty>
              </Form>
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
                    id="siriuscomercial_tariff-upload_button_close"
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
                      id="siriuscomercial_tariff-upload_button_iniciar-procesamento"
                      disabled={file == null}
                      text={I18n.t('pages.tariff.upload.startButtonLabel')}
                      tooltip={I18n.t('pages.tariff.upload.startButtonLabel')}
                      backgroundGreen={true}
                      icon=""
                      onAction={uploadTariff}
                    />
                    : <Button
                      id="siriuscomercial_tariff-upload_button_processando"
                      disabled={isSuccess === false}
                      text={I18n.t('pages.tariff.upload.processingButtonLabel')}
                      tooltip={I18n.t('pages.tariff.upload.processingButtonLabel')}
                      backgroundGreen={true}
                      icon=""
                      onAction={() => console.log('')}
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
