<template>
  <div class="">
    <q-dialog
      v-model="dialogDeleteProvincia"
      persistent
      ref="refDialogoDeleteProvincia"
      :backdrop-filter="backdropFilter"
    >
      <q-card>
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
          <div class="row flex justify-center">
            <div class="col-5">
              <q-btn
                icon="check"
                @click="Procesar_DeleteProvincia"
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
import { ref } from 'vue'
import { STRINGS } from '../../../../utils/string.js'
import table_Gest_provincia from '../tables/table_Gest_provincia.vue'

/*import { useQuasar } from 'quasar'
var $q = useQuasar()*/

/**
 * Values for backdrop-filter are the same as in the CSS specs.
 * The following list is not an exhaustive one.
 */
const list = 'blur(4px) saturate(150%)'

const refDialogoDeleteProvincia = ref(null)

const nombreProvinciaDelete = ref('')
const codigoProvinciaDelete = ref('')

//const emit = defineEmits(['oNProvinciaDeleteGestProvincia'])

/*Funcion de procesado de Datos*/
const Procesar_DeleteProvincia = () => {
  //TODO: Ajax Request DELETE PROVINCIA
  refDialogoDeleteProvincia.value.hide()
}

/*Función que levanta el dialogo*/
const LevantarDialogoDeleteProvincia = (nombre, codigo) => {
  backdropFilter.value = list
  dialogDeleteProvincia.value = true
  nombreProvinciaDelete.value = nombre
  codigoProvinciaDelete.value = codigo
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
