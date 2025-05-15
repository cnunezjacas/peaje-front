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

  <table_Gest_provincia ref="Ref_table_Gest_provincia" style="display: none" />
</template>

<script setup>
//importaciones
import { ref } from 'vue'
import { STRINGS } from '../../../../utils/string.js'
import table_Gest_provincia from '../tables/table_Gest_provincia.vue'
import api from 'src/axios.js'
import { Notify } from 'quasar'

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
    Notify.create({
      color: 'positive', // color verde para éxito
      icon: 'check_circle',
      message: STRINGS.provinciaDeleteSuccess,
      position: 'top',
      timeout: 3000,
    })
    emit('ActualizarTablaProvincia', true)
  } catch (error) {
    console.error('Error al eliminar item:', error)
    Notify.create({
      color: 'negative',
      icon: 'error',
      message: STRINGS.provinciaDeleteError,
      position: 'bottom',
      timeout: 3000,
    })
    emit('ActualizarTablaProvincia', false)
  }
  refDialogoDeleteProvincia.value.hide()
}

/*Función que levanta el dialogo*/
const LevantarDialogoDeleteProvincia = (nombre, codigo, id) => {
  backdropFilter.value = list

  dialogDeleteProvincia.value = true
  nombreProvinciaDelete.value = nombre
  codigoProvinciaDelete.value = String(codigo)
  idProvinciaDelete.value = id
}

defineExpose({
  LevantarDialogoDeleteProvincia,
  // LevantarDialogoAddModelo,
})

const dialogDeleteProvincia = ref(false)

//const dialogModel = ref(false)

const backdropFilter = ref(null)
const Ref_table_Gest_provincia = ref(null)
</script>
