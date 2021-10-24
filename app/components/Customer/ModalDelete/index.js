import React, { Fragment } from 'react'
import axios from 'axios'

import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogTitle from '@material-ui/core/DialogTitle'
import Button from '@material-ui/core/Button'

import { useCustomerContext } from '../Context'

export default function ModalDelete() {
  const {
    data,
    modalDeleteOpen,
    customers,
    customerSelected,
    setData,
    setCustomers,
    setNotificationOpen,
    setMessageNotification,
    handleDeleteClose,
  } = useCustomerContext()

  return (
    <Fragment>
      <Dialog
        open={modalDeleteOpen}
        onClose={handleDeleteClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>
          {'Tem certeza que deseja excluir esse cliente?'}
        </DialogTitle>

        <DialogActions>
          <Button onClick={handleDeleteClose}>Cancelar</Button>
          <Button
            onClick={async () => {
              axios
                .delete('/api/customers', {
                  data: { id: customerSelected[0].id },
                })
                .then((result) => {
                  setMessageNotification(result.data.message)

                  const aux = data.filter(
                    (item) => item[4] !== customerSelected[0].id
                  )
                  const aux2 = customers.filter(
                    (item) => item.id !== customerSelected[0].id
                  )

                  setData(aux)
                  setCustomers(aux2)
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
