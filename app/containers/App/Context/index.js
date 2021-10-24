import React, { useState, useEffect } from 'react'
import axios from 'axios'

export const MyContext = React.createContext()
export const useUserContext = () => React.useContext(MyContext)

export const UserProvider = ({ children }) => {
  const [modalNumber, setModalNumber] = useState(false)

  return (
    <MyContext.Provider
      value={{
        modalNumber,
        setModalNumber,
      }}
    >
      {children}
    </MyContext.Provider>
  )
}
