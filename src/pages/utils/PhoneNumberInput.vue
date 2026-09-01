<template>
  <div class="border-box-bank">
    <div class="row">
      <!-- Inputs de teléfonos -->
      <div
        v-for="(phone, index) in phones"
        :key="phone.id"
        class="col-10 col-sm-10 col-md-10 q-pr-sm"
      >
        <q-input
          v-model="phone.number"
          :ref="(el) => (phoneInputs[index] = el)"
          color="green"
          label="Teléfono"
          :disable="disabledInput"
          type="tel"
          :rules="validaciones_generales.rulesPhone"
          @keyup="emitUpdate"
        />
      </div>

      <!-- Botones -->
      <div class="col-2 row items-center justify-end">
        <!-- Botón Añadir / Guardar -->
        <q-btn
          :color="btnAddShow ? 'green-5' : 'primary'"
          :title="btnAddShow ? 'Añadir' : 'Guardar'"
          :icon="btnAddShow ? 'add' : 'save'"
          size="sm"
          flat
          round
          @click="btnAddShow ? addPhone() : SavePhone()"
          :disable="!btnAddShow && checkStatusInputs()"
        />

        <!-- Botón Eliminar -->
        <q-btn
          v-if="phones.length > 1"
          icon="delete"
          color="negative"
          title="Eliminar"
          size="sm"
          flat
          round
          @click="removePhone(phones.length - 1)"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import validaciones_generales from 'src/utils/validaciones_generales'

const props = defineProps({
  initialPhones: {
    type: Array,
    default: () => [],
  },
})

const phones = ref([{ id: Date.now(), number: '' }])
const phoneInputs = ref([])
const btnAddShow = ref(false)
const disabledInput = ref(false)

const emit = defineEmits(['UpdatePhone'])

/**
 * Carga teléfonos iniciales desde un array (útil para modo edición)
 * Filtra valores vacíos y mapea a objetos {id, number}
 * @param {string[]} phonesArray - Array de números telefónicos
 */
const loadPhones = (phonesArray) => {
  if (!phonesArray || !Array.isArray(phonesArray) || phonesArray.length === 0) {
    return
  }

  const phonesData = phonesArray
    .filter((p) => p && typeof p === 'string' && p.trim() !== '')
    .map((number, index) => ({
      id: Date.now() + index + Math.random(),
      number: number.trim(),
    }))

  phones.value = phonesData
  btnAddShow.value = true
  disabledInput.value = true

  emitUpdate()
}

// Watch para cargar teléfonos cuando cambian las props
watch(
  () => props.initialPhones,
  (newVal) => {
    if (newVal && Array.isArray(newVal) && newVal.length > 0) {
      loadPhones(newVal)
    }
  },
)

/**
 * Método expuesto para cargar teléfonos manualmente (útil para edición)
 * @param {string[]} phonesArray - Array de números telefónicos
 */
const loadPhonesManual = (phonesArray) => {
  loadPhones(phonesArray)
}

/**
 * Emite el array actualizado de números de teléfono al componente padre
 * Filtra los números vacíos para no enviar campos sin contenido
 */
const emitUpdate = () => {
  const validNumbers = phones.value
    .map((p) => p.number)
    .filter((number) => number && number.trim() !== '')
  emit('UpdatePhone', validNumbers)
}

/**
 * Agrega un nuevo campo de teléfono vacío y enfoca el nuevo input
 */
function addPhone() {
  const newPhone = { id: Date.now() + Math.random(), number: '' }
  phones.value.push(newPhone)
  btnAddShow.value = false
  disabledInput.value = false
  emitUpdate()

  setTimeout(() => {
    const lastIndex = phones.value.length - 1
    phoneInputs.value[lastIndex]?.focus?.()
  }, 50)
}

/**
 * Guarda los teléfonos actuales y bloquea los inputs (modo lectura)
 */
function SavePhone() {
  btnAddShow.value = true
  disabledInput.value = true
  emitUpdate()
}

/**
 * Elimina el último teléfono del array
 * @param {number} index - Índice del teléfono a eliminar
 */
function removePhone(index) {
  if (phones.value.length > 1) {
    phones.value.splice(index, 1)
    phoneInputs.value.splice(index, 1)
    disabledInput.value = false
    btnAddShow.value = true
    emitUpdate()
  }
}

/**
 * Enfoca el último input de teléfono del array
 * Método expuesto para que el componente padre pueda hacer focus programático
 */
function Focus() {
  const lastInput = phoneInputs.value[phoneInputs.value.length - 1]
  if (lastInput?.focus) {
    lastInput.focus()
  }
}

/**
 * Resetea el componente a su estado inicial
 * Debe llamarse desde el padre al cerrar el diálogo
 */
function ResetPhones() {
  phones.value = [{ id: Date.now(), number: '' }]
  phoneInputs.value = []
  btnAddShow.value = false
  disabledInput.value = false
  emitUpdate()
}

/**
 * Verifica si el último teléfono está vacío (para habilitar/deshabilitar botón añadir)
 * @returns {boolean} true si el último teléfono está vacío
 */
function checkStatusInputs() {
  const lastPhone = phones.value[phones.value.length - 1]?.number?.trim()
  return !lastPhone
}

onMounted(() => {
  // Inicialización del componente
})

defineExpose({
  getPhone: () =>
    phones.value
      .filter((p) => p.number?.trim())
      .map((p) => p.number)
      .join('/'),
  Focus,
  ResetPhones,
  loadPhonesManual,
  getPhones: () => phones.value,
})
</script>
