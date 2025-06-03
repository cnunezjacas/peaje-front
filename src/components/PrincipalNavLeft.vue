<template>
  <div class="text-uppercase small-font">
    <q-list padding class="rounded-borders text-white">
      <div v-for="(item, index) in menuItems" :key="index">
        <q-item clickable active-class="my-menu-link" v-ripple @click="() => handleItemClick(item)">
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
                @click.stop="() => toggleExpand(item)"
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
</template>

<script>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

export default {
  props: {
    menuItems: {
      type: Array,
      required: true,
    },
  },
  setup() {
    const router = useRouter()
    const route = useRoute()
    // Eliminamos link, ya que usaremos route para determinar la selección
    // const link = ref('inbox') // no necesario ahora

    const expandedItems = ref(new Set())

    // Función para determinar si un item está activo basado en la ruta
    const isActiveItem = (item) => {
      // Asumiendo que la ruta se construye con '/' + item.id
      return route.path === '/' + item.id
    }

    const handleItemClick = (item) => {
      if (item.children && item.children.length) {
        toggleExpand(item)
      } else {
        // router.replace también funciona, pero usualmente router.push es mejor para navegación
        router.push('/' + item.id)
      }
    }

    const handleChildClick = (child) => {
      router.push('/' + child.id)
    }

    const toggleExpand = (item) => {
      if (expandedItems.value.has(item)) {
        expandedItems.value.delete(item)
      } else {
        expandedItems.value.add(item)
      }
    }

    const isExpanded = (item) => {
      return expandedItems.value.has(item)
    }

    return {
      // link: no necesario
      handleItemClick,
      handleChildClick,
      toggleExpand,
      isExpanded,
      isActiveItem,
    }
  },
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
