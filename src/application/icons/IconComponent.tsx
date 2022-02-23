import React from 'react'
import PlaneIcon from './PlaneIcon'
import ShipIcon from './ShipIcon'
import TruckIcon from './TruckIcon'
import UserIcon from './UserIcon'
import SearchIcon from './SearchIcon'

interface IconComponentProps {
  name: string
  defaultColor: string
}

const IconComponent = ({ name, ...props }: IconComponentProps): JSX.Element => {
  switch (name) {
    case 'AIR':
      return <PlaneIcon {...props} />
    case 'SEA':
      return <ShipIcon {...props} />
    case 'LAND':
      return <TruckIcon {...props} />
    case 'user':
      return <UserIcon {...props} />
    case 'search':
      return <SearchIcon {...props} />
    default:
      return <div />
  }
}

export default IconComponent
