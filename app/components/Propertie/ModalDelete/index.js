import React, { Fragment } from 'react'
import axios from 'axios'

import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogTitle from '@material-ui/core/DialogTitle'
import Button from '@material-ui/core/Button'

import { usePropertieContext } from '../Context'

export default function ModalDelete() {
  const {
    data,
    modalDeleteOpen,
    properties,
    setProperties,
    propertieSelected,
    setData,
    setNotificationOpen,
    setMessageNotification,
    handleDeleteClose,
  } = usePropertieContext()

  return (
    <Fragment>
      <Dialog
        open={modalDeleteOpen}
        onClose={handleDeleteClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>
          {'Tem certeza que deseja excluir esse empreendimento?'}
        </DialogTitle>

        <DialogActions>
          <Button onClick={handleDeleteClose}>Cancelar</Button>
          <Button
            onClick={async () => {
              axios
                .delete('/api/properties', {
                  data: { id: propertieSelected[0].id },
                })
                .then((result) => {
                  setMessageNotification(result.data.message)

                  const aux = data.filter(
                    (item) => item[4] !== propertieSelected[0].id
                  )
                  const aux2 = properties.filter(
                    (item) => item.id !== propertieSelected[0].id
                  )

                  setData(aux)
                  setProperties(aux2)
                  setNotificationOpen(true)
                  handleDeleteClose()
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
    </Fragment>
  )
}
