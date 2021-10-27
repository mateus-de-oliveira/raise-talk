import React, { Fragment } from 'react'
import axios from 'axios'
import { useFormik } from 'formik'
import firebaseApp from '../../../config/database'
import { getFirestore, updateDoc, doc, arrayUnion } from 'firebase/firestore'
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import CircularProgress from '@material-ui/core/CircularProgress'
import Box from '@material-ui/core/Box'
import FormGroup from '@material-ui/core/FormGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import TextField from '@material-ui/core/TextField'
import Switch from '@material-ui/core/Switch'
import Button from '@material-ui/core/Button'
import { usePropertieContext } from '../Context'
import { MaterialDropZone } from 'dan-components'
import { LocationMap } from 'dan-components'
import grey from '@material-ui/core/colors/grey'
import { useAuth0 } from '@auth0/auth0-react'

import { FileInput } from 'dan-components'

const firestore = getFirestore(firebaseApp)
const storage = getStorage(firebaseApp)

export default function ModalCreate() {
  const {
    data,
    files,
    setFiles,
    setTablePricing,
    setAvailability,
    loadingCrud,
    setLoadingCrud,
    availability,
    tablePricing,
    properties,
    modalCreateOpen,
    setProperties,
    setData,
    setNotificationOpen,
    setMessageNotification,
    setModalCreateOpen,
    handleModalCreateClose,
    viewport,
  } = usePropertieContext()
  const { user } = useAuth0()

  const formik = useFormik({
    initialValues: {
      active: true,
    },
    onSubmit: (values, { resetForm }) => {
      setLoadingCrud(true)
      axios
        .post('/api/properties', {
          ...values,
          path_images: [],
          user_id: user.sub.split('|')[1],
          location: {
            latitude: viewport.latitude,
            longitude: viewport.longitude,
            with: viewport.width,
            height: viewport.height,
            zoom: viewport.zoom,
          },
        })
        .then(async (result) => {
          console.log(files)
          files.map(async (file) => {
            const fileRef = ref(
              storage,
              `properties/${new Date(Date.now()).getTime()}-${file.name}`
            )

            await uploadBytes(fileRef, file)
            let urlFile = await getDownloadURL(fileRef)

            const docuRef = doc(firestore, `properties/${result.data.id}`)

            updateDoc(docuRef, {
              path_images: arrayUnion(urlFile),
            })
          })

          if (tablePricing) {
            const fileRef = ref(
              storage,
              `properties/${new Date(Date.now()).getTime()}-${
                tablePricing.name
              }`
            )

            await uploadBytes(fileRef, tablePricing)
            let urlFile = await getDownloadURL(fileRef)

            const docuRef = doc(firestore, `properties/${result.data.id}`)

            updateDoc(docuRef, {
              table_pricing: { name: tablePricing.name, url: urlFile },
            })
          }

          if (availability) {
            const fileRef = ref(
              storage,
              `properties/${new Date(Date.now()).getTime()}-${
                availability.name
              }`
            )

            await uploadBytes(fileRef, availability)
            let urlFile = await getDownloadURL(fileRef)

            const docuRef = doc(firestore, `properties/${result.data.id}`)

            updateDoc(docuRef, {
              availability: { name: availability.name, url: urlFile },
            })
          }

          const newPropertie = Object.values(result.data)

          setData([...data, newPropertie])
          setFiles([])
          setProperties([...properties, result.data])
          setMessageNotification(result.data.message)
          setNotificationOpen(true)
          setModalCreateOpen(false)
          setLoadingCrud(false)
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
        zIndex: '9999999',
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
      >
        <DialogTitle id='form-dialog-title'>Cadastrar imóvel</DialogTitle>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent>
            {/* <DialogContentText>
              To subscribe to this website, please enter your email address
              here. We will send updates occasionally.
            </DialogContentText> */}
            <FormGroup style={{ marginBottom: 10 }}>
              <div style={{ marginBottom: -16 }}>Nome (Obrigatório)</div>
              <TextField
                margin='dense'
                id='name'
                name='title'
                onChange={formik.handleChange}
                label='Nome'
                type='text'
                required
                fullWidth
              />
            </FormGroup>
            <FormGroup style={{ marginBottom: 10 }}>
              <div style={{ marginBottom: -16 }}>Descrição</div>
              <TextField
                id='description'
                name='description'
                onChange={formik.handleChange}
                label='Digite uma breve descrição'
                multiline
                rows='4'
                margin='normal'
                variant='outlined'
                fullWidth
              />
            </FormGroup>
            <FormGroup style={{ marginBottom: 10 }}>
              <FormControlLabel
                control={<Switch defaultChecked />}
                label='Ativar imóvel?'
                name='active'
                onChange={formik.handleChange}
              />
            </FormGroup>
            <FormGroup style={{ marginBottom: 10 }}>
              <div>Fotos do imóvel</div>
              <MaterialDropZone
                acceptedFiles={['image/jpeg', 'image/png', 'image/bmp']}
                files={files}
                showPreviews
                maxSize={5000000}
                filesLimit={5}
                text='Arraste e solte as imagens do imóvel aqui ou clique'
              />
            </FormGroup>
            <FormGroup style={{ marginBottom: 20 }}>
              <div>Localização</div>
              <LocationMap />
            </FormGroup>
            <FormGroup>
              <div style={{ marginBottom: -20 }}>Tabela de preço</div>
              <FileInput
                label='Clique aqui para enviar'
                error={{ message: 'Error' }}
                setAttachment={setTablePricing}
                attachment={tablePricing}
              />
            </FormGroup>
            <FormGroup style={{ marginBottom: 10 }}>
              <div style={{ marginBottom: -20 }}>Disponibilidade</div>
              <FileInput
                label='Clique aqui para enviar'
                error={{ message: 'Error' }}
                setAttachment={setAvailability}
                attachment={availability}
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
    </Fragment>
  )
}
