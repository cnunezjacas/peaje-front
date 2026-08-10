<template>
  <div class="">
    <q-dialog v-model="dialog" persistent ref="refDialogoAdd" :backdrop-filter="backdropFilter">
      <q-card class="my-dialog-card">
        <q-card-section class="row items-center text-white q-pb-none text-h6 bg-green-5 q-pa-md">
          <span class="icon-text q-mx-sm">
            <q-icon name="receipt_long" />
          </span>
          <span class="icon-text">{{ STRINGS.details.toUpperCase() }}</span>
        </q-card-section>

        <!-- 🔥 CORREGIDO: q-table con array y fields como strings -->
        <q-table flat bordered title="Detalles de Estación" dense :rows="rows" :columns="columns" row-key="_id" />

        <q-card-section>
          <div class="flex justify-end">
            <q-btn flat icon="close" :label="STRINGS.close" @click="Reset" color="dark" v-close-popup />
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { STRINGS } from 'utils/string.js'

const dialog = ref(false)
const backdropFilter = ref(STRINGS.OpacityDialog)
const list = STRINGS.OpacityDialog

// 🔥 rows debe ser un ARRAY, no un objeto
const rows = ref([])

// 🔥 field debe ser STRING con el nombre del campo, NO el valor
const columns = [
  {
    name: 'nombre',
    required: true,
    label: STRINGS.nombre_estacion,  // Usa tu STRINGS
    align: STRINGS.TableAlign,
    field: 'nombre',  // 👈 STRING, no rows.value.nombre
    sortable: true,
  },
  {
    name: 'codigo',
    align: STRINGS.TableAlign,
    label: STRINGS.codigo_estacion,
    field: 'codigo',  // 👈 STRING
    sortable: true,
  },
  {
    name: 'direccion',
    align: STRINGS.TableAlign,
    label: STRINGS.direccion_estacion,
    field: 'direccion',
    sortable: true,
  },
  {
    name: 'provincia',
    align: STRINGS.TableAlign,
    label: STRINGS.province,
    field: 'provincia',
    sortable: true,
  },
  {
    name: 'municipio',
    align: STRINGS.TableAlign,
    label: 'Municipio',
    field: 'municipio',
    sortable: true,
  },
  {
    name: 'nit',
    align: STRINGS.TableAlign,
    label: STRINGS.NIT_estacion,
    field: 'nit',
    sortable: true,
  },
  {
    name: 'telefonos',
    align: STRINGS.TableAlign,
    label: 'Teléfonos',
    field: 'telefonos',
    sortable: true,
    // 👇 Formatear array como string
    format: (val) => Array.isArray(val) ? val.join(', ') : val,
  },
]

/*Función que levanta el dialogo*/
const getUpDialogDetails = async (row) => {
  console.log('📦 Row recibido:', row)

  // 🔥 CLAVE: Envolver el objeto en un array para q-table
  rows.value = row ? [row] : []

  backdropFilter.value = list
  dialog.value = true
}

const Reset = () => {
  dialog.value = false
  rows.value = []  // Limpiar al cerrar
}

defineExpose({
  getUpDialogDetails,
})
</script>
