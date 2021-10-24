import React, { Fragment } from 'react'
import axios from 'axios'
import { useFormik } from 'formik'
import firebaseApp from '../../../config/database'
import { getFirestore, updateDoc, doc, arrayUnion } from 'firebase/firestore'
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'

import FormGroup from '@material-ui/core/FormGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import TextField from '@material-ui/core/TextField'
import Switch from '@material-ui/core/Switch'
import Button from '@material-ui/core/Button'
import { useAuth0 } from '@auth0/auth0-react'

import { MaterialDropZone } from 'dan-components'
import { FileInput } from 'dan-components'
import grey from '@material-ui/core/colors/grey'
import CircularProgress from '@material-ui/core/CircularProgress'
import Box from '@material-ui/core/Box'
import { useUserContext } from '../Context'

// const firestore = getFirestore(firebaseApp)
// const storage = getStorage(firebaseApp)

export default function ModalNumber() {
  const { user } = useAuth0()

  const { setModalNumber, modalNumber } = useUserContext()

  const formik = useFormik({
    initialValues: {},

    onSubmit: (values, { resetForm }) => {
      axios
        .put('/api/users', { ...values, id: user.sub.split('|')[1] })
        .then((result) => setModalNumber(false))
    },
  })

  return (
    <Fragment>
      <Dialog open={modalNumber} aria-labelledby='form-dialog-title'>
        <DialogTitle id='form-dialog-title'>Cadastrar número</DialogTitle>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent>
            <DialogContentText>
              Esse número serve para que o bot se comunique!
            </DialogContentText>
            <TextField
              autoFocus
              margin='dense'
              id='number'
              name='number'
              onChange={formik.handleChange}
              label='Número do whatsapp'
              type='text'
              fullWidth
              required
            />
          </DialogContent>
          <DialogActions>
            <Button type='submit' color='primary'>
              Continuar
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Fragment>
  )
}
