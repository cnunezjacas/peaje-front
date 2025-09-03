<template>
  <div class="">
    <q-dialog v-model="dialog" persistent :backdrop-filter="backdropFilter">
      <q-card>
        <q-card-section class="row items-center text-white q-pb-none text-h6 bg-green-5 q-pa-md">
          <span class="icon-text q-mx-sm">
            <q-icon name="delete" />
          </span>
          <span class="icon-text"
            >{{ STRINGS.delete.toUpperCase() }} {{ CategoryItemDelete.toUpperCase() }}</span
          >
        </q-card-section>

        <q-card-section>
          <div class="row flex justify-center">
            <div class="col-12 text-center">
              <q-icon name="help" color="green" size="3rem" />
            </div>
            <div class="col-12 text-center q-pt-md">
              <p>{{ titleContent }} {{ CategoryItemDelete }}: {{ nameItemDelete }} ?</p>
            </div>

            <div v-if="ShowChildNodesToDelete()" class="col-12 text-center q-px-lg">
              <p class="noStyle text-red small-font-bold">
                Puede perder elementos de otras tablas vinculados con esta provincia.
              </p>
            </div>
          </div>
        </q-card-section>

        <q-card-section>
          <div class="flex justify-center">
            <div class="">
              <q-btn
                icon="check"
                @click="DeleteItem"
                :label="STRINGS.access"
                color="green"
                :size="STRINGS.SizeBottom"
              />
            </div>

            <div class="">
              <q-btn
                flat
                icon="close"
                :label="STRINGS.cancel"
                color="dark"
                :size="STRINGS.SizeBottom"
                @click="Reset()"
              />
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
//importaciones
import { ref } from 'vue'
import { STRINGS } from 'utils/string.js'
import api from 'src/axios.js'
import notify_success from 'src/utils/notify/notify_success.js'
import notify_error from 'src/utils/notify/notify_error.js'
import imports from 'src/utils/imports.js'
import getNomenclator from 'src/utils/utils_axios/nomencladores/getNomenclator'

const emit = defineEmits(['ActualizarTabla'])

/*Funcion de procesado de Datos para ejecutar el eliminar elemento*/
const DeleteItem = async () => {
  try {
    switch (AutenticCategoryItemDelete.value) {
      //Caso Provincia
      case STRINGS.provinciaLowercase:
        await api.delete(STRINGS.urlApiProvincia + '/' + idDelete.value) // DELETE /items/:id
        notify_success(STRINGS.provinciaDeleteSuccess)
        emit('ActualizarTabla', true)
        break

      //Caso Municipio
      case STRINGS.municipioLowercase:
        await api.delete(STRINGS.urlApiMunicipio + '/' + idDelete.value) // DELETE /items/:id
        notify_success(STRINGS.municipioDeleteSuccess)
        emit('ActualizarTabla', true)
        break

      //Caso Organismo
      case STRINGS.organismoLowercase:
        await api.delete(STRINGS.urlApiOrganismo + '/' + idDelete.value) // DELETE /items/:id
        notify_success(STRINGS.organismoDeleteSuccess)
        emit('ActualizarTabla', true)
        break

      //Caso Banco
      case STRINGS.bancoLowercase:
        await api.delete(STRINGS.urlApiBanco + '/' + idDelete.value) // DELETE /items/:id
        notify_success(STRINGS.bancoDeleteSuccess)
        emit('ActualizarTabla', true)
        break

      //Caso Moneda
      case STRINGS.monedasLowercase:
        await api.delete(STRINGS.urlApiMoneda + '/' + idDelete.value) // DELETE /items/:id
        notify_success(STRINGS.monedaDeleteSuccess)
        emit('ActualizarTabla', true)
        break

      //Caso Vehiculo
      case STRINGS.vehiculosLowercase:
        await api.delete(STRINGS.urlApiVehiculo + '/' + idDelete.value) // DELETE /items/:id
        notify_success(STRINGS.vehiculoDeleteSuccess)
        emit('ActualizarTabla', true)
        break

      //Caso Exento
      case STRINGS.exentoLowercase:
        await api.delete(STRINGS.urlApiExento + '/' + idDelete.value) // DELETE /items/:id
        notify_success(STRINGS.exentoDeleteSuccess)
        emit('ActualizarTabla', true)
        break

      //Caso Comprobante
      case STRINGS.comprobanteLowercase:
        await api.delete(STRINGS.urlApiComprobante + '/' + idDelete.value) // DELETE /items/:id
        notify_success(STRINGS.comprobanteDeleteSuccess)
        emit('ActualizarTabla', true)
        break

      //Caso Forma de Pago
      case STRINGS.formaDePagoLowercaseURL:
        await api.delete(STRINGS.urlApiFormaDePago + '/' + idDelete.value) // DELETE /items/:id
        notify_success(STRINGS.fdp_DeleteSuccess)
        emit('ActualizarTabla', true)
        break

      //Caso Forma de Pago
      case STRINGS.tipoCuentaLowercaseURL:
        await api.delete(STRINGS.urlApiTipoCuenta + '/' + idDelete.value) // DELETE /items/:id
        notify_success(STRINGS.tipoCuenta_DeleteSuccess)
        emit('ActualizarTabla', true)
        break
    }
  } catch (error) {
    console.error('Error al eliminar item:', error)

    switch (AutenticCategoryItemDelete.value) {
      //Caso Provincia
      case STRINGS.provinciaLowercase:
        notify_error(STRINGS.provinciaDeleteError)
        emit('ActualizarTabla', false)
        break

      //Caso Municipio
      case STRINGS.municipioLowercase:
        notify_error(STRINGS.municipioDeleteError)
        emit('ActualizarTabla', false)
        break

      //Caso Organismo
      case STRINGS.organismoLowercase:
        notify_error(STRINGS.organismoDeleteError)
        emit('ActualizarTabla', false)
        break

      //Caso Banco
      case STRINGS.bancoLowercase:
        notify_error(STRINGS.bancoDeleteError)
        emit('ActualizarTabla', false)
        break

      //Caso Moneda
      case STRINGS.monedasLowercase:
        notify_error(STRINGS.monedaDeleteError)
        emit('ActualizarTabla', false)
        break

      //Caso Vehiculo
      case STRINGS.vehiculosLowercase:
        notify_error(STRINGS.vehiculoDeleteError)
        emit('ActualizarTabla', false)
        break

      //Caso Exento
      case STRINGS.exentoLowercase:
        notify_error(STRINGS.exentoDeleteError)
        emit('ActualizarTabla', false)
        break

      //Caso Comprobante
      case STRINGS.comprobanteLowercase:
        notify_error(STRINGS.comprobanteDeleteError)
        emit('ActualizarTabla', false)
        break

      //Caso Forma de Pago
      case STRINGS.formaDePagoLowercaseURL:
        notify_success(STRINGS.fdp_DeleteError)
        emit('ActualizarTabla', false)
        break

      //Caso Tipo de cuenta
      case STRINGS.tipoCuentaLowercaseURL:
        notify_success(STRINGS.tipoCuenta_DeleteError)
        emit('ActualizarTabla', false)
        break
    }
  }
  Reset()
}

/*Función que levanta el dialogo*/
const getUpDialogDelete = async (codigo, id, path) => {
  nameItemDelete.value = codigo
  idDelete.value = id
  Ruta.value = path
  CategoryItemDelete.value = Ruta.value[1]
  AutenticCategoryItemDelete.value = Ruta.value[1]

  CategoryItemDelete.value = imports.JoinCamelCase(CategoryItemDelete.value)

  //identificar si la ruta es una cadena femenina o masculina
  var gestFemale = imports.getGestFemale()
  if (gestFemale.includes(CategoryItemDelete.value.toUpperCase())) {
    titleContent.value = STRINGS.PreguntaDeleteFemenino
  } else {
    titleContent.value = STRINGS.PreguntaDeleteMasculino
  }

  await SearchChildNodesToDelete()
  ShowChildNodesToDelete()
  //Se levanta el dialogo
  backdropFilter.value = list
  dialog.value = true
}

/* Busca si el elemnto a borrar presenta relación de datos con otras tablas */
const SearchChildNodesToDelete = async () => {
  switch (AutenticCategoryItemDelete.value) {
    //Caso Provincia
    case STRINGS.provinciaLowercase:
      var provinciaObjet = { label: nameItemDelete.value, value: idDelete.value }
      elementChildrenDelete.value = await getNomenclator.loadMunicipiosByProvincia(
        provinciaObjet,
        false,
      )
      break
  }
}

/* Muestra si el elemnto a borrar presenta relación de datos con otras tablas  */
const ShowChildNodesToDelete = () => {
  return elementChildrenDelete.value.length > 0 ? true : false
}

/* Función encargada de cerrar el dialogo */
const Reset = () => {
  dialog.value = false
}

/* Referencias del dialogo */
const list = STRINGS.OpacityDialog
const dialog = ref(false)
const backdropFilter = ref(null)

/* v-model */
const nameItemDelete = ref('')
const idDelete = ref('')
const Ruta = ref([])
const titleContent = ref('')
const CategoryItemDelete = ref('')
const AutenticCategoryItemDelete = ref('')
const elementChildrenDelete = ref([])

/* Método para exponer funciones al componente Padre */
defineExpose({
  getUpDialogDelete,
})
</script>
