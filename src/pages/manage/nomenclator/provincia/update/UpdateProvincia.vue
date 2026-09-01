<template>
  <div class="">
    <q-dialog
      v-model="dialog"
      persistent
      ref="refDialogoEditProvincia"
      :backdrop-filter="backdropFilter"
    >
      <q-card>
        <q-card-section class="row items-center text-white q-pb-none text-h6 bg-green-5 q-pa-md">
          <span class="icon-text q-mx-sm">
            <q-icon name="edit" />
          </span>
          <span class="icon-text"
            >{{ STRINGS.edit.toUpperCase() }} - {{ STRINGS.province.toUpperCase() }}</span
          >
        </q-card-section>

        <q-card-section>
          <div class="row flex justify-between">
            <div class="col-5">
              <q-input
                v-model="TextNombre_prov"
                color="green"
                :rules="validaciones_generales.rulesOnlyText"
                type="text"
                :label="STRINGS.name"
              />
            </div>
            <div class="col-5">
              <q-input
                ref="textCodigo_prov"
                v-model="TextCodigo_prov"
                color="green"
                type="text"
                :rules="validaciones_generales.rulesOnlyNumbers"
                :label="STRINGS.code"
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
/* Importaciones */
import { ref, watch } from 'vue'
import { STRINGS } from 'utils/string.js'
import { useApi } from 'src/composables/useApi'
import { expRegulares } from 'src/utils/expresiones_regulares.js'
import CheckField from 'src/utils/utils_axios/nomencladores/CheckField.js'
import validaciones_generales from 'src/utils/validaciones_generales.js'
import { useNotify } from 'src/utils/notify/notify.js'

/* =================================================== */
/*  ===== DECLARACIONES ===== */
/* =================================================== */
const { notify_success, notify_error } = useNotify()
const { fetchData, patchData } = useApi()

const emit = defineEmits(['ActualizarTabla'])

/* función para verificar si un valor existe en la API */
const CheckCode = async () => {
  const url = STRINGS.urlApiProvincia
  const result = await CheckField(url, 'codigo', Number(TextCodigo_prov.value), fetchData)
  return result
}

/* Comprueba que existan cambios y que el código key no sea repetido */
const CheckData = async () => {
  if (checkStatusInputs() != STRINGS.desabilitar) {
    // Verificar si el código ya existe
    if (InputDifferent() && TextCodigo_prov.value !== TextCodigo_prov_copy.value) {
      if (await CheckCode()) {
        // Mostrar mensaje de error o alertar al usuario
        notify_error(STRINGS.codigoRepetido)
        return textCodigo_prov.value.focus()
      } else {
        SendData()
      }
    } else {
      SendData()
    }
  }
}

/*Funcion que envia los Datos al API*/
const SendData = async () => {
  const newItem = { nombre: TextNombre_prov.value, codigo: Number(TextCodigo_prov.value) }

  try {
    const { data, error } = await patchData(STRINGS.urlApiProvincia + '/' + _id.value, newItem) // POST /items

    if (!data && error) return notify_error(`${STRINGS.errorEdit} ${STRINGS.province}`)

    notify_success(`${STRINGS.province} ${STRINGS.successEdit}`)
    emit('ActualizarTabla', true)
    Reset()
  } catch (error) {
    console.error(`Error al actualizar item ${STRINGS.province}:`, error)
    notify_error(`${STRINGS.errorEdit} ${STRINGS.province}`)
  }
}

/*Función que levanta el dialogo*/
const getUpDialogEdit = (row) => {
  /* Se levanta el dialogo */
  backdropFilter.value = list
  dialog.value = true

  //Contenido de modelos de los capos en pantalla
  TextCodigo_prov.value = String(row.codigo)
  TextNombre_prov.value = row.nombre
  _id.value = row._id

  //Copias de Seguridad
  TextCodigo_prov_copy.value = String(row.codigo)
  TextNombre_prov__copy.value = row.nombre
}

//Función para comprobar que los campos no estén vacíos
const InputEmpty = () => {
  if (TextCodigo_prov.value !== '' && TextNombre_prov.value !== '') return true
  else return false
}
/* Función para evaluar que los campos hallan sido modificados */
const InputDifferent = () => {
  return !(
    TextCodigo_prov.value === TextCodigo_prov_copy.value &&
    TextNombre_prov.value === TextNombre_prov__copy.value
  )
}

//Función para comprobar que los campos sean válidos
const InputRegularExpressions = () => {
  if (
    expRegulares.onlyText.test(TextNombre_prov.value) &&
    expRegulares.onlyNumber.test(TextCodigo_prov.value)
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
  TextCodigo_prov.value = ''
  TextNombre_prov.value = ''
  TextCodigo_prov_copy.value = ''
  TextNombre_prov__copy.value = ''
  _id.value = ''
  disabledBtnSave.value = STRINGS.desabilitar
}

/* Variables del dialogo */
const dialog = ref(false)
const backdropFilter = ref(null)
const list = STRINGS.OpacityDialog

/* Referencias de los modelos de los campos */
const TextCodigo_prov = ref('')
const TextNombre_prov = ref('')

/* Referencias de variables de seguridad */
const TextCodigo_prov_copy = ref('')
const TextNombre_prov__copy = ref('')
const _id = ref('')

/* Referencia del campo key */
const textCodigo_prov = ref(null)

/* Referencia del botón de enviar datos */
const disabledBtnSave = ref(STRINGS.desabilitar)

/* ("observador") que permite reaccionar a cambios en datos específicos del/los componente/s */
watch([TextNombre_prov, TextCodigo_prov], () => {
  checkStatusInputs()
})

/* Método para exponer funciones al componente Padre */
defineExpose({
  getUpDialogEdit,
})
</script>
