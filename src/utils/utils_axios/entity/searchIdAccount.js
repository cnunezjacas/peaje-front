import { STRINGS } from 'utils/string.js'
import api from 'src/axios.js'

/* Función para verificar si el código ya existe */
const searchIdAccount = async (numero, Tipo) => {
  var aux = false,
    id = '',
    idTipoCuenta = ''

  try {
    const responseCuenta = await api.get(`${STRINGS.urlApiCuenta}?/numero=${numero}`)

    const responseTipoCuenta = await api.get(STRINGS.urlApiTipoCuenta)
    // Asumiendo que tu API devuelve un array de resultados
    responseCuenta.data.forEach((element) => {
      if (element.numero === numero) {
        id = element._id
        idTipoCuenta = element.tipo
      }
    })
    if (idTipoCuenta !== '') {
      responseTipoCuenta.data.forEach((element) => {
        if (element._id === idTipoCuenta && element.codigo === Tipo) {
          aux = true
        }
      })
    } else {
      //id == ''
      return { id: id, tipo: aux, msj: 'La cuenta no está registrada en el sistema.' }
    }

    return aux
      ? { id: id, tipo: aux, msj: '' } // id === '21asd'
      : {
          id: id, //id === '21asd'
          tipo: aux,
          msj: 'El número de cuenta no está registrado en el sistema a una cuenta ' + Tipo + '.',
        }
  } catch (error) {
    console.error('No existe tal cuenta de banco:', error)
    // Si hay un error en la consulta, asumimos que no hay duplicado para no bloquear
    return {
      id: null,
      tipo: aux,
      msj: 'No existe tal cuenta de banco',
    }
  }
}

export default searchIdAccount
