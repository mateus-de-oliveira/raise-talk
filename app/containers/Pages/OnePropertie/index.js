import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Helmet } from 'react-helmet'
import brand from 'dan-api/dummy/brand'
import { PapperBlock } from 'dan-components'
import Accordion from '@material-ui/core/Accordion'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { withStyles } from '@material-ui/core/styles'
import FormControl from '@material-ui/core/FormControl'
import MenuItem from '@material-ui/core/MenuItem'
import InputLabel from '@material-ui/core/InputLabel'
import Select from '@material-ui/core/Select'
import IconButton from '@material-ui/core/IconButton'
import ArrowForward from '@material-ui/icons/ArrowForward'
import ArrowBack from '@material-ui/icons/ArrowBack'

import 'dan-styles/vendors/slick-carousel/slick-carousel.css'
import 'dan-styles/vendors/slick-carousel/slick.css'
import 'dan-styles/vendors/slick-carousel/slick-theme.css'
import Slider from 'react-slick'

import { useParams } from 'react-router'

function SampleNextArrow(props) {
  const { onClick } = props
  return (
    <IconButton className='nav-next' onClick={onClick}>
      <ArrowForward />
    </IconButton>
  )
}

function SamplePrevArrow(props) {
  const { onClick } = props
  return (
    <IconButton className='nav-prev' onClick={onClick}>
      <ArrowBack />
    </IconButton>
  )
}

const styles = (theme) => ({
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightMedium,
  },
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  formControl: {
    width: '50%',
    margin: '0 auto',
  },
  item: {
    textAlign: 'center',
    '& img': {
      margin: '10px auto',
    },
  },
})

function OnePropertie(props) {
  const { classes } = props

  const title = brand.name + ' - Dashboard'
  const description = brand.desc
  const [propertie, setPropertie] = useState({})
  const [imgData, setImgData] = useState([])
  const { id } = useParams()

  const settings = {
    dots: true,
    infinite: true,
    centerMode: true,
    speed: 500,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  }

  useEffect(() => {
    axios.get('/api/properties/' + id).then((result) => {
      setImgData(result.data.path_images)
      setPropertie(result.data)
    })
  }, [])

  return (
    <div>
      <Helmet>
        <title>{propertie.title}</title>
        <meta name='description' content={propertie.description} />
        <meta property='og:title' content={propertie.title} />
        <meta property='og:description' content={propertie.description} />
        <meta property='og:type' content='website' />
        <meta
          property='og:image'
          itemprop='image primaryImageOfPage'
          content={imgData[0]}
        />
        <meta property='twitter:title' content={propertie.title} />
        <meta property='twitter:description' content={propertie.description} />
      </Helmet>
      <PapperBlock title={propertie.title} desc=''>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography className={classes.heading}>
              Detalhes do imóvel
            </Typography>
          </AccordionSummary>
          <AccordionDetails>{propertie.description}</AccordionDetails>
        </Accordion>
        <div className={classes.root} style={{ marginTop: 30 }}>
          <div className='container custom-arrow'>
            <Slider {...settings}>
              {imgData.map((item, index) => (
                <div key={index.toString()} className={classes.item}>
                  <img src={item} alt={item} />
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </PapperBlock>
    </div>
  )
}

export default withStyles(styles)(OnePropertie)
