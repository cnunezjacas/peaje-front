import { STRINGS } from 'utils/string.js'

//Dialogs Add
import DialogoAddProvincia from 'NomenclatorAdd/dialogoAddProvincia.vue'
import DialogoAddMunicipio from 'NomenclatorAdd/dialogoAddMunicipio.vue'
import DialogoAddOrganismo from 'NomenclatorAdd/dialogoAddOrganismo.vue'
import DialogoAddBanco from 'NomenclatorAdd/dialogoAddBanco.vue'
import DialogoAddMoneda from 'NomenclatorAdd/dialogAddMoneda.vue'
import DialogoAddVehiculo from 'NomenclatorAdd/dialogAddVehiculo.vue'
import DialogoAddExento from 'NomenclatorAdd/dialogAddExento.vue'
import DialogoAddComprobante from 'NomenclatorAdd/dialogAddComprobante.vue'
import DialogoAddFormaDePago from 'NomenclatorAdd/dialogAddFormaDePago.vue'

//Dialogs Edit
import DialogEditProvincia from 'NomenclatorEdit/dialog_edit_provincia.vue'
import DialogEditMunicipio from 'NomenclatorEdit/dialog_edit_municipio.vue'
import DialogEditOrganismo from 'NomenclatorEdit/dialog_edit_organismo.vue'
import DialogEditBanco from 'NomenclatorEdit/dialog_edit_banco.vue'
import DialogEditMoneda from 'NomenclatorEdit/dialog_edit_moneda.vue'
import DialogEditVehiculo from 'NomenclatorEdit/dialog_edit_vehiculo.vue'
import DialogEditExento from 'NomenclatorEdit/dialog_edit_exento.vue'
import DialogEditComprobante from 'NomenclatorEdit/dialog_edit_comprobante.vue'
import DialogEditFdp from 'NomenclatorEdit/dialog_edit_fdp.vue'

//Dialogs Delete
import DialogDeleteGeneric from 'NomenclatorDelete/dialog_delete_generic.vue'

//Tables
import table_Gest_provincia from 'NomenclatorTables/table_Gest_provincia.vue'
import table_Gest_municipio from 'NomenclatorTables/table_Gest_municipio.vue'
import table_Gest_organismo from 'NomenclatorTables/table_Gest_organismo.vue'
import table_Gest_banco from 'NomenclatorTables/table_Gest_banco.vue'
import table_Gest_comprobante from 'NomenclatorTables/table_Gest_comprobantes.vue'
import table_Gest_monedas from 'NomenclatorTables/table_Gest_moneda.vue'
import table_Gest_vehiculos from 'NomenclatorTables/table_Gest_vehiculos.vue'
import table_Gest_exento from 'NomenclatorTables/table_Gest_exento.vue'
import table_Gest_fdp from 'NomenclatorTables/table_Gest_fdp.vue'

import notify_error from 'utils/notify/notify_error.js'

export {
  STRINGS,
  DialogoAddProvincia,
  DialogoAddMunicipio,
  DialogoAddOrganismo,
  DialogoAddBanco,
  DialogoAddMoneda,
  DialogoAddVehiculo,
  DialogoAddExento,
  DialogoAddComprobante,
  DialogoAddFormaDePago,
  DialogEditComprobante,
  DialogEditProvincia,
  DialogEditMunicipio,
  DialogEditOrganismo,
  DialogEditBanco,
  DialogEditMoneda,
  DialogEditVehiculo,
  DialogEditExento,
  DialogEditFdp,
  DialogDeleteGeneric,
  table_Gest_provincia,
  table_Gest_municipio,
  table_Gest_organismo,
  table_Gest_banco,
  table_Gest_comprobante,
  table_Gest_monedas,
  table_Gest_vehiculos,
  table_Gest_exento,
  table_Gest_fdp,
  notify_error,
}
