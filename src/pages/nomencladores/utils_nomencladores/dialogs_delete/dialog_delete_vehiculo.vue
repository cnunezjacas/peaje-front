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
          <span class="icon-text">{{ STRINGS.deleteVehiculo.toUpperCase() }}</span>
        </q-card-section>

        <q-card-section>
          <div class="row flex justify-center">
            <div class="col-12 text-center">
              <q-icon name="help" color="green" size="3rem" />
            </div>
            <div class="col-12 text-center q-pt-md">
              <p>{{ STRINGS.PreguntaDeleteVehículo }} {{ codigoDelete }} ?</p>
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

const list = 'blur(4px) saturate(150%)'

const refDialogoDelete = ref(null)

const codigoDelete = ref('')
const idDelete = ref('')

const emit = defineEmits(['ActualizarTablaVehiculo'])

/*Funcion de procesado de Datos*/
const Procesar_Delete = async () => {
  //TODO: Ajax Request DELETE PROVINCIA

  try {
    await api.delete(STRINGS.urlApiVehiculo + '/' + idDelete.value) // DELETE /items/:id

    notify_success(STRINGS.vehiculoDeleteSuccess)

    emit('ActualizarTablaVehiculo', true)
  } catch (error) {
    console.error('Error al eliminar item:', error)
    notify_error(STRINGS.vehiculoDeleteError)
    emit('ActualizarTablaVehiculo', false)
  }
  refDialogoDelete.value.hide()
}

/*Función que levanta el dialogo*/
const LevantarDialogoDelete = (codigo, id) => {
  backdropFilter.value = list
  dialogDelete.value = true

  codigoDelete.value = codigo
  idDelete.value = id
}

const dialogDelete = ref(false)
const backdropFilter = ref(null)

defineExpose({
  LevantarDialogoDelete,
})
</script>
