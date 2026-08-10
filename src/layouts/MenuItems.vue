<template>
  <div>
    <q-item clickable :header-inset-level="item.level" :content-inset-level="item.level" switch-toggle-side dense-toggle
      expand-separator :active="isActiveItem(item)" :class="activeClassList" @click="handleItemClick" v-ripple
      :style="getIndentStyle">
      <q-item-section avatar>
        <q-icon :name="item.icon" size='20px' />
      </q-item-section>
      <q-item-section>
        <div class="flex justify-between">
          {{ item.label }}
          <!-- Mostrar icono de expandir si tiene hijos -->
          <q-icon v-if="hasChildren" :name="isExpanded ? 'expand_less' : 'expand_more'" @click.stop="toggleExpand"
            style="cursor: pointer" />
        </div>
      </q-item-section>
    </q-item>
    <!-- Renderizar hijos recursivamente -->
    <transition name="accordion">
      <q-list v-if="hasChildren && isExpanded" class="collapse-list">
        <MenuItems v-for="child in item.children" :key="child.id" :item="child" @item-clicked="forwardItemClick"
          :nav-link-on="navLinkOn" />
      </q-list>
    </transition>
  </div>
  <!-- <gestGlobal ref="gestGlobalRef" style="display: none" /> -->
</template>

<script setup>

import { defineEmits, defineProps, ref, computed } from 'vue'
import { useRoute } from 'vue-router'
// import gestGlobal from 'viewsManage/gest_global.vue'
import MenuItems from './MenuItems.vue' // referencia recursiva


//const router = useRouter()
const route = useRoute()
// const gestGlobalRef = ref(null)

// Props
const props = defineProps({
  item: {
    type: Object,
    required: true,
  }, navLinkOn: { type: Boolean, default: false }  // ✅ Booleano
})


// 🔥 Computed para clases condicionales - VERSIÓN ROBUSTA
const activeClassList = computed(() => {
  const classes = []

  // 🔍 Debug del valor real
  const navLinkValue = props.navLinkOn

  // Normalizar: convertir string "true"/"false" a booleano
  const isNavLinkOn = navLinkValue === true || navLinkValue === 'true'

  // Clase base según estado activo
  if (isActiveItem(props.item)) {
    classes.push(isNavLinkOn ? 'aside-menu-link' : 'simple-menu-link')
  } else {
    // Item no activo: también aplicar clase base
    classes.push(isNavLinkOn ? 'aside-menu-item' : 'simple-menu-item')
  }


  return classes
})


// Emite evento cuando un item es clickeado
const emit = defineEmits(['item-clicked'])

const hasChildren = computed(() => props.item.children && props.item.children.length > 0)
const isExpanded = ref(false)

// Gestionar estado de expansión
const toggleExpand = () => {
  isExpanded.value = !isExpanded.value
}

// Función para determinar si un item está activo
const isActiveItem = (item) => route.path === '/' + item.id


// Cuando se hace clic en un elemento
const handleItemClick = () => {
  if (hasChildren.value) {
    toggleExpand()
  }
  emit('item-clicked', props.item)
}

// Para propagar el evento a componentes padres
const forwardItemClick = (childItem) => {
  emit('item-clicked', childItem)
}

const getIndentStyle = computed(() => {
  // Calculamos el padding-left en función del nivel
  const indentationPx = 20 // cantidad de px por nivel
  return {
    paddingLeft: `${(props.item.level || 1 - 1) * indentationPx}px`,
  }
})
</script>
