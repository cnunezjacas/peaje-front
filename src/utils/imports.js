//Función para realizar el Capitalize del nombre del organismo

import { STRINGS } from 'utils/string'
//import { notify_error } from 'utils/notify/notify_error.js'
import api from 'src/axios'

function capitalizeWords(str) {
  return str
    .split(' ')
    .map((word) => {
      if (word.length === 0) return word // Por si hay cadenas vacías
      return word[0].toUpperCase() + word.slice(1).toLowerCase()
    })
    .join(' ')
}

const searchWebPath = (path) => {
  var newPath = path.split('_')
  return newPath
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
    arraySelected.value['detalle'] = row['detalle']
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
  } else {
    //notify_error(STRINGS.fila_no_selected)
    return null
  }

  return arraySelected.value
}

//TODO: Función para traer id de tabla monedas
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

//TODO: Función para realizar FROM * tabla monedas
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
  var gestFemale = [STRINGS.provinciaLowercase, STRINGS.monedasLowercase]
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

export default {
  capitalizeWords,
  DataSelection,
  getIdCoin,
  getCoin,
  searchWebPath,
  getGestFemale,
  loadCoins,
}
