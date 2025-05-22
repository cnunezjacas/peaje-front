<template>
  <div class="">
    <q-dialog
      v-model="dialogDeleteBanco"
      persistent
      ref="refDialogoDeleteBanco"
      :backdrop-filter="backdropFilter"
    >
      <q-card>
        <q-card-section class="row items-center text-white q-pb-none text-h6 bg-green-5 q-pa-md">
          <span class="icon-text q-mx-sm">
            <q-icon name="delete" />
          </span>
          <span class="icon-text">{{ STRINGS.deleteBanco.toUpperCase() }}</span>
        </q-card-section>

        <q-card-section>
          <div class="row flex justify-center">
            <div class="col-12 text-center">
              <q-icon name="help" color="green" size="3rem" />
            </div>
            <div class="col-12 text-center q-pt-md">
              <p>{{ STRINGS.PreguntaDeleteBanco }} {{ codigoBancoDelete }} ?</p>
            </div>
          </div>
        </q-card-section>

        <q-card-section>
          <div class="flex justify-center">
            <div class="">
              <q-btn
                icon="check"
                @click="Procesar_DeleteBanco"
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
import notify_success from 'src/utils/notify/notify_success.js'
import notify_error from 'src/utils/notify/notify_error.js'

const list = 'blur(4px) saturate(150%)'

const refDialogoDeleteBanco = ref(null)

const codigoBancoDelete = ref('')
const idBancoDelete = ref('')

const emit = defineEmits(['ActualizarTablaBanco'])

/*Funcion de procesado de Datos*/
const Procesar_DeleteBanco = async () => {
  //TODO: Ajax Request DELETE PROVINCIA

  try {
    await api.delete(STRINGS.urlApiBanco + '/' + idBancoDelete.value) // DELETE /items/:id

    notify_success(STRINGS.BancoDeleteSuccess)

    emit('ActualizarTablaBanco', true)
  } catch (error) {
    console.error('Error al eliminar item:', error)

    notify_error(STRINGS.BancoDeleteError)

    emit('ActualizarTablaBanco', false)
  }
  refDialogoDeleteBanco.value.hide()
}

/*Función que levanta el dialogo*/
const LevantarDialogoDeleteBanco = (codigo, id) => {
  backdropFilter.value = list
  dialogDeleteBanco.value = true

  codigoBancoDelete.value = codigo
  idBancoDelete.value = id
}

defineExpose({
  LevantarDialogoDeleteBanco,
})

const dialogDeleteBanco = ref(false)

//const dialogModel = ref(false)

const backdropFilter = ref(null)
</script>
