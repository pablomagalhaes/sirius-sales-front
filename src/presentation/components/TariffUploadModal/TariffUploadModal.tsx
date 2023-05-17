import { Modal, Grid, FormLabel, RadioGroup, FormControlLabel } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import CloseIcon from '../../../application/icons/CloseIcon'
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
} from '../StyledComponents/modalStyles'
import { Button, DragAndDrop } from 'fiorde-fe-components'
import API from '../../../infrastructure/api'

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
  const [data, setData] = useState<TariffUploadData>(initialState)
  const [invalidInput, setInvalidInput] = useState(false)
  const [file, setFile] = useState<File | undefined>()
  const [progress, setProgress] = useState<number>(0)
  const [completed, setCompleted] = useState<boolean>(false)
  const [agentsList, setAgentsList] = useState<any[]>([])

  const uploadTariff = async (): Promise<void> => {
    if (validateData() && data.modal !== null && file !== undefined) {
      const formData = new FormData()
      formData.append('file', file)

      if (type === 'Importação' && data.agent.idBusinessPartnerAgent !== null) {
        await API.uploadTariff('import', data.modal, setProgress, formData, data.agent.idBusinessPartnerAgent)
          .then((res) => res !== 'error' && setCompleted(true))
          .catch((err) => console.log(err))
      }
      if (type === 'Exportação') {
        const agentId = data.agent.idBusinessPartnerAgent !== null ? data.agent.idBusinessPartnerAgent : undefined
        await API.uploadTariff('export', data.modal, setProgress, formData, agentId)
          .then((res) => res !== 'error' && setCompleted(true))
          .catch((err) => console.log(err))
      }
    } else {
      setInvalidInput(true)
    }
  }

  const handleOnClose = (): void => {
    setData(initialState)
    setInvalidInput(false)
    setClose()
    setCompleted(false)
    setProgress(0)
    setFile(undefined)
  }

  const validateData = (): boolean => {
    console.log(type === 'Importação' && data.agent.idBusinessPartnerAgent === null)
    return !(
      (data.modal === null || data.modal?.length === 0) ||
        (type === 'Importação' && data.agent.idBusinessPartnerAgent === null) ||
        (file === undefined)
    )
  }

  const getColor = (value): any => {
    if ((value === '' || value === null) && invalidInput) {
      return '#f44336'
    }
  }

  useEffect(() => {
    void (async function () {
      await API.getAgents()
        .then((agent) => setAgentsList(agent))
        .catch((err) => console.log(err))
    })()
  }, [])

  const getidBusinessPartnerAgent = (agentName: string): number | undefined => {
    let id
    if (agentName !== '') {
      agentsList?.forEach((item): void => {
        if (String(item.businessPartner.simpleName) === String(agentName)) {
          id = item.businessPartner.id
        }
      })
    }
    return id
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
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <FormLabel component="legend" error={data.modal === null && invalidInput}>
                Modal:
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
                  checked={data.modal === 'air'}
                  value="air"
                  control={<StyledRadio color={getColor(data.modal)} />}
                  label='Aéreo'
                />
                <FormControlLabel
                  checked={data.modal === 'sea/fcl'}
                  value="sea/fcl"
                  control={<StyledRadio color={getColor(data.modal)} />}
                  label='Marítimo/FCL'
                />
                <FormControlLabel
                  checked={data.modal === 'sea/lcl'}
                  value="sea/lcl"
                  control={<StyledRadio color={getColor(data.modal)} />}
                  label='Marítimo/LCL'
                />
                <FormControlLabel
                  checked={data.modal === 'land'}
                  value="land"
                  control={<StyledRadio color={getColor(data.modal)} />}
                  label='Rodoviário'
                />
              </RadioGroup>
            </Grid>
            <Grid item xs={12}>
              <FormLabel component="legend" error={type === 'Importação' && data.agent.name.length === 0 && invalidInput}>
                {I18n.t('pages.newProposal.step2.agents')}:
                {type === 'Importação' && (
                  <RedColorSpan> *</RedColorSpan>
                )}
              </FormLabel>
              <Form variant="outlined">
                <SelectEmpty
                  labelId="demo-simple-select-outlined-label"
                  id="demo-simple-select-outlined"
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
                  invalidData={type === 'Importação' && data.agent.name.length === 0 && invalidInput}
                  disableUnderline={true}
                >
                  <Item value="">
                    <em> </em>
                  </Item>
                  {agentsList.map((item) =>
                    <Item
                      value={item.businessPartner.simpleName}
                      key={item.businessPartner.id}
                    >
                      {item.businessPartner.simpleName}
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
            { completed && <Grid item xs={12}>
              <p>Acompanhe o processamento do arquivo na tela de processamentos.</p>
            </Grid>}
          </Grid>
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
                  {progress === 0
                    ? <Button
                      disabled={file == null}
                      text='Iniciar processamento'
                      tooltip='Iniciar processamento'
                      backgroundGreen={true}
                      icon=""
                      onAction={uploadTariff}
                    />
                    : <Button
                      disabled={!completed}
                      text='Ver todos os processamentos'
                      tooltip='Ver todos os processamentos'
                      backgroundGreen={true}
                      icon=""
                      onAction={() => console.log('todos os processamentos')}
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
