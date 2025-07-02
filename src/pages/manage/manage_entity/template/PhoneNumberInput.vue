<template>
  <div class="border-box-bank">
    <div class="row">
      <div v-for="phone in phones" :key="phone.id" class="col-9 q-mb-md">
        <q-input
          v-model="phone.number"
          color="green"
          label="Teléfono"
          :disable="disabledInput"
          type="tel"
          :rules="validaciones_generales.rulesPhone"
        />
      </div>
      <div class="col-2 row flex justify-between">
        <div>
          <q-btn
            color="green-5"
            title="Añadir"
            v-show="btnAddShow"
            size="10px"
            flat
            round
            icon="add"
            @click="addPhone"
          />

          <q-btn
            color="green-5"
            title="Guardar"
            v-show="!btnAddShow"
            :disable="checkStatusInputs()"
            size="10px"
            flat
            round
            icon="save"
            @click="SavePhone"
          />
        </div>

        <!-- Botón para eliminar -->
        <div>
          <q-btn
            icon="delete"
            color="negative"
            title="Eliminar"
            v-if="phones.length > 1"
            flat
            size="10px"
            style="top: -15px"
            round
            @click="removePhone()"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import validaciones_generales from 'src/utils/validaciones_generales'
import { ref } from 'vue'

// Lista reactiva de teléfonos, cada uno con un id único
const phones = ref([{ id: Date.now(), number: '' }])
const btnAddShow = ref(false)
const disabledInput = ref(false)

const emit = defineEmits(['UpdatePhone'])

// Función para agregar un nuevo teléfono
function addPhone() {
  const newPhone = { id: Date.now() + Math.random(), number: '' }
  phones.value.push(newPhone)
  btnAddShow.value = !btnAddShow.value
  disabledInput.value = false
  emit(
    'UpdatePhone',
    phones.value.map((p) => p.number),
  )
}

function SavePhone() {
  btnAddShow.value = !btnAddShow.value
  disabledInput.value = true
  emit(
    'UpdatePhone',
    phones.value.map((p) => p.number),
  )
}

// Función para eliminar el último teléfono agregado
function removePhone() {
  if (phones.value.length > 1) {
    phones.value.pop()
    disabledInput.value = false
    btnAddShow.value = !btnAddShow.value
    emit('UpdatePhone', PhoneObjetToArray())
  }
}

function PhoneObjetToArray() {
  return phones.value.map((p) => p.number)
}

const getPhone = () => {
  let numberPhone = PhoneObjetToArray()
  let stringPhones = numberPhone.join('/')

  if (stringPhones.endsWith('/')) {
    stringPhones = stringPhones.slice(0, -1)
  }
  console.log('stringPhones:', stringPhones)
  return stringPhones
}

function checkStatusInputs() {
  let numberPhone = PhoneObjetToArray()
  return numberPhone[numberPhone.length - 1] !== '' ? false : true
}

defineExpose({
  getPhone,
})
</script>
