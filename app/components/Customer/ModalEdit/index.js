import React, { Fragment, useState } from 'react'
import axios from 'axios'
import { useFormik } from 'formik'
import FormControl from '@material-ui/core/FormControl'
import Loading from 'dan-components/Loading'

import {
  DateTimePicker,
  KeyboardDateTimePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers'
import { IconButton, Icon, InputAdornment, Grid } from '@material-ui/core'
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

const CustomInput = (props) => (
  <InputMask {...props}>
    {(inputProps) => <Input placeholder='Número' required {...inputProps} />}
  </InputMask>
)

export default function ModalCreate() {
  const handleDateChange = (date) => {
    setSelectedDate(date)
  }

  const {
    data,
    customers,
    modalEditOpen,
    setCustomers,
    loadingCrudEdit,
    setLoadingCrudEdit,
    setData,
    setNotificationOpen,
    setMessageNotification,
    setModalEditOpen,
    handleModalEditClose,
    customerSelected,
  } = useCustomerContext()

  const { properties } = usePropertieContext()
  const [selectedDate, setSelectedDate] = useState(
    new Date(customerSelected.scheduling)
  )
  const formik = useFormik({
    initialValues: {
      ...customerSelected,
      interest:
        customerSelected.interest == undefined ? [] : customerSelected.interest,
    },
    enableReinitialize: true,
    onSubmit: (values, { resetForm }) => {
      setLoadingCrudEdit(true)
      axios
        .put('/api/customers', {
          ...values,
          scheduling: selectedDate ? selectedDate : null,
          status: selectedDate ? 103 : values.status,
        })
        .then(async (result) => {
          let newCustomers = customers.map((item) => {
            if (item.id === result.data.id) {
              item = result.data
            }

            return item
          })
          setCustomers(newCustomers)
          let newCustomersAux = await newCustomers.map((items) =>
            Object.values(items)
          )

          setData(newCustomersAux)
          setMessageNotification(result.data.message)
          setNotificationOpen(true)
          setModalEditOpen(false)
          setLoadingCrudEdit(false)
        })
    },
  })

  return loadingCrudEdit ? (
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
      <Loading />
    </Box>
  ) : (
    <Fragment>
      <Dialog
        open={modalEditOpen}
        onClose={handleModalEditClose}
        aria-labelledby='form-dialog-title'
        scroll='body'
      >
        <DialogTitle id='form-dialog-title'>Atualizar Cliente</DialogTitle>
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
              value={formik.values.name}
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
              value={formik.values.number}
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
              value={formik.values.number}
              onChange={formik.handleChange}
              style={{ marginTop: '14px' }}
            />
            <FormControl fullWidth>
              <InputLabel htmlFor='status'>Status</InputLabel>

              <Select
                inputProps={{ id: 'status', name: 'status' }}
                required
                onChange={formik.handleChange}
                value={formik.values.status}
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
                value={formik.values.interest}
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
              {console.log(formik.values.status == 103 ? true : false)}
              <MuiPickersUtilsProvider locale={ptBR} utils={DateFnsUtils}>
                <DateTimePicker
                  style={{ width: '95%' }}
                  ampm={false}
                  showTabs={false}
                  disablePast
                  value={selectedDate ? selectedDate : null}
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
            <Button onClick={handleModalEditClose} color='primary'>
              Cancelar
            </Button>
            <Button type='submit' color='primary'>
              Atualizar
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Fragment>
  )
}
