import React, { Fragment, useState } from 'react'
import { ExitDialog } from 'fiorde-fe-components'
import { I18n } from 'react-redux-i18n'
import RemoveIcon from '../../../application/icons/RemoveIcon'

interface Props {
  handleConfirm: () => void
}

const AgentDeleteModal = ({ handleConfirm }: Props): JSX.Element => {
  const [visible, setVisible] = useState(false)
  return (
    <Fragment>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginLeft: '5px'
        }}
      >
        <RemoveIcon onClick={() => setVisible(true)}/>
      </div>
      {visible && (
        <ExitDialog
          title={I18n.t('components.agentDeleteModal.title')}
          message={I18n.t('components.agentDeleteModal.message')}
          cancelButtonText={I18n.t('components.agentDeleteModal.cancelMessage')}
          confirmButtonText={I18n.t('components.agentDeleteModal.confirmMessage')}
          onPressCancel={() => setVisible(false)}
          onPressConfirm={() => {
            handleConfirm()
            setVisible(false)
          }}
        />
      )}
    </Fragment>

  )
}

export default AgentDeleteModal
