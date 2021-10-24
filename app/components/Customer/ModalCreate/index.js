import React, { Fragment, useState } from 'react'
import axios from 'axios'
import { useFormik } from 'formik'
import FormControl from '@material-ui/core/FormControl'
import {
  DateTimePicker,
  KeyboardDateTimePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers'
import { IconButton, Icon, InputAdornment } from '@material-ui/core'
import MomentUtils from '@date-io/moment'
import ClearIcon from '@material-ui/icons/Clear'

import DateFnsUtils from '@date-io/date-fns'
import { ptBR } from 'date-fns/locale'

import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import TextField from '@material-ui/core/TextField'
import Select from '@material-ui/core/Select'
import Button from '@material-ui/core/Button'
import { useCustomerContext } from '../Context'
import { usePropertieContext } from '../../Propertie/Context'
import InputMask from 'react-input-mask'
import Input from '@material-ui/core/Input'
import grey from '@material-ui/core/colors/grey'
import CircularProgress from '@material-ui/core/CircularProgress'
import Box from '@material-ui/core/Box'
import { useAuth0 } from '@auth0/auth0-react'

// it is required to select default locale manually

const CustomInput = (props) => (
  <InputMask {...props}>
    {(inputProps) => <Input placeholder='Número' required {...inputProps} />}
  </InputMask>
)

export default function ModalCreate() {
  const [selectedDate, setSelectedDate] = useState(null)

  const handleDateChange = (date) => {
    setSelectedDate(date)
  }

  const {
    data,
    customers,
    modalCreateOpen,
    setCustomers,
    setData,
    loadingCrud,
    setLoadingCrud,
    setNotificationOpen,
    setMessageNotification,
    setModalCreateOpen,
    handleModalCreateClose,
  } = useCustomerContext()
  const { user } = useAuth0()

  const { properties } = usePropertieContext()

  const formik = useFormik({
    initialValues: {},
    onSubmit: (values, { resetForm }) => {
      setLoadingCrud(true)

      axios
        .post('/api/customers', {
          ...values,
          user_id: user.sub.split('|')[1],
          scheduling: selectedDate ? selectedDate : null,
          status: selectedDate ? 103 : values.status,
        })
        .then((result) => {
          const newPropertie = Object.values(result.data)

          setData([...data, newPropertie])
          setCustomers([...customers, result.data])
          setMessageNotification(result.data.message)
          setNotificationOpen(true)
          setModalCreateOpen(false)
          setLoadingCrud(false)
          setSelectedDate(null)
          resetForm()
        })
    },
  })

  return loadingCrud ? (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        position: 'fixed',
        top: '50%',
        backgroundColor: 'black',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: '9999999999',
        opacity: '0.8',
      }}
    >
      <CircularProgress
        style={{
          position: 'relative',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: grey[50],
        }}
      />
    </Box>
  ) : (
    <Fragment>
      <Dialog
        open={modalCreateOpen}
        onClose={handleModalCreateClose}
        aria-labelledby='form-dialog-title'
        scroll='body'
      >
        <DialogTitle id='form-dialog-title'>Cadastrar Cliente</DialogTitle>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent>
            {/* <DialogContentText>
              To subscribe to this website, please enter your email address
              here. We will send updates occasionally.
            </DialogContentText> */}
            <TextField
              autoFocus
              margin='dense'
              id='name'
              name='name'
              onChange={formik.handleChange}
              label='Nome'
              type='text'
              fullWidth
              required
            />
            {/* <TextField
              margin='dense'
              id='number'
              name='number'
              onChange={formik.handleChange}
              label='Número'
              type='text'
              fullWidth
            /> */}
            <CustomInput
              label='Número'
              mask='(99) 99999-9999'
              type='text'
              fullWidth
              margin='dense'
              id='number'
              name='number'
              onChange={formik.handleChange}
              style={{ marginTop: '14px' }}
            />
            <FormControl fullWidth>
              <InputLabel htmlFor='status'>Status</InputLabel>

              <Select
                defaultValue=''
                inputProps={{ id: 'status', name: 'status' }}
                onChange={formik.handleChange}
                required
              >
                <MenuItem value={101}>Lead</MenuItem>
                <MenuItem value={102}>Atendimento</MenuItem>
                <MenuItem value={103}>Agendamento</MenuItem>
                <MenuItem value={104}>Visita</MenuItem>
                <MenuItem value={105}>Proposta</MenuItem>
                <MenuItem value={106}>Fechamento</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel htmlFor='interest'>Interesses</InputLabel>

              <Select
                defaultValue={[]}
                multiple
                inputProps={{ id: 'interest', name: 'interest' }}
                onChange={formik.handleChange}
              >
                {properties.map(
                  (item) =>
                    item.active && (
                      <MenuItem key={item.id} value={item.id}>
                        {item.title}
                      </MenuItem>
                    )
                )}
              </Select>
            </FormControl>
            <FormControl
              fullWidth
              style={{
                marginTop: '16px',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <MuiPickersUtilsProvider locale={ptBR} utils={DateFnsUtils}>
                <DateTimePicker
                  ampm={false}
                  showTabs={false}
                  style={{ width: '95%' }}
                  disablePast
                  value={selectedDate ? selectedDate : null}
                  required={formik.values.status == 103 ? true : false}
                  onChange={handleDateChange}
                  name='scheduling'
                  placeholder='Data de agendamento'
                  format='dd/MM/yyyy HH:mm'
                  helperText='Esse cliente possui agendamento? Se sim! Então escolha uma data.'
                  leftArrowIcon={<Icon> add_alarm </Icon>}
                  rightArrowIcon={<Icon> snooze </Icon>}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton>
                          <Icon>add_alarm</Icon>
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </MuiPickersUtilsProvider>
              <IconButton
                // style={{ padding: 0 }}
                edge='end'
                size='medium'
                style={{
                  position: 'relative',
                  top: '-11px',
                }}
                disabled={!selectedDate}
                onClick={() => handleDateChange(null)}
              >
                <ClearIcon />
              </IconButton>
            </FormControl>
            <TextField
              id='note'
              name='note'
              value={formik.values.note}
              onChange={formik.handleChange}
              label='Observação'
              multiline
              rows='4'
              margin='normal'
              variant='outlined'
              fullWidth
            />
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
    </Fragment>
  )
}
