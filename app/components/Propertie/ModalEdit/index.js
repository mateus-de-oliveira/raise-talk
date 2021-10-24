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
import { usePropertieContext } from '../Context'
import { MaterialDropZone } from 'dan-components'
import { FileInput } from 'dan-components'
import grey from '@material-ui/core/colors/grey'
import CircularProgress from '@material-ui/core/CircularProgress'
import Box from '@material-ui/core/Box'

const firestore = getFirestore(firebaseApp)
const storage = getStorage(firebaseApp)

export default function ModalCreate() {
  const {
    data,
    files,
    properties,
    tablePricing,
    setTablePricing,
    setAvailability,
    setLoadingCrudEdit,
    loadingCrudEdit,
    availability,
    propertieSelected,
    modalEditOpen,
    setProperties,
    setData,
    setFiles,
    setNotificationOpen,
    setMessageNotification,
    setModalEditOpen,
    handleModalEditClose,
  } = usePropertieContext()

  const formik = useFormik({
    initialValues: propertieSelected,
    enableReinitialize: true,
    onSubmit: (values, { resetForm }) => {
      setLoadingCrudEdit(true)
      axios
        .put('/api/properties', { ...values, path_images: [] })
        .then(async (result) => {
          files.map(async (file) => {
            if (typeof file == 'object') {
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
            } else {
              const docuRef = doc(firestore, `properties/${result.data.id}`)

              updateDoc(docuRef, {
                path_images: arrayUnion(file),
              })
            }
          })

          if (tablePricing && !tablePricing.url) {
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

          if (availability && !availability.url) {
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

          let newProperties = properties.map((item) => {
            if (item.id === result.data.id) {
              item = result.data
            }

            return item
          })

          setProperties(newProperties)

          let newPropertiesAux = await newProperties.map((items) =>
            Object.values(items)
          )

          setData(newPropertiesAux)
          setMessageNotification(result.data.message)
          setNotificationOpen(true)
          setModalEditOpen(false)
          setLoadingCrudEdit(false)
          setFiles([])
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
        open={modalEditOpen}
        onClose={handleModalEditClose}
        aria-labelledby='form-dialog-title'
      >
        <DialogTitle id='form-dialog-title'>Atualizar imóvel</DialogTitle>
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
              required
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
                control={<Switch defaultChecked={propertieSelected.active} />}
                label='Ativar imóvel?'
                name='active'
                value={formik.values.active}
                onChange={formik.handleChange}
              />
            </FormGroup>
            <MaterialDropZone
              acceptedFiles={['image/jpeg', 'image/png', 'image/bmp']}
              files={files}
              showPreviews
              maxSize={5000000}
              filesLimit={5}
              text='Drag and drop image(s) here or click'
            />
            <FileInput
              label='Tabela de preço'
              error={{ message: 'Error' }}
              setAttachment={setTablePricing}
              attachment={tablePricing}
            />
            <FileInput
              label='Disponibilidade'
              error={{ message: 'Error' }}
              setAttachment={setAvailability}
              attachment={availability}
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
