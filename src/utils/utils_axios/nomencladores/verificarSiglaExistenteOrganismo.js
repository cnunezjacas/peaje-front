import { STRINGS } from '../../string.js'
import api from 'src/axios.js'

/* Función para verificar si el código ya existe */
const verificarSiglaExistente = async (siglas) => {
  var aux = false
  try {
    const response = await api.get(`${STRINGS.urlApiOrganismo}?/sigla=${siglas}`)
    // Asumiendo que tu API devuelve un array de resultados
    response.data.forEach((element) => {
      if (element.siglas === siglas) {
        aux = true
      }
    })
    return aux ? true : false
  } catch (error) {
    console.error('Error al verificar código:', error)
    // Si hay un error en la consulta, asumimos que no hay duplicado para no bloquear
    return false
  }
}

export default verificarSiglaExistente
