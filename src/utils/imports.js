//Función para realizar el Capitalize del nombre del organismo

import { STRINGS } from 'utils/string'
//import { notify_error } from 'utils/notify/notify_error.js'

function capitalizeWords(str) {
  return str
    .split(' ')
    .map((word) => {
      if (word.length === 0) return word // Por si hay cadenas vacías
      return word[0].toUpperCase() + word.slice(1).toLowerCase()
    })
    .join(' ')
}

const DataSelection = (row, ruta, arraySelected) => {
  //console.log('Selected:' + JSON.stringify(row))
  var nuevaRuta = ruta.split('_')
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
    arraySelected.value['name_min'] = row['siglas']
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
  } else {
    //notify_error(STRINGS.fila_no_selected)
    return null
  }

  return arraySelected.value
}

export default { capitalizeWords, DataSelection }
