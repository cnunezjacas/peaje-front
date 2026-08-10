<template>
  <q-dialog v-model="dialog" persistent :backdrop-filter="backdropFilter">
    <q-card class="my-dialog-card" :style="{ minWidth: currentConfig.minWidth || '250px', maxWidth: '35vw' }">
      <!-- Header -->
      <q-card-section class="row items-center text-white q-pb-none text-h6 bg-green-5 q-pa-md">
        <q-icon :name="currentConfig.icon || 'receipt_long'" class="q-mr-sm" />
        <span>{{ currentConfig.title || STRINGS.details.toUpperCase() }}</span>
      </q-card-section>

      <!-- Contenido: Lista vertical -->
      <q-card-section class="q-pa-md">
        <div v-if="!currentData" class="text-center text-grey q-pa-lg">
          Cargando...
        </div>

        <div v-else class="details-list">
          <div v-for="field in currentConfig.fields" :key="field.key" class="detail-row row items-start q-py-sm">
            <div class="col-12 col-sm-5 col-md-3 col-lg-3 text-weight-medium text-grey-9 q-pr-md">
              {{ field.label || field.key }}:
            </div>
            <div class="col-12 col-sm-7 col-md-9 col-lg-10 text-grey-8">
              {{ getFieldValue(field, currentData) }}
            </div>
          </div>
        </div>
      </q-card-section>


      <!-- Footer -->
      <q-card-section class="flex justify-end q-pt-none">
        <q-btn flat icon="close" :label="STRINGS.close || 'Cerrar'" color="dark" v-close-popup @click="onClose" />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import { STRINGS } from 'utils/string.js'

// Props (igual que la versión que funcionaba)
const props = defineProps({
  modelValue: { type: Boolean, default: false },
  config: { type: Object, default: () => ({}) },
  data: { type: [Object, Array], default: () => null },
})

const emit = defineEmits(['update:modelValue', 'close'])

// Estado local
const dialog = ref(false)
const backdropFilter = ref(STRINGS.OpacityDialog || 'blur(5px)')
const currentConfig = ref({
  title: STRINGS.details,
  icon: 'receipt_long',
  minWidth: '300px',
  fields: [],
})
const currentData = ref(null)

// 🔥 WATCHERS para sincronizar con props (ESTO ES LO QUE HACÍA FUNCIONAR LA VERSIÓN ANTERIOR)
watch(() => props.modelValue, (val) => dialog.value = val)


watch(() => props.config, (val) => {
  if (val && Object.keys(val).length > 0) {
    currentConfig.value = { ...currentConfig.value, ...val }
    console.log('🔍 WATCH config:', currentConfig.value.title, 'fields:', val.fields?.length)
  }
}, { deep: true, immediate: true })

watch(() => props.data, (val) => {
  if (val) {
    currentData.value = val
    console.log('🔍 WATCH data:', val.nombre || val._id)
  }
}, { deep: true, immediate: true })

// Obtener valor del campo (sin computed complejo)
const getFieldValue = (field, data) => {
  if (!data || !field.key) return '-'

  const value = data[field.key]

  if (typeof field.format === 'function') {
    try {
      return field.format(value, data)
    } catch (e) {
      console.warn('Error format:', field.key, e)
      return '-'
    }
  }

  if (value === null || value === undefined) return '-'
  if (Array.isArray(value)) return value.join(', ')
  if (typeof value === 'boolean') return value ? 'Sí' : 'No'

  return String(value)
}

const onClose = () => {
  dialog.value = false
  emit('close')
  emit('update:modelValue', false)
}

// Método público (por si se usa sin props)
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
  }
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

  .detail-row>div:first-child {
    margin-bottom: 4px;
    color: #666;
    font-size: 0.9rem;
  }
}
</style>
