<template>
  <div class="">
    <q-dialog
      v-model="dialogDeleteMunicipio"
      persistent
      ref="refDialogoDeleteMunicipio"
      :backdrop-filter="backdropFilter"
    >
      <q-card>
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
          <div class="row flex justify-center">
            <div class="col-5">
              <q-btn
                icon="check"
                @click="Procesar_DeleteMunicipio"
                :label="STRINGS.access"
                color="green"
                size="18px"
              />
            </div>

            <div class="col-5">
              <q-btn
                flat
                icon="close"
                :label="STRINGS.cancel"
                color="dark"
                size="18px"
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

<!-- <q-alert color="positive" ref="Myalert" icon="check_circle" dense rounded class="q-mb-md">
¡Operación exitosa!
</q-alert> -->

<script setup>
//importaciones
import { ref } from 'vue'
import { STRINGS } from '../../../../utils/string.js'
import table_Gest_provincia from '../tables/table_Gest_provincia.vue'
import api from 'src/axios.js'
import { Notify } from 'quasar'

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

    Notify.create({
      color: 'positive', // color verde para éxito
      icon: 'check_circle',
      message: STRINGS.municipioDeleteSuccess,
      position: 'top',
      timeout: 3000,
    })

    emit('ActualizarTablaMunicipio', true)
  } catch (error) {
    console.error('Error al eliminar item:', error)
    Notify.create({
      color: 'negative',
      icon: 'error',
      message: STRINGS.MunicipioDeleteError,
      position: 'bottom',
      timeout: 3000,
    })
    emit('ActualizarTablaMunicipio', false)
  }
  refDialogoDeleteMunicipio.value.hide()
}

/*Función que levanta el dialogo*/
const LevantarDialogoDeleteMunicipio = (nombre, codigo, provincia, id) => {
  backdropFilter.value = list
  dialogDeleteMunicipio.value = true
  nombreMunicipioDelete.value = nombre
  codigoMunicipioDelete.value = codigo
  nombreProvinciaMunicipioDelete.value = provincia
  IdMunicipioDelete.value = id
}

defineExpose({
  LevantarDialogoDeleteMunicipio,
  // LevantarDialogoAddModelo,
})

const dialogDeleteMunicipio = ref(false)

const backdropFilter = ref(null)
const Ref_table_Gest_provincia = ref(null)
const IdMunicipioDelete = ref('')
</script>
