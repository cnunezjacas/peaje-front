<!-- treeItems.vue -->
<template>
  <div>
    <!-- Nodo con hijos (expansible) -->
    <q-expansion-item
      v-if="hasChildren"
      :label="item.label"
      :icon="item.icon"
      :default-expanded="expanded"
      @update:expanded="expanded = $event"
      expand-separator
      @click.stop="handleClick"
    >
      <template v-slot:default>
        <TreeItem
          v-for="child in item.children"
          :key="child.id"
          :item="child"
          @navigate="handleNavigate"
        />
      </template>
    </q-expansion-item>

    <!-- Nodo sin hijos, navega al hacer clic -->
    <q-item v-else clickable @click="navigateTo(item.id)">
      <q-item-section avatar>
        <q-icon :name="item.icon" />
      </q-item-section>
      <q-item-section>
        {{ item.label }}
      </q-item-section>
    </q-item>
  </div>
  <gestGlobal ref="gestGlobalRef" style="display: none" />
</template>

<script setup>
import { defineProps, defineEmits, ref } from 'vue'

// Para evitar conflictos con componente hijo, usar mayúscula en la importación
import TreeItem from 'layouts/treeItems.vue'
import gestGlobal from 'viewsManage/gest_global.vue'

const props = defineProps({
  item: Object,
})

const gestGlobalRef = ref(null)

const emit = defineEmits(['navigate'])

const hasChildren = props.item.children && props.item.children.length > 0
const expanded = ref(false)

// Función para manejar la expansión y navegación
function handleClick() {
  if (hasChildren) {
    expanded.value = !expanded.value
  } else {
    gestGlobalRef.value.CheckItemChildren(props.item)
    navigateTo(props.item.id)
  }
}

// Función para realizar la navegación
function navigateTo(id) {
  emit('navigate', id)
}

// Cuando se recibe la señal de navegación, navegamos en el componente padre
function handleNavigate(id) {
  emit('navigate', id)
}
</script>
