import styled from "styled-components";

const Root = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  #extension_root_container {
    div {
      div.MuiDrawer-paper {
        left: 88px;
        top: 64px;
      }
    }
  }
`;
const ExtensionMenuContainer = styled.div`
  position: fixed;
`;

const ChildrenContainer = styled.div`
  padding-left: ${(props) => props.isOpen ? '200px' : '58px'};
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  transition: padding-left 0.2s;
  transition-timing-function: linear;
`;

export { Root, ChildrenContainer, ExtensionMenuContainer };
