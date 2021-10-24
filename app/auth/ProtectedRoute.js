import React from 'react'
import { Route } from 'react-router-dom'
import { withAuthenticationRequired } from '@auth0/auth0-react'
import CircularProgress from '@material-ui/core/CircularProgress'

const ProtectedRoute = ({ component, ...args }) => (
  <Route
    component={withAuthenticationRequired(component, {
      onRedirecting: () => {
        return (
          <CircularProgress
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
            color='primary'
          />
        )
      },
    })}
    {...args}
  />
)

export default ProtectedRoute
