<template>
  <q-dialog v-model="dialog" persistent :backdrop-filter="backdropFilter">
    <q-card
      class="my-dialog-card"
      :style="{ minWidth: currentConfig.minWidth || '250px', maxWidth: '35vw' }"
    >
      <!-- Header -->
      <q-card-section class="row items-center text-white q-pb-none text-h6 bg-green-5 q-pa-md">
        <q-icon :name="currentConfig.icon || 'receipt_long'" class="q-mr-sm" />
        <span>{{ currentConfig.title || STRINGS.details.toUpperCase() }}</span>
      </q-card-section>

      <!-- Contenido: Lista vertical -->
      <q-card-section class="q-pa-md">
        <div v-if="!currentData" class="text-center text-grey q-pa-lg">Cargando...</div>

        <div v-else class="details-list">
          <div
            v-for="field in currentConfig.fields"
            :key="field.key"
            class="detail-row row items-start q-py-sm"
          >
            <div
              class="col-12 col-sm-6 col-md-3 col-lg-4 col-xl-4 text-weight-medium text-grey-9 q-pr-md"
            >
              {{ field.label || field.key }}:
            </div>
            <div class="col-12 col-sm-6 col-md-9 col-lg-8 col-xl-8 text-grey-8">
              {{ getFieldValue(field, currentData) }}
            </div>
          </div>
        </div>
      </q-card-section>

      <!-- Footer -->
      <q-card-section class="flex justify-end q-pt-none">
        <q-btn
          flat
          icon="close"
          :label="STRINGS.close || 'Cerrar'"
          color="dark"
          v-close-popup
          @click="onClose"
        />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import { STRINGS } from 'utils/string.js'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  config: { type: Object, default: () => ({}) },
  data: { type: [Object, Array], default: () => null },
})

const emit = defineEmits(['update:modelValue', 'close'])

const dialog = ref(false)
const backdropFilter = ref(STRINGS.OpacityDialog || 'blur(5px)')
const currentConfig = ref({
  title: STRINGS.details,
  icon: 'receipt_long',
  minWidth: '300px',
  fields: [],
})
const currentData = ref(null)

watch(
  () => props.modelValue,
  (val) => (dialog.value = val),
)

watch(
  () => props.config,
  (val) => {
    if (val && Object.keys(val).length > 0) {
      currentConfig.value = { ...currentConfig.value, ...val }
    }
  },
  { deep: true, immediate: true },
)

watch(
  () => props.data,
  (val) => {
    if (val) {
      currentData.value = val
    }
  },
  { deep: true, immediate: true },
)

/**
 * Obtiene un valor de un objeto usando notación de punto (dot notation)
 * Soporta paths anidados como 'provincia.nombre' o 'cuentaCuc.banco.codigo'
 *
 * @param {Object} obj - Objeto fuente
 * @param {string} path - Ruta del campo (puede usar notación de punto)
 * @returns {any} Valor encontrado o undefined
 *
 * @example
 * getNestedValue({ provincia: { nombre: 'Granma' } }, 'provincia.nombre')
 * // => 'Granma'
 */
const getNestedValue = (obj, path) => {
  if (!obj || !path) return undefined

  // Si no hay punto, acceso directo (caso simple)
  if (!path.includes('.')) {
    return obj[path]
  }

  // Dividir el path por puntos y recorrer el objeto anidado
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : undefined
  }, obj)
}

/**
 * Obtiene el valor formateado de un campo para mostrar en el diálogo de detalles
 * Soporta:
 * - Campos simples: 'nombre', 'codigo'
 * - Campos anidados: 'provincia.nombre', 'cuentaCuc.numero'
 * - Funciones de formato personalizadas
 * - Arrays (los une con comas)
 * - Booleanos (los convierte a Sí/No)
 *
 * @param {Object} field - Configuración del campo { key, label, format }
 * @param {Object} data - Datos completos de la fila seleccionada
 * @returns {string} Valor formateado para mostrar
 */
const getFieldValue = (field, data) => {
  if (!data || !field.key) return '-'

  // 🔥 Obtener valor (soporta notación de punto para campos anidados)
  const value = getNestedValue(data, field.key)

  // Aplicar función de formato si existe
  if (typeof field.format === 'function') {
    try {
      return field.format(value, data)
    } catch (e) {
      console.warn('Error format:', field.key, e)
      return '-'
    }
  }

  // Manejo de valores especiales
  if (value === null || value === undefined) return '-'
  if (Array.isArray(value)) return value.join(', ')
  if (typeof value === 'boolean') return value ? 'Sí' : 'No'
  if (typeof value === 'object') return JSON.stringify(value) // Fallback para objetos

  return String(value)
}

const onClose = () => {
  dialog.value = false
  emit('close')
  emit('update:modelValue', false)
}

const show = (data, config = {}) => {
  currentConfig.value = { ...currentConfig.value, ...config }
  currentData.value = data
  dialog.value = true
  emit('update:modelValue', true)
}

defineExpose({
  show,
  close: () => {
    dialog.value = false
    emit('update:modelValue', false)
  },
})
</script>

<style scoped>
.my-dialog-card {
  max-height: 85vh;
  overflow-y: auto;
}

.details-list {
  width: 100%;
}

.detail-row {
  border-bottom: 1px solid #eee;
  padding: 8px 0;
}

.detail-row:last-child {
  border-bottom: none;
}

@media (max-width: 599px) {
  .detail-row {
    flex-direction: column;
  }

  .detail-row > div:first-child {
    margin-bottom: 4px;
    color: #666;
    font-size: 0.9rem;
  }
}
</style>
