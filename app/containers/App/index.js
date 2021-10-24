import React, { useState, useEffect } from 'react'
import { Switch, Route } from 'react-router-dom'
import NotFound from 'containers/Pages/Standalone/NotFoundDedicated'
import Auth from './Auth'
import Application from './Application'
import LoginDedicated from '../Pages/Standalone/LoginDedicated'
import ThemeWrapper from './ThemeWrapper'
import ProtectedRoute from '../../auth/ProtectedRoute'
import { OnePropertie } from '../pageListAsync'

window.__MUI_USE_NEXT_TYPOGRAPHY_VARIANTS__ = true

function App() {
  return (
    <ThemeWrapper>
      <Switch>
        <Route path='/' exact component={LoginDedicated} />
        <Route path='/login' component={LoginDedicated} />
        <ProtectedRoute path='/dashboard' component={Application} />
        <Route path='/imoveis/:id' component={OnePropertie} />
        <Route component={Auth} />
        <Route component={NotFound} />
      </Switch>
    </ThemeWrapper>
  )
}

export default App
