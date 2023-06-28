export enum ID_ORGANIZATION_TYPE {
    ADMIN = 1,
    OFFICE = 2,
    TRANSPORTER = 3,
    CUSTOMER = 4,
    DRIVER = 5
  }
  
  export enum ID_SHIPPING_TYPE {
    SEA = 4
  }
  
  export enum ID_TRACKING_SIGNAL_STATUS {
    SEM_VEICULO_ASSOCIADO = 1,
    ESPELHADO = 2,
    NAO_ESPELHADO = 3
  }
  
  export const SHOW_TRANSFER = {
    ABERTAS: true,
    FECHADAS: false,
    TODAS: null
  }
  
  export enum ID_DELIVERY_STATUS {
    ON_TIME = 1,
    RISCO_DE_ATRASO = 2,
    ATRASADO = 3
  }
  