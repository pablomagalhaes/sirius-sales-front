import { Modal, Grid, FormLabel, MenuItem, Select, RadioGroup, FormControlLabel, FormControl } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import CloseIcon from '../../../application/icons/CloseIcon'
import {
  StyledRadio,
  ButtonDiv,
  CloseButtonDiv,
  ModalDiv,
  MainDiv
} from './TariffUploadModalStyles'
import { I18n } from 'react-redux-i18n'
import {
  HeaderDiv,
  RedColorSpan,
  RowReverseDiv,
  Title,
  CloseIconContainer
} from '../StyledComponents/modalStyles'
import { Button } from 'fiorde-fe-components'
import { makeStyles } from '@material-ui/core/styles'
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

  const useStyles = makeStyles(() => ({
    formControl: {
      width: '100%'
    },
    Item: {
      fontWeight: 400,
      fontSize: '14px'
    },
    selectEmpty: {
      marginTop: 0,
      padding: '5px',
      paddingLeft: '5px',
      fontWeight: 400,
      fontSize: '14px',
      '&.MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline':
      {
        borderColor: data.agent.name.length === 0 && invalidInput && '#f44336'
      },
      '&.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline':
        {
          borderColor: '#D9DCE6'
        },
      '&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline':
        {
          borderColor: '#43BFB5'
        }
    }
  }))

  const classes = useStyles()

  const uploadTariff = async (): Promise<void> => {
    if (validateData() && data.modal !== null) {
      if (type === 'Importação' && data.agent.idBusinessPartnerAgent !== null) {
        await API.uploadTariff('import', data.modal, setProgress, { file }, data.agent.idBusinessPartnerAgent)
          .then((res) => res !== 'error' && setCompleted(true))
          .catch((err) => console.log(err))
      }
      if (type === 'Exportação') {
        const agentId = data.agent.idBusinessPartnerAgent !== null ? data.agent.idBusinessPartnerAgent : undefined
        await API.uploadTariff('export', data.modal, setProgress, { file }, agentId)
          .then((res) => res !== 'error' && setCompleted(true))
          .catch((err) => console.log(err))
      }
    } else {
      console.log('entrou')
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
  })

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
                  checked={data.modal === 'AIR'}
                  value="AIR"
                  control={<StyledRadio color={getColor(data.modal)} />}
                  label='Aéreo'
                />
                <FormControlLabel
                  checked={data.modal === 'SEA/FCL'}
                  value="SEA/FCL"
                  control={<StyledRadio color={getColor(data.modal)} />}
                  label='Marítimo/FCL'
                />
                <FormControlLabel
                  checked={data.modal === 'SEA/LCL'}
                  value="SEA/LCL"
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
            </Grid>
            <Grid item xs={12}>
              <FormLabel component="legend" error={data.agent.name.length === 0 && invalidInput}>
                {I18n.t('pages.newProposal.step2.agents')}:
                {type === 'Importação' && (
                  <RedColorSpan> *</RedColorSpan>
                )}
              </FormLabel>
              <FormControl variant="outlined" className={classes.formControl}>
                <Select
                  labelId="demo-simple-select-outlined-label"
                  id="demo-simple-select-outlined"
                  value={data.agent.name}
                  displayEmpty
                  className={classes.selectEmpty}
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
                  disableUnderline={true}
                >
                  <MenuItem value="">
                    <em> </em>
                  </MenuItem>
                  {agentsList.map((item) =>
                    <MenuItem
                      value={item.businessPartner.simpleName}
                      key={item.businessPartner.id}
                      className={classes.Item}
                    >
                      {item.businessPartner.simpleName}
                    </MenuItem>
                  )}
                </Select>
              </FormControl>
            </Grid>
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
