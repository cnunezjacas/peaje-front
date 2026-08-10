import { STRINGS } from 'utils/string'
import imports from 'src/utils/imports'

const DataSelection = (row, ruta, objectSelected) => {
  var current_route = imports.searchWebPath(ruta)

  //ENTIDAD
  if (current_route.includes(STRINGS.estacionesLowercase) && row) {
    objectSelected.value.nombre = row['nombre']
    objectSelected.value['codigo'] = row['codigo']
    objectSelected.value['direccion'] = row['direccion']
    objectSelected.value['id_provincia'] = row['id_provincia']
    objectSelected.value['provincia'] = row['provincia']
    objectSelected.value['id_municipio'] = row['id_municipio']
    objectSelected.value['municipio'] = row['municipio']
    objectSelected.value['direccion'] = row['direccion']
    objectSelected.value['nit'] = row['nit']
    objectSelected.value['cuentaCuc'] = row['cuentaCuc']
    objectSelected.value['cuentaCup'] = row['cuentaCup']
    objectSelected.value['telefonos'] = row['telefonos']
    objectSelected.value['_id'] = row['_id']
    objectSelected.value['row'] = row
  } else if (current_route.includes(STRINGS.cuentaLowercase) && row) {
    objectSelected.value.titular = row['titular']
    objectSelected.value.idBanco = row['idbanco']
    objectSelected.value.banco = row['banco']
    objectSelected.value.numero_tarjeta = row['numero']
    objectSelected.value.idtipo_cuenta = row['idtipo']
    objectSelected.value.tipo_cuenta = row['tipo']
    objectSelected.value._id = row['_id']
    objectSelected.value['row'] = row
  } else {
    return null
  }
  return objectSelected.value
}

export default {
  DataSelection,
}
