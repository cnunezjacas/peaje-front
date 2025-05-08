<template>
  <div class="text-uppercase small-font">
    <q-list padding class="rounded-borders text-white">
      <div v-for="(item, index) in menuItems" :key="index">
        <q-item
          clickable
          active-class="my-menu-link"
          v-ripple
          :active="link === item.id"
          @click="handleItemClick(item)"
        >
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
        <!-- Renderizar subitems si está expandido -->
        <q-list v-if="item.children && item.children.length && isExpanded(item)">
          <q-item
            v-for="(child, cIndex) in item.children"
            :key="cIndex"
            clickable
            v-ripple
            class="itemsChildrens"
            active-class="my-menu-link"
            :active="link === child.id"
            @click="link = child.id"
            @click.stop="handleChildClick(child)"
          >
            <q-item-section avatar>
              <q-icon :name="child.icon" />
            </q-item-section>
            <q-item-section>{{ child.label }}</q-item-section>
          </q-item>
        </q-list>
      </div>
    </q-list>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export default {
  props: {
    menuItems: {
      type: Array,
      required: true,
    },
  },
  setup() {
    const router = useRouter()
    const link = ref('inbox')
    // Estado para rastrear qué elementos están expandido
    const expandedItems = ref(new Set())

    const handleItemClick = (item) => {
      if (item.children && item.children.length) {
        toggleExpand(item)
      } else {
        link.value = item.id
        // Si 'item.id' es un ID y necesitas construir la ruta, haz algo como:
        router.replace('/' + item.id)
        //router.push({ path: '/' + item.id })
      }
    }

    const handleChildClick = (child) => {
      link.value = child.id
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
      link,
      handleItemClick,
      handleChildClick,
      toggleExpand,
      isExpanded,
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
</style>
