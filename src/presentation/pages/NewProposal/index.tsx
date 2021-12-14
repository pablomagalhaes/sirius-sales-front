import React, { useState } from 'react'
import CostTable from '../../components/CostTable/CostTable'
import ItemModal from '../../components/ItemModal/ItemModal'
import { MainDiv } from './style'

const NewProposal = (): JSX.Element => {
  const [open, setOpen] = useState(false)
  const handleOpen = (): void => setOpen(true)
  const handleClose = (): void => setOpen(false)
  const handleAdd = (item): void => console.log(item)
  return (
    <MainDiv>
      <button onClick={handleOpen}>Abrir Modal </button>
       <ItemModal handleAdd={handleAdd} setOpen={handleOpen} open={open} setClose={handleClose} title='Editar Item'/>
      <CostTable title={'Origem'} totalCostLabel={'Total custos origem:'} />
      <CostTable title={'Destino'} totalCostLabel={'Total custos destino:'} />
    </MainDiv>
  )
}

export default NewProposal
