<template>
  <div class="">
    <q-dialog
      v-model="dialogDeleteProvincia"
      persistent
      ref="refDialogoDeleteProvincia"
      :backdrop-filter="backdropFilter"
    >
      <q-card>
        <q-card-section class="row items-center text-white q-pb-none text-h6 bg-green-5 q-pa-md">
          <span class="icon-text q-mx-sm">
            <q-icon name="delete" />
          </span>
          <span class="icon-text">{{ STRINGS.deleteProvincia.toUpperCase() }}</span>
        </q-card-section>

        <q-card-section>
          <div class="row flex justify-center">
            <div class="col-12 text-center">
              <q-icon name="help" color="green" size="3rem" />
            </div>
            <div class="col-12 text-center q-pt-md">
              <p>{{ STRINGS.PreguntaDeleteProvincia }} {{ nombreProvinciaDelete }} ?</p>
            </div>
          </div>
        </q-card-section>

        <q-card-section>
          <div class="flex justify-center">
            <div class="">
              <q-btn
                icon="check"
                @click="Procesar_DeleteProvincia"
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

const refDialogoDeleteProvincia = ref(null)

const nombreProvinciaDelete = ref('')
const codigoProvinciaDelete = ref('')
const idProvinciaDelete = ref('')

const emit = defineEmits(['ActualizarTablaProvincia'])

/*Funcion de procesado de Datos*/
const Procesar_DeleteProvincia = async () => {
  //TODO: Ajax Request DELETE PROVINCIA

  try {
    await api.delete(STRINGS.urlApiProvincia + '/' + idProvinciaDelete.value) // DELETE /items/:id

    notify_success(STRINGS.provinciaDeleteSuccess)

    emit('ActualizarTablaProvincia', true)
  } catch (error) {
    console.error('Error al eliminar item:', error)
    notify_error(STRINGS.provinciaDeleteError)
    emit('ActualizarTablaProvincia', false)
  }
  refDialogoDeleteProvincia.value.hide()
}

/*Función que levanta el dialogo*/
const LevantarDialogoDelete = (nombre, codigo, id) => {
  backdropFilter.value = list

  dialogDeleteProvincia.value = true
  nombreProvinciaDelete.value = nombre
  codigoProvinciaDelete.value = String(codigo)
  idProvinciaDelete.value = id
}

defineExpose({
  LevantarDialogoDelete,
  // LevantarDialogoAddModelo,
})

const dialogDeleteProvincia = ref(false)

//const dialogModel = ref(false)

const backdropFilter = ref(null)
</script>
