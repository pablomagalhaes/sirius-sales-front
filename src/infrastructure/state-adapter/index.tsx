import React, { createContext, useContext, useState } from 'react'

type AppState = any

interface StateAdapterStoreType {
  state: AppState
  updateState: (updatedState: Partial<AppState>) => void
}

export const StateAdapterStore = createContext<StateAdapterStoreType>({} as any)

export const StateAdapterProvider: React.FC<{ initialState: AppState }> = ({
  children,
  initialState
}: any) => {
  const [state, setState] = useState<AppState>(initialState)

  const updateState = (updatedState: Partial<AppState>): void => {
    setState((prevState) => ({
      ...prevState,
      ...updatedState
    }))
  }

  const contextValue: StateAdapterStoreType = {
    state,
    updateState
  }

  return (
    <StateAdapterStore.Provider value={contextValue}>{children}</StateAdapterStore.Provider>
  )
}

export function useAdapter (): any {
  return useContext(StateAdapterStore)
}
