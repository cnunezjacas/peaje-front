//Función para realizar el Capitalize del nombre del organismo

import { STRINGS } from 'utils/string'
//import { notify_error } from 'utils/notify/notify_error.js'
import api from 'src/axios'

function capitalizeWords(str, capitalizeFirstWord = false) {
  // Dividimos la cadena en palabras
  const words = str.split(' ')

  // Si capitalizeFirstWord es true, solo capitalizamos la primera palabra
  if (capitalizeFirstWord) {
    // Capitalizamos solo la primera palabra
    words[0] = words[0][0].toUpperCase() + words[0].slice(1).toLowerCase()
    // Las demás palabras en minúsculas
    for (let i = 1; i < words.length; i++) {
      words[i] = words[i].toLowerCase()
    }
  } else {
    // Capitalizamos la primera letra de cada palabra
    for (let i = 0; i < words.length; i++) {
      words[i] = words[i][0].toUpperCase() + words[i].slice(1).toLowerCase()
    }
  }

  // Unimos las palabras y devolvemos la cadena
  return words.join(' ')
}
//Permite saber la URL donde te encuentras
const searchWebPath = (path) => {
  var newPath = path.split('_')
  return newPath
}

const getNumberForPage = () => {
  let aux = [10, 15, 20, 50, 0]
  return aux
}

const DataSelection = (row, ruta, arraySelected) => {
  var nuevaRuta = searchWebPath(ruta)
  if (nuevaRuta.includes(STRINGS.provinciaLowercase) && row) {
    arraySelected.value['nombre'] = row['nombre']
    arraySelected.value['codigo'] = row['codigo']
    arraySelected.value['_id'] = row['_id']
  } else if (nuevaRuta.includes(STRINGS.municipioLowercase) && row) {
    arraySelected.value['nombre'] = row['nombre']
    arraySelected.value['codigo'] = row['codigo']
    arraySelected.value['provincia'] = row['Texto_provincia']
    arraySelected.value['_id'] = row['_id']
  } else if (nuevaRuta.includes(STRINGS.organismoLowercase) && row) {
    arraySelected.value['nombre'] = row['siglas']
    arraySelected.value['name'] = row['nombre']
    arraySelected.value['_id'] = row['_id']
  } else if (nuevaRuta.includes(STRINGS.bancoLowercase) && row) {
    arraySelected.value['nombre'] = row['nombre']
    arraySelected.value['codigo'] = row['codigo']
    arraySelected.value['detalle'] = row['detalles']
    arraySelected.value['_id'] = row['_id']
  } else if (nuevaRuta.includes(STRINGS.monedasLowercase) && row) {
    arraySelected.value['siglas'] = row['siglas']
    arraySelected.value['nombre'] = row['nombre']
    arraySelected.value['tasa'] = row['tasa']
    arraySelected.value['nomenclador'] = row['nomenclador']
    arraySelected.value['moneda'] = row['moneda']
    arraySelected.value['condor'] = row['condor']
    arraySelected.value['_id'] = row['_id']
  } else if (nuevaRuta.includes(STRINGS.vehiculosLowercase) && row) {
    arraySelected.value['nombre'] = row['nombre']
    arraySelected.value['codigo'] = row['codigo']
    arraySelected.value['tasa'] = row['tasa']
    arraySelected.value['nomenclador'] = row['nomenclador']
    arraySelected.value['_id'] = row['_id']
  } else if (nuevaRuta.includes(STRINGS.exentoLowercase) && row) {
    arraySelected.value['nombre'] = row['nombre']
    arraySelected.value['codigo'] = row['codigo']
    arraySelected.value['nomenclador'] = row['nomenclador']
    arraySelected.value['detalles'] = row['detalles']
    arraySelected.value['_id'] = row['_id']
  } else if (nuevaRuta.includes(STRINGS.comprobanteLowercase) && row) {
    arraySelected.value['nombre'] = row['nombre']
    arraySelected.value['codigo'] = row['codigo']
    arraySelected.value['valor'] = row['valor']
    arraySelected.value['moneda'] = row['moneda']
    arraySelected.value['_id'] = row['_id']
  } else if (nuevaRuta.includes(STRINGS.formaDePagoLowercaseURL) && row) {
    arraySelected.value['nombre'] = row['descripcion']
    arraySelected.value['nomenclador'] = row['nomenclador']
    arraySelected.value['detalles'] = row['detalles']
    arraySelected.value['_id'] = row['_id']
  } else if (nuevaRuta.includes(STRINGS.tipoCuentaLowercaseURL) && row) {
    arraySelected.value['nombre'] = row['codigo']
    arraySelected.value['codigo'] = row['nombre']
    arraySelected.value['_id'] = row['_id']
  }
  //ENTIDAD
  else if (nuevaRuta.includes(STRINGS.estacionesLowercase) && row) {
    arraySelected.value['nombre'] = row['nombre']
    arraySelected.value['codigo'] = row['codigo']
    arraySelected.value['direccion'] = row['direccion']
    arraySelected.value['provincia'] = row['provincia']
    arraySelected.value['municipio'] = row['municipio']
    arraySelected.value['_id'] = row['_id']
  } else {
    //notify_error(STRINGS.fila_no_selected)
    return null
  }

  return arraySelected.value
}

//Función para traer id de tabla monedas
const getIdCoin = async (moneda) => {
  let coinId = ''
  try {
    const response = await api.get(STRINGS.urlApiMoneda)
    // Asumiendo que response.data es un array
    response.data.forEach((element) => {
      if (element.siglas === moneda) {
        coinId = element._id
      }
    })
  } catch (error) {
    console.error('Error fetching coin ID:', error)
  }
  return coinId
}

//Función para realizar FROM * tabla monedas
const getCoin = async () => {
  try {
    const response = await api.get(STRINGS.urlApiMoneda)
    return response
    // Asumiendo que response.data es un array
  } catch (error) {
    console.error('Error fetching coin ID:', error)
  }
}

const getGestFemale = () => {
  var gestFemale = [
    STRINGS.provinciaLowercase.toUpperCase(),
    STRINGS.monedasLowercase.toUpperCase(),
    STRINGS.formaDePagoLowercase.toUpperCase(),
  ]
  return gestFemale
}

const loadCoins = async () => {
  const response = await api.get(STRINGS.urlApiMoneda)
  var optionsMoneda = response.data.map((element) => element['siglas'])

  if (optionsMoneda.value === null) {
    console.error('Problemas de carga de datos..')
  }
  return optionsMoneda !== null ? optionsMoneda : (optionsMoneda = ['Empty'])
}

const isCamelCase = (str) => {
  const isCamelCase = /[a-z][A-Z]/.test(str)
  return isCamelCase
}

// Si quieres separar las palabras
const JoinCamelCase = (str) => {
  // Verifica si la cadena está en camelCase usando una expresión regular
  const WordisCamelCase = isCamelCase(str)

  if (!WordisCamelCase) {
    // Si no está en camelCase, devuelve la cadena original
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  // Reemplaza las mayúsculas precedidas por minúsculas por un espacio y la letra en mayúscula
  const result = str.replace(/([a-z])([A-Z])/g, '$1 $2')

  // Opcional: convertir la primera letra a minúscula y las demás en mayúscula si quieres un formato específico
  // Aquí, simplemente convertir la primera letra de toda la frase a minúscula
  return result.charAt(0).toUpperCase() + result.slice(1).toLowerCase()
}

const cardOfBankToNumber = (card) => {
  var numero
  if (card.includes('-')) {
    // Elimina los guiones
    const sinGuiones = card.replace(/-/g, '')
    // Convierte la cadena sin guiones a número
    numero = Number(sinGuiones)
  } else {
    return Number(card)
  }

  return numero
}

export default {
  capitalizeWords,
  DataSelection,
  getIdCoin,
  getCoin,
  searchWebPath,
  getGestFemale,
  loadCoins,
  getNumberForPage,
  JoinCamelCase,
  isCamelCase,
  cardOfBankToNumber,
}
