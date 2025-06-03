<template>
  <div class="">
    <q-dialog
      v-model="dialogDelete"
      persistent
      ref="refDialogoDelete"
      :backdrop-filter="backdropFilter"
    >
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
          </div>
        </q-card-section>

        <q-card-section>
          <div class="flex justify-center">
            <div class="">
              <q-btn
                icon="check"
                @click="Procesar_Delete"
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
                v-close-popup
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
import { STRINGS } from '../../../../utils/string.js'
import api from 'src/axios.js'
import notify_success from 'src/utils/notify/notify_success.js'
import notify_error from 'src/utils/notify/notify_error.js'
import imports from 'src/utils/imports.js'

const list = 'blur(4px) saturate(150%)'

const refDialogoDelete = ref(null)

const nameItemDelete = ref('')
const idDelete = ref('')
const Ruta = ref([])
const titleContent = ref('')
const CategoryItemDelete = ref('')

const emit = defineEmits(['ActualizarTablaBanco'])

/*Funcion de procesado de Datos*/
const Procesar_Delete = async () => {
  try {
    switch (CategoryItemDelete.value) {
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
      /*case STRINGS.formaDePagoLowercaseURL:
        await api.delete(STRINGS.urlApiMunicipio + '/' + idDelete.value) // DELETE /items/:id
        notify_success(STRINGS.municipioDeleteSuccess)
        emit('ActualizarTabla', true)
        break*/
    }
  } catch (error) {
    console.error('Error al eliminar item:', error)

    switch (CategoryItemDelete.value) {
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
      /*case STRINGS.formaDePagoLowercaseURL:
        await api.delete(STRINGS.urlApiMunicipio + '/' + idDelete.value) // DELETE /items/:id
        notify_success(STRINGS.municipioDeleteSuccess)
        emit('ActualizarTabla', true)
        break*/
    }
  }
  refDialogoDelete.value.hide()
}

/*Función que levanta el dialogo*/
const LevantarDialogoDelete = (codigo, id, path) => {
  nameItemDelete.value = codigo
  idDelete.value = id
  Ruta.value = path
  CategoryItemDelete.value = Ruta.value[1]

  //identificar si la ruta es una cadena femenina o masculina
  var gestFemale = imports.getGestFemale()
  if (gestFemale.includes(CategoryItemDelete.value)) {
    titleContent.value = STRINGS.PreguntaDeleteFemenino
  } else {
    titleContent.value = STRINGS.PreguntaDeleteMasculino
  }

  //Se levanta el dialogo
  backdropFilter.value = list
  dialogDelete.value = true
}

defineExpose({
  LevantarDialogoDelete,
})

const dialogDelete = ref(false)
const backdropFilter = ref(null)

//const dialogModel = ref(false)
</script>
