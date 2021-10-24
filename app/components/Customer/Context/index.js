import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { usePropertieContext } from '../../Propertie/Context'

export const MyContext = React.createContext()
export const useCustomerContext = () => React.useContext(MyContext)

export const CustomerProvider = ({ children }) => {
  const { userId } = usePropertieContext()
  const [customers, setCustomers] = useState([])

  const [customerSelected, setCustomerSelected] = useState([])
  const [properties, setProperties] = useState([])
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [notificationOpen, setNotificationOpen] = useState(false)
  const [modalCreateOpen, setModalCreateOpen] = useState(false)
  const [modalEditOpen, setModalEditOpen] = useState(false)
  const [modalDeleteOpen, setModalDeleteOpen] = useState(false)
  const [messageNotification, setMessageNotification] = useState('')
  const [propertieSelected, setPropertieSelected] = useState('')
  const [loadingCrud, setLoadingCrud] = useState(false)
  const [loadingCrudEdit, setLoadingCrudEdit] = useState(false)

  const handleModalCreateOpen = () => setModalCreateOpen(true)
  const handleModalCreateClose = () => setModalCreateOpen(false)

  const handleModalEditOpen = () => setModalEditOpen(true)
  const handleModalEditClose = () => setModalEditOpen(false)

  const handleDeleteOpen = () => setModalDeleteOpen(true)
  const handleDeleteClose = () => setModalDeleteOpen(false)

  const handleNotificationOpen = () => setNotificationOpen(true)
  const handleNotificationClose = () => setNotificationOpen(false)

  useEffect(() => {
    axios
      .get('/api/customers', { params: { user_id: userId } })
      .then(function(response) {
        setCustomers(response.data)
        let result = response.data.map((items) => Object.values(items))

        setData(result)
        setLoading(false)
      })
      .catch(function(error) {
        console.log(error)
      })
  }, [userId])

  return (
    <MyContext.Provider
      value={{
        properties,
        customers,
        data,
        modalCreateOpen,
        modalEditOpen,
        modalDeleteOpen,
        loading,
        propertieSelected,
        customerSelected,
        notificationOpen,
        messageNotification,
        loadingCrud,
        loadingCrudEdit,
        setProperties,
        setLoadingCrud,
        setLoadingCrudEdit,
        setData,
        setCustomers,
        setNotificationOpen,
        setMessageNotification,
        setModalCreateOpen,
        setModalDeleteOpen,
        setModalEditOpen,
        setPropertieSelected,
        setCustomerSelected,
        handleModalCreateOpen,
        handleModalCreateClose,
        handleModalEditOpen,
        handleModalEditClose,
        handleDeleteOpen,
        handleDeleteClose,
        handleNotificationOpen,
        handleNotificationClose,
      }}
    >
      {children}
    </MyContext.Provider>
  )
}
