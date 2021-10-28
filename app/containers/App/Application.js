import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { PropTypes } from 'prop-types'
import { Switch, Route } from 'react-router-dom'
import Dashboard from '../Templates/Dashboard'
import { ThemeContext } from './ThemeWrapper'
import {
  Parent,
  DashboardPage,
  BlankPage,
  Propertie,
  Form,
  Table,
  Error,
  NotFound,
  Maintenance,
  Customer,
  Login,
} from '../pageListAsync'

import Outer from '../Templates/Outer'
import { useAuth0 } from '@auth0/auth0-react'
import { usePropertieContext } from '../../components/Propertie/Context'
import { useUserContext } from './Context'
import ModalNumber from './ModalNumber'

function Application(props) {
  const { user } = useAuth0()
  const { setUserId } = usePropertieContext()
  const { setModalNumber, modalNumber } = useUserContext()

  useEffect(() => {
    setUserId(user.sub.split('|')[1])
    axios
      .get('/api/users/' + user.sub.split('|')[1])
      .then((result) => {
        if (result.data.number == undefined) {
          setModalNumber(true)
        }
      })
      .catch((error) => {
        axios
          .post('/api/users', { ...user, id: user.sub.split('|')[1] })
          .then((result) => setModalNumber(true))
      })
  }, [])

  const { history } = props
  const changeMode = useContext(ThemeContext)

  return (
    <Dashboard history={history} changeMode={changeMode}>
      <Switch>
        <Route exact path='/dashboard' component={BlankPage} />
        <Route path='/dashboard/imoveis' component={Propertie} />
        <Route path='/dashboard/clientes' component={Customer} />

        {/* <Route path="/app/dashboard" component={DashboardPage} />
      <Route path="/app/form" component={Form} />
      <Route path="/app/table" component={Table} />
      <Route path="/app/page-list" component={Parent} />
      <Route path="/app/pages/not-found" component={NotFound} />
      <Route path="/app/pages/error" component={Error} /> */}
        <Route component={NotFound} />
      </Switch>
      <ModalNumber />
    </Dashboard>
  )
}

Application.propTypes = {
  history: PropTypes.object.isRequired,
}

export default Application
