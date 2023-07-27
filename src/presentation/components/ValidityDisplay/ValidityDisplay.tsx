import React from 'react'
import { ControlledToolTip } from 'fiorde-fe-components'
import { IconDisplay, RedColorSpan } from './ValidityDisplayStyles'
import { I18n } from 'react-redux-i18n'
import WarnIconClicked from '../../../application/icons/WarnClicked'
import AlertClickedIcon from '../../../application/icons/AlertClicked'
import moment from 'moment'

const ValidityDisplay = (props: any): JSX.Element => {
  const { validity } = props
  const today = moment().startOf('day')
  const date = moment(validity, 'DD/MM/YYYY')
  const timeDiff = date.diff(today, 'days')
  if (timeDiff < 0) {
    return (
        <IconDisplay>
        <ControlledToolTip
            placement="top"
            title={I18n.t('pages.tariff.tariffTable.overdue')}
            open={true}
            disabled={true}
            getTitle={false}
        >
            <div className='icon'><AlertClickedIcon/></div>
        </ControlledToolTip>
        <RedColorSpan>{validity}</RedColorSpan>
        </IconDisplay>
    )
  } else if (timeDiff <= 7) {
    return (
        <IconDisplay>
        <ControlledToolTip
            placement="top"
            title={`${String(I18n.t('pages.tariff.tariffTable.validUntil'))} ${timeDiff} ${String(I18n.t('pages.tariff.tariffTable.days'))}`}
            open={true}
            disabled={true}
            getTitle={false}
        >
            <div className='icon'><WarnIconClicked/></div>
        </ControlledToolTip>
        {validity}
        </IconDisplay>
    )
  }
  return <>{validity}</>
}

export default ValidityDisplay
