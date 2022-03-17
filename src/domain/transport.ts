export interface Transport {
  id: string
  description: string
}

export const TransportList = [
  { id: 'AIR', description: 'Aéreo' },
  { id: 'LAND', description: 'Rodoviário' },
  { id: 'SEA', description: 'Marítimo' }
]
