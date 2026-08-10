import api from 'src/axios.js'

export function useApi() {
  const fetchData = async (endpoint) => {
    try {
      const response = await api.get(endpoint)
      return { data: response.data, error: null }
    } catch (error) {
      console.error('Error fetching data:', error)
      return { data: null, error }
    }
  }

  const postData = async (endpoint, payload) => {
    try {
      const response = await api.post(endpoint, payload)
      return { data: response.data, error: null }
    } catch (error) {
      console.error('Error posting data:', error)
      return { data: null, error }
    }
  }

  const putData = async (endpoint, payload) => {
    try {
      const response = await api.put(endpoint, payload)
      return { data: response.data, error: null }
    } catch (error) {
      console.error('Error updating data:', error)
      return { data: null, error }
    }
  }

  const patchData = async (endpoint, payload) => {
    try {
      const response = await api.patch(endpoint, payload)
      return { data: response.data, error: null }
    } catch (error) {
      console.error('Error updating data:', error)
      return { data: null, error }
    }
  }

  const deleteData = async (endpoint) => {
    try {
      const response = await api.delete(endpoint)
      return { data: response.data, error: null }
    } catch (error) {
      console.error('Error deleting data:', error)
      return { data: null, error }
    }
  }

  return { fetchData, postData, putData, patchData, deleteData }
}
