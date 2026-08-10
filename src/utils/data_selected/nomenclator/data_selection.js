import { STRINGS } from 'utils/string'
import imports from 'src/utils/imports'

const DataSelection = (row, ruta, objectSelected) => {
  var current_route = imports.searchWebPath(ruta)
  if (current_route.includes(STRINGS.provinciaLowercase) && row) {
    objectSelected.value.nombre = row['nombre']
    objectSelected.value.codigo = row['codigo']
    objectSelected.value._id = row['_id']
    objectSelected.value.row = row
  } else if (current_route.includes(STRINGS.municipioLowercase) && row) {
    objectSelected.value.nombre = row['nombre']
    objectSelected.value.codigo = row['codigo']
    objectSelected.value.id_provincia = row['id_provincia']
    objectSelected.value.label_provincia = row['label_provincia']
    objectSelected.value._id = row['_id']
    objectSelected.value.row = row
  } else if (current_route.includes(STRINGS.organismoLowercase) && row) {
    objectSelected.value.siglas = row['siglas']
    objectSelected.value.nombre = row['nombre']
    objectSelected.value._id = row['_id']
    objectSelected.value.row = row
  } else if (current_route.includes(STRINGS.bancoLowercase) && row) {
    objectSelected.value.nombre = row['nombre']
    objectSelected.value.siglas = row['codigo']
    objectSelected.value.detalle = row['detalles']
    objectSelected.value._id = row['_id']
    objectSelected.value.row = row
  } else if (current_route.includes(STRINGS.monedasLowercase) && row) {
    objectSelected.value.siglas = row['siglas']
    objectSelected.value.nombre = row['nombre']
    objectSelected.value.tasa = row['tasa']
    objectSelected.value.nomenclador = row['nomenclador']
    objectSelected.value.moneda = row['moneda']
    objectSelected.value.idCondor = row['condor']
    objectSelected.value._id = row['_id']
    objectSelected.value.row = row
  } else if (current_route.includes(STRINGS.vehiculosLowercase) && row) {
    objectSelected.value.nombre = row['nombre']
    objectSelected.value.codigo = row['codigo']
    objectSelected.value.tasa = row['tasa']
    objectSelected.value.nomenclador = row['nomenclador']
    objectSelected.value._id = row['_id']
    objectSelected.value.row = row
  } else if (current_route.includes(STRINGS.exentoLowercase) && row) {
    objectSelected.value.nombre = row['nombre']
    objectSelected.value.codigo = row['codigo']
    objectSelected.value.nomenclador = row['nomenclador']
    objectSelected.value.detalle = row['detalles']
    objectSelected.value._id = row['_id']
    objectSelected.value.row = row
  } else if (current_route.includes(STRINGS.comprobanteLowercase) && row) {
    objectSelected.value.nombre = row['nombre']
    objectSelected.value.codigo = row['codigo']
    objectSelected.value.valor = row['valor']
    objectSelected.value.moneda = row['moneda']
    objectSelected.value._id = row['_id']
    objectSelected.value.row = row
  } else if (current_route.includes(STRINGS.formaDePagoLowercaseURL) && row) {
    objectSelected.value.nombre = row['descripcion']
    objectSelected.value.nomenclador = row['nomenclador']
    objectSelected.value.detalle = row['detalles']
    objectSelected.value._id = row['_id']
    objectSelected.value.row = row
  } else if (current_route.includes(STRINGS.tipoCuentaLowercaseURL) && row) {
    objectSelected.value.siglas = row['codigo']
    objectSelected.value.nombre = row['nombre']
    objectSelected.value._id = row['_id']
    objectSelected.value.row = row
  } else {
    return null
  }
  return objectSelected.value
}

export default {
  DataSelection,
}
