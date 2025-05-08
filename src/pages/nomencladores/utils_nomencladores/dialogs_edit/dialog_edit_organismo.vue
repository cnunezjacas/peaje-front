<template>
  <div class="">
    <q-dialog
      v-model="dialogEditMunicipio"
      persistent
      ref="refDialogoEditOrganismo"
      :backdrop-filter="backdropFilter"
    >
      <q-card>
        <q-card-section class="row items-center q-pb-none text-h6">
          {{ STRINGS.editMunicipio }}
        </q-card-section>

        <q-card-section>
          <div class="row flex justify-between">
            <div class="col-4">
              <q-input
                v-model="TextNombreAbrOrg"
                ref="textNombreAbrOrg"
                color="green"
                :rules="rulesAddNombreAbrOrganismo"
                type="text"
                :label="STRINGS.nombre_abreviado"
                @keyup="ComprobarEstadoInputsEdit"
              />
            </div>
            <div class="col-7">
              <q-input
                ref="textNombreOrg"
                v-model="TextNombreOrg"
                color="green"
                type="text"
                :rules="rulesAddNombreOrganismo"
                :label="STRINGS.nombre_org"
                @keyup="ComprobarEstadoInputsEdit"
              />
            </div>
          </div>
        </q-card-section>

        <q-card-section>
          <div class="row flex justify-start">
            <div class="col-5">
              <q-btn
                icon="check"
                :class="disabledBtnSaveEdit"
                @click="Procesar_EditOrganismo()"
                :label="STRINGS.save"
                color="green"
              />
            </div>

            <div class="col-5">
              <q-btn
                flat
                icon="close"
                :label="STRINGS.close"
                @click="DevolverEstadoInputsEdit"
                color="dark"
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

const refDialogoEditOrganismo = ref(null)

/*Validaciones*/
const rulesAddNombreOrganismo = [
  (val) => val != '' || 'El campo no puede estar vacío',
  (val) => /^[a-zA-ZÁÉÍÓÚÑÜáéíóúñü\s]+$/.test(val) || 'El campo solo puede contener letras',
]

const rulesAddNombreAbrOrganismo = [
  (val) => val != '' || 'El campo no puede estar vacío',
  (val) => /^[A-ZÁÉÍÓÚÜÑ\s]+$/.test(val) || 'El campo solo puede contener letras Mayúsculas',
]

const regexNombreOrganismo = /^[a-zA-ZÁÉÍÓÚÑÜáéíóúñü\s]+$/
const regexNombreAbrOrganismo = /^[A-ZÁÉÍÓÚÑÜ\s]+$/

/*Validaciones*/

/*Funcion de procesado de Datos*/
const Procesar_EditOrganismo = () => {
  if (ComprobarEstadoInputsEdit() != STRINGS.desabilitar) {
    //TODO: Ajax Request EDIT_ORGANISMO

    refDialogoEditOrganismo.value.hide()
    Reset()
  } else {
    refDialogoEditOrganismo.value.show()
  }
}

/*Función que levanta el dialogo*/
const LevantarDialogoEditOrganismo = (nameAbrOrg, nombreOrg) => {
  backdropFilter.value = list
  dialogEditMunicipio.value = true
  TextNombreAbrOrg.value = nameAbrOrg
  TextNombreOrg.value = nombreOrg

  TextNombreOrg_copy.value = nombreOrg
  TextNombreAbrOrg_copy.value = nameAbrOrg
}

const ComprobarEstadoInputsEdit = () => {
  const noHaCambiado =
    TextNombreAbrOrg.value === TextNombreAbrOrg_copy.value &&
    TextNombreOrg.value === TextNombreOrg_copy.value

  if (TextNombreAbrOrg.value.trim() == '' || TextNombreOrg.value.trim() == '') {
    disabledBtnSaveEdit.value = STRINGS.desabilitar
  } else if (noHaCambiado) {
    disabledBtnSaveEdit.value = STRINGS.desabilitar
  } else if (
    !regexNombreAbrOrganismo.test(TextNombreAbrOrg.value) ||
    !regexNombreOrganismo.test(TextNombreOrg.value)
  ) {
    disabledBtnSaveEdit.value = STRINGS.desabilitar
  } else {
    disabledBtnSaveEdit.value = ''
  }
  return disabledBtnSaveEdit.value
}

const DevolverEstadoInputsEdit = () => {
  disabledBtnSaveEdit.value = STRINGS.desabilitar
}

/*Función para limpiar los campos del dialogo luego del submit*/
const Reset = () => {
  TextNombreOrg.value = ''
  TextNombreAbrOrg.value = ''
}

// const LevantarDialogoAddModelo = () => {
//   backdropFilter.value = list
//   dialogModel.value = true
// }

defineExpose({
  LevantarDialogoEditOrganismo,
  // LevantarDialogoAddModelo,
})

const dialogEditMunicipio = ref(false)

//const dialogModel = ref(false)

//Campos Originales
const TextNombreOrg = ref('')
const TextNombreAbrOrg = ref('')

//Campos Copias
const TextNombreOrg_copy = ref('')
const TextNombreAbrOrg_copy = ref('')

const backdropFilter = ref(null)
const Ref_table_Gest_provincia = ref(null)

const textNombreAbrOrg = ref(null)
const textNombreOrg = ref(null)

const disabledBtnSaveEdit = ref(STRINGS.desabilitar)
</script>
