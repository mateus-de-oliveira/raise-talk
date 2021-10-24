import Axios from 'axios'

const apiProperties = Axios.create({
  baseURL: process.env.AWS_API_PROPERTIES,
  headers: {
    'Content-Type': 'application/json',
  },
})

export default apiProperties
