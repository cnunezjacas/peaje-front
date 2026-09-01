<template>
  <div class="">
    <q-dialog v-model="dialog" persistent :backdrop-filter="backdropFilter" class="dialog-lg">
      <q-card class="my-dialog-card">
        <q-card-section class="row items-center text-white q-pb-none text-h6 bg-green-5 q-pa-md">
          <span class="icon-text q-mx-sm">
            <q-icon name="edit" />
          </span>
          <span class="icon-text"
            >{{ STRINGS.edit.toUpperCase() }} - {{ STRINGS.body.toUpperCase() }}</span
          >
        </q-card-section>

        <q-card-section>
          <div class="row flex justify-between">
            <div class="col-3">
              <q-input
                v-model="TextNombreAbrOrg"
                ref="textNombre_AbrOrg"
                color="green"
                :rules="validaciones_generales.rulesOnlyUppercase"
                type="text"
                :label="STRINGS.nombre_abreviado"
                @keyup="checkStatusInputs"
              />
            </div>
            <div class="col-8">
              <q-input
                v-model="TextNombreOrg"
                color="green"
                type="text"
                :rules="validaciones_generales.rulesOnlyText"
                :label="STRINGS.name"
                @keyup="checkStatusInputs"
              />
            </div>
          </div>
        </q-card-section>

        <q-card-section>
          <div class="flex justify-start">
            <div class="">
              <q-btn
                icon="check"
                :class="disabledBtnSave"
                @click="CheckData()"
                :label="STRINGS.save"
                color="green"
              />
            </div>

            <div class="">
              <q-btn
                flat
                icon="close"
                :label="STRINGS.close"
                @click="Reset()"
                color="dark"
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
import { ref } from 'vue'
import { STRINGS } from 'utils/string.js'
import { useApi } from 'composables/useApi.js'
import { expRegulares } from 'src/utils/expresiones_regulares.js'
import CheckField from 'src/utils/utils_axios/nomencladores/CheckField'
import validaciones_generales from 'src/utils/validaciones_generales'
import { useNotify } from 'src/utils/notify/notify.js'

/* =================================================== */
/*  ===== DECLARACIONES ===== */
/* =================================================== */
const { notify_success, notify_error } = useNotify()

//  Inicializar el composable
const { patchData, fetchData } = useApi()

const emit = defineEmits(['ActualizarTabla'])

/* función para verificar si un valor existe en la API */
const CheckCode = async () => {
  const url = STRINGS.urlApiOrganismo
  const result = await CheckField(
    url,
    STRINGS.acronym.toLocaleLowerCase(),
    String(TextNombreAbrOrg.value),
    fetchData,
  )
  return result
}

/* Comprueba que existan cambios y que el código key no sea repetido */
const CheckData = async () => {
  if (checkStatusInputs() != STRINGS.desabilitar) {
    // Verificar si el código ya existe
    if (InputDifferent() && TextNombreAbrOrg.value !== TextNombreAbrOrg_copy.value) {
      if (await CheckCode()) {
        // Mostrar mensaje de error o alertar al usuario
        notify_error(STRINGS.codigoRepetido)
        return textNombre_AbrOrg.value.focus()
      } else {
        SendData()
      }
    } else {
      SendData()
    }
  }
}

/*Funcion de procesado de Datos*/
const SendData = async () => {
  const newItem = {
    nombre: TextNombreOrg.value.toUpperCase(),
    siglas: TextNombreAbrOrg.value,
  }

  try {
    const { data, error } = await patchData(STRINGS.urlApiOrganismo + '/' + _id.value, newItem) // POST /items

    if (!data && error) return notify_error(`${STRINGS.errorEdit} ${STRINGS.body}`)

    emit('ActualizarTabla', true)
    notify_success(`${STRINGS.body} ${STRINGS.successEdit}`)
    Reset()
  } catch (error) {
    console.error(`Error al actualizar item ${STRINGS.body}:`, error)
    notify_error(`${STRINGS.errorEdit} ${STRINGS.body}`)
  }
}

/*Función que levanta el dialogo*/
const getUpDialogEdit = (row) => {
  backdropFilter.value = list
  dialog.value = true

  TextNombreAbrOrg.value = row.siglas
  TextNombreOrg.value = row.nombre
  _id.value = row._id

  TextNombreOrg_copy.value = row.siglas
  TextNombreAbrOrg_copy.value = row.nombre
}

//Función para comprobar que los campos no estén vacíos
const InputEmpty = () => {
  if (TextNombreAbrOrg.value !== '' && TextNombreOrg.value !== '') return true
  else return false
}

/* Función para evaluar que los campos hallan sido modificados */
const InputDifferent = () => {
  return !(
    TextNombreAbrOrg.value === TextNombreAbrOrg_copy.value &&
    TextNombreOrg.value === TextNombreOrg_copy.value
  )
}

//Función para comprobar que los campos sean válidos
const InputRegularExpressions = () => {
  if (
    expRegulares.onlyText.test(TextNombreOrg.value) &&
    expRegulares.onlyUppercase.test(TextNombreAbrOrg.value)
  )
    return true
  else return false
}

//Función para comprobar los campos y habilitar botón GUARDAR
const checkStatusInputs = () => {
  const isValid = InputEmpty() && InputRegularExpressions() && InputDifferent()
  disabledBtnSave.value = isValid ? '' : STRINGS.desabilitar
  return disabledBtnSave.value
}

/*Función para limpiar los campos del dialogo luego del submit*/
const Reset = () => {
  dialog.value = false
  TextNombreOrg.value = ''
  TextNombreAbrOrg.value = ''
  disabledBtnSave.value = STRINGS.desabilitar
}

/* Variables del dialogo */
const dialog = ref(false)
const list = STRINGS.OpacityDialog
const backdropFilter = ref(null)

//Campos Originales
const TextNombreOrg = ref('')
const TextNombreAbrOrg = ref('')
const _id = ref('')

//Campos Copias
const TextNombreOrg_copy = ref('')
const TextNombreAbrOrg_copy = ref('')

/* Referencia del campo key */
const textNombre_AbrOrg = ref(null)

/* Referencia del botón de enviar datos */
const disabledBtnSave = ref(STRINGS.desabilitar)

/* Método para exponer funciones al componente Padre */
defineExpose({
  getUpDialogEdit,
})
</script>
