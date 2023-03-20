import React, { useState } from 'react'

import { ExtensionMenu } from 'fiorde-fe-components'
import { useHistory } from 'react-router-dom'
import { I18n } from 'react-redux-i18n'
import { Root, ChildrenContainer, ExtensionMenuContainer } from './style'

const Wrapper = ({ children }): JSX.Element => {
  const [open, setOpen] = useState(false)
  const history = useHistory()

  const handleChange = (isOpened): void => {
    setOpen(isOpened)
  }

  const menuItems: any = [
    {
      icon: 'home',
      label: I18n.t('components.header.home'),
      onclick: () => history.push('/'),
      subMenuItems: []
    },
    {
      icon: 'proposal',
      label: I18n.t('components.header.proposal'),
      onclick: () => history.push('/proposta'),
      subMenuItems: []
    },
    {
      icon: 'tariff',
      label: I18n.t('components.header.tariff'),
      onclick: () => history.push('/tarifario'),
      subMenuItems: []
    },
    {
      icon: 'chart',
      label: I18n.t('components.header.indicators'),
      onclick: () => console.log(),
      subMenuItems: []
    }
  ]
  return (
    <Root>
      <ExtensionMenuContainer>
        <ExtensionMenu menuItems={menuItems} module="" onChange={handleChange} selectedSubItem={undefined} selectedSubMenu={undefined} />
      </ExtensionMenuContainer>
      <ChildrenContainer isOpen={open}>{children}</ChildrenContainer>
    </Root>
  )
}

export default Wrapper
