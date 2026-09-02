<template>
  <q-breadcrumbs>
    <q-breadcrumbs-el
      v-for="(crumb, index) in breadcrumbs"
      :key="index"
      :label="crumb.label"
      :icon="crumb.icon"
      :to="crumb.to"
      class="text-green-10 textBreadcrumbs"
    />
  </q-breadcrumbs>
</template>

<script setup>
/**
 * @module AutoBreadcrumbs
 * @description Componente de navegación breadcrumbs que se genera automáticamente
 * basándose en la ruta actual de Vue Router. Soporta personalización de iconos
 * vía props y metadata de rutas.
 */

import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import imports from 'src/utils/imports'

/**
 * Props del componente
 * @property {string} icon - Icono personalizado para todos los segmentos (opcional)
 *                           Si no se proporciona, usa el icono de meta.icon o 'folder'
 */
const props = defineProps({
  icon: {
    type: String,
    default: null,
  },
})

/**
 * Estado reactivo que contiene el array de breadcrumbs
 * Cada breadcrumb tiene: label, icon, to
 */
const breadcrumbs = ref([])

/**
 * Acceso a la ruta actual de Vue Router
 */
const route = useRoute()

/**
 * Genera el array de breadcrumbs basado en la ruta actual
 * Prioridad de iconos:
 * 1. Icono de la prop (si se proporciona)
 * 2. Icono específico del segmento (meta.icon)
 * 3. Fallback por defecto ('folder')
 *
 * El primer elemento siempre es "Inicio" con link a '/'
 */
function generateBreadcrumbs() {
  breadcrumbs.value = [
    { label: 'Inicio', to: '/', icon: 'home' },
    ...route.matched.slice(1).map((segment) => ({
      label: imports.capitalizeWords(segment.meta.breadcrumb, true) || segment.name,
      to: segment.path,
      icon: props.icon || segment.meta.icon || 'folder',
    })),
  ]
}

/**
 * Hook del ciclo de vida: genera breadcrumbs al montar el componente
 */
onMounted(() => {
  generateBreadcrumbs()
})

/**
 * Watch que regenera los breadcrumbs cuando cambia la ruta
 * Reacciona a cambios en route.fullPath para cubrir todos los casos
 * (cambios de ruta, query params, hash, etc.)
 */
watch(
  () => route.fullPath,
  () => {
    generateBreadcrumbs()
  },
)
</script>

<style scoped>
.textBreadcrumbs {
  font-size: 0.8rem;
  font-weight: 500;
}
</style>
