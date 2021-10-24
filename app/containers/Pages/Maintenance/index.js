import React, { Fragment } from 'react'
import { Helmet } from 'react-helmet'
import brand from 'dan-api/dummy/brand'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Avatar from '@material-ui/core/Avatar'
import Build from '@material-ui/icons/Build'
import Hidden from '@material-ui/core/Hidden'
import Settings from '@material-ui/icons/SettingsApplications'
import Warning from '@material-ui/icons/Warning'
import { LoginForm } from 'dan-components'
import Paper from '@material-ui/core/Paper'
import classNames from 'classnames'
import logo from 'dan-images/logo-vertical.svg'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import ArrowForward from '@material-ui/icons/ArrowForward'
import styles from 'dan-components/Forms/user-jss'
import { useUserContext } from '../../App/Context'
// const styles = (theme) => ({
//   container: {
//     textAlign: 'center',
//   },
//   root: {
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//     height: '100%',
//   },
//   title: {
//     color: '#FFF',
//   },
//   subtitle: {
//     color: '#FFF',
//   },
//   paper: {
//     margin: 'auto',
//     padding: 40,
//     width: '90%',
//     [theme.breakpoints.up('sm')]: {
//       width: 600,
//       height: 300,
//     },
//     textAlign: 'center',
//   },
//   artwork: {
//     display: 'flex',
//     justifyContent: 'center',
//     marginBottom: 30,
//   },
//   icon: {
//     margin: '10px 20px',
//     background: 'rgba(255,255,255,0.6)',
//     color:
//       theme.palette.type === 'dark'
//         ? theme.palette.primary.dark
//         : theme.palette.primary.main,
//     width: 100,
//     height: 100,
//     boxShadow: theme.shadows[4],
//     '& svg': {
//       fontSize: 64,
//     },
//   },
// })

function Maintenance(props) {
  const title = brand.name + ' - Maintenance'
  const description = brand.desc
  const { classes } = props
  const { userAws } = useUserContext()

  return (
    <div className={classes.root}>
      <Helmet>
        <title>{title}</title>
        <meta name='description' content={description} />
        <meta property='og:title' content={title} />
        <meta property='og:description' content={description} />
        <meta property='twitter:title' content={title} />
        <meta property='twitter:description' content={description} />
      </Helmet>
      <Fragment>
        <div className={classes.container}>
          <div className={classes.userFormWrap}>
            <Paper className={classNames(classes.paperWrap, classes.petal)}>
              <div
                style={{
                  maxWidth: '7rem',
                  margin: '0 auto',
                  marginBottom: '20px',
                }}
              >
                <img src={logo} alt={brand.name} />
              </div>
              <Typography
                variant='caption'
                className={classes.subtitle}
                gutterBottom
                align='center'
              >
                Clique no botão abaixo para fazer o pagamento
              </Typography>
              <div className={classes.btnArea}>
                <form action='/api/create-checkout-session' method='POST'>
                  {/* <!-- Note: If using PHP set the action to /create-checkout-session.php --> */}
                  <input
                    type='hidden'
                    name='priceId'
                    value='price_1JYYBzGpSHd5qufiQYgW2Onf'
                  />
                  <input
                    type='hidden'
                    name='stripe_id'
                    value={userAws.stripe_id}
                  />

                  <Button
                    variant='contained'
                    color='primary'
                    size='large'
                    type='submit'
                  >
                    Continuar
                    <ArrowForward
                      className={classNames(
                        classes.rightIcon,
                        classes.iconSmall
                      )}
                    />
                  </Button>
                </form>
              </div>
            </Paper>
          </div>
        </div>
      </Fragment>
    </div>
  )
}

Maintenance.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(Maintenance)
