import React from 'react'
import { Route } from 'react-router-dom'
import { withAuthenticationRequired } from '@auth0/auth0-react'
import CircularProgress from '@material-ui/core/CircularProgress'
import Loading from 'dan-components/Loading'

const ProtectedRoute = ({ component, ...args }) => (
  <Route
    component={withAuthenticationRequired(component, {
      onRedirecting: () => {
        return <Loading />
      },
    })}
    {...args}
  />
)

export default ProtectedRoute
