<template>
  <div class="border-box-bank">
    <div class="row">
      <!-- Inputs de teléfonos -->
      <div v-for="(phone, index) in phones" :key="phone.id" class="col-10 col-sm-10 col-md-10 q-pr-sm">
        <q-input v-model="phone.number" :ref="el => phoneInputs[index] = el" color="green" label="Teléfono"
          :disable="disabledInput" type="tel" :rules="validaciones_generales.rulesPhone" @keyup="emitUpdate" />
      </div>

      <!-- Botones -->
      <div class="col-2 row items-center justify-end">
        <!-- Botón Añadir / Guardar -->
        <q-btn :color="btnAddShow ? 'green-5' : 'primary'" :title="btnAddShow ? 'Añadir' : 'Guardar'"
          :icon="btnAddShow ? 'add' : 'save'" size="sm" flat round @click="btnAddShow ? addPhone() : SavePhone()"
          :disable="!btnAddShow && checkStatusInputs()" />

        <!-- Botón Eliminar -->
        <q-btn v-if="phones.length > 1" icon="delete" color="negative" title="Eliminar" size="sm" flat round
          @click="removePhone(phones.length - 1)" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import validaciones_generales from 'src/utils/validaciones_generales'

// Prop para recibir teléfonos iniciales (modo edición)
const props = defineProps({
  initialPhones: {
    type: Array,
    default: () => []
  }
})

const phones = ref([{ id: Date.now(), number: '' }])
const phoneInputs = ref([])
const btnAddShow = ref(false)
const disabledInput = ref(false)
const lastLoadedPhones = ref([])  // 🔥 Track de últimos teléfonos cargados

const emit = defineEmits(['UpdatePhone'])

// 🔥 Función centralizada para cargar teléfonos (reutilizable)
const loadPhones = (phonesArray) => {
  if (!phonesArray || !Array.isArray(phonesArray) || phonesArray.length === 0) {
    return
  }

  // Filtrar y mapear a objetos {id, number}
  const phonesData = phonesArray
    .filter(p => p && typeof p === 'string' && p.trim() !== '')
    .map((number, index) => ({
      id: Date.now() + index + Math.random(),
      number: number.trim()
    }))

  // 🔥 Actualizar phones.value directamente (sin comparar con JSON.stringify)
  phones.value = phonesData
  lastLoadedPhones.value = phonesArray.map(p => p?.trim()).filter(p => p)  // Track para debug

  btnAddShow.value = true      // Modo "Añadir" después de cargar
  disabledInput.value = true   // Inputs en modo lectura inicialmente

  emitUpdate()

  // 🔍 Debug
  console.log('📱 Phone cargado con:', phones.value)
  console.log('📱 lastLoadedPhones:', lastLoadedPhones.value)
}

// 🔥 Watch simplificado: solo reacciona a cambios con datos
watch(() => props.initialPhones, (newVal) => {
  if (newVal && Array.isArray(newVal) && newVal.length > 0) {
    loadPhones(newVal)
  }
})

// 🔥 Método expuesto para cargar teléfonos manualmente (útil para edición)
const loadPhonesManual = (phonesArray) => {
  loadPhones(phonesArray)
}

// Emitir actualización en cada cambio
const emitUpdate = () => {
  emit('UpdatePhone', phones.value.map(p => p.number))
}

// Función para agregar un nuevo teléfono
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

function SavePhone() {
  btnAddShow.value = true
  disabledInput.value = true
  emitUpdate()
}

// Función para eliminar un teléfono por índice
function removePhone(index) {
  if (phones.value.length > 1) {
    phones.value.splice(index, 1)
    phoneInputs.value.splice(index, 1)
    disabledInput.value = false
    btnAddShow.value = true
    emitUpdate()
  }
}

// Focus en el último input
function Focus() {
  const lastInput = phoneInputs.value[phoneInputs.value.length - 1]
  if (lastInput?.focus) {
    lastInput.focus()
  }
}

// 🔥 Resetear componente (llamar desde el padre al cerrar diálogo)
function ResetPhones() {
  phones.value = [{ id: Date.now(), number: '' }]
  phoneInputs.value = []
  btnAddShow.value = false
  disabledInput.value = false
  lastLoadedPhones.value = []
  emitUpdate()
}

function checkStatusInputs() {
  const lastPhone = phones.value[phones.value.length - 1]?.number?.trim()
  return !lastPhone
}



// 🔥 DEBUG EXTREMO: Loguear cada cambio relevante
watch(() => props.initialPhones, (newVal, oldVal) => {
  console.log('🔍 WATCH initialPhones:', {
    old: oldVal,
    new: newVal,
    phonesBefore: phones.value,
  })
}, { deep: true })

watch(() => phones.value, (newVal) => {
  console.log('🔍 WATCH phones.value:', newVal)
}, { deep: true })

onMounted(() => {
  console.log('🔍 Phone ONMOUNTED:', {
    initialPhones: props.initialPhones,
    phones: phones.value,
  })
})


defineExpose({
  getPhone: () => phones.value.filter(p => p.number?.trim()).map(p => p.number).join('/'),
  Focus,
  ResetPhones,
  loadPhonesManual,  // 👈 Exponer método para carga manual
  // 🔥 Exponer para debug
  getPhones: () => phones.value,
  getLastLoaded: () => lastLoadedPhones.value,
})
</script>
