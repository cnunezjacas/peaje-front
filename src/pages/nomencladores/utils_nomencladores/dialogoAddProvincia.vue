<template>
  <div class="q-pa-md q-gutter-sm">
    <q-dialog
      v-model="dialog"
      persistent
      ref="refDialogoAddProvincia"
      :backdrop-filter="backdropFilter"
    >
      <q-card>
        <q-card-section class="row items-center q-pb-none text-h6">
          {{ STRINGS.addProvincia }}
        </q-card-section>

        <q-card-section>
          <div class="row flex justify-between">
            <div class="col-5">
              <q-input
                v-model="TextNombre_prov"
                ref="textNombre_prov"
                color="green"
                :rules="rulesAddNombreProvincia"
                type="text"
                :label="STRINGS.nombre_prov"
              />
            </div>
            <div class="col-5">
              <q-input
                ref="textCodigo_prov"
                v-model="TextCodigo_prov"
                color="green"
                type="text"
                :rules="rulesAddCodigoProvincia"
                :label="STRINGS.codigo_prov"
              />
            </div>
          </div>
        </q-card-section>

        <q-card-section>
          <div class="row flex justify-end">
            <div class="col-5">
              <q-btn
                icon="check"
                @click="Procesar_AddProvincia()"
                :label="STRINGS.save"
                color="green"
              />
            </div>

            <div class="col-5">
              <q-btn flat icon="close" :label="STRINGS.close" color="dark" v-close-popup />
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
import { STRINGS } from '../../../utils/string.js'
import table_Gest_provincia from './table_Gest_provincia.vue'

/*import { useQuasar } from 'quasar'
var $q = useQuasar()*/

/**
 * Values for backdrop-filter are the same as in the CSS specs.
 * The following list is not an exhaustive one.
 */
const list = 'blur(4px) saturate(150%)'

const refDialogoAddProvincia = ref(null)

/*Validaciones*/
const rulesAddNombreProvincia = [
  (val) => val != '' || 'El campo no puede estar vacío',
  (val) => /^[a-zA-Z\s]+$/.test(val) || 'El campo solo puede contener letras',
]

const rulesAddCodigoProvincia = [
  (val) => val != '' || 'El campo no puede estar vacío',
  (val) => /^[0-9\s]+$/.test(val) || 'El campo solo puede contener números',
]
/*Validaciones*/

/*Funcion de procesado de Datos*/
const Procesar_AddProvincia = () => {
  if (TextCodigo_prov.value == '' || TextNombre_prov.value == '') {
    refDialogoAddProvincia.value.show()
    alert('Error')
  } else {
    let objet = { name: TextNombre_prov.value, codigo: TextCodigo_prov.value }

    Ref_table_Gest_provincia.value.rows.value = objet
    refDialogoAddProvincia.value.hide()
    Reset()
  }
}

/*Función que levanta el dialogo*/
const LevantarDialogo = () => {
  backdropFilter.value = list
  dialog.value = true
}

/*Función para limpiar los campos del dialogo luego del submit*/
const Reset = () => {
  TextCodigo_prov.value = ''
  TextNombre_prov.value = ''
}

const LevantarDialogoAddModelo = () => {
  backdropFilter.value = list
  dialogModel.value = true
}

defineExpose({
  LevantarDialogo,
  LevantarDialogoAddModelo,
})

const dialog = ref(false)

const dialogModel = ref(false)

const TextCodigo_prov = ref('')
const TextNombre_prov = ref('')
const backdropFilter = ref(null)
const Ref_table_Gest_provincia = ref(null)

const textNombre_prov = ref(null)
const textCodigo_prov = ref(null)
</script>
