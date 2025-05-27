<template>
  <div class="">
    <q-dialog
      v-model="dialogDeleteMunicipio"
      persistent
      ref="refDialogoDeleteMunicipio"
      :backdrop-filter="backdropFilter"
    >
      <q-card>
        <q-card-section class="row items-center text-white q-pb-none text-h6 bg-green-5 q-pa-md">
          <span class="icon-text q-mx-sm">
            <q-icon name="delete" />
          </span>
          <span class="icon-text">{{ STRINGS.deleteMunicipio.toUpperCase() }}</span>
        </q-card-section>

        <q-card-section>
          <div class="row flex justify-center">
            <div class="col-12 text-center">
              <q-icon name="help" color="green" size="3rem" />
            </div>
            <div class="col-12 text-center q-pt-md">
              <p>
                {{ STRINGS.PreguntaDeleteMunicipio }} {{ nombreMunicipioDelete }} de la provincia
                {{ nombreProvinciaMunicipioDelete }} ?
              </p>
            </div>
          </div>
        </q-card-section>

        <q-card-section>
          <div class="flex justify-center">
            <div class="">
              <q-btn
                icon="check"
                @click="Procesar_DeleteMunicipio"
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
const refDialogoDeleteMunicipio = ref(null)

const nombreMunicipioDelete = ref('')
const nombreProvinciaMunicipioDelete = ref('')
const codigoMunicipioDelete = ref('')

const emit = defineEmits(['ActualizarTablaMunicipio'])

/*Funcion de procesado de Datos*/
const Procesar_DeleteMunicipio = async () => {
  //TODO: Ajax Request DELETE MUNICIPIO
  try {
    await api.delete(STRINGS.urlApiMunicipio + '/' + IdMunicipioDelete.value) // DELETE /items/:id

    notify_success(STRINGS.municipioDeleteSuccess)

    emit('ActualizarTablaMunicipio', true)
  } catch (error) {
    console.error('Error al eliminar item:', error)

    notify_error(STRINGS.municipioDeleteError)

    emit('ActualizarTablaMunicipio', false)
  }
  refDialogoDeleteMunicipio.value.hide()
}

/*Función que levanta el dialogo*/
const LevantarDialogoDelete = (nombre, codigo, provincia, id) => {
  backdropFilter.value = list
  dialogDeleteMunicipio.value = true
  nombreMunicipioDelete.value = nombre
  codigoMunicipioDelete.value = codigo
  nombreProvinciaMunicipioDelete.value = provincia
  IdMunicipioDelete.value = id
}

defineExpose({
  LevantarDialogoDelete,
  // LevantarDialogoAddModelo,
})

const dialogDeleteMunicipio = ref(false)

const backdropFilter = ref(null)
const IdMunicipioDelete = ref('')
</script>
