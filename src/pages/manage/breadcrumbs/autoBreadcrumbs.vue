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
import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import imports from 'src/utils/imports'

// Estado reactivo para los breadcrumbs
const breadcrumbs = ref([])

// Acceso a la ruta actual
const route = useRoute()

// Función para generar los breadcrumbs
function generateBreadcrumbs() {
  // Ejemplo simple: inicio + segmentos de la ruta
  breadcrumbs.value = [
    { label: 'Inicio', to: '/', icon: 'home' },
    ...route.matched.slice(1).map((segment) => ({
      label: imports.capitalizeWords(segment.meta.breadcrumb, true) || segment.name,
      to: segment.path,
      icon: segment.meta.icon || 'folder',
    })),
  ]
}

// Ejecutar al montar
onMounted(() => {
  generateBreadcrumbs()
})

// También actualizamos los breadcrumbs cuando la ruta cambie
watch(
  () => route.fullPath,
  () => {
    generateBreadcrumbs()
  },
)
</script>
