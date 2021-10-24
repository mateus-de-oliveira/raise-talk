import React, { Fragment, useState } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import classNames from 'classnames'

import Button from '@material-ui/core/Button'

import Typography from '@material-ui/core/Typography'

import ArrowForward from '@material-ui/icons/ArrowForward'
import Paper from '@material-ui/core/Paper'
import Hidden from '@material-ui/core/Hidden'
import brand from 'dan-api/dummy/brand'
// import logo from 'dan-images/logo.svg'
import logo from 'dan-images/logo-vertical.svg'
import styles from './user-jss'
import { ContentDivider } from '../Divider'
import { useAuth0 } from '@auth0/auth0-react'

function LoginForm(props) {
  const { classes } = props
  const { loginWithRedirect } = useAuth0()

  return (
    <Fragment>
      <Paper className={classNames(classes.paperWrap, classes.petal)}>
        <div
          style={{ maxWidth: '7rem', margin: '0 auto', marginBottom: '20px' }}
        >
          <img src={logo} alt={brand.name} />
        </div>
        <Typography
          variant='caption'
          className={classes.subtitle}
          gutterBottom
          align='center'
        >
          Clique no botão abaixo para fazer login
        </Typography>
        <div className={classes.btnArea}>
          <Button
            variant='contained'
            color='primary'
            size='large'
            onClick={loginWithRedirect}
          >
            Continuar
            <ArrowForward
              className={classNames(classes.rightIcon, classes.iconSmall)}
            />
          </Button>
        </div>
      </Paper>
    </Fragment>
  )
}

LoginForm.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(LoginForm)
