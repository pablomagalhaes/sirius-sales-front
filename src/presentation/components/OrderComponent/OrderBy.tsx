import React, { useState, useEffect } from 'react'

import { Select, MenuItem } from '@material-ui/core/'
import {
  ArrowIconContainer,
  DropdownMenuContainer,
  ListTextSpan,
  OrderByContainer
} from './OrderByStyle'
import { I18n } from 'react-redux-i18n'
import ArrowDown from '../../../application/icons/ArrowDown'
import UpArrow from '../../../application/icons/UpArrow'
import { OrderTypes } from '../../../application/enum/enum'

export interface OrderButtonMenuItems {
  value: string
  description: string
}

interface OrderByProps {
  id: string
  orderButtonMenuItems: OrderButtonMenuItems[]
  initialOrder: string
  isOrderAsc: boolean
  handleChange: Function
  tariffModalChange?: string
}

const OrderBy: React.FC<OrderByProps> = ({
  id,
  orderButtonMenuItems,
  initialOrder,
  isOrderAsc,
  handleChange,
  tariffModalChange
}) => {
  const [openedOrderSelect, setOpenedOrderSelect] = useState(false)
  const [orderAsc, setOrderAsc] = useState(isOrderAsc)
  const [orderBy, setOrderBy] = useState<string>(initialOrder)

  const handleOrderDirection = (): string => {
    if (orderAsc) {
      return OrderTypes.Ascendent
    }
    return OrderTypes.Descendent
  }

  useEffect(() => {
    handleChange((filter: any) => ({ ...filter, sort: `${orderBy},${handleOrderDirection()}` }))
  }, [orderAsc, orderBy])

  useEffect(() => {
    setOrderBy(initialOrder)
  }, [tariffModalChange])

  return (
    <OrderByContainer>
      <ListTextSpan>{I18n.t('components.OrderBy.order')}</ListTextSpan>
      <DropdownMenuContainer showArrow={openedOrderSelect}>
        <Select
          className="select-style"
          disableUnderline
          onChange={(e) => setOrderBy(String(e.target.value))}
          onOpen={() => setOpenedOrderSelect(!openedOrderSelect)}
          placeholder={orderBy}
          value={orderBy}
          id={id}
          data-testid={'order-by-test'}
        >
          {orderButtonMenuItems.map((item) => (
            <MenuItem
              key={`${String(item.value)}_key`}
              value={item.value}
            >
              <span>{item.description}</span>
            </MenuItem>
          ))}
        </Select>
      </DropdownMenuContainer>
      <ArrowIconContainer
        onClick={() => setOrderAsc((order) => !order)}
        $rotate={orderAsc}
      >
        {orderAsc ? <ArrowDown data-testid={'arrow-down'}/> : <UpArrow data-testid={'arrow-up'}/>}
      </ArrowIconContainer>
    </OrderByContainer>
  )
}

export default OrderBy
