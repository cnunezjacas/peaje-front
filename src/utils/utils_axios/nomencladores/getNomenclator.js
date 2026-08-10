import { useApi } from 'src/composables/useApi'
import { STRINGS } from 'src/utils/string'
import { useNotify } from 'src/utils/notify/notify.js'

/* =================================================== */
/*  ===== DECLARACIONES REF ===== */
/* =================================================== */
const { /*notify_success,*/ notify_warning /*, notify_error*/ } = useNotify()

const { fetchData /*, postData, putData, deleteData */ } = useApi()

const loadOrganismo = async () => {
  const response = await fetchData(STRINGS.urlApiOrganismo)
  const options = response.data.map((element) => ({
    label: element['siglas'],
    value: element['_id'],
  }))
  return options
}

const loadProvincias = async () => {
  const response = await fetchData(STRINGS.urlApiProvincia)
  const options = response.data.map((element) => ({
    label: element['nombre'],
    value: element['_id'],
  }))
  return options
}

const loadCoins = async () => {
  const response = await fetchData(STRINGS.urlApiMoneda)
  const options = response.data.map((element) => ({
    label: element['siglas'],
    value: element['_id'],
  }))
  return options
}

const loadMunicipios = async () => {
  const response = await fetchData(STRINGS.urlApiMunicipio)
  const options = response.data.map((element) => ({
    label: element['nombre'],
    value: element['_id'],
  }))
  return options
}

const loadBank = async () => {
  const response = await fetchData(STRINGS.urlApiBanco)
  const options = response.data.map((element) => ({
    label: element['codigo'],
    value: element['_id'],
  }))
  return options
}

const loadMunicipiosByProvincia = async (newVal, opcional = true) => {
  const response = await fetchData(STRINGS.urlApiMunicipio)

  const options = response.data
    .filter((item) => item['provincia'] === newVal.value)
    .map((element) => ({
      label: element['nombre'],
      value: element['_id'],
    }))

  if (opcional)
    if (options.length === 0) notify_warning(STRINGS.NoLoadMunicipality + ' ' + newVal.label)

  return options
}

export default {
  loadOrganismo,
  loadProvincias,
  loadMunicipios,
  loadMunicipiosByProvincia,
  loadCoins,
  loadBank,
}
