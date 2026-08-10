<template>
  <q-page>
    <!-- Contenido principal (siempre renderizado, pero oculto visualmente si se prefiere) -->
    <div>
      <tabs_entity ref="tabs_entity_ref" />
    </div>


    <!-- 🔥 SPINNER DE CARGA CENTRALIZADO -->
    <div v-if="showSpinner" class="loading-overlay absolute-full flex flex-center"
      :class="{ 'fade-out': !showSpinner }">
      <div class="text-center">
        <q-spinner-dots color="green-8" size="50px" />
        <p class="text-green-8 text-weight-medium">Cargando módulo...</p>
      </div>
    </div>

  </q-page>
</template>

<script setup>
import { ref, onBeforeUpdate, onMounted, nextTick } from 'vue'

import tabs_entity from 'src/pages/manage/tabs/tabs_entity.vue'

//Const REF
const showSpinner = ref(true)
//const toogleShow = ref(false)
const maxWaitTime = 5000 // 5 segundos máximo de espera
const startTime = Date.now()
const tabs_entity_ref = ref(null)
const domLoad = ref(false)

// ========================================
// FUNCIÓN PRINCIPAL: Verificar y ocultar spinner
// ========================================
const checkAndHideSpinner = async () => {
  // Si ya se ocultó, no hacer nada
  if (!showSpinner.value) return



  setTimeout(async () => {
    // Verificar si el componente hijo está disponible
    if (tabs_entity_ref.value) {
      // Componente listo: ocultar spinner con transición suave
      await nextTick() // Esperar un ciclo de renderizado para fluidez
      showSpinner.value = false
      return true
    }

    // Componente no listo: verificar timeout
    const elapsed = Date.now() - startTime
    if (elapsed >= maxWaitTime) {
      console.warn('⚠️ Timeout: El componente no se cargó en el tiempo esperado')
      showSpinner.value = false // Forzar ocultar para no bloquear al usuario
      domLoad.value = true
      return false
    }

  }, 1500);

  // 🔄 Reintentar en el próximo ciclo
  return false
}

// Cuando quieras llamar a la función:
const callEmptySelected = () => {
  if (tabs_entity_ref.value) {
    tabs_entity_ref.value.EmptySelected()
  } else {
    // Opcional: reintenta después de un pequeño retraso
    setTimeout(() => {
      if (tabs_entity_ref.value) {
        tabs_entity_ref.value.EmptySelected()
      } else {
        console.warn('La referencia tabs_entity_ref aún no está disponible')
      }
    }, 3000)
  }
}

onBeforeUpdate(() => {
  callEmptySelected()
  //SendItemChildren(objetLoad.value)
})

onMounted(() => {
  LoadDOM()
})

const LoadDOM = async () => {
  // Pequeño delay inicial para permitir que Vue monte el hijo
  await nextTick()
  // Intento inmediato
  if (await checkAndHideSpinner()) return

  // Si no está listo, usar polling suave con requestAnimationFrame
  const poll = () => {
    if (showSpinner.value) {
      checkAndHideSpinner().then((success) => {
        if (!success && showSpinner.value) {
          requestAnimationFrame(poll) // Reintentar en el próximo frame
        }
      })
    }
  }

  /* LoadDOM() */
  poll()
}

const objetLoad = ref({})

// Función que deseas llamar desde fuera
const CheckItemChildren = async (item = null) => {
  if (item.idPadre !== '') {
    objetLoad.value = item
  }
}

defineExpose({
  CheckItemChildren,
})

</script>

<style lang="sass" scoped>
.loading-overlay
  background: rgba(255, 255, 255, 0.95)
  z-index: 1000
  transition: opacity 0.3s ease, visibility 0.3s ease
  opacity: 1
  visibility: visible

  &.fade-out
    opacity: 0
    visibility: hidden
    pointer-events: none

// Opcional: efecto de entrada suave al spinner
.q-spinner-dots
  animation: pulse 1.5s infinite ease-in-out

@keyframes pulse
  0%, 100%
    transform: scale(1)
  50%
    transform: scale(1.1)
</style>
