import React, { Fragment } from 'react'
import Snackbar from '@material-ui/core/Snackbar'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'

import { useCustomerContext } from '../Context'

export default function Notification() {
  const {
    notificationOpen,
    handleNotificationClose,
    messageNotification,
  } = useCustomerContext()

  return (
    <Fragment>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={notificationOpen}
        autoHideDuration={6000}
        onClose={handleNotificationClose}
        ContentProps={{
          'aria-describedby': 'message-id',
        }}
        message={<span id='message-id'>{messageNotification}</span>}
        action={[
          <IconButton
            key='close'
            aria-label='Close'
            color='inherit'
            onClick={(e) => {
              e.preventDefault()
              handleNotificationClose()
            }}
          >
            <CloseIcon />
          </IconButton>,
        ]}
      />
    </Fragment>
  )
}
