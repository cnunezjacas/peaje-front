<template>
  <div class="">
    <q-dialog
      v-model="dialog"
      persistent
      ref="refDialogoAdd"
      :backdrop-filter="backdropFilter"
      content-class="dialog-xl"
      :style="{ '--q-dialog-max-width': '800px' }"
    >
      <q-card class="my-dialog-card">
        <q-card-section class="row items-center text-white q-pb-none text-h6 bg-green-5 q-pa-md">
          <span class="icon-text q-mx-sm">
            <q-icon name="note_add" />
          </span>
          <span class="icon-text"
            >{{ STRINGS.update.toUpperCase() }} {{ STRINGS.cuentaLowercase.toUpperCase() }}</span
          >
        </q-card-section>

        <q-card-section>
          <!-- codigo y nombre -->
          <div class="row flex justify-between">
            <!-- Banco CUC -->
            <div class="col-6">
              <q-input
                v-model="TextTitularCuenta"
                ref="textTitularCuenta"
                color="green"
                type="text"
                :rules="validaciones_generales.rulesOnlyText"
                :label="STRINGS.titular"
                @keyup="checkStatusInputs"
              />
            </div>

            <div class="col-5">
              <q-select
                v-model="TextTipoCuenta"
                ref="textTipoCuenta"
                color="green"
                :options="optionsAccount"
                type="text"
                :rules="validaciones_generales.rulesNoEmpty"
                :label="STRINGS.tipoCuenta"
                @keyup="checkStatusInputs"
              />
            </div>

            <div class="col-5">
              <q-select
                v-model="TextBanco"
                ref="textBanco"
                color="green"
                :options="optionsBanco"
                type="text"
                :rules="validaciones_generales.rulesNoEmpty"
                :label="STRINGS.banco_cuenta"
                @keyup="checkStatusInputs"
              />
            </div>

            <div class="col-5">
              <q-input
                v-model="TextCuenta"
                ref="textCuenta"
                color="green"
                maxlength="19"
                type="text"
                :rules="validaciones_generales.rulesCardOfBank"
                :label="STRINGS.cuenta"
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
                v-on:click="Reset"
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
import { ref, onBeforeMount, watch } from 'vue'
import { STRINGS } from 'utils/string.js'
import CheckBankAccount from 'utils/utils_axios/entity/CheckBankAccount'
import FormatCardNumberBank from 'src/utils/utils_axios/entity/FormatCardNumberBank'
import { expRegulares } from 'src/utils/expresiones_regulares.js'
import { useNotify } from 'src/utils/notify/notify.js'
import getNomenclator from 'src/utils/utils_axios/nomencladores/getNomenclator'
import validaciones_generales from 'src/utils/validaciones_generales'
import { useApi } from 'src/composables/useApi'

const { patchData, fetchData } = useApi()
const { notify_success, notify_error } = useNotify()
const optionsBanco = ref([])
const optionsAccount = ref([])

/* Petición para devolver todos los bancos del sistema */
const LoadBank = async () => {
  optionsBanco.value = await getNomenclator.LoadBank()
}

/* Petición para devolver todos los tipos de cuentas del sistema */
const LoadTypeAccount = async () => {
  optionsAccount.value = await getNomenclator.LoadTypeAccount()
}

onBeforeMount(() => {
  LoadBank()
  LoadTypeAccount()
})

const emit = defineEmits(['ActualizarTabla'])

/* función para verificar si un valor existe en la API */
const CheckAccount = async () => {
  // Verificar si la cuenta existe, pertenece a un banco exacto
  const Account = await CheckBankAccount(
    TextBanco.value?.value, // Id de Banco
    await FormatCardNumberBank(TextCuenta.value), // Numero de cuenta bancaria
    fetchData, // USE-API
  )
  return Account
}

/* Comprueba que existan cambios y que el código key no sea repetido */
const CheckData = async () => {
  if (checkStatusInputs() != STRINGS.desabilitar) {
    // Solo verificar duplicado si el número de cuenta cambió
    const cuentaCambio = TextCuenta.value !== TextCuenta_copy.value

    if (InputDifferent() && cuentaCambio) {
      if (await CheckAccount()) {
        // Mostrar mensaje de error o alertar al usuario
        notify_error(STRINGS.cardBankrepeat)
        return textCuenta.value.focus()
      } else {
        SendData()
      }
    } else {
      SendData()
    }
  }
}

/* Función de procesado de Datos */
const SendData = async () => {
  const Item = {
    titular: TextTitularCuenta.value,
    numero: await FormatCardNumberBank(TextCuenta.value),
    banco: TextBanco.value?.value ? String(TextBanco.value.value) : TextIdBanco.value,
    tipo: TextTipoCuenta.value?.value ? String(TextTipoCuenta.value.value) : TextIdTipoCuenta.value,
  }

  try {
    const { data, error } = await patchData(STRINGS.urlApiCuenta + '/' + Textid.value, Item)

    // Mostrar alerta positiva de éxito
    if (data && !error) {
      notify_success(`${Title.value} ${STRINGS.successEdit}`)
      emit('ActualizarTabla', true)
      dialog.value = false
      Reset()
      return
    } else {
      notify_error(`${STRINGS.errorEdit} ${Title.value}`)
      console.error(`${STRINGS.errorEdit} ${Title.value} : ${error}`)
      return
    }
  } catch (error) {
    console.error(`${STRINGS.errorEdit} ${Title.value} : ${error}`)
    notify_error(`${STRINGS.errorEdit} ${Title.value}`)
    return
  }
}

/* Función que levanta el diálogo */
const getUpDialogEdit = async (row) => {
  /* Se levanta el diálogo */
  backdropFilter.value = list
  dialog.value = true

  // Asignar valores originales
  TextTitularCuenta.value = row.titular
  TextCuenta.value = row.numero
  Textid.value = row._id

  // Asignar banco como objeto { label, value }
  TextBanco.value = {
    label: row.banco.codigo,
    value: row.banco._id,
  }

  // Asignar tipo de cuenta como objeto { label, value }
  TextTipoCuenta.value = {
    label: row.tipo.codigo,
    value: row.tipo._id,
  }

  // Guardar copias de seguridad (mismos objetos)
  TextTitularCuenta_copy.value = row.titular
  TextCuenta_copy.value = row.numero

  TextBanco_copy.value = {
    label: row.banco.codigo,
    value: row.banco._id,
  }

  TextTipoCuenta_copy.value = {
    label: row.tipo.codigo,
    value: row.tipo._id,
  }
}

/* Función para limpiar los campos del diálogo luego del submit */
const Reset = () => {
  dialog.value = false
  TextTitularCuenta.value = ''
  TextBanco.value = {}
  TextCuenta.value = ''
  TextTipoCuenta.value = {}
  Textid.value = ''

  TextTitularCuenta_copy.value = ''
  TextBanco_copy.value = {}
  TextCuenta_copy.value = ''
  TextTipoCuenta_copy.value = {}
}

/**
 * Valida que todos los campos obligatorios no estén vacíos
 * @returns {boolean} true si todos los campos tienen contenido
 */
const InputEmpty = () => {
  return (
    TextTitularCuenta.value.trim() !== '' &&
    TextCuenta.value.trim() !== '' &&
    TextBanco.value?.value !== undefined &&
    TextTipoCuenta.value?.value !== undefined
  )
}

/**
 * Evalúa si los campos han sido modificados comparando valores actuales con las copias
 * Compara: titular, cuenta, banco (value) y tipo de cuenta (value)
 * @returns {boolean} true si al menos un campo fue modificado
 */
const InputDifferent = () => {
  const titularIgual = TextTitularCuenta.value === TextTitularCuenta_copy.value
  const cuentaIgual = TextCuenta.value === TextCuenta_copy.value
  const bancoIgual = TextBanco.value?.value === TextBanco_copy.value?.value
  const tipoIgual = TextTipoCuenta.value?.value === TextTipoCuenta_copy.value?.value

  // Retorna true si AL MENOS UN campo es diferente
  return !(titularIgual && cuentaIgual && bancoIgual && tipoIgual)
}

/**
 * Valida que los campos cumplan con las expresiones regulares
 * @returns {boolean} true si todos los campos son válidos
 */
const InputRegularExpressions = () => {
  const titularValido = expRegulares.onlyText.test(TextTitularCuenta.value)
  const cuentaValida = expRegulares.cardOfBank.test(TextCuenta.value)

  return titularValido && cuentaValida
}

/**
 * Verifica el estado completo del formulario y habilita/deshabilita el botón guardar
 * El botón se habilita solo cuando: campos no vacíos + regex válidas + hay cambios
 */
const checkStatusInputs = () => {
  const isValid = InputEmpty() && InputRegularExpressions() && InputDifferent()
  disabledBtnSave.value = isValid ? '' : STRINGS.desabilitar
  return disabledBtnSave.value
}

/* Variables del diálogo */
const dialog = ref(false)
const backdropFilter = ref(null)
const list = STRINGS.OpacityDialog
const Title = ref('Cuenta')

// Campos Originales
const TextBanco = ref({})
const TextIdBanco = ref('')
const TextTitularCuenta = ref('')
const TextCuenta = ref('')
const TextIdTipoCuenta = ref('')
const TextTipoCuenta = ref({})
const Textid = ref('')

// Campos Copias (para detectar cambios)
const TextBanco_copy = ref({})
const TextTitularCuenta_copy = ref('')
const TextCuenta_copy = ref('')
const TextTipoCuenta_copy = ref({})

/* Referencia del campo key */
const textCuenta = ref(null)
const textTipoCuenta = ref(null)

/* Referencia del botón de enviar datos */
const disabledBtnSave = ref(STRINGS.desabilitar)

/* Observadores que permiten reaccionar a cambios en datos específicos */
watch(TextBanco, () => {
  checkStatusInputs()
})

watch(TextTipoCuenta, () => {
  checkStatusInputs()
})

/* Método para exponer funciones al componente Padre */
defineExpose({
  getUpDialogEdit,
})
</script>
