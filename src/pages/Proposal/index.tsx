import React from "react";
import { FloatingButton } from "fiorde-fe-components";
const Proposal = () => {
  const items = [
    {
      iconType: "edit",
      label: "Editar",
      onClick: () => console.log("click"),
    },
    {
      iconType: "duplicate",
      label: "Duplicar",
      onClick: () => console.log("click"),
    },
    {
      iconType: "cancel",
      label: "Cancelar",
      onClick: () => console.log("click"),
    },
    {
      iconType: "approved",
      label: "Definir como aprovada",
      onClick: () => console.log("click"),
    }
  ];
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <span style={{ justifySelf: "flex-start" }}>comercial/proposta</span>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          height: "100%",
        }}
      >
        <FloatingButton menuItems={items} label="Novo item" />
      </div>
    </div>
  );
};

export default Proposal;
