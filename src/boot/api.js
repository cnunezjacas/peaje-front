import axios from 'axios'
//import { STRINGS } from './utils/string'

const URL_BASE = 'http://localhost:3000/'

const api = axios.create({
  baseURL: URL_BASE, // Cambia por la URL de tu backend
  // Puedes agregar más configuraciones aquí, como headers
})

export default api
