<template>
  <div class="text-uppercase small-font">
    <q-list padding class="rounded-borders text-white">
      <div v-for="(item, index) in menuItems" :key="index">
        <q-item clickable active-class="my-menu-link" v-ripple @click="handleItemClick(item)">
          <q-item-section avatar>
            <q-icon :name="item.icon" />
          </q-item-section>
          <q-item-section>
            <div style="display: flex; align-items: center; justify-content: space-between">
              {{ item.label }}
              <!-- Si tiene hijos, mostrar un ícono de expandir/contraer -->
              <q-icon
                v-if="item.children && item.children.length"
                :name="isExpanded(item) ? 'expand_less' : 'expand_more'"
                @click.stop="toggleExpand(item)"
                style="cursor: pointer"
              />
            </div>
          </q-item-section>
        </q-item>
        <!-- Renderizar subitems con transición de acordeón -->
        <transition name="accordion">
          <q-list
            v-if="item.children && item.children.length && isExpanded(item)"
            class="collapse-list"
          >
            <q-item
              v-for="(child, cIndex) in item.children"
              :key="cIndex"
              clickable
              v-ripple
              class="itemsChildrens"
              active-class="my-menu-link"
              :active="isActiveItem(child)"
              @click="() => handleChildClick(child)"
            >
              <q-item-section avatar>
                <q-icon :name="child.icon" />
              </q-item-section>
              <q-item-section>{{ child.label }}</q-item-section>
            </q-item>
          </q-list>
        </transition>
      </div>
    </q-list>
  </div>

  <gestGlobal ref="gestGlobalRef" style="display: none" />
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import gestGlobal from 'viewsManage/gest_global.vue'

// Props
defineProps({
  menuItems: {
    type: Array,
    required: true,
  },
})

// Refs y hooks
const router = useRouter()
const route = useRoute()
const expandedId = ref(null) // Usaremos un id único para identificar el item expandido

// Referencia al componente gestGlobal
const gestGlobalRef = ref(null)

// Conjunto para mantener los items expandidos
//const expandedItems = ref(new Set())
//const expandedItem = ref(null)

// Función para determinar si un item está activo
const isActiveItem = (item) => {
  //console.log(route.path)
  if (route.path === '/' + item.id) {
    gestGlobalRef.value.CheckItemChildren(route.path.split('/'))
    return route.path === '/' + item.id
  }
}

// Función para manejar clic en un item
const handleItemClick = (item) => {
  if (item.children && item.children.length) {
    gestGlobalRef.value.CheckItemFather(item)
    toggleExpand(item)
  } else {
    router.push('/' + item.id)
  }
}

// Función para manejar clic en un hijo
const handleChildClick = (child) => {
  //console.log('Entro en handleChildClick:')

  //console.log(child)
  router.push('/' + child.id)
}

// Función para expandir o colapsar un item
/*const toggleExpand = (item) => {
  if (expandedItems.value.has(item)) {
    expandedItems.value.delete(item)
  } else {
    expandedItems.value.add(item)
  }
}*/

// Función para expandir o colapsar un item
const toggleExpand = (item) => {
  if (isExpanded(item)) {
    expandedId.value = null
  } else {
    expandedId.value = item.id
  }
}

// Función para verificar si un item está expandido
/*const isExpanded = (item) => {
  return expandedItems.value.has(item)
}*/
// Función para verificar si un item está expandido
const isExpanded = (item) => {
  return expandedId.value === item.id
}
</script>

<style lang="sass">
.my-menu-link
  color: green
  background: white

.small-font
  font-size: 11px
  font-weight: bold

/* Estilos para la transición de acordeón */
.accordion-enter-active,
.accordion-leave-active
  transition: max-height 0.3s ease, opacity 0.3s ease
  overflow: hidden

/* Estado inicial al entrar (colapsado) */
.accordion-enter-from,
.accordion-leave-to
  max-height: 0
  opacity: 0

/* Estado final al terminar la entrada (expandido) */
.accordion-enter-to,
.accordion-leave-from
  max-height: 500px  /* ajusta según la cantidad de contenido */
  opacity: 1

/* Estilo para la lista colapsada */
.collapse-list
  overflow: hidden

/* estilos adicionales si quieres ajustar el estilo de los items hijos */
.itemsChildrens
  padding-left: 50px
</style>
