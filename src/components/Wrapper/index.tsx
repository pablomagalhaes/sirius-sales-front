import React, { useState } from "react";

import { ExtensionMenu } from "fiorde-fe-components";
import { useHistory } from "react-router-dom";
import { I18n } from 'react-redux-i18n';
import { Root, ChildrenContainer, ExtensionMenuContainer } from "./style";
/** TODO:
 * - get array from user role when login be ready. doing same thing in home page
 * */
const Wrapper = ({ children }) => {
  const [open, setOpen] = useState(false);
  const history = useHistory();

  const handleChange = (isOpened) => {
    setOpen(isOpened);
  };

  const menuItems: any = [
    {
      icon: "home",
      label: I18n.t('components.header.home'),
      onclick: () => history.push("/"),
      subMenuItems: [],
    },
    {
      icon: "proposal",
      label: I18n.t('components.header.proposal'),
      onclick: () => history.push("/proposta"),
      subMenuItems: [],
    },
    {
      icon: "tariff",
      label: I18n.t('components.header.tariff'),
      onclick: () => console.log(),
      subMenuItems: [],
    },
    {
      icon: "chart",
      label: I18n.t('components.header.indicators'),
      onclick: () => console.log(),
      subMenuItems: [],
    },
  ];
  return (
    <Root>
      <ExtensionMenuContainer>
        <ExtensionMenu menuItems={menuItems} module="" onChange={handleChange} />
      </ExtensionMenuContainer>
      <ChildrenContainer isOpen={open}>{children}</ChildrenContainer>
    </Root>
  );
};

export default Wrapper;
