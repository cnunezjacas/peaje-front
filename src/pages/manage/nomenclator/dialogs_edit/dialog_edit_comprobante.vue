<template>
  <div class="">
    <q-dialog v-model="dialog" persistent :backdrop-filter="backdropFilter">
      <q-card style="width: 600px; max-width: 80vw">
        <q-card-section class="row items-center text-white q-pb-none text-h6 bg-green-5 q-pa-md">
          <span class="icon-text q-mx-sm">
            <q-icon name="edit" />
          </span>
          <span class="icon-text">{{ STRINGS.edit.toUpperCase() }} - {{ STRINGS.voucher.toUpperCase() }}</span>
        </q-card-section>

        <q-card-section>
          <div class="row flex justify-between q-mb-lg">
            <div class="col-5">
              <q-input v-model="TextNombre_Comprobante" ref="textNombre_Comprobante" color="green"
                :rules="validaciones_generales.rulesFullTextAndNumber" type="text" :label="STRINGS.name"
                @keyup="checkStatusInputs" />
            </div>
            <div class="col-5">
              <q-input ref="textCodigo_comprobante" v-model="TextCodigo_comprobante" color="green" type="text"
                :rules="validaciones_generales.rulesUppercaseAndNumber" :label="STRINGS.code"
                @keyup="checkStatusInputs" />
            </div>
          </div>

          <div class="row flex justify-between q-mb-lg">
            <div class="col-12">
              <q-select v-model="TextNomenclador_comprobante" ref="textNomenclador_exento" :options="options"
                :rules="rulesNomenclador_comprobante" disable color="green" :label="STRINGS.nomenclator"
                @onchange="checkStatusInputs">
                <!-- Slot para agregar un botón al final del select -->
                <template v-slot:append>
                  <q-btn flat dense icon="add" aria-label="Agregar ítem" @click="openModal" />
                </template>
              </q-select>
            </div>
          </div>

          <div class="row flex justify-between q-mb-lg">
            <div class="col-5">
              <q-input ref="textValor_comprobante" v-model="TextValor_comprobante" color="green" type="text"
                :rules="validaciones_generales.rulesExchangeRate" :label="STRINGS.valor" @keyup="checkStatusInputs" />
            </div>
            <div class="col-5">
              <q-select v-model="TextMoneda_comprobante" ref="textMoneda_comprobante" :options="optionsMoneda"
                :rules="validaciones_generales.rulesNoEmpty" color="green" :label="STRINGS.currency"
                @onchange="checkStatusInputs">
              </q-select>
            </div>
          </div>
        </q-card-section>

        <q-card-section>
          <div class="flex justify-start">
            <div class="">
              <q-btn icon="check" :class="disabledBtnSave" @click="CheckData()" :label="STRINGS.save" color="green" />
            </div>

            <div class="">
              <q-btn flat icon="close" :label="STRINGS.close" @click="Reset()" color="dark" v-close-popup />
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
/* Importaciones */
import { ref, onBeforeMount, watch } from 'vue'
import { STRINGS } from 'utils/string.js'
import api from 'src/axios.js'
import { expRegulares } from 'src/utils/expresiones_regulares.js'
import getNomenclator from 'src/utils/utils_axios/nomencladores/getNomenclator'
import verificarExistente from 'src/utils/utils_axios/nomencladores/checkCode.js'
import validaciones_generales from 'src/utils/validaciones_generales'
import { useNotify } from 'src/utils/notify/notify.js'


/* =================================================== */
/*  ===== DECLARACIONES REF ===== */
/* =================================================== */
const { notify_success/*, notify_warning*/, notify_error } = useNotify()


/* Carga todas las monedas de la BD */
const loadCoins = async () => {
  optionsMoneda.value = await getNomenclator.loadCoins()
}

/* Funcion encargada de asignar label y value de la moneda traida de BD */
const loadCoinsSelected = async (moneda) => {
  optionsMoneda.value.forEach((element) => {
    if (element.label === moneda)
      TextMoneda_comprobante.value = { label: element.label, value: element.value }
  })
}

/*
  Método del ciclo de VUE
  Cuándo se ejecuta: Justo antes de que el componente se monte en el DOM
 */
onBeforeMount(() => {
  loadCoins()
})

/* función para verificar si un valor existe en la API */
const CheckCode = async () => {
  const url = STRINGS.urlApiComprobante
  const existeCodigo = await verificarExistente(
    url,
    STRINGS.codigoBD,
    String(TextCodigo_comprobante.value),
  )
  return existeCodigo
}

/* Comprueba que existan cambios y que el código key no sea repetido */
const CheckData = async () => {
  if (checkStatusInputs() != STRINGS.desabilitar) {
    // Verificar si el código ya existe
    if (InputDifferent() && TextCodigo_comprobante.value !== TextCodigo_comprobante_copy.value) {
      if (await CheckCode()) {
        // Mostrar mensaje de error o alertar al usuario
        notify_error(STRINGS.codigoRepetido)
        return textCodigo_comprobante.value.focus()
      } else {
        SendData()
      }
    } else {
      SendData()
    }
  }
}

const emit = defineEmits(['ActualizarTabla'])

/*Funcion de procesado de Datos*/
const SendData = async () => {
  const newItem = {
    nombre: TextNombre_Comprobante.value,
    codigo: TextCodigo_comprobante.value,
    valor: Number(TextValor_comprobante.value),
    //TODO: nomenclador: Number(TextNomenclador_comprobante.value),
    moneda: TextMoneda_comprobante.value['value'],
    /*TODO: detalles: TextDetalles_exento.value,*/
  }

  try {
    await api.patch(STRINGS.urlApiComprobante + '/' + _id.value, newItem) // POST /items
    // Mostrar alerta positiva de éxito
    notify_success(STRINGS.comprobanteEditSuccess)

    emit('ActualizarTabla', true)
  } catch (error) {
    console.error('Error al crear item:', error)
    notify_error(STRINGS.comprobanteEditError)

    emit('ActualizarTabla', false)
  }
  Reset()
}

/*Función que levanta el dialogo*/
const getUpDialogEdit = async (nombre, codigo, moneda, valor, id) => {
  backdropFilter.value = list
  dialog.value = true

  TextNombre_Comprobante.value = nombre
  TextCodigo_comprobante.value = codigo

  await loadCoinsSelected(moneda)
  /* TextMoneda_comprobante.value = moneda */
  TextValor_comprobante.value = String(valor)
  // TextNomenclador_comprobante.value = nomenclador
  _id.value = id

  //Copias de Seguridad
  TextNombre_Comprobante_copy.value = nombre
  TextCodigo_comprobante_copy.value = codigo
  TextMoneda_comprobante_copy.value = moneda
  TextValor_comprobante_copy.value = String(valor)
  // TextNomenclador_comprobante_copy.value = nomenclador
}

//Función para comprobar que los campos no estén vacíos
const InputEmpty = () => {
  if (
    TextNombre_Comprobante.value.trim() !== '' &&
    TextCodigo_comprobante.value.trim() !== '' &&
    TextValor_comprobante.value.trim() !== '' &&
    TextValueMoneda_comprobante.value !== null /*||
    TextValueNomenclador_comprobante.value === ''*/
  )
    return true
  else return false
}

//Función para comprobar que los campos sean válidos
const InputRegularExpressions = () => {
  if (
    expRegulares.uppercaseAndNumber.test(TextCodigo_comprobante.value.trim()) &&
    expRegulares.TextAndNumber.test(TextNombre_Comprobante.value.trim())
  )
    return true
  else return false
}

/* Función para evaluar que los campos hallan sido modificados */
const InputDifferent = () => {
  return !(
    TextNombre_Comprobante.value === TextNombre_Comprobante_copy.value &&
    TextCodigo_comprobante.value === TextCodigo_comprobante_copy.value &&
    TextValor_comprobante.value === TextValor_comprobante_copy.value &&
    TextMoneda_comprobante.value['label'] === TextMoneda_comprobante_copy.value
  )
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
  TextNombre_Comprobante.value = ''
  TextCodigo_comprobante.value = ''
  TextMoneda_comprobante.value = ''
  TextValor_comprobante.value = ''
  TextNomenclador_comprobante.value = ''
  disabledBtnSave.value = STRINGS.desabilitar
}

/* Variables del dialogo */
const dialog = ref(false)
const backdropFilter = ref(null)
const _id = ref('')
const list = STRINGS.OpacityDialog

//v-model
const TextCodigo_comprobante = ref('')
const TextNombre_Comprobante = ref('')
const TextNomenclador_comprobante = ref('')
//const TextValueNomenclador_comprobante = ref('')
//const TextDetalles_exento = ref('')
const TextValor_comprobante = ref('')
const TextMoneda_comprobante = ref('')
const TextValueMoneda_comprobante = ref('')
const optionsMoneda = ref([])

//v-model copy
const TextCodigo_comprobante_copy = ref('')
const TextNombre_Comprobante_copy = ref('')
//const TextNomenclador_comprobante_copy = ref('')

//const TextDetalles_exento = ref('')
const TextValor_comprobante_copy = ref('')
const TextMoneda_comprobante_copy = ref('')

/* Referencia del campo key */
const textCodigo_comprobante = ref(null)

/* ("observador") que permite reaccionar a cambios en datos específicos del/los componente/s */
watch(TextMoneda_comprobante, (newVal) => {
  TextValueMoneda_comprobante.value = newVal
  checkStatusInputs()
})

/* Referencia del botón de enviar datos */
const disabledBtnSave = ref(STRINGS.desabilitar)

/* Método para exponer funciones al componente Padre */
defineExpose({
  getUpDialogEdit,
})
</script>
