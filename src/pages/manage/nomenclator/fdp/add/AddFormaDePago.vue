<template>
  <div class="">
    <q-dialog v-model="dialog" persistent :backdrop-filter="backdropFilter">
      <q-card style="width: 600px; max-width: 80vw">
        <q-card-section class="row items-center text-white q-pb-none text-h6 bg-green-5 q-pa-md">
          <span class="icon-text q-mx-sm">
            <q-icon name="note_add" />
          </span>
          <span class="icon-text"
            >{{ STRINGS.add.toUpperCase() }} - {{ STRINGS.method_of_payment.toUpperCase() }}</span
          >
        </q-card-section>

        <q-card-section>
          <div class="row flex justify-between">
            <div class="col-5">
              <q-input
                v-model="TextDescripcion_fdp"
                ref="textDescripcion_fdp"
                color="green"
                :rules="validaciones_generales.rulesNoEmpty"
                type="text"
                :label="STRINGS.descripcion"
                @keyup="checkStatusInputs"
              />
            </div>
            <div class="col-5">
              <q-select
                v-model="TextNomenclador_fdp"
                ref="textNomenclador_fdp"
                :options="options"
                :rules="validaciones_generales.rulesNoEmpty"
                color="green"
                :label="STRINGS.nomenclador_formas_pago"
                @update:model-value="checkStatusInputs"
              >
                <template v-slot:append>
                  <q-btn flat dense icon="add" aria-label="Agregar ítem" @click="openModal" />
                </template>
              </q-select>
            </div>
          </div>

          <div class="row flex justify-between q-mt-md">
            <div class="col-12">
              <p>{{ STRINGS.detalles_formas_pago }}:</p>
              <div class="bg-grey-4">
                <q-input
                  ref="textDetalles_fdp"
                  v-model="TextDetalles_fdp"
                  class="q-pa-md q-pb-lg"
                  color="green"
                  autogrow
                  @keyup="checkStatusInputs"
                />
              </div>
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
                v-on:click="Reset()"
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
/**
 * @module AddFormaDePago
 * @description Componente de diálogo para crear nuevas formas de pago
 * Permite ingresar descripción, seleccionar nomenclador asociado y agregar detalles opcionales
 */

import { ref, watch } from 'vue'
import { STRINGS } from 'utils/string.js'
import { useApi } from 'src/composables/useApi'
import validaciones_generales from 'src/utils/validaciones_generales'
import { useNotify } from 'src/utils/notify/notify.js'

/* =================================================== */
/*  ===== DECLARACIONES Y COMPOSABLES ===== */
/* =================================================== */
const { notify_success, notify_warning, notify_error } = useNotify()
const { postData } = useApi()

const emit = defineEmits(['ActualizarTabla'])

/**
 * Abre un modal para agregar un nuevo nomenclador (funcionalidad pendiente)
 * TODO: Implementar apertura de diálogo de creación de nomenclador inline
 */
const openModal = () => {
  notify_warning('Implementar')
}

/**
 * Procesa y envía los datos del formulario al backend para crear una nueva forma de pago
 * Valida que los campos obligatorios estén completos antes de enviar
 * Emite evento 'ActualizarTabla' para refrescar la lista tras operación exitosa
 */
const SendData = async () => {
  if (checkStatusInputs() != STRINGS.desabilitar) {
    const newItem = {
      descripcion: TextDescripcion_fdp.value,
      nomenclador: Number(TextNomenclador_fdp.value),
      detalles: TextDetalles_fdp.value,
    }

    try {
      const { data, error } = await postData(STRINGS.urlApiFormaDePago, newItem)

      if (!data && error) return notify_error(`${STRINGS.errorAdd} ${STRINGS.method_of_payment}`)

      emit('ActualizarTabla', true)
      notify_success(`${STRINGS.method_of_payment} ${STRINGS.successAdd}`)
      Reset()
    } catch (error) {
      console.error(`Error al crear item ${STRINGS.method_of_payment}:`, error)
      notify_error(`${STRINGS.errorAdd} ${STRINGS.method_of_payment}`)
    }
  }
}

/**
 * Abre el diálogo de agregar forma de pago
 * Configura el filtro de fondo y muestra el formulario
 */
const getUpDialogAdd = () => {
  backdropFilter.value = list
  dialog.value = true
}

/**
 * Valida que los campos obligatorios no estén vacíos
 * @returns {boolean} true si descripción y nomenclador tienen contenido
 */
const InputEmpty = () => {
  return TextDescripcion_fdp.value.trim() !== '' && TextNomenclador_fdp.value !== ''
}

/**
 * Verifica el estado completo del formulario y habilita/deshabilita el botón guardar
 * El botón se habilita solo cuando los campos obligatorios están completos
 * @returns {string} cadena vacía si es válido, o STRINGS.desabilitar si no lo es
 */
const checkStatusInputs = () => {
  const isValid = InputEmpty()
  disabledBtnSave.value = isValid ? '' : STRINGS.desabilitar
  return disabledBtnSave.value
}

/**
 * Limpia todos los campos del formulario y cierra el diálogo
 * Restablece el estado del botón guardar a deshabilitado
 */
const Reset = () => {
  dialog.value = false
  TextDescripcion_fdp.value = ''
  TextNomenclador_fdp.value = ''
  TextDetalles_fdp.value = ''
  disabledBtnSave.value = STRINGS.desabilitar
}

/* =================================================== */
/*  ===== VARIABLES REACTIVAS (REFS) ===== */
/* =================================================== */

// Configuración del diálogo
const dialog = ref(false)
const backdropFilter = ref(null)
const list = STRINGS.OpacityDialog

// Campos del formulario (v-model)
const TextDescripcion_fdp = ref('')
const TextNomenclador_fdp = ref('')
const TextDetalles_fdp = ref('')

/**
 * TODO: Cargar opciones reales desde API de nomencladores
 */
const options = [1, 2, 3, 4]

// Referencias a los inputs (no utilizadas actualmente, reservadas para focus programático)
const textDescripcion_fdp = ref(null)
const textNomenclador_fdp = ref(null)
const textDetalles_fdp = ref(null)

// Estado del botón guardar
const disabledBtnSave = ref(STRINGS.desabilitar)

/**
 * Watch que reacciona a cambios en el select de nomenclador
 * Re-evalúa el estado del botón guardar cuando cambia la selección
 */
watch(TextNomenclador_fdp, () => {
  checkStatusInputs()
})

/* Método para exponer funciones al componente Padre */
defineExpose({
  getUpDialogAdd,
})
</script>
