import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { withStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import Snackbar from '@material-ui/core/Snackbar'
import CloseIcon from '@material-ui/icons/Close'
import Switch from '@material-ui/core/Switch'
import FormGroup from '@material-ui/core/FormGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import { useFormik, Field } from 'formik'

import Chip from '@material-ui/core/Chip'
import MUIDataTable from 'mui-datatables'
import CircularProgress from '@material-ui/core/CircularProgress'
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/Edit'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import TextField from '@material-ui/core/TextField'

const styles = (theme) => ({
  table: {
    '& > div': {
      overflow: 'auto',
    },
    '& table': {
      '& td': {
        wordBreak: 'keep-all',
      },
      [theme.breakpoints.down('md')]: {
        '& td': {
          height: 60,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        },
      },
    },
  },
})

const url = '/api/properties'
const label = { inputProps: { 'aria-label': 'Switch demo' } }

function AdvFilter(props) {
  const [properties, setProperties] = useState([])
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [notificationDeleteOpen, setNotificationDeleteOpen] = useState(false)
  const [notificationCreateOpen, setNotificationCreateOpen] = useState(false)
  const [ModalCreateOpen, setModalCreateOpen] = useState(false)
  const [messageDelete, setMessageDelete] = useState('')
  const [messageCreate, setMessageCreate] = useState('')
  const [propertieSelected, setPropertieSelected] = useState('')

  const formik = useFormik({
    initialValues: {
      active: true,
    },
    onSubmit: (values, { resetForm }) => {
      axios.post('/api/properties', { ...values }).then((result) => {
        const newPropertie = Object.values(result.data)

        setData([...data, newPropertie])
        setProperties([...properties, result.data])
        setMessageCreate(result.data.message)
        setNotificationCreateOpen(true)
        setModalCreateOpen(false)
        resetForm()
      })
    },
  })

  useEffect(() => {
    axios
      .get('/api/properties')
      .then(function(response) {
        setProperties(response.data)
        let result = response.data.map((items) => Object.values(items))

        setData(result)
      })
      .catch(function(error) {
        console.log(error)
      })
  }, [])

  function handleClickOpen() {
    setOpen(true)
  }

  function handleClose() {
    setOpen(false)
  }

  function handleDeleteClose() {
    setNotificationDeleteOpen(false)
  }

  function handleDeleteOpen() {
    setNotificationDeleteOpen(true)
  }

  const handleModalCreateOpen = () => setModalCreateOpen(true)
  const handleModalCreateClose = () => setModalCreateOpen(false)

  const columns = [
    {
      name: 'Name',
      options: {
        filter: true,
      },
    },

    {
      name: 'Status',
      options: {
        filter: true,
        customBodyRender: (value) => {
          if (value === true || value === 'true') {
            return <Chip label='Ativo' color='secondary' />
          }
          if (value !== true) {
            return <Chip label='Inativo' color='primary' />
          }
          return <Chip label='Unknown' />
        },
      },
    },
    {
      name: 'Data de criação',
      options: {
        filter: false,
      },
    },
    {
      name: 'Data de atualização',
      options: {
        filter: false,
      },
    },
    {
      name: 'Ações',
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value) => {
          return (
            <>
              <IconButton aria-label='Edit'>
                <EditIcon />
              </IconButton>
              <IconButton
                aria-label='Delete'
                onClick={() => {
                  const result = properties.filter((item) => item.id === value)

                  setPropertieSelected(result)
                  handleClickOpen()
                }}
              >
                <DeleteIcon />
              </IconButton>
            </>
          )
        },
      },
    },
  ]

  const options = {
    filterType: 'dropdown',
    responsive: 'vertical',
    print: true,
    rowsPerPage: 10,
    page: 0,
  }

  const { classes } = props

  return loading ? (
    <CircularProgress
      style={{ display: 'block', margin: '0 auto' }}
      color='secondary'
    />
  ) : (
    <React.Fragment>
      <Dialog
        open={ModalCreateOpen}
        onClose={handleModalCreateClose}
        aria-labelledby='form-dialog-title'
      >
        <DialogTitle id='form-dialog-title'>Cadastrar imóvel</DialogTitle>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent>
            <DialogContentText>
              To subscribe to this website, please enter your email address
              here. We will send updates occasionally.
            </DialogContentText>
            <TextField
              autoFocus
              margin='dense'
              id='name'
              name='title'
              value={formik.values.title}
              onChange={formik.handleChange}
              label='Nome'
              type='text'
              fullWidth
            />
            <TextField
              id='description'
              name='description'
              value={formik.values.description}
              onChange={formik.handleChange}
              label='Descrição'
              multiline
              rows='4'
              margin='normal'
              variant='outlined'
              fullWidth
            />
            <FormGroup>
              <FormControlLabel
                control={<Switch defaultChecked />}
                label='Ativar imóvel?'
                name='active'
                value={formik.values.active}
                onChange={formik.handleChange}
              />
            </FormGroup>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleModalCreateClose} color='primary'>
              Cancelar
            </Button>
            <Button type='submit' color='primary'>
              Cadastrar
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={notificationDeleteOpen}
        autoHideDuration={6000}
        onClose={handleDeleteClose}
        ContentProps={{
          'aria-describedby': 'message-id',
        }}
        message={<span id='message-id'>{messageDelete}</span>}
        action={[
          <IconButton
            key='close'
            aria-label='Close'
            color='inherit'
            onClick={(e) => {
              e.preventDefault()
              handleDeleteClose()
            }}
          >
            <CloseIcon />
          </IconButton>,
        ]}
      />
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={notificationCreateOpen}
        autoHideDuration={6000}
        onClose={() => setNotificationCreateOpen(false)}
        ContentProps={{
          'aria-describedby': 'message-id',
        }}
        message={<span id='message-id'>{messageCreate}</span>}
        action={[
          <IconButton
            key='close'
            aria-label='Close'
            color='inherit'
            onClick={(e) => {
              e.preventDefault()
              setNotificationCreateOpen(false)
            }}
          >
            <CloseIcon />
          </IconButton>,
        ]}
      />
      <Button
        variant='contained'
        color='primary'
        style={{ display: 'block', margin: '0 auto 20px auto' }}
        onClick={handleModalCreateOpen}
      >
        CRIAR IMÓVEL
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>
          {'Tem certeza que deseja excluir esse empreendimento?'}
        </DialogTitle>
        {/* <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            
          </DialogContentText>
        </DialogContent> */}
        {/* <Button onClick={handleClick}>Open simple snackbar</Button> */}

        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button
            onClick={async () => {
              axios
                .delete('/api/properties', {
                  data: { id: propertieSelected[0].id },
                })
                .then((result) => {
                  setMessageDelete(result.data.message)

                  const aux = data.filter(
                    (item) => item[4] !== propertieSelected[0].id
                  )

                  setData(aux)
                  setNotificationDeleteOpen(true)
                  handleClose()
                })
                .catch((error) => console.log(error))
            }}
            color='primary'
            autoFocus
          >
            Confirmar exclusão
          </Button>
        </DialogActions>
      </Dialog>
      <div className={classes.table}>
        <MUIDataTable
          title='Tabela de imóveis'
          data={data}
          columns={columns}
          options={options}
        />
      </div>
    </React.Fragment>
  )
}

AdvFilter.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(AdvFilter)
