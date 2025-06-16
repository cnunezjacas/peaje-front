<template>
  <div>
    <q-item
      clickable
      :active="isActiveItem(item)"
      active-class="my-menu-link"
      @click="handleItemClick"
      v-ripple
    >
      <q-item-section avatar>
        <q-icon :name="item.icon" />
      </q-item-section>
      <q-item-section>
        <div style="display: flex; align-items: center; justify-content: space-between">
          {{ item.label }}
          <!-- Mostrar icono de expandir si tiene hijos -->
          <q-icon
            v-if="hasChildren"
            :name="isExpanded ? 'expand_less' : 'expand_more'"
            @click.stop="toggleExpand"
            style="cursor: pointer"
          />
        </div>
      </q-item-section>
    </q-item>
    <!-- Renderizar hijos recursivamente -->
    <transition name="accordion">
      <q-list v-if="hasChildren && isExpanded" class="collapse-list" style="padding-left: 20px">
        <MenuItems
          v-for="child in item.children"
          :key="child.id"
          :item="child"
          @item-clicked="forwardItemClick"
        />
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
  },
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
const isActiveItem = (item) => {
  //console.log(route.path)
  return route.path === '/' + item.id
}

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
</script>

<style lang="sass">
.my-menu-link
  color: green
  background: white
  margin-left: -30px
  padding-left:60px

  .small-font
  font-size: 11px
  font-weight: bold

/* estilos para la transición */
.accordion-enter-active,
.accordion-leave-active
  transition: max-height 0.3s ease, opacity 0.3s ease
  overflow: hidden

.accordion-enter-from,
.accordion-leave-to
  max-height: 0
  opacity: 0

.accordion-enter-to,
.accordion-leave-from
  max-height: 500px
  opacity: 1

.collapse-list
  overflow: hidden
</style>
