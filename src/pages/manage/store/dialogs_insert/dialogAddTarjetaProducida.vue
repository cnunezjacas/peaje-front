<template>
  <div class="">
    <q-dialog v-model="dialog" persistent ref="refDialogoAdd" :backdrop-filter="backdropFilter">
      <q-card style="width: 650px; max-width: 80vw">
        <q-card-section class="row items-center text-white q-pb-none text-h6 bg-green-5 q-pa-md">
          <span class="icon-text q-mx-sm">
            <q-icon name="note_add" />
          </span>
          <span class="icon-text">{{
            imports.JoinCamelCase(STRINGS.tarjeta_producidaLowercase, true).toUpperCase()
            }}</span>
        </q-card-section>

        <q-card-section>
          <div class="row flex justify-between q-mb-lg">
            <!-- Codigo -->
            <div class="col-3">
              <q-input v-model="TextCodigo_TP" color="green" :rules="validaciones_generales.rulesOnlyUppercase"
                type="text" :label="STRINGS.codigo" @keyup="checkStatusInputs" />
            </div>

            <!-- Modelo -->
            <div class="col-3">
              <q-select v-model="TextModelo_TP" @update:model-value="TextModelo_TP = $event" :options="optionsModelo_TP"
                :label="STRINGS.modelo" :rules="validaciones_generales.rulesNoEmpty" />
            </div>

            <!-- Categoria -->
            <div class="col-5">
              <q-select v-model="TextCategoria_TP" @update:model-value="TextCategoria_TP = $event"
                :options="optionsCategoria_TP" :label="STRINGS.category" :rules="validaciones_generales.rulesNoEmpty" />
            </div>
          </div>

          <div class="row flex justify-between q-mb-lg">
            <!-- Balance -->
            <div class="col-3">
              <q-input v-model="TextBalance_TP" color="green" :rules="validaciones_generales.rulesOnlyNumbers"
                type="text" :label="STRINGS.balance_tarjetaProducida" @keyup="checkStatusInputs" />
            </div>

            <!-- Precio de venta -->
            <div class="col-4">
              <q-input v-model="TextPrecioVenta_TP" color="green" :rules="validaciones_generales.rulesOnlyNumbers"
                type="text" :label="STRINGS.precioDeVenta_tarjetaProducida" @keyup="checkStatusInputs" />
            </div>

            <!-- Moneda -->
            <div class="col-4">
              <q-select v-model="TextMoneda_TP" :options="optionsMoneda" :rules="validaciones_generales.rulesNoEmpty"
                color="green" :label="imports.JoinCamelCase(STRINGS.monedasLowercase)"
                :disable="optionsMoneda.length > 0 ? false : true" @onchange="checkStatusInputs">
              </q-select>
            </div>
          </div>

          <div class="row flex justify-between q-mb-lg">
            <!-- Anverso -->
            <div class="col-3">
              <!--  <qUploader /> -->
              <q-input v-model="TextAnverso_TP" color="green" disable :rules="validaciones_generales.rulesNoEmpty"
                type="text" :label="STRINGS.anverso_tarjetaProducida" @keyup="checkStatusInputs" />
            </div>

            <!-- Fichero Chip -->
            <div class="col-4">
              <q-input v-model="TextFicheroChip_TP" disable color="green" :rules="validaciones_generales.rulesNoEmpty"
                type="text" :label="STRINGS.ficheroChip_tarjetaProducida" @keyup="checkStatusInputs" />
            </div>

            <!-- Bin -->
            <div class="col-4">
              <q-input v-model="TextBin_TP" disable color="green" :rules="validaciones_generales.rulesNoEmpty"
                type="text" :label="STRINGS.bin_tarjetaProducida" @keyup="checkStatusInputs" />
            </div>
          </div>

          <div class="row flex justify-between q-mb-lg">
            <!-- Expira -->
            <div class="col-3">
              <div class="row border-box-radio">
                <div class="col-6 text-center q-mt-md">
                  <p>{{ STRINGS.expira_tarjetaProducida }}:</p>
                </div>

                <div class="col-6 text-center">
                  <q-checkbox v-model="TextExpira_TP" keep-color color="green-5" @change="checkStatusInputs" />
                </div>
              </div>
            </div>

            <!-- Moneda -->
            <div class="col-3">
              <div class="row border-box-radio">
                <div class="col-6 text-center q-mt-md">
                  <p>{{ imports.JoinCamelCase(STRINGS.monedasLowercase) }}:</p>
                </div>

                <div class="col-6 text-center">
                  <q-checkbox v-model="TextChekMoneda_TP" keep-color color="green-5" @change="checkStatusInputs" />
                </div>
              </div>
            </div>

            <!-- Importe -->
            <div class="col-3">
              <div class="row border-box-radio">
                <div class="col-6 text-center q-mt-md">
                  <p>{{ STRINGS.importe_tarjetaProducida }}:</p>
                </div>

                <div class="col-6 text-center">
                  <q-checkbox v-model="TextImporte_TP" keep-color color="green-5" @change="checkStatusInputs" />
                </div>
              </div>
            </div>

            <!-- SAM -->
            <div class="col-2">
              <div class="row border-box-radio">
                <div class="col-6 text-center q-mt-md">
                  <p>{{ STRINGS.sam }}:</p>
                </div>

                <div class="col-6 text-center">
                  <q-checkbox v-model="TextSam_TP" keep-color color="green-5" @change="checkStatusInputs" />
                </div>
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-12 q-mt-md">
              <p>{{ STRINGS.descripcion_tarjetaBanca }}:</p>
              <div class="bg-grey-4">
                <q-input v-model="TextDescripcion_TB" class="q-pa-md" color="green" autogrow />
              </div>
            </div>
          </div>
        </q-card-section>

        <q-card-section>
          <div class="flex justify-start">
            <div class="">
              <q-btn icon="check" :class="disabledBtnSave" @click="SendData()" :label="STRINGS.save" color="green" />
            </div>

            <div class="">
              <q-btn flat icon="close" :label="STRINGS.close" v-on:click="Reset" color="dark" v-close-popup />
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, watch, onBeforeMount } from 'vue'
import { STRINGS } from 'utils/string.js'
import { expRegulares } from 'src/utils/expresiones_regulares.js'
import validaciones_generales from 'src/utils/validaciones_generales'
import imports from 'src/utils/imports'
import getNomenclator from 'src/utils/utils_axios/nomencladores/getNomenclator'
import { useNotify } from 'src/utils/notify/notify.js'

/* =================================================== */
/*  ===== DECLARACIONES ===== */
/* =================================================== */
const { notify_success/*, notify_error*/ } = useNotify()


/* Variables */
const optionsModelo_TP = ['Cliente', 'Llave', 'Operador']
const optionsCategoria_TP = [
  'Tarjeta de cliente abonado',
  'Tarjeta de cliente abonado local',
  'Tarjeta cliente exento',
]
const optionsMoneda = ref([])
/* const url = ref(route.fullPath) */

const loadCoins = async () => {
  optionsMoneda.value = await getNomenclator.loadCoins()
}

onBeforeMount(() => {
  loadCoins()
})

/*Funcion de procesado de Datos*/
const SendData = async () => {
  if (checkStatusInputs() != STRINGS.desabilitar) {
    notify_success('Add con Exito')
    dialog.value = false
    Reset()
  }
}

/*Función que levanta el dialogo*/
const getUpDialogAdd = () => {
  backdropFilter.value = list
  dialog.value = true
}

/*Función para limpiar los campos del dialogo luego del submit*/
const Reset = () => {
  dialog.value = false
  TextCodigo_TP.value = ''
  TextModelo_TP.value = ''
  TextCategoria_TP.value = ''
  TextBalance_TP.value = ''
  TextPrecioVenta_TP.value = ''
  TextAnverso_TP.value = ''
  TextFicheroChip_TP.value = ''
  TextBin_TP.value = ''
  TextMoneda_TP.value = ''
  TextExpira_TP.value = false
  TextChekMoneda_TP.value = false
  TextImporte_TP.value = false
  TextSam_TP.value = false
  TextDescripcion_TB.value = ''
  disabledBtnSave.value = STRINGS.desabilitar
}

//Función para comprobar que los campos no estén vacíos
const InputEmpty = () => {
  /* TODO: FALTAN LOS MODELOS  [TextAnverso_TP,TextFicheroChip_TP,TextBin_TP]*/
  if (
    TextCodigo_TP.value.trim() !== '' &&
    TextModelo_TP.value !== '' &&
    TextCategoria_TP.value !== '' &&
    TextBalance_TP.value !== '' &&
    TextPrecioVenta_TP.value !== '' &&
    TextMoneda_TP.value !== '' &&
    TextDescripcion_TB.value !== '' &&
    TextExpira_TP.value !== false &&
    TextChekMoneda_TP.value !== false &&
    TextImporte_TP.value !== false &&
    TextSam_TP.value !== false
  )
    return true
  else return false
}

//Función para comprobar que los campos sean válidos
const InputRegularExpressions = () => {
  /* TODO: FALTAN LOS MODELOS  [TextAnverso_TP,TextFicheroChip_TP,TextBin_TP]*/
  if (
    expRegulares.onlyUppercase.test(TextCodigo_TP.value) &&
    expRegulares.onlyNumber.test(TextBalance_TP.value) &&
    expRegulares.onlyNumber.test(TextPrecioVenta_TP.value)
  )
    return true
  else return false
}

//Función para comprobar los campos y habilitar botón GUARDAR
const checkStatusInputs = () => {
  const isValid = InputEmpty() && InputRegularExpressions()
  disabledBtnSave.value = isValid ? '' : STRINGS.desabilitar
  return disabledBtnSave.value
}

//Ref dialogo
const dialog = ref(false)
const list = STRINGS.OpacityDialog
const refDialogoAdd = ref(null)

//Ref Variables
const TextCodigo_TP = ref('')
const TextModelo_TP = ref('')
const TextCategoria_TP = ref('')
const TextBalance_TP = ref('')
const TextPrecioVenta_TP = ref('')
const TextAnverso_TP = ref('')
const TextFicheroChip_TP = ref('')
const TextBin_TP = ref('')
const TextMoneda_TP = ref('')
const TextExpira_TP = ref(false)
const TextChekMoneda_TP = ref(false)
const TextImporte_TP = ref(false)
const TextSam_TP = ref(false)
const TextDescripcion_TB = ref('')
const backdropFilter = ref(null)

//Ref BtnSave
const disabledBtnSave = ref(STRINGS.desabilitar)

watch([TextSam_TP, TextImporte_TP, TextChekMoneda_TP, TextExpira_TP], () => {
  checkStatusInputs()
})

defineExpose({
  getUpDialogAdd,
})
</script>
