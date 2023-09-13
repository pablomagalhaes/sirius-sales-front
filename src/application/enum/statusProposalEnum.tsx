export enum StatusProposalEnum {
  ABERTA = 1,
  AGUARDANDO_RETORNO_CLIENTE = 2,
  EM_REVISAO = 3,
  APROVADA = 4,
  REJEITADA = 5,
  CANCELADA = 6,
  CANCELAMENTO_AUTOMATICO = 7
}

export enum StatusProposalStringEnum {
  ABERTA = 'open',
  AGUARDANDO_RETORNO_CLIENTE = 'awaitingCustomerReturn',
  EM_REVISAO = 'revision',
  APROVADA = 'approved',
  REJEITADA = 'discard',
  CANCELADA = 'canceled',
  CANCELAMENTO_AUTOMATICO = 'automaticallyCanceled',
}

export enum StatusStaggeredProposalStringEnum {
  ABERTA = 'open',
  AGUARDANDO_RETORNO_CLIENTE = 'awaitingCustomerReturn',
  EM_REVISAO = 'revision',
  APROVADA = 'approved',
  REJEITADA = 'discard',
  CANCELADA = 'canceled',
  CANCELAMENTO_AUTOMATICO = 'automaticallyCanceled',
}
