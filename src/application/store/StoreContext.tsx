import { createContext } from 'react'

export interface Item {
  amount: string
  codUn: string
  cubage: string | null
  dangerous: boolean
  diameter: string | null
  height: string | null
  imo: string | null
  length: string | null
  rawWeight: string | null
  type: string | null
  width: string | null
  id: number | null
  stack: boolean
}

interface ValueContextType {
  items: Item[]
}

export const StoreProvider = createContext<ValueContextType | any>('')
