import React, { useState, useEffect } from 'react'
import axios from 'axios'

export const MyContext = React.createContext()
export const usePropertieContext = () => React.useContext(MyContext)

export const PropertieProvider = ({ children }) => {
  const [properties, setProperties] = useState([])
  const [userId, setUserId] = useState('')
  const [files, setFiles] = useState([])
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [tablePricing, setTablePricing] = useState(null)
  const [availability, setAvailability] = useState(null)
  const [notificationOpen, setNotificationOpen] = useState(false)
  const [modalCreateOpen, setModalCreateOpen] = useState(false)
  const [modalEditOpen, setModalEditOpen] = useState(false)
  const [modalDeleteOpen, setModalDeleteOpen] = useState(false)
  const [messageNotification, setMessageNotification] = useState('')
  const [propertieSelected, setPropertieSelected] = useState('')
  const [loadingCrud, setLoadingCrud] = useState(false)
  const [loadingCrudEdit, setLoadingCrudEdit] = useState(false)
  const [viewport, setViewport] = useState({
    latitude: -3.7933031,
    longitude: -38.6597021,
    width: 425.328125,
    height: 200,
    zoom: 8,
  })

  const handleModalCreateOpen = () => setModalCreateOpen(true)
  const handleModalCreateClose = () => setModalCreateOpen(false)

  const handleModalEditOpen = () => setModalEditOpen(true)
  const handleModalEditClose = () => {
    setFiles([])
    setModalEditOpen(false)
  }

  const handleDeleteOpen = () => setModalDeleteOpen(true)
  const handleDeleteClose = () => setModalDeleteOpen(false)

  const handleNotificationOpen = () => setNotificationOpen(true)
  const handleNotificationClose = () => setNotificationOpen(false)

  useEffect(() => {
    axios
      .get('/api/properties', { params: { user_id: userId } })
      .then(function(response) {
        setProperties(response.data)
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
        data,
        modalCreateOpen,
        modalEditOpen,
        modalDeleteOpen,
        loading,
        files,
        propertieSelected,
        notificationOpen,
        messageNotification,
        tablePricing,
        availability,
        loadingCrud,
        loadingCrudEdit,
        userId,
        viewport,
        setViewport,
        setUserId,
        setLoadingCrudEdit,
        setLoadingCrud,
        setProperties,
        setAvailability,
        setFiles,
        setData,
        setTablePricing,
        setNotificationOpen,
        setMessageNotification,
        setModalCreateOpen,
        setModalDeleteOpen,
        setModalEditOpen,
        setPropertieSelected,
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
