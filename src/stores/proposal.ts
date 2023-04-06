import create from 'zustand'

const proposalStore = create(set => ({
    proposals: [],
    addProposal: (proposal) => {
        set(state => ({ proposal: [...state]  }))
    }
}))