interface CardFilterProps {
  iconType: string;
  status: string;
  value: string;
}

const orderButtonMenuItems = [
  {
    value: "referenceProposal",
    description: "Ref. proposta",
  },
  {
    value: "customerName",
    description: "Nome do cliente",
  },
  {
    value: "codeRespSeller",
    description: "Responsável",
  },
  {
    value: "idTransport",
    description: "Modal",
  },
  {
    value: "idOrigin",
    description: "Origem",
  },
  {
    value: "idDestination",
    description: "Destino",
  },
  {
    value: "openingDate",
    description: "Dt. abertura",
  },
  {
    value: "validityDate",
    description: "Dt. validade",
  },
];

const cardFilters: CardFilterProps[] = [
  {
    iconType: "",
    value: "170",
    status: "Abertas",
  },
  {
    iconType: "",
    value: "61",
    status: "Ag. ret. cliente",
  },
  {
    iconType: "",
    value: "5",
    status: "Renegociação",
  },
  {
    iconType: "",
    value: "12",
    status: "Rejeitadas",
  },
  {
    iconType: "",
    value: "28",
    status: "Aprovadas",
  },
  {
    iconType: "truck",
    value: "10",
    status: "Rodoviário",
  },
  {
    iconType: "plane",
    value: "40",
    status: "Aéreo",
  },
  {
    iconType: "ship",
    value: "160",
    status: "Marítimo",
  },
];

const menuItems = {
  dateRanges: [
    { label: "Últimos 7 dias", lastDays: 7 },
    { label: "Últimos 15 dias", lastDays: 14 },
    { label: "Últimos 30 dias", lastDays: 29 },
    { label: "Último trimestre", lastDays: 89 },
    { label: "Início do mês até hoje", lastDays: -1 },
    { label: "Customizado" },
  ],
  processTypes: [
    "Frete - Importação",
    "Frete - Exportação",
    "Desembaraço",
    "Consultoria",
    "FTA",
  ],
  modal: ["Aéreo", "Marítimo", "Rodoviário"],
};

// mock
const TableRows = (): any => {
  const array: any = [];
  Array.from(Array(20), (value, i: number) => {
    const item = {
      key: i,
      reference: "PC-000004/20",
      client: "EUROFARMA LABORATORIOS",
      origin: "GUARULHOS",
      destination: "MANAUS",
      opening: "26/01/2021",
      shelfLife: "10/07/2023",
      iconterm: "CFR",
      numio: "000001/20",
      responsible: "Cristina A.",
      status: "aberto",
      type: "importation",
    };
    return array.push(item);
  });
  return array;
};

export { cardFilters, TableRows, orderButtonMenuItems, menuItems };
