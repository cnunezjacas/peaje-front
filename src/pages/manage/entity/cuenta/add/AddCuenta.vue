<template>
  <div class="">
    <q-dialog
      v-model="dialog"
      persistent
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
            >{{ STRINGS.add.toUpperCase() }} {{ STRINGS.cuentaLowercase.toUpperCase() }}</span
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
                :label="STRINGS.titular_de_la_cuenta"
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
                @click="SendData()"
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
import FormatCardNumberBank from 'utils/utils_axios/entity/FormatCardNumberBank'
import { expRegulares } from 'src/utils/expresiones_regulares.js'
import getNomenclator from 'src/utils/utils_axios/nomencladores/getNomenclator'
import validaciones_generales from 'src/utils/validaciones_generales'
import { useApi } from 'src/composables/useApi'
import { useNotify } from 'src/utils/notify/notify.js'

/* =================================================== */
/*  ===== DECLARACIONES REF ===== */
/* =================================================== */
const { notify_success, notify_error } = useNotify()
const { postData, fetchData } = useApi()

/**
 * Carga todos los bancos disponibles para el select
 */
const LoadBank = async () => {
  optionsBanco.value = await getNomenclator.LoadBank()
}

/**
 * Carga todos los tipos de cuenta disponibles para el select
 */
const LoadTypeAccount = async () => {
  optionsAccount.value = await getNomenclator.LoadTypeAccount()
}

onBeforeMount(() => {
  LoadBank()
  LoadTypeAccount()
})

const emit = defineEmits(['ActualizarTabla'])

/**
 * Verifica si el número de cuenta ya existe para el banco seleccionado
 * @returns {Promise<boolean>} true si existe duplicado, false si está disponible
 */
const CheckAccount = async () => {
  // Verificar si la cuenta existe, pertence a un banco exacto y es el mismo tipo de cuenta
  const Account = await CheckBankAccount(
    TextBanco.value['value'], //Id de Banco
    await FormatCardNumberBank(TextCuenta.value), //Numero de cuenta bancaria
    fetchData, //USE-API
  )
  return Account
}

/**
 * Procesa y envía los datos del formulario al backend para crear una nueva cuenta
 * Valida duplicados antes de enviar y notifica al usuario del resultado
 */
const SendData = async () => {
  if (checkStatusInputs() != STRINGS.desabilitar) {
    if (!(await CheckAccount())) {
      const newItem = {
        titular: TextTitularCuenta.value,
        numero: await FormatCardNumberBank(TextCuenta.value),
        banco: String(TextBanco.value['value']),
        tipo: String(TextTipoCuenta.value['value']),
      }

      //Petición al API
      const { data, error } = await postData(STRINGS.urlApiCuenta, newItem) // POST /items

      //Se evalua si hay un error o no se devuelve nada del API
      if (data && !error) {
        // Mostrar alerta positiva de éxito
        notify_success(`${Title.value} ${STRINGS.successAdd}`)
        emit('ActualizarTabla', true)
        dialog.value = false //Se cierra el dialogo-formulario
        Reset() //Limpia todos los campos del formulario
        return
      } else {
        // Mostrar alerta de error
        console.error(STRINGS.errorAdd, error)
        notify_error(`${STRINGS.errorAdd} ${Title.value} `)
        dialog.value = true
        return
      }
    }

    /* Mostrar alerta de error, por entrar un numero de cuenta ya existente para un banco específico*/
    notify_error(STRINGS.cardBankrepeat)
    textCuenta.value.focus()
    return
  }
}

/**
 * Abre el diálogo de agregar cuenta
 */
const getUpDialogAdd = () => {
  backdropFilter.value = list
  dialog.value = true
}

/**
 * Limpia todos los campos del formulario y cierra el diálogo
 */
const Reset = () => {
  dialog.value = false
  TextTitularCuenta.value = ''
  TextBanco.value = ''
  TextCuenta.value = ''
  TextTipoCuenta.value = ''
}

/**
 * Valida que todos los campos obligatorios no estén vacíos
 * @returns {boolean} true si todos los campos tienen contenido
 */
const InputEmpty = () => {
  if (
    TextTitularCuenta.value.trim() !== '' &&
    TextCuenta.value.trim() !== '' &&
    TextBanco.value !== '' &&
    TextTipoCuenta.value !== ''
  )
    return true
  else return false
}

/**
 * Valida que los campos cumplan con las expresiones regulares
 * @returns {boolean} true si titular y número de cuenta son válidos
 */
const InputRegularExpressions = () => {
  if (
    expRegulares.onlyText.test(TextTitularCuenta.value) &&
    expRegulares.cardOfBank.test(TextCuenta.value)
  )
    return true
  else return false
}

/**
 * Verifica el estado completo del formulario y habilita/deshabilita el botón guardar
 */
const checkStatusInputs = () => {
  const isValid = InputEmpty() && InputRegularExpressions()
  disabledBtnSave.value = isValid ? '' : STRINGS.desabilitar
  return disabledBtnSave.value
}

//ref dialog
const dialog = ref(false)
const list = STRINGS.OpacityDialog
const backdropFilter = ref(null)
const Title = ref('Cuenta')

//Variables
const TextBanco = ref('')
const TextTitularCuenta = ref('')
const TextCuenta = ref('')
const TextTipoCuenta = ref('')
const optionsBanco = ref([])
const optionsAccount = ref([])

//ref
const textBanco = ref(null)
const textTitularCuenta = ref(null)
const textCuenta = ref(null)
const textTipoCuenta = ref(null)

//ref Btn save
const disabledBtnSave = ref(STRINGS.desabilitar)

watch(TextBanco, () => {
  checkStatusInputs()
})

watch(TextTipoCuenta, () => {
  checkStatusInputs()
})

defineExpose({
  getUpDialogAdd,
})
</script>
