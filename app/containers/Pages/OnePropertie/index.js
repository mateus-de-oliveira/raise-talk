import React, { useState, useEffect, Fragment } from 'react'
import axios from 'axios'

import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Slider from 'react-slick'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import Dialog from '@material-ui/core/Dialog'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import AddShoppingCart from '@material-ui/icons/AddShoppingCart'
import Slide from '@material-ui/core/Slide'
import Button from '@material-ui/core/Button'
// import imgData from 'dan-api/images/imgData'
import Chip from '@material-ui/core/Chip'
import TextField from '@material-ui/core/TextField'
import Type from 'dan-styles/Typography.scss'
import 'dan-styles/vendors/slick-carousel/slick-carousel.css'
import 'dan-styles/vendors/slick-carousel/slick.css'
import 'dan-styles/vendors/slick-carousel/slick-theme.css'
import { Rating } from 'dan-components'
import styles from './product-jss'
import { useParams } from 'react-router'
import { LocationMap } from 'dan-components'
import Accordion from '@material-ui/core/Accordion'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import logo from 'dan-images/logo.svg'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import Loading from 'dan-components/Loading'

const Transition = React.forwardRef(function Transition(props, ref) {
  // eslint-disable-line
  return <Slide direction='up' ref={ref} {...props} />
})

function OnePropertie(props) {
  const [propertie, setPropertie] = useState({})
  const [imgData, setImgData] = useState([])
  const [getThumb, setGetThumb] = useState([])
  const { id } = useParams()

  const [loading, setLoading] = useState(true)

  const { classes } = props

  useEffect(() => {
    axios
      .get('/api/properties/' + id)
      .then((result) => {
        setPropertie(result.data)
        setImgData(result.data.path_images)
      })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const getThumbAux = imgData.map((a) => {
      return a
    })

    setGetThumb(getThumbAux)
  }, [imgData])

  const settings = {
    customPaging: (i) => (
      <a>
        <img src={getThumb[i]} alt='thumb' />
      </a>
    ),
    infinite: true,
    dots: true,
    slidesToShow: 1,
    slidesToScroll: 1,
  }

  return loading ? (
    <Loading />
  ) : (
    <>
      <AppBar
        className={classes.appBar}
        style={{
          height: '100%',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Toolbar
          style={{
            display: 'flex',
            flexDirection: 'column',
            marginTop: '50px',
          }}
        >
          <Typography
            variant='h6'
            noWrap
            color='inherit'
            className={classes.flex}
          >
            Loteamento portal dos ventos
          </Typography>
          <div className={classes.ratting}>
            <Rating value={5} max={5} readOnly />
          </div>
        </Toolbar>

        <div>
          <div className='container thumb-nav' style={{ padding: '16px' }}>
            <Slider {...settings}>
              {imgData.map((item, index) => {
                if (index >= 5) {
                  return false
                }
                return (
                  <div key={index.toString()} className={classes.item}>
                    <img src={item} alt={item} />
                  </div>
                )
              })}
            </Slider>
          </div>

          <div style={{ padding: '16px' }}>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography className={classes.heading}>
                  Descrição do imóvel
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <TextField
                  id='description'
                  name='description'
                  value={propertie.description}
                  disabled
                  multiline
                  InputProps={{
                    style: { color: 'black', margin: 0 },
                  }}
                  rows='10'
                  margin='normal'
                  variant='outlined'
                  fullWidth
                />
              </AccordionDetails>
            </Accordion>
          </div>

          <div style={{ padding: '16px' }}>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography className={classes.heading}>Localização</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <LocationMap
                  view={true}
                  latitude={propertie.location.latitude}
                  longitude={propertie.location.longitude}
                />
              </AccordionDetails>
            </Accordion>
          </div>
        </div>
        <div>
          <a href='https://raisetalk.com.br' target='_blank'>
            <img
              src={logo}
              alt='Logo da Raise Talk'
              style={{ width: '30%', margin: 16 }}
            />
          </a>
        </div>
      </AppBar>
    </>
  )
}

export default withStyles(styles)(OnePropertie)
