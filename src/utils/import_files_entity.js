import { STRINGS } from 'utils/string.js'

//Dialogs Add
import DialogoAddEstacion from 'EntityAdd/dialog_add_estacion.vue'
import DialogoAddAreaTrabajo from 'EntityAdd/dialog_add_area_trabajo.vue'
import DialogoAddCuenta from 'EntityAdd/dialog_add_cuenta.vue'
import DialogoAddTerminal from 'EntityAdd/dialog_add_terminal.vue'
import DialogoAddPuntoDeVenta from 'EntityAdd/dialog_add_puntos_de_venta.vue'
import DialogoAddOperador from 'EntityAdd/dialog_add_operador.vue'
import DialogoAddCliente from 'EntityAdd/dialog_add_cliente.vue'
import DialogoAddTramitador from 'EntityAdd/dialog_add_tramitador.vue'

//Dialogs Edit
import DialogoEditEstacion from 'EntityEdit/dialog_edit_estacion.vue'
//Dialogs Delete
//import DialogDeleteGeneric from 'NomenclatorDelete/dialog_delete_generic.vue'

//Tables
import TableEstacion from 'EntityTables/table_estacion.vue'
import TableADT from 'EntityTables/table_ADT.vue'
import TableCuenta from 'EntityTables/table_cuenta.vue'

import notify_error from 'utils/notify/notify_error.js'

export {
  STRINGS,
  DialogoAddEstacion,
  DialogoAddAreaTrabajo,
  DialogoAddCuenta,
  DialogoAddTerminal,
  DialogoAddPuntoDeVenta,
  DialogoAddOperador,
  DialogoAddCliente,
  DialogoAddTramitador,
  DialogoEditEstacion,
  TableEstacion,
  TableADT,
  TableCuenta,
  notify_error,
}
